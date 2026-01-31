// Authentication utilities for Simon Says Coach
import { 
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { saveUserProfile } from './firestore';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user profile
    await saveUserProfile(user.uid, {
      name: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      isAnonymous: false,
      createdAt: new Date().toISOString()
    });
    
    console.log('Google user signed in:', user.uid);
    return { success: true, userId: user.uid, user };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { success: false, error };
  }
};

/**
 * Sign in user anonymously (no email/password required)
 * Perfect for quick onboarding - users can upgrade later
 */
export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth);
    console.log('Anonymous user signed in:', result.user.uid);
    return { success: true, userId: result.user.uid, user: result.user };
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    return { success: false, error };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('User signed out');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

/**
 * Initialize user - create anonymous account and profile
 */
export const initializeUser = async (profileData = {}) => {
  try {
    console.log('Starting user initialization...');
    
    // Sign in anonymously
    const authResult = await signInAnonymous();
    if (!authResult.success) {
      console.error('Anonymous sign-in failed:', authResult.error);
      return authResult;
    }

    console.log('Anonymous sign-in successful:', authResult.userId);

    // Create user profile in Firestore (optional - don't fail if this doesn't work)
    const userId = authResult.userId;
    try {
      const profileResult = await saveUserProfile(userId, {
        ...profileData,
        isAnonymous: true,
        createdAt: new Date().toISOString()
      });

      if (!profileResult.success) {
        console.warn('Profile save failed, but continuing:', profileResult.error);
      } else {
        console.log('User profile saved successfully');
      }
    } catch (profileError) {
      console.warn('Profile save error, but continuing:', profileError);
    }

    console.log('✅ User initialized successfully:', userId);
    return { success: true, userId, user: authResult.user };
  } catch (error) {
    console.error('❌ Critical error initializing user:', error);
    return { success: false, error: error.message || error };
  }
};
