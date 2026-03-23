# Standalone Mobile Project Template

## Purpose

Not every mobile app needs a monorepo. If you are building a mobile-only product — no companion web app, no shared TypeScript packages — a standalone project is simpler, faster to set up, and has zero monorepo overhead. This template covers project structures for each framework in standalone mode.

---

## When to Use Standalone vs Monorepo

| Signal | Use Standalone | Use Monorepo |
|--------|---------------|-------------|
| Mobile-only product (no web app) | Yes | No |
| Mobile + marketing site only (static site, no shared logic) | Yes | No |
| Mobile + web app sharing TypeScript types/validators | No | Yes |
| Mobile + web app with shared business logic | No | Yes |
| Prototype / hackathon / MVP in a weekend | Yes | No |
| Mobile app with its own dedicated backend | Yes | Maybe |
| Mobile app consuming a third-party API (no custom backend) | Yes | No |
| Enterprise project with web + mobile + admin panel | No | Yes |

**Rule of thumb:** If the mobile app and web app will never share TypeScript code, use standalone. The moment you want `import { User } from "@myapp/types"` in both apps, switch to a monorepo.

---

## Backend Integration for Standalone Apps

Standalone mobile apps need a backend. Three common patterns:

### Option A: Own REST API (Full Control)

Deploy your own backend (Node.js, Python, Go, etc.) and consume it via HTTP.

```
Mobile App → REST API (your server) → Database
```

- Full control over data, auth, and business logic
- More work to set up and maintain
- Best for: apps with complex business logic, custom data requirements

### Option B: Backend-as-a-Service (Fast Start)

Use Firebase, Supabase, or AWS Amplify for auth, database, storage, and functions.

```
Mobile App → BaaS SDK → Managed Database + Auth + Storage
```

- Minimal backend code
- Vendor lock-in risk
- Best for: MVPs, prototypes, apps where time-to-market matters most

### Option C: Hybrid (BaaS + Custom Functions)

Use BaaS for auth and storage, but add serverless functions for business logic.

```
Mobile App → BaaS (auth, storage) + Edge Functions (business logic) → Database
```

- Balance of convenience and control
- Best for: apps that start simple but will grow in complexity

---

## React Native + Expo (Standalone)

### Directory Structure

```
{{PROJECT_SLUG}}/
  package.json
  app.json                        # Expo config
  eas.json                        # EAS Build + Submit
  tsconfig.json                   # TypeScript config
  babel.config.js                 # Babel config
  .env                            # Environment variables
  .env.example                    # Documented env vars

  app/                            # Expo Router (file-based routing)
    _layout.tsx                   # Root layout (providers, fonts)
    +not-found.tsx                # 404 screen

    (tabs)/                       # Tab navigator
      _layout.tsx                 # Tab bar config
      index.tsx                   # Home
      {{TAB_2}}.tsx
      profile.tsx

    (auth)/                       # Auth screens
      _layout.tsx
      login.tsx
      register.tsx

    {{DOMAIN_1}}/
      index.tsx                   # List
      [id].tsx                    # Detail
      create.tsx                  # Create form

  components/
    ui/                           # Base UI primitives
      Button.tsx
      Text.tsx
      Card.tsx
      Input.tsx
      LoadingSpinner.tsx
    {{DOMAIN_1}}/                 # Domain components
      {{DOMAIN_1}}Card.tsx
      {{DOMAIN_1}}List.tsx
    layout/
      SafeArea.tsx
      KeyboardAvoid.tsx
      ScreenContainer.tsx

  hooks/
    useAuth.ts
    useColorScheme.ts
    usePushNotifications.ts

  lib/
    api.ts                        # API client (fetch or axios)
    storage.ts                    # MMKV wrapper
    auth.ts                       # Token storage (SecureStore)
    supabase.ts                   # OR: BaaS client (if using Supabase/Firebase)

  stores/
    useAuthStore.ts
    use{{DOMAIN_1}}Store.ts
    useUIStore.ts

  types/                          # TypeScript types (local — no shared package)
    user.ts
    {{DOMAIN_1}}.ts
    api.ts

  validators/                     # Zod schemas (local — no shared package)
    user.ts
    {{DOMAIN_1}}.ts

  constants/
    Colors.ts
    Layout.ts
    Typography.ts
    Config.ts                     # API URLs, feature flags

  assets/
    images/
    fonts/
    animations/
```

### `package.json`

```json
{
  "name": "{{PROJECT_SLUG}}",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "dev:ios": "expo run:ios",
    "dev:android": "expo run:android",
    "build:dev": "eas build --profile development",
    "build:preview": "eas build --profile preview",
    "build:prod": "eas build --profile production",
    "submit:ios": "eas submit --platform ios",
    "submit:android": "eas submit --platform android",
    "lint": "expo lint",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-native-mmkv": "^3.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.3.0",
    "jest": "^29.0.0",
    "jest-expo": "~52.0.0"
  }
}
```

