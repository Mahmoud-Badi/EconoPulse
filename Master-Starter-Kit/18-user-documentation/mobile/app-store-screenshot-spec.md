<!-- IF {{HAS_MOBILE}} == "true" -->
# App Store & Play Store Screenshot Spec

Technical requirements, ordering strategy, and production guidelines for {{PROJECT_NAME}}'s App Store and Google Play Store screenshots.

> **These screenshots are marketing assets, not documentation screenshots.** Documentation screenshots are raw captures with no device frames or overlays. Store screenshots are polished, designer-finished assets intended to persuade potential users to download the app. See `screenshot-automation/mobile-screenshot-guide.md` for documentation screenshot capture.

---

## Apple App Store Requirements

### Required Device Classes and Sizes

Apple requires separate screenshot sets for each device class. If you submit a universal app (iPhone + iPad), you must provide screenshots for at least the mandatory sizes.

| Device Class | Dimensions (px) | Aspect Ratio | Mandatory? |
|-------------|-----------------|--------------|-----------|
| iPhone 6.7" (iPhone 15 Pro Max, 16 Pro Max) | 1290 × 2796 | 19.5:9 | **Yes** — required for all submissions |
| iPhone 6.5" (iPhone 14 Plus, 15 Plus) | 1284 × 2778 | ~19.5:9 | **Yes** — required for all submissions |
| iPhone 5.5" (iPhone SE 3rd gen, 8 Plus) | 1242 × 2208 | 16:9 | Required only if supporting iOS 12 or older devices |
| iPad Pro 12.9" (6th gen) | 2048 × 2732 | 4:3 | **Yes** — required if the app runs on iPad |
| iPad Pro 11" (4th gen) | 1668 × 2388 | 1.43:1 | Optional — Apple may use 12.9" screenshots for 11" too |
| iPad Pro 12.9" (2nd gen) | 2048 × 2732 | 4:3 | Optional — same size as 6th gen, only needed if supporting older iPads |

**Apple's scaling behavior:** If you only provide 6.7" screenshots, Apple will scale them for the 6.5" slot (acceptable but not ideal). Always provide both. If you provide 12.9" iPad screenshots, Apple uses them for all iPad sizes.

### Apple Format Requirements

| Property | Requirement |
|----------|-------------|
| Format | JPEG or PNG |
| Color space | sRGB or P3 |
| Maximum file size | 500 MB per screenshot |
| Transparency | Not permitted (PNG must be opaque) |
| Screenshot count | 1 minimum, 10 maximum per device class per locale |
| Portrait or landscape | Either accepted; portrait is standard for phone apps |

### App Preview Videos (Optional)

Apple allows up to 3 app preview videos per device class. Videos autoplay silently in the App Store.

| Property | Requirement |
|----------|-------------|
| Format | H.264, HEVC |
| Duration | 15–30 seconds |
| Resolution | Match the screenshot sizes above |
| Frame rate | 30 fps |
| Must show | Actual app UI only (no non-app UI, real-world footage of device is allowed as framing) |

---

## Google Play Store Requirements

### Phone Screenshots

| Property | Requirement |
|----------|-------------|
| Minimum dimension | 320 px on any side |
| Maximum dimension | 3840 px on any side |
| Aspect ratio | 16:9 or 9:16 recommended |
| Format | JPEG or PNG (24-bit, no alpha channel) |
| Recommended size | 1080 × 1920 px (portrait) or 1920 × 1080 px (landscape) |
| Screenshot count | 2 minimum, 8 maximum |

### Tablet Screenshots (Optional but Recommended)

Google Play displays tablet screenshots in a separate section when users browse on a tablet device.

| Tablet Size | Recommended Dimensions |
|-------------|----------------------|
| 7-inch tablet | 1200 × 1920 px |
| 10-inch tablet | 1920 × 1200 px (landscape) or 1200 × 1920 px (portrait) |

### Google Play Promo Graphic (Optional)

The feature graphic appears at the top of your Play Store listing and in featured placements.

| Property | Requirement |
|----------|-------------|
| Dimensions | 1024 × 500 px |
| Format | JPEG or PNG |
| File size | Max 1 MB |
| Content | No store badges, no pricing, no time-sensitive content |

---

## Screenshot Count Summary

| Store | Minimum | Maximum | Recommended |
|-------|---------|---------|-------------|
| Apple App Store (per device class per locale) | 1 | 10 | 5–8 |
| Google Play (phone) | 2 | 8 | 5–8 |
| Google Play (tablet, optional) | 0 | 8 | 4–6 |

