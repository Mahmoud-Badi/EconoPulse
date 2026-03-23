# Mobile Deployment Gotchas

App store submission, code signing, and mobile CI/CD gotchas. Every item here delayed a release or caused a rejection.

---

## Apple App Store Rejections

### Guideline 4.3 — Spam (Design)

Apple rejects apps that are too similar to existing apps or that appear to be generated from a template without meaningful customization.

**Symptom:** Rejection with "Your app duplicates the content and functionality of other apps submitted by you or another developer" even if your app is unique.
**Fix:** Ensure your app has a distinct visual identity, unique features, and meaningful content. Customize all default template UIs. Include a detailed explanation in review notes about what makes your app different.

---

### Guideline 2.1 — Performance (Crashes and Bugs)

Apple tests on their devices. If the app crashes during review, it is rejected immediately.

**Symptom:** "We discovered one or more bugs in your app when reviewed on [device] running [iOS version]."
**Fix:** Test on real devices (not just simulators). Test on the latest iOS version AND one version back. Test with a fresh install (no cached data). Ensure the test account in review notes works.

---

### Guideline 5.1.1 — Data Collection and Privacy

If your app collects data but does not explain why, or if the privacy labels do not match actual behavior, Apple rejects.

**Symptom:** "Your app's privacy information does not adequately describe your app's data collection practices."
**Fix:** Audit every SDK and third-party library for data collection. Firebase, analytics SDKs, crash reporters all collect data. Declare everything in App Privacy labels. Your privacy policy must match your declarations.

---

### Guideline 3.1.1 — In-App Purchase

If your app sells digital content or subscriptions without using Apple's In-App Purchase system, Apple rejects. This includes linking to external payment pages.

**Symptom:** "Your app uses a mechanism other than the In-App Purchase API to unlock features."
**Fix:** Use StoreKit for all digital goods. Physical goods and services (Uber rides, food delivery) are exempt. Do not link to web-based payment flows for digital content.

---

### Review Notes: Always Include Test Credentials

If your app requires login, Apple reviewers need test account credentials. Without them, they cannot review and will reject.

**Symptom:** "We were unable to review your app as it requires a login but we were not provided test credentials."
**Fix:** Create a dedicated review account with full access. Include credentials in the "Review Notes" field. Ensure the account works on the reviewer's network (no IP restrictions).

---

## Google Play Rejections

### Target API Level Requirements

Google Play requires apps to target a recent Android API level. As of 2024, new apps must target API 34 (Android 14) or higher. This changes annually.

**Symptom:** "Your app currently targets API level X. From [date], you must target at least API level Y."
**Fix:** Keep `targetSdkVersion` in `build.gradle` up to date. Test on the target API level before submission. Check the Google Play requirements page annually.

---

### Data Safety Section Accuracy

Google Play requires a detailed data safety declaration. If it does not match your app's behavior, Google rejects or removes the app.

**Symptom:** "Your app's data safety section does not accurately reflect your app's data handling practices."
**Fix:** Audit all data collection. Include data from third-party SDKs (Firebase, analytics, ad networks). Update the data safety section whenever you add a new SDK.

---

### Sensitive Permissions Without Core Functionality

Requesting SMS, call log, or background location permissions without core functionality justification triggers additional review.

**Symptom:** "Your app requests [PERMISSION] but does not appear to require it for core functionality. Remove this permission or provide a justification."
**Fix:** Only request permissions your app genuinely needs. If you need background location, prepare a video demonstrating why it is essential. Submit a permissions declaration form.

---

## Code Signing

### iOS Certificate Expiry (1 Year)

iOS distribution certificates expire after 1 year. If you do not renew them before expiry, your CI/CD pipeline breaks and you cannot submit updates.

**Symptom:** EAS Build or Fastlane fails with "Your certificate has expired" or "No valid signing identity found."
**Fix:** Set a calendar reminder 2 weeks before certificate expiry. Use Fastlane Match to manage certificates centrally. Apple allows creating new certificates before old ones expire.

---

### Provisioning Profile Device Limit

Ad Hoc provisioning profiles are limited to 100 devices per device type (100 iPhones, 100 iPads). Devices cannot be removed until the annual membership renewal.

**Symptom:** "This device cannot be added because the maximum number of registered devices has been reached."
**Fix:** Use TestFlight for beta distribution instead of Ad Hoc profiles. TestFlight supports 10,000 external testers with no device registration. Reserve Ad Hoc slots for development devices only.

