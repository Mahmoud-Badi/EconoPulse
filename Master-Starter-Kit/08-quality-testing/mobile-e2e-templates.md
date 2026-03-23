# Mobile E2E Test Templates

End-to-end test patterns for mobile apps. These tests run on a simulator/emulator or real device, verifying full user flows.

---

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

## Detox (React Native)

### Setup

Detox config lives in `apps/mobile/.detoxrc.js` (see `17-mobile-deployment/mobile-test-configs/detox.config.template.js`).

```bash
# Install Detox CLI
npm install -g detox-cli

# Build the test app
cd apps/mobile && detox build --configuration ios.sim.debug

# Run tests
cd apps/mobile && detox test --configuration ios.sim.debug
```

### Auth Flow Test

```typescript
// e2e/auth.test.ts
describe("Authentication", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show login screen on launch", async () => {
    await expect(element(by.text("Sign In"))).toBeVisible();
    await expect(element(by.id("email-input"))).toBeVisible();
    await expect(element(by.id("password-input"))).toBeVisible();
  });

  it("should show validation errors for empty form", async () => {
    await element(by.id("login-button")).tap();
    await expect(element(by.text("Email is required"))).toBeVisible();
  });

  it("should login with valid credentials", async () => {
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();

    // Wait for navigation to home screen
    await waitFor(element(by.id("home-screen")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should show error for invalid credentials", async () => {
    await element(by.id("email-input")).typeText("wrong@example.com");
    await element(by.id("password-input")).typeText("wrongpassword");
    await element(by.id("login-button")).tap();

    await waitFor(element(by.text("Invalid email or password")))
      .toBeVisible()
      .withTimeout(3000);
  });

  it("should logout successfully", async () => {
    // Login first
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();
    await waitFor(element(by.id("home-screen")))
      .toBeVisible()
      .withTimeout(5000);

    // Navigate to settings and logout
    await element(by.id("tab-settings")).tap();
    await element(by.id("logout-button")).tap();
    await expect(element(by.text("Sign In"))).toBeVisible();
  });
});
```

### List Screen Test

```typescript
// e2e/{resource}-list.test.ts
describe("{Resource} List", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Login
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();
    await waitFor(element(by.id("home-screen")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should show {resource} list", async () => {
    await element(by.id("tab-{resource}")).tap();
    await waitFor(element(by.id("{resource}-list")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should pull to refresh", async () => {
    await element(by.id("{resource}-list")).swipe("down");
    await waitFor(element(by.id("{resource}-list")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should navigate to detail on tap", async () => {
    await element(by.id("{resource}-item-0")).tap();
    await waitFor(element(by.id("{resource}-detail")))
      .toBeVisible()
      .withTimeout(3000);
  });

  it("should navigate back from detail", async () => {
    await element(by.id("back-button")).tap();
    await expect(element(by.id("{resource}-list"))).toBeVisible();
  });
});
```

### Form Test

```typescript
// e2e/{resource}-form.test.ts
describe("{Resource} Form", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Login and navigate to form
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();
    await waitFor(element(by.id("home-screen")))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id("tab-{resource}")).tap();
    await element(by.id("add-{resource}-button")).tap();
  });

  it("should show the form", async () => {
    await expect(element(by.id("{resource}-form"))).toBeVisible();
  });

  it("should fill and submit the form", async () => {
    await element(by.id("name-input")).typeText("Test {Resource}");
    await element(by.id("description-input")).typeText("A test description");

    // Scroll down if needed
    await element(by.id("{resource}-form")).scrollTo("bottom");

    await element(by.id("submit-button")).tap();

    // Should navigate back to list with new item
    await waitFor(element(by.text("Test {Resource}")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should handle keyboard dismissal", async () => {
    await element(by.id("name-input")).tap();
    await element(by.id("name-input")).typeText("Test");

    // Tap outside to dismiss keyboard
    await element(by.id("{resource}-form")).tap();

    // Form should still be visible
    await expect(element(by.id("{resource}-form"))).toBeVisible();
  });
});
```

<!-- ENDIF -->

---

## Maestro (Cross-framework)

Maestro works with both React Native and Flutter. Tests are written in YAML.

### Auth Flow

```yaml
# e2e/auth-flow.yaml
appId: com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}
---
- launchApp
- assertVisible: "Sign In"

# Login with valid credentials
- tapOn:
    id: "email-input"
- inputText: "test@example.com"
- tapOn:
    id: "password-input"
- inputText: "password123"
- tapOn: "Sign In"

# Verify home screen
- assertVisible:
    id: "home-screen"
    timeout: 5000
```

### List and Navigation

