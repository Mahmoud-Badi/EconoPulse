# App Store Go-Live Checklist

Pre-submission checklist for Apple App Store and Google Play Store. Complete every item before submitting. A missing item means a rejection, a delay, or a bad first impression.

---

## Apple App Store

### Developer Account

- [ ] Apple Developer Program membership is active ($99/year)
- [ ] App ID created in Apple Developer portal
- [ ] Bundle Identifier matches `app.json` / Xcode project
- [ ] Capabilities enabled (Push Notifications, Associated Domains, etc.)

### Code Signing

- [ ] Distribution certificate is valid and not expiring within 30 days
- [ ] Provisioning profile is up to date and includes all capabilities
- [ ] Certificate stored securely (EAS Secrets / Fastlane Match / CI secrets)
- [ ] Team members have access to signing credentials

### App Store Connect Setup

- [ ] App record created in App Store Connect
- [ ] Primary language set
- [ ] Category and subcategory selected
- [ ] Age rating questionnaire completed
- [ ] Pricing set (Free or paid tier)
- [ ] Availability (countries/regions) configured

### App Metadata

- [ ] App name (30 characters max)
- [ ] Subtitle (30 characters max)
- [ ] Keywords (100 characters, comma-separated)
- [ ] Description (4000 characters max)
- [ ] Promotional text (170 characters max, can be updated without new build)
- [ ] What's New text (for updates)
- [ ] Support URL (live and accessible)
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL (required — must be live and accurate)

### Screenshots

- [ ] 6.7" display (iPhone 15 Pro Max) — required
- [ ] 6.5" display (iPhone 14 Plus) — required
- [ ] 5.5" display (iPhone 8 Plus) — optional but recommended
- [ ] iPad Pro 12.9" (6th gen) — required if app supports iPad
- [ ] iPad Pro 12.9" (2nd gen) — required if app supports iPad
- [ ] Screenshots are actual app screens (not mockups)
- [ ] No iPhone frame/bezel in screenshots (Apple rejects device frames)
- [ ] Text overlays are optional, translated if app is localized

### App Review Preparation

- [ ] Test account credentials in Review Notes field
- [ ] Test account has full access (not restricted)
- [ ] Test account works from any network (no IP restrictions)
- [ ] Demo instructions for non-obvious features
- [ ] If using camera/location: explain how to test without a real device
- [ ] Contact information for reviewer questions

### Privacy

- [ ] Privacy Policy URL is live and accurate
- [ ] App Privacy labels completed (all data types declared)
- [ ] Third-party SDKs audited for data collection (Firebase, analytics, crash reporters)
- [ ] Tracking transparency implemented (ATT prompt) if using IDFA
- [ ] Data deletion mechanism available if collecting personal data

### Technical

- [ ] Build uploaded and processed successfully
- [ ] No crashes on fresh install (no cached data)
- [ ] Tested on latest iOS version AND one version back
- [ ] Tested on iPhone and iPad (if universal)
- [ ] All permission prompts have descriptive usage strings
- [ ] Deep links / Universal Links working
- [ ] Push notifications working (both foreground and background)
- [ ] In-App Purchases tested in Sandbox (if applicable)
- [ ] App works when user denies all permissions

---

## Google Play Store

### Developer Account

- [ ] Google Play Developer account is active ($25 one-time fee)
- [ ] Developer profile completed (name, address, email, phone)
- [ ] D-U-N-S number registered (required for organization accounts since 2023)

### App Setup

- [ ] Application ID (package name) matches `build.gradle`
- [ ] Play App Signing enabled (upload key enrolled)
- [ ] Upload keystore backed up securely
- [ ] Internal testing track configured

### Store Listing

- [ ] App title (30 characters max)
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)
- [ ] App icon (512x512 PNG, 32-bit, no alpha)
- [ ] Feature graphic (1024x500 PNG or JPG)
- [ ] Phone screenshots (minimum 2, max 8)
- [ ] 7-inch tablet screenshots (if app supports tablets)
- [ ] 10-inch tablet screenshots (if app supports tablets)

### Content Rating

- [ ] IARC content rating questionnaire completed
- [ ] Rating certificate generated for all countries

### Data Safety

- [ ] Data safety section completed
- [ ] All data types collected are declared
- [ ] Third-party SDK data collection included
- [ ] Data sharing practices accurately described
- [ ] Data deletion request mechanism documented

### Privacy and Policy

- [ ] Privacy policy URL set and accessible
- [ ] Privacy policy covers all declared data types
- [ ] If targeting children: COPPA and family policy compliance

### Permissions

- [ ] Only necessary permissions declared in AndroidManifest.xml
- [ ] Sensitive permissions justified (location, camera, contacts)
- [ ] Background location permission declaration form submitted (if applicable)
- [ ] SMS/Call Log permission declaration submitted (if applicable)

### Technical

- [ ] Target SDK version meets current Google Play requirements
- [ ] AAB (Android App Bundle) format used (not APK)
- [ ] ProGuard/R8 rules tested — release build does not crash
- [ ] Tested on target API level device/emulator
- [ ] Tested on Android Go / low-memory device (if targeting emerging markets)
- [ ] 64-bit native libraries included (mandatory since 2019)
- [ ] App works when user denies all permissions
- [ ] Deep links / App Links verified (`.well-known/assetlinks.json` hosted)

### Testing Tracks

- [ ] Internal testing: build uploaded and tested by team
- [ ] Closed testing: build tested by beta users (minimum 12 testers for 14 days — required for new apps)
- [ ] Open testing or production: only after closed testing passes

---

## Both Platforms

### Final Checks

- [ ] Version number is correct and higher than any previous submission
- [ ] Build number is unique
- [ ] No debug flags, dev menus, or test banners in production build
- [ ] No hardcoded API URLs pointing to localhost or staging
- [ ] No console.log / print statements flooding the output
- [ ] App size is reasonable (under 200MB without on-demand resources)
- [ ] Offline behavior is graceful (no crashes on airplane mode)
- [ ] Error states show user-friendly messages (no raw errors)
- [ ] All placeholder text and images replaced with real content
- [ ] Terms of Service URL set (if applicable)

### Post-Submission

- [ ] Monitor review status daily (both stores)
- [ ] Respond to review team questions within 24 hours
- [ ] If rejected: read the rejection reason carefully, fix the exact issue, resubmit
- [ ] After approval: enable phased release (iOS) or staged rollout (Android)
- [ ] Monitor crash rates for first 48 hours post-release
- [ ] Check user reviews for new bug reports within first week
