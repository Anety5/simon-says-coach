# 🚨 CRITICAL SECURITY TASKS - IMMEDIATE ACTION REQUIRED

## **Priority 1: ROTATE API KEYS (Do Feb 13, 2026 - Friday)**

### Why:
Your `.env` file was committed to git on Jan 24, 2026. Even though it was removed, the keys are still visible in git history. Since your repo is PUBLIC for Devpost, anyone can see these keys and use them.

### Keys Exposed:
1. **Gemini API Key**: 
2. **RevenueCat API Key**:  (test key, less critical)

---

## **STEP 1: Rotate Gemini API Key (After Devpost)**

**DO THIS ON FEB 14 (Friday):**

1. **Create new Gemini API key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API key"
   - Copy new key

2. **Update local .env:**
   ```bash
   EXPO_PUBLIC_GEMINI_API_KEY=NEW_KEY_HERE
   ```

3. **Delete old key:**
   - Go back to https://aistudio.google.com/app/apikey
   - Find old key (``)
   - Click delete/revoke

4. **Rebuild app:**
   ```bash
   cd android
   .\gradlew.bat clean
   .\gradlew.bat bundleRelease
   ```

5. **Upload to Play Console**

---

## **STEP 2: Rotate RevenueCat API Key (Optional - it's a test key)**

1. **Go to RevenueCat dashboard:**
   - https://app.revenuecat.com/
   - Project settings → API keys

2. **Create new Android key**

3. **Update .env:**
   ```bash
   EXPO_PUBLIC_REVENUECAT_API_KEY=NEW_KEY_HERE
   ```

4. **Delete old key in RevenueCat**

---

## **STEP 3: Clean Git History (Advanced - Optional)**

⚠️ **WARNING**: This rewrites git history and breaks existing clones

**Only do this if you understand git:**

```bash
# Remove .env from all git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (breaks existing clones)
git push origin --force --all
```

**Easier option**: Just rotate the keys and accept that old keys are in history (but deleted so they don't work anymore).

---

## **STEP 4: Verify .gitignore is Working**

```bash
# Check .env is ignored
git status

# Should NOT show .env as tracked
git ls-files | grep .env
# Should return nothing
```

---

## **Priority Timeline:**

**Feb 13, 2026 - Friday (AFTER Devpost judging window):**
1. ✅ Remove demo code from purchases.js
2. 🔑 **Rotate Gemini API key** (CRITICAL)
3. 🔄 Rebuild and republish app as v1.0.4
4. ⚠️ (Optional) Rotate RevenueCat key
5. ⚠️ (Optional) Clean git history

---

## **Why Wait Until Feb 13 (Friday):**

- Your published app has the current Gemini key embedded
- Rotating now breaks the live app judges are testing
- Feb 13 gives judges 1 day to test after Feb 12 (Thursday) deadline
- RevenueCat service account should be fully validated by then (24-36 hrs from Feb 11)

---

## **What's Safe:**

✅ **Firebase API key in firebase.js** - This is SAFE and intentionally public
- Firebase keys are designed to be public
- Security comes from Firestore rules, not the API key
- No action needed

❌ **Gemini API key** - MUST be rotated
- Free tier, so max damage is hitting quota limits
- But still should rotate for security best practices

---

## **Calendar Reminders to Set:**

1. **Feb 13 (Friday), 9:00 AM** - "Remove demo code + Rotate Gemini API key"
2. **Feb 13 (Friday), 10:00 AM** - "Rebuild app with new keys (v1.0.4)"
3. **Feb 13 (Friday), 11:00 AM** - "Upload new version to Play Console"

---

## **Support:**

If you need help with key rotation:
- Gemini: https://aistudio.google.com/app/apikey
- RevenueCat: https://app.revenuecat.com/settings/api-keys
- Git cleanup: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
