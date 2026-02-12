# Simon Says Coach 🎯

> **AI-powered personal coaching that actually works**  
> Built for busy professionals who need tactical advice, not generic platitudes.

[![Live on Google Play](https://img.shields.io/badge/Download-Google_Play-414141?style=for-the-badge&logo=google-play)](https://play.google.com/apps/test/com.anonymous.simonsayscoach/3)
[![Built with Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Devpost](https://img.shields.io/badge/Devpost-Submission-003E54?style=for-the-badge&logo=devpost)](https://devpost.com)

**Built for the [Devpost AI Challenge 2026]**  
By Lava Rock Labs LLC

---

## 💡 The Problem

Generic productivity advice is everywhere. "Just focus!" "Be more productive!" But when you're in the weeds—deciding between two projects, fighting distraction, or feeling stuck—you need **specific, contextual coaching**, not motivational posters.

## ✨ Our Solution

**Simon Says Coach** provides 6 specialized AI coaches powered by Google Gemini 2.0 Flash, each trained for specific challenges:
- 🎯 **Productivity**: Tactical task and time management systems
- 🧠 **Strategy**: Long-term thinking frameworks
- 📈 **Growth**: Career and skills development
- 🔍 **Focus**: Deep work and attention management
- 🌿 **Wellness**: Sustainable performance and balance
- 🎨 **Creative**: Ideation and creative process

Each coach learns your context, adapts to your style, and gives you the tactical push you need—right when you need it.

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

---

## 🛠️ Tech Stack

| Category | Technology | Why We Chose It |
|----------|-----------|-----------------|
| **AI Engine** | Google Gemini 2.0 Flash | Fast, context-aware responses with 2M token context window |
| **Mobile Framework** | React Native + Expo | Cross-platform development with native performance |
| **Backend** | Firebase (Auth + Firestore) | Real-time data sync, serverless architecture |
| **Monetization** | RevenueCat | Cross-platform subscription management |
| **State Management** | React Hooks + AsyncStorage | Simple, effective local state |
| **Deployment** | Google Play Store | Live production app with real users |

---

## 📱 Live Demo

**Download the app:** [Google Play Store](https://play.google.com/apps/test/com.anonymous.simonsayscoach/3)  
_(Currently live with users!)_

**Try it yourself:**
1. Install from Play Store
2. Complete 2-minute onboarding
3. Chat with any of the 6 AI coaches
4. See tactical, personalized coaching in action

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
- **GrWhat's Next

We built this in 3 weeks and already have paying users! Our roadmap:

**Short-term (Next 30 days):**
- [ ] Conversation history browser
- [ ] Custom coach creator (Pro exclusive)
- [ ] iOS App Store launch

**Medium-term (3-6 months):**
- [ ] Voice responses with ElevenLabs
- [ ] Function calling (calendar integration, task creation)
- [ ] Push notifications for daily check-ins
- [ ] Team/organization plans

**Long-term Vision:**
- Multi-modal coaching (voice, text, visual)
- Co� Team

**Lava Rock Labs LLC**
- Building practical AI tools for real people
- [Website](https://lavarocklabs.com) | [Twitter](https://twitter.com/lavarocklabs)

Built with ❤️ for the Devpost AI Challenge 2026

---

## 🙏 Acknowledgments

- **Google Gemini 2.0 Flash**: The AI engine that makes this coaching actually useful
- **Firebase**: Rock-solid backend infrastructure we can trust
- **RevenueCat**: Subscription management that just works
- **Expo**: Made React Native development actually enjoyable
- **Our Beta Testers**: For honest feedback that shaped this product

---

## 📄 License

© 2026 Lava Rock Labs LLC. All rights reserved.

---

## 🔗 Links

- **Live App**: [Google Play Store](https://play.google.com/apps/test/com.anonymous.simonsayscoach/3)
- **Devpost**: [View Submission](https://devpost.com)
- **Documentation**: See `/docs` folder for technical details
- **Support**: [support.html](public/support.html)

---

**⭐ If you find this project interesting, give it a star on GitHub!**ot—6 specialized coaches with distinct personalities
4. **Complete Implementation**: Frontend, backend, AI, monetization, deployment—fully functional
5. **Production-Ready**: Firebase backend, RevenueCat payments, proper error handling
6. **User-Centered Design**: Built from user feedback, not just technical showcase

**Technical Achievements:**
- ✅ 2M token context window for long conversations
- ✅ Real-time Firebase sync across devices
- ✅ RevenueCat subscription system with Play Store integration
- ✅ Custom AI prompts engineered for each coach personality
- ✅ Responsive, accessible mobile UI
- ✅ Deployed to production with active users

---

## 📊 Project Stats

- **Lines of Code**: ~3,500
- **Development Time**: 3 weeks
- **Coffee Consumed**: Immeasurable ☕
- **AI API Calls**: Growing daily 🚀
- **User Satisfaction**: High (based on Play Store reviews)

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
