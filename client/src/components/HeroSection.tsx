import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const HeroSection = () => {
  const scrollToAdvisor = () => {
    document.getElementById('ai-advisor')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToLearn = () => {
    document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-[#1e5aa8] to-[#3982e0] text-white py-24 overflow-hidden hero-section">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10 mb-12 md:mb-0 pr-0 md:pr-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Smart <span className="text-yellow-300">Investing</span> Made Simple
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in delay-100 max-w-xl">
            Your AI-powered financial assistant that makes investment decisions simple for everyone in India. Ask questions, get guidance, and grow your wealth confidently.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in delay-200">
            <Button 
              onClick={scrollToAdvisor} 
              className="bg-white text-primary hover:bg-gray-100 px-6 py-6 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              Ask AI Advisor
            </Button>
            <Button 
              onClick={scrollToLearn}
              variant="outline" 
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary px-6 py-6 rounded-xl font-semibold flex items-center gap-2 transition-all text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              Learn Investing
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 mt-8 animate-fade-in delay-300">
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-8 8.5-4.5-1-8-3.5-8-8.5V6c5-1 8-3 8-3s3 2 8 3z"/><path d="m9 12 2 2 4-4"/></svg>
              <span>RBI Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>
              <span>100% Data Security</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>10M+ Users</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 relative z-10">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -top-6 -left-6 bg-yellow-400 p-3 rounded-lg shadow-lg z-20 animate-pulse">
              <div className="font-medium text-primary text-sm">Personalized</div>
              <div className="font-bold text-primary">Financial Advice</div>
            </div>
            
            <img 
              src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Financial planning" 
              className="w-full rounded-2xl shadow-2xl object-cover animate-fade-in delay-200 relative z-10" 
            />
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl transform rotate-3 z-20">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1e5aa8"><path d="M15.5 2C13 2 12 3.5 12 5.5V6h-1.5C7.5 6 6 7.5 6 10.5S7.5 15 10.5 15H12v3.5c0 3 1.5 3.5 3.5 3.5s3.5-0.5 3.5-3.5V9c0-1.93-1.57-3.5-3.5-3.5H13V5.5C13 4.5 13.5 4 14.5 4h1.25V2H15.5zM10.5 7.5H12v6H10.5C8.5 13.5 7.5 12 7.5 10.5S8.5 7.5 10.5 7.5zm5 2H17c1.5 0 1.5 1.5 1.5 1.5v6.5c0 1.5-0.5 2-2 2s-2-0.5-2-2V9.5z"/></svg>
                <div className="text-primary font-bold">Powered by Gemini</div>
              </div>
              <div className="text-sm text-gray-600">Google's most advanced AI</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2Nmg2djZoLTZ2NmgtNnYtNmgtNnY2aC02di02aC02di02aDZ2LTZoNnYtNmg2djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent opacity-10"></div>
      
      <div className="hidden md:block absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute top-24 -right-24 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
};

export default HeroSection;
