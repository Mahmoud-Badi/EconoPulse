# Mobile Architecture — {{PROJECT_NAME}}

> Generated during Step 3.5 / Step 4 of the orchestrator.
> This document records all mobile architecture decisions and serves as the mobile equivalent of `system-architecture.md`.

---

## Framework Choice

| Decision | Value |
|----------|-------|
| **Framework** | {{MOBILE_FRAMEWORK}} |
| **Platforms** | {{MOBILE_PLATFORMS}} |
| **Expo Managed** | {{EXPO_MANAGED}} |
| **Rationale** | {{FRAMEWORK_RATIONALE}} |

---

## Navigation Architecture

| Pattern | Choice | Notes |
|---------|--------|-------|
| **Navigation library** | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->Expo Router (file-based)<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->GoRouter<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "native" -->SwiftUI NavigationStack / Jetpack Navigation Compose<!-- ENDIF --> | |
| **Root structure** | Tab bar / Stack / Drawer | |
| **Auth flow** | Separate navigation group, redirects when unauthenticated | |
| **Deep link scheme** | `{{PROJECT_SLUG}}://` | Registered in app config |

### Screen Map

| Screen | Route | Type | Auth Required | Tab |
|--------|-------|------|---------------|-----|
| Home | / | Tab | Yes | Home |
| Login | /login | Stack | No | — |
| Profile | /profile | Tab | Yes | Profile |
| {{SCREEN}} | {{ROUTE}} | {{TYPE}} | {{AUTH}} | {{TAB}} |

---

## State Management

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Local UI state** | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->React useState / useReducer<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->StatefulWidget / ValueNotifier<!-- ENDIF --> | Component-scoped |
| **Global app state** | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->Zustand<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->Riverpod<!-- ENDIF --> | Auth, preferences, feature flags |
| **Server state** | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->TanStack Query<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->Riverpod AsyncNotifier / Dio<!-- ENDIF --> | API data caching, refetching |
| **Persistent storage** | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->MMKV (key-value) / expo-sqlite (relational)<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->SharedPreferences (key-value) / Drift (relational)<!-- ENDIF --> | Offline data, user preferences |

---

## API Client Architecture

| Aspect | Decision |
|--------|----------|
| **Protocol** | REST / tRPC / GraphQL |
| **Base URL** | `{{API_PREFIX}}` via environment variable |
| **Auth header** | Bearer token from secure storage |
| **Error handling** | Centralized error interceptor → user-facing error messages |
| **Offline behavior** | {{OFFLINE_STRATEGY}} |
| **Request caching** | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->TanStack Query with staleTime + gcTime<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->Dio interceptor + local cache<!-- ENDIF --> |

---

## Shared Code Strategy

<!-- IF {{MONOREPO}} == "true" -->
### Shared Packages (Monorepo)

| Package | Shared With Web | Purpose |
|---------|----------------|---------|
| `@{{PROJECT_SLUG}}/types` | Yes | TypeScript interfaces, enums |
| `@{{PROJECT_SLUG}}/validators` | Yes | Zod schemas for validation |
| `@{{PROJECT_SLUG}}/constants` | Yes | Enums, config values |
| `@{{PROJECT_SLUG}}/utils` | Yes | Pure utility functions (no React) |

### NOT Shared (Platform-Specific)

| Concern | Web | Mobile |
|---------|-----|--------|
| UI components | React + Tailwind | React Native components |
| Routing | Next.js App Router | Expo Router |
| Storage | Cookies / localStorage | AsyncStorage / MMKV |
| Auth client | Better Auth client | Expo SecureStore + fetch |
<!-- ENDIF -->

<!-- IF {{MONOREPO}} == "false" -->
### API Contract Sharing

Since this is a standalone mobile project, sharing happens via the API contract:
- Backend exposes OpenAPI spec → generate typed client for mobile
- Shared validation rules documented in API contract (not shared code)
<!-- ENDIF -->

---

## Native Features Architecture

| Feature | Included in MVP | Library | Notes |
|---------|----------------|---------|-------|
| Push notifications | {{PUSH_MVP}} | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->expo-notifications<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->firebase_messaging<!-- ENDIF --> | |
| Offline storage | {{OFFLINE_MVP}} | See State Management | |
| Deep linking | {{DEEPLINK_MVP}} | Built into navigation library | |
| Camera | {{CAMERA_MVP}} | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->expo-camera<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->camera<!-- ENDIF --> | |
| GPS / Location | {{GPS_MVP}} | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->expo-location<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->geolocator<!-- ENDIF --> | |
| Biometrics | {{BIO_MVP}} | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->expo-local-authentication<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->local_auth<!-- ENDIF --> | |

---

## Build & Deployment Architecture

| Environment | Purpose | Distribution |
|-------------|---------|-------------|
| **Development** | Local dev with hot reload | Simulator / emulator |
| **Preview** | Internal testing builds | <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->EAS Build → TestFlight / Play Internal<!-- ENDIF --><!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->Codemagic → TestFlight / Play Internal<!-- ENDIF --> |
| **Production** | App store release | App Store / Play Store |

---

## Key Decisions Log

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 | {{MOBILE_FRAMEWORK}} as mobile framework | {{FRAMEWORK_RATIONALE}} | {{DATE}} |
| 2 | | | |
