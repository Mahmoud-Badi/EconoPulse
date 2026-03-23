# Mobile Testing Strategy

## Why This Matters

Mobile apps have a unique testing problem: you cannot hot-fix production. A web app bug can be patched in minutes. A mobile app bug requires a new build, a store review, and users to update. A crash that slips past testing stays in production for days. Testing is not optional -- it is the only thing standing between your code and a 1-star review that says "crashes on launch."

---

## Unit Testing

### React Native: Jest + React Native Testing Library (RNTL)

**Setup:**

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

**Test file naming:** `ComponentName.test.tsx` or `__tests__/ComponentName.test.tsx`

**Component test:**

```typescript
// ProfileCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileCard } from './ProfileCard';

describe('ProfileCard', () => {
  const mockUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('renders user name and email', () => {
    render(<ProfileCard user={mockUser} />);

    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('jane@example.com')).toBeTruthy();
  });

  it('calls onEdit when edit button is pressed', () => {
    const onEdit = jest.fn();
    render(<ProfileCard user={mockUser} onEdit={onEdit} />);

    fireEvent.press(screen.getByTestId('edit-button'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('shows loading skeleton when user is undefined', () => {
    render(<ProfileCard user={undefined} />);
    expect(screen.getByTestId('profile-skeleton')).toBeTruthy();
  });
});
```

**Hook test:**

```typescript
// useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('logs in successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('user@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('user@example.com');
    });
  });
});
```

**Mocking native modules:**

```typescript
// jest.setup.js
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-camera', () => ({
  Camera: 'Camera',
  useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: 37.78, longitude: -122.41 } })
  ),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

### Flutter: flutter_test

**Test file naming:** `widget_name_test.dart` in the `test/` directory, mirroring the `lib/` structure.

**Widget test:**

```dart
// test/widgets/profile_card_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:{{APP_SLUG}}/widgets/profile_card.dart';

void main() {
  group('ProfileCard', () {
    testWidgets('renders user name and email', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ProfileCard(
            user: User(name: 'Jane Doe', email: 'jane@example.com'),
          ),
        ),
      );

      expect(find.text('Jane Doe'), findsOneWidget);
      expect(find.text('jane@example.com'), findsOneWidget);
    });

    testWidgets('calls onEdit when edit button is tapped', (tester) async {
      var editCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: ProfileCard(
            user: User(name: 'Jane Doe', email: 'jane@example.com'),
            onEdit: () => editCalled = true,
          ),
        ),
      );

      await tester.tap(find.byKey(const Key('edit-button')));
      await tester.pumpAndSettle();

      expect(editCalled, isTrue);
    });
  });
}
```

**Golden tests (visual snapshots):**

```dart
// test/widgets/profile_card_golden_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:{{APP_SLUG}}/widgets/profile_card.dart';

void main() {
  testWidgets('ProfileCard matches golden file', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ProfileCard(
          user: User(name: 'Jane Doe', email: 'jane@example.com'),
        ),
      ),
    );

    await expectLater(
      find.byType(ProfileCard),
      matchesGoldenFile('goldens/profile_card.png'),
    );
  });
}

// Run: flutter test --update-goldens (to generate baseline)
// Run: flutter test (to compare against baseline)
```

### Native iOS: XCTest

```swift
// ProfileCardTests.swift
import XCTest
@testable import {{PROJECT_SLUG}}

class ProfileCardTests: XCTestCase {
    func testDisplaysUserName() {
        let user = User(name: "Jane Doe", email: "jane@example.com")
        let card = ProfileCard(user: user)

        XCTAssertEqual(card.nameLabel.text, "Jane Doe")
        XCTAssertEqual(card.emailLabel.text, "jane@example.com")
    }

