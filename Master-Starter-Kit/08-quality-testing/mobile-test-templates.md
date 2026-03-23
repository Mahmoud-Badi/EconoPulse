# Mobile Unit Test Templates

<!-- NOTE: Code examples below use Jest APIs (jest.fn, jest.mock). For Vitest projects, replace jest.* with vi.* — the APIs are compatible. Import { vi } from 'vitest' instead of @jest/globals. -->

Copy-paste test patterns for mobile components, screens, hooks, and native modules. Adapt to your project — do not use as-is.

---

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

## React Native + Jest + React Native Testing Library

### Component Test

```typescript
import { render, screen, fireEvent } from "@testing-library/react-native";
import { {Component} } from "@/components/ui/{Component}";

describe("{Component}", () => {
  it("renders with default props", () => {
    render(<{Component}>Press me</{Component}>);
    expect(screen.getByText("Press me")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<{Component} onPress={onPress}>Tap</{Component}>);
    fireEvent.press(screen.getByText("Tap"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders all variants", () => {
    const variants = ["default", "primary", "destructive"] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <{Component} variant={variant}>{variant}</{Component}>
      );
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it("is disabled when disabled prop is set", () => {
    const onPress = jest.fn();
    render(
      <{Component} onPress={onPress} disabled>
        Disabled
      </{Component}>
    );
    fireEvent.press(screen.getByText("Disabled"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("has correct accessibility role", () => {
    render(<{Component}>Accessible</{Component}>);
    expect(screen.getByRole("button")).toBeTruthy();
  });
});
```

### Screen Test (with TanStack Query)

```typescript
import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Screen}Screen from "@/app/{screen}";

// Mock the API
jest.mock("@/lib/api", () => ({
  api: {
    {resource}: {
      list: jest.fn(),
    },
  },
}));

import { api } from "@/lib/api";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("{Screen}Screen", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("shows loading skeleton initially", () => {
    (api.{resource}.list as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<{Screen}Screen />);
    // Skeleton should be visible
    expect(screen.getByTestId("{screen}-skeleton")).toBeTruthy();
  });

  it("shows data when loaded", async () => {
    (api.{resource}.list as jest.Mock).mockResolvedValue([
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ]);
    renderWithProviders(<{Screen}Screen />);
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeTruthy();
      expect(screen.getByText("Item 2")).toBeTruthy();
    });
  });

  it("shows empty state when no data", async () => {
    (api.{resource}.list as jest.Mock).mockResolvedValue([]);
    renderWithProviders(<{Screen}Screen />);
    await waitFor(() => {
      expect(screen.getByText(/no {resource} yet/i)).toBeTruthy();
    });
  });

  it("shows error state with retry", async () => {
    (api.{resource}.list as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );
    renderWithProviders(<{Screen}Screen />);
    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeTruthy();
      expect(screen.getByText(/retry/i)).toBeTruthy();
    });
  });
});
```

### Hook Test

```typescript
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { use{Hook} } from "@/hooks/use{Hook}";

describe("use{Hook}", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => use{Hook}());
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("updates state after action", async () => {
    const { result } = renderHook(() => use{Hook}());
    act(() => {
      result.current.doSomething();
    });
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Native Module Mock

```typescript
// __mocks__/expo-haptics.ts
export const impactAsync = jest.fn();
export const notificationAsync = jest.fn();
export const selectionAsync = jest.fn();
export const ImpactFeedbackStyle = {
  Light: "light",
  Medium: "medium",
  Heavy: "heavy",
};

// __mocks__/expo-secure-store.ts
const store: Record<string, string> = {};
export const getItemAsync = jest.fn((key: string) =>
  Promise.resolve(store[key] ?? null)
);
export const setItemAsync = jest.fn((key: string, value: string) => {
  store[key] = value;
  return Promise.resolve();
});
export const deleteItemAsync = jest.fn((key: string) => {
  delete store[key];
  return Promise.resolve();
});

