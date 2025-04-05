import { ScrollArea } from '@/components/ui/scroll-area';
import useChatbot from '../hooks/useChatbot';

const AIFeatures = () => {
  const { sendMessage } = useChatbot();

  // Handle popular question click
  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6">What You Can Ask</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3 group cursor-pointer" onClick={() => handleQuestionClick("Can you analyze Reliance Industries stock for long-term investment?")}>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
              <i className="fas fa-search text-blue-600"></i>
            </div>
            <div>
              <div className="font-medium group-hover:text-primary transition-colors">Investment Research</div>
              <p className="text-sm text-text-light">Get in-depth analysis of stocks, mutual funds, and market trends</p>
            </div>
          </div>
          
          <div className="flex gap-3 group cursor-pointer" onClick={() => handleQuestionClick("How can I plan for retirement with ₹50,000 monthly income?")}>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
              <i className="fas fa-calculator text-green-600"></i>
            </div>
            <div>
              <div className="font-medium group-hover:text-primary transition-colors">Financial Planning</div>
              <p className="text-sm text-text-light">Create customized plans for retirement, education, or home buying</p>
            </div>
          </div>
          
          <div className="flex gap-3 group cursor-pointer" onClick={() => handleQuestionClick("Explain SIPs and how they work for beginners")}>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
              <i className="fas fa-graduation-cap text-purple-600"></i>
            </div>
            <div>
              <div className="font-medium group-hover:text-primary transition-colors">Financial Education</div>
              <p className="text-sm text-text-light">Learn concepts like SIP, asset allocation, or tax-saving investments</p>
            </div>
          </div>
          
          <div className="flex gap-3 group cursor-pointer" onClick={() => handleQuestionClick("Is this investment opportunity offering 30% guaranteed returns legitimate?")}>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
              <i className="fas fa-shield-alt text-red-600"></i>
            </div>
            <div>
              <div className="font-medium group-hover:text-primary transition-colors">Scam Detection</div>
              <p className="text-sm text-text-light">Verify if an investment opportunity is legitimate or potentially fraudulent</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm font-medium mb-3">Popular Questions</div>
          <ScrollArea className="h-[120px] pr-4">
            <div className="space-y-2">
              <div 
                className="bg-gray-50 p-2 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleQuestionClick("How should I start investing with ₹10,000?")}
              >
                How should I start investing with ₹10,000?
              </div>
              <div 
                className="bg-gray-50 p-2 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleQuestionClick("What are tax-saving investment options in India?")}
              >
                What are tax-saving investment options in India?
              </div>
              <div 
                className="bg-gray-50 p-2 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleQuestionClick("How to build an emergency fund?")}
              >
                How to build an emergency fund?
              </div>
              <div 
                className="bg-gray-50 p-2 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleQuestionClick("Should I invest in cryptocurrency in 2024?")}
              >
                Should I invest in cryptocurrency in 2024?
              </div>
              <div 
                className="bg-gray-50 p-2 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleQuestionClick("What's the difference between mutual funds and ETFs?")}
              >
                What's the difference between mutual funds and ETFs?
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
