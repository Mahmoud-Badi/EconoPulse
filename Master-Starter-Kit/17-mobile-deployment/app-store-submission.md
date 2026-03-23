# App Store Submission Guide

## Why This Matters

Your first app store submission will take 2-4 hours, not because the app is not ready, but because you forgot a screenshot size, a privacy policy URL, or the IDFA declaration. Your second submission will take 20 minutes. This guide makes your first submission feel like your tenth.

---

## Apple App Store (App Store Connect)

### Account Setup

1. **Enroll in the Apple Developer Program** -- $99/year, required for App Store distribution
2. Visit [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/)
3. Use a company Apple ID, not a personal one. If the company dissolves or a team member leaves, you need access continuity.
4. **Team roles:**
   - **Account Holder** -- full control, legal agreements, payment. One per team.
   - **Admin** -- manage apps, certificates, profiles. Assign to lead developer.
   - **App Manager** -- manage specific apps, submit for review. Assign to project managers.
   - **Developer** -- download profiles, create development certificates. Assign to all engineers.
   - **Marketing** -- read-only access to analytics and sales data.

### App Registration

1. **Create a Bundle ID** in the Apple Developer Portal (Certificates, Identifiers & Profiles > Identifiers):
   - Format: reverse domain notation -- `com.{{COMPANY_NAME}}.{{APP_SLUG}}`
   - Explicit App ID (not wildcard) for production apps
   - Enable capabilities: Push Notifications, Associated Domains, Sign in with Apple (if used)
2. **Register the app in App Store Connect:**
   - New App > Select Bundle ID > Choose primary language > Enter SKU (any unique string)

### Store Listing Metadata

| Field | Limit | Tips |
|-------|-------|------|
| App Name | 30 characters | Unique across the entire App Store. Check availability early. |
| Subtitle | 30 characters | Supplement the name. Do not repeat the name. Focus on value proposition. |
| Keywords | 100 characters | Comma-separated, no spaces after commas. Do not repeat words from app name. Use singular forms. |
| Description | 4,000 characters | First 3 lines visible before "more" -- make them count. No keyword stuffing. |
| Promotional Text | 170 characters | Can be updated without a new binary. Use for seasonal promotions, new features. |
| What's New | 4,000 characters | Required for updates. List user-facing changes, not internal refactors. |

**Metadata template:**

```
App Name: {{APP_NAME}}
Subtitle: {{APP_SUBTITLE}}
Keywords: {{KEYWORD_1}},{{KEYWORD_2}},{{KEYWORD_3}},{{KEYWORD_4}},{{KEYWORD_5}}

Description:
{{APP_DESCRIPTION_LINE_1}}

{{APP_DESCRIPTION_BODY}}

Key Features:
- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}

Promotional Text: {{PROMOTIONAL_TEXT}}

What's New in This Version:
- {{CHANGE_1}}
- {{CHANGE_2}}
```

### Screenshots

**Required sizes (at minimum):**

| Device | Size (pixels) | Required? |
|--------|---------------|-----------|
| 6.7" iPhone (iPhone 15 Pro Max) | 1290 x 2796 | Yes |
| 6.5" iPhone (iPhone 11 Pro Max) | 1242 x 2688 | Yes |
| 5.5" iPhone (iPhone 8 Plus) | 1242 x 2208 | Yes |
| 12.9" iPad Pro (6th gen) | 2048 x 2732 | Required if universal app |

- Minimum 1 screenshot per size, maximum 10
- First 3 screenshots are visible in search results -- make them the strongest
- Use device frames and captions for professional appearance
- **Automated screenshots:** Use `fastlane snapshot` to capture screenshots in multiple languages and device sizes from a single test run

### Required URLs

| URL | Required? | Notes |
|-----|-----------|-------|
| Privacy Policy URL | Yes (mandatory) | Must be publicly accessible. Even a simple page on your marketing site works. |
| Support URL | Yes (mandatory) | Can be a help page, email form, or FAQ. |
| Marketing URL | No (optional) | Your app's marketing website or landing page. |

