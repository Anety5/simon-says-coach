# RevenueCat Integration Guide - Simon Says Coach (Android)

**DEVPOST REQUIREMENT** - Must be implemented for contest submission

## 🎯 Overview
RevenueCat handles subscription management for Pro tier ($9.99/month)

**Pro Features:**
- Unlimited messages (Free: 20/day)
- All 6 coaches (Free: 1 coach only)
- Custom coach creator
- Voice responses (ElevenLabs)
- Function calling actions

---

## 📦 Step 1: Install RevenueCat SDK

```bash
cd C:\Users\Annet\Documents\Simon-says-coach
npm install react-native-purchases
npx expo prebuild
```

---

## 🔑 Step 2: Create RevenueCat Account & Get API Keys

1. Go to https://app.revenuecat.com/signup
2. Create account (use Google/GitHub for speed)
3. Create new project: **"Simon Says Coach"**
4. Go to **Project Settings** → **API Keys**
5. Copy **Public API Key** (starts with `goog_`)

**Save API key to .env:**
```env
EXPO_PUBLIC_REVENUECAT_API_KEY=goog_xxxxxxxxxxxxxx
```

---

## 🛍️ Step 3: Configure Products in RevenueCat Dashboard

### A. Create Google Play App

1. In RevenueCat dashboard → **Apps** → **+ New**
2. Select **Google Play Store**
3. Name: `Simon Says Coach Android`
4. Bundle ID: `com.anonymous.simonsayscoach` (MUST MATCH your package.json android.package)
5. Click **Save**
6. **IMPORTANT**: You'll need to upload your service account JSON from Google Play Console for app verification

### B. Create Product (Subscription)

1. Go to **Products** tab
2. Click **+ New**
3. Configure:
   - **Product ID**: `simon_says_pro_monthly` (MUST match Google Play Console exactly!)
   - **Type**: Subscription
   - **Price**: $9.99 USD
   - **Duration**: 1 month
   - **Description**: "Simon Says Coach Pro - Unlimited coaching"
4. Click **Save**

### C. Create Entitlement

1. Go to **Entitlements** tab
2. Click **+ New**
3. Configure:
   - **Identifier**: `pro`
   - **Description**: "Access to all Pro features"
4. Click **Save**
5. Click **Attach Products** → Select `pro_monthly` → Attach

### D. Create Offering

1. Go to **Offerings** tab
2. Click **+ New**
3. Configure:
   - **Identifier**: `default`
   - **Description**: "Default subscription offering"
   - **Make this the current offering**: ✓ (checked)
4. Click **Packages** → **+ Add Package**
   - **Identifier**: `monthly` (exactly this - the code looks for this!)
   - **Product**: `simon_says_pro_monthly` (select from dropdown)
   - **Type**: Monthly
5. Click **Save**
6. **IMPORTANT**: Make sure "Current Offering" is set to "default"

---

## 🔧 Step 4: Configure Google Play Console

### A. Create Subscription Product in Play Console
Simon Says Coach)
3. Navigate to **Monetize** → **Subscriptions**
4. Click **Create subscription**
5. Configure:
   - **Product ID**: `simon_says_pro_monthly` (MUST match what you see in your screenshot!)
   - **Name**: Simon Says Pro Monthly
   - **Description**: Unlock unlimited coaching sessions, all 6 coaches, custom coach creator, and voice responses
   - **Billing period**: 1 month
   - **Base plan**: $9.99 USD
6. Click **Save** and **Activate** Coach Pro
   - **Description**: Unlock unlimited coaching sessions, all 6 coaches, custom coach creator, and voice responses
   - **Price**: $9.99 USD
   - **Billing period**: 1 month
   - **Free trial**: 7 days (optional)
6. Click **Save**

### B. Link RevenueCat to Google Play (Service Account Setup)

**⚠️ IMPORTANT: This step is complex and has a 36-hour activation time!**

**Having Issues?** See the detailed troubleshooting guides:
- 📋 **GOOGLE_PLAY_QUICKSTART.md** - Simple 5-step guide
- 🔧 **GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md** - Complete troubleshooting

