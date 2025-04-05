import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY || '';
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in environment variables');
}
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Interface for chat history
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate response from Gemini API
 */
export async function generateGeminiResponse(
  message: string,
  history: ChatMessage[] = [],
  language: string = 'english'
): Promise<string> {
  let retries = 0;
  const maxRetries = 3;
  const baseDelay = 2000; // Start with 2 seconds delay
  
  // If API key is missing, immediately use fallback
  if (!API_KEY) {
    console.log("No GEMINI_API_KEY provided, using fallback response generation");
    return generateFallbackResponse(message, history, language);
  }
  
  while (retries <= maxRetries) {
    try {
      // Get Gemini Pro model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      // Create chat instance with history
      const chat = model.startChat({
        safetySettings,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
        history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });
      
      // Create system prompt for financial advisor
      const systemPrompt = `You are FinAI, an AI-powered financial assistant for Indian users. 
      You provide accurate, personalized financial advice based on Indian markets and regulations.
      You're knowledgeable about stocks, mutual funds, insurance, retirement planning, and tax optimization in India.
      You always provide balanced advice, considering both risks and rewards.
      You cite credible sources when appropriate. If you're unsure, you admit it rather than providing potentially incorrect information.
      You avoid making specific stock predictions or guarantees about future returns.
      
      The user's preferred language is ${language}. If it's not English, try to respond in that language.
      
      Current date: ${new Date().toLocaleDateString()}`;
      
      // Send message to Gemini
      const result = await chat.sendMessage(`${systemPrompt}\n\nUser message: ${message}`);
      const response = result.response.text();
      
      return response;
    } catch (error: any) {
      console.error('Error generating response from Gemini:', error);
      
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
        
        console.log(`Rate limited. Retrying in ${retryDelay/1000} seconds... (Attempt ${retries} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If we've exhausted retries or it's another type of error, use fallback
      console.log("API error or retries exhausted, using fallback response generation");
      return generateFallbackResponse(message, history, language);
    }
  }
  
  // If we've exhausted all retries, use fallback
  console.log("Maximum retries reached, using fallback response generation");
  return generateFallbackResponse(message, history, language);
}

/**
 * Fallback response generator when Gemini API is unavailable
 * Uses predefined responses for common financial questions
 */
function generateFallbackResponse(
  message: string,
  history: ChatMessage[] = [],
  language: string = 'english'
): string {
  console.log("Using fallback response generation for:", message.substring(0, 50) + (message.length > 50 ? '...' : ''));
  
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Predefined responses for common financial questions
  const englishResponses: Record<string, string> = {
    "what is mutual fund": "A mutual fund is an investment vehicle that pools money from multiple investors to purchase securities like stocks and bonds. It's managed by professional fund managers who allocate assets to try to produce income or capital gains for the fund's investors. Mutual funds offer benefits like diversification, professional management, and liquidity. In India, you can start investing in mutual funds with as little as ₹500 per month through a Systematic Investment Plan (SIP).",
    
    "how to invest": "To start investing in India, follow these steps:\n\n1. Set clear financial goals and timeframes\n2. Build an emergency fund first (3-6 months of expenses)\n3. Choose investments based on your risk tolerance and time horizon\n4. Consider starting with:\n   - Mutual funds through SIPs\n   - Public Provident Fund (PPF) for tax benefits\n   - Fixed deposits for stability\n5. Diversify your investments across asset classes\n6. Review and rebalance your portfolio periodically\n\nConsider consulting with a financial advisor for personalized guidance.",
    
    "best investment": "There's no single 'best' investment as it depends on your goals, risk tolerance, and time horizon. Here are some popular options in India:\n\n- Equity mutual funds: For long-term growth (5+ years)\n- PPF/EPF: For tax benefits and steady returns\n- Fixed deposits: For capital preservation and regular income\n- Government bonds: For stability and regular interest\n- National Pension System (NPS): For retirement planning\n- Real estate: For long-term appreciation and rental income\n\nA balanced portfolio typically includes a mix of these based on your personal financial situation.",
    
    "tax saving": "In India, you can save taxes through various investment options under Section 80C of the Income Tax Act (up to ₹1.5 lakh deduction):\n\n- Equity-Linked Saving Schemes (ELSS): Mutual funds with 3-year lock-in\n- Public Provident Fund (PPF): 15-year investment with tax-free returns\n- National Pension System (NPS): Additional ₹50,000 deduction under 80CCD(1B)\n- Tax-saving Fixed Deposits: 5-year lock-in period\n- Life Insurance Premiums\n- Health Insurance Premiums (Section 80D)\n- Home Loan Principal (Section 80C) and Interest (Section 24)\n\nConsider your overall financial plan when choosing tax-saving investments, not just the tax benefits.",
    
    "stock market": "The Indian stock market consists primarily of the BSE (Bombay Stock Exchange) and NSE (National Stock Exchange). To invest in stocks:\n\n1. Open a demat and trading account with a broker\n2. Complete KYC verification\n3. Transfer funds to your trading account\n4. Research companies before investing\n5. Consider starting with blue-chip companies or index funds\n\nStock investments carry higher risk but potentially higher returns compared to fixed-income options. For beginners, index funds or ETFs that track market indices like Nifty 50 or Sensex are often recommended as they provide diversification.",
    
    "retirement planning": "Effective retirement planning in India includes:\n\n1. Start early to benefit from compounding\n2. Calculate your retirement corpus based on:\n   - Current expenses\n   - Inflation (typically 6-7% in India)\n   - Expected retirement age\n   - Life expectancy\n3. Invest in a mix of:\n   - National Pension System (NPS)\n   - Public Provident Fund (PPF)\n   - Equity mutual funds for long-term growth\n   - Fixed deposits and government schemes\n4. Consider health insurance and medical costs\n5. Review and adjust your plan every few years\n\nThe power of compounding makes a significant difference—starting in your 20s or 30s requires much smaller monthly investments than starting in your 40s.",
    
    "health insurance": "Health insurance is crucial for financial planning in India. When choosing a policy:\n\n1. Coverage: Aim for at least ₹5-10 lakh per person\n2. Family floater vs. Individual plans: Family floaters are cost-effective for young families\n3. Network hospitals: Check if your preferred hospitals are covered\n4. Pre-existing conditions: Understand waiting periods\n5. Claim settlement ratio: Check insurer's track record\n6. Additional coverage: Look for features like maternity benefits, OPD coverage, etc.\n\nHealth insurance premiums also offer tax benefits under Section 80D of the Income Tax Act.",
  };
  
  // Hindi responses for common financial questions
  const hindiResponses: Record<string, string> = {
    "what is mutual fund": "म्यूचुअल फंड एक ऐसा निवेश माध्यम है जो कई निवेशकों से पैसा जुटाकर शेयर और बॉन्ड जैसी प्रतिभूतियों को खरीदता है। इसे पेशेवर फंड मैनेजर द्वारा प्रबंधित किया जाता है। म्यूचुअल फंड विविधीकरण, पेशेवर प्रबंधन और तरलता जैसे लाभ प्रदान करते हैं। भारत में, आप सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) के माध्यम से प्रति माह केवल ₹500 से म्यूचुअल फंड में निवेश शुरू कर सकते हैं।",
    
    "how to invest": "भारत में निवेश शुरू करने के लिए इन चरणों का पालन करें:\n\n1. स्पष्ट वित्तीय लक्ष्य और समय सीमा निर्धारित करें\n2. पहले आपातकालीन फंड बनाएं (3-6 महीने के खर्च)\n3. अपने जोखिम सहनशीलता और समय सीमा के आधार पर निवेश चुनें\n4. इनसे शुरुआत करने पर विचार करें:\n   - SIP के माध्यम से म्यूचुअल फंड\n   - कर लाभ के लिए पब्लिक प्रोविडेंट फंड (PPF)\n   - स्थिरता के लिए फिक्स्ड डिपॉजिट\n5. विभिन्न प्रकार के निवेशों में अपना पैसा बांटें\n6. समय-समय पर अपने पोर्टफोलियो की समीक्षा करें\n\nव्यक्तिगत मार्गदर्शन के लिए वित्तीय सलाहकार से परामर्श पर विचार करें।",
  };
  
  // Check if we need to respond in Hindi
  const responseMap = language.toLowerCase().includes('hindi') ? hindiResponses : englishResponses;
  
  // Try to find the best matching predefined response
  for (const [key, response] of Object.entries(responseMap)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Generic responses based on detected intent
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi ") || lowerMessage.includes("namaste")) {
    return language.toLowerCase().includes('hindi') 
      ? "नमस्ते! मैं FinAI हूं, आपका वित्तीय सहायक। मैं आपके वित्तीय प्रश्नों का उत्तर देने या निवेश सलाह देने में मदद कर सकता हूं। मैं आपकी कैसे सहायता कर सकता हूं?"
      : "Hello! I'm FinAI, your financial assistant. I can help answer your financial questions or provide investment advice. How can I assist you today?";
  }
  
  if (lowerMessage.includes("thank")) {
    return language.toLowerCase().includes('hindi')
      ? "आपका स्वागत है! यदि आपके पास कोई अन्य प्रश्न हैं, तो बेझिझक पूछें।"
      : "You're welcome! If you have any other questions, feel free to ask.";
  }
  
  // Detect if message is about specific investments
  if (lowerMessage.includes("stock") || lowerMessage.includes("share")) {
    return language.toLowerCase().includes('hindi')
      ? "स्टॉक मार्केट में निवेश जोखिम भरा हो सकता है। सामान्य सलाह के रूप में, अपना शोध करें, विविधीकरण करें, और केवल वह राशि निवेश करें जिसे आप खोने का जोखिम उठा सकते हैं। क्या आप किसी विशिष्ट कंपनी या सेक्टर के बारे में पूछना चाहते हैं?"
      : "Investing in the stock market can be risky. As general advice, do your research, diversify, and only invest an amount you can afford to lose. Did you want to ask about a specific company or sector?";
  }
  
  if (lowerMessage.includes("mutual fund") || lowerMessage.includes("sip")) {
    return language.toLowerCase().includes('hindi')
      ? "म्यूचुअल फंड निवेश का एक लोकप्रिय तरीका हैं। SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) के माध्यम से नियमित रूप से निवेश करना औसत लागत लाभ प्रदान करता है। क्या आप किसी विशेष प्रकार के फंड के बारे में जानना चाहते हैं, जैसे इक्विटी, डेट, या हाइब्रिड?"
      : "Mutual funds are a popular way to invest. Investing regularly through SIPs (Systematic Investment Plans) provides cost averaging benefits. Would you like to know about a specific type of fund, such as equity, debt, or hybrid?";
  }
  
  // Default response when no specific intent is detected
  return language.toLowerCase().includes('hindi')
    ? "मुझे खेद है, मैं वर्तमान में इस प्रश्न का विस्तृत उत्तर नहीं दे सकता। क्या आप अपना प्रश्न दोबारा पूछ सकते हैं या अधिक जानकारी प्रदान कर सकते हैं? मैं निवेश विकल्पों, बचत रणनीतियों, या वित्तीय योजना के बारे में बुनियादी मार्गदर्शन प्रदान कर सकता हूं।"
    : "I'm sorry, I cannot provide a detailed answer to this question at the moment. Could you rephrase your question or provide more information? I can provide basic guidance on investment options, saving strategies, or financial planning.";
}

/**
 * Get investment recommendations based on risk profile
 */
export async function getInvestmentRecommendations(
  riskProfile: string,
  investmentAmount: number = 0,
  goals: string[] = []
): Promise<any[]> {
  let retries = 0;
  const maxRetries = 3;
  const baseDelay = 2000; // Start with 2 seconds delay
  
  while (retries <= maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const prompt = `Generate personalized investment recommendations for an Indian investor with the following profile:
      - Risk profile: ${riskProfile}
      - Investment amount: ₹${investmentAmount || 'unspecified'}
      - Financial goals: ${goals.join(', ') || 'unspecified'}
      
      Generate 3-5 specific investment recommendations with the following JSON structure for each:
      {
        "name": "Investment name",
        "type": "stock/mutual_fund/etf/bond/other",
        "risk": "low/medium/high",
        "potentialReturn": percentage,
        "description": "Brief category and risk description",
        "rationale": "Why this is recommended"
      }
      
      Only respond with valid JSON array of recommendations. Do not include any introduction or conclusion text.`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      try {
        // Extract JSON from markdown code blocks if present
        let jsonText = response;
        
        // Check if response is wrapped in markdown code blocks (```json ... ```)
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1];
          console.log('Extracted JSON from markdown code block');
        }
        
        return JSON.parse(jsonText);
      } catch (e) {
        // If parsing fails, do more structured parsing
        const jsonPattern = /\[\s*{[\s\S]*}\s*\]/g;
        const match = response.match(jsonPattern);
        
        if (match) {
          return JSON.parse(match[0]);
        } else {
          throw new Error('Failed to parse recommendation response');
        }
      }
    } catch (error: any) {
      console.error('Error getting investment recommendations:', error);
      
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
            const googleRetryDelay = parseInt(retryInfo.retryDelay.replace('s', '')) * 1000;
            retryDelay = Math.max(retryDelay, googleRetryDelay);
          }
        }
        
        console.log(`Rate limited. Retrying in ${retryDelay/1000} seconds... (Attempt ${retries} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If we've exhausted retries or it's another type of error, throw it
      throw new Error('Failed to generate investment recommendations');
    }
  }
  
  // This should not be reached because of the throw in the catch block
  throw new Error('Failed to generate investment recommendations after maximum retries');
}

/**
 * Get educational content about financial topics
 */
export async function getEducationalContent(
  topic: string,
  difficulty: string,
  language: string = 'english'
): Promise<{
  title: string;
  content: string;
  keyPoints: string[];
}> {
  let retries = 0;
  const maxRetries = 3;
  const baseDelay = 2000; // Start with 2 seconds delay
  
  while (retries <= maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const prompt = `Generate educational content about "${topic}" for a ${difficulty} level user in ${language} language.
      Format your response as JSON with the following structure:
      {
        "title": "Engaging title for the topic",
        "content": "Detailed educational content about the topic",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"]
      }
      The content should be accurate, informative, and tailored to Indian financial context.
      Only return valid JSON without any introduction or conclusion.`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      try {
        // Extract JSON from markdown code blocks if present
        let jsonText = response;
        
        // Check if response is wrapped in markdown code blocks (```json ... ```)
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1];
          console.log('Extracted JSON from markdown code block');
        }
        
        return JSON.parse(jsonText);
      } catch (e) {
        console.error('Error parsing educational content response:', e);
        // If parsing fails, create a structured response
        return {
          title: `${topic} (${difficulty} level)`,
          content: response,
          keyPoints: ["Key information about this topic"]
        };
      }
    } catch (error: any) {
      console.error('Error getting educational content:', error);
      
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
            const googleRetryDelay = parseInt(retryInfo.retryDelay.replace('s', '')) * 1000;
            retryDelay = Math.max(retryDelay, googleRetryDelay);
          }
        }
        
        console.log(`Rate limited. Retrying in ${retryDelay/1000} seconds... (Attempt ${retries} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If we've exhausted retries or it's another type of error, throw it
      throw new Error('Failed to generate educational content');
    }
  }
  
  // This should not be reached because of the throw in the catch block
  throw new Error('Failed to generate educational content after maximum retries');
}

/**
 * Check if an investment opportunity is likely a scam
 */
export async function checkScam(description: string): Promise<{
  isScam: boolean;
  confidenceScore: number;
  explanation: string;
}> {
  let retries = 0;
  const maxRetries = 3;
  const baseDelay = 2000; // Start with 2 seconds delay
  
  while (retries <= maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const prompt = `Analyze this investment opportunity for potential red flags or signs of a scam:
      "${description}"
      
      Respond with a JSON object that includes:
      {
        "isScam": boolean indicating if this is likely a scam,
        "confidenceScore": number from 0 to 1 indicating confidence,
        "explanation": detailed explanation of why this is or isn't a scam
      }
      Only return valid JSON without any introduction or conclusion.`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      try {
        // Extract JSON from markdown code blocks if present
        let jsonText = response;
        
        // Check if response is wrapped in markdown code blocks (```json ... ```)
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1];
          console.log('Extracted JSON from markdown code block');
        }
        
        return JSON.parse(jsonText);
      } catch (e) {
        console.error('Error parsing scam check response:', e);
        // If parsing fails, create a default structured response
        return {
          isScam: description.includes('guarantee') || description.includes('guaranteed returns'),
          confidenceScore: 0.7,
          explanation: "Failed to parse response. Exercise caution with any investment that promises guaranteed returns or sounds too good to be true."
        };
      }
    } catch (error: any) {
      console.error('Error checking investment scam:', error);
      
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
            const googleRetryDelay = parseInt(retryInfo.retryDelay.replace('s', '')) * 1000;
            retryDelay = Math.max(retryDelay, googleRetryDelay);
          }
        }
        
        console.log(`Rate limited. Retrying in ${retryDelay/1000} seconds... (Attempt ${retries} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If we've exhausted retries or it's another type of error, throw it
      throw new Error('Failed to analyze investment opportunity');
    }
  }
  
  // This should not be reached because of the throw in the catch block
  throw new Error('Failed to analyze investment opportunity after maximum retries');
}
