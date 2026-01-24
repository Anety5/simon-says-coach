# Simon Says Coach 🎯

**AI-powered personal coaching app for focus and productivity**

Built with React Native (Expo), Firebase, Google Gemini AI, and RevenueCat.

---

## 🌟 Features

### Core Functionality
- **6 Specialized AI Coaches**: Productivity, Strategy, Growth, Focus, Wellness, Creative
- **Personalized Onboarding**: Capture user context and coaching preferences
- **Real-time AI Chat**: Powered by Google Gemini AI with coach-specific personalities
- **Conversation Persistence**: All chats saved to Firebase Firestore
- **Smart Coaching Style**: Adjustable formality, directness, and detail levels

### Monetization (RevenueCat)
- **Free Tier**: 20 messages/day, 1 active coach
- **Pro Tier** ($9.99/month): 
  - Unlimited messages
  - All 6 coaches
  - Custom coach creator (coming soon)
  - Voice responses (planned)
  - Function calling actions (planned)

### Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Authentication, Firestore)
- **AI**: Google Gemini 2.0 Flash
- **Payments**: RevenueCat
- **Storage**: AsyncStorage for local preferences

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Expo CLI
- Firebase account
- Google AI API key
- RevenueCat account (optional)

### Installation

1. **Clone and install**:
```bash
cd simon-says-coach
npm install
```

2. **Configure environment variables** (`.env`):
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_REVENUECAT_API_KEY=goog_your_revenuecat_key
```

3. **Firebase is pre-configured** in `src/config/firebase.js`

4. **Start the app**:
```bash
npm start
# Then press 'w' for web, 'a' for Android, or 'i' for iOS
```

---

## 📁 Project Structure

```
simon-says-coach/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── Text.js
│   │   └── HamburgerMenu.js
│   ├── config/
│   │   ├── firebase.js   # Firebase configuration
│   │   └── theme.js      # Design system (colors, typography, spacing)
│   ├── screens/
│   │   ├── WelcomeScreen.js
│   │   ├── ContextEntryScreen.js
│   │   ├── ToneSelectionScreen.js
│   │   ├── CoachLibraryScreen.js
│   │   ├── ChatScreen.js
│   │   ├── PaywallScreen.js
│   │   └── SettingsScreen.js
│   └── utils/
│       ├── auth.js       # Firebase authentication
│       ├── firestore.js  # Database operations
│       ├── gemini.js     # AI integration
│       └── purchases.js  # RevenueCat integration
├── assets/              # App icons and images
├── App.js              # Main app entry point
└── package.json
```

---

## 🎨 Design Philosophy

Minimalist aesthetic inspired by [Better Creating](https://bettercreating.co):
- Clean typography with generous whitespace
- Terracotta (#E8704A) as primary accent
- 8px grid system for consistent spacing
- No-fluff, tactical coaching approach

---

## 🔧 Configuration

### Firebase Setup
The app uses Firebase for:
- Anonymous authentication
- User profiles (Firestore)
- Conversation storage

Already configured in `src/config/firebase.js`.

### RevenueCat Setup
For monetization:
1. Sign up at [RevenueCat](https://app.revenuecat.com)
2. Create product: `pro_monthly`
3. Create entitlement: `pro`
4. Add API key to `.env`

See `REVENUECAT_SETUP.md` for detailed instructions.

---

## 🤖 AI Coaching Personalities

Each coach has a unique system prompt optimized for specific use cases:

- **Productivity**: Tactical systems for tasks and time management
- **Strategy**: Long-term thinking and decision frameworks
- **Growth**: Skills development and career progression
- **Focus**: Deep work and attention management
- **Wellness**: Balance and sustainable performance
- **Creative**: Idea generation and creative process

---

## 📱 Screens Overview

1. **Welcome**: App intro with fade-in animation
2. **Context Entry**: User profile (name, profession, focus)
3. **Tone Selection**: Coaching style preferences (formality, directness, detail)
4. **Coach Library**: Select from 6 specialized coaches
5. **Chat**: Real-time AI coaching conversation
6. **Settings**: Edit profile, preferences, view subscription
7. **Paywall**: Pro subscription upgrade ($9.99/month)

---

## 🚧 Roadmap

- [ ] Conversation history browser
- [ ] Custom coach creator (Pro feature)
- [ ] Voice responses (ElevenLabs integration)
- [ ] Function calling for actions (calendar, tasks, etc.)
- [ ] iOS and Android native builds
- [ ] Push notifications for daily check-ins

---

## 📄 License

Private project - All rights reserved

---

## 👤 Author

Built for the Devpost AI Challenge by the Lava Rock Labs team.

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful coaching responses
- Firebase for reliable backend infrastructure
- RevenueCat for seamless subscription management
- Expo for rapid React Native development