    func testCallsOnEditWhenTapped() {
        var editCalled = false
        let user = User(name: "Jane Doe", email: "jane@example.com")
        let card = ProfileCard(user: user, onEdit: { editCalled = true })

        card.editButton.sendActions(for: .touchUpInside)

        XCTAssertTrue(editCalled)
    }
}
```

### Native Android: JUnit 5 + MockK

```kotlin
// ProfileCardViewModelTest.kt
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class ProfileCardViewModelTest {
    private val userRepository = mockk<UserRepository>()
    private val viewModel = ProfileCardViewModel(userRepository)

    @Test
    fun `loads user profile on init`() = runTest {
        coEvery { userRepository.getUser("123") } returns User(
            name = "Jane Doe",
            email = "jane@example.com"
        )

        viewModel.loadUser("123")

        assertEquals("Jane Doe", viewModel.uiState.value.name)
        assertEquals("jane@example.com", viewModel.uiState.value.email)
    }
}
```

**Compose UI test:**

```kotlin
// ProfileCardTest.kt
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Rule
import org.junit.Test

class ProfileCardTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun displaysUserNameAndEmail() {
        composeTestRule.setContent {
            ProfileCard(user = User(name = "Jane Doe", email = "jane@example.com"))
        }

        composeTestRule.onNodeWithText("Jane Doe").assertIsDisplayed()
        composeTestRule.onNodeWithText("jane@example.com").assertIsDisplayed()
    }

    @Test
    fun callsOnEditWhenEditButtonClicked() {
        var editCalled = false
        composeTestRule.setContent {
            ProfileCard(
                user = User(name = "Jane Doe", email = "jane@example.com"),
                onEdit = { editCalled = true }
            )
        }

        composeTestRule.onNodeWithContentDescription("Edit profile").performClick()
        assertTrue(editCalled)
    }
}
```

---

## Integration Testing

### React Native: Detox (Recommended)

Detox is a gray-box testing framework -- it knows about the app's internal state (animations, network, etc.) and waits for the app to become idle before interacting.

```javascript
// e2e/auth.test.js
describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login with valid credentials', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@example.com');
    await element(by.id('password-input')).typeText('wrong');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.text('Invalid credentials')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should navigate to forgot password', async () => {
    await element(by.id('forgot-password-link')).tap();

    await waitFor(element(by.id('reset-password-screen')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
```

### React Native: Maestro (Simpler Alternative)

Maestro uses YAML-based test definitions -- no code required.

```yaml
# e2e/flows/login.yaml
appId: com.{{COMPANY_NAME}}.{{APP_SLUG}}
---
- launchApp
- tapOn:
    id: "email-input"
- inputText: "test@example.com"
- tapOn:
    id: "password-input"
- inputText: "password123"
- tapOn:
    id: "login-button"
- assertVisible:
    id: "home-screen"
    timeout: 5000
```

```bash
# Run Maestro tests
maestro test e2e/flows/login.yaml

# Run all flows in a directory
maestro test e2e/flows/
```

### Flutter: integration_test

```dart
// integration_test/auth_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:{{APP_SLUG}}/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Authentication Flow', () {
    testWidgets('login with valid credentials', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(const Key('email-input')), 'test@example.com');
      await tester.enterText(find.byKey(const Key('password-input')), 'password123');
      await tester.tap(find.byKey(const Key('login-button')));
      await tester.pumpAndSettle(const Duration(seconds: 5));

      expect(find.byKey(const Key('home-screen')), findsOneWidget);
    });
  });
}
```

### Native iOS: XCUITest

```swift
// UITests/AuthenticationTests.swift
import XCTest

class AuthenticationTests: XCTestCase {
    let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
    }

    func testLoginWithValidCredentials() {
        let emailField = app.textFields["email-input"]
        emailField.tap()
        emailField.typeText("test@example.com")

        let passwordField = app.secureTextFields["password-input"]
        passwordField.tap()
        passwordField.typeText("password123")

        app.buttons["login-button"].tap()

        let homeScreen = app.otherElements["home-screen"]
        XCTAssertTrue(homeScreen.waitForExistence(timeout: 5))
    }
}
```

### Native Android: Espresso + Compose

```kotlin
// AuthenticationTest.kt
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import org.junit.Rule
import org.junit.Test

