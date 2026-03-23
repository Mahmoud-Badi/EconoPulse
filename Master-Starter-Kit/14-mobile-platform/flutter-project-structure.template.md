# Flutter Project Structure Template

## Project: {{PROJECT_NAME}}

**Framework:** Flutter {{FLUTTER_VERSION}}
**State Management:** Riverpod
**Routing:** GoRouter
**HTTP Client:** Dio
**Code Generation:** Freezed + json_serializable

Fill this template after choosing Flutter in `framework-decision-tree.md`. Replace all `{{PLACEHOLDERS}}` with project-specific values.

---

## Directory Structure

```
apps/mobile_flutter/
  pubspec.yaml                      # Dependencies, assets, fonts
  analysis_options.yaml             # Lint rules (flutter_lints + custom)
  build.yaml                        # Build runner config (Freezed, json_serializable)

  lib/
    main.dart                       # Entry point (ProviderScope, runApp)
    app.dart                        # MaterialApp.router — theme, GoRouter

    routes/                         # Routing configuration
      app_router.dart               # GoRouter definition (all routes)
      route_names.dart              # Named route constants
      guards.dart                   # Route guards (auth redirect)

    screens/                        # One file (or folder) per screen
      home/
        home_screen.dart
        home_widgets.dart           # Screen-specific widgets
      {{DOMAIN_1}}/
        {{DOMAIN_1}}_list_screen.dart
        {{DOMAIN_1}}_detail_screen.dart
        {{DOMAIN_1}}_create_screen.dart
      {{DOMAIN_2}}/
        {{DOMAIN_2}}_list_screen.dart
        {{DOMAIN_2}}_detail_screen.dart
      auth/
        login_screen.dart
        register_screen.dart
        forgot_password_screen.dart
      profile/
        profile_screen.dart
        settings_screen.dart

    widgets/                        # Reusable widgets (not screen-specific)
      buttons/
        primary_button.dart
        icon_button.dart
      cards/
        {{DOMAIN_1}}_card.dart
        {{DOMAIN_2}}_card.dart
      inputs/
        text_field.dart
        search_bar.dart
      layout/
        app_scaffold.dart           # Standard scaffold with nav bar
        loading_overlay.dart
        error_widget.dart
        empty_state.dart

    models/                         # Data classes (Freezed)
      user.dart                     # @freezed class User
      user.freezed.dart             # Generated
      user.g.dart                   # Generated (json_serializable)
      {{DOMAIN_1}}.dart
      {{DOMAIN_1}}.freezed.dart
      {{DOMAIN_1}}.g.dart
      {{DOMAIN_2}}.dart
      {{DOMAIN_2}}.freezed.dart
      {{DOMAIN_2}}.g.dart
      api_response.dart             # Generic paginated response wrapper
      api_error.dart                # Standardized error model

    services/                       # External communication
      api_client.dart               # Dio instance + interceptors (auth, logging)
      {{DOMAIN_1}}_service.dart     # {{DOMAIN_1}} CRUD API calls
      {{DOMAIN_2}}_service.dart     # {{DOMAIN_2}} CRUD API calls
      auth_service.dart             # Login, register, refresh token
      storage_service.dart          # SharedPreferences / Hive wrapper

    providers/                      # Riverpod providers
      auth_provider.dart            # AuthNotifier (AsyncNotifier)
      {{DOMAIN_1}}_provider.dart    # {{DOMAIN_1}} state + async operations
      {{DOMAIN_2}}_provider.dart    # {{DOMAIN_2}} state + async operations
      api_client_provider.dart      # Dio instance provider
      storage_provider.dart         # Storage instance provider
      theme_provider.dart           # Dark/light mode state

    utils/                          # Pure helpers (no Flutter imports)
      formatters.dart               # Date, currency, number formatters
      validators.dart               # Form field validators
      extensions.dart               # Dart extension methods
      logger.dart                   # Structured logging wrapper

    constants/                      # Static configuration
      api_constants.dart            # Base URL, endpoints, timeouts
      colors.dart                   # Color palette (light + dark)
      text_styles.dart              # TextTheme definitions
      spacing.dart                  # EdgeInsets and SizedBox constants
      route_paths.dart              # Route path strings

  test/                             # Unit + widget tests
    models/
      {{DOMAIN_1}}_test.dart
    services/
      {{DOMAIN_1}}_service_test.dart
    providers/
      {{DOMAIN_1}}_provider_test.dart
    widgets/
      {{DOMAIN_1}}_card_test.dart
    screens/
      home_screen_test.dart

  integration_test/                 # Integration tests (run on device/emulator)
    app_test.dart
    auth_flow_test.dart
    {{DOMAIN_1}}_flow_test.dart

  assets/                           # Static assets
    images/                         # PNG/SVG images
    fonts/                          # Custom font files
    animations/                     # Lottie files
    icons/                          # Custom icon SVGs

  ios/                              # iOS native project (auto-generated, rarely edited)
  android/                          # Android native project (auto-generated, rarely edited)
```

---

## Recommended Dependencies

### `pubspec.yaml`