**Quick Summary:**
1. Go to Google Cloud Console (use Play Console owner account ONLY)
2. Enable Google Play Android Developer API
3. Enable Google Play Developer Reporting API
4. Create service account and download JSON key
5. Add service account to Play Console with Admin permissions
6. Upload JSON to RevenueCat
7. **Wait 24-36 hours** for activation!

**Common Issues:**
- Multiple Google accounts → Use owner account only
- Can't download JSON → Try different browser
- API enable errors → Wrong project selected
- "Invalid credentials" in RevenueCat → Normal for 36 hours

---

## 💻 Step 5: Code Implementation

### A. Initialize RevenueCat in App.js

```javascript
import Purchases from 'react-native-purchases';

export default function App() {
  useEffect(() => {
    // Initialize RevenueCat
    const initRevenueCat = async () => {
      try {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG); // Remove in production
        await Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
        });
        console.log('RevenueCat initialized');
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
      }
    };

    initRevenueCat();
  }, []);

  // ... rest of app
}
```

### B. Create Paywall Screen

Create `src/screens/PaywallScreen.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import Purchases from 'react-native-purchases';

export default function PaywallScreen({ navigation }) {
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setOfferings(offerings.current);
      }
    } catch (error) {
      console.error('Error loading offerings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!offerings) return;
    
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(
        offerings.availablePackages[0]
      );
      
      // Check if user now has Pro entitlement
      if (customerInfo.entitlements.active['pro']) {
        console.log('Purchase successful! User is now Pro');
        navigation.goBack();
      }
    } catch (error) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
        alert('Purchase failed. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active['pro']) {
        alert('Purchases restored successfully!');
        navigation.goBack();
      } else {
        alert('No purchases to restore.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('Failed to restore purchases.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const monthlyPackage = offerings?.availablePackages[0];
  const price = monthlyPackage?.product.priceString || '$9.99';

  return (
    <ScrollView style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Upgrade to Pro
      </Text>

      {/* Pro Features */}
      <View style={styles.featuresContainer}>
        <FeatureItem icon="✓" text="Unlimited coaching messages" />
        <FeatureItem icon="✓" text="Access to all 6 coaches" />
        <FeatureItem icon="✓" text="Create custom coaches" />
        <FeatureItem icon="✓" text="Voice responses" />
        <FeatureItem icon="✓" text="AI-powered action items" />
      </View>

      {/* Pricing */}
      <View style={styles.pricingContainer}>
        <Text variant="h2" style={styles.price}>
          {price}
        </Text>
        <Text variant="body" style={styles.pricePeriod}>
          per month
        </Text>
      </View>

      {/* CTA Button */}
      <Button
        title={isPurchasing ? 'Processing...' : 'Start Pro Subscription'}
        onPress={handlePurchase}
        disabled={isPurchasing}
        style={styles.purchaseButton}
      />

      {/* Restore Button */}
      <Button
        title="Restore Purchases"
        onPress={handleRestore}
        variant="secondary"
        style={styles.restoreButton}
      />

      {/* Legal */}
      <Text variant="small" style={styles.legal}>
        Subscription automatically renews unless auto-renew is turned off at
        least 24-hours before the end of the current period. Cancel anytime.
      </Text>
    </ScrollView>
  );
}

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text variant="body" style={styles.featureIcon}>
      {icon}
    </Text>
    <Text variant="body" style={styles.featureText}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
  },
  title: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    color: colors.primary,
    marginRight: spacing.sm,
    fontSize: 20,
  },
  featureText: {
    flex: 1,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  price: {
    fontSize: 48,
    color: colors.primary,
  },
  pricePeriod: {
    color: colors.textSecondary,
  },
  purchaseButton: {
    marginBottom: spacing.md,
  },
  restoreButton: {
    marginBottom: spacing.xl,
  },
  legal: {
    textAlign: 'center',
    color: colors.textTertiary,
    marginBottom: spacing.xl,
  },
});
```

### C. Check Entitlements (Pro Status)

Create `src/utils/revenuecat.js`:

