# Google Play Service Account Setup - Troubleshooting Guide

## 🎯 Your Situation

✅ **RevenueCat App Configured**: "Lava Rock Labs LLC/Simon Says Coach (Play Store)"  
✅ **App ID**: `app19369b0f2f`  
❌ **Service Account Credentials**: Not yet configured  

---

## 🚨 Common Issues You're Facing

### Issue 1: Multiple Google Accounts / IAM Confusion
You mentioned having **3 emails** - this is the #1 cause of permissions issues!

**Solution**: Use the **PRIMARY OWNER ACCOUNT** for everything.

#### Which Account Should You Use?

✅ **Use this account for ALL steps**:
- The Google account that **owns the Google Play Console** (where you uploaded your APK)
- This is usually the account you used when you first created the Play Console developer account
- Should have "Account owner" role in Play Console

❌ **Don't use**:
- Personal Google accounts not associated with Play Console
- Secondary accounts with "Admin" or "Developer" roles
- Random Gmail accounts

#### How to Check:
1. Go to https://play.google.com/console
2. Click **Settings** (gear icon) → **Users and permissions**
3. Look for the account with **"Account owner"** role
4. **Sign out of ALL Google accounts** in your browser
5. **Sign in ONLY with that account**

---

## Issue 2: Service Account JSON Download Failed

### Why This Happens:
- Wrong Google account signed in
- Service account created in wrong project
- Insufficient permissions in Google Cloud Console

### Step-by-Step Fix:

#### Step 1: Verify You're in the Right Google Cloud Project

1. Go to https://console.cloud.google.com
2. **Sign in with your Play Console OWNER account** (see Issue 1)
3. At the top, click the **project dropdown** (next to "Google Cloud")
4. Look for a project that matches your app:
   - Should be named something like "Simon Says Coach" or "Lava Rock Labs"
   - Or "API Project" (default Play Console project name)

**Don't have a project?** Google Play Console automatically creates one. Look for:
- Projects with old dates (probably your Play Console project)
- Project ID that looks like: `pc-api-XXXXXXXXXX`

#### Step 2: Create Service Account (Correctly This Time)

**IMPORTANT: Keep the same browser tab open and stay signed in to ONE account only!**

1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Verify** the project name at the top is correct
3. Click **+ CREATE SERVICE ACCOUNT**
4. Fill in:
   - **Service account name**: `RevenueCat-Simon-Says`
   - **Service account ID**: Will auto-populate
   - **Description**: "Service account for RevenueCat subscription management"