### App Review Guidelines -- Common Rejections

| Code | Reason | How to Avoid |
|------|--------|--------------|
| **4.3 Spam** | App is too similar to existing apps or your own other apps | Ensure unique value proposition. Do not submit template apps without substantial customization. |
| **2.1 Performance** | App crashes, has bugs, or uses private APIs | Test on physical devices (not just simulator). Test all edge cases. Run Xcode Analyzer. |
| **5.1.1 Data Collection** | App collects data without adequate disclosure or consent | Declare all data collection in the privacy nutrition label. Add in-app consent flows before accessing contacts, photos, location. |
| **3.1.1 In-App Purchase** | Selling digital content without IAP, or linking to external purchase | All digital goods/subscriptions must use Apple IAP. Physical goods and services are exempt. |
| **4.0 Design** | UI is too basic, uses web views for core functionality, or doesn't feel native | Use native navigation patterns. Avoid wrapping a website in a web view. Ensure the app provides value beyond what the website offers. |

### Review Notes

In App Store Connect, there is a "Notes for Review" field. Use it.

```
Review Notes Template:
---
Test Account:
Email: {{TEST_ACCOUNT_EMAIL}}
Password: {{TEST_ACCOUNT_PASSWORD}}

Feature Explanations:
- {{FEATURE_NAME}}: {{BRIEF_EXPLANATION_OF_HOW_TO_ACCESS_AND_USE}}

Special Configuration:
- {{ANY_SPECIAL_SETUP_REQUIRED}}

Demo Mode:
- {{IF_APPLICABLE_HOW_TO_ENABLE_DEMO_MODE}}
```

### Compliance Declarations

- **IDFA (Identifier for Advertisers):** If you use any analytics SDK that accesses IDFA (even Firebase Analytics), you must declare it. Select applicable use cases: "Attribute an app installation to a previously served ad," "Track actions within this app," etc.
- **Export Compliance:** If your app uses HTTPS (it does), answer Yes to "Does your app use encryption?" Then select "Yes" to "Does your app qualify for any of the exemptions?" and choose "It uses standard encryption (HTTPS/TLS)." File an exemption if this is your first submission.
- **Content Rights:** Declare if you have the rights to all content in your app (music, images, etc.).

### Appeal Process

