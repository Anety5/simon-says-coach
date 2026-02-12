# 🚨 CRITICAL UPDATE: Service Account Setup

## ⚠️ Important Changes to Setup Process

The official RevenueCat documentation requires **specific roles and permissions** that must be configured exactly. I've updated all guides with the correct steps.

---

## 🔑 Key Differences from Initial Guides

### 1. Service Account Roles (CRITICAL!)

**❌ WRONG (What I initially said):**
- Skip the "Grant this service account access to project" section

**✅ CORRECT (What you must do):**
Add TWO specific roles when creating the service account:
- **Pub/Sub Editor** (or Pub/Sub Admin if Editor causes errors)
- **Monitoring Viewer**

**Why these roles matter:**
- Pub/Sub Editor: Enables real-time purchase notifications from Google Play
- Monitoring Viewer: Allows monitoring of notification queue
- Without these: Purchases may not sync properly, notifications won't work

---

### 2. Enable Pub/Sub API

**NEW REQUIREMENT:**
You need to enable a **THIRD API**:
- Google Cloud Pub/Sub API
- URL: https://console.cloud.google.com/apis/library/pubsub.googleapis.com

**Previous guides only mentioned 2 APIs - now you need 3!**

---

### 3. Play Console Permissions (More Specific)

**❌ WRONG (Simplified approach):**
- Just check "Admin (all permissions)"

**✅ CORRECT (Specific permissions required):**
Go to Settings → Users and permissions → Invite new users

Under **Account permissions**, check EXACTLY these three:
- ✅ View app information and download bulk reports (read-only)  
- ✅ View financial data, orders, and cancellation survey responses
- ✅ Manage orders and subscriptions

**Location:** Settings → **Users and permissions** (NOT "API access")

---

### 4. Faster Validation Workaround 🚀

**NEW: You don't have to wait 36 hours!**

Try this trick to trigger immediate validation:

1. Go to Play Console → Monetize → Products → Subscriptions
2. Open your subscription: `simon_says_pro_monthly`
3. Edit the **description** (add a space or period)
4. Save changes
5. Wait 10 minutes
6. Change description back to original
7. Save again

**Result:** Often activates credentials within minutes instead of 36 hours!

**Success Rate:** Not guaranteed, but works for many developers

**If it doesn't work:** Just wait the normal 36 hours

---

## 📋 Updated Setup Checklist

Follow this exact sequence:

### Part 1: Google Cloud Project
- [ ] Sign in with Play Console owner account ONLY
- [ ] Find correct Google Cloud project

### Part 2: Enable THREE APIs
- [ ] Google Play Android Developer API ✅
- [ ] Google Play Developer Reporting API ✅
- [ ] Google Cloud Pub/Sub API ✅ (NEW!)

### Part 3: Create Service Account WITH Roles
- [ ] Create service account: `RevenueCat-Simon-Says`
- [ ] Add role: **Pub/Sub Editor** ✅ (CRITICAL!)
- [ ] Add role: **Monitoring Viewer** ✅ (CRITICAL!)
- [ ] Complete creation

### Part 4: Download JSON Key
- [ ] Manage keys → Add key → Create new key → JSON
- [ ] Download JSON file
- [ ] Copy service account email

### Part 5A: Add to Play Console (Users and Permissions)
- [ ] Settings → **Users and permissions** → Invite new users
- [ ] Enter service account email
- [ ] Add app: Simon Says Coach
- [ ] Check THREE specific permissions ✅
- [ ] Send invite

### Part 5B: Upload to RevenueCat
- [ ] Upload JSON to RevenueCat app settings
- [ ] Save

### Part 6: Try Workaround (NEW!)
- [ ] Edit product description in Play Console
- [ ] Wait 10 minutes
- [ ] Change back
- [ ] Check if RevenueCat shows "Connected"

### Part 7: Wait or Test
- [ ] If workaround worked: Test immediately!
- [ ] If not: Wait 36 hours, then test

---

## 🔄 What Changed in the Documentation

All three guides have been updated:

1. **GOOGLE_PLAY_QUICKSTART.md**
   - ✅ Added Pub/Sub API step
   - ✅ Added roles to service account creation
   - ✅ Updated permissions section
   - ✅ Added faster validation workaround

2. **GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md**
   - ✅ Detailed explanation of roles
   - ✅ Pub/Sub API section added
   - ✅ Updated Play Console permissions
   - ✅ Added workaround section

3. **SERVICE_ACCOUNT_PROGRESS_TRACKER.md**
   - ✅ Added Pub/Sub API checkbox
   - ✅ Added role checkboxes
   - ✅ Updated permissions section
   - ✅ Added workaround tracking

---

## ⚠️ Common Mistakes to Avoid

### Mistake #1: Skipping Roles
**Problem:** Creating service account without adding Pub/Sub Editor and Monitoring Viewer roles

**Symptom:** RevenueCat works but:
- Subscriptions don't update in real-time
- Purchase notifications are delayed
- Subscription status doesn't sync properly

**Fix:** Delete service account and create new one WITH roles

### Mistake #2: Wrong Permissions Page
**Problem:** Going to "API access" instead of "Users and permissions"

**Symptom:** Can't find where to add service account

**Fix:** Settings → **Users and permissions** → Invite new users (not API access!)

### Mistake #3: Wrong Permissions Checked
**Problem:** Checking "Admin (all permissions)" or wrong specific permissions

**Symptom:** Service account has too much or too little access

**Fix:** Check EXACTLY the three permissions listed above

### Mistake #4: Forgetting Pub/Sub API
**Problem:** Only enabling 2 APIs instead of 3

**Symptom:** Real-time notifications don't work, purchases are delayed

**Fix:** Enable Pub/Sub API: https://console.cloud.google.com/apis/library/pubsub.googleapis.com

---

## 🎯 For Users Who Already Started Setup

**If you already created a service account:**

Check if it has the correct roles:

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Find your service account
3. Look at the "Role" column
4. Does it show:
   - ✅ Pub/Sub Editor (or Pub/Sub Admin)
   - ✅ Monitoring Viewer

**If NO:** You need to either:
- **Option A:** Edit the service account to add roles (if possible)
- **Option B:** Delete it and create new one with correct roles

**If YES:** You're good! Just make sure:
- [ ] Pub/Sub API is enabled
- [ ] Play Console permissions are correct (three specific ones)
- [ ] Try the workaround to activate faster

---

## 📞 Quick Reference

**3 APIs to Enable:**
1. Android Developer API
2. Developer Reporting API  
3. Pub/Sub API ← Don't forget this one!

**2 Roles for Service Account:**
1. Pub/Sub Editor (or Admin)
2. Monitoring Viewer

**3 Permissions in Play Console:**
1. View app information and download bulk reports (read-only)
2. View financial data, orders, and cancellation survey responses
3. Manage orders and subscriptions

**Faster Validation Trick:**
Edit product description → Save → Wait 10 min → Change back → Save

---

## ✅ Next Steps

1. Read the updated **GOOGLE_PLAY_QUICKSTART.md**
2. Follow the new steps carefully
3. Don't skip the roles when creating service account!
4. Try the workaround after uploading JSON
5. Test after validation completes

---

**Updated:** February 11, 2026  
**Source:** Official RevenueCat documentation  
**Critical:** Roles and Pub/Sub API are REQUIRED!
