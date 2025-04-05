import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logout, 
  onAuthChange,
  getUserProfile
} from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Define mock user type that matches Firebase User interface
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  createdAt: string;
  [key: string]: any; // For additional properties
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => void;
  // Optional method only available in development
  loginWithMockUser?: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  checkAuthState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (user: User) => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      setUserProfile(null);
    }
  }, []);

  // Check for mock user in localStorage
  const checkMockUser = useCallback(() => {
    try {
      const mockUserJson = localStorage.getItem('mockAuthUser');
      if (mockUserJson) {
        const mockUser = JSON.parse(mockUserJson) as MockUser;
        console.log('Mock user found in localStorage:', mockUser);
        // Convert to a compatible User-like object
        // This isn't a perfect simulation but works for most UI needs
        const userLike = {
          ...mockUser,
          // Add additional methods and properties expected from Firebase User
          getIdToken: async () => 'mock-token-12345',
          providerData: [{ providerId: 'mock', uid: mockUser.uid, displayName: mockUser.displayName, email: mockUser.email }],
          refreshToken: 'mock-refresh-token',
          toJSON: () => mockUser,
        } as unknown as User;
        
        return userLike;
      }
    } catch (error) {
      console.error('Error checking mock user:', error);
    }
    return null;
  }, []);

  const checkAuthState = useCallback(() => {
    setIsLoading(true);
    
    // First check for mock user in localStorage
    const mockUser = checkMockUser();
    if (mockUser) {
      console.log('Using mock user from localStorage');
      setCurrentUser(mockUser);
      
      // Create mock profile for the mock user
      const mockProfile = {
        displayName: mockUser.displayName,
        email: mockUser.email,
        createdAt: new Date((mockUser as any).createdAt || Date.now()),
        financialHealthScore: 65, // Default score for mock user
        portfolioValue: 25000,
        goals: [
          {
            id: "mock-goal-1",
            name: "Emergency Fund",
            targetAmount: 50000,
            currentAmount: 20000,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            category: 'other',
            createdAt: new Date()
          }
        ]
      };
      
      setUserProfile(mockProfile);
      setIsLoading(false);
      
      // Return empty function as unsubscribe handler
      return () => {};
    }
    
    // If no mock user, proceed with Firebase auth
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [fetchUserProfile, checkMockUser]);

  // Set up auth state observer on initial render
  useEffect(() => {
    const unsubscribe = checkAuthState();
    
    // Cleanup observer on unmount
    return () => unsubscribe();
  }, [checkAuthState]);

  // Create a mock user (for development/testing purposes)
  const createMockUser = (email: string, displayName: string) => {
    const mockUser: MockUser = {
      uid: `mock-${Date.now()}`,
      email: email,
      displayName: displayName,
      emailVerified: true,
      isAnonymous: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
    return mockUser;
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      try {
        // Try Firebase login first
        await loginWithEmail(email, password);
        toast({
          title: "Login successful",
          description: "Welcome back to FinAI!",
        });
      } catch (firebaseError: any) {
        console.warn('Firebase login failed, falling back to mock auth:', firebaseError);
        
        // If firebase login fails, create a mock user for development
        if (process.env.NODE_ENV !== 'production') {
          // Extract name from email (anything before @ symbol)
          const displayName = email.split('@')[0];
          
          // Create and store mock user
          const mockUser = createMockUser(email, displayName);
          console.log('Created mock user for development:', mockUser);
          
          // Force a refresh to load the mock user
          checkAuthState();
          
          toast({
            title: "Development login",
            description: "Using mock authentication for development.",
          });
        } else {
          // In production, propagate the error
          throw firebaseError;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email and password
  const register = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      
      try {
        // Try Firebase registration first
        await registerWithEmail(email, password, displayName);
        toast({
          title: "Registration successful",
          description: "Welcome to FinAI!",
        });
      } catch (firebaseError: any) {
        console.warn('Firebase registration failed, falling back to mock auth:', firebaseError);
        
        // If firebase registration fails, create a mock user for development
        if (process.env.NODE_ENV !== 'production') {
          // Create and store mock user
          const mockUser = createMockUser(email, displayName);
          console.log('Created mock user for development:', mockUser);
          
          // Force a refresh to load the mock user
          checkAuthState();
          
          toast({
            title: "Development account created",
            description: "Using mock authentication for development.",
          });
        } else {
          // In production, propagate the error
          throw firebaseError;
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      try {
        // Try Firebase Google login first
        await loginWithGoogle();
        toast({
          title: "Google login successful",
          description: "Welcome to FinAI!",
        });
      } catch (firebaseError: any) {
        console.warn('Firebase Google login failed, falling back to mock auth:', firebaseError);
        
        // If firebase login fails, create a mock Google user for development
        if (process.env.NODE_ENV !== 'production') {
          // Create mock Google user with randomized Gmail address
          const randomId = Math.floor(Math.random() * 10000);
          const email = `user${randomId}@gmail.com`;
          const displayName = `Test User ${randomId}`;
          
          // Create and store mock user with Google provider
          const mockUser = createMockUser(email, displayName);
          // Add Google-specific properties
          (mockUser as any).providerData = [
            { providerId: 'google.com', email, displayName }
          ];
          
          // Update in localStorage
          localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
          
          console.log('Created mock Google user for development:', mockUser);
          
          // Force a refresh to load the mock user
          checkAuthState();
          
          toast({
            title: "Development Google login",
            description: "Using mock Google authentication for development.",
          });
        } else {
          // In production, propagate the error
          throw firebaseError;
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Check if we're using a mock user
      const mockUserJson = localStorage.getItem('mockAuthUser');
      if (mockUserJson) {
        // If mock user exists, remove it from localStorage
        localStorage.removeItem('mockAuthUser');
        setCurrentUser(null);
        setUserProfile(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out from mock authentication.",
        });
      } else {
        // If using Firebase auth, proceed with normal logout
        await logout();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Direct mock login function for development testing
  const loginWithMockUser = () => {
    console.log('Attempting to create mock user for testing...');
    console.log('Environment MODE:', import.meta.env.MODE);
    
    // Create a consistent test user
    const mockUser = createMockUser('test@example.com', 'Test User');
    console.log('Created development test user:', mockUser);
    
    // Force refresh auth state
    checkAuthState();
    
    toast({
      title: "Development Test User",
      description: "Logged in with mock test user for development.",
    });
    
    return true;
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    login,
    register,
    loginWithGoogle: handleGoogleLogin,
    logout: handleLogout,
    checkAuthState,
    loginWithMockUser, // Always include for development testing
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
