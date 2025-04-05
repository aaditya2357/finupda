import { Link } from 'wouter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-bold mb-6 flex items-center gap-3">
              <i className="fas fa-chart-line"></i>
              <span>FinAI</span>
            </div>
            <p className="text-gray-400 mb-6">AI-powered financial assistant helping Indians make smarter investment decisions.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#ai-advisor" className="text-gray-400 hover:text-white transition-colors">AI Advisor</a></li>
              <li><a href="#learn" className="text-gray-400 hover:text-white transition-colors">Learn</a></li>
              <li><a href="#community" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Financial Glossary</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Market News</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Webinars</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Tax Calculator</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">SIP Calculator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Compliance</Link></li>
            </ul>
            <div className="mt-6 bg-gray-800 p-3 rounded-lg text-xs text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-shield-alt"></i>
                <span>RBI Regulated</span>
              </div>
              <div>SEBI Registration No: INH000012345</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p className="mb-2">© {currentYear} FinAI. All rights reserved.</p>
          <p>Disclaimer: Investments in securities market are subject to market risks. Read all the related documents carefully before investing.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
