import { useState, useEffect } from 'react';
import { MarketData } from '../types';
import { apiRequest } from '../lib/queryClient';

// Custom hook for fetching real-time market data
export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Temporary market data for initial render
  const placeholderData: MarketData[] = [
    { symbol: 'NIFTY50', name: 'NIFTY 50', price: 22643.4, change: 169.8, changePercent: 0.75 },
    { symbol: 'SENSEX', name: 'SENSEX', price: 74572.68, change: 484.3, changePercent: 0.65 },
    { symbol: 'USDINR', name: 'USD/INR', price: 83.24, change: -0.1, changePercent: -0.12 },
    { symbol: 'GOLD', name: 'GOLD', price: 67945, change: 217.42, changePercent: 0.32 },
    { symbol: 'CRUDEOIL', name: 'CRUDE OIL', price: 6795, change: -59.1, changePercent: -0.87 }
  ];

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Attempt to fetch real market data from API
      const response = await apiRequest('GET', '/api/market/data', undefined);
      const data = await response.json();
      
      setMarketData(data);
    } catch (err) {
      console.error('Error fetching market data:', err);
      // Use placeholder data if API fails
      setMarketData(placeholderData);
      setError('Failed to fetch market data. Using cached values.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch market data on initial load
  useEffect(() => {
    fetchMarketData();
    
    // Refresh market data every 30 seconds
    const intervalId = setInterval(fetchMarketData, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return { marketData, isLoading, error, refetch: fetchMarketData };
};

export default useMarketData;
