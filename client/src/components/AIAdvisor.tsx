import { useState } from 'react';
import ChatInterface from './ChatInterface';
import AIFeatures from './AIFeatures';

const AIAdvisor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <section id="ai-advisor" className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            AI Financial Advisor
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Ask anything about investing, financial planning, or market insights and get personalized guidance powered by Google's Gemini AI technology.
          </p>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary font-medium rounded-full px-4 py-1.5 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1e5aa8"><path d="M15.5 2C13 2 12 3.5 12 5.5V6h-1.5C7.5 6 6 7.5 6 10.5S7.5 15 10.5 15H12v3.5c0 3 1.5 3.5 3.5 3.5s3.5-0.5 3.5-3.5V9c0-1.93-1.57-3.5-3.5-3.5H13V5.5C13 4.5 13.5 4 14.5 4h1.25V2H15.5zM10.5 7.5H12v6H10.5C8.5 13.5 7.5 12 7.5 10.5S8.5 7.5 10.5 7.5zm5 2H17c1.5 0 1.5 1.5 1.5 1.5v6.5c0 1.5-0.5 2-2 2s-2-0.5-2-2V9.5z"/></svg>
              Powered by Gemini
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -top-3 -left-3 bg-yellow-400 text-primary font-medium text-sm px-3 py-1 rounded-lg shadow-lg z-10">
                Ask anything about finance
              </div>
              <ChatInterface language={selectedLanguage} />
            </div>
          </div>
          
          <div className="space-y-6">
            <AIFeatures />
            
            {/* Language Selector */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-5">
                <div className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                  Choose Language
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className={`p-3 rounded-lg transition-all ${selectedLanguage === 'english' 
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => handleLanguageChange('english')}
                  >
                    English
                  </button>
                  <button 
                    className={`p-3 rounded-lg transition-all ${selectedLanguage === 'hindi' 
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => handleLanguageChange('hindi')}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button 
                    className={`p-3 rounded-lg transition-all ${selectedLanguage === 'tamil' 
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => handleLanguageChange('tamil')}
                  >
                    தமிழ் (Tamil)
                  </button>
                  <button 
                    className={`p-3 rounded-lg transition-all ${selectedLanguage === 'bengali' 
                      ? 'bg-primary text-white shadow-md ring-2 ring-primary/20' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => handleLanguageChange('bengali')}
                  >
                    বাংলা (Bengali)
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
              <h3 className="font-semibold text-gray-800 mb-2">Popular Questions</h3>
              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">How do I start investing with ₹5,000?</li>
                <li className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">What is SIP and how does it work?</li>
                <li className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">How to calculate my tax liability on investments?</li>
                <li className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">Compare mutual funds vs stocks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvisor;