```javascript
import Purchases from 'react-native-purchases';

/**
 * Check if user has active Pro subscription
 * @returns {Promise<boolean>}
 */
export const checkIsProUser = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return false;
  }
};

/**
 * Get current subscription status
 * @returns {Promise<object>}
 */
export const getSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const proEntitlement = customerInfo.entitlements.active['pro'];
    
    return {
      isPro: proEntitlement !== undefined,
      expirationDate: proEntitlement?.expirationDate,
      willRenew: proEntitlement?.willRenew,
      productIdentifier: proEntitlement?.productIdentifier,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return { isPro: false };
  }
};
```

### D. Gate Pro Features

Example in `CoachLibraryScreen.js`:

```javascript
import { checkIsProUser } from '../utils/revenuecat';

export default function CoachLibraryScreen({ navigation }) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkProStatus();
  }, []);

  const checkProStatus = async () => {
    const proStatus = await checkIsProUser();
    setIsPro(proStatus);
  };

  const handleCoachSelect = (coachId) => {
    // Free users can only use first coach
    if (!isPro && activeCoach && activeCoach !== coachId) {
      // Show paywall
      navigation.navigate('Paywall');
      return;
    }
    
    setActiveCoach(coachId);
  };

  // ...
}
```

---

## ✅ Step 6: Testing

### Test in Development

1. Add test user in RevenueCat dashboard:
   - **Settings** → **Sandbox users** → **+ Add user**
2. Use sandbox environment for testing:
   ```javascript
   await Purchases.configure({
     apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
     useSandbox: true, // Enable for testing
   });
   ```

### Test Purchase Flow

1. Run app on Android device/emulator
2. Navigate to Coach Library
3. Try to select second coach (should show paywall)
4. Complete purchase with test card
5. Verify Pro features unlock

---

## 📱 Step 7: Add to Navigation

Update `App.js`:

```javascript
const [currentScreen, setCurrentScreen] = useState('welcome');

const renderScreen = () => {
  switch (currentScreen) {
    case 'welcome': return <WelcomeScreen navigation={navigation} />;
    case 'context': return <ContextEntryScreen navigation={navigation} />;
    case 'tone': return <ToneSelectionScreen navigation={navigation} />;
    case 'library': return <CoachLibraryScreen navigation={navigation} />;
    case 'chat': return <ChatScreen navigation={navigation} />;
    case 'paywall': return <PaywallScreen navigation={navigation} />;
    default: return <WelcomeScreen navigation={navigation} />;
  }
};
```

---

## 🎯 DEVPOST Submission Requirements

For contest submission, include:

1. ✅ RevenueCat SDK integrated
2. ✅ Product configured in dashboard
3. ✅ Paywall screen implemented
4. ✅ Pro features gated by entitlement
5. ✅ Screenshots of paywall in demo video
6. ✅ Mention RevenueCat in Devpost description:

```markdown
**Monetization:** 
Simon Says Coach uses RevenueCat for subscription management. 
Free tier includes 20 messages/day with 1 coach. Pro tier ($9.99/month) 
unlocks unlimited messages, all 6 AI coaches, custom coach creator, 
and voice responses.
```

---

## 🐛 Common Issues

### Issue: "No entitlements found"
**Solution:** Make sure you attached product to entitlement in RevenueCat dashboard

### Issue: "Purchase failed"
**Solution:** 
- Check Google Play Console has matching product ID
- Verify service credentials are uploaded to RevenueCat
- Test with sandbox mode enabled

### Issue: "App crashes on purchase"
**Solution:** 
- Run `npx expo prebuild` after installing SDK
- Ensure AndroidManifest.xml has billing permission

---

## 📚 Resources

- [RevenueCat Docs](https://docs.revenuecat.com/)
- [React Native Purchases](https://github.com/RevenueCat/react-native-purchases)
- [Google Play Billing](https://developer.android.com/google/play/billing)
- [Shipyard Contest Rules](https://devpost.com/software/revenuecat-shipyard-creator-contest)

---

**Implementation Time Estimate:** 2-3 hours (including dashboard setup)

**Priority:** HIGH - Required for contest submission by Feb 12, 2026
