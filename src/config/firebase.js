// Firebase Configuration for Simon Says Coach
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEPy1_LpZqjL1aknnSUJL6JSY99gpm3go",
  authDomain: "simon-says-coach.firebaseapp.com",
  projectId: "simon-says-coach",
  storageBucket: "simon-says-coach.firebasestorage.app",
  messagingSenderId: "1062073397730",
  appId: "1:1062073397730:web:e306b6ebe7297526da49bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth (for anonymous user authentication)
export const auth = getAuth(app);

export default app;
