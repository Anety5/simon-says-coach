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
  Timestamp,
  arrayUnion,
  increment
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
    
    return { success: true, coaches };
  } catch (error) {
    console.error('Error getting custom coaches:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};

// ============================================
// COMMUNITY COACHES MARKETPLACE
// ============================================

/**
 * Publish coach to marketplace
 */
export const publishCoachToMarketplace = async (userId, coachData) => {
  try {
    const marketplaceCoach = {
      ...coachData,
      creatorId: userId,
      creatorName: coachData.creatorName || 'Anonymous',
      price: coachData.price || 4.99,
      rating: 0,
      purchases: 0,
      isPublished: true,
      publishedAt: Timestamp.now(),
    };
    
    const coachRef = await addDoc(collection(db, 'communityCoaches'), marketplaceCoach);
    console.log('Coach published to marketplace:', coachRef.id);
    return { success: true, coachId: coachRef.id };
  } catch (error) {
    console.error('Error publishing coach:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};

/**
 * Get all marketplace coaches
 */
export const getMarketplaceCoaches = async () => {
  try {
    const coachesRef = collection(db, 'communityCoaches');
    const q = query(
      coachesRef,
      where('isPublished', '==', true),
      orderBy('purchases', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const coaches = [];
    querySnapshot.forEach((doc) => {
      coaches.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, coaches };
  } catch (error) {
    console.error('Error getting marketplace coaches:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    // Return mock data for demo
    return { 
      success: true, 
      coaches: [
        {
          id: 'mock-1',
          name: 'Photography Mentor',
          description: 'Master lighting and composition with pro feedback',
          creatorName: 'Cindy',
          creatorBio: 'Professional photographer with 10 years experience',
          price: 4.99,
          rating: 4.8,
          purchases: 234
        },
        {
          id: 'mock-2',
          name: 'Startup Strategy Coach',
          description: 'Navigate early-stage startup challenges',
          creatorName: 'Alex',
          creatorBio: '3x founder, 2 exits',
          price: 9.99,
          rating: 4.9,
          purchases: 156
        }
      ]
    };
  }
};

/**
 * Get single coach from marketplace
 */
export const getMarketplaceCoach = async (coachId) => {
  try {
    const coachRef = doc(db, 'communityCoaches', coachId);
    const coachSnap = await getDoc(coachRef);
    
    if (coachSnap.exists()) {
      return { success: true, coach: { id: coachSnap.id, ...coachSnap.data() } };
    } else {
      return { success: false, error: 'Coach not found' };
    }
  } catch (error) {
    console.error('Error getting marketplace coach:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};

/**
 * Record coach purchase
 */
export const recordCoachPurchase = async (userId, coachId) => {
  try {
    // Add to user's purchased coaches
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      purchasedCoaches: arrayUnion(coachId),
      updatedAt: Timestamp.now()
    });
    
    // Increment purchase count on coach
    const coachRef = doc(db, 'communityCoaches', coachId);
    await updateDoc(coachRef, {
      purchases: increment(1)
    });
    
    console.log('Coach purchase recorded:', coachId);
    return { success: true };
  } catch (error) {
    console.error('Error recording purchase:', error);
    if (error.code === 'permission-denied') {
      console.warn('Firebase permissions not configured - running in demo mode');
    }
    return { success: false, error };
  }
};
