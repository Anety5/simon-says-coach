# Simon Says AI Coach - Technical Documentation

## How We Built It

### The Journey: Web to Native

Simon Says Coach started with an ambitious goal: create a cross-platform AI coaching app using React Native that could run on web, iOS, and Android. However, mid-development we discovered a critical challenge that reshaped our entire architecture.

**The Discovery**
After building the onboarding flow with HTML elements (`<select>` dropdowns, `<input type="range">` sliders), we hit a wall when testing on Android: **HTML elements don't work in React Native mobile apps**. The app crashed immediately after the homepage loaded.

**The Pivot**
With only 3 days until our Devpost submission deadline, we made the decision to:
1. **Go Android-native first** - Focus on React Native mobile (not web)
2. **Complete rewrite** - Replace every HTML element with native React Native components
3. **Disable incompatible features** - Web Speech API doesn't exist on React Native

**The Conversion**
- **ContextEntryScreen**: `<select>` profession dropdown → TouchableOpacity button grid (12 professions)
- **ToneSelectionScreen**: `<input type="range">` sliders → 5 numbered buttons for each scale
- **ChatScreen**: `<input type="file">` → expo-document-picker native file picker
- **SettingsScreen**: All HTML inputs → TouchableOpacity native buttons
- **Voice features**: Web Speech API → Disabled (users can use keyboard mic, native voice planned)

**The Result**
A fully functional Android app with native UX, better performance, and a clear path forward. While we lost web compatibility in the MVP, we gained a polished mobile experience and valuable lessons about React Native architecture.

## Technology Stack

### Frontend
- **React Native (0.81.5)** - Native mobile app framework (Android)
- **Expo (SDK ~54.0.31)** - Development toolchain and native module access
- **React Navigation** - Screen routing and navigation
- **AsyncStorage** - Local data persistence for user preferences and message counts
- **expo-document-picker (14.0.8)** - Native file attachment support

### AI & Backend Services
- **Google Gemini 2.5 Flash API** - AI coaching via REST API (text generation)
- **Firebase (12.8.0)** - Authentication and Firestore database
- **Firebase Hosting** - Privacy policy and support pages hosting

### Monetization
- **RevenueCat (9.x)** - Subscription management fully integrated
- **Product ID**: simon_says_pro_monthly ($9.99/month)
- **API Key**: Configured via environment variables (.env file)
- **Current Status**: 20 message/day free tier actively enforced

