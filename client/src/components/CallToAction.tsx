import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CallToAction = () => {
  const { currentUser, register, loginWithGoogle } = useAuth();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    setError('');
  };
  
  // Handle sign up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.displayName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(formData.email, formData.password, formData.displayName);
      setIsSignupOpen(false);
      // Reset form
      setFormData({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle Google sign up
  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      setIsSignupOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to register with Google');
    }
  };
  
  const scrollToAdvisor = () => {
    document.getElementById('ai-advisor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Financial Journey?</h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10">Join thousands of Indians making smarter financial decisions with FinAI's AI-powered guidance.</p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Button 
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold flex items-center gap-3 hover:shadow-lg transition-all transform hover:-translate-y-1"
            onClick={() => currentUser ? scrollToAdvisor() : setIsSignupOpen(true)}
          >
            <i className={`fas ${currentUser ? 'fa-robot' : 'fa-user-plus'}`}></i>
            {currentUser ? 'Start Now' : 'Create Free Account'}
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-white bg-transparent text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 hover:bg-white hover:bg-opacity-10 transition-all"
            onClick={scrollToAdvisor}
          >
            <i className="fas fa-robot"></i>
            Try AI Advisor
          </Button>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-10">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">1M+</div>
            <div className="opacity-80">Users</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">₹5000Cr+</div>
            <div className="opacity-80">Invested</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">4.8/5</div>
            <div className="opacity-80">User Rating</div>
          </div>
        </div>
      </div>
      
      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your FinAI Account</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium block mb-1">Name</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Confirm Password</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
            >
              <i className="fab fa-google mr-2"></i> Google
            </Button>
            
            <p className="text-xs text-center">
              By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CallToAction;
