# React Native + Expo Project Structure Template

## Project: {{PROJECT_NAME}}

**Framework:** React Native with Expo SDK {{EXPO_SDK_VERSION}}
**Routing:** Expo Router (file-based)
**State:** Zustand + TanStack Query
**Monorepo:** Turborepo + pnpm

Fill this template after choosing React Native in `framework-decision-tree.md`. Replace all `{{PLACEHOLDERS}}` with project-specific values.

---

## Directory Structure

```
apps/mobile/
  package.json                  # name: "@{{PROJECT_SLUG}}/mobile"
  app.json                      # Expo config (name, slug, scheme, plugins)
  eas.json                      # EAS Build + Submit configuration
  metro.config.js               # Metro bundler (monorepo-aware)
  babel.config.js               # Babel config (expo preset + module resolver)
  tsconfig.json                 # Extends ../../tooling/typescript/expo.json

  app/                          # Expo Router — file-based routing
    _layout.tsx                 # Root layout (providers, fonts, splash)
    +not-found.tsx              # 404 fallback screen

    (tabs)/                     # Tab navigator group
      _layout.tsx               # Tab bar configuration
      index.tsx                 # Home tab (default)
      {{TAB_2_NAME}}.tsx        # Second tab (e.g., search, feed, dashboard)
      {{TAB_3_NAME}}.tsx        # Third tab (e.g., orders, activity)
      profile.tsx               # Profile / settings tab

    (auth)/                     # Auth flow group (unauthenticated)
      _layout.tsx               # Auth layout (no tab bar)
      login.tsx                 # Login screen
      register.tsx              # Registration screen
      forgot-password.tsx       # Password reset

    {{DOMAIN_1}}/               # Domain-specific screens
      index.tsx                 # List view
      [id].tsx                  # Detail view (dynamic route)
      create.tsx                # Creation form

    {{DOMAIN_2}}/               # Second domain
      index.tsx
      [id].tsx

    modal/                      # Modal routes
      _layout.tsx               # Modal presentation layout
      {{MODAL_NAME}}.tsx        # Example: filter, share, confirm

  components/                   # Mobile-specific components
    ui/                         # Base UI primitives
      Button.tsx                # Styled Pressable wrapper
      Text.tsx                  # Themed text component
      Card.tsx                  # Card container
      Input.tsx                 # Text input with label + error
      LoadingSpinner.tsx        # Activity indicator wrapper
    {{DOMAIN_1}}/               # Domain-specific components
      {{DOMAIN_1}}Card.tsx
      {{DOMAIN_1}}List.tsx
    {{DOMAIN_2}}/
      {{DOMAIN_2}}Card.tsx
    layout/                     # Layout components
      SafeArea.tsx              # SafeAreaView wrapper
      KeyboardAvoid.tsx         # KeyboardAvoidingView wrapper
      ScreenContainer.tsx       # Standard screen padding + scroll

  hooks/                        # Mobile-specific hooks
    useAuth.ts                  # Auth state + login/logout methods
    useColorScheme.ts           # Dark/light mode detection
    usePushNotifications.ts     # Push notification registration + handling
    useRefreshControl.ts        # Pull-to-refresh hook
    useCachedResources.ts       # Font loading + asset caching

  lib/                          # Utilities
    api.ts                      # API client (fetch wrapper or tRPC client)
    storage.ts                  # Async storage helper (MMKV preferred)
    auth.ts                     # Token storage + refresh logic
    constants.ts                # API_URL, environment detection
    haptics.ts                  # Haptic feedback helpers
    linking.ts                  # Deep link configuration

  stores/                       # Zustand state management
    useAuthStore.ts             # Auth state (user, token, isAuthenticated)
    use{{DOMAIN_1}}Store.ts     # Domain-specific client state
    useUIStore.ts               # UI state (modals, bottom sheets, toasts)

  constants/                    # Static configuration
    Colors.ts                   # Color palette (light + dark)
    Layout.ts                   # Screen dimensions, spacing scale
    Typography.ts               # Font families, sizes, weights

  assets/                       # Static assets
    images/                     # PNG/SVG images
    fonts/                      # Custom font files (.ttf/.otf)
    animations/                 # Lottie files (.json)
```

---

## Shared Package Imports

The mobile app consumes these packages from the monorepo:

```typescript
// Types — shared with web
import type { User, {{DOMAIN_1_TYPE}}, {{DOMAIN_2_TYPE}} } from "@{{PROJECT_SLUG}}/types";

// Validators — shared with web
import { login Schema, create{{DOMAIN_1_TYPE}}Schema } from "@{{PROJECT_SLUG}}/validators";

// API client types — shared with web (if using tRPC)
import type { AppRouter } from "@{{PROJECT_SLUG}}/api";

// Utilities — shared with web
import { formatCurrency, formatDate } from "@{{PROJECT_SLUG}}/utils";
```

**What you CANNOT import from shared packages:**
- React web components (they use DOM elements, not React Native primitives)
- CSS/Tailwind utilities (React Native uses StyleSheet, not CSS)
- Next.js specific code (server components, middleware, etc.)
- Any package that imports from `react-dom`

---

## Key Files Explained

### `app.json` — Expo Configuration

```json
{
  "expo": {
    "name": "{{PROJECT_DISPLAY_NAME}}",
    "slug": "{{PROJECT_SLUG}}",
    "scheme": "{{PROJECT_SLUG}}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "{{SPLASH_BG_COLOR}}"
    },
    "ios": {
      "bundleIdentifier": "{{IOS_BUNDLE_ID}}",
      "supportsTablet": true
    },
    "android": {
      "package": "{{ANDROID_PACKAGE}}",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "{{ICON_BG_COLOR}}"
      }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ]
  }
}
```

### `metro.config.js` — Monorepo Metro Configuration

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro resolve packages from the monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Force resolving nested modules to the app's node_modules
config.resolver.disableHierarchicalLookup = true;

// Use a file-based cache in the project directory
config.cacheStores = [
  new FileStore({ root: path.join(projectRoot, "node_modules", ".cache", "metro") }),
];

module.exports = config;
```

### `app/_layout.tsx` — Root Layout (Providers + Splash)

```tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### `eas.json` — EAS Build Configuration

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "API_URL": "{{DEV_API_URL}}"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "API_URL": "{{STAGING_API_URL}}"
      }
    },
    "production": {
      "env": {
        "API_URL": "{{PRODUCTION_API_URL}}"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "{{APPLE_ID}}",
        "ascAppId": "{{ASC_APP_ID}}",
        "appleTeamId": "{{APPLE_TEAM_ID}}"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json"
      }
    }
  }
}
```

---

## First Steps After Scaffolding

### Immediate (Day 1)

- [ ] Run `npx create-expo-app@latest apps/mobile --template tabs` as a starting point
- [ ] Replace generated structure with the template above
- [ ] Configure `metro.config.js` for monorepo (copy from Key Files section)
- [ ] Verify monorepo packages resolve: `import { ... } from "@{{PROJECT_SLUG}}/types"`
- [ ] Set up path aliases in `tsconfig.json` (`@/*` → `./`)
- [ ] Run `npx expo start` and confirm the app loads on simulator/device

### Foundation (Days 2-3)

- [ ] Install core dependencies: `zustand`, `@tanstack/react-query`, `react-native-mmkv`, `expo-secure-store`
- [ ] Set up API client in `lib/api.ts` pointing to `{{DEV_API_URL}}`
- [ ] Create auth flow: `useAuthStore` + `lib/auth.ts` (token storage in SecureStore)
- [ ] Wire up `(auth)/_layout.tsx` to redirect based on auth state
- [ ] Configure color scheme in `constants/Colors.ts`

### Integration (Days 4-5)

- [ ] Set up EAS project: `eas init` → `eas build:configure`
- [ ] Create development build: `eas build --profile development --platform ios`
- [ ] Test deep linking: `npx uri-scheme open {{PROJECT_SLUG}}://{{DOMAIN_1}}/123 --ios`
- [ ] Set up push notification token registration in `hooks/usePushNotifications.ts`
- [ ] Add pull-to-refresh on all list screens

### Polish

- [ ] Add loading skeletons for all list/detail screens
- [ ] Add error boundaries with retry
- [ ] Configure app icons and splash screen images
- [ ] Test on physical device (not just simulator)

---

## Checklist Before Proceeding

- [ ] All `{{PLACEHOLDERS}}` replaced with project-specific values
- [ ] Monorepo packages resolve correctly in Metro
- [ ] Auth flow redirects unauthenticated users to `(auth)/login`
- [ ] Tab navigator renders all tabs with correct icons
- [ ] API client successfully calls at least one endpoint
- [ ] App runs on both iOS simulator and Android emulator
- [ ] `eas.json` has correct Apple/Google credentials for builds