// __mocks__/@react-native-async-storage/async-storage.ts
const storage: Record<string, string> = {};
export default {
  getItem: jest.fn((key: string) => Promise.resolve(storage[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    storage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete storage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
    return Promise.resolve();
  }),
};
```

<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

## Flutter + flutter_test

### Widget Test

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:{{PROJECT_SLUG}}/components/ui/{component}.dart';

void main() {
  group('{Component}', () {
    testWidgets('renders with default props', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: {Component}(child: Text('Press me'))),
        ),
      );
      expect(find.text('Press me'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: {Component}(
              onPressed: () => tapped = true,
              child: const Text('Tap'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Tap'));
      expect(tapped, isTrue);
    });

    testWidgets('is disabled when onPressed is null', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: {Component}(onPressed: null, child: Text('Disabled')),
          ),
        ),
      );
      final button = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      expect(button.enabled, isFalse);
    });

    testWidgets('meets minimum touch target', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: {Component}(
              onPressed: () {},
              child: const Text('Small'),
            ),
          ),
        ),
      );
      final size = tester.getSize(find.byType({Component}));
      expect(size.height, greaterThanOrEqualTo(48)); // Android minimum
    });
  });
}
```

### Screen Test (with Riverpod)

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:{{PROJECT_SLUG}}/screens/{screen}_screen.dart';
import 'package:{{PROJECT_SLUG}}/providers/{screen}_provider.dart';

void main() {
  group('{Screen}Screen', () {
    testWidgets('shows loading skeleton initially', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            {screen}Provider.overrideWith((ref) => throw UnimplementedError()),
          ],
          child: const MaterialApp(home: {Screen}Screen()),
        ),
      );
      expect(find.byType({Screen}Skeleton), findsOneWidget);
    });

    testWidgets('shows data when loaded', (tester) async {
      final items = [
        {Model}(id: '1', name: 'Item 1'),
        {Model}(id: '2', name: 'Item 2'),
      ];
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            {screen}Provider.overrideWithValue(AsyncData(items)),
          ],
          child: const MaterialApp(home: {Screen}Screen()),
        ),
      );
      expect(find.text('Item 1'), findsOneWidget);
      expect(find.text('Item 2'), findsOneWidget);
    });

    testWidgets('shows empty state when no data', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            {screen}Provider.overrideWithValue(const AsyncData([])),
          ],
          child: const MaterialApp(home: {Screen}Screen()),
        ),
      );
      expect(find.textContaining('No'), findsOneWidget);
    });

    testWidgets('shows error state with retry', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            {screen}Provider.overrideWithValue(
              AsyncError(Exception('Network error'), StackTrace.current),
            ),
          ],
          child: const MaterialApp(home: {Screen}Screen()),
        ),
      );
      expect(find.textContaining('error'), findsOneWidget);
      expect(find.text('Retry'), findsOneWidget);
    });
  });
}
```

### Service Test (with Mocked HTTP)

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:{{PROJECT_SLUG}}/services/{service}_service.dart';

@GenerateMocks([Dio])
import '{service}_service_test.mocks.dart';

void main() {
  late MockDio mockDio;
  late {Service}Service service;

  setUp(() {
    mockDio = MockDio();
    service = {Service}Service(dio: mockDio);
  });

  group('{Service}Service', () {
    test('list returns items', () async {
      when(mockDio.get('/api/{resource}')).thenAnswer(
        (_) async => Response(
          data: [
            {'id': '1', 'name': 'Item 1'},
          ],
          statusCode: 200,
          requestOptions: RequestOptions(),
        ),
      );

      final items = await service.list();
      expect(items, hasLength(1));
      expect(items.first.name, equals('Item 1'));
    });

    test('handles network error', () async {
      when(mockDio.get('/api/{resource}')).thenThrow(
        DioException(
          type: DioExceptionType.connectionTimeout,
          requestOptions: RequestOptions(),
        ),
      );

      expect(() => service.list(), throwsA(isA<DioException>()));
    });
  });
}
```

### Platform Channel Mock

```dart
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const channel = MethodChannel('{{PROJECT_SLUG}}/{module_name}');

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (call) async {
      switch (call.method) {
        case 'get{ModuleName}':
          return {'value': 'mocked'};
        default:
          return null;
      }
    });
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
  });
}
```

<!-- ENDIF -->

---

## Test Organization

```
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
apps/mobile/
  __tests__/
    components/
      ui/
        Button.test.tsx
        Card.test.tsx
    screens/
      HomeScreen.test.tsx
      ProfileScreen.test.tsx
    hooks/
      useAuth.test.ts
    lib/
      api.test.ts
  __mocks__/
    expo-haptics.ts
    expo-secure-store.ts
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
apps/mobile_flutter/
  test/
    widgets/
      ui/
        button_test.dart
        card_test.dart
    screens/
      home_screen_test.dart
      profile_screen_test.dart
    services/
      auth_service_test.dart
    providers/
      auth_provider_test.dart
<!-- ENDIF -->
```

## Rules

- **Every screen test covers all 4 states:** loading, data, empty, error. No exceptions.
- **Mock native modules.** Never call real native APIs in unit tests.
- **Test accessibility.** Verify `accessibilityRole` / `Semantics` on interactive elements.
- **Test touch targets.** Verify minimum size (44pt iOS / 48dp Android) on interactive components.
- **Name tests by behavior.** "shows error state with retry button" not "test case 3."
