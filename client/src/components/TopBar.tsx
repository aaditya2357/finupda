import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentUser, login, register, loginWithGoogle, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);
  
  // Login form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      setLoginDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(email, password, displayName);
      setRegisterDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      setLoginDialogOpen(false);
      setRegisterDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
  };

  // Switch between login and register
  const switchToRegister = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  const switchToLogin = () => {
    setRegisterDialogOpen(false);
    setLoginDialogOpen(true);
  };

  return (
    <div className={`sticky top-0 z-50 flex justify-between items-center bg-white px-6 py-4 shadow-md transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M17.92 12.62A7.5 7.5 0 0 0 12 2.5"/><path d="M2.62 15.5a7.5 7.5 0 0 0 9.88 2.32"/><path d="M16.24 6.34a7.5 7.5 0 0 0-4.22-.84"/><path d="M7.76 17.66a7.5 7.5 0 0 0 4.22.84"/><path d="M12 7v5l2.5 2.5"/></svg>
            <span>FinAI</span>
          </div>
        </Link>
      </div>
      
      <nav className="hidden md:flex gap-8 items-center">
        <a href="#dashboard" className="text-gray-700 hover:text-primary font-medium transition-colors flex flex-col items-center group">
          <span className="text-sm">Dashboard</span>
          <span className="h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#ai-advisor" className="text-gray-700 hover:text-primary font-medium transition-colors flex flex-col items-center group">
          <span className="text-sm">AI Advisor</span>
          <span className="h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#learn" className="text-gray-700 hover:text-primary font-medium transition-colors flex flex-col items-center group">
          <span className="text-sm">Learn</span>
          <span className="h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#community" className="text-gray-700 hover:text-primary font-medium transition-colors flex flex-col items-center group">
          <span className="text-sm">Community</span>
          <span className="h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </a>
      </nav>
      
      <div className="flex items-center gap-4">
        <div 
          className="cursor-pointer flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </div>
        
        {currentUser ? (
          <div className="hidden md:flex items-center gap-3 cursor-pointer group" onClick={() => logout()}>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }
            </div>
            <span className="font-medium text-sm text-gray-700 group-hover:text-primary transition-colors">Logout</span>
          </div>
        ) : (
          <div 
            className="hidden md:flex items-center gap-2 cursor-pointer"
            onClick={() => setLoginDialogOpen(true)}
          >
            <Button size="sm" className="rounded-full px-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Login
            </Button>
          </div>
        )}
        
        <div className="md:hidden cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 md:hidden z-50">
          <div className="flex flex-col space-y-4">
            <a href="#dashboard" className="text-primary hover:text-primary-light font-medium transition-colors">Dashboard</a>
            <a href="#ai-advisor" className="text-primary hover:text-primary-light font-medium transition-colors">AI Advisor</a>
            <a href="#learn" className="text-primary hover:text-primary-light font-medium transition-colors">Learn</a>
            <a href="#community" className="text-primary hover:text-primary-light font-medium transition-colors">Community</a>
            
            {currentUser ? (
              <Button variant="outline" onClick={() => logout()}>
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </Button>
            ) : (
              <Button onClick={() => setLoginDialogOpen(true)}>
                <i className="fas fa-sign-in-alt mr-2"></i> Login
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to FinAI</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your personalized financial dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              <i className="fab fa-google mr-2"></i> Google
            </Button>
            
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <span className="text-primary cursor-pointer hover:underline" onClick={switchToRegister}>
                Register
              </span>
            </p>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Register Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your FinAI Account</DialogTitle>
            <DialogDescription>
              Join thousands of Indians making smarter financial decisions.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRegister} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium">Email</label>
              <Input 
                id="register-email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium">Password</label>
              <Input 
                id="register-password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              <i className="fab fa-google mr-2"></i> Google
            </Button>
            
            <p className="text-sm text-center">
              Already have an account?{" "}
              <span className="text-primary cursor-pointer hover:underline" onClick={switchToLogin}>
                Login
              </span>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopBar;