---

## Screenshot Ordering Strategy

The order of screenshots is critical — users see the first 2–3 screenshots before scrolling. On the App Store, the first screenshot is visible in search results without even opening the listing.

### Recommended Order

| Position | What to Show | Rationale |
|----------|-------------|-----------|
| **1 — Hero shot** | The single screen that best communicates the core value proposition | Most visible position; determines whether the user keeps looking |
| **2 — Primary workflow** | The main thing users do every day in the app | Shows utility and daily relevance |
| **3 — Key differentiator** | The feature that makes {{PROJECT_NAME}} different from alternatives | Answers "why this app and not the other one?" |
| **4 — Data / dashboard** | A screen showing the user's data, analytics, or progress | Shows depth and that the app provides ongoing value |
| **5 — Secondary feature** | An important but non-core workflow | Shows breadth of functionality |
| **6+ — Supporting features** | Additional workflows, settings, or social proof | Fills out the story for users who swipe through everything |

### Hero Shot Guidelines

The first screenshot is the most important production decision. It should:

- Show the app's most compelling screen (usually the main dashboard or the feature that delivers the most value)
- Contain a text overlay of 4–5 words that communicate the core benefit (e.g., "Manage your team, anywhere")
- Be visually striking with real app UI — not a mockup or illustration
- Work as a standalone image without needing surrounding context

---

## Text Overlay Guidelines

Text overlays are short phrases added by the designer over the screenshot to highlight a benefit.

### Rules for Text Overlays

| Rule | Guidance |
|------|----------|
| **Length** | 4–5 words maximum per overlay. Shorter is better. |
| **Content** | Benefit-focused, not feature-focused. "Stay on top of everything" not "Dashboard screen with filters" |
| **Contrast** | Text must have a minimum 4.5:1 contrast ratio against the background it overlays |
| **Font size** | Large enough to read on a phone at store thumbnail size (~40px minimum at full resolution) |
| **Position** | Top or bottom of the screenshot, never covering the key UI being highlighted |
| **Language** | Match the locale of the screenshot set (see Localization section) |
| **Avoid** | Pricing, time-sensitive claims ("New!", "Best of 2025"), competitor comparisons |

### Text Overlay Examples

| Good | Bad | Why |
|------|-----|-----|
| "Know what's happening" | "Real-time dashboard with live data updates and customizable widgets" | Too long |
| "Done in seconds" | "Our app is fast" | Be specific about what's fast |
| "Your data, always ready" | "Offline mode available" | Benefit not feature |
| "Built for your team" | "Multi-user support" | Conversational not technical |

---

## Device Frame Guidelines

Device frames (images of a phone or tablet surrounding the screenshot) are optional and a design decision. Here is when to use them:

| Use Frames | Don't Use Frames |
|-----------|-----------------|
| When the product has a strong visual identity and the frame adds premium feel | When the app UI is visually strong enough to stand alone |
| When you're targeting non-technical users who may not immediately recognize a phone screenshot | When you have an abstract or data-dense UI — frames can make it look cramped |
| When the store listing has a consistent visual design system with other marketing materials | When frames look generic or dated compared to current platform design trends |
| For iPad screenshots, where the frame helps users understand the orientation | Never for Apple's required device class sizes — Apple's own frame templates must be used if required |

### Where to Get Device Frames

