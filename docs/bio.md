# Developer Biography

## About the Creator

**Annet Sumi** - Solo Founder & Full-Stack Developer

I'm an independent software developer passionate about building tools that help people work smarter, not harder. With a background in product design and engineering, I've spent years working with human physiology and function and now exploring how technology can augment human productivity without adding complexity.

## Background & Experience

### Technical Skills
- **Full-stack development**: React Native, Node.js, Python
- **Mobile & web**: Cross-platform development with Expo, responsive design
- **AI integration**: Prompt engineering, LLM API implementation (OpenAI, Anthropic, Google Gemini)
- **Cloud infrastructure**: Firebase, AWS, serverless architectures
- **Monetization**: RevenueCat, Stripe, freemium product strategy

### Product Philosophy
I believe the best productivity tools don't just track what you do - they understand *why* you're stuck and help you move forward. Generic advice doesn't work because everyone's context is different. That's why I built Simon Says AI Coach with 6 specialized personalities that adapt to your work style, goals, and preferences.

## Why I Built Simon Says

I built Simon Says for Simon.

Inspired by his minimalistic, beautiful approach to design, I wanted to create something simple and elegant for him - a tool that strips away complexity and focuses on what matters. His aesthetic sensibility shaped every decision: the black and white color palette, the clean typography, the uncluttered interface. 

The idea also came from my own struggle with productivity advice overload. I realized what I needed wasn't *more* advice, but **contextual coaching** - someone who could meet me where I was, understand my specific challenge, and give me actionable next steps based on my situation.

When I experimented with AI chatbots like ChatGPT, I saw the potential - but they lacked consistency and coaching methodology. Every conversation started from scratch. I wanted persistent context, specialized expertise, and a UX designed for habit formation.

**Simon Says AI Coach** is the tool I wished existed: 6 expert coaches in your pocket, available 24/7, adapting to your needs in real-time - all wrapped in the kind of beautiful, minimalist design Simon would appreciate.

## What I Learned Building This

### Technical Discoveries

1. **React Native ≠ Web**: The biggest lesson came mid-development - HTML elements and Web APIs don't work on React Native mobile. This forced a complete architectural pivot from web-compatible to native-first design.

2. **Native components are better anyway**: After converting all HTML (`<select>`, `<input type="range">`) to React Native components (TouchableOpacity, TextInput), the UX improved dramatically. Native buttons feel more responsive and fit the platform better.

3. **Debugging without USB is challenging**: Testing via manual APK transfer taught me to build visibility into the app itself - on-screen debug overlays, comprehensive error messages, and extensive logging.

4. **Null safety matters**: The "cannot read property 'name' of null" error taught me to implement defensive programming everywhere. Every object access now has optional chaining (`userProfile?.name`) and fallback values.

5. **Build processes are complex**: Metro bundling, Gradle builds, APK signing, AAB generation - each step has its own quirks. Understanding the full pipeline from code to installable app was essential.

### Product Insights

1. **Prompt engineering is a craft**: Each coach personality required 20+ iterations to get the tone and methodology right. The difference between "helpful" and "annoying" is subtle.

2. **Freemium balance is hard**: Decided to enable Pro for all users during demo phase rather than risk a bad first impression with artificial limits.

3. **Context personalization works**: Users respond better when the AI uses their name, profession, and focus area. Generic responses feel robotic.

4. **Mobile-first matters**: People need coaching when they're stuck, not when they're at a desk. Mobile is the right platform for this use case.

5. **Simplicity > Features**: Better to have 6 working coaches than 12 half-baked ones. Focus on core value first.

## Tech Challenges Solved

- **React Native Conversion**: Replaced all HTML elements with native components in under 24 hours
- **API Error Handling**: Implemented null-safe response parsing with specific error messages
- **UX Polish**: Fixed input sizing (100px min), navigation (menu button), and visual feedback
- **Build Pipeline**: Successfully generated release APK (67.3 MB) and AAB (46.5 MB) for Play Store
- **Git Workflow**: Managed rapid iteration with clear commits and comprehensive documentation
- **Deadline Pressure**: Delivered functional MVP with 3 days from crisis to submission

## Vision for the Future

Simon Says is just the beginning. I envision a world where:
- **AI coaching is ubiquitous** - Everyone has access to personalized guidance, not just executives who can afford $500/hour coaches
- **Mental models are shareable** - The productivity frameworks inside each coach can be remixed and contributed by the community
- **Teams coach together** - Shared coaching sessions where the AI helps teams align on priorities and resolve conflicts
- **Your coach knows you better than you know yourself** - Longitudinal data analysis spots burnout patterns before you do

## Beyond Simon Says

I'm fascinated by **AI-augmented productivity** and **human-centered design**. Previous projects include:
- A habit tracker that uses spaced repetition to reinforce positive behaviors
- A Notion template marketplace for solopreneurs
- Open-source contribution to React Native accessibility tooling

## Let's Connect

If you're building something in this space or want to collaborate, reach out!

- **GitHub**: https://github.com/Anety5
- **Project Repository**: https://github.com/Anety5/simon-says-coach
- **Email**: support@lavarocklabs.com

---

*Built for the Devpost AI Challenge. A solo project from concept to code with a critical pivot mid-development. Total build time: ~3 weeks including the HTML-to-native rewrite.*

**Version 1.0.2** released January 31, 2026
- Android APK: 67.3 MB
- Android AAB: 48.7 MB  
- 6 AI coaching personalities powered by Google Gemini 2.5 Flash
- Fully native React Native implementation
- RevenueCat subscription management integrated
- Google Play Open Testing live
