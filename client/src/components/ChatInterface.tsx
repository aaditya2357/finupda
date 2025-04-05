import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useChatbot from '../hooks/useChatbot';
import { useAuth } from '../context/AuthContext';

interface ChatInterfaceProps {
  language: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const { messages, isLoading, sendMessage, clearChat, changeLanguage } = useChatbot();
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Update language in chatbot when language prop changes
  useEffect(() => {
    changeLanguage(language);
  }, [language, changeLanguage]);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Add welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = language === 'hindi' 
        ? "नमस्ते! मैं आपका FinAI सलाहकार हूँ। मैं आपको निवेश निर्णय, वित्तीय योजना, या व्यक्तिगत वित्त के बारे में किसी भी प्रश्न में मदद कर सकता हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?"
        : "Hello! I'm your FinAI advisor. I can help you with investment decisions, financial planning, or any questions about personal finance. How can I assist you today?";
      
      sendMessage(welcomeMessage);
    }
  }, []);

  // Handle send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (inputMessage.trim() && !isLoading) {
      await sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // Handle voice input
  const toggleVoiceInput = () => {
    setIsVoiceInput(!isVoiceInput);
    
    if (!isVoiceInput) {
      // Web Speech API implementation
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();
        
        recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsVoiceInput(false);
        };
        
        recognition.onerror = () => {
          setIsVoiceInput(false);
        };
        
        recognition.onend = () => {
          setIsVoiceInput(false);
        };
        
        recognition.start();
      } else {
        alert('Voice recognition is not supported in your browser.');
        setIsVoiceInput(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-[600px] flex flex-col ai-chatbox">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <i className="fas fa-robot text-primary"></i>
          </div>
          <div>
            <div className="font-medium">FinAI Advisor</div>
            <div className="text-xs opacity-80">Multilingual • Personalized • Secure</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            className="text-white hover:text-gray-200 transition-colors"
            onClick={() => {
              // Text-to-speech for last assistant message
              if (messages.length > 0) {
                const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
                if (lastAssistantMessage && 'speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content);
                  utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
                  window.speechSynthesis.speak(utterance);
                }
              }
            }}
          >
            <i className="fas fa-volume-up"></i>
          </button>
          <div className="relative">
            <button 
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => clearChat()}
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-4 bg-gray-50 chatbox-messages" 
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          message.role === 'assistant' ? (
            // AI Message
            <div className="flex gap-3 mb-6" key={index}>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ) : (
            // User Message
            <div className="flex gap-3 mb-6 justify-end" key={index}>
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                <p>{message.content}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-full" />
                ) : (
                  <i className="fas fa-user text-gray-500 text-sm"></i>
                )}
              </div>
            </div>
          )
        ))}
        
        {isLoading && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg rounded-tl-none">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="bg-blue-200 h-2 w-2 rounded-full animate-pulse"></div>
                  <div className="bg-blue-200 h-2 w-2 rounded-full animate-pulse delay-100"></div>
                  <div className="bg-blue-200 h-2 w-2 rounded-full animate-pulse delay-200"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  If this takes longer than usual, we might be hitting API rate limits. The system will automatically retry after a short delay.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex gap-2 chatbox-input">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`rounded-full transition-colors ${isVoiceInput ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={toggleVoiceInput}
          disabled={isLoading}
        >
          <i className={`fas ${isVoiceInput ? 'fa-stop' : 'fa-microphone'}`}></i>
        </Button>
        
        <Input
          type="text"
          placeholder={language === 'hindi' ? "कोई भी वित्तीय प्रश्न पूछें..." : "Ask any financial question..."}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading || isVoiceInput}
        />
        
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="bg-primary text-white p-2 rounded-full hover:bg-primary-light transition-colors"
          disabled={isLoading || !inputMessage.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