| Source | Cost | Quality | Notes |
|--------|------|---------|-------|
| [Apple Design Resources](https://developer.apple.com/design/resources/) | Free | Official | Includes latest iPhone and iPad frames in Sketch/Figma/XD |
| [Facebook Device Frames](https://design.facebook.com/toolsandresources/devices/) | Free | High quality | Wide device variety |
| [Mockuphone](https://mockuphone.com/) | Free | Good | Online tool, quick generation |
| Custom Figma frames | Varies | Custom | Best for brand consistency; build or buy from community |

**Do not:** Use device frame images that show a specific carrier, specific cellular signal strength, or specific battery percentage — this implies the screenshot is a real user's device.

---

## Localization Requirements

If {{PROJECT_NAME}} is available in multiple languages, each language requires its own screenshot set.

### Apple App Store Localization

- Screenshots localize per **language**, not per country. French screenshots apply in France, Canada (French), Belgium, and any other French-language locale.
- You must upload localized screenshots for each language where the App Store localizes your listing.
- If no localized screenshots are provided for a language, Apple falls back to your primary locale screenshots (usually English).

| Locale | Screenshot Set Required? |
|--------|------------------------|
| English (primary) | Yes — always |
| {{LOCALE_1}} | {{LOCALE_1_SCREENSHOTS_REQUIRED}} |
| {{LOCALE_2}} | {{LOCALE_2_SCREENSHOTS_REQUIRED}} |
| {{LOCALE_3}} | {{LOCALE_3_SCREENSHOTS_REQUIRED}} |

**Localization checklist for each new language:**

- [ ] UI strings translated and deployed
- [ ] Screenshots recaptured with the app in that language
- [ ] Text overlays translated and re-typeset
- [ ] Screenshots uploaded to App Store Connect under the correct locale
- [ ] Screenshots uploaded to Google Play Console under the correct language

### Google Play Localization

Google Play uses the same structure: screenshots are uploaded per language under each language listing in the Play Console.

---

## Seasonal and Version-Based Updates

### When to Refresh Screenshots

| Trigger | Action |
|---------|--------|
| Major UI redesign | Recapture all screenshots; update all locales |
| New primary feature added | Add 1–2 screenshots showcasing the feature; consider reordering to move it earlier |
| Feature changed significantly | Recapture affected screenshots |
| Branding change (logo, colors, typography) | Recapture all screenshots |
| New device class introduced by Apple or Google | Capture and upload for new size requirement |
| Seasonal promotion | Update hero shot or screenshot 1 with seasonal context; revert after season |
| App Store Optimization (ASO) experiment | A/B test screenshot order or overlays; track CVR in App Store Connect |

### How Often to Review

- **Quarterly:** Review screenshots against the current app state. Flag any screenshots showing outdated UI.
- **With every major release:** Update any screenshots showing features that changed in that release.
- **Annually:** Do a full refresh to ensure screenshots feel current and competitive.

---

## Production Workflow

The recommended workflow for producing a new screenshot set:

1. **Capture raw screenshots** using the instructions in `screenshot-automation/mobile-screenshot-guide.md`. Use the exact device resolutions listed in this document.

2. **Hand off to designer** with:
   - Raw screenshot PNG files (one per screen, per platform, per locale)
   - This spec document
   - The screenshot ordering strategy and desired text overlays
   - Brand assets (colors, fonts, logo)

3. **Designer produces finished assets** (frames, text overlays, backgrounds as needed) and exports at the required resolutions.

4. **QA check before upload:**
   - [ ] All required sizes present (see tables above)
   - [ ] No transparency in any PNG files
   - [ ] Text overlays readable at thumbnail size
   - [ ] No pricing, dates, or time-sensitive claims
   - [ ] No real user data visible (use seed data or anonymized data)
   - [ ] Screenshots accurately represent the current app (not a prototype or older version)

5. **Upload to stores:**
   - App Store Connect: App → App Store → select app version → scroll to "App Previews and Screenshots"
   - Google Play Console: App → Store Presence → Store Listing → Graphics

6. **After upload:**
   - Save source files (Figma/Sketch/PSD) to `{{PROJECT_LOCAL_PATH}}/assets/store-screenshots/source/`
   - Save exported PNGs to `user_docs/screenshots/store/ios/` and `user_docs/screenshots/store/android/`
   - Document the update in the changelog

---

## Checklist: Screenshot Set Complete

Before submitting a new or updated screenshot set:

**Content:**
- [ ] Hero shot (position 1) communicates the core value proposition clearly
- [ ] Text overlays are 4–5 words, benefit-focused, high-contrast
- [ ] No outdated UI visible in any screenshot
- [ ] No real user data (use seed/demo data)
- [ ] Screenshots ordered by strategic importance

**Technical:**
- [ ] All required Apple sizes present: 1290×2796, 1284×2778, and 2048×2732 (if iPad)
- [ ] Google Play screenshots are 1080×1920 and meet 2–8 count requirement
- [ ] All files are JPEG or PNG, no alpha transparency
- [ ] File sizes are within limits (500 MB per Apple, any reasonable size for Google)

**Localization:**
- [ ] Screenshots captured/updated for all supported locales
- [ ] Text overlays translated for each locale

**Approval:**
- [ ] Screenshots reviewed and approved before upload
- [ ] Source files archived

---

*Related files: `doc-types/app-store-listing.template.md` (store listing copy), `screenshot-automation/mobile-screenshot-guide.md` (capture instructions), `mobile/mobile-doc-strategy.md` (documentation vs. marketing distinction)*
<!-- ENDIF -->
