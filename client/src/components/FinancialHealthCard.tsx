import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import useFinancialHealth from '../hooks/useFinancialHealth';
import { useAuth } from '../context/AuthContext';

const FinancialHealthCard = () => {
  const { score, category, recommendations, financialData, isLoading, updateFinancialData, calculateScore } = useFinancialHealth();
  const { currentUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Define the visual indicators based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'border-green-500';
    if (score >= 60) return 'border-blue-500';
    if (score >= 40) return 'border-yellow-500';
    return 'border-red-500';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreRotation = (score: number) => {
    // Convert score to degrees for the dial
    const degrees = (score / 100) * 180;
    return `-rotate-${Math.round(180 - degrees)}`;
  };

  const handleUpdateScore = async () => {
    if (isEditMode) {
      try {
        await calculateScore();
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating score:', error);
      }
    } else {
      setIsEditMode(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Your Financial Health Score</h3>
            <p className="text-text-light">Powered by Gemini AI and TensorFlow</p>
          </div>
          <Button
            onClick={handleUpdateScore}
            className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-light transition-colors"
            disabled={isLoading}
          >
            <i className={`fas ${isEditMode ? 'fa-save' : 'fa-sync-alt'}`}></i>
            {isLoading ? 'Processing...' : isEditMode ? 'Save Data' : 'Update Score'}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center justify-center">
            {score !== null ? (
              <>
                <div className="relative w-48 h-48">
                  <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                  <div className={`absolute top-0 left-0 w-full h-full rounded-full border-8 ${getScoreColor(score)} border-t-transparent border-l-transparent border-r-transparent transform ${getScoreRotation(score)}`}></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-primary">{score}</span>
                    <span className="text-text-light">{category || getScoreCategory(score)}</span>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-text-light">
                  {currentUser 
                    ? `Your score is better than 65% of users in your age group`
                    : 'Login to compare your score with others'}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-48 h-48 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">No data yet</span>
                </div>
                <p className="mt-4 text-center text-sm text-text-light">
                  {currentUser 
                    ? 'Update your financial data to get your score'
                    : 'Login to calculate your financial health score'}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            {isEditMode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Savings Rate (%)</label>
                  <input
                    type="number"
                    value={financialData.savingsRate}
                    onChange={(e) => updateFinancialData('savingsRate', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of income you save</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Debt to Income Ratio (%)</label>
                  <input
                    type="number"
                    value={financialData.debtToIncome}
                    onChange={(e) => updateFinancialData('debtToIncome', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Monthly debt payments divided by monthly income</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Emergency Fund (months)</label>
                  <input
                    type="number"
                    value={financialData.emergencyFund}
                    onChange={(e) => updateFinancialData('emergencyFund', parseFloat(e.target.value))}
                    min="0"
                    max="36"
                    step="0.1"
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Months of expenses you have saved</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Investment Rate (%)</label>
                  <input
                    type="number"
                    value={financialData.investmentRate}
                    onChange={(e) => updateFinancialData('investmentRate', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of income you invest</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-light mb-1">Savings Rate</div>
                    <div className="text-xl font-semibold flex items-center">
                      <span>{financialData.savingsRate}%</span>
                      {score && <span className="ml-2 text-green-600 text-sm"><i className="fas fa-arrow-up"></i> 3%</span>}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-light mb-1">Debt to Income</div>
                    <div className="text-xl font-semibold flex items-center">
                      <span>{financialData.debtToIncome}%</span>
                      {score && <span className="ml-2 text-green-600 text-sm"><i className="fas fa-arrow-down"></i> 5%</span>}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-light mb-1">Emergency Fund</div>
                    <div className="text-xl font-semibold flex items-center">
                      <span>{financialData.emergencyFund} months</span>
                      {score && <span className="ml-2 text-red-600 text-sm"><i className="fas fa-arrow-down"></i> 0.5</span>}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-text-light mb-1">Investment Rate</div>
                    <div className="text-xl font-semibold flex items-center">
                      <span>{financialData.investmentRate}%</span>
                      {score && <span className="ml-2 text-green-600 text-sm"><i className="fas fa-arrow-up"></i> 2%</span>}
                    </div>
                  </div>
                </div>
                
                {recommendations && recommendations.length > 0 && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-500 mt-1">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">AI Recommendation</h4>
                        <p className="text-sm text-blue-800">{recommendations[0]}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthCard;