### Key Difference from Monorepo Version

- **Types and validators live inside the project** (not in shared packages)
- **No `metro.config.js` monorepo configuration** (default Metro config works)
- **No `workspace:*` dependencies** (all from npm)
- **Simpler `tsconfig.json`** (no cross-project references)

---

## Flutter (Standalone)

### Directory Structure

```
{{PROJECT_SLUG}}/
  pubspec.yaml
  analysis_options.yaml
  build.yaml                      # Build runner config

  lib/
    main.dart                     # Entry point
    app.dart                      # MaterialApp.router

    routes/
      app_router.dart             # GoRouter config
      route_names.dart
      guards.dart

    screens/
      home/
        home_screen.dart
      {{DOMAIN_1}}/
        {{DOMAIN_1}}_list_screen.dart
        {{DOMAIN_1}}_detail_screen.dart
        {{DOMAIN_1}}_create_screen.dart
      auth/
        login_screen.dart
        register_screen.dart
      profile/
        profile_screen.dart
        settings_screen.dart

    widgets/
      buttons/
        primary_button.dart
      cards/
        {{DOMAIN_1}}_card.dart
      inputs/
        text_field.dart
      layout/
        app_scaffold.dart
        loading_overlay.dart
        error_widget.dart

    models/
      user.dart
      user.freezed.dart
      user.g.dart
      {{DOMAIN_1}}.dart
      {{DOMAIN_1}}.freezed.dart
      {{DOMAIN_1}}.g.dart

    services/
      api_client.dart             # Dio instance + interceptors
      auth_service.dart
      {{DOMAIN_1}}_service.dart
      storage_service.dart

    providers/
      auth_provider.dart
      {{DOMAIN_1}}_provider.dart
      api_client_provider.dart
      theme_provider.dart

    utils/
      formatters.dart
      validators.dart
      extensions.dart

    constants/
      api_constants.dart
      colors.dart
      text_styles.dart
      spacing.dart

  test/
    models/
    services/
    providers/
    widgets/

  integration_test/
    app_test.dart

  assets/
    images/
    fonts/
    animations/

  ios/
  android/
```

### Key Difference from Monorepo Version

- **No `apps/mobile_flutter/` nesting** — project is at the root
- **No Turborepo, no pnpm-workspace.yaml** — Flutter manages its own dependencies
- **No OpenAPI contract sharing** — types are defined manually in `lib/models/`
- **Self-contained** — clone the repo and `flutter run`

---

## Native iOS (Standalone)

### Directory Structure

```
{{PROJECT_SLUG}}-ios/
  {{PROJECT_SLUG}}.xcodeproj
  {{PROJECT_SLUG}}/
    {{PROJECT_SLUG}}App.swift     # @main entry
    ContentView.swift

    App/
      AppDelegate.swift
      DependencyContainer.swift
      Constants.swift

    Models/
      User.swift
      {{DOMAIN_1}}.swift
      APIResponse.swift
      APIError.swift

    Views/
      Auth/
        LoginView.swift
        RegisterView.swift
      Home/
        HomeView.swift
        HomeViewModel.swift
      {{DOMAIN_1}}/
        {{DOMAIN_1}}ListView.swift
        {{DOMAIN_1}}DetailView.swift
        {{DOMAIN_1}}ViewModel.swift
      Profile/
        ProfileView.swift
        SettingsView.swift
      Components/
        PrimaryButton.swift
        LoadingView.swift
        ErrorView.swift
        {{DOMAIN_1}}CardView.swift

    Services/
      APIClient.swift
      AuthService.swift
      {{DOMAIN_1}}Service.swift
      KeychainService.swift

    Navigation/
      AppRouter.swift
      Route.swift
      DeepLinkHandler.swift

    Extensions/
      Date+Formatting.swift
      View+Modifiers.swift

    Resources/
      Assets.xcassets/
      Fonts/

  {{PROJECT_SLUG}}Tests/
  {{PROJECT_SLUG}}UITests/
  Package.swift                   # SPM dependencies
```

---

## Native Android (Standalone)

### Directory Structure