If your app is rejected:
1. **Read the rejection message carefully.** It usually cites a specific guideline.
2. **Fix the issue** if the rejection is legitimate.
3. **Reply in Resolution Center** if you believe the rejection is incorrect. Be factual, cite specific guidelines, explain why your app complies.
4. **Request an appeal** through the App Review Board if the Resolution Center response is unsatisfactory. Use [developer.apple.com/contact/app-store](https://developer.apple.com/contact/app-store/).

---

## Google Play Store (Google Play Console)

### Account Setup

1. **Create a Google Play Developer account** -- $25 one-time fee
2. Visit [play.google.com/console/signup](https://play.google.com/console/signup/)
3. Use a company Google account, not a personal one
4. Complete identity verification (takes 2-7 days for organizations)

### App Creation

1. **Create app** in Google Play Console:
   - App name (can be changed later, unlike iOS)
   - Default language
   - App or Game
   - Free or Paid (cannot change from free to paid after publishing)
2. **Package name:** `com.{{COMPANY_NAME}}.{{APP_SLUG}}` -- this is permanent and cannot be changed after publishing

### Store Listing

| Field | Limit | Tips |
|-------|-------|------|
| Title | 50 characters | Include primary keyword. Can be changed after launch. |
| Short Description | 80 characters | Appears in search results. Front-load value proposition. |
| Full Description | 4,000 characters | Keywords in first and last paragraphs help ASO. Use formatting (no markdown, but line breaks work). |
| Feature Graphic | 1024 x 500 px | Required. Displayed prominently. No device frames in the graphic itself. |
| Screenshots | Min 2, max 8 per device type | 16:9 or 9:16 aspect ratio. Minimum 320px, maximum 3840px on any side. |

**Metadata template:**

```
Title: {{APP_TITLE}}
Short Description: {{SHORT_DESCRIPTION}}

Full Description:
{{FULL_DESCRIPTION_PARAGRAPH_1}}

{{FULL_DESCRIPTION_BODY}}

Features:
- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}

Contact: {{SUPPORT_EMAIL}}
```

### Content Rating (IARC)

1. Complete the content rating questionnaire in Google Play Console
2. Answer questions about violence, sexuality, language, controlled substances, user-generated content, data sharing
3. You receive an automatic IARC rating (Everyone, Teen, Mature, etc.)
4. **Must be completed before publishing.** Takes 5-10 minutes.
5. Re-submit the questionnaire if your app content changes significantly

### Data Safety Section

Google requires a Data Safety declaration. For each data type:

| Question | What to Declare |
|----------|-----------------|
| Data types collected | Email, name, phone, location, photos, crash logs, analytics, device IDs |
| Is data encrypted in transit? | Yes (if using HTTPS -- you should be) |
| Can users request data deletion? | Provide a mechanism (in-app or via support email) |
| Is data shared with third parties? | Declare analytics providers (Firebase, Sentry, etc.) |

Be thorough. Google audits these declarations and can suspend apps with inaccurate disclosures.

### Target API Level

- Google requires apps to target an API level within 1 year of the latest Android release
- As of 2025: must target API level 34 (Android 14) or higher for new apps
- Existing apps must update within 1 year of a new API level release
- Check current requirements: [developer.android.com/google/play/requirements/target-sdk](https://developer.android.com/google/play/requirements/target-sdk)

### Review Process

- **Timeline:** Typically 1-3 days for new apps, hours for updates
- **Policy enforcement:** Automated checks run first (malware, policy violations), then manual review
- **Rejections** come via email with specific policy citations
- **Appeals:** Reply to the rejection email or use the "Appeal" form in the Play Console

### Large Screen Support

- Declare large screen support (tablets, foldables, Chromebooks) in the Play Console
- If your app does not support large screens, it may be demoted in search results on those devices
- Test on tablet emulators and foldable form factors

---

## Pre-Submission Checklists

### Apple App Store Checklist

- [ ] Apple Developer Program membership is active
- [ ] Bundle ID is registered with correct capabilities
- [ ] App is created in App Store Connect
- [ ] App name is unique and within 30 characters
- [ ] Subtitle, keywords, description are complete
- [ ] Screenshots uploaded for all required device sizes
- [ ] Privacy policy URL is live and accessible
- [ ] Support URL is live and accessible
- [ ] App Review notes include test account credentials
- [ ] IDFA declaration is complete
- [ ] Export compliance is declared
- [ ] Content rights are confirmed
- [ ] App icon is 1024x1024 PNG, no alpha channel, no rounded corners
- [ ] Build is uploaded via Xcode or Transporter
- [ ] Build has completed processing in App Store Connect
- [ ] App pricing and availability are configured
- [ ] Age rating questionnaire is complete

### Google Play Store Checklist

- [ ] Google Play Developer account is verified
- [ ] App is created in Play Console
- [ ] Package name is correct (cannot be changed later)
- [ ] Title, short description, full description are complete
- [ ] Feature graphic (1024x500) is uploaded
- [ ] Screenshots uploaded for phone (required) and tablet (recommended)
- [ ] IARC content rating questionnaire is complete
- [ ] Data safety section is complete and accurate
- [ ] Target API level meets current requirements
- [ ] App signing key is enrolled in Play App Signing
- [ ] AAB (Android App Bundle) is uploaded -- not APK
- [ ] Store listing is complete in all target languages
- [ ] Pricing and distribution are configured
- [ ] App icon is 512x512 PNG
- [ ] Privacy policy URL is provided
