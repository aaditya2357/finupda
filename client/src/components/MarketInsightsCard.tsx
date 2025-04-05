import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import Chart from 'chart.js/auto';
import useMarketData from '../hooks/useMarketData';
import { Button } from '@/components/ui/button';
import { getInvestmentRecommendations } from '../lib/gemini';
import { useToast } from '@/hooks/use-toast';

const MarketInsightsCard = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const { marketData } = useMarketData();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState([
    {
      name: 'HDFC Bank',
      potentialReturn: 12,
      type: 'stock',
      risk: 'low',
      description: 'Banking • Low Risk',
      rationale: 'Matches your conservative profile'
    },
    {
      name: 'TCS',
      potentialReturn: 9,
      type: 'stock',
      risk: 'medium',
      description: 'IT • Medium Risk',
      rationale: 'Strong fundamentals, steady growth'
    },
    {
      name: 'Parag Parikh Flexi Cap Fund',
      potentialReturn: 15,
      type: 'mutual_fund',
      risk: 'medium',
      description: 'Mutual Fund • Medium Risk',
      rationale: 'Aligned with your long-term goals'
    }
  ]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // Chart configuration
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Generate chart data based on time range
        const { labels, niftyData, bankData } = generateChartData(timeRange);
        
        // Create new chart
        const newChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Nifty 50',
                data: niftyData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: 'Bank Nifty',
                data: bankData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 12,
                  usePointStyle: true
                }
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#334155',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8,
                boxPadding: 4,
                usePointStyle: true
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                grid: {
                  borderDash: [2, 4],
                  color: 'rgba(226, 232, 240, 0.6)'
                },
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString();
                  }
                }
              }
            }
          }
        });
        
        setChartInstance(newChartInstance);
      }
    }
  }, [timeRange]);

  // Generate mock chart data based on time range
  const generateChartData = (range: '1D' | '1W' | '1M' | '1Y') => {
    let labels: string[] = [];
    const baseNifty = 22000;
    const baseBankNifty = 47000;
    const niftyData: number[] = [];
    const bankData: number[] = [];
    
    // Generate data based on time range
    switch (range) {
      case '1D':
        // Hourly data for 1 day
        labels = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'];
        for (let i = 0; i < 8; i++) {
          const niftyVariation = Math.random() * 100 - 50;
          const bankVariation = Math.random() * 150 - 75;
          niftyData.push(baseNifty + niftyVariation);
          bankData.push(baseBankNifty + bankVariation);
        }
        break;
      
      case '1W':
        // Daily data for 1 week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        labels = days;
        for (let i = 0; i < 5; i++) {
          const niftyVariation = Math.random() * 200 - 100;
          const bankVariation = Math.random() * 300 - 150;
          niftyData.push(baseNifty + niftyVariation);
          bankData.push(baseBankNifty + bankVariation);
        }
        break;
      
      case '1M':
        // Weekly data for 1 month
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        for (let i = 0; i < 4; i++) {
          const niftyVariation = Math.random() * 400 - 200;
          const bankVariation = Math.random() * 600 - 300;
          niftyData.push(baseNifty + niftyVariation);
          bankData.push(baseBankNifty + bankVariation);
        }
        break;
      
      case '1Y':
        // Monthly data for 1 year
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
          const niftyVariation = Math.random() * 800 - 400;
          const bankVariation = Math.random() * 1200 - 600;
          niftyData.push(baseNifty + niftyVariation);
          bankData.push(baseBankNifty + bankVariation);
        }
        break;
    }
    
    return { labels, niftyData, bankData };
  };

  // Update recommendations based on risk profile
  const updateRecommendations = async () => {
    try {
      setIsLoadingRecs(true);
      const recommendations = await getInvestmentRecommendations('moderate', 50000, ['growth', 'long-term']);
      setRecommendations(recommendations);
      toast({
        title: "Recommendations updated",
        description: "Latest investment picks based on current market trends",
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Could not update recommendations",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoadingRecs(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Market Insights</h3>
            <div className="flex gap-2">
              <Button
                variant={timeRange === '1D' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1D')}
                className={timeRange === '1D' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
              >
                1D
              </Button>
              <Button
                variant={timeRange === '1W' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1W')}
                className={timeRange === '1W' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
              >
                1W
              </Button>
              <Button
                variant={timeRange === '1M' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1M')}
                className={timeRange === '1M' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
              >
                1M
              </Button>
              <Button
                variant={timeRange === '1Y' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1Y')}
                className={timeRange === '1Y' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
              >
                1Y
              </Button>
            </div>
          </div>
          
          <div className="h-64">
            <canvas ref={chartRef} id="marketChart"></canvas>
          </div>
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            {marketData.slice(0, 4).map((item, index) => (
              <div className="p-2" key={index}>
                <div className="text-text-light">{item.name}</div>
                <div className="font-semibold">{item.price.toLocaleString('en-IN')}</div>
                <div className={item.changePercent > 0 ? 'text-green-600' : 'text-red-600'}>
                  {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Top Investment Picks</h3>
          <p className="text-sm text-text-light mb-4">Personalized recommendations by AI</p>
          
          <div className="space-y-4">
            {recommendations.map((item, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-green-600">+{item.potentialReturn}% potential</div>
                </div>
                <div className="text-sm text-text-light mt-1">{item.description}</div>
                <div className="text-xs mt-2 text-gray-500">{item.rationale}</div>
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition-colors"
            onClick={updateRecommendations}
            disabled={isLoadingRecs}
          >
            {isLoadingRecs ? 'Updating...' : 'View All Recommendations'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketInsightsCard;
