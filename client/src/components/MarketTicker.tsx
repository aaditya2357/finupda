import { useEffect } from 'react';
import useMarketData from '../hooks/useMarketData';

const MarketTicker = () => {
  const { marketData, isLoading, error } = useMarketData();

  return (
    <div className="bg-primary bg-opacity-80 text-white py-3 overflow-hidden whitespace-nowrap market-ticker">
      <div className="animate-ticker ticker-content">
        {!isLoading && marketData.map((item, index) => (
          <div className="inline-block mx-8 ticker-item" key={index}>
            <span className="font-medium">{item.name}</span>
            <span className="ml-2">
              {item.symbol === 'USDINR' ? '₹' : ''}{item.price.toLocaleString('en-IN')}
            </span>
            <span className={`ml-1 ${item.changePercent > 0 ? 'text-green-300 up' : 'text-red-300 down'}`}>
              {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
        
        {/* Duplicate items to create continuous flow */}
        {!isLoading && marketData.map((item, index) => (
          <div className="inline-block mx-8 ticker-item" key={`dup-${index}`}>
            <span className="font-medium">{item.name}</span>
            <span className="ml-2">
              {item.symbol === 'USDINR' ? '₹' : ''}{item.price.toLocaleString('en-IN')}
            </span>
            <span className={`ml-1 ${item.changePercent > 0 ? 'text-green-300 up' : 'text-red-300 down'}`}>
              {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="inline-block mx-8">
            <span>Loading market data...</span>
          </div>
        )}
        
        {error && (
          <div className="inline-block mx-8">
            <span>Market data temporarily unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTicker;
