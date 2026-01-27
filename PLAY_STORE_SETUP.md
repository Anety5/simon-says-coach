# Google Play Console Setup - Required Information

## URLs (Once Deployed to Firebase)

**Privacy Policy:** `https://simon-says-coach.web.app/privacy-policy.html`  
**Terms of Service:** `https://simon-says-coach.web.app/terms-of-service.html`  
**Support/Help:** `https://simon-says-coach.web.app/support.html`

## App Information

### Basic Details
- **App Name:** Simon Says AI Coach
- **Package Name:** com.simonsays.coach
- **Category:** Productivity
- **Content Rating:** Everyone
- **Contact Email:** [Your Email Address]

### Short Description (80 characters max)
```
AI productivity coach with 6 personalities. Voice, text & image guidance.
```

### Full Description (4000 characters max)
```
Simon Says is your personal AI productivity coach powered by Google Gemini 2.5 Flash. Get expert guidance through voice conversations, text chats, or image analysis.

🎯 6 SPECIALIZED COACH PERSONALITIES
• Motivational: Energizing support for your goals
• Analytical: Data-driven decision making
• Empathetic: Understanding and compassionate guidance
• Direct: No-nonsense, straight-to-the-point advice
• Creative: Out-of-the-box problem solving
• Strategic: Long-term planning and vision

✨ KEY FEATURES
• Voice Conversations: Speak naturally with your AI coach
• Text Chat: Get instant written responses
• Image Analysis: Upload photos for visual context
• Personalized Context: Save your goals, projects, and background
• Chat History: Access all your coaching conversations
• Custom AI Coaches: Create your own specialized coaches

🌟 COACH MARKETPLACE (NEW!)
Discover and purchase community-created AI coaches:
• Browse specialized coaches for niche expertise
• Support coach creators (70/30 revenue split)
• One-time purchases ($2.99-$19.99)
• Ratings and reviews from other users

🚀 POWERED BY GEMINI 2.5 FLASH
Built on Google's latest AI technology for:
• Intelligent task management
• Contextual understanding
• Multimodal input processing
• Natural conversation flow

💼 PERFECT FOR
• Entrepreneurs building businesses
• Students managing coursework
• Professionals optimizing workflows
• Anyone seeking personalized productivity guidance

📱 SIMPLE & ELEGANT
Clean, minimalist interface that gets out of your way. Focus on what matters: your conversation with your AI coach.

Get started today and discover the power of AI-guided productivity coaching!
```

## Required Assets

### App Icon
- **File:** `assets/logo-icon.svg` (export as PNG 512x512px)
- **Description:** Terracotta orange concentric cube design

### Feature Graphic (Required for Play Store)
- **Dimensions:** 1024 x 500 pixels
- **Format:** PNG or JPG
- **Content:** App name + logo + tagline

### Screenshots (Minimum 2 required)
- **Dimensions:** Minimum 320px, maximum 3840px
- **Format:** PNG or JPG
- Recommended: 1080x1920px (phone), 1920x1080px (tablet landscape)

**Suggested Screenshots:**
1. Welcome/Onboarding screen
2. Coach selection screen
3. Chat interface with conversation
4. Coach Marketplace browse screen
5. Custom coach creation
6. Voice/image features

## Deployment Steps

### 1. Build Final Web Bundle
```bash
npx expo export -p web
```

### 2. Copy Legal Pages to dist/
```bash
Copy-Item public\*.html dist\
```

### 3. Deploy to Firebase
```bash
firebase deploy --only hosting
```

### 4. Verify URLs Work
- Visit https://simon-says-coach.web.app/privacy-policy.html
- Visit https://simon-says-coach.web.app/terms-of-service.html
- Visit https://simon-says-coach.web.app/support.html

## In-App Legal Access

The app now includes an in-app **Privacy & Terms** screen accessible via:
- Hamburger menu → "PRIVACY & TERMS"
- Shows both Privacy Policy and Terms of Service
- Includes "View full version on web" button linking to Firebase URLs
- **This satisfies both requirements:**
  - ✅ Google Play requires web URL (Firebase hosting)
  - ✅ Users can also view directly in-app (better UX)

## Devpost Submission

Your Devpost documentation is **separate and unaffected:**
- `docs/proposal.md` - Project proposal for judges
- `docs/technical.md` - Technical architecture
- `docs/bio.md` - Developer story

**Links for Devpost:**
- **Live Demo:** https://simon-says-coach.web.app
- **GitHub:** https://github.com/Anety5/simon-says-coach (make public before submission)
- **Google Play Internal Testing:** [You'll get this URL after Play Console setup]
- **Documentation:** Link to GitHub docs/ folder or upload markdown to Devpost

## Next Steps

1. ✅ Legal pages created (`public/*.html`)
2. ✅ In-app Legal screen added to hamburger menu
3. ⏳ Copy HTML files to dist/ folder
4. ⏳ Deploy to Firebase Hosting
5. ⏳ Verify URLs work
6. ⏳ Create Play Console account ($25 one-time fee)
7. ⏳ Upload AAB file
8. ⏳ Fill in app information with URLs above
9. ⏳ Upload screenshots and assets
10. ⏳ Submit to internal testing track
11. ⏳ Get internal testing URL for Devpost
12. ⏳ Make GitHub repo public
13. ⏳ Submit to Devpost

---

**Note:** The privacy policy and terms apply to both web and mobile versions. Having web URLs is standard practice and required by Google Play Console.
