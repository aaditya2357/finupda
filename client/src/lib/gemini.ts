import { apiRequest } from "./queryClient";

// Interface for chat message
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Interface for the chat options
export interface ChatOptions {
  history?: ChatMessage[];
  language?: string;
}

// Main function to send messages to Gemini API through our backend
export const sendMessage = async (
  message: string, 
  options: ChatOptions = {}
): Promise<string> => {
  try {
    const response = await apiRequest('POST', '/api/gemini/chat', {
      message,
      history: options.history || [],
      language: options.language || 'english'
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw new Error('Failed to get response from AI assistant');
  }
};

// Function to analyze financial text with sentiment analysis
export const analyzeSentiment = async (text: string): Promise<{
  score: number;
  magnitude: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}> => {
  try {
    const response = await apiRequest('POST', '/api/sentiment/analyze', { text });
    return await response.json();
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze text sentiment');
  }
};

// Function to get investment recommendations
export const getInvestmentRecommendations = async (
  riskProfile: 'conservative' | 'moderate' | 'aggressive',
  investmentAmount: number,
  goals: string[]
): Promise<any[]> => {
  try {
    const response = await apiRequest('POST', '/api/gemini/recommendations', {
      riskProfile,
      investmentAmount,
      goals
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting investment recommendations:', error);
    throw new Error('Failed to get investment recommendations');
  }
};

// Function to calculate financial health score
export const calculateFinancialHealthScore = async (financialData: any): Promise<{
  score: number;
  category: string;
  recommendations: string[];
}> => {
  try {
    const response = await apiRequest('POST', '/api/tensorflow/financial-health', financialData);
    return await response.json();
  } catch (error) {
    console.error('Error calculating financial health score:', error);
    throw new Error('Failed to calculate financial health score');
  }
};

// Function to check if investment opportunity is a scam
export const checkScam = async (description: string): Promise<{
  isScam: boolean;
  confidenceScore: number;
  explanation: string;
}> => {
  try {
    const response = await apiRequest('POST', '/api/gemini/scam-check', { description });
    return await response.json();
  } catch (error) {
    console.error('Error checking for scam:', error);
    throw new Error('Failed to check if investment is a scam');
  }
};

// Function to get educational content
export const getEducationalContent = async (
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  language: string = 'english'
): Promise<{
  title: string;
  content: string;
  keyPoints: string[];
}> => {
  try {
    const response = await apiRequest('POST', '/api/gemini/learn', {
      topic,
      difficulty,
      language
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting educational content:', error);
    throw new Error('Failed to get educational content');
  }
};
