import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

/**
 * A simple component to create a mock user directly in localStorage
 * This is a development-only utility
 */
const MockLogin: React.FC = () => {
  const auth = useAuth();

  const handleLogin = () => {
    console.log('MockLogin: Clicking Login with Test User button');
    
    if (auth.loginWithMockUser) {
      console.log('MockLogin: Calling loginWithMockUser from AuthContext');
      auth.loginWithMockUser();
    } else {
      console.error('MockLogin: loginWithMockUser is not available in AuthContext');
      
      try {
        // Fallback direct localStorage manipulation
        const mockUser = {
          uid: 'mock-uid-' + Date.now(),
          email: 'test@example.com',
          displayName: 'Test User',
          emailVerified: true,
          isAnonymous: false,
          createdAt: new Date().toISOString(),
          providerData: [
            { providerId: 'mock', uid: 'mock-uid', displayName: 'Test User', email: 'test@example.com' }
          ]
        };
        
        localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
        console.log('MockLogin: Created mock user directly:', mockUser);
        
        // Force page reload to update auth state
        window.location.reload();
      } catch (err) {
        console.error('MockLogin: Error creating mock user:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="default"
        size="sm"
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
        onClick={handleLogin}
      >
        Login with Test User
      </Button>
    </div>
  );
};

export default MockLogin;