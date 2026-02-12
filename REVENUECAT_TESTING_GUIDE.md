# RevenueCat SDK Testing Guide

## 🚀 Quick Start Testing

### Step 1: Verify API Key Configuration

Your API key should start with: `goog_...` (Google Play Android SDK key)

✅ **Check that your .env file has the correct format** (starts with `goog_` for Android)

⚠️ **Common Issue**: If you previously had a JavaScript/Web SDK key (starts with `rcb_` or similar), that won't work for native Android apps. You need the **Google Play Public SDK Key** specifically.

### Step 2: Rebuild the App

The environment variables need to be baked into the native code:

```powershell
# Clean rebuild
npx expo prebuild --clean --platform android

# Run on Android
npm run android
```

### Step 3: Access the Debug Screen

Once the app is running:

1. Navigate to **Settings** (from hamburger menu)
2. Scroll to the bottom
3. Tap **"🔧 RevenueCat Debug Tools"** (only shows in development mode)

### Step 4: Run Tests in Order

In the Debug Screen, run these tests one by one:

#### Test 1: Configuration Check
- Automatically runs on screen load
- Should show: ✅ Configuration OK
- Verifies API key format is correct

#### Test 2: SDK Initialization
- Tap **"1. Test SDK Initialization"**
- Should show: ✅ SDK initialized successfully!
- If fails: Check error in console logs

