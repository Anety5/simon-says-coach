# RevenueCat Quick Fix - Connect Your Real App!

## 🚨 Current Issue
Your RevenueCat is pointing to "Test Store" instead of your actual Google Play app!

## ✅ What You Need to Do (IN ORDER!)

### Step 1: Connect Your Google Play App to RevenueCat

1. **Go to RevenueCat Dashboard**: https://app.revenuecat.com/
2. Click **Apps** in the sidebar
3. **Delete or Archive** the "Test Store" app (it's just a placeholder)
4. Click **+ New App**
5. Select **Google Play Store**
6. Configure:
   - **App Name**: `Simon Says Coach`
   - **Package Name**: `com.anonymous.simonsayscoach` (your actual bundle ID)
7. Click **Save**

### Step 2: Link Google Play Console (Service Account)

RevenueCat needs to verify your app with Google Play:

1. In RevenueCat, go to your new app → **Settings**
2. Look for **Service Credentials** section
3. You'll need to upload a **Service Account JSON** from Google Play Console

**To get the Service Account JSON:**
1. Go to Google Play Console → **Setup** → **API access**
2. Create or use existing service account
3. Download the JSON key file
4. Upload it to RevenueCat

### Step 3: Update Your Product in RevenueCat

Good news! Your product ID `simon_says_pro_monthly` is already correct. But you need to:

1. Go to **Products** tab in RevenueCat
2. **Link it to your new app** (not Test Store)
3. Make sure the Product ID is exactly: `simon_says_pro_monthly`

### Step 4: Create Entitlement

1. Go to **Entitlements** tab
2. Click **+ New**
3. Configure:
   - **Identifier**: `pro` (exactly this!)
   - **Description**: "Pro subscription access"
4. Click **Save**
5. Click **Attach Products** → Select `simon_says_pro_monthly` → Attach

### Step 5: Create Offering with Correct Package ID

🚨 **THIS IS CRITICAL!** The package identifier must be exactly `monthly`:

1. Go to **Offerings** tab
2. Click **+ New** (or edit existing)
3. Configure:
   - **Identifier**: `default`
   - **Description**: "Default offering"
   - **Make this the current offering**: ✓ (checked)
4. Click **Add Package** (or edit existing package)
5. Configure the package:
   - **Identifier**: `monthly` ← **MUST BE EXACTLY THIS!**
   - **Product**: `simon_says_pro_monthly` (select from dropdown)
   - **Package Type**: Monthly
6. Click **Save**
7. Make sure "default" is set as the **Current Offering**

### Step 6: Get Your New API Key

1. Go to **Project Settings** → **API Keys**
2. Copy the **Google Play public SDK key** (starts with `goog_`)
3. Update your `.env` file:
   ```env
   EXPO_PUBLIC_REVENUECAT_API_KEY=goog_YOUR_NEW_KEY_HERE
   ```

### Step 7: Test in Your App

1. Run `npx expo prebuild --clean --platform android`
2. Run `npm run android`
3. Try purchasing the subscription in your app
4. Check RevenueCat dashboard for the transaction

---

## 📱 Your Current Configuration

Based on your screenshot and code:

- ✅ **Product ID**: `simon_says_pro_monthly` (correct!)
- ✅ **Bundle ID**: `com.anonymous.simonsayscoach`
- ✅ **Price**: $9.99/month
- ✅ **Entitlement**: `pro`
- ⚠️ **Package Identifier**: Must be `monthly` (check this!)
- ❌ **App**: Currently "Test Store" → Change to your real Google Play app

---

## 🔍 How to Verify It's Working

After completing the steps:

1. Open RevenueCat Dashboard
2. Go to **Customer Lists** → **Overview**
3. Make a test purchase in your app
4. You should see the transaction appear in RevenueCat within a few minutes

---

## ❓ Common Issues

**"No offerings available"**
- Make sure "default" is set as Current Offering
- Check that the package identifier is exactly `monthly`

**"Product not found"**
- Product ID in Google Play Console must match RevenueCat EXACTLY
- Must be: `simon_says_pro_monthly`

**"Purchase failed"**
- Make sure you're testing on a real device (not emulator for real purchases)
- Check that the app is signed with the correct key
- Verify the version code matches what's in Play Console

---

## 💡 The Key Changes Made

1. **Fixed environment variable access**: Changed from `process.env` to `Constants.expoConfig.extra`
2. **Installed dotenv**: Added `dotenv` package for `.env` file support
3. **Updated documentation**: All product IDs now show `simon_says_pro_monthly`

Your code is ready - you just need to update the RevenueCat dashboard configuration!
