// Chat Screen - Where coaching happens
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import { Text } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import { generateCoachResponse, getRandomQuote } from '../utils/gemini';
import { getCurrentUser } from '../utils/auth';
import { getUserProfile, createConversation, addMessage, getMessages } from '../utils/firestore';
import { checkProStatus } from '../utils/purchases';
import { speakText, stopSpeaking, startListening, stopListening, isVoiceAvailable } from '../utils/voice';

// Coach-specific examples and placeholders
const coachExamples = {
  productivity: {
    greeting: 'Hello! I am Simon, your productivity coach. Try one of these prompts below or modify them to fit your needs:',
    examples: [
      'Help me prioritize my tasks for today',
      'I\'m feeling overwhelmed with my workload',
      'Create a morning routine for me',
      'How can I improve my focus?'
    ],
    placeholder: 'Help me prioritize my tasks for today'
  },
  growth: {
    greeting: 'Hi! I\'m Simon, your growth mindset coach. Here are some ways we can work together:',
    examples: [
      'Help me overcome imposter syndrome',
      'I want to develop better learning habits',
      'How can I turn failures into learning opportunities?',
      'Help me set meaningful personal development goals'
    ],
    placeholder: 'Help me overcome imposter syndrome'
  },
  wellness: {
    greeting: 'Welcome! I\'m Simon, your wellness coach. Let\'s work on your wellbeing:',
    examples: [
      'Help me create a stress management routine',
      'I\'m struggling with work-life balance',
      'Guide me through a 5-minute mindfulness exercise',
      'How can I improve my sleep habits?'
    ],
    placeholder: 'Help me create a stress management routine'
  }
};

