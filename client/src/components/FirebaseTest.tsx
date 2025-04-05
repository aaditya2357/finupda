import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, loginWithGoogle, loginWithEmail, registerWithEmail } from '../lib/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DevAuthHelper from './DevAuthHelper';
import { useAuth } from '../context/AuthContext';

const FirebaseTest = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [configInfo, setConfigInfo] = useState<any>({});
  
  // Check Firebase configuration on mount
  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'set' : 'missing',
        authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'set' : 'missing',
        appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'set' : 'missing',
      };
      
      setConfigInfo({
        config: firebaseConfig,
        auth: auth ? 'Firebase Auth initialized' : 'Firebase Auth not initialized',
        currentUser: auth.currentUser ? `User: ${auth.currentUser.email}` : 'No user logged in'
      });
    } catch (err: any) {
      setError(`Error checking config: ${err.message}`);
    }
  }, []);
  
  // Test direct Google sign-in (bypassing our app's abstraction)
  const testDirectGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Add detailed logging
      console.log('Testing direct Google login');
      console.log('Auth initialized:', !!auth);
      console.log('Current environment:', {
        isDevelopment: import.meta.env.DEV,
        host: window.location.host,
        origin: window.location.origin,
        protocol: window.location.protocol
      });
      
      // Try sign in
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user.email);
      setSuccess(`Successfully signed in as ${result.user.email}`);
    } catch (err: any) {
      console.error('Direct Google login error:', err);
      
      // Enhanced error reporting
      let errorDetails = `Error: ${err.code} - ${err.message}`;
      
      if (err.code === 'auth/unauthorized-domain') {
        errorDetails += `\n\nThis domain (${window.location.origin}) is not authorized in Firebase.
        Please add ${window.location.host} to the authorized domains list in the Firebase console.
        Path: Authentication > Settings > Authorized domains`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorDetails += '\n\nYou closed the popup window before completing authentication.';
      } else if (err.code === 'auth/popup-blocked') {
        errorDetails += '\n\nThe popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorDetails += '\n\nThe authentication request was cancelled, usually because multiple popups were attempted.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorDetails += '\n\nGoogle sign-in is not enabled in the Firebase console. Enable it in: Authentication > Sign-in Methods';
      }
      
      setError(errorDetails);
    }
  };
  
  // Test our app's Google sign-in
  const testAppGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Testing app Google login');
      console.log('Current environment:', {
        isDevelopment: import.meta.env.DEV,
        host: window.location.host,
        origin: window.location.origin,
        protocol: window.location.protocol
      });
      
      const result = await loginWithGoogle();
      console.log('Sign in successful:', result.user.email);
      setSuccess(`Successfully signed in as ${result.user.email}`);
    } catch (err: any) {
      console.error('App Google login error:', err);
      
      // Enhanced error reporting
      let errorDetails = `Error: ${err.code} - ${err.message}`;
      
      if (err.code === 'auth/unauthorized-domain') {
        errorDetails += `\n\nThis domain (${window.location.origin}) is not authorized in Firebase.
        Please add ${window.location.host} to the authorized domains list in the Firebase console.
        Path: Authentication > Settings > Authorized domains`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorDetails += '\n\nYou closed the popup window before completing authentication.';
      } else if (err.code === 'auth/popup-blocked') {
        errorDetails += '\n\nThe popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorDetails += '\n\nThe authentication request was cancelled, usually because multiple popups were attempted.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorDetails += '\n\nGoogle sign-in is not enabled in the Firebase console. Enable it in: Authentication > Sign-in Methods';
      }
      
      setError(errorDetails);
    }
  };
  
  // Get current auth state
  const checkAuthState = () => {
    setConfigInfo({
      ...configInfo,
      currentUser: auth.currentUser ? `User: ${auth.currentUser.email}` : 'No user logged in'
    });
  };
  
  // Check if domain is authorized in Firebase
  const checkDomainAuthorization = () => {
    setError(null);
    setSuccess(null);
    
    const currentDomain = window.location.hostname;
    const expectedApiKeyStart = "AIzaSyBm5TK0BJofyH69_";
    const actualApiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
    const apiKeyStatus = actualApiKey.startsWith(expectedApiKeyStart) 
      ? "valid (matches expected format)" 
      : "invalid (doesn't match expected format)";
    
    setConfigInfo({
      ...configInfo,
      currentDomain,
      authDomain: "hackathon-9f887.firebaseapp.com", // Hardcoded from configuration
      projectId: "hackathon-9f887", // Hardcoded from configuration
      apiKeyStatus,
      envVariableStatus: {
        VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? "set" : "missing",
        VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "set" : "missing",
        VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? "set" : "missing",
      },
      note: `You must add ${currentDomain} to Firebase authorized domains list`
    });
    
    // Show detailed instructions
    setError(`Important: The domain "${currentDomain}" must be added to Firebase authorized domains.
    
    Steps to fix:
    1. Go to Firebase Console: https://console.firebase.google.com
    2. Select project: "hackathon-9f887"
    3. Go to Authentication → Settings → Authorized domains
    4. Click "Add domain" and enter exactly: "${currentDomain}"
    5. Save changes
    
    API Key Status: ${apiKeyStatus}
    Expected API Key prefix: ${expectedApiKeyStart}...
    
    Until these issues are fixed, Google authentication will not work in this environment.
    As a workaround, try the Email/Password authentication option below.`);
  };

  // State for email/password authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  
  // Test email/password login
  const testEmailLogin = async () => {
    setError(null);
    setSuccess(null);
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      await loginWithEmail(email, password);
      setSuccess(`Successfully signed in as ${email}`);
      checkAuthState();
    } catch (err: any) {
      console.error('Email login error:', err);
      setError(`Email login error: ${err.message}`);
    }
  };
  
  // Test email/password registration
  const testEmailRegister = async () => {
    setError(null);
    setSuccess(null);
    
    if (!email || !password || !name) {
      setError('Email, password, and name are required for registration');
      return;
    }
    
    try {
      await registerWithEmail(email, password, name);
      setSuccess(`Successfully registered and signed in as ${email}`);
      checkAuthState();
    } catch (err: any) {
      console.error('Email registration error:', err);
      setError(`Email registration error: ${err.message}`);
    }
  };
  
  // Direct email/password sign up (for testing when Firebase methods fail)
  const testDirectEmailSignUp = async () => {
    setError(null);
    setSuccess(null);
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(`Successfully created account and signed in as ${userCredential.user.email}`);
      checkAuthState();
    } catch (err: any) {
      console.error('Direct email signup error:', err);
      setError(`Direct email signup error: ${err.message}`);
    }
  };
  
  // Direct email/password sign in (for testing when Firebase methods fail)
  const testDirectEmailSignIn = async () => {
    setError(null);
    setSuccess(null);
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccess(`Successfully signed in as ${userCredential.user.email}`);
      checkAuthState();
    } catch (err: any) {
      console.error('Direct email signin error:', err);
      setError(`Direct email signin error: ${err.message}`);
    }
  };

  // State for mock authentication via localStorage
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('');
  const [mockUserData, setMockUserData] = useState<any>(null);
  
  // Check for existing mock user in localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mockAuthUser');
      if (storedUser) {
        setMockUserData(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error reading mock user from localStorage:', err);
    }
  }, []);
  
  // Login with mock user (localStorage)
  const loginWithMockUser = () => {
    setError(null);
    setSuccess(null);
    
    if (!mockEmail) {
      setError('Email is required for mock login');
      return;
    }
    
    try {
      // Create a mock user object
      const mockUser = {
        uid: 'mock-uid-' + Date.now(),
        email: mockEmail,
        displayName: mockName || 'Mock User',
        emailVerified: true,
        isAnonymous: false,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
      setMockUserData(mockUser);
      setSuccess(`Successfully created mock user: ${mockEmail}`);
    } catch (err: any) {
      console.error('Mock login error:', err);
      setError(`Error creating mock user: ${err.message}`);
    }
  };
  
  // Logout mock user
  const logoutMockUser = () => {
    try {
      localStorage.removeItem('mockAuthUser');
      setMockUserData(null);
      setSuccess('Successfully logged out mock user');
    } catch (err: any) {
      console.error('Mock logout error:', err);
      setError(`Error logging out mock user: ${err.message}`);
    }
  };

  const { loginWithMockUser: useContextMockLogin } = useAuth();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Firebase Authentication Test</h2>
      
      {/* Add DevAuthHelper component */}
      <DevAuthHelper />
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">Configuration Info</h3>
        <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
          {JSON.stringify(configInfo, null, 2)}
        </pre>
        <div className="flex gap-2 mt-2">
          <Button onClick={checkAuthState} className="text-xs" size="sm">
            Refresh Auth State
          </Button>
          <Button onClick={checkDomainAuthorization} className="text-xs" size="sm" variant="outline">
            Check Domain Authorization
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="firebase" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="firebase" className="flex-1">Firebase Auth</TabsTrigger>
          <TabsTrigger value="localStorage" className="flex-1">LocalStorage Auth</TabsTrigger>
        </TabsList>
        
        <TabsContent value="firebase" className="space-y-4 mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Note: For Firebase Google authentication to work, your current domain must be added to the Firebase authorized domains list.
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Google Authentication</h3>
            <Button onClick={testDirectGoogleLogin} className="w-full">
              Test Direct Google Login
            </Button>
            
            <Button onClick={testAppGoogleLogin} className="w-full">
              Test App Google Login
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={() => setShowEmailAuth(!showEmailAuth)} 
              variant="outline" 
              className="w-full"
            >
              {showEmailAuth ? 'Hide Email Authentication' : 'Show Email Authentication (Fallback)'}
            </Button>
            
            {showEmailAuth && (
              <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-md">
                <h3 className="font-semibold">Email Authentication (Fallback)</h3>
                <p className="text-sm text-gray-500">
                  Use this method if Google authentication is not working due to domain restrictions.
                </p>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="name">Display Name (for registration)</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={testEmailLogin} className="flex-1">
                      Login with Email
                    </Button>
                    <Button onClick={testEmailRegister} className="flex-1">
                      Register with Email
                    </Button>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Direct Authentication (if all else fails)</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={testDirectEmailSignIn} variant="outline" className="flex-1 text-xs" size="sm">
                        Direct Email Login
                      </Button>
                      <Button onClick={testDirectEmailSignUp} variant="outline" className="flex-1 text-xs" size="sm">
                        Direct Email Register
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="localStorage" className="space-y-4 mt-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800">Mock Authentication</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This is a development-only option that bypasses Firebase completely and uses 
              localStorage to simulate a logged-in user. Use this when Firebase authentication
              is unavailable or you're working offline.
            </p>
          </div>
          
          {mockUserData ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-800">Currently Logged In</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p><strong>Email:</strong> {mockUserData.email}</p>
                  <p><strong>Name:</strong> {mockUserData.displayName}</p>
                  <p><strong>ID:</strong> {mockUserData.uid}</p>
                </div>
              </div>
              
              <Button onClick={logoutMockUser} variant="outline" className="w-full">
                Log Out Mock User
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="space-y-1">
                <Label htmlFor="mockEmail">Email</Label>
                <Input 
                  id="mockEmail" 
                  value={mockEmail} 
                  onChange={(e) => setMockEmail(e.target.value)} 
                  placeholder="Enter any email"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="mockName">Display Name</Label>
                <Input 
                  id="mockName" 
                  value={mockName} 
                  onChange={(e) => setMockName(e.target.value)} 
                  placeholder="Enter your name"
                />
              </div>
              
              <Button onClick={loginWithMockUser} className="w-full">
                Create Mock User
              </Button>
            </div>
          )}
          
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-500">
            <p>Note: This mock user is only stored in your browser's localStorage and is not connected to Firebase in any way. It's useful for testing the UI when authentication services are unavailable.</p>
          </div>
        </TabsContent>
      </Tabs>
        
      {error && (
        <div className="p-3 mt-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm whitespace-pre-line">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 mt-4 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
          {success}
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;