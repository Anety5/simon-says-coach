// Authentication utilities for Simon Says Coach
import { 
  signInAnonymously,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { saveUserProfile } from './firestore';

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
    // Sign in anonymously
    const authResult = await signInAnonymous();
    if (!authResult.success) {
      return authResult;
    }

    // Create user profile in Firestore
    const userId = authResult.userId;
    const profileResult = await saveUserProfile(userId, {
      ...profileData,
      isAnonymous: true,
      createdAt: new Date().toISOString()
    });

    if (!profileResult.success) {
      return profileResult;
    }

    console.log('User initialized:', userId);
    return { success: true, userId, user: authResult.user };
  } catch (error) {
    console.error('Error initializing user:', error);
    return { success: false, error };
  }
};