#### Test 3: Check Pro Status
- Tap **"2. Check Pro Status"**
- Should show: ❌ No Pro subscription (if you haven't purchased yet)
- This confirms SDK can communicate with RevenueCat

#### Test 4: Get Offerings
- Tap **"3. Get Offerings"**
- Should show your packages (monthly package)
- **If this fails**: Your RevenueCat dashboard needs configuration

#### Test 5: Test Purchase (REAL!)
- Tap **"4. Test Purchase (Real!)"**
- This will open Google Play billing
- Use a real test account or cancel to avoid charges

#### Test 6: Test Restore
- Tap **"5. Test Restore"**
- Restores previous purchases if any exist

---

## 🔍 Common Issues & Solutions

### Issue 1: "Invalid API Key Format"

**Symptoms:**
```
❌ Invalid RevenueCat API key format!
Current key starts with: rcb_
You may have a JavaScript/Web SDK key instead of Android SDK key
```

**Solution:**
1. Go to RevenueCat Dashboard → Project Settings → API Keys
2. Find the **"Google Play"** section
3. Copy the **"Public Android SDK key"** (starts with `goog_`)
4. Update `.env` file:
   ```env
   EXPO_PUBLIC_REVENUECAT_API_KEY=goog_YOUR_KEY_HERE
   ```
5. Run `npx expo prebuild --clean --platform android`

---

### Issue 2: "No offerings available"

**Symptoms:**
```
❌ No offerings found - check RevenueCat dashboard!
```

**Solution:**
1. Go to RevenueCat Dashboard → **Offerings**
2. Make sure you have an offering called **"default"**
3. Click **"Make Current Offering"** next to "default"
4. Open the "default" offering
5. Verify it has a package with identifier **"monthly"** (exactly this name!)
6. The package should be linked to product `simon_says_pro_monthly`

---

### Issue 3: "Monthly package not found"

**Symptoms:**
```
❌ Monthly package not found!
Available packages: yearly
```

**Solution:**
Your package identifier doesn't match what the code expects.

1. Go to RevenueCat Dashboard → Offerings → default
2. Edit or add a package
3. Set **Identifier** to exactly: `monthly` (lowercase, no spaces)
4. Link it to product: `simon_says_pro_monthly`
5. Save

---

### Issue 4: "Product not found in Google Play Console"

**Symptoms:**
```
❌ Purchase error: Product not found
💡 Make sure product ID "simon_says_pro_monthly" exists in Play Console
```

**Solution:**
1. Go to Google Play Console → Monetize → Subscriptions
2. Verify you have a subscription with ID: `simon_says_pro_monthly`
3. Make sure it's **activated** (not in draft)
4. Product ID must match exactly (case-sensitive!)

---

### Issue 5: "RevenueCat not initialized"

**Symptoms:**
```
⚠️ RevenueCat not initialized, cannot check Pro status
```

**Solution:**
1. Close and restart the app completely
2. Check the console logs on app startup
3. Should see: ✅ RevenueCat initialized in App.js

---

## 📱 Testing Flows

### Complete Purchase Flow Test

1. **Start app** → Should auto-initialize RevenueCat
2. **Navigate to Library** → Try to select a locked coach
3. **Paywall appears** → Click "Subscribe for $9.99/month"
4. **Google Play opens** → Complete purchase (or cancel)
5. **If successful** → Should see "🎉 Welcome to Pro!"
6. **All coaches unlocked** → Try switching coaches

### Restore Purchase Test

1. **Uninstall app** (or clear data)
2. **Reinstall app**
3. **Navigate to Paywall**
4. **Click "Restore Purchases"**
5. **Should see** → "✅ Purchases restored! Pro features activated."

---

## 📊 What the Console Logs Tell You

### Good Logs (Everything Working):
```
🔄 Initializing RevenueCat SDK...
Platform: android
API Key prefix: goog_gUkuL...
✅ RevenueCat initialized successfully!
📝 Fetching offerings from RevenueCat...
Found 1 packages in current offering:
  - monthly: Pro Monthly ($9.99)
```

### Bad Logs (Configuration Problem):
```
❌ RevenueCat API key not found!
Check: app.config.js extra.EXPO_PUBLIC_REVENUECAT_API_KEY
Check: .env file has EXPO_PUBLIC_REVENUECAT_API_KEY=goog_...
```

---

## 🎯 RevenueCat Dashboard Checklist

Use this to verify your dashboard is configured correctly:

### Apps Tab
- [ ] **App added**: "Simon Says Coach" or similar
- [ ] **Platform**: Google Play Store
- [ ] **Package name**: `com.anonymous.simonsayscoach`
- [ ] **Status**: Connected (green checkmark)

### Products Tab
- [ ] **Product ID**: `simon_says_pro_monthly`
- [ ] **Type**: Subscription
- [ ] **Duration**: Monthly
- [ ] **Status**: Active

### Entitlements Tab
- [ ] **Identifier**: `pro`
- [ ] **Products attached**: `simon_says_pro_monthly`

### Offerings Tab
- [ ] **Offering ID**: `default`
- [ ] **Current offering**: ✅ (checkbox marked)
- [ ] **Package identifier**: `monthly` (exactly this!)
- [ ] **Package product**: `simon_says_pro_monthly`
- [ ] **Package type**: Monthly

---

## 🛠️ Code Changes Made

The following improvements were made to fix the SDK:

1. **Environment variable access** → Changed from `process.env` to `Constants.expoConfig.extra`
2. **API key validation** → Checks if key starts with `goog_` for Android
3. **Platform checks** → Only initializes on Android (not web/iOS)
4. **Detailed logging** → Every step logs success/failure with helpful tips
5. **Error handling** → Specific error messages with solutions
6. **Debug screen** → Interactive testing tool in Settings → Developer

---

## 📞 Need Help?

If you're still having issues:

1. **Check the Debug Screen console logs** - They provide specific error messages
2. **Verify RevenueCat Dashboard** - Use the checklist above
3. **Check Google Play Console** - Product must exist and be activated
4. **Restart the app** - Some changes require a full restart

---

## ✅ Success Criteria

You know it's working when:

- ✅ Debug screen shows "Configuration OK"
- ✅ SDK initializes without errors
- ✅ Offerings return your monthly package
- ✅ Purchase flow opens Google Play billing
- ✅ After purchase, Pro features unlock

---

**Last Updated:** February 11, 2026
**Your API Key Format:** `goog_...` ✅ Correct!
**Platform:** Android (Google Play) ✅
**Product ID:** `simon_says_pro_monthly` ✅
