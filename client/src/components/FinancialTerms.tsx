import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FinancialTerm {
  term: string;
  definition: string;
}

const FinancialTerms = () => {
  const [showAllTerms, setShowAllTerms] = useState(false);
  
  // Initial terms to display
  const initialTerms: FinancialTerm[] = [
    {
      term: 'SIP (Systematic Investment Plan)',
      definition: 'A method of investing a fixed amount regularly in mutual funds, similar to a recurring deposit.'
    },
    {
      term: 'CAGR (Compound Annual Growth Rate)',
      definition: 'The annual growth rate of an investment over a specified period longer than one year.'
    },
    {
      term: 'Equity',
      definition: 'Ownership in a company in the form of shares, which may provide capital gains and dividends.'
    },
    {
      term: 'Debt Funds',
      definition: 'Mutual funds that invest in fixed income securities like government bonds and corporate bonds.'
    }
  ];
  
  // All financial terms
  const allTerms: FinancialTerm[] = [
    ...initialTerms,
    {
      term: 'Asset Allocation',
      definition: 'The strategy of dividing investments among different asset categories like stocks, bonds, and cash to balance risk and reward.'
    },
    {
      term: 'ELSS (Equity Linked Saving Scheme)',
      definition: 'A type of mutual fund in India that primarily invests in equities and qualifies for tax benefits under Section 80C.'
    },
    {
      term: 'PPF (Public Provident Fund)',
      definition: 'A long-term savings scheme offered by the government of India with tax benefits and fixed interest rates.'
    },
    {
      term: 'NPS (National Pension System)',
      definition: 'A voluntary retirement savings scheme designed to enable systematic savings during the working life of subscribers.'
    },
    {
      term: 'Diversification',
      definition: 'A risk management strategy that mixes a variety of investments within a portfolio to minimize the impact of any single investment.'
    },
    {
      term: 'Portfolio Rebalancing',
      definition: 'The process of realigning the weightings of a portfolio of assets by periodically buying or selling assets to maintain the original desired level of asset allocation.'
    },
    {
      term: 'Inflation',
      definition: 'The rate at which the general level of prices for goods and services rises, causing purchasing power to fall.'
    },
    {
      term: 'Dividend',
      definition: 'A portion of a company\'s earnings distributed to its shareholders, usually in cash or additional shares.'
    },
    {
      term: 'Capital Gain',
      definition: 'The profit earned when an investment is sold for a higher price than the purchase price.'
    },
    {
      term: 'Liquidity',
      definition: 'The degree to which an asset can be quickly bought or sold in the market without affecting its price.'
    },
    {
      term: 'Expense Ratio',
      definition: 'The annual fee charged by mutual funds and ETFs for managing the fund, expressed as a percentage of assets.'
    },
    {
      term: 'Bull Market',
      definition: 'A financial market of a group of securities in which prices are rising or expected to rise.'
    },
    {
      term: 'Bear Market',
      definition: 'A market condition in which prices of securities are falling or expected to fall.'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6">Financial Terms Glossary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {initialTerms.map((item, index) => (
            <div key={index} className="border-b border-gray-100 pb-3">
              <div className="font-medium">{item.term}</div>
              <p className="text-sm text-text-light">{item.definition}</p>
            </div>
          ))}
        </div>
        
        <Button
          onClick={() => setShowAllTerms(true)}
          variant="ghost"
          className="mt-6 text-primary hover:text-primary-light font-medium transition-colors flex items-center gap-2"
        >
          View Full Glossary
          <i className="fas fa-arrow-right"></i>
        </Button>
      </div>
      
      {/* Full Glossary Dialog */}
      <Dialog open={showAllTerms} onOpenChange={setShowAllTerms}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Financial Terms Glossary</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-2">
              {allTerms.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-3">
                  <div className="font-medium">{item.term}</div>
                  <p className="text-sm text-text-light">{item.definition}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialTerms;
