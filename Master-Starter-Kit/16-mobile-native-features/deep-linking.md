# Deep Linking

Deep links let users tap a URL and land directly on a specific screen inside your app. They are essential for marketing campaigns, sharing content, onboarding flows, and notifications. This guide covers Universal Links (iOS), App Links (Android), URL schemes, deferred deep linking, and per-framework setup.

---

## Three Types of Deep Links

| Type | Format | Behavior | Use Case |
|------|--------|----------|----------|
| **URL Scheme** | `myapp://orders/123` | Opens app only. No fallback if app not installed. | Development, app-to-app communication |
| **Universal Links** (iOS) | `https://yourapp.com/orders/123` | Opens app if installed, falls back to website | Production (iOS) |
| **App Links** (Android) | `https://yourapp.com/orders/123` | Opens app if installed, falls back to website | Production (Android) |

**Rule:** Use URL schemes for development and testing. Use Universal Links + App Links for production. They use your real domain, provide a web fallback, and are more trustworthy (verified by Apple/Google).

---

## Route Mapping

Define a clear mapping between URLs and in-app screens:

| URL Pattern | Target Screen | Auth Required | Notes |
|-------------|--------------|---------------|-------|
| `/` | Home | No | Default landing |
| `/products/:id` | Product Detail | No | Shared from catalog |
| `/orders/:id` | Order Detail | Yes | From order confirmation email |
| `/orders/:id/tracking` | Order Tracking | Yes | From shipping notification |
| `/invite/:code` | Invite Accept | No | Referral flow |
| `/settings` | Settings | Yes | From push notification opt-in |
| `/reset-password?token=xxx` | Password Reset | No | From password reset email |
| `/chat/:conversationId` | Chat Thread | Yes | From message notification |

---

## iOS Universal Links

### Step 1: Host the Apple App Site Association (AASA) File

Create a file at `https://yourapp.com/.well-known/apple-app-site-association` (no `.json` extension):

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["TEAMID.com.yourcompany.yourapp"],
        "components": [
          { "/": "/products/*", "comment": "Product pages" },
          { "/": "/orders/*", "comment": "Order pages" },
          { "/": "/invite/*", "comment": "Invite links" },
          { "/": "/reset-password", "comment": "Password reset" },
          { "/": "/chat/*", "comment": "Chat threads" }
        ]
      }
    ]
  }
}
```

**Requirements for the AASA file:**
- Must be served over HTTPS (no self-signed certs)
- Must return `Content-Type: application/json`
- Must be at `/.well-known/apple-app-site-association` (no redirect)
- File size must be under 128KB
- Apple CDN caches it aggressively (can take 24-48 hours to update)

### Step 2: Add Associated Domains Capability

In Xcode:
1. Select your target > Signing & Capabilities > + Capability > Associated Domains
2. Add: `applinks:yourapp.com`
3. For staging: `applinks:staging.yourapp.com`

Or in your entitlements file:

```xml
<!-- yourapp.entitlements -->
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:yourapp.com</string>
    <string>applinks:staging.yourapp.com</string>
</array>
```

### Step 3: Handle Incoming Links (SwiftUI)

```swift
// App.swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    DeepLinkRouter.shared.handle(url: url)
                }
        }
    }
}

// DeepLinkRouter.swift
class DeepLinkRouter: ObservableObject {
    static let shared = DeepLinkRouter()
    @Published var activeRoute: Route?

    func handle(url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
              let path = components.path.split(separator: "/").first else { return }

        switch path {
        case "products":
            let id = components.path.replacingOccurrences(of: "/products/", with: "")
            activeRoute = .productDetail(id: id)
        case "orders":
            let id = components.path.replacingOccurrences(of: "/orders/", with: "")
            activeRoute = .orderDetail(id: id)
        case "invite":
            let code = components.path.replacingOccurrences(of: "/invite/", with: "")
            activeRoute = .inviteAccept(code: code)
        default:
            activeRoute = .home
        }
    }
}
```

### Handle Incoming Links (UIKit)

```swift
// SceneDelegate.swift
func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else { return }
    DeepLinkRouter.shared.handle(url: url)
}
```

---

## Android App Links

### Step 1: Host the Digital Asset Links File

Create a file at `https://yourapp.com/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.yourapp",
      "sha256_cert_fingerprints": [
        "AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90"
      ]
    }
  }
]
```

Get your SHA256 fingerprint:

```bash
# Debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android

