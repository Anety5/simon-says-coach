// Voice capabilities for Simon Says Coach
// TEMPORARILY DISABLED - Web Speech API doesn't work on React Native
// Will implement with react-native-voice or expo-speech in future

/**
 * Initialize audio permissions - DISABLED
 */
export const initializeAudio = async () => {
  console.log('Voice features disabled on React Native');
  return false;
};

/**
 * Text-to-Speech - DISABLED (Web Speech API not supported on React Native)
 */
export const speakText = async (text, options = {}) => {
  return false;
};

/**
 * Stop any ongoing speech - DISABLED
 */
export const stopSpeaking = () => {
  return;
};

/**
 * Speech-to-Text - DISABLED (Web Speech API not supported on React Native)
 */
export const startListening = (onResult, onError) => {
  return null;
};

/**
 * Stop listening - DISABLED
 */
export const stopListening = (recognition) => {
  return;
};

/**
 * Check if voice features are available - DISABLED
 */
export const isVoiceAvailable = () => {
  return {
    textToSpeech: false,
    speechToText: false,
    available: false
  };
};

/**
 * Get available voices - DISABLED
 */
export const getAvailableVoices = () => {
  return [];
};