---

### Android Keystore Loss Is Unrecoverable

If you lose your Android upload keystore, you cannot update your app on Google Play. Play App Signing mitigates this by keeping the signing key on Google's servers.

**Symptom:** Cannot sign APK/AAB with the original key. Google Play rejects the update.
**Fix:** Always enable Play App Signing when creating a new app. Back up the upload key in a secure location (password manager, encrypted cloud storage). Never commit keystores to git.

---

### Code Signing on CI: Credential Storage

Storing signing credentials in CI is the most common source of build failures.

```
# EAS (recommended for Expo)
eas credentials  # manages creds in Expo's cloud

# Fastlane Match (recommended for native)
fastlane match appstore  # stores creds in encrypted git repo

# GitHub Actions
# Store as base64-encoded secrets
echo $P12_CERT | base64 --decode > certificate.p12
echo $PROVISIONING_PROFILE | base64 --decode > profile.mobileprovision
```

**Symptom:** CI builds fail with "No signing certificate found" or "Provisioning profile does not match."
**Fix:** Use EAS Credentials (Expo) or Fastlane Match (native) for automated credential management. For manual setup, store credentials as base64-encoded CI secrets.

---

## EAS Build Gotchas

### EAS Build Queue Times

EAS Build has a queue. Free tier queues can be 15-60 minutes. Priority plans get faster builds.

**Symptom:** Build starts 30+ minutes after submission.
**Fix:** Use local development builds for daily development (`npx expo run:ios`). Reserve EAS Build for preview and production builds. Consider a paid plan for faster queue times.

---

### EAS Build and Monorepo Root

EAS Build must be able to find your project within the monorepo. If your `eas.json` is in the wrong place, builds fail.

```json
// eas.json (in apps/mobile/, NOT monorepo root)
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

**Symptom:** "eas.json not found" or build fails to install monorepo dependencies.
**Fix:** Place `eas.json` in the Expo project directory (e.g., `apps/mobile/`). Run `eas build` from that directory. Ensure `.easignore` excludes non-mobile code.

---

### Runtime Version Mismatch with OTA Updates

EAS Update (OTA) requires the JS bundle to be compatible with the native binary. If the `runtimeVersion` does not match, updates are silently ignored.

```json
// app.json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"  // ties runtime version to app version
    }
  }
}
```

**Symptom:** OTA updates are published successfully but the app does not receive them.
**Fix:** Use a consistent `runtimeVersion` policy. `appVersion` ties updates to the binary version. `fingerprint` auto-calculates based on native dependencies. Avoid hardcoded runtime versions.

---

## TestFlight Gotchas

### Beta App Review for External Testers

External TestFlight testing (non-team members) requires a Beta App Review. This takes 1-2 days and can be rejected for the same reasons as full App Review.

**Symptom:** External testers cannot access the build. Status shows "Waiting for Review" or "Rejected."
**Fix:** Start with internal testing (up to 100 team members, no review required). Only submit for external testing when the app is stable. Include test account credentials.

---

### TestFlight Build Expiry (90 Days)

TestFlight builds expire 90 days after upload. Users on expired builds see "This beta has expired."

**Symptom:** Beta testers report they can no longer open the app.
**Fix:** Upload new builds regularly. Set a reminder before the 90-day expiry. Automate TestFlight uploads in your CI/CD pipeline.

---

## General Deployment Gotchas

### First Submission Takes Longer

The first app submission to either store takes significantly longer than updates:
- Apple: 24-48 hours for first review (vs 24 hours for updates)
- Google: 3-7 days for first review (vs 1-3 days for updates)

**Symptom:** "We're reviewing your first submission" status lasting longer than expected.
**Fix:** Plan for a 1-week buffer for first submissions. Submit early, even if you plan to delay the actual release date. Both stores allow you to set a release date in the future.

---

### App Store Screenshot Requirements Change

Apple periodically changes required screenshot sizes and device types. An update submission can be rejected if screenshots are missing for newly required devices.

**Symptom:** "Missing screenshots for [device type]" rejection on an update, even though the previous version was accepted.
**Fix:** Automate screenshot generation (fastlane snapshot, Maestro). Generate screenshots for all required device sizes every release. Check Apple's current requirements before each submission.
