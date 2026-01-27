# Play Store Assets Guide

## Required Assets for Google Play Console

### 1. App Icon (REQUIRED)
**File:** `assets/icon.png` (already exists - 1024x1024)  
**Use this directly in Play Console**

**Location in Play Console:**
- Store Listing → Store Settings → App icon
- Upload: `assets/icon.png`

---

### 2. Feature Graphic (REQUIRED)
**Dimensions:** 1024 x 500 pixels  
**File Created:** `assets/play-store-feature-graphic.svg`

**To convert to PNG:**
```powershell
# Option 1: Use online converter
# Visit: https://svgtopng.com or https://cloudconvert.com/svg-to-png
# Upload: assets/play-store-feature-graphic.svg
# Set dimensions: 1024x500
# Download as PNG

# Option 2: If you have ImageMagick installed
magick assets/play-store-feature-graphic.svg -resize 1024x500 assets/play-store-feature-graphic.png
```

**Location in Play Console:**
- Store Listing → Store Settings → Feature graphic

---

### 3. Screenshots (MINIMUM 2 REQUIRED)

**Recommended dimensions:** 1080 x 1920 pixels (9:16 portrait)

**How to capture screenshots:**

#### Option A: From Web App
1. Open: https://simon-says-coach.web.app
2. Open Chrome DevTools (F12)
3. Click "Toggle device toolbar" (Ctrl+Shift+M)
4. Select device: "Pixel 5" or set custom to 1080x1920
5. Capture these screens:
   - Welcome/Home screen
   - Coach selection (6 personalities)
   - Chat interface with conversation
   - Coach Marketplace browse
   - Custom coach creation
   - Context entry screen

6. Use Windows Snipping Tool or Snagit to capture each screen
7. Save as PNG files in `assets/screenshots/`

#### Option B: Quick Screenshot Generation
Since your web app is live, I can help you:
1. Visit each key screen
2. Take screenshots manually
3. Or use browser extensions like "Full Page Screen Capture"

**Suggested screenshots:**
1. `screenshot-1-welcome.png` - Home with tagline
2. `screenshot-2-coaches.png` - 6 coach personalities grid
3. `screenshot-3-chat.png` - Active conversation
4. `screenshot-4-marketplace.png` - Community coaches
5. `screenshot-5-features.png` - Voice/image features

**Location in Play Console:**
- Store Listing → Store Settings → Phone screenshots

---

### 4. High-Resolution Icon (REQUIRED)
**File:** `assets/icon.png` (512x512 or 1024x1024)  
**Already exists** ✅

---

## Quick Checklist

| Asset | Required | Status | File |
|-------|----------|--------|------|
| App Icon (512x512+) | ✅ Yes | ✅ Ready | `assets/icon.png` |
| Feature Graphic (1024x500) | ✅ Yes | 🔄 Convert SVG | `assets/play-store-feature-graphic.svg` |
| Screenshots (2+ phones) | ✅ Yes | ⏳ Need to capture | Manual capture |
| Short Description | ✅ Yes | ✅ Ready | See PLAY_STORE_SETUP.md |
| Full Description | ✅ Yes | ✅ Ready | See PLAY_STORE_SETUP.md |
| Privacy Policy URL | ✅ Yes | ✅ Live | https://simon-says-coach.web.app/privacy-policy.html |

---

## Next Steps

1. **Convert Feature Graphic:**
   - Upload `play-store-feature-graphic.svg` to https://svgtopng.com
   - Set size to 1024x500
   - Download as PNG

2. **Capture Screenshots:**
   - Open web app in mobile view (1080x1920)
   - Take 5-6 screenshots of key screens
   - Save to `assets/screenshots/` folder

3. **Upload to Play Console:**
   - App icon: `assets/icon.png`
   - Feature graphic: The converted PNG (1024x500)
   - Screenshots: All captured PNGs

4. **Fill in text fields:**
   - Use descriptions from `PLAY_STORE_SETUP.md`
   - Privacy policy: `https://simon-says-coach.web.app/privacy-policy.html`

---

## Pro Tips

- **App icon:** Must have no transparency for some surfaces
- **Feature graphic:** Shows at top of Play Store listing (very important!)
- **Screenshots:** First 2-3 are most important (show best features first)
- **All images:** JPG or PNG only, no SVG uploads

