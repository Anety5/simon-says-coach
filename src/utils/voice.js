// Voice capabilities for Simon Says Coach
// Text-to-Speech for coach responses and Speech-to-Text for user input
// Using Web Speech API for browser compatibility

/**
 * Initialize audio permissions (Web Speech API doesn't require explicit permissions)
 */
export const initializeAudio = async () => {
  try {
    // Check if Web Speech API is available
    if (typeof window !== 'undefined' && (window.speechSynthesis || window.webkitSpeechRecognition || window.SpeechRecognition)) {
      return true;
    }
    console.warn('Web Speech API not supported in this browser');
    return false;
  } catch (error) {
    console.error('Error initializing audio:', error);
    return false;
  }
};

/**
 * Text-to-Speech using Web Speech API (works on web/mobile browsers)
 */
export const speakText = async (text, options = {}) => {
  try {
    // Check if browser supports speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = options.rate || 0.95; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Select voice (prefer natural sounding voices)
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      return new Promise((resolve, reject) => {
        utterance.onend = () => resolve(true);
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          reject(error);
        };
        
        window.speechSynthesis.speak(utterance);
      });
    } else {
      console.warn('Speech synthesis not supported');
      return false;
    }
  } catch (error) {
    console.error('Error speaking text:', error);
    return false;
  }
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Speech-to-Text using Web Speech API
 */
export const startListening = (onResult, onError) => {
  try {
    if (typeof window === 'undefined' || !window.webkitSpeechRecognition && !window.SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return null;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      const isFinal = event.results[event.results.length - 1].isFinal;
      
      if (onResult) {
        onResult(transcript, isFinal);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (onError) {
        onError(event.error);
      }
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended');
    };
    
    recognition.start();
    return recognition;
    
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    if (onError) {
      onError(error);
    }
    return null;
  }
};

/**
 * Stop listening
 */
export const stopListening = (recognition) => {
  if (recognition) {
    recognition.stop();
  }
};

/**
 * Check if voice features are available
 */
export const isVoiceAvailable = () => {
  if (typeof window === 'undefined') return false;
  
  const hasSpeechSynthesis = 'speechSynthesis' in window;
  const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  
  return {
    textToSpeech: hasSpeechSynthesis,
    speechToText: hasSpeechRecognition,
    available: hasSpeechSynthesis || hasSpeechRecognition
  };
};

/**
 * Get available voices
 */
export const getAvailableVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};
