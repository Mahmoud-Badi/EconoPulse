# /mobile-deploy $ARGUMENT

Submit a mobile build to TestFlight, Play Store, or Firebase App Distribution.

## Steps

1. **Parse the deployment target** from `$ARGUMENT`:
   - `testflight` — Apple TestFlight (internal or external)
   - `play-internal` — Google Play Store internal testing track
   - `play-closed` — Google Play Store closed testing track
   - `firebase` — Firebase App Distribution
   - `production` — Both App Store and Google Play production
   - If `$ARGUMENT` is empty, ask the user which target.

2. **Verify a production-ready build exists**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && eas build:list --limit 5 2>&1 | head -20
   ```
   Check that the most recent build has status `finished` and the correct profile.
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   Check for build artifacts:
   ```bash
   ls -la apps/mobile_flutter/build/ios/ipa/*.ipa 2>/dev/null
   ls -la apps/mobile_flutter/build/app/outputs/bundle/release/*.aab 2>/dev/null
   ```
<!-- ENDIF -->
   If no build exists, instruct the user to run `/mobile-build production` first.

3. **Pre-deployment checklist** — verify before submitting:

   - [ ] Version number bumped from last submission
   - [ ] Build number is unique and higher than previous
   - [ ] Release notes / changelog prepared
   - [ ] Screenshots up to date (if first submission or UI changed)
   - [ ] Privacy policy URL is live and accessible
   - [ ] Test account credentials ready (Apple review)
   - [ ] App icons at all required sizes
   - [ ] No debug flags or dev-only features enabled

4. **Execute the deployment**:

   **TestFlight:**
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && eas submit --platform ios 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && xcrun altool --upload-app --type ios --file build/ios/ipa/*.ipa --apiKey $API_KEY --apiIssuer $ISSUER_ID 2>&1 | tail -20
   ```
<!-- ENDIF -->

   **Google Play (internal/closed):**
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && eas submit --platform android 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   # Using Fastlane (recommended)
   cd apps/mobile_flutter/android && bundle exec fastlane internal 2>&1 | tail -20
   ```
<!-- ENDIF -->

   **Firebase App Distribution:**
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && npx firebase-tools appdistribution:distribute $APK_PATH --app $FIREBASE_APP_ID --groups "internal-testers" 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && firebase appdistribution:distribute build/app/outputs/apk/release/app-release.apk --app $FIREBASE_APP_ID --groups "internal-testers" 2>&1 | tail -20
   ```
<!-- ENDIF -->

   **Production (App Store + Play Store):**
   - iOS: Submit through App Store Connect (after TestFlight review passes)
   - Android: Promote from closed testing to production track
   - **GATE:** Confirm with the user before submitting to production. This is irreversible without a new version.

5. **OTA Update (if applicable)**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   For JS-only changes (no native code changes):
   ```bash
   cd apps/mobile && eas update --branch production --message "$CHANGELOG" 2>&1 | tail -20
   ```
   **WARNING:** OTA updates only work if the `runtimeVersion` matches the installed binary. See `16-mobile-native-features/ota-updates.md`.
<!-- ENDIF -->

6. **Post-deployment verification**:
   - Confirm the build appears in the target platform's console
   - For TestFlight: verify processing completes (can take 15-30 minutes)
   - For Play Store: verify the build is in the correct track
   - For Firebase: verify testers received the distribution notification

7. **Output report**:

```
MOBILE DEPLOYMENT REPORT
=========================
Date: {date}
Framework: {{MOBILE_FRAMEWORK}}
Target: {testflight/play-internal/play-closed/firebase/production}

Version: {version}
Build Number: {build number}
Submission ID: {id or N/A}

iOS:     {SUBMITTED/SKIP/FAIL}  {target details}
Android: {SUBMITTED/SKIP/FAIL}  {target details}
OTA:     {PUBLISHED/SKIP/N/A}

NEXT STEPS:
- {testflight: "Wait for processing (~15-30 min), then add testers"}
- {play-internal: "Share opt-in link with internal testers"}
- {firebase: "Testers will receive email/notification"}
- {production: "Monitor crash rates for 24 hours post-release"}
```

## Rules

- **Never deploy without a passing `/mobile-verify`.** Run `/mobile-verify` first.
- **Always confirm before production deployment.** This is the one command where we pause and ask.
- **Version numbers must increment.** Both App Store and Play Store reject builds with duplicate or lower version numbers.
- **TestFlight before production.** Never submit directly to App Store production without TestFlight validation.
- **Keep release notes concise.** Under 500 characters for the store, detailed changelog in your internal docs.
- **Monitor after deployment.** Check crash rates, ANR rates, and user feedback within 24 hours of a production release.
- **OTA is not a shortcut.** Only use OTA for JS-only changes. Native code changes require a full binary build and store submission.
