# ✅ Service Account Setup Progress Tracker

**Your App:** Simon Says Coach  
**RevenueCat App ID:** app19369b0f2f  
**Package Name:** com.anonymous.simonsayscoach  
**Date Started:** _______________

---

## 🎯 Pre-Setup Checklist

- [ ] I have identified my **Play Console owner account email**: _______________
- [ ] I have signed out of all other Google accounts
- [ ] I have signed in ONLY with the owner account
- [ ] I know my app is live/in testing on Google Play Store

---

## 📋 Setup Progress

### Part 1: Google Cloud Project (5 minutes)

- [ ] Opened https://console.cloud.google.com
- [ ] Found the correct project (name: _______________)
- [ ] Project is selected (showing at top of page)

### Part 2: Enable APIs (2 minutes)

- [ ] Enabled **Google Play Android Developer API**
  - URL: https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com
  - Status: Shows "MANAGE" or "API ENABLED"
  
- [ ] Enabled **Google Play Developer Reporting API**
  - URL: https://console.cloud.google.com/apis/library/playdeveloperreporting.googleapis.com
  - Status: Shows "MANAGE" or "API ENABLED"

- [ ] Enabled **Google Cloud Pub/Sub API**
  - URL: https://console.cloud.google.com/apis/library/pubsub.googleapis.com
  - Status: Shows "MANAGE" or "API ENABLED"
  - Purpose: Real-time purchase notifications

### Part 3: Create Service Account (5 minutes)

- [ ] Went to: https://console.cloud.google.com/iam-admin/serviceaccounts
- [ ] Clicked "CREATE SERVICE ACCOUNT"
- [ ] Entered name: `RevenueCat-Simon-Says`
- [ ] Clicked "CREATE AND CONTINUE"
- [ ] Added role #1: **Pub/Sub Editor** (or Pub/Sub Admin)
- [ ] Added role #2: **Monitoring Viewer**
- [ ] Clicked CONTINUE
- [ ] Clicked DONE
- [ ] Service account appears in list

### Part 4: Download JSON Key (2 minutes)

- [ ] Clicked three dots (⋮) on service account → Manage keys
- [ ] Clicked ADD KEY → Create new key → JSON
- [ ] JSON file downloaded successfully
- [ ] Saved file location: _______________
- [ ] Copied service account email: _______________@_____.iam.gserviceaccount.com

### Part 5A: Add to Play Console (10 minutes)

- [ ] Opened: https://play.google.com/console
- [ ] Went to Settings → Users and permissions
- [ ] Clicked "Invite new users"
- [ ] Entered service account email
- [ ] Under App permissions → Added "Simon Says Coach"
- [ ] Under Account permissions, checked THREE required boxes:
  - [ ] View app information and download bulk reports (read-only)
  - [ ] View financial data, orders, and cancellation survey responses
  - [ ] Manage orders and subscriptions
- [ ] Clicked INVITE USER → SEND INVITE
- [ ] Service account shows as "Active" in Users list

### Part 5B: Upload to RevenueCat (2 minutes)

- [ ] Opened: https://app.revenuecat.com
- [ ] Navigated to: Apps → Simon Says Coach (Play Store)
- [ ] Found "Service Credentials" section
- [ ] Uploaded JSON file
- [ ] Clicked Save
- [ ] Saw confirmation or "pending validation" message

---

## ⏰ Wait Period

- [ ] **Setup completed on:** _______________ (date/time)
- [ ] **Tried the workaround?** YES / NO
  - [ ] Edited product description in Play Console → Monetize → Subscriptions
  - [ ] Waited 10 minutes
  - [ ] Changed it back
  - [ ] Checked RevenueCat status → Connected? ___
- [ ] **If workaround didn't work, can test after:** _______________ (add 36 hours)
- [ ] **Status check on Day 2:** _______________
  - Still shows pending? → Normal, keep waiting
  - Shows error? → Normal, keep waiting
  - Shows connected? → Great! Ready to test

---

## 🧪 Testing (After 36 Hours)

- [ ] **Waited at least 36 hours** since setup completion
- [ ] Opened app and ran: Settings → RevenueCat Debug Tools
- [ ] Test 1: SDK Initialization → ✅ / ❌
- [ ] Test 2: Check Pro Status → ✅ / ❌
- [ ] Test 3: Get Offerings → ✅ / ❌
- [ ] Test 4: Test Purchase → ✅ / ❌
- [ ] All tests passed → **Service account is working!** 🎉

---

## 🚨 Troubleshooting Notes

**If something went wrong, write the error here:**

Error: _______________________________________________

_______________________________________________

_______________________________________________

**Solution tried:**

_______________________________________________

_______________________________________________

**Result:**

_______________________________________________

---

## 📞 Help Resources

- **Simple guide:** GOOGLE_PLAY_QUICKSTART.md
- **Detailed troubleshooting:** GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md
- **RevenueCat docs:** https://docs.revenuecat.com/docs/creating-play-service-credentials

---

## ✅ Completion

- [ ] Service account fully configured
- [ ] All tests passing after 36 hours
- [ ] Purchases working in app
- [ ] **Setup complete!** 🎉

**Completion Date:** _______________

---

**Common Mistakes to Avoid:**
- ❌ Using wrong Google account
- ❌ Creating service account in wrong project
- ❌ Forgetting to enable both APIs
- ❌ Not waiting full 36 hours
- ❌ Creating multiple service accounts (causes confusion)

**Remember:**
- ✅ Use Play Console owner account ONLY
- ✅ Enable BOTH APIs
- ✅ Wait full 36 hours before testing
- ✅ Keep the JSON file safe (don't commit to Git!)
