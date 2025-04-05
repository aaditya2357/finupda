import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const loginWithEmail = async (email: string, password: string) => {
  try {
    console.log('Attempting email login...');
    
    // Check if Email/Password authentication is enabled in Firebase
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email login successful:', result.user.uid);
      return result;
    } catch (innerError: any) {
      if (innerError.code === 'auth/operation-not-allowed') {
        console.error('Email/Password authentication is NOT enabled in Firebase console');
        throw new Error('Email/Password authentication is not enabled in your Firebase project. Enable it in the Firebase console: Authentication → Sign-in Methods → Email/Password → Enable');
      }
      throw innerError;
    }
  } catch (error: any) {
    console.error('Email login error:', error.code, error.message);
    
    let enhancedError = error;
    
    // Provide more user-friendly error messages
    if (error.code === 'auth/invalid-email') {
      enhancedError.message = 'The email address is not valid. Please check your email format.';
    } else if (error.code === 'auth/user-disabled') {
      enhancedError.message = 'This user account has been disabled by an administrator.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      // Don't reveal which one is incorrect for security reasons
      enhancedError.message = 'Invalid email address or password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      enhancedError.message = 'Too many unsuccessful login attempts. Please try again later or reset your password.';
    } else if (error.code === 'auth/network-request-failed') {
      enhancedError.message = 'A network error occurred. Please check your internet connection and try again.';
    }
    
    throw enhancedError;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    console.log('Attempting to create new user account...');
    
    // Check if Email/Password authentication is enabled in Firebase
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (innerError: any) {
      if (innerError.code === 'auth/operation-not-allowed') {
        console.error('Email/Password authentication is NOT enabled in Firebase console');
        throw new Error('Email/Password authentication is not enabled in your Firebase project. Enable it in the Firebase console: Authentication → Sign-in Methods → Email/Password → Enable');
      }
      throw innerError;
    }
    
    console.log('User account created:', userCredential.user.uid);
    
    // Create user profile in Firestore
    console.log('Creating user profile in Firestore...');
    try {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName,
        email,
        createdAt: new Date(),
        financialHealthScore: 50, // Default score
        portfolioValue: 0,
        goals: []
      });
      console.log('User profile created successfully');
    } catch (firestoreError: any) {
      console.error('Error creating user profile:', firestoreError);
      // Still return the credential even if profile creation fails
      console.log('Continuing despite Firestore error. User was created but profile data may be incomplete.');
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Registration error:', error.code, error.message);
    
    let enhancedError = error;
    
    // Provide more user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      enhancedError.message = 'This email address is already in use. Please try logging in instead.';
    } else if (error.code === 'auth/invalid-email') {
      enhancedError.message = 'The email address is not valid. Please check your email format.';
    } else if (error.code === 'auth/weak-password') {
      enhancedError.message = 'The password is too weak. Please use a stronger password (at least 6 characters).';
    } else if (error.code === 'auth/network-request-failed') {
      enhancedError.message = 'A network error occurred. Please check your internet connection and try again.';
    }
    
    throw enhancedError;
  }
};

export const loginWithGoogle = async () => {
  try {
    console.log('Attempting Google login with redirect...');
    console.log('Firebase config:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'set' : 'missing',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'set' : 'missing',
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'set' : 'missing',
    });
    
    // Add additional scopes if needed
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    // Set custom parameters for better OAuth flow
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      // This explicitly includes the current domain in the OAuth redirect process
      login_hint: window.location.hostname
    });
    
    // Try getting redirect result first
    try {
      // Check if we're coming back from a redirect
      const redirectResult = await getRedirectResult(auth);
      if (redirectResult) {
        // We have a result from a redirect, no need to redirect again
        console.log('Redirect result found, user already authenticated');
        return redirectResult;
      }
    } catch (redirectError) {
      console.error('Error getting redirect result:', redirectError);
      // Continue with the login flow if there was an error checking the redirect
    }
    
    // No redirect result, so try with popup first
    try {
      console.log('Trying Google login with popup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login with popup successful:', result.user.uid);
      return result;
    } catch (popupError: any) {
      console.error('Google popup login failed:', popupError.code);
      
      // If unauthorized domain or popup blocked, try with redirect
      if (popupError.code === 'auth/unauthorized-domain' || 
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/cancelled-popup-request') {
        
        console.log('Trying Google login with redirect instead...');
        try {
          // Redirect the user to Google sign-in page
          await signInWithRedirect(auth, googleProvider);
          // This redirects away from the page, so we won't reach the code below
          console.log('Redirecting to Google sign-in...');
          return { user: null }; // This is just a placeholder as we won't reach here
        } catch (redirectError: any) {
          console.error('Google redirect login failed:', redirectError);
          throw redirectError;
        }
      } else if (popupError.code === 'auth/operation-not-allowed') {
        console.error('Google sign-in not enabled');
        throw new Error('Google sign-in is not enabled in the Firebase console. Enable it in: Authentication → Sign-in Methods');
      } else {
        throw popupError;
      }
    }
  } catch (error: any) {
    console.error('Google login error:', error.code, error.message);
    
    // Enhance error message
    let enhancedError = error;
    if (error.code === 'auth/unauthorized-domain') {
      enhancedError.message = `Domain ${window.location.hostname} not authorized in Firebase. Please add this exact domain to Firebase Console: Authentication → Settings → Authorized domains`;
    }
    
    throw enhancedError;
  }
};

export const logout = async () => {
  try {
    console.log('Attempting to sign out...');
    await signOut(auth);
    console.log('Sign out successful');
    return true;
  } catch (error: any) {
    console.error('Logout error:', error.code, error.message);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore operations
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const saveFinancialGoal = async (userId: string, goal: any) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data();
    const goals = userData.goals || [];
    
    await updateDoc(userRef, {
      goals: [...goals, { ...goal, id: Date.now().toString(), createdAt: new Date() }]
    });
  }
};

export const getChatHistory = async (userId: string) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  const chats: any[] = [];
  querySnapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() });
  });
  
  return chats;
};

export const saveChat = async (userId: string, message: string, response: string) => {
  const chatRef = collection(db, "chats");
  await setDoc(doc(chatRef), {
    userId,
    message,
    response,
    timestamp: new Date()
  });
};

export { auth, db };