class AuthenticationTest {
    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun loginWithValidCredentials() {
        composeTestRule.onNodeWithTag("email-input")
            .performTextInput("test@example.com")

        composeTestRule.onNodeWithTag("password-input")
            .performTextInput("password123")

        composeTestRule.onNodeWithTag("login-button")
            .performClick()

        composeTestRule.waitUntil(5000) {
            composeTestRule.onAllNodesWithTag("home-screen")
                .fetchSemanticsNodes().isNotEmpty()
        }

        composeTestRule.onNodeWithTag("home-screen")
            .assertIsDisplayed()
    }
}
```

---

## E2E Testing in CI

### Simulators and Emulators in CI

| CI Platform | iOS Simulator | Android Emulator | Notes |
|------------|---------------|------------------|-------|
| **GitHub Actions (macOS runner)** | Yes | Yes (slow) | macOS runner required for iOS. $0.08/min. |
| **Codemagic** | Yes | Yes | M2 Mac Minis, fast. Included in Flutter plans. |
| **BrowserStack App Automate** | No (real devices) | No (real devices) | Real device testing, parallel execution |
| **Firebase Test Lab** | No | Yes (real + virtual) | Free tier: 10 virtual devices/day, 5 physical/day |

### Firebase Test Lab Integration

```bash
# Run Detox tests on Firebase Test Lab (Android)
gcloud firebase test android run \
  --type instrumentation \
  --app android/app/build/outputs/apk/debug/app-debug.apk \
  --test android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk \
  --device model=Pixel7,version=34,locale=en,orientation=portrait \
  --timeout 10m

# Run Flutter integration tests on Firebase Test Lab
gcloud firebase test android run \
  --type instrumentation \
  --app build/app/outputs/apk/debug/app-debug.apk \
  --test build/app/outputs/apk/androidTest/debug/app-debug-androidTest.apk \
  --timeout 5m
```

### Screenshot Testing

```bash
# Detox screenshot capture
await device.takeScreenshot('login-screen');

# Compare screenshots in CI:
# 1. Store baseline screenshots in git
# 2. Capture new screenshots during CI run
# 3. Use pixel-diff or perceptual-diff to compare
# 4. Fail CI if diff exceeds threshold (e.g., 0.1% pixel difference)
```

---

## Test Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| **Business logic** (shared packages, utils, hooks) | >80% | This code is the hardest to debug in production. Test it thoroughly. |
| **UI components** (screens, widgets) | >60% | Focus on interaction tests (tap, type, navigate), not pixel tests. |
| **E2E flows** (critical user journeys) | Cover all critical paths | Auth flow, core action, payment/checkout, settings changes. |
| **Native modules** | Manual testing checklist | Native modules often have simulator limitations. Test on real devices. |

### Minimum Test Counts Per Component

| Component Type | Minimum Tests | What to Test |
|---------------|---------------|--------------|
| Screen / Page | 3 | Renders correctly, handles loading state, handles error state |
| Form | 4 | Valid submission, each validation rule, loading state, error state |
| List / Feed | 3 | Empty state, populated state, pagination / infinite scroll |
| Modal / Dialog | 2 | Opens and closes, confirms action |
| Custom Hook | 3 | Happy path, error handling, edge cases |
| API Client | 2 per endpoint | Success response, error response |
| Navigation | 2 per route | Navigates forward, navigates back |

---

## Mock Patterns for Native Modules

### React Native Mock Patterns

```typescript
// __mocks__/expo-camera.ts
export const Camera = {
  Constants: {
    Type: { back: 'back', front: 'front' },
    FlashMode: { off: 'off', on: 'on', auto: 'auto' },
  },
};
export const useCameraPermissions = jest.fn(() => [
  { granted: true, canAskAgain: true },
  jest.fn().mockResolvedValue({ granted: true }),
]);

