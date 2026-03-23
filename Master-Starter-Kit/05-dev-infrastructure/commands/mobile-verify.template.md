# /mobile-verify

Run a 10-step mobile quality gate to verify mobile app health before marking a task as done.

## Steps

1. **TypeScript / Dart analysis**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && npx tsc --noEmit 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && dart analyze 2>&1 | tail -20
   ```
<!-- ENDIF -->
   Result: PASS (zero errors) / FAIL (list errors)

2. **Lint check**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && npx expo lint 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && dart format --set-exit-if-changed . 2>&1 | tail -20
   ```
<!-- ENDIF -->
   Result: PASS / FAIL

3. **Unit tests**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && npx jest --passWithNoTests 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && flutter test 2>&1 | tail -20
   ```
<!-- ENDIF -->
   Result: PASS ({N} tests) / FAIL (list failures)

4. **iOS build check**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && npx expo run:ios --no-install 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && flutter build ios --no-codesign 2>&1 | tail -20
   ```
<!-- ENDIF -->
   Result: PASS / FAIL

5. **Android build check**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```bash
   cd apps/mobile && npx expo run:android --no-install 2>&1 | tail -20
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```bash
   cd apps/mobile_flutter && flutter build apk --debug 2>&1 | tail -20
   ```
<!-- ENDIF -->
   Result: PASS / FAIL

6. **Safe area audit** — scan all screen files for SafeAreaView/SafeArea usage:
   - Every screen component must use safe area handling
   - No content should render under the notch or home indicator
   Result: PASS / WARN (list files missing safe area)

7. **Touch target audit** — scan for undersized touch targets:
   - Check all Pressable/GestureDetector/Button components
   - Minimum: 44pt (iOS) / 48dp (Android) height and width
   Result: PASS / WARN (list components below minimum)

8. **Accessibility audit** — verify screen reader support:
   - All interactive elements have accessibility labels
   - All images have alt text / accessibility descriptions
   - Dynamic Type / font scaling is not blocked
   Result: PASS / WARN (list issues)

9. **Offline behavior check** — verify offline handling:
   - Network disconnection shows appropriate UI (banner, cached data, or offline state)
   - No unhandled network errors crash the app
   Result: PASS / SKIP (if online-only) / WARN

10. **Design consistency check** — compare with design tokens:
    - Colors use design tokens, not hardcoded hex values
    - Spacing uses consistent scale
    - Typography uses defined text styles
    Result: PASS / WARN

## Output Report

```
MOBILE VERIFICATION REPORT
============================
Date: {date}
Framework: {{MOBILE_FRAMEWORK}}

1. Type check:      {PASS/FAIL}  {error count}
2. Lint:            {PASS/FAIL}  {warning count}
3. Unit tests:      {PASS/FAIL}  {test count} tests, {coverage}%
4. iOS build:       {PASS/FAIL}
5. Android build:   {PASS/FAIL}
6. Safe areas:      {PASS/WARN}  {issue count} screens
7. Touch targets:   {PASS/WARN}  {issue count} components
8. Accessibility:   {PASS/WARN}  {issue count} elements
9. Offline:         {PASS/SKIP/WARN}
10. Design tokens:  {PASS/WARN}  {issue count} hardcoded values

OVERALL: {PASS — all green / WARN — non-blocking issues / FAIL — must fix}
```

## Rules

- Steps 1-5 are **blocking** — all must PASS to proceed.
- Steps 6-10 are **advisory** — WARN is acceptable but should be addressed.
- If any blocking step FAILS, fix the issue and re-run `/mobile-verify`.
- Never mark a mobile task as done without running this command.
- Run on BOTH platforms — an iOS-only pass is not sufficient.