# Release keystore
keytool -list -v -keystore your-release-key.keystore
```

### Step 2: Add Intent Filters

```xml
<!-- AndroidManifest.xml -->
<activity android:name=".MainActivity">
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="yourapp.com"
            android:pathPrefix="/products" />
        <data android:pathPrefix="/orders" />
        <data android:pathPrefix="/invite" />
        <data android:pathPrefix="/chat" />
    </intent-filter>

    <!-- URL scheme for development -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" />
    </intent-filter>
</activity>
```

### Step 3: Handle Incoming Links (Jetpack Compose)

```kotlin
// MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val navController = rememberNavController()
            handleDeepLink(intent, navController)

            NavHost(navController = navController, startDestination = "home") {
                composable("home") { HomeScreen() }
                composable(
                    "products/{productId}",
                    deepLinks = listOf(navDeepLink { uriPattern = "https://yourapp.com/products/{productId}" })
                ) { backStackEntry ->
                    ProductDetailScreen(productId = backStackEntry.arguments?.getString("productId") ?: "")
                }
                composable(
                    "orders/{orderId}",
                    deepLinks = listOf(navDeepLink { uriPattern = "https://yourapp.com/orders/{orderId}" })
                ) { backStackEntry ->
                    OrderDetailScreen(orderId = backStackEntry.arguments?.getString("orderId") ?: "")
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // Handle deep link when app is already running
        handleDeepLink(intent, navController)
    }
}
```

---

## React Native (Expo)

### Expo Router Configuration

```typescript
// app.json
{
  "expo": {
    "scheme": "myapp",
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://yourapp.com"
        }
      ]
    ],
    "ios": {
      "associatedDomains": ["applinks:yourapp.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "yourapp.com",
              "pathPrefix": "/products"
            },
            {
              "scheme": "https",
              "host": "yourapp.com",
              "pathPrefix": "/orders"
            },
            {
              "scheme": "https",
              "host": "yourapp.com",
              "pathPrefix": "/invite"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

Expo Router maps file paths directly to deep link routes:

```
app/
├── (tabs)/
│   ├── index.tsx          → myapp://  or  https://yourapp.com/
│   └── settings.tsx       → myapp://settings
├── products/
│   └── [id].tsx           → myapp://products/123  or  https://yourapp.com/products/123
├── orders/
│   ├── [id].tsx           → myapp://orders/456
│   └── [id]/
│       └── tracking.tsx   → myapp://orders/456/tracking
└── invite/
    └── [code].tsx         → myapp://invite/abc123
```

### Handling Deep Links in Expo Router

```typescript
// app/products/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ProductDetail() {
  // Automatically receives the deep link parameter
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch product data using the id
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id),
  });

  return <ProductDetailView product={product} />;
}
```

```typescript
// Listen for deep links programmatically
import * as Linking from 'expo-linking';

// Get the URL that opened the app
const url = await Linking.getInitialURL();

// Listen for incoming links while app is running
Linking.addEventListener('url', ({ url }) => {
  // Expo Router handles navigation automatically
  // Use this for analytics or custom logic
  analytics.trackDeepLink(url);
});
```

---

## Flutter

### go_router Deep Link Configuration

```dart
// lib/router.dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/products/:id',
      builder: (context, state) {
        final productId = state.pathParameters['id']!;
        return ProductDetailScreen(productId: productId);
      },
    ),
    GoRoute(
      path: '/orders/:id',
      builder: (context, state) {
        final orderId = state.pathParameters['id']!;
        return OrderDetailScreen(orderId: orderId);
      },
      routes: [
        GoRoute(
          path: 'tracking',
          builder: (context, state) {
            final orderId = state.pathParameters['id']!;
            return OrderTrackingScreen(orderId: orderId);
          },
        ),
      ],
    ),
    GoRoute(
      path: '/invite/:code',
      builder: (context, state) {
        final code = state.pathParameters['code']!;
        return InviteAcceptScreen(code: code);
      },
    ),
  ],
);
```

### Android Configuration

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<activity android:name=".MainActivity"
    android:launchMode="singleTop">
    <meta-data android:name="flutter_deeplinking_enabled" android:value="true" />
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="yourapp.com" />
    </intent-filter>
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" />
    </intent-filter>
</activity>
```

### iOS Configuration

```xml
<!-- ios/Runner/Info.plist -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>myapp</string>
        </array>
    </dict>
</array>

<key>FlutterDeepLinkingEnabled</key>
<true/>
```

Add Associated Domains in the Runner.entitlements file or in Xcode > Signing & Capabilities.

---

## Deferred Deep Linking

Deferred deep linking handles the case where a user taps a link but does not have the app installed:

```
1. User taps link (e.g., from a friend's share)
2. App is NOT installed → redirect to App Store / Play Store
3. User installs the app
4. User opens the app for the first time
5. App detects the original deep link and navigates to the correct screen
```

### How It Works

The deferred deep link service (Branch.io, Expo) uses a combination of:
- IP address fingerprinting
- Device metadata matching
- Clipboard pasteboard (iOS, with user consent)
- Google Play Install Referrer API (Android)

### Implementation Options

| Service | Status | Platform Support | Free Tier |
|---------|--------|-----------------|-----------|
| **Branch.io** | Active | All platforms | 10K MAU |
| **Expo Deferred Deep Links** | Active | Expo apps | Included with EAS |
| **Firebase Dynamic Links** | Deprecated (2025) | Do not use | N/A |
| **AppsFlyer OneLink** | Active | All platforms | Limited free |

### Expo Deferred Deep Links

```typescript
// app.json — Expo handles deferred deep links automatically with Expo Router
{
  "expo": {
    "scheme": "myapp",
    "plugins": [["expo-router", { "origin": "https://yourapp.com" }]]
  }
}

// The deep link URL is preserved through the install flow.
// When the user opens the app after installing, Expo Router
// navigates to the correct screen automatically.
```

### Branch.io Setup (React Native)

```typescript
import branch from 'react-native-branch';

// Subscribe to deep link events (including deferred)
branch.subscribe(({ error, params }) => {
  if (error) return;

  if (params['+clicked_branch_link']) {
    // User came from a Branch link
    const screen = params.screen;
    const id = params.id;
    router.push(`/${screen}/${id}`);
  }
});

// Create a shareable Branch link
const branchLink = await branch.createBranchUniversalObject('product/123', {
  title: 'Cool Product',
  contentDescription: 'Check out this product',
  contentImageUrl: 'https://yourapp.com/products/123/image.jpg',
  contentMetadata: {
    customMetadata: { screen: 'products', id: '123' },
  },
});

const { url } = await branchLink.generateShortUrl({
  feature: 'sharing',
  channel: 'app',
});
// url = "https://yourapp.app.link/AbCdEfGh"
```

---

## Testing Deep Links

### iOS Simulator

```bash
# URL scheme
xcrun simctl openurl booted "myapp://products/123"

# Universal Link
xcrun simctl openurl booted "https://yourapp.com/products/123"
```

### Android Emulator / Device

```bash
# URL scheme
adb shell am start -a android.intent.action.VIEW -d "myapp://products/123"

# App Link
adb shell am start -a android.intent.action.VIEW -d "https://yourapp.com/products/123"

# Verify App Links configuration
adb shell pm get-app-links com.yourcompany.yourapp
```

### Expo

```bash
# Development build
npx expo start --dev-client
# Then open: myapp://products/123 in browser or use:
npx uri-scheme open "myapp://products/123" --ios
npx uri-scheme open "myapp://products/123" --android
```

### Verify AASA and Asset Links

```bash
# Check Apple AASA file
curl -v "https://yourapp.com/.well-known/apple-app-site-association"

# Apple's CDN validation (after publishing)
curl "https://app-site-association.cdn-apple.com/a/v1/yourapp.com"

# Check Android Asset Links
curl "https://yourapp.com/.well-known/assetlinks.json"

# Google's verification tool
# https://developers.google.com/digital-asset-links/tools/generator
```

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| AASA file returns redirect (301/302) | Universal Links silently fail | Serve AASA directly at `/.well-known/`, no redirects |
| AASA file cached by Apple CDN for 24-48h | Changes don't take effect immediately | Plan ahead; use `?mode=developer` in Associated Domains for testing |
| Wrong Team ID in AASA `appIDs` | Universal Links never work | Use format `TEAMID.bundleIdentifier`, find Team ID in Apple Developer portal |
| Missing `android:autoVerify="true"` | App Links fallback to browser | Always include `autoVerify` in production intent filters |
| Not handling `onNewIntent` (Android) | Deep links ignored when app is already running | Override `onNewIntent` and re-process the intent |
| Forgetting auth-required routes | User deep-links to a screen but isn't logged in | Check auth state, redirect to login, then forward to original deep link after login |
| Firebase Dynamic Links in new projects | Service deprecated in 2025 | Use Branch.io or Expo deferred deep links instead |
| Testing Universal Links by typing URL in Safari | Safari intercepts and opens website, not app | Test via Notes app, Messages, or `xcrun simctl openurl` |