```yaml
name: {{PROJECT_SLUG}}_mobile
description: {{PROJECT_DESCRIPTION}}
version: 1.0.0+1
publish_to: none

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.19.0"

dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0

  # Routing
  go_router: ^14.0.0

  # Networking
  dio: ^5.4.0
  retrofit: ^4.1.0                  # Type-safe API client generation

  # Data Classes
  freezed_annotation: ^2.4.0
  json_annotation: ^4.8.0

  # Storage
  shared_preferences: ^2.2.0
  flutter_secure_storage: ^9.0.0    # Token storage

  # UI
  cached_network_image: ^3.3.0      # Image caching
  shimmer: ^3.0.0                   # Loading skeletons
  flutter_svg: ^2.0.0               # SVG rendering

  # Utilities
  intl: ^0.19.0                     # Date/number formatting
  url_launcher: ^6.2.0              # Opening external URLs
  connectivity_plus: ^6.0.0         # Network state

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  build_runner: ^2.4.0
  freezed: ^2.4.0
  json_serializable: ^6.7.0
  riverpod_generator: ^2.4.0
  retrofit_generator: ^8.1.0
  integration_test:
    sdk: flutter
  mocktail: ^1.0.0                  # Mocking for tests
```

---

## Key Files Explained

### `lib/main.dart` — Entry Point

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: App(),
    ),
  );
}
```

### `lib/app.dart` — Root Widget

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'routes/app_router.dart';
import 'providers/theme_provider.dart';
import 'constants/colors.dart';
import 'constants/text_styles.dart';

class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: '{{PROJECT_DISPLAY_NAME}}',
      theme: ThemeData(
        colorScheme: AppColors.lightScheme,
        textTheme: AppTextStyles.textTheme,
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: AppColors.darkScheme,
        textTheme: AppTextStyles.textTheme,
        useMaterial3: true,
      ),
      themeMode: themeMode,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
```

### `lib/services/api_client.dart` — Dio Configuration

```dart
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/api_constants.dart';
import 'storage_service.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: ApiConstants.baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  ));

  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) async {
      final token = await ref.read(storageServiceProvider).getAccessToken();
      if (token != null) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);
    },
    onError: (error, handler) async {
      if (error.response?.statusCode == 401) {
        // Token refresh logic here
      }
      handler.next(error);
    },
  ));

  return dio;
});
```

### `lib/models/{{DOMAIN_1}}.dart` — Freezed Data Class

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part '{{DOMAIN_1}}.freezed.dart';
part '{{DOMAIN_1}}.g.dart';

@freezed
class {{DOMAIN_1_CLASS}} with _${{DOMAIN_1_CLASS}} {
  const factory {{DOMAIN_1_CLASS}}({
    required String id,
    required String name,
    // Add domain-specific fields
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _{{DOMAIN_1_CLASS}};

  factory {{DOMAIN_1_CLASS}}.fromJson(Map<String, dynamic> json) =>
      _${{DOMAIN_1_CLASS}}FromJson(json);
}
```

---

## Integration with Shared Backend API

Flutter cannot directly consume TypeScript monorepo packages. Instead, share the API contract:

### Option A: Manual Alignment (Small APIs)

1. Define your API endpoints in the backend (tRPC / REST)
2. Mirror the request/response types as Freezed data classes in `lib/models/`
3. Keep endpoint paths in `constants/api_constants.dart` aligned with the backend

### Option B: OpenAPI Code Generation (Recommended for Medium+ APIs)

1. Backend exports an OpenAPI spec (`/api/openapi.json`)
2. Generate Dart client code: `dart run openapi_generator generate -i openapi.json`
3. Generated code goes in `lib/generated/` (gitignored, regenerated on update)
4. Services wrap the generated client with app-specific logic

### Option C: Shared Proto (gRPC APIs)

1. Define `.proto` files in a shared `protos/` directory
2. Generate Dart client code with `protoc`
3. Both Flutter and backend consume the same proto definitions

---

## First Steps After Scaffolding

### Immediate (Day 1)

- [ ] Run `flutter create --org {{ORG_DOMAIN}} apps/mobile_flutter`
- [ ] Replace generated structure with the template above
- [ ] Add all dependencies to `pubspec.yaml` and run `flutter pub get`
- [ ] Run `dart run build_runner build` to generate Freezed/json_serializable code
- [ ] Configure `analysis_options.yaml` with strict rules
- [ ] Run `flutter run` and confirm the app loads on simulator/device

### Foundation (Days 2-3)

- [ ] Set up Dio API client with auth interceptor in `services/api_client.dart`
- [ ] Create Freezed models for `User` and first domain entity
- [ ] Implement auth flow: `auth_provider.dart` + `auth_service.dart`
- [ ] Configure GoRouter with auth redirect guard
- [ ] Set up color scheme and text styles in `constants/`

### Integration (Days 4-5)

- [ ] Wire up list screen to fetch data from API
- [ ] Implement pull-to-refresh and pagination
- [ ] Add loading shimmer skeletons
- [ ] Set up deep linking in `routes/app_router.dart`
- [ ] Write unit tests for at least one service and one provider

### Polish

- [ ] Add error handling with user-friendly error widgets
- [ ] Configure app icons: `flutter_launcher_icons`
- [ ] Configure splash screen: `flutter_native_splash`
- [ ] Test on physical device (not just simulator)
- [ ] Run `flutter analyze` with zero warnings

---

## Checklist Before Proceeding

- [ ] All `{{PLACEHOLDERS}}` replaced with project-specific values
- [ ] `flutter pub get` succeeds with no dependency conflicts
- [ ] `dart run build_runner build` generates all Freezed/json_serializable code
- [ ] Auth flow redirects unauthenticated users to login screen
- [ ] GoRouter handles all routes without crashes
- [ ] API client successfully calls at least one endpoint
- [ ] App runs on both iOS simulator and Android emulator
- [ ] `flutter analyze` reports zero issues
