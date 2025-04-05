// User related types
export interface UserProfile {
  displayName: string;
  email: string;
  createdAt: Date;
  financialHealthScore: number;
  portfolioValue: number;
  goals: FinancialGoal[];
}

// Financial goal types
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'retirement' | 'housing' | 'education' | 'travel' | 'other';
  createdAt: Date;
}

// Chat related types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Financial data types
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FinancialHealthData {
  savingsRate: number;
  debtToIncome: number;
  emergencyFund: number;
  investmentRate: number;
}

export interface InvestmentRecommendation {
  name: string;
  type: 'stock' | 'mutual_fund' | 'etf' | 'bond' | 'other';
  risk: 'low' | 'medium' | 'high';
  potentialReturn: number;
  description: string;
  rationale: string;
}

// Learning content types
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export interface FinancialTerm {
  term: string;
  definition: string;
}

export interface WebinarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  registrationUrl: string;
}

// Community types
export interface DiscussionPost {
  id: string;
  userId: string;
  author: {
    displayName: string;
    initials: string;
  };
  title: string;
  content: string;
  createdAt: Date;
  replyCount: number;
  viewCount: number;
  status: 'active' | 'resolved' | 'closed' | 'expert_replied';
  featuredReply?: {
    userId: string;
    author: {
      displayName: string;
      initials: string;
    };
    content: string;
    isExpert: boolean;
  };
}