```
{{PROJECT_SLUG}}-android/
  build.gradle.kts
  settings.gradle.kts
  gradle.properties

  app/
    build.gradle.kts

    src/main/
      AndroidManifest.xml
      java/{{ANDROID_PACKAGE_PATH}}/
        {{PROJECT_NAME}}Application.kt
        MainActivity.kt

        di/
          AppModule.kt
          NetworkModule.kt

        data/
          model/
            User.kt
            {{DOMAIN_1}}.kt
          remote/
            ApiClient.kt
            AuthInterceptor.kt
            {{DOMAIN_1}}Api.kt
          local/
            DataStoreManager.kt
            TokenManager.kt
          repository/
            AuthRepository.kt
            {{DOMAIN_1}}Repository.kt

        ui/
          theme/
            Theme.kt
            Color.kt
            Type.kt
          navigation/
            AppNavHost.kt
            Route.kt
          screens/
            auth/
              LoginScreen.kt
              LoginViewModel.kt
            home/
              HomeScreen.kt
              HomeViewModel.kt
            {{DOMAIN_1}}/
              {{DOMAIN_1}}ListScreen.kt
              {{DOMAIN_1}}DetailScreen.kt
              {{DOMAIN_1}}ViewModel.kt
            profile/
              ProfileScreen.kt
          components/
            PrimaryButton.kt
            LoadingIndicator.kt
            ErrorCard.kt

      res/
        values/
        drawable/
        font/

    src/test/
    src/androidTest/
```

---

## BaaS Integration Examples

### Supabase (React Native)

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const supabaseStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: supabaseStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // important for mobile
    },
  }
);
```

### Firebase (Flutter)

```dart
// lib/services/firebase_service.dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../firebase_options.dart';

class FirebaseService {
  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  }

  static FirebaseAuth get auth => FirebaseAuth.instance;
  static FirebaseFirestore get firestore => FirebaseFirestore.instance;

  // Auth helpers
  static Future<UserCredential> signIn(String email, String password) {
    return auth.signInWithEmailAndPassword(email: email, password: password);
  }

  static Future<UserCredential> signUp(String email, String password) {
    return auth.createUserWithEmailAndPassword(email: email, password: password);
  }

  static Future<void> signOut() => auth.signOut();

  // Firestore helpers
  static CollectionReference<Map<String, dynamic>> collection(String name) {
    return firestore.collection(name);
  }
}
```

### Supabase (Native iOS — Swift)

```swift
// Services/SupabaseClient.swift
import Supabase

let supabase = SupabaseClient(
    supabaseURL: URL(string: Constants.supabaseURL)!,
    supabaseKey: Constants.supabaseAnonKey
)

// Usage in a service:
class OrderService {
    func getOrders() async throws -> [Order] {
        let response: [Order] = try await supabase
            .from("orders")
            .select()
            .order("created_at", ascending: false)
            .execute()
            .value
        return response
    }

    func createOrder(_ order: CreateOrderInput) async throws -> Order {
        let response: Order = try await supabase
            .from("orders")
            .insert(order)
            .select()
            .single()
            .execute()
            .value
        return response
    }
}
```

---

## Scaffolding Checklist (Standalone)

### React Native + Expo

- [ ] `npx create-expo-app@latest {{PROJECT_SLUG}} --template tabs`
- [ ] Install dependencies: `zustand`, `@tanstack/react-query`, `react-native-mmkv`, `expo-secure-store`, `zod`
- [ ] Create `types/`, `validators/`, `stores/`, `hooks/`, `lib/` directories
- [ ] Set up API client or BaaS client in `lib/`
- [ ] Configure EAS: `eas init && eas build:configure`
- [ ] Run on simulator: `npx expo start`

### Flutter

- [ ] `flutter create --org {{ORG_DOMAIN}} {{PROJECT_SLUG}}`
- [ ] Add dependencies to `pubspec.yaml` and run `flutter pub get`
- [ ] Create the directory structure from template above
- [ ] Run code generation: `dart run build_runner build`
- [ ] Set up API client or BaaS client in `lib/services/`
- [ ] Run on simulator: `flutter run`

### Native iOS

- [ ] Create Xcode project (SwiftUI, Swift)
- [ ] Add SPM dependencies
- [ ] Create the folder structure from template above
- [ ] Implement `APIClient.swift` or set up BaaS SDK
- [ ] Run on simulator

### Native Android

- [ ] Create Android Studio project (Compose)
- [ ] Add Gradle dependencies
- [ ] Create the package structure from template above
- [ ] Configure Hilt and implement API client
- [ ] Run on emulator

---

## Migrating from Standalone to Monorepo

When you later add a web app and want to share code:

1. Create the monorepo root (`pnpm-workspace.yaml`, `turbo.json`, root `package.json`)
2. Move the mobile project into `apps/mobile/`
3. Extract types into `packages/types/`
4. Extract validators into `packages/validators/`
5. Extract pure utilities into `packages/utils/`
6. Update imports in the mobile app to use `@{{PROJECT_SLUG}}/types`, etc.
7. Configure Metro for monorepo (see `monorepo-integration.md`)
8. Add the web app at `apps/web/`

This migration is straightforward if you kept types and validators in their own directories from the start (even within the standalone project). The extraction is mostly moving files and updating import paths.
