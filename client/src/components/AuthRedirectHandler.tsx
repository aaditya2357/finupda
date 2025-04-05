import { useEffect, useState } from 'react';
import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

/**
 * Component that handles Firebase redirect authentication
 * Should be mounted near the top of the component tree to handle auth redirects
 */
const AuthRedirectHandler: React.FC = () => {
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const auth = getAuth();
  const { checkAuthState } = useAuth();

  useEffect(() => {
    async function handleRedirectResult() {
      try {
        setIsProcessingRedirect(true);
        console.log('Checking for redirect result...');
        
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log('Redirect result found');
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          
          // The signed-in user info
          const user = result.user;
          console.log('User authenticated via redirect:', user.uid);
          
          // Check if user profile exists in Firestore, if not create it
          try {
            const userProfile = await getDoc(doc(db, "users", user.uid));
            if (!userProfile.exists()) {
              console.log('Creating user profile for Google login via redirect...');
              await setDoc(doc(db, "users", user.uid), {
                displayName: user.displayName || 'User',
                email: user.email,
                createdAt: new Date(),
                financialHealthScore: 50, // Default score
                portfolioValue: 0,
                goals: []
              });
              console.log('Google user profile created successfully');
            }
          } catch (profileError) {
            console.error('Error handling user profile after redirect:', profileError);
          }
          
          // Force refresh auth state
          checkAuthState();
        } else {
          console.log('No redirect result found');
        }
      } catch (error: any) {
        console.error('Error processing redirect result:', error);
        setRedirectError(error.message);
        
        // Handle specific error cases
        if (error.code === 'auth/account-exists-with-different-credential') {
          setRedirectError('An account already exists with the same email address but different sign-in credentials.');
        }
      } finally {
        setIsProcessingRedirect(false);
      }
    }
    
    handleRedirectResult();
  }, [auth, checkAuthState]);

  // This component doesn't render anything visible, but could show an error if needed
  if (redirectError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
        <p><strong>Authentication Error:</strong> {redirectError}</p>
      </div>
    );
  }
  
  return null;
};

export default AuthRedirectHandler;