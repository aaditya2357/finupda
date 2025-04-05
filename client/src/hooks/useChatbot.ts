import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { sendMessage, analyzeSentiment } from '../lib/gemini';
import { saveChat } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

// Custom hook for AI chatbot functionality
export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('english');
  const { currentUser } = useAuth();

  // Convert messages to the format expected by Gemini API
  const formatMessagesForGemini = () => {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  };

  // Send a message to the chatbot
  const sendUserMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Create a new user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    // Update messages state with user message
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      // Analyze sentiment to detect emotional bias in financial questions
      const sentimentResult = await analyzeSentiment(userMessage);
      
      // Get formatted message history for context
      const messageHistory = formatMessagesForGemini();
      
      // Send message to Gemini API
      const response = await sendMessage(userMessage, {
        history: messageHistory,
        language
      });

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      // Update messages with assistant response
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Save chat to Firebase if user is logged in
      if (currentUser) {
        await saveChat(currentUser.uid, userMessage, response);
      }

      return response;
    } catch (error: any) {
      console.error('Error in chatbot:', error);
      
      // Check if it's a rate limiting error
      let errorContent = 'Sorry, I encountered an error. Please try again later.';
      
      if (error.message && error.message.includes('429')) {
        errorContent = 'I\'m currently receiving too many requests. Google\'s Gemini AI has a limit on how many questions it can answer in a short time. Please wait a minute before asking another question.';
      } else if (error.message && error.message.includes('Failed to fetch')) {
        errorContent = 'I\'m having trouble connecting to the AI service. Please check your internet connection and try again.';
      }
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, currentUser]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Change language
  const changeLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);

  return {
    messages,
    isLoading,
    language,
    sendMessage: sendUserMessage,
    clearChat,
    changeLanguage
  };
};

export default useChatbot;