```yaml
# e2e/{resource}-list.yaml
appId: com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}
---
- launchApp

# Login first
- runFlow: auth-login.yaml

# Navigate to {resource}
- tapOn:
    id: "tab-{resource}"
- assertVisible:
    id: "{resource}-list"

# Pull to refresh
- scroll:
    direction: DOWN
    speed: 40

# Tap first item
- tapOn:
    id: "{resource}-item-0"
- assertVisible:
    id: "{resource}-detail"

# Go back
- tapOn:
    id: "back-button"
- assertVisible:
    id: "{resource}-list"
```

### Form Submission

```yaml
# e2e/{resource}-create.yaml
appId: com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}
---
- launchApp
- runFlow: auth-login.yaml

# Navigate to create form
- tapOn:
    id: "tab-{resource}"
- tapOn:
    id: "add-{resource}-button"

# Fill form
- tapOn:
    id: "name-input"
- inputText: "Test {Resource}"
- tapOn:
    id: "description-input"
- inputText: "A test description"

# Submit
- scrollUntilVisible:
    element: "submit-button"
    direction: DOWN
- tapOn: "submit-button"

# Verify created
- assertVisible:
    text: "Test {Resource}"
    timeout: 5000
```

---

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

## Flutter Integration Tests

### Setup

```dart
// integration_test/app_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:{{PROJECT_SLUG}}/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Auth Flow', () {
    testWidgets('login and logout', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Should show login screen
      expect(find.text('Sign In'), findsOneWidget);

      // Enter credentials
      await tester.enterText(
        find.byKey(const Key('email-input')),
        'test@example.com',
      );
      await tester.enterText(
        find.byKey(const Key('password-input')),
        'password123',
      );

      // Tap login
      await tester.tap(find.byKey(const Key('login-button')));
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // Should be on home screen
      expect(find.byKey(const Key('home-screen')), findsOneWidget);

      // Navigate to settings and logout
      await tester.tap(find.byKey(const Key('tab-settings')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('logout-button')));
      await tester.pumpAndSettle();

      // Should be back on login
      expect(find.text('Sign In'), findsOneWidget);
    });
  });

  group('{Resource} List', () {
    testWidgets('shows list and navigates to detail', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Login first
      await tester.enterText(
        find.byKey(const Key('email-input')),
        'test@example.com',
      );
      await tester.enterText(
        find.byKey(const Key('password-input')),
        'password123',
      );
      await tester.tap(find.byKey(const Key('login-button')));
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // Navigate to {resource}
      await tester.tap(find.byKey(const Key('tab-{resource}')));
      await tester.pumpAndSettle();

      // Should show list
      expect(find.byKey(const Key('{resource}-list')), findsOneWidget);

      // Tap first item
      await tester.tap(find.byKey(const Key('{resource}-item-0')));
      await tester.pumpAndSettle();

      // Should show detail
      expect(find.byKey(const Key('{resource}-detail')), findsOneWidget);
    });
  });
}
```

### Running Integration Tests

```bash
# On connected device or emulator
cd apps/mobile_flutter && flutter test integration_test/app_test.dart

# On specific device
cd apps/mobile_flutter && flutter test integration_test/app_test.dart -d "iPhone 15 Pro"

# On Chrome (web, if applicable)
cd apps/mobile_flutter && flutter test integration_test/app_test.dart -d chrome
```

<!-- ENDIF -->

---

## Test Organization

```
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
apps/mobile/
  e2e/
    auth.test.ts
    {resource}-list.test.ts
    {resource}-form.test.ts
    {resource}-detail.test.ts
    navigation.test.ts
    offline.test.ts
  .detoxrc.js
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
apps/mobile_flutter/
  integration_test/
    app_test.dart
    auth_test.dart
    {resource}_list_test.dart
    {resource}_form_test.dart
  maestro/
    auth-flow.yaml
    {resource}-list.yaml
    {resource}-create.yaml
<!-- ENDIF -->
```

## Rules

- **Test IDs everywhere.** Use `testID` (React Native) or `Key` (Flutter) on all interactive elements. Never rely on text matching alone — it breaks with localization.
- **Login helper.** Extract login into a reusable function/flow. Every E2E test that requires auth should use it.
- **Wait, don't sleep.** Use `waitFor` / `pumpAndSettle` with timeouts, not arbitrary delays. Flaky tests are worse than no tests.
- **Test on both platforms.** A passing iOS E2E does not guarantee Android works. Run on both.
- **Clean state per test.** Use `newInstance: true` or fresh app launch to avoid state leaking between tests.
- **Keep E2E tests focused.** One flow per test file. Auth flow, CRUD flow, navigation flow — separate files.
