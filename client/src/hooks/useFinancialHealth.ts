import { useState, useCallback } from 'react';
import { FinancialHealthData } from '../types';
import { calculateFinancialHealthScore } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../lib/firebase';

// Custom hook for financial health score calculation
export const useFinancialHealth = () => {
  const [score, setScore] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [financialData, setFinancialData] = useState<FinancialHealthData>({
    savingsRate: 0,
    debtToIncome: 0,
    emergencyFund: 0,
    investmentRate: 0
  });
  const { currentUser, userProfile } = useAuth();

  // Initialize from user profile if available
  useState(() => {
    if (userProfile && userProfile.financialHealthScore) {
      setScore(userProfile.financialHealthScore);
    }
    
    if (userProfile && userProfile.financialData) {
      setFinancialData(userProfile.financialData);
    }
  });

  // Update financial data inputs
  const updateFinancialData = useCallback((field: keyof FinancialHealthData, value: number) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Calculate financial health score
  const calculateScore = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const result = await calculateFinancialHealthScore(financialData);
      
      setScore(result.score);
      setCategory(result.category);
      setRecommendations(result.recommendations);
      
      // Save score to user profile if logged in
      if (currentUser) {
        await updateUserProfile(currentUser.uid, {
          financialHealthScore: result.score,
          financialData,
          financialRecommendations: result.recommendations
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error calculating financial health score:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [financialData, currentUser]);

  return {
    score,
    category,
    recommendations,
    financialData,
    isLoading,
    updateFinancialData,
    calculateScore
  };
};

export default useFinancialHealth;
