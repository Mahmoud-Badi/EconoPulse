# Native Project Structure Template

## Project: {{PROJECT_NAME}}

**iOS:** Swift {{SWIFT_VERSION}} with SwiftUI, MVVM pattern
**Android:** Kotlin with Jetpack Compose, MVVM pattern
**Minimum iOS:** {{MIN_IOS_VERSION}} (e.g., 16.0)
**Minimum Android SDK:** {{MIN_ANDROID_SDK}} (e.g., 26 / Android 8.0)

Fill this template after choosing Native in `framework-decision-tree.md`. Replace all `{{PLACEHOLDERS}}` with project-specific values.

---

## iOS Project Structure (SwiftUI + MVVM)

```
ios/{{PROJECT_NAME}}/
  {{PROJECT_NAME}}.xcodeproj        # Xcode project file
  {{PROJECT_NAME}}/
    {{PROJECT_NAME}}App.swift       # @main entry point
    ContentView.swift               # Root view (navigation container)
    Info.plist                      # App configuration

    App/                            # App-level configuration
      AppDelegate.swift             # Push notifications, deep links
      DependencyContainer.swift     # Manual DI or Swinject container
      Constants.swift               # API URLs, feature flags

    Models/                         # Data models (Codable structs)
      User.swift
      {{DOMAIN_1}}.swift
      {{DOMAIN_2}}.swift
      APIResponse.swift             # Generic paginated response
      APIError.swift                # Typed error enum

    Views/                          # SwiftUI Views (organized by feature)
      Auth/
        LoginView.swift
        RegisterView.swift
        ForgotPasswordView.swift
      Home/
        HomeView.swift
        HomeViewModel.swift
      {{DOMAIN_1}}/
        {{DOMAIN_1}}ListView.swift
        {{DOMAIN_1}}DetailView.swift
        {{DOMAIN_1}}CreateView.swift
        {{DOMAIN_1}}ViewModel.swift
      {{DOMAIN_2}}/
        {{DOMAIN_2}}ListView.swift
        {{DOMAIN_2}}DetailView.swift
        {{DOMAIN_2}}ViewModel.swift
      Profile/
        ProfileView.swift
        SettingsView.swift
        ProfileViewModel.swift
      Components/                   # Reusable view components
        PrimaryButton.swift
        LoadingView.swift
        ErrorView.swift
        EmptyStateView.swift
        {{DOMAIN_1}}CardView.swift
        {{DOMAIN_2}}CardView.swift
        SearchBar.swift

    ViewModels/                     # Shared/base view models
      BaseViewModel.swift           # Common loading/error state
      AuthViewModel.swift           # Auth state (shared across app)

    Services/                       # Network + storage layer
      APIClient.swift               # URLSession wrapper (async/await)
      AuthService.swift             # Login, register, token refresh
      {{DOMAIN_1}}Service.swift     # {{DOMAIN_1}} CRUD operations
      {{DOMAIN_2}}Service.swift     # {{DOMAIN_2}} CRUD operations
      KeychainService.swift         # Secure token storage (Keychain)
      UserDefaultsService.swift     # Non-sensitive preferences

    Navigation/                     # Navigation management
      AppRouter.swift               # NavigationPath-based routing
      Route.swift                   # Enum of all app routes (Hashable)
      DeepLinkHandler.swift         # URL → Route conversion

    Extensions/                     # Swift extensions
      Date+Formatting.swift
      String+Validation.swift
      View+Modifiers.swift
      Color+Theme.swift

    Resources/                      # Static resources
      Assets.xcassets/              # Images, colors, app icon
      Fonts/                        # Custom fonts (.ttf/.otf)
      Localizable.strings           # Localization

  {{PROJECT_NAME}}Tests/            # Unit tests
    Services/
      APIClientTests.swift
      {{DOMAIN_1}}ServiceTests.swift
    ViewModels/
      {{DOMAIN_1}}ViewModelTests.swift
    Models/
      {{DOMAIN_1}}Tests.swift

  {{PROJECT_NAME}}UITests/          # UI tests
    AuthFlowTests.swift
    {{DOMAIN_1}}FlowTests.swift

  Package.swift                     # Swift Package Manager dependencies
```

### Swift Package Manager Dependencies

```swift
// Package.swift (or via Xcode UI: File → Add Package Dependencies)
dependencies: [
    // Networking
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.9.0"),

    // Image loading
    .package(url: "https://github.com/kean/Nuke.git", from: "12.0.0"),

    // Keychain
    .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.0"),

    // Dependency Injection (optional — can use manual DI)
    .package(url: "https://github.com/hmlongco/Factory.git", from: "2.3.0"),
]
```