### Build Tools
- **Metro Bundler** - JavaScript bundler for React Native
- **Android Gradle Build System** - APK/AAB generation
- **Git/GitHub** - Version control (https://github.com/Anety5/simon-says-coach)
- **Visual Studio Code** - IDE

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│  React Native Android App (Native Components Only)     │
│                                                         │
│  Screens (TouchableOpacity-based navigation):          │
│  - WelcomeScreen → ContextEntryScreen →                │
│    ToneSelectionScreen → CoachLibraryScreen →          │
│    ChatScreen                                           │
│                                                         │
│  State Management:                                      │
│  - AsyncStorage (local persistence)                     │
│  - React hooks (useState, useEffect)                    │
│  - Navigation state (React Navigation)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   UTILITY LAYER                         │
│                                                         │
│  src/utils/                                             │
│  - gemini.js: AI REST API + null-safe error handling    │
│  - firestore.js: Database operations (simplified)       │
│  - auth.js: Anonymous authentication (simplified)       │
│  - voice.js: DISABLED (React Native incompatibility)    │
│  - purchases.js: Pro enabled for all (demo mode)        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                      │
│                                                         │
│  Google Gemini API                                      │
│  - Model: gemini-2.5-flash                              │
│  - Context: Conversation history + system prompts       │
│  - Features: Text generation (images planned)           │
│                                                         │
│  Firebase (simon-says-coach project)                    │
│  - Firestore: Simplified for demo                       │
│  - Auth: Simplified anonymous auth                      │
│  - Hosting: Privacy policy deployment                   │
│                                                         │
│  RevenueCat                                             │
│  - Product: simon_says_pro_monthly ($9.99)              │
│  - Status: Configured, not yet active (demo mode)       │
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
- Native React Native TextInput component
- 500 character limit with counter display
- Message persistence to local AsyncStorage
- Real-time UI feedback

**Document Attachments (New Feature)**
- expo-document-picker for native file selection
- Supports PDF, images, and text documents
- Attachment button (📎) integrated in chat input
- Files prepared for Gemini API context (implementation in progress)

**Voice Input (Temporarily Disabled)**
- Web Speech API incompatible with React Native mobile
- Users can use Android keyboard's built-in microphone button (OS-level speech-to-text)
- Native voice input planned for future release using expo-speech

**Image Upload (Planned)**
- Future integration with Gemini's vision capabilities
- Document picker already supports image selection
- Will enable screenshots, diagrams, workflow analysis

**Voice Output (Temporarily Disabled)**
- Web Speech Synthesis API incompatible with React Native
- Native text-to-speech planned for future release using expo-speech

### 3. User Experience Flow

```
1. WelcomeScreen
   ↓
2. ContextEntryScreen (Native Components)
   - Name input (TextInput)
   - Profession selection (TouchableOpacity button grid, replaced <select>)
   - Current focus area (TextInput multiline)
   ↓
3. ToneSelectionScreen (Native Components)
   - Formality buttons (1-5, replaced <input type="range">)
   - Directness buttons (1-5, replaced <input type="range">)
   - Detail buttons (1-5, replaced <input type="range">)
   ↓
4. CoachLibraryScreen
   - 6 coach cards with descriptions
   - Animated selection feedback
   - "☰ Menu" navigation button
   ↓
5. ChatScreen
   - Message thread (coach + user)
   - Quote at top (motivational)
   - Input area (100px min height, proper padding)
   - Document attachment button (📎)
   - "☰ Menu" header button → returns to library
   - Debug overlay (API status, message count)
```

### 4. Freemium Implementation

**Current Status: Fully Operational**
- 20 message/day limit actively enforced for free users
- RevenueCat integrated with Google Play billing
- Product configured and ready for subscription purchases

**Message Limiting (Planned)**
```javascript
// Will be tracked via AsyncStorage
{
  date: "Sat Jan 25 2026",
  count: 15 // Resets daily
}
```

**Pro Features Design**
- Unlimited messages: No daily counter for Pro users
- Voice input: Planned with expo-speech (native implementation)
- Voice output: Planned with expo-speech (native text-to-speech)
- Document attachments: Currently available to all (will be Pro-gated)
- Full conversation history: AsyncStorage-based persistence

**RevenueCat Integration**
```javascript
// checkProStatus() in src/utils/purchases.js
// ACTIVE: Checks entitlements via RevenueCat SDK
const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
if (hasPro) {
  // Unlimited messages for Pro users
}
// Falls back to false on error (shows paywall)
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

### Android (Primary Platform)

**Release APK** (Direct install)
```bash
# Navigate to Android project
cd android

# Build release APK
.\gradlew.bat assembleRelease

# Output location (67.3 MB)
android/app/build/outputs/apk/release/app-release.apk
```

**Release AAB** (Google Play Console)
```bash
# Build App Bundle for Play Store
.\gradlew.bat bundleRelease

# Output location (46.5 MB)
android/app/build/outputs/bundle/release/app-release.aab
```

**Build Details**
- Last successful build: Jan 31, 2026 1:49 PM
- Version: 1.0.2 (versionCode 3)
- Gradle tasks: 462 (54 executed, 369 up-to-date)
- Build time: ~30 seconds
- Production signed with release keystore

### Firebase Hosting (Privacy Policy & Support)
```bash
# Deploy static pages
firebase deploy --only hosting

# Hosted pages:
# - public/privacy-policy.html
# - public/support.html
# - public/terms-of-service.html
```

### iOS (Future)
- Requires Apple Developer account ($99/year)
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
// src/utils/gemini.js - Null-safe response parsing
try {
  const response = await generateCoachResponse(...);
  
  // Check for valid response structure
  if (!data.candidates || !candidate.content.parts) {
    throw new Error("Invalid response structure");
  }
} catch (error) {
  if (error.message.includes('API key not found')) {
    return "API key configuration error";
  } else if (error.message.includes('Network connection')) {
    return "Please check your internet connection";
  } else {
    // Log actual error for debugging
    console.error('Gemini error:', error);
    return "I apologize, I'm having trouble...";
  }
}
```

### User Profile Null Safety
```javascript
// Fixed "cannot read property 'name' of null" error
const userName = userProfile?.name || 'there';
const profession = userProfile?.profession || '';
const focusArea = userProfile?.focus || '';

// Safe null checks throughout gemini.js
if (userProfile && userProfile.name) {
  // Use profile data
}
```

### Firebase Permission Errors
```javascript
// Simplified auth for demo - graceful degradation
catch (error) {
  if (error.code === 'permission-denied') {
    console.warn('Running in simplified demo mode');
  }
}
```

### Debug Overlay
- On-screen API status indicator (✅ Loaded / ❌ Missing)
- Message count display for testing
- Loading state visibility
- Actual API key hidden for security

## Future Technical Enhancements

1. **Native Voice Integration** - expo-speech for text-to-speech and speech recognition
2. **Image Analysis** - Gemini vision API for screenshot/document analysis
3. **Offline Mode** - SQLite for local message storage, sync on reconnect
4. **Analytics** - Mixpanel/Amplitude for user behavior tracking
5. **Push Notifications** - expo-notifications for daily coaching prompts
6. **Real-time Messaging** - Streaming responses from Gemini API
7. **Firebase Auth** - Full authentication with email/social sign-in
8. **RevenueCat Activation** - Enable subscription enforcement and payment processing
9. **Conversation Export** - PDF/markdown export of coaching sessions
10. **Multi-language Support** - i18n implementation for global reach

## Known Issues & Limitations (v1.0.2)

1. **Voice Features Disabled**: Web Speech API incompatible with React Native mobile
   - Workaround: Users can use Android keyboard microphone (OS-level)
   - Planned: Native voice implementation with expo-speech

2. **Simplified Firebase**: Auth and Firestore simplified for MVP
   - No user accounts (anonymous only)
   - Message history stored locally via AsyncStorage

4. **No iOS Build**: Android-only for initial release
   - iOS requires Apple Developer account
   - Planned for future release

5. **Document Attachments**: UI implemented but not fully integrated with Gemini
   - File picker functional
   - API integration in progress

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for Android builds)
- Java Development Kit (JDK) 17+
- Git