5. Click **CREATE AND CONTINUE**
6. **ADD REQUIRED ROLES** (DON'T SKIP THIS!):
   - Click **"Select a role"** dropdown
   - Type or scroll to find: **Pub/Sub → Pub/Sub Editor**
   - Click it to add
   - Click **+ ADD ANOTHER ROLE**
   - Type or scroll to find: **Monitoring → Monitoring Viewer**
   - Click it to add
   - **Why these roles?**
     - Pub/Sub Editor: Enables real-time purchase notifications from Google
     - Monitoring Viewer: Allows monitoring of the notification queue
   - **Alternative**: If you get permission errors later, use **Pub/Sub Admin** instead of Editor
7. Click **CONTINUE**
8. **Skip** the "Grant users access to this service account" section → Click **DONE**

#### Step 3: Download the JSON Key

1. Find your new service account in the list: `revenuecat-simon-says@....iam.gserviceaccount.com`
2. Click the **three dots** (⋮) on the right → **Manage keys**
3. Click **ADD KEY** → **Create new key**
4. Select **JSON** format
5. Click **CREATE**
6. **JSON file downloads automatically** - Save it somewhere safe!
   - It should be named like: `pc-api-XXXXXXX-abc123def456.json`
   - **This file contains secrets - don't share it or commit to Git!**

#### If You Can't Download:
- Check your browser's download folder - it may have downloaded but not shown a notification
- Check if browser pop-ups are blocked
- Try a different browser (Chrome, Firefox, Edge)
- Clear browser cache and try again

---

## Issue 3: API Enabling Errors

You mentioned getting errors when disabling/enabling APIs. Let's do this carefully:

### Required APIs:

You need **THREE** APIs enabled:
1. ✅ **Google Play Android Developer API**
2. ✅ **Google Play Developer Reporting API**
3. ✅ **Google Cloud Pub/Sub API** (for real-time notifications)

### How to Enable (Step-by-Step):

**IMPORTANT: Do this in the SAME Google Cloud Project as your service account!**

#### Enable API #1: Google Play Android Developer API

1. Go to: https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com
2. **Check project dropdown** at top - should show your Play Console project
3. You'll see either:
   - **"ENABLE" button** → Click it
   - **"MANAGE" button** → Already enabled! ✅
   - **"API ENABLED" badge** → Already enabled! ✅
4. Wait 30 seconds for it to process

#### Enable API #2: Google Play Developer Reporting API

1. Go to: https://console.cloud.google.com/apis/library/playdeveloperreporting.googleapis.com
2. **Check project dropdown** at top - should show your Play Console project
3. You'll see either:
   - **"ENABLE" button** → Click it
   - **"MANAGE" button** → Already enabled! ✅
   - **"API ENABLED" badge** → Already enabled! ✅
4. Wait 30 seconds for it to process

#### Enable API #3: Google Cloud Pub/Sub API

1. Go to: https://console.cloud.google.com/apis/library/pubsub.googleapis.com
2. **Check project dropdown** at top - should show your Play Console project
3. You'll see either:
   - **"ENABLE" button** → Click it
   - **"MANAGE" button** → Already enabled! ✅
   - **"API ENABLED" badge** → Already enabled! ✅
4. Wait 30 seconds for it to process
5. **Why this API?** Enables real-time purchase notifications from Google to RevenueCat

#### Common Errors When Enabling APIs:

**Error: "You don't have permission to enable APIs"**
- ❌ You're signed in with the wrong account
- ✅ Sign out, sign in with Play Console **owner** account

**Error: "Project doesn't have billing enabled"**
- These APIs are **FREE** - no billing required for basic usage
- If forced to enable billing, use your Play Console owner account's billing

**Error: "API already enabled in another project"**
- This is fine! Just means you enabled it somewhere else before
- Make sure you enable it in the **correct project** (your Play Console project)

---

## Issue 4: Grant Service Account Access to Play Console

After creating the service account and enabling APIs, you need to give it permission in Play Console:

### Step 1: Copy Service Account Email

From Google Cloud Console:
1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. Find your service account: `revenuecat-simon-says@...`
3. **Copy the full email address** (ends in `@...iam.gserviceaccount.com`)

### Step 2: Add to Play Console

1. Go to https://play.google.com/console
2. **Settings** (gear icon) → **Users and permissions**
3. Click **Invite new users**
4. Enter the service account email you copied
5. Under **App permissions**:
   - Click **Add app**
   - Select: "Simon Says Coach" (or your app name)
6. Under **Account permissions**, check these THREE boxes (required!):
   - ✅ **View app information and download bulk reports (read-only)**
   - ✅ **View financial data, orders, and cancellation survey responses**
   - ✅ **Manage orders and subscriptions**
   - **Note**: These specific permissions are required by RevenueCat!
   - Other permissions are optional
7. Click **INVITE USER** → **SEND INVITE**
8. You should see the service account listed as "Active" in Users and Permissions

**⏰ Wait Time**: Can take up to **36 hours** for permissions to activate!

---

## Issue 5: Upload JSON to RevenueCat

Once you have the JSON file and granted Play Console access:

### Step 1: Go to RevenueCat

1. Open https://app.revenuecat.com
2. Click your project: **Lava Rock Labs LLC/Simon Says Coach**
3. Go to **Apps** in sidebar
4. Click on: **Simon Says Coach (Play Store)**

### Step 2: Upload Service Credentials

1. Scroll to **"Service Credentials"** section
2. Click **"Upload Service Account Credentials"** or **"Configure"**
3. **Drag and drop** your JSON file OR click to browse
4. Click **Save**

### What You Should See:
- ✅ Green checkmark or "Connected" status
- OR ⚠️ "Credentials will be validated within 36 hours"

### Common Upload Errors:

**Error: "Invalid JSON format"**
- Make sure you downloaded the right file (should be `.json`)
- Don't edit the JSON file - upload it as-is
- Try downloading the key again

**Error: "Service account not found"**
- Service account email not added to Play Console yet
- Wait a few minutes and try again
- Verify email matches exactly

**Error: "Invalid Play Store credentials" (503 or 521)**
- **This is NORMAL for 24-36 hours after setup!**
- Wait and it will resolve automatically
- Don't create new credentials, just wait

---

## 📋 Complete Checklist

Use this to verify every step is done correctly:

### Google Cloud Setup
- [ ] Signed in with **Play Console owner account** only
- [ ] Found the correct **Google Cloud Project** (Play Console project)
- [ ] Created service account: `revenuecat-simon-says@...iam.gserviceaccount.com`
- [ ] Downloaded **JSON key file** successfully
- [ ] Enabled **Google Play Android Developer API**
- [ ] Enabled **Google Play Developer Reporting API**

### Google Play Console Setup
- [ ] Went to **Settings → API Access**
- [ ] Linked or found the service account
- [ ] Granted **Admin permissions** to service account
- [ ] Sent invite / saved permissions

### RevenueCat Setup
- [ ] Uploaded JSON file to RevenueCat app config
- [ ] Saw confirmation or "pending validation" message

### Wait Time
- [ ] Prepared to wait **up to 36 hours** for credentials to activate
- [ ] Don't make test purchases until after wait period

---

## 🔧 Alternative: Manual API Key Method (If All Else Fails)

If you're completely stuck with service accounts, there's a **legacy** method using OAuth credentials, but it's **not recommended** and has limitations.

**Recommendation**: Take a break, then try the service account method again with a fresh browser session using ONLY your Play Console owner account.

---

## ⏰ The 36-Hour Wait

**This is the most important part**: After you successfully upload the JSON to RevenueCat, **nothing will work for up to 36 hours**!

### What Happens During This Time:
- RevenueCat can't verify subscriptions yet → **Normal!**
- Test purchases will fail → **Normal!**
- Error messages "Invalid Play Store credentials" → **Normal!**
- RevenueCat dashboard shows "Pending" → **Normal!**

### What To Do:
1. ✅ Upload the JSON
2. ✅ Verify all APIs are enabled
3. ✅ Verify service account has Play Console permissions
4. ⏸️ **Wait 24-36 hours**
5. 🧪 Test after waiting

### 🚀 WORKAROUND: Faster Validation (Try This First!)

**Don't want to wait 36 hours?** There's a trick that often works to trigger Google's validation immediately:

#### Steps:
1. Go to https://play.google.com/console
2. Select your app: **Simon Says Coach**
3. Navigate to: **Monetize** → **Products** → **Subscriptions**
4. Find your subscription: `simon_says_pro_monthly`
5. Click on it to edit
6. Make a small change to the **description**:
   - Add a period at the end
   - Or add/remove a space
   - Or change one word
7. Click **Save changes**
8. **Wait 5-10 minutes**
9. Go back and **change the description back** to original
10. Click **Save changes** again

**Why this works:** Editing a product triggers Google to refresh API credentials validation.

**Success rate:** Not guaranteed, but works for many developers!

**If it works:** You'll see RevenueCat status change from "Pending" to "Connected" within 5-30 minutes instead of 36 hours.

**If it doesn't work:** Just wait the full 36 hours - it will definitely work then.

### Don't Do This:
- ❌ Delete and recreate service accounts (resets the timer!)
- ❌ Download new JSON keys (doesn't help!)
- ❌ Try different Google accounts (makes it worse!)
- ❌ Disable and re-enable APIs (can cause issues!)

---

## 🎯 Quick Troubleshooting

### "I have 3 emails and don't know which to use"

1. Go to https://play.google.com/console
2. Settings → Users and permissions
3. Use the account marked **"Account owner"**
4. Sign out of all other Google accounts

### "I can't download the JSON file"

1. Try a different browser
2. Check Downloads folder - might be there already
3. Disable pop-up blockers
4. Create a new key (delete old one first)

### "APIs won't enable"

1. Verify you're in the right Google Cloud project
2. Sign out of all accounts except owner
3. Use direct links provided above
4. Wait 5 minutes between enable attempts

### "Service account not showing in Play Console"

1. Wait 10-15 minutes after creation
2. Click "LINK SERVICE ACCOUNT" in API Access
3. Enter service account email manually
4. Refresh the page

### "RevenueCat says 'Invalid credentials'"

1. Did you wait 36 hours? → Keep waiting
2. Is service account email added to Play Console? → Check User permissions
3. Are both APIs enabled? → Verify in Google Cloud Console
4. Is JSON file correct? → Re-download and re-upload

---

## 📞 Next Steps

1. **Sign out of all Google accounts** in your browser
2. **Sign in ONLY with Play Console owner account**
3. Follow the steps above in order
4. Come back after 24-36 hours to test

**Your app is already configured in RevenueCat** (`app19369b0f2f`), so you just need to add the service credentials!

---

**Last Updated**: February 11, 2026  
**Your App**: Lava Rock Labs LLC/Simon Says Coach (Play Store)  
**RevenueCat App ID**: app19369b0f2f ✅
