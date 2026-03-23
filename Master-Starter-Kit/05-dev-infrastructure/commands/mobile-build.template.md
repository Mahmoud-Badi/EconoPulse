# /mobile-build $ARGUMENT

Trigger a mobile build for the specified profile (development, preview, or production).

## Steps

1. **Parse the build profile** from `$ARGUMENT`:
   - `dev` or `development` — Development build (debug, local testing)
   - `preview` — Preview build (internal distribution, TestFlight/Play Store internal)
   - `production` or `prod` — Production build (store submission)
   - If `$ARGUMENT` is empty, default to `development`.

2. **Read the mobile config** to determine framework:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cat apps/mobile/app.json 2>/dev/null | head -20
   cat apps/mobile/eas.json 2>/dev/null | head -30
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cat apps/mobile_flutter/pubspec.yaml 2>/dev/null | head -20
   ```
<!-- ENDIF -->

3. **Pre-build checks** — verify the project is in a buildable state:
   ```bash
   {{TYPE_CHECK_CMD}} 2>&1 | tail -10
   ```
   If type check fails, STOP and report errors. Do not proceed with a broken build.

4. **Determine target platform** from `$ARGUMENT` or ask user:
   - `ios` — iOS only
   - `android` — Android only
   - `all` or omitted — Both platforms

5. **Execute the build**:

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   **Development build (local):**
   ```bash
   # iOS
   cd apps/mobile && npx expo run:ios 2>&1 | tail -30

   # Android
   cd apps/mobile && npx expo run:android 2>&1 | tail -30
   ```

   **Preview build (EAS):**
   ```bash
   cd apps/mobile && eas build --profile preview --platform $PLATFORM 2>&1 | tail -30
   ```

   **Production build (EAS):**
   ```bash
   cd apps/mobile && eas build --profile production --platform $PLATFORM 2>&1 | tail -30
   ```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   **Development build (local):**
   ```bash
   # iOS
   cd apps/mobile_flutter && flutter build ios --debug 2>&1 | tail -30

   # Android
   cd apps/mobile_flutter && flutter build apk --debug 2>&1 | tail -30
   ```

   **Preview build:**
   ```bash
   # iOS (no code signing for preview)
   cd apps/mobile_flutter && flutter build ios --release --no-codesign 2>&1 | tail -30

   # Android
   cd apps/mobile_flutter && flutter build apk --release 2>&1 | tail -30
   ```

   **Production build:**
   ```bash
   # iOS
   cd apps/mobile_flutter && flutter build ipa 2>&1 | tail -30

   # Android (App Bundle for Play Store)
   cd apps/mobile_flutter && flutter build appbundle 2>&1 | tail -30
   ```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "native" -->
   **iOS (Xcode):**
   ```bash
   cd apps/ios && xcodebuild -scheme {{PROJECT_SLUG}} -configuration $CONFIG -destination 'generic/platform=iOS' build 2>&1 | tail -30
   ```

   **Android (Gradle):**
   ```bash
   cd apps/android && ./gradlew assemble$CONFIG 2>&1 | tail -30
   ```
<!-- ENDIF -->

6. **Capture build output** — record:
   - Build duration
   - Output artifact path (IPA, APK, AAB)
   - Build ID (if using EAS or CI)
   - Any warnings generated during build

7. **Output report**:

```
MOBILE BUILD REPORT
====================
Date: {date}
Framework: {{MOBILE_FRAMEWORK}}
Profile: {development/preview/production}
Platform: {ios/android/both}

Type check:    {PASS/FAIL}
iOS build:     {PASS/FAIL/SKIP}  {duration}  {artifact path}
Android build: {PASS/FAIL/SKIP}  {duration}  {artifact path}
Build ID:      {id or N/A}
Warnings:      {count}

NEXT STEPS:
- {dev: "Run on simulator/device"}
- {preview: "Distribute via TestFlight / Play Store internal track"}
- {production: "Submit via /mobile-deploy"}
```

## Rules

- **Always type-check before building.** A failed type check means a failed build — catch it early.
- **Development builds are local.** They do not go through EAS or CI. Use `expo run:ios` / `flutter build` for fast iteration.
- **Preview builds go to testers.** Use EAS Build or CI for reproducible builds. Never distribute a local development build to testers.
- **Production builds must be signed.** Ensure code signing is configured before attempting a production build. See `17-mobile-deployment/code-signing.md`.
- **Never skip the pre-build type check.** Even if "it was working 5 minutes ago."
- **Report the artifact path.** The user needs to know where the IPA/APK/AAB landed.
