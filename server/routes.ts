import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateGeminiResponse, getInvestmentRecommendations, getEducationalContent, checkScam } from "./services/gemini";
import { analyzeSentiment } from "./services/sentiment";
import { calculateFinancialHealthScore } from "./services/tensorflow";

export async function registerRoutes(app: Express): Promise<Server> {
  // Gemini AI Chat API endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, language } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const response = await generateGeminiResponse(message, history, language);
      res.json({ response });
    } catch (error: any) {
      console.error('Error in Gemini chat API:', error);
      res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });
  
  // Sentiment Analysis API endpoint
  app.post('/api/sentiment/analyze', async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
      
      const result = await analyzeSentiment(text);
      res.json(result);
    } catch (error: any) {
      console.error('Error in sentiment analysis API:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze sentiment' });
    }
  });
  
  // Investment Recommendations API endpoint
  app.post('/api/gemini/recommendations', async (req, res) => {
    try {
      const { riskProfile, investmentAmount, goals } = req.body;
      
      if (!riskProfile) {
        return res.status(400).json({ error: 'Risk profile is required' });
      }
      
      const recommendations = await getInvestmentRecommendations(riskProfile, investmentAmount, goals);
      res.json(recommendations);
    } catch (error: any) {
      console.error('Error in recommendations API:', error);
      res.status(500).json({ error: error.message || 'Failed to get recommendations' });
    }
  });
  
  // Financial Health Score API endpoint
  app.post('/api/tensorflow/financial-health', async (req, res) => {
    try {
      const financialData = req.body;
      
      if (!financialData || Object.keys(financialData).length === 0) {
        return res.status(400).json({ error: 'Financial data is required' });
      }
      
      const result = await calculateFinancialHealthScore(financialData);
      res.json(result);
    } catch (error: any) {
      console.error('Error in financial health score API:', error);
      res.status(500).json({ error: error.message || 'Failed to calculate score' });
    }
  });
  
  // Scam Check API endpoint
  app.post('/api/gemini/scam-check', async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: 'Investment description is required' });
      }
      
      const result = await checkScam(description);
      res.json(result);
    } catch (error: any) {
      console.error('Error in scam check API:', error);
      res.status(500).json({ error: error.message || 'Failed to check for scam' });
    }
  });
  
  // Educational Content API endpoint
  app.post('/api/gemini/learn', async (req, res) => {
    try {
      const { topic, difficulty, language } = req.body;
      
      if (!topic || !difficulty) {
        return res.status(400).json({ error: 'Topic and difficulty are required' });
      }
      
      const content = await getEducationalContent(topic, difficulty, language);
      res.json(content);
    } catch (error: any) {
      console.error('Error in educational content API:', error);
      res.status(500).json({ error: error.message || 'Failed to get educational content' });
    }
  });
  
  // Market Data API endpoint (simple mock data for MVP)
  app.get('/api/market/data', (_req, res) => {
    try {
      // Mock market data (to be replaced with real API integration later)
      const marketData = [
        { symbol: 'NIFTY50', name: 'NIFTY 50', price: 22643.4, change: 169.8, changePercent: 0.75 },
        { symbol: 'SENSEX', name: 'SENSEX', price: 74572.68, change: 484.3, changePercent: 0.65 },
        { symbol: 'USDINR', name: 'USD/INR', price: 83.24, change: -0.1, changePercent: -0.12 },
        { symbol: 'GOLD', name: 'GOLD', price: 67945, change: 217.42, changePercent: 0.32 },
        { symbol: 'CRUDEOIL', name: 'CRUDE OIL', price: 6795, change: -59.1, changePercent: -0.87 }
      ];
      
      res.json(marketData);
    } catch (error: any) {
      console.error('Error in market data API:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch market data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
