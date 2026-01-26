# Simon Says AI Coach - Technical Documentation

## Technology Stack

### Frontend
- **React Native (0.81.5)** - Cross-platform mobile/web framework
- **Expo (SDK 54)** - Development toolchain and native module access
- **React Navigation** - Screen routing and navigation
- **AsyncStorage** - Local data persistence for user preferences and message counts

### AI & Backend Services
- **Google Gemini 2.5 Flash API** - Multimodal AI model (text + image inputs)
- **Firebase Authentication** - Anonymous user authentication
- **Firebase Firestore** - Cloud database for user profiles and conversation history
- **Firebase Hosting** - Web app deployment (https://simon-says-coach.web.app)

### Monetization
- **RevenueCat** - Subscription management and payment processing
- **Platform-aware implementation** - Native SDK on mobile, mock mode on web

### Development Tools
- **Git/GitHub** - Version control
- **Visual Studio Code** - IDE
- **Expo CLI** - Build and export tooling

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│  React Native App (iOS/Android) + Web App (Browser)    │
│                                                         │
│  Components:                                            │
│  - WelcomeScreen → ContextEntryScreen →                │
│    ToneSelectionScreen → CoachLibraryScreen →          │
│    ChatScreen                                           │
│                                                         │
│  State Management:                                      │
│  - AsyncStorage (local)                                 │
│  - React hooks (useState, useEffect)                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   UTILITY LAYER                         │
│                                                         │
│  src/utils/                                             │
│  - gemini.js: AI request handling + retry logic         │
│  - firestore.js: Database operations                    │
│  - auth.js: Anonymous authentication                    │
│  - voice.js: Speech-to-text, text-to-speech             │
│  - purchases.js: Subscription management                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                      │
│                                                         │
│  Google Gemini API                                      │
│  - Model: gemini-2.5-flash                              │
│  - Context: Conversation history + system prompts       │
│  - Features: Text generation, image analysis            │
│                                                         │
│  Firebase (simon-says-coach project)                    │
│  - Firestore: users/, conversations/, messages/         │
│  - Auth: Anonymous sign-in                              │
│  - Hosting: Static web build                            │
│                                                         │
│  RevenueCat                                             │
│  - SKU: simon_says_pro_monthly ($9.99)                  │
│  - Entitlement: "pro" feature access                    │
└─────────────────────────────────────────────────────────┘
```

## Core Features Implementation

### 1. AI Coaching System

**Coach Personalities** (6 specialized personas)
Each coach has a unique system prompt defining:
- Communication style (direct vs. nuanced)
- Methodology (frameworks like Eisenhower Matrix, SCAMPER, etc.)
- Response structure (immediate actions, accountability questions)

```javascript
// src/utils/gemini.js
const COACH_PROMPTS = {
  productivity: "You are a Productivity Coach...",
  strategy: "You are a Strategy Coach...",
  growth: "You are a Growth Coach...",
  focus: "You are a Focus Coach...",
  wellness: "You are a Wellness Coach...",
  creative: "You are a Creative Coach..."
}
```

**Context Personalization**
- User profile (name, profession, current focus area)
- Tone preferences (formality, directness, detail level - 1-5 scale)
- Conversation history (last 10 messages for continuity)

**API Implementation**
- REST API calls to Gemini 2.5 Flash endpoint
- Exponential backoff with jitter for retry logic (handles 429 rate limits)
- Max output tokens: 2048 (ensures complete responses)
- Temperature: 0.7 (balanced creativity and consistency)

### 2. Multimodal Input

**Text Input**
- Standard chat interface with 500 character limit
- Real-time typing indicator
- Message persistence to Firestore

**Voice Input (Pro feature)**
- Web Speech API for speech-to-text
- Browser-based (Chrome, Edge, Safari)
- Real-time transcription displayed in input field

**Image Upload**
- File upload via browser input
- Base64 encoding for API transmission
- Sent to Gemini with text prompt for context analysis
- Use cases: Screenshots of workflows, task lists, diagrams

**Voice Output (Pro feature)**
- Web Speech Synthesis API for text-to-speech
- Auto-plays coach responses when enabled
- Configurable rate, pitch, volume

### 3. User Experience Flow

```
1. WelcomeScreen
   ↓
2. ContextEntryScreen
   - Name input
   - Profession input
   - Current focus area (text area)
   ↓
3. ToneSelectionScreen
   - Formality slider (1-5)
   - Directness slider (1-5)
   - Detail slider (1-5)
   ↓
4. CoachLibraryScreen
   - 6 coach cards with descriptions
   - Animated selection feedback
   ↓
5. ChatScreen
   - Message thread (coach + user)
   - Quote at top (motivational)
   - Input area with voice/image buttons
   - Message counter (free: 20/day)
```

### 4. Freemium Implementation

**Message Limiting**
```javascript
// Tracked via AsyncStorage
{
  date: "Sat Jan 25 2026",
  count: 15 // Resets daily
}
```

**Pro Features Gating**
- Voice input: `if (!isPro) return;`
- Voice output: `if (!isPro) return;`
- Image upload: Available to all (for demo purposes)
- Unlimited messages: No counter check for Pro users

**RevenueCat Integration**
```javascript
// Platform detection
if (Platform.OS === 'web') {
  // Mock mode - free tier only
  return false;
} else {
  // Native mode - check entitlements
  const hasPro = customerInfo.entitlements.active['pro'];
}
```

## Database Schema (Firestore)

### users collection
```json
{
  "userId": "jCptS9ni17fbtvNOmJgLRIKHwBb2",
  "name": "Jane Doe",
  "profession": "Product Manager",
  "focus": "Launching new feature by Q2",
  "tone": {
    "formality": 3,
    "directness": 4,
    "detail": 3
  },
  "activeCoach": "productivity",
  "createdAt": "2026-01-25T10:00:00Z",
  "updatedAt": "2026-01-25T14:30:00Z"
}
```

### conversations collection
```json
{
  "conversationId": "abc123xyz",
  "userId": "jCptS9ni17fbtvNOmJgLRIKHwBb2",
  "coachId": "productivity",
  "createdAt": "2026-01-25T10:05:00Z",
  "lastMessageAt": "2026-01-25T14:30:00Z",
  "messageCount": 12
}
```

### conversations/{conversationId}/messages subcollection
```json
{
  "messageId": "msg001",
  "role": "user",
  "text": "Help me prioritize my tasks for today",
  "timestamp": "2026-01-25T14:30:00Z"
}
```

## Security & Permissions

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
    }
    
    // Users can only access their own conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

### API Key Management
- `.env` file (excluded from Git)
- Environment variables:
  - `EXPO_PUBLIC_GEMINI_API_KEY`
  - `EXPO_PUBLIC_REVENUECAT_API_KEY`

## Deployment

### Web (Firebase Hosting)
```bash
# Build static web bundle
npx expo export -p web

# Deploy to Firebase
firebase deploy --only hosting

# Live URL
https://simon-says-coach.web.app
```

### Android (APK)
```bash
# Generate native Android project
npx expo prebuild --platform android

# Build release APK
cd android
.\gradlew assembleRelease

# Output location
android/app/build/outputs/apk/release/app-release.apk
```

### iOS (Future)
- Requires Apple Developer account
- Build via Expo EAS Build or Xcode
- TestFlight for beta distribution

## Performance Optimizations

### API Efficiency
- **Retry logic**: Exponential backoff prevents hammering API on failures
- **Context truncation**: Only last 10 messages sent (reduces tokens)
- **Streaming disabled**: Single response for cleaner UX

### Data Persistence
- **AsyncStorage**: Fast local reads for user preferences
- **Firestore caching**: Firebase SDK caches recent queries
- **Lazy loading**: Messages fetched on demand

### Bundle Size
- Web build: 2.22 MB (compressed)
- Removed unused dependencies (expo-av deprecated)
- Code splitting (React Native handles automatically)

## Error Handling

### Gemini API Errors
```javascript
try {
  const response = await generateCoachResponse(...);
} catch (error) {
  if (error.status === 429) {
    // Rate limit - retry with backoff
  } else if (error.status === 401) {
    // Auth error - don't retry
  } else {
    // Fallback message
    return "I apologize, I'm having trouble...";
  }
}
```

### Firebase Permission Errors
```javascript
catch (error) {
  if (error.code === 'permission-denied') {
    console.warn('Running in demo mode');
  }
}
```

## Future Technical Enhancements

1. **Real-time messaging** - WebSocket connection for streaming responses
2. **Offline mode** - Service workers for web, SQLite for mobile
3. **Analytics** - Mixpanel/Amplitude for user behavior tracking
4. **A/B testing** - Firebase Remote Config for feature flags
5. **Push notifications** - Daily coaching prompts and check-ins
6. **Voice cloning** - Unique voice per coach personality (ElevenLabs API)

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase CLI (`npm install -g firebase-tools`)
- Android Studio (for Android builds)

### Installation
```bash
# Clone repo
git clone https://github.com/Anety5/simon-says-coach.git
cd simon-says-coach

# Install dependencies
npm install

# Create .env file
echo "EXPO_PUBLIC_GEMINI_API_KEY=your_key_here" > .env
echo "EXPO_PUBLIC_REVENUECAT_API_KEY=your_key_here" >> .env

# Start development server
npm start
```

### Testing
- Web: Press `w` in Expo CLI
- Android: Press `a` (requires emulator or device)
- iOS: Press `i` (requires macOS + Xcode)

## Contact & Support

GitHub: https://github.com/Anety5/simon-says-coach
Live Demo: https://simon-says-coach.web.app
