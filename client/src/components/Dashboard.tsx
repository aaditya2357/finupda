import { useEffect } from 'react';
import FinancialHealthCard from './FinancialHealthCard';
import MarketInsightsCard from './MarketInsightsCard';
import FinancialGoalsCard from './FinancialGoalsCard';

const Dashboard = () => {
  return (
    <section id="dashboard" className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-10 text-primary flex items-center gap-3 section-title">
        <i className="fas fa-chart-line"></i>
        Your Financial Dashboard
        <span className="ml-3 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Live Updates</span>
      </h2>
      
      <FinancialHealthCard />
      <MarketInsightsCard />
      <FinancialGoalsCard />
    </section>
  );
};

export default Dashboard;
