/**
 * Financial Health Score Calculator
 * 
 * In a full implementation, this would use TensorFlow.js for more advanced predictions,
 * but for the MVP, we'll use a rule-based approach that simulates ML results.
 */

interface FinancialData {
  savingsRate: number;
  debtToIncome: number;
  emergencyFund: number;
  investmentRate: number;
}

interface HealthScoreResult {
  score: number;
  category: string;
  recommendations: string[];
}

// Calculate financial health score
export async function calculateFinancialHealthScore(
  financialData: FinancialData
): Promise<HealthScoreResult> {
  // Validate input data
  const data = validateFinancialData(financialData);
  
  // Calculate individual component scores
  const savingsScore = calculateSavingsScore(data.savingsRate);
  const debtScore = calculateDebtScore(data.debtToIncome);
  const emergencyFundScore = calculateEmergencyFundScore(data.emergencyFund);
  const investmentScore = calculateInvestmentScore(data.investmentRate);
  
  // Calculate overall score (weighted average)
  const totalScore = Math.round(
    (savingsScore * 0.25) +
    (debtScore * 0.3) +
    (emergencyFundScore * 0.25) +
    (investmentScore * 0.2)
  );
  
  // Determine category
  const category = determineCategory(totalScore);
  
  // Generate recommendations
  const recommendations = generateRecommendations(data, {
    savingsScore,
    debtScore,
    emergencyFundScore,
    investmentScore
  });
  
  return {
    score: totalScore,
    category,
    recommendations
  };
}

// Validate and normalize financial data
function validateFinancialData(data: any): FinancialData {
  return {
    savingsRate: Number(data.savingsRate) || 0,
    debtToIncome: Number(data.debtToIncome) || 0,
    emergencyFund: Number(data.emergencyFund) || 0,
    investmentRate: Number(data.investmentRate) || 0
  };
}

// Calculate score for savings rate (0-100)
function calculateSavingsScore(savingsRate: number): number {
  if (savingsRate >= 30) return 100;
  if (savingsRate <= 0) return 0;
  return Math.round((savingsRate / 30) * 100);
}

// Calculate score for debt-to-income ratio (0-100)
function calculateDebtScore(debtToIncome: number): number {
  if (debtToIncome >= 50) return 0;
  if (debtToIncome <= 10) return 100;
  return Math.round(100 - ((debtToIncome - 10) / 40) * 100);
}

// Calculate score for emergency fund (0-100)
function calculateEmergencyFundScore(emergencyFund: number): number {
  if (emergencyFund >= 6) return 100;
  if (emergencyFund <= 0) return 0;
  return Math.round((emergencyFund / 6) * 100);
}

// Calculate score for investment rate (0-100)
function calculateInvestmentScore(investmentRate: number): number {
  if (investmentRate >= 20) return 100;
  if (investmentRate <= 0) return 0;
  return Math.round((investmentRate / 20) * 100);
}

// Determine category based on score
function determineCategory(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
}

// Generate recommendations based on scores
function generateRecommendations(
  data: FinancialData,
  scores: {
    savingsScore: number;
    debtScore: number;
    emergencyFundScore: number;
    investmentScore: number;
  }
): string[] {
  const recommendations: string[] = [];
  
  // Savings recommendations
  if (scores.savingsScore < 60) {
    const targetSavingsRate = Math.min(data.savingsRate + 5, 20);
    recommendations.push(
      `Try to increase your savings rate from ${data.savingsRate}% to at least ${targetSavingsRate}% of your income by cutting non-essential expenses.`
    );
  }
  
  // Debt recommendations
  if (scores.debtScore < 60) {
    recommendations.push(
      `Your debt-to-income ratio of ${data.debtToIncome}% is too high. Focus on paying down high-interest debt and avoid taking on new debt.`
    );
  }
  
  // Emergency fund recommendations
  if (scores.emergencyFundScore < 60) {
    const targetMonths = Math.min(data.emergencyFund + 2, 6);
    const monthlySIP = Math.ceil((targetMonths - data.emergencyFund) * 10000 / 12);
    recommendations.push(
      `Increase your emergency fund from ${data.emergencyFund} months to at least ${targetMonths} months of expenses. Consider setting up an automatic SIP of ₹${monthlySIP} monthly.`
    );
  }
  
  // Investment recommendations
  if (scores.investmentScore < 60) {
    const targetInvestmentRate = Math.min(data.investmentRate + 5, 15);
    recommendations.push(
      `Increase your investment rate from ${data.investmentRate}% to at least ${targetInvestmentRate}% to meet long-term financial goals. Consider equity-oriented investments for long-term growth.`
    );
  }
  
  // If doing well in all areas
  if (recommendations.length === 0) {
    recommendations.push(
      `Your financial health is strong. Consider optimizing your investment portfolio for tax efficiency and diversification.`
    );
  }
  
  return recommendations;
}
