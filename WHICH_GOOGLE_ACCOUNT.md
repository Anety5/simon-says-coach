# Which Google Account Should I Use? 🤔

## 🎯 The Problem: You Have 3 Emails

This is the **#1 cause** of service account setup failures!

---

## ✅ Use This Account For EVERYTHING:

### The "Play Console Owner" Account

**How to identify it:**

1. Go to: https://play.google.com/console
2. Click **Settings** (gear icon) → **Users and permissions**
3. Look for the account with role: **"Account owner"**

**This is your account!** Use it for:
- ✅ Google Cloud Console
- ✅ Creating service accounts
- ✅ Enabling APIs
- ✅ Downloading JSON keys
- ✅ Managing Play Console
- ✅ Everything RevenueCat-related

---

## ❌ Don't Use These Accounts:

### Account Type: "Admin" or "Developer"
**Role in Play Console:** Admin / Developer  
**Can you use it?** ❌ NO

**Why not?** These accounts have limited permissions. They can't:
- Create service accounts in Google Cloud
- Access the correct Google Cloud Project
- Download service account keys properly

### Account Type: Personal Gmail
**Associated with Play Console?** No  
**Can you use it?** ❌ NO

**Why not?** This account isn't linked to your Play Console at all. It will:
- Show wrong Google Cloud Projects
- Cause "Permission denied" errors
- Not have access to Play Console settings

### Account Type: Work/School Account
**Type:** @company.com or @school.edu  
**Can you use it?** ❌ PROBABLY NOT (unless it's the owner)

**Why not?** Unless this specific account is the Play Console owner, it won't work.

---

## 🔍 How to Verify You're Using the Right Account

### Quick Check:

1. Open a **new incognito/private browser window**
2. Go to: https://play.google.com/console
3. Sign in with ONE account
4. Can you see your app "Simon Says Coach"?
   - ✅ YES → This might be the right account
   - ❌ NO → Wrong account
5. Go to **Settings → Users and permissions**
6. Is your currently signed-in account marked as **"Account owner"**?
   - ✅ YES → This is THE account!
   - ❌ NO → Try a different account

---

## 🚀 Step-by-Step: Clean Start

### Step 1: Sign Out of Everything

**In your main browser:**
1. Go to: https://accounts.google.com
2. Click your profile picture (top right)
3. Click **"Sign out of all accounts"**
4. Close all browser tabs
5. Close and reopen your browser

### Step 2: Sign In With Owner Account ONLY

1. Open a **new incognito/private window** (safer!)
2. Go to: https://play.google.com/console
3. Sign in with your Play Console **owner account**
4. Verify you see "Simon Says Coach" in your app list

### Step 3: Open Required Tabs

Keep these tabs open (all using the same account):

1. **Tab 1 - Play Console**: https://play.google.com/console
2. **Tab 2 - Google Cloud**: https://console.cloud.google.com
3. **Tab 3 - RevenueCat**: https://app.revenuecat.com

**Check:** At the top right of each tab, you should see the SAME profile picture/email!

---

## 🎯 Your 3 Accounts: Decision Tree

```
Account 1: ____________@gmail.com
└─ Is this the Play Console owner?
   ├─ YES → ✅ USE THIS FOR EVERYTHING
   └─ NO  → ❌ Don't use

Account 2: ____________@gmail.com  
└─ Is this the Play Console owner?
   ├─ YES → ✅ USE THIS FOR EVERYTHING
   └─ NO  → ❌ Don't use

Account 3: ____________@gmail.com
└─ Is this the Play Console owner?
   ├─ YES → ✅ USE THIS FOR EVERYTHING
   └─ NO  → ❌ Don't use
```

**You should only have ONE "YES" answer above!**

---

## 📋 Common Scenarios

### Scenario 1: "I created Play Console with Account A, but manage it with Account B"

**Use:** Account A (the creator/owner)  
**Why:** Even if you use Account B daily, Account A owns the account and has full permissions.

### Scenario 2: "I have a company Google Workspace account and a personal Gmail"

**Use:** Whichever one is the Play Console owner  
**How to check:** Go to Play Console → Settings → Users and permissions → Look for "Account owner"

### Scenario 3: "I'm not sure which account created the Play Console"

**Solution:**
1. Try signing in to https://play.google.com/console with each account (one at a time)
2. The one that shows "Simon Says Coach" in the app list is involved
3. Check Settings → Users and permissions to see which is owner

### Scenario 4: "Multiple accounts can access Play Console"

**Use:** The one marked "Account owner"  
**Not:** The ones marked "Admin" or "Developer"

---

## 🚨 Signs You're Using the Wrong Account

### In Google Cloud Console:

- ❌ Don't see your Play Console project
- ❌ "You don't have permission" errors
- ❌ Can't create service accounts
- ❌ Can't download JSON keys
- ❌ Project list is empty or shows unrelated projects

### In Play Console:

- ❌ Don't see "Simon Says Coach" in app list
- ❌ Settings → Users and permissions shows you as "Admin" not "Owner"
- ❌ Can't access certain settings

### When Enabling APIs:

- ❌ "Enable billing" warnings (these APIs are free!)
- ❌ "Permission denied" errors
- ❌ APIs enable but RevenueCat still doesn't work

---

## ✅ Signs You're Using the RIGHT Account

### In Google Cloud Console:

- ✅ See project named "API Project" or similar
- ✅ Can create service accounts without errors
- ✅ JSON key downloads successfully
- ✅ All API enable buttons work

### In Play Console:

- ✅ See "Simon Says Coach" in your apps
- ✅ Settings → Users shows you as "Account owner"
- ✅ Can access all settings and options

### In RevenueCat:

- ✅ Can upload JSON without errors
- ✅ After 36 hours, shows "Connected" status

---

## 🛠️ Still Confused?

### Write Down This Info:

**Account 1:**
- Email: _______________
- Can access Play Console? YES / NO
- Role in Play Console: Owner / Admin / Developer / Not listed
- Can see "Simon Says Coach"? YES / NO

**Account 2:**
- Email: _______________
- Can access Play Console? YES / NO
- Role in Play Console: Owner / Admin / Developer / Not listed
- Can see "Simon Says Coach"? YES / NO

**Account 3:**
- Email: _______________
- Can access Play Console? YES / NO
- Role in Play Console: Owner / Admin / Developer / Not listed
- Can see "Simon Says Coach"? YES / NO

**The account marked "Owner" is the one to use!**

---

## 🎯 Summary

**ONE RULE:**  
Use the Google account that is the **"Account owner"** in Play Console → Settings → Users and permissions.

**Sign out of all other accounts** and use ONLY that one.

That's it! 🎉
