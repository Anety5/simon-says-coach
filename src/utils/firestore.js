// Firestore Database Utilities for Simon Says Coach
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// USERS COLLECTION
// ============================================

/**
 * Create or update user profile
 */
export const saveUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      updatedAt: Timestamp.now()
    }, { merge: true });
    console.log('User profile saved:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    // Gracefully handle Firebase permission errors
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};

// ============================================
// COACHES COLLECTION
// ============================================

/**
 * Save user's active coach
 */
export const setActiveCoach = async (userId, coachId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      activeCoach: coachId,
      updatedAt: Timestamp.now()
    });
    console.log('Active coach set:', coachId);
    return { success: true };
  } catch (error) {
    console.error('Error setting active coach:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};

// ============================================
// CONVERSATIONS COLLECTION
// ============================================

/**
 * Create a new conversation
 */
export const createConversation = async (userId, coachId) => {
  try {
    const conversationData = {
      userId,
      coachId,
      createdAt: Timestamp.now(),
      lastMessageAt: Timestamp.now(),
      messageCount: 0
    };
    
    const conversationRef = await addDoc(collection(db, 'conversations'), conversationData);
    console.log('Conversation created:', conversationRef.id);
    return conversationRef.id; // Return just the ID string
  } catch (error) {
    console.error('Error creating conversation:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return null;
  }
};

/**
 * Add message to conversation
 */
export const addMessage = async (conversationId, messageData) => {
  try {
    const messageRef = await addDoc(
      collection(db, 'conversations', conversationId, 'messages'),
      {
        ...messageData,
        timestamp: Timestamp.now()
      }
    );
    
    // Update conversation last message time
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessageAt: Timestamp.now(),
      messageCount: messageData.messageCount || 0
    });
    
    console.log('Message added:', messageRef.id);
    return { success: true, messageId: messageRef.id };
  } catch (error) {
    console.error('Error adding message:', error);
    return { success: false, error };
  }
};

/**
 * Get conversation messages
 */
export const getMessages = async (conversationId, limitCount = 50) => {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    return messages; // Return just the array
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

/**
 * Get user's conversations
 */
export const getUserConversations = async (userId) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef, 
      where('userId', '==', userId),
      orderBy('lastMessageAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const conversations = [];
    querySnapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: conversations };
  } catch (error) {
    console.error('Error getting conversations:', error);
    return { success: false, error };
  }
};

// ============================================
// CUSTOM COACHES (Pro Feature)
// ============================================

/**
 * Create custom coach (Pro users only)
 */
export const createCustomCoach = async (userId, coachData) => {
  try {
    const customCoachData = {
      ...coachData,
      createdBy: userId,
      createdAt: Timestamp.now(),
      isCustom: true
    };
    
    const coachRef = await addDoc(collection(db, 'coaches'), customCoachData);
    console.log('Custom coach created:', coachRef.id);
    return { success: true, coachId: coachRef.id };
  } catch (error) {
    console.error('Error creating custom coach:', error);
    return { success: false, error };
  }
};

/**
 * Get user's custom coaches
 */
export const getUserCustomCoaches = async (userId) => {
  try {
    const coachesRef = collection(db, 'coaches');
    const q = query(
      coachesRef,
      where('createdBy', '==', userId),
      where('isCustom', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    const coaches = [];
    querySnapshot.forEach((doc) => {
      coaches.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: coaches };
  } catch (error) {
    console.error('Error getting custom coaches:', error);
    return { success: false, error };
  }
};