export default function ChatScreen({ navigation, route }) {
  const coachType = route?.params?.coachType || 'productivity';
  const coachConfig = coachExamples[coachType] || coachExamples.productivity;
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'coach',
      text: `${coachConfig.greeting}\n\n${coachConfig.examples.map((ex, i) => `• "${ex}"`).join('\n')}\n\nWhat would you like to work on?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState(coachConfig.examples?.[0] || '');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attachedDocument, setAttachedDocument] = useState(null);
  const scrollViewRef = useRef(null);
  const recognitionRef = useRef(null);
  const authRetryCount = useRef(0);

  // Get API key status for debugging
  const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY || 
                 process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    setQuote(getRandomQuote());
    // Temporarily skip Firebase calls
    console.log('ChatScreen loaded - Firebase calls temporarily disabled');
    console.log('API Key present:', apiKey ? 'YES' : 'NO');
    setIsLoadingConversation(false);
    // loadUserProfile();
    // loadOrCreateConversation();
    checkSubscription();
    loadMessageCount();
    // checkVoiceAvailability();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 800);
    }
    
    // Auto-play coach responses if voice is enabled
    if (voiceEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'coach' && !isLoading) {
        handleSpeakMessage(lastMessage.text);
      }
    }
  }, [messages, voiceEnabled]);

  const checkVoiceAvailability = () => {
    const voiceStatus = isVoiceAvailable();
    console.log('Voice capabilities:', voiceStatus);
  };

  const checkSubscription = async () => {
    const proStatus = await checkProStatus();
    setIsPro(proStatus);
  };

  const loadMessageCount = async () => {
    try {
      const today = new Date().toDateString();
      const stored = await AsyncStorage.getItem('messageCount');
      if (stored) {
        const { date, count } = JSON.parse(stored);
        if (date === today) {
          setMessageCount(count);
        } else {
          // New day, reset count
          setMessageCount(0);
          await AsyncStorage.setItem('messageCount', JSON.stringify({ date: today, count: 0 }));
        }
      }
    } catch (error) {
      console.error('Error loading message count:', error);
    }
  };

  const incrementMessageCount = async () => {
    const today = new Date().toDateString();
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    await AsyncStorage.setItem('messageCount', JSON.stringify({ date: today, count: newCount }));
  };

  const loadUserProfile = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.uid);
        console.log('User profile loaded:', profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadOrCreateConversation = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        if (authRetryCount.current < 5) {
          authRetryCount.current += 1;
          console.warn(`No user found yet (attempt ${authRetryCount.current}/5), waiting for auth...`);
          setTimeout(loadOrCreateConversation, 500);
          return;
        } else {
          console.error('Auth timeout - user still not found after 5 retries');
          setIsLoadingConversation(false);
          return;
        }
      }

      console.log('User found, creating conversation for:', user.uid);

      // Check if we're resuming an existing conversation
      const params = route?.params || {};
      if (params.conversationId && params.resuming) {
        setConversationId(params.conversationId);
        console.log('Resuming conversation:', params.conversationId);
        
        // Load existing messages from this conversation
        try {
          const existingMessages = await getMessages(params.conversationId);
          
          if (existingMessages.length > 0) {
            // Convert Firestore messages to our format
            const formattedMessages = existingMessages.map((msg, index) => ({
              id: index + 1,
              role: msg.role,
              text: msg.text,
              timestamp: msg.timestamp?.toDate() || new Date()
            }));
            setMessages(formattedMessages);
            console.log(`Loaded ${formattedMessages.length} messages from Firestore`);
          }
        } catch (msgError) {
          console.error('Error loading messages:', msgError);
        }
      } else {
        // Create a new conversation for this coach
        try {
          const convId = await createConversation(user.uid, coachType);
          setConversationId(convId);
          console.log('Conversation created:', convId);
        } catch (convError) {
          console.error('Error creating conversation:', convError);
          // Continue anyway - we can still chat without saving
        }
      }

      setIsLoadingConversation(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setIsLoadingConversation(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Check message limit for free tier
    if (!isPro && messageCount >= 20) {
      alert('💡 Daily limit reached (20 messages). Upgrade to Pro for unlimited messaging!');
      return;
    }

    const userInput = inputText.trim();
    setInputText('');
    setShowSuggestions(false);
    setIsLoading(true);

    // Increment message count
    await incrementMessageCount();

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: userInput,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save user message to Firestore
    if (conversationId) {
      try {
        await addMessage(conversationId, {
          role: 'user',
          text: userInput,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }

    try {
      // Get AI response from Gemini with user context
      console.log('Calling generateCoachResponse with userProfile:', userProfile);
      const response = await generateCoachResponse(coachType, updatedMessages, userProfile || {});
      
      // Add coach response
      const coachMessage = {
        id: updatedMessages.length + 1,
        role: 'coach',
        text: response,
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, coachMessage]);

      // Save coach message to Firestore
      if (conversationId) {
        try {
          await addMessage(conversationId, {
            role: 'coach',
            text: response,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error saving coach message:', error);
        }
      }
    } catch (error) {
      console.error('Error getting coach response:', error);
      
      // Fallback message
      const errorMessage = {
        id: updatedMessages.length + 1,
        role: 'coach',
        text: 'I apologize, I\'m having trouble responding right now. Please try again.',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = async (text) => {
    if (!isPro) return; // Voice is Pro feature
    
    try {
      setIsSpeaking(true);
      await speakText(text);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error speaking message:', error);
      setIsSpeaking(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
      setSelectedImage(base64Image);
      
      // Add user message with image indicator
      const userMessage = {
        id: messages.length + 1,
        role: 'user',
        text: inputText.trim() || '📷 [Image uploaded]',
        image: base64Image,
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputText('');
      setSelectedImage(null);
      setIsLoading(true);

      // Save user message
      if (conversationId) {
        try {
          await addMessage(conversationId, {
            role: 'user',
            text: userMessage.text,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error saving user message:', error);
        }
      }

      try {
        // Get AI response with image
        const response = await generateCoachResponse(coachType, updatedMessages, userProfile, base64Image);
        
        const coachMessage = {
          id: updatedMessages.length + 1,
          role: 'coach',
          text: response,
          timestamp: new Date()
        };
        
        setMessages([...updatedMessages, coachMessage]);
        setIsLoading(false);

        // Save coach response
        if (conversationId) {
          try {
            await addMessage(conversationId, {
              role: 'coach',
              text: response,
              timestamp: new Date()
            });
          } catch (error) {
            console.error('Error saving coach message:', error);
          }
        }

        // Speak response if voice enabled
        if (voiceEnabled && isPro) {
          await speakText(response);
        }

        // Increment message count for free tier
        if (!isPro) {
          const newCount = messageCount + 1;
          setMessageCount(newCount);
          await AsyncStorage.setItem('messageCount', newCount.toString());
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleToggleVoice = () => {
    if (!isPro) {
      alert('🎙️ Voice responses are a Pro feature! Upgrade to hear your coach speak.');
      navigation.navigate('paywall');
      return;
    }
    
    if (voiceEnabled && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleStartListening = () => {
    if (isListening) {
      stopListening(recognitionRef.current);
      setIsListening(false);
      return;
    }
    
    const recognition = startListening(
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
        alert('Could not recognize speech. Please try again.');
      }
    );
    
    if (recognition) {
      recognitionRef.current = recognition;
      setIsListening(true);
    } else {
      alert('Speech recognition not available on this device.');
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const doc = result.assets[0];
        setAttachedDocument(doc);
        setInputText(inputText + `\n\n[Attached: ${doc.name}]`);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      alert('Could not attach document. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('library')}
        >
          <Text style={styles.backButtonText}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text variant="h3" style={styles.headerTitle}>Simon Says</Text>
          <Text variant="small" style={styles.headerSubtitle}>
            {coachType.charAt(0).toUpperCase() + coachType.slice(1)} Coach
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Inspirational Quote Header */}
      <View style={styles.quoteContainer}>
        <View style={styles.quoteRow}>
          <Text variant="small" style={styles.quote}>
            "{quote}"
          </Text>
          {!isPro && (
            <Text variant="tiny" color={colors.textTertiary} style={styles.messageCounter}>
              {messageCount}/20
            </Text>
          )}
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.role === 'user' ? styles.messageRowUser : styles.messageRowCoach
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleCoach
              ]}
            >
              <Text 
                variant="body" 
                style={styles.messageText}
                color={message.role === 'user' ? colors.textPrimary : colors.textPrimary}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        
        {/* Typing indicator */}
        {isLoading && (
          <View style={[styles.messageRow, styles.messageRowCoach]}>
            <View style={[styles.messageBubble, styles.messageBubbleCoach]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {/* Attachment button */}
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={handlePickDocument}
        >
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={1000}
            blurOnSubmit={false}
            returnKeyType="default"
          />
          {showSuggestions && inputText === '' && (
            <View style={styles.suggestionsContainer}>
              {coachConfig.examples.slice(0, 2).map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => setInputText(example)}
                >
                  <Text style={styles.suggestionText} numberOfLines={1}>{example}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={[
            styles.sendButton,
            inputText.trim() && !isLoading && styles.sendButtonActive
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.arrowIcon}>
              <Text style={[
                styles.arrowText,
                inputText.trim() && styles.arrowTextActive
              ]}>↑</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.marginHorizontal,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgSecondary,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    width: 40,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: typography.weightBold,
    marginBottom: 2,
  },
  headerSubtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.sizeSmall,
  },
  headerSpacer: {
    width: 40,
  },
  quoteContainer: {
    paddingHorizontal: layout.marginHorizontal,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgSecondary,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quote: {
    flex: 1,
    fontStyle: 'italic',
    textAlign: 'center',
    color: colors.textSecondary,
    fontWeight: typography.weightLight,
  },
  messageCounter: {
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    backgroundColor: colors.bgTertiary,
    borderRadius: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: layout.marginHorizontal,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  messageRowCoach: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.sm,
    borderRadius: 2,
  },
  messageBubbleCoach: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  messageBubbleUser: {
    backgroundColor: colors.bgTertiary,
    alignItems: 'flex-end',
  },
  messageText: {
    lineHeight: typography.lineHeightRelaxed * typography.sizeBody,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgSecondary,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 100,
    maxHeight: 240,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.sizeBody,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    backgroundColor: colors.bgPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    textAlignVertical: 'top',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  suggestionsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  suggestionChip: {
    flex: 1,
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: typography.sizeSmall,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.bgTertiary,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  arrowIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    fontWeight: typography.weightMedium,
    color: colors.textTertiary,
  },
  arrowTextActive: {
    color: '#fff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: spacing.xs,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textTertiary,
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  voiceButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.bgTertiary,
    marginRight: spacing.xs,
  },
  voiceButtonActive: {
    backgroundColor: colors.primary,
  },
  voiceIcon: {
    fontSize: 18,
  },
  imageButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.bgTertiary,
    marginRight: spacing.xs,
  },
  imageIcon: {
    fontSize: 18,
  },
  micButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.bgTertiary,
    marginRight: spacing.xs,
  },
  micButtonActive: {
    backgroundColor: colors.error,
  },
  micIcon: {
    fontSize: 18,
  },
  attachButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.bgTertiary,
    marginRight: spacing.xs,
  },
  attachIcon: {
    fontSize: 20,
  },
});