---

## Android Project Structure (Jetpack Compose + MVVM)

```
android/{{PROJECT_NAME}}/
  build.gradle.kts                  # Root build file
  settings.gradle.kts               # Module declarations
  gradle.properties                 # Gradle settings

  app/
    build.gradle.kts                # App module build file (dependencies, SDK versions)

    src/main/
      AndroidManifest.xml           # Permissions, deep links, activities

      java/{{ANDROID_PACKAGE_PATH}}/    # e.g., com/example/projectname/
        {{PROJECT_NAME}}Application.kt  # Application class (Hilt setup)
        MainActivity.kt                 # Single Activity (Compose host)

        di/                             # Dependency Injection (Hilt)
          AppModule.kt                  # Provides singletons (API client, DB)
          RepositoryModule.kt           # Provides repositories
          NetworkModule.kt              # Provides Retrofit/OkHttp

        data/                           # Data layer
          model/                        # Data classes / DTOs
            User.kt
            {{DOMAIN_1}}.kt
            {{DOMAIN_2}}.kt
            ApiResponse.kt
            ApiError.kt
          remote/                       # Network layer
            ApiClient.kt               # Retrofit interface definitions
            AuthInterceptor.kt         # OkHttp interceptor (adds Bearer token)
            {{DOMAIN_1}}Api.kt         # {{DOMAIN_1}} endpoint interface
            {{DOMAIN_2}}Api.kt         # {{DOMAIN_2}} endpoint interface
          local/                        # Local storage
            DataStoreManager.kt        # Preferences DataStore wrapper
            TokenManager.kt            # EncryptedSharedPreferences for tokens
          repository/                   # Repository implementations
            AuthRepository.kt
            {{DOMAIN_1}}Repository.kt
            {{DOMAIN_2}}Repository.kt

        domain/                         # Domain layer (optional for simple apps)
          usecase/                      # Use cases (business logic)
            GetUser UseCase.kt
            Get{{DOMAIN_1}}ListUseCase.kt

        ui/                             # Presentation layer (Compose)
          theme/                        # Material 3 theming
            Theme.kt
            Color.kt
            Type.kt
            Shape.kt
          navigation/                   # Navigation
            AppNavHost.kt              # NavHost with all destinations
            Route.kt                   # Sealed class of routes (type-safe)
            DeepLinkHandler.kt         # URI → Route mapping
          screens/                      # Screen composables
            auth/
              LoginScreen.kt
              LoginViewModel.kt
              RegisterScreen.kt
              RegisterViewModel.kt
            home/
              HomeScreen.kt
              HomeViewModel.kt
            {{DOMAIN_1}}/
              {{DOMAIN_1}}ListScreen.kt
              {{DOMAIN_1}}DetailScreen.kt
              {{DOMAIN_1}}CreateScreen.kt
              {{DOMAIN_1}}ViewModel.kt
            {{DOMAIN_2}}/
              {{DOMAIN_2}}ListScreen.kt
              {{DOMAIN_2}}DetailScreen.kt
              {{DOMAIN_2}}ViewModel.kt
            profile/
              ProfileScreen.kt
              SettingsScreen.kt
              ProfileViewModel.kt
          components/                   # Reusable composables
            PrimaryButton.kt
            LoadingIndicator.kt
            ErrorCard.kt
            EmptyState.kt
            {{DOMAIN_1}}Card.kt
            {{DOMAIN_2}}Card.kt
            SearchBar.kt

      res/
        values/
          strings.xml
          colors.xml
          themes.xml
        drawable/                       # Vector drawables, icons
        font/                           # Custom fonts

    src/test/                           # Unit tests
      java/{{ANDROID_PACKAGE_PATH}}/
        data/repository/
          {{DOMAIN_1}}RepositoryTest.kt
        ui/screens/
          {{DOMAIN_1}}ViewModelTest.kt

    src/androidTest/                    # Instrumented tests
      java/{{ANDROID_PACKAGE_PATH}}/
        AuthFlowTest.kt
        {{DOMAIN_1}}FlowTest.kt
```

### Gradle Dependencies (`app/build.gradle.kts`)

```kotlin
dependencies {
    // Compose BOM
    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")

    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Lifecycle + ViewModel
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")

    // Hilt (Dependency Injection)
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-android-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")

    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-kotlinx-serialization:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")

    // Image loading
    implementation("io.coil-kt:coil-compose:2.6.0")

    // DataStore
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // Encrypted storage
    implementation("androidx.security:security-crypto:1.1.0-alpha06")

    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("io.mockk:mockk:1.13.10")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.0")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}
```

