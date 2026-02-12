# ⚠️ CRITICAL REMINDER: REMOVE DEMO CODE + ROTATE API KEYS

## **Deadline: February 13, 2026 (Friday)** (after Devpost judging window)

⚠️ **ALSO SEE: SECURITY_URGENT.md for API key rotation!**

---

### Task 1: File to Edit:
`src/utils/purchases.js`

### Lines to Delete:
Lines 93-100 in the `checkProStatus` function:

```javascript
// DELETE THESE LINES:
// ⚠️ TEMPORARY DEVPOST DEMO MODE ⚠️
// TODO: REMOVE THIS AFTER DEVPOST JUDGING (Feb 12, 2026)
// Enables Pro for all users while waiting for Google Play service account validation
console.log('🎯 DEMO MODE: Pro features enabled for all users');
console.log('⚠️ Remember to remove this after Devpost judging!');
return true;
// END TEMPORARY OVERRIDE
```

### Steps:
1. Open `src/utils/purchases.js`
2. Go to lines 93-100 in `checkProStatus` function
3. Delete the 6 lines above (keep the try-catch block below)
4. Test that RevenueCat Pro validation works (should be fully validated by then)
5. Rebuild APK: `cd android; .\gradlew.bat bundleRelease`
6. Upload to Play Console as v1.0.4

### Why Remove:
- Google Play service account should be validated by then (24-36 hours from Feb 11)
- Restores proper subscription enforcement (20 msg/day free, unlimited Pro)
- Production-ready monetization

---

**SET A CALENDAR REMINDER NOW:**
- Date: February 13, 2026 (Friday) at 9:00 AM
- Title: "Remove Simon Says demo code + Rotate API keys"
- Link to SECURITY_URGENT.md and this file for instructions
