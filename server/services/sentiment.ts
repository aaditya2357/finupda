import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY || '';
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in environment variables');
}
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Analyze sentiment of financial text
 * This is a basic version using Gemini API
 * In production, this would use Google Cloud Natural Language API
 */
export async function analyzeSentiment(text: string): Promise<{
  score: number;
  magnitude: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}> {
  let retries = 0;
  const maxRetries = 3;
  const baseDelay = 2000; // Start with 2 seconds delay
  
  // If API key is missing, immediately use fallback
  if (!API_KEY) {
    console.log("No GEMINI_API_KEY provided, using fallback sentiment analysis");
    return analyzeSentimentFallback(text);
  }
  
  while (retries <= maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const prompt = `Analyze the sentiment of this financial text: "${text}"
      
      Return only a valid JSON object with the following structure:
      {
        "score": a number from -1 (very negative) to 1 (very positive) representing sentiment,
        "magnitude": a number from 0 to 1 representing sentiment strength,
        "sentiment": one of "positive", "negative", or "neutral" string value
      }
      
      Look for emotional bias in financial decisions. Determine if the person seems fearful, greedy, or neutral.
      Only return the JSON object without any additional text.`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response, handling markdown code blocks if present
      try {
        // Extract JSON from markdown code blocks if present
        let jsonText = response;
        
        // Check if response is wrapped in markdown code blocks (```json ... ```)
        const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1];
          console.log('Extracted JSON from markdown code block');
        }
        
        const parsed = JSON.parse(jsonText);
        
        // Validate the response structure
        if (typeof parsed.score !== 'number' || typeof parsed.magnitude !== 'number' || !parsed.sentiment) {
          throw new Error('Invalid response structure');
        }
        
        // Normalize values to expected ranges
        return {
          score: Math.max(-1, Math.min(1, parsed.score)),
          magnitude: Math.max(0, Math.min(1, parsed.magnitude)),
          sentiment: parsed.sentiment as 'positive' | 'negative' | 'neutral'
        };
      } catch (e) {
        console.error('Error parsing sentiment analysis response:', e);
        // Use more advanced fallback
        return analyzeSentimentFallback(text);
      }
    } catch (error: any) {
      console.error('Error analyzing sentiment:', error);
      
      // Check if error is due to rate limiting (429)
      if (error.status === 429 && retries < maxRetries) {
        retries++;
        
        // Get retry delay from error response or use exponential backoff
        let retryDelay = baseDelay * Math.pow(2, retries);
        
        // Try to extract Google's suggested retry delay if available
        if (error.errorDetails && 
            error.errorDetails.some((detail: any) => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')) {
          const retryInfo = error.errorDetails.find(
            (detail: any) => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          );
          if (retryInfo && retryInfo.retryDelay) {
            // Parse the retry delay, format is like '10s'
            const googleRetryDelay = parseInt(retryInfo.retryDelay.replace(/\D/g, '')) * 1000 || 0;
            if (googleRetryDelay > 0) {
              retryDelay = Math.max(retryDelay, googleRetryDelay);
            }
          }
        }
        
        console.log(`Rate limited. Retrying sentiment analysis in ${retryDelay/1000} seconds... (Attempt ${retries} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If we've exhausted retries or it's another type of error, use fallback
      console.log("API error or retries exhausted, using fallback sentiment analysis");
      return analyzeSentimentFallback(text);
    }
  }
  
  // If we've exhausted all retries, use fallback
  console.log("Maximum retries reached, using fallback sentiment analysis");
  return analyzeSentimentFallback(text);
}

/**
 * Advanced fallback sentiment analyzer for when Gemini API is unavailable
 * Uses a rule-based approach with financial term dictionaries
 */
function analyzeSentimentFallback(text: string): {
  score: number;
  magnitude: number;
  sentiment: 'positive' | 'negative' | 'neutral';
} {
  console.log("Using fallback sentiment analysis for:", text.substring(0, 50) + (text.length > 50 ? '...' : ''));
  
  // Financial term dictionaries with weighted sentiment scores
  const sentimentTerms: Record<string, number> = {
    // Strongly positive terms (0.8 - 1.0)
    'soar': 0.9,
    'surge': 0.9, 
    'skyrocket': 1.0,
    'bull market': 0.8,
    'tremendous growth': 0.9,
    'exceptional performance': 0.9,
    'breakthrough': 0.8,
    
    // Moderately positive terms (0.4 - 0.7)
    'growth': 0.5,
    'profit': 0.6,
    'gain': 0.5,
    'increase': 0.4,
    'bullish': 0.6,
    'upward': 0.4,
    'rise': 0.4,
    'rising': 0.4,
    'outperform': 0.7,
    'exceed expectations': 0.7,
    'opportunity': 0.6,
    'upside': 0.5,
    'recovery': 0.5,
    
    // Slightly positive terms (0.1 - 0.3)
    'stable': 0.3,
    'steady': 0.3,
    'potential': 0.2,
    'improve': 0.3,
    'promising': 0.3,
    'upgrade': 0.3,
    
    // Strongly negative terms (-0.8 to -1.0)
    'crash': -0.9,
    'collapse': -0.9,
    'plummet': -1.0,
    'bear market': -0.8,
    'catastrophic': -1.0,
    'bankruptcy': -1.0,
    'default': -0.8,
    
    // Moderately negative terms (-0.4 to -0.7)
    'loss': -0.6,
    'debt': -0.5,
    'decline': -0.5,
    'decrease': -0.4,
    'bearish': -0.6,
    'downward': -0.4,
    'fall': -0.4,
    'falling': -0.4,
    'underperform': -0.7,
    'miss expectations': -0.7,
    'risk': -0.5,
    'downside': -0.5,
    'recession': -0.7,
    
    // Slightly negative terms (-0.1 to -0.3)
    'cautious': -0.2,
    'uncertain': -0.3,
    'slowdown': -0.3,
    'concern': -0.3,
    'challenge': -0.2,
    'downgrade': -0.3,
    
    // Emotional terms
    'fear': -0.7,
    'worried': -0.6,
    'anxiety': -0.6,
    'panic': -0.8,
    'excited': 0.7,
    'enthusiastic': 0.7,
    'confident': 0.6,
    'optimistic': 0.6,
    'greedy': -0.2,  // Greed is slightly negative in financial context
    'fomo': -0.3,    // Fear of missing out is slightly negative
  };

  // Convert text to lowercase for matching
  const lowerText = text.toLowerCase();
  
  // Calculate sentiment score based on term matches
  let totalScore = 0;
  let matchCount = 0;
  let strongestPositive = 0;
  let strongestNegative = 0;
  
  // Find all matching terms and their sentiment values
  Object.entries(sentimentTerms).forEach(([term, value]) => {
    // Use regex to match whole words only
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = lowerText.match(regex);
    
    if (matches) {
      const count = matches.length;
      totalScore += value * count;
      matchCount += count;
      
      // Track strongest sentiment found
      if (value > 0 && value > strongestPositive) {
        strongestPositive = value;
      } else if (value < 0 && value < strongestNegative) {
        strongestNegative = value;
      }
    }
  });
  
  // Calculate final score (-1 to 1)
  let score = 0;
  if (matchCount > 0) {
    score = totalScore / matchCount;
  }
  
  // Calculate magnitude (0 to 1) based on strength of sentiment
  // Higher magnitude for texts with both strong positive and negative terms
  const magnitude = Math.min(1, Math.abs(score) * 0.7 + Math.abs(strongestPositive - strongestNegative) * 0.3);
  
  // Determine sentiment category
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (score > 0.15) {
    sentiment = 'positive';
  } else if (score < -0.15) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  console.log('Fallback sentiment analysis result:', { 
    score: parseFloat(score.toFixed(2)), 
    magnitude: parseFloat(magnitude.toFixed(2)), 
    sentiment,
    matchCount,
    uniqueTermsFound: matchCount
  });
  
  return { 
    score: parseFloat(score.toFixed(2)), 
    magnitude: parseFloat(magnitude.toFixed(2)), 
    sentiment 
  };
}