---

## Shared API Contract Consumption

Since native projects cannot consume TypeScript packages, align the API contract via:

### Option A: OpenAPI Spec Generation (Recommended)

```
Backend (TypeScript) → exports openapi.json
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   Swift client        Kotlin client        (Flutter client)
  (swift-openapi-     (retrofit +           (retrofit +
   generator)          kotlinx-              json_serializable)
                       serialization)
```

1. Backend generates OpenAPI spec as part of CI
2. iOS: Use [Swift OpenAPI Generator](https://github.com/apple/swift-openapi-generator) to generate type-safe client
3. Android: Use [OpenAPI Generator](https://openapi-generator.tech/) with Kotlin + Retrofit template
4. Both platforms get type-safe API clients that match the backend exactly

### Option B: Manual Alignment (Small APIs)

- Mirror endpoint URLs in `Constants.swift` / `ApiConstants.kt`
- Mirror request/response types as `Codable` structs / `@Serializable` data classes
- Use a shared document (`ARCHITECTURE/api/`) as the source of truth

---

## Keeping Both Platforms in Sync

| Strategy | How |
|----------|-----|
| **Shared design spec** | Both platforms implement the same Figma or screen catalog |
| **Shared API contract** | OpenAPI spec ensures identical data models |
| **Feature parity tracker** | Maintain a feature matrix (Feature / iOS / Android / Status) |
| **Shared test scenarios** | Write platform-agnostic test cases, implement per platform |
| **PR review cross-check** | iOS PRs reviewed by Android dev and vice versa |
| **Unified CI** | Both platforms build and test in the same CI pipeline |

### Feature Parity Matrix Template

| Feature | iOS Status | Android Status | Notes |
|---------|-----------|---------------|-------|
| Login/Register | -- | -- | |
| {{DOMAIN_1}} List | -- | -- | |
| {{DOMAIN_1}} Detail | -- | -- | |
| {{DOMAIN_1}} Create | -- | -- | |
| Push Notifications | -- | -- | |
| Deep Links | -- | -- | |
| Offline Support | -- | -- | |

---

## First Steps After Scaffolding

### iOS (Days 1-3)

- [ ] Create Xcode project: File → New → Project → App (SwiftUI, Swift)
- [ ] Set deployment target to {{MIN_IOS_VERSION}}
- [ ] Add SPM dependencies (Alamofire, Nuke, KeychainAccess)
- [ ] Create the folder structure matching the template above
- [ ] Implement `APIClient.swift` with async/await and token injection
- [ ] Implement `KeychainService.swift` for secure token storage
- [ ] Set up `Route.swift` enum and `AppRouter.swift` with NavigationStack
- [ ] Build auth flow: LoginView → AuthViewModel → AuthService
- [ ] Run on simulator and verify API connectivity

### Android (Days 1-3)

- [ ] Create Android Studio project: New → Empty Activity (Compose)
- [ ] Set minSdk to {{MIN_ANDROID_SDK}}, targetSdk to latest
- [ ] Add Gradle dependencies (Compose BOM, Hilt, Retrofit, Coil)
- [ ] Create the package structure matching the template above
- [ ] Configure Hilt: add `@HiltAndroidApp` to Application class, `@AndroidEntryPoint` to MainActivity
- [ ] Implement `ApiClient.kt` Retrofit interface + `AuthInterceptor.kt`
- [ ] Implement `TokenManager.kt` with EncryptedSharedPreferences
- [ ] Set up `AppNavHost.kt` with type-safe routes
- [ ] Build auth flow: LoginScreen → LoginViewModel → AuthRepository
- [ ] Run on emulator and verify API connectivity

### Integration (Days 4-5)

- [ ] Set up CI pipeline that builds both platforms
- [ ] Configure deep link schemes (`{{PROJECT_SLUG}}://`) in Info.plist and AndroidManifest.xml
- [ ] Implement at least one domain list/detail screen on both platforms
- [ ] Write unit tests for at least one ViewModel on each platform
- [ ] Start the feature parity matrix

---

## Checklist Before Proceeding

- [ ] All `{{PLACEHOLDERS}}` replaced with project-specific values
- [ ] iOS project builds and runs on simulator (zero warnings)
- [ ] Android project builds and runs on emulator (zero warnings)
- [ ] Auth flow works on both platforms against the same backend
- [ ] API client handles token refresh on 401 responses
- [ ] Deep link scheme registered on both platforms
- [ ] Feature parity matrix created and initial features tracked
- [ ] OpenAPI spec generation configured (if using Option A)