### Installation
```bash
# Clone repo
git clone https://github.com/Anety5/simon-says-coach.git
cd simon-says-coach

# Install dependencies
npm install

# Note: .env file with API keys required (not in repo)
# EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
# EXPO_PUBLIC_REVENUECAT_API_KEY=your_key_here

# Start development server
npm start
```

### Running on Device
```bash
# Start Metro bundler
npm start

# In another terminal, build and run on Android
cd android
.\gradlew.bat assembleDebug
# Install APK manually via USB or adb
```

### Key Development Learnings

**React Native vs Web**
- React Native mobile apps CANNOT use HTML elements (<select>, <input type="range">, <input type="file">)
- Must use React Native components only: TouchableOpacity, TextInput, ScrollView, etc.
- Web APIs (window, document, localStorage, Web Speech API) are not available
- Use native modules from Expo ecosystem (expo-document-picker, expo-speech, etc.)

**Architecture Pivot**
- Original design used web-compatible components for cross-platform deployment
- Mid-development discovery: HTML incompatible with React Native mobile
- Complete rewrite: All HTML → React Native native components
- Result: Better performance and native UX, but Android-only for MVP

**Testing Without USB Debugging**
- Manual APK transfer for testing (no direct device debugging)
- Added on-screen debug overlay for visibility
- Comprehensive error messages in UI (not just console logs)
- Iterative build-test-rebuild cycles

### Testing
- Android: Build release APK and install manually
- Debugging: Check Metro bundler logs and on-screen debug overlay
- API Testing: Gemini responses logged to console (first 200 chars)

## Contact & Support

- **GitHub**: https://github.com/Anety5/simon-says-coach
- **Email**: support@lavarocklabs.com
- **Privacy Policy**: (hosting at Firebase, URL pending)
- **Version**: 1.0.2 (Released Jan 31, 2026)

## Release Information

**Current Build**
- APK Size: 67.3 MB
- AAB Size: 48.7 MB
- Version: 1.0.2 (versionCode 3)
- Target SDK: Android API 36
- Minimum SDK: Android API 24 (Android 7.0+)
- Google Play: Open Testing track published

**What's New in v1.0.2**
- RevenueCat fully integrated with Google Play billing
- 20 message/day free tier enforcement active
- Production release signing configured
- Google Play Open Testing track live

**What's in v1.0.0-1.0.2**
- 6 specialized AI coaching personalities (Productivity, Strategy, Growth, Focus, Wellness, Creative)
- Customizable coaching tone (formality, directness, detail level)
- Document attachment support (📎 button in chat)
- Improved input UX (larger input box, proper padding)
- Menu navigation system (prevents accidental app closure)
- On-screen debug overlay for testing
- Null-safe error handling throughout

**Known Issues**
- Voice input/output temporarily disabled (native implementation planned)
- Document attachments UI complete but API integration in progress
- Firebase auth simplified for demo (full auth planned)