// __mocks__/expo-location.ts
export const requestForegroundPermissionsAsync = jest.fn(() =>
  Promise.resolve({ status: 'granted' })
);
export const getCurrentPositionAsync = jest.fn(() =>
  Promise.resolve({
    coords: { latitude: 37.7849, longitude: -122.4094, altitude: 0 },
    timestamp: Date.now(),
  })
);

// __mocks__/@react-native-async-storage/async-storage.ts
const store: Record<string, string> = {};
export default {
  getItem: jest.fn((key: string) => Promise.resolve(store[key] || null)),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    return Promise.resolve();
  }),
};
```

### Flutter Mock Patterns

```dart
// test/mocks/mock_location_service.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:{{APP_SLUG}}/services/location_service.dart';

class MockLocationService extends LocationService {
  @override
  Future<Position> getCurrentPosition() async {
    return Position(latitude: 37.7849, longitude: -122.4094);
  }

  @override
  Future<bool> requestPermission() async {
    return true;
  }
}

// Using MockMethodChannel for platform channels
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const channel = MethodChannel('plugins.flutter.io/camera');

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (MethodCall methodCall) async {
      if (methodCall.method == 'initialize') {
        return {'textureId': 1};
      }
      return null;
    });
  });
}
```

### Simulator Limitations

| Feature | iOS Simulator | Android Emulator | Solution |
|---------|--------------|------------------|----------|
| Push notifications | Not supported | Limited (FCM works via Google Play Services) | Test on real devices, mock in unit tests |
| Biometrics (Face ID) | Simulated (Features > Face ID) | Simulated (fingerprint via CLI) | Use simulator features, verify on real device |
| Camera | Not available | Emulated (virtual scene) | Mock in tests, test on real device |
| GPS / Location | Simulated (Debug > Location) | Simulated (Extended Controls) | Use simulator location simulation |
| NFC | Not available | Not available | Test on real devices only |
| Bluetooth | Not available | Not available | Test on real devices only |
| Performance profiling | Not representative | Not representative | Always profile on real devices |

---

## Test Organization

### React Native Project Structure

```
src/
  components/
    ProfileCard/
      ProfileCard.tsx
      ProfileCard.test.tsx       # Unit test (co-located)
  screens/
    LoginScreen/
      LoginScreen.tsx
      LoginScreen.test.tsx       # Unit test (co-located)
  hooks/
    useAuth.ts
    useAuth.test.ts              # Hook test (co-located)
e2e/
  jest.config.js                 # Detox jest config
  auth.test.js                   # E2E: authentication flow
  onboarding.test.js             # E2E: onboarding flow
  core-action.test.js            # E2E: primary user action
  settings.test.js               # E2E: settings and profile
```

### Flutter Project Structure

```
lib/
  widgets/
    profile_card.dart
  screens/
    login_screen.dart
test/
  widgets/
    profile_card_test.dart       # Unit/widget test
    goldens/
      profile_card.png           # Golden file
  screens/
    login_screen_test.dart       # Widget test
integration_test/
  auth_test.dart                 # Integration test
  app_test.dart                  # Full app integration test
test_driver/
  integration_test.dart          # Driver for Firebase Test Lab
```

### Native iOS Project Structure

```
{{PROJECT_SLUG}}/
  Models/
  Views/
  ViewModels/
{{PROJECT_SLUG}}Tests/
  Models/
    UserTests.swift
  ViewModels/
    ProfileViewModelTests.swift
{{PROJECT_SLUG}}UITests/
  AuthenticationTests.swift
  OnboardingTests.swift
```

### Native Android Project Structure

```
app/src/
  main/java/com/{{COMPANY_NAME}}/{{APP_SLUG}}/
    ui/
    data/
    domain/
  test/java/com/{{COMPANY_NAME}}/{{APP_SLUG}}/
    ui/
      ProfileCardViewModelTest.kt
    data/
      UserRepositoryTest.kt
  androidTest/java/com/{{COMPANY_NAME}}/{{APP_SLUG}}/
    AuthenticationTest.kt
    OnboardingTest.kt
```
