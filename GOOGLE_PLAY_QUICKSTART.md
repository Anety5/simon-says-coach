# Quick Start: Google Play Service Account (5 Steps)

**BEFORE YOU START**: Sign out of ALL Google accounts, then sign in with ONLY your Play Console owner account.

---

## Step 1: Find Your Google Cloud Project

1. Go to: https://console.cloud.google.com
2. Click **project dropdown** at top (next to Google Cloud logo)
3. Look for project named:
   - "API Project" 
   - OR something related to your app
   - OR starts with `pc-api-`
4. **Select it**

**Can't find it?** It was auto-created when you made your Play Console account. Look for the oldest project.

---

## Step 2: Enable Required APIs

**API #1:**
1. Go to: https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com
2. Click **ENABLE** (or check if it says "MANAGE" = already enabled)
3. Wait 30 seconds

**API #2:**
1. Go to: https://console.cloud.google.com/apis/library/playdeveloperreporting.googleapis.com
2. Click **ENABLE** (or check if it says "MANAGE" = already enabled)
3. Wait 30 seconds

**API #3 (For Real-Time Notifications):**
1. Go to: https://console.cloud.google.com/apis/library/pubsub.googleapis.com
2. Click **ENABLE** (or check if it says "MANAGE" = already enabled)
3. Wait 30 seconds

---

## Step 3: Create Service Account + Add Roles

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click **+ CREATE SERVICE ACCOUNT**
3. Fill in:
   - **Name**: `RevenueCat-Simon-Says`
   - **ID**: (auto-fills)
   - **Description**: `RevenueCat service account`
4. Click **CREATE AND CONTINUE**
5. **Add TWO required roles** (this step is critical!):
   - Click "Select a role" dropdown
   - Search for and add: **Pub/Sub Editor** (enables real-time notifications)
   - Click **+ ADD ANOTHER ROLE**
   - Search for and add: **Monitoring Viewer** (monitors notification queue)
   - **Note**: If you get permission errors later, try **Pub/Sub Admin** instead of Editor
6. Click **CONTINUE**
7. Click **DONE** (skip the grant users section)

---

## Step 4: Download JSON Key

1. Find your new service account in the list
2. Click **three dots (⋮)** → **Manage keys**
3. Click **ADD KEY** → **Create new key**
4. Select **JSON**
5. Click **CREATE**
6. **JSON file downloads** - Save it! (Don't edit it)
7. **Copy the service account email** - looks like: `revenuecat-simon-says@PROJECT-ID.iam.gserviceaccount.com`

---

## Step 5A: Add to Play Console

1. Go to: https://play.google.com/console
2. **Settings** (gear icon) → **Users and permissions**
3. Click **Invite new users**
4. Enter your service account email: `revenuecat-simon-says@...iam.gserviceaccount.com`
5. Under **App permissions** → Click **Add app** → Select "Simon Says Coach"
6. Under **Account permissions**, check these THREE required boxes:
   - ✅ View app information and download bulk reports (read-only)
   - ✅ View financial data, orders, and cancellation survey responses
   - ✅ Manage orders and subscriptions
7. Click **INVITE USER** → **SEND INVITE**
8. You should see it as "Active" in Users and Permissions

---

## Step 5B: Upload to RevenueCat

1. Go to: https://app.revenuecat.com
2. Click your project → **Apps** → **Simon Says Coach (Play Store)**
3. Find **"Service Credentials"** section
4. Click **"Upload Service Account Credentials"**
5. Upload your JSON file
6. Click **Save**

---

## ⏰ NOW WAIT 24-36 HOURS (OR TRY THE WORKAROUND BELOW!)

**DO NOT:**
- ❌ Create new service accounts
- ❌ Download new JSON files
- ❌ Try to test purchases (they'll fail!)

**DO:**
- ✅ Leave everything as-is
- ✅ Come back tomorrow
- ✅ Test after 36 hours

### 🚀 WORKAROUND: Faster Validation (Try This!)

Don't want to wait 36 hours? Try this trick:

1. Go to: https://play.google.com/console
2. Select your app: "Simon Says Coach"
3. Go to **Monetize** → **Products** → **Subscriptions**
4. Find your subscription: `simon_says_pro_monthly`
5. Click to edit it
6. Change the **description** (add a space or period)
7. Click **Save**
8. Wait 5-10 minutes
9. Change it back to the original description
10. Click **Save** again

**This often triggers Google to validate credentials immediately!** Not guaranteed, but worth trying.

If it works, you'll see "Connected" status in RevenueCat within minutes instead of 36 hours.

---

## After 36 Hours: Test

1. Run your app
2. Go to Settings → RevenueCat Debug Tools
3. Run tests to verify everything works

---

## Stuck? Check These:

**"Can't download JSON"** → Try different browser, check Downloads folder

**"APIs won't enable"** → Wrong Google account signed in, use owner account

**"Service account not in Play Console"** → Wait 10-15 minutes, refresh page

**"RevenueCat shows error"** → NORMAL for first 36 hours, just wait

---

**Current Status:**
- ✅ RevenueCat app configured: `app19369b0f2f`
- ⏳ Service account: Needs setup (follow steps above)
- ⏳ Testing: Must wait 36 hours after setup

**Your package name:** `com.anonymous.simonsayscoach`
