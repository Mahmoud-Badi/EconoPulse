# TaskFlow Mobile — React Native Project Structure
# ============================================================
# EXAMPLE FILE — This is a filled-in project structure for
# a fictional TaskFlow Mobile companion app. Your structure
# will be generated during ORCHESTRATOR Step 5.5 (Mobile Platform).
# Source template: 14-mobile-platform/react-native-project-structure.template.md
# ============================================================

> **Project:** TaskFlow Mobile
> **Framework:** React Native with Expo SDK 52
> **Routing:** Expo Router (file-based)
> **State:** Zustand + TanStack Query
> **Monorepo:** Turborepo + pnpm

---

## Directory Structure

```
apps/mobile/
  package.json                  # name: "@taskflow/mobile"
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
      index.tsx                 # Tasks tab (default — task inbox)
      time.tsx                  # Time tab (timesheet & timer)
      projects.tsx              # Projects tab (project list)
      profile.tsx               # Profile / settings tab

    (auth)/                     # Auth flow group (unauthenticated)
      _layout.tsx               # Auth layout (no tab bar)
      login.tsx                 # Login screen (email + password)
      register.tsx              # Registration screen
      forgot-password.tsx       # Password reset via email link

    tasks/                      # Task domain screens
      index.tsx                 # Task inbox (filterable list)
      [id].tsx                  # Task detail view (dynamic route)
      create.tsx                # Task creation form

    timesheet/                  # Time-tracking domain screens
      index.tsx                 # Weekly timesheet grid view
      [id].tsx                  # Time entry detail / edit
      report.tsx                # Personal time summary report

    projects/                   # Project domain screens
      index.tsx                 # Project list (card grid)
      [id].tsx                  # Project detail (tasks + members + progress)

    modal/                      # Modal routes
      _layout.tsx               # Modal presentation layout
      create-task.tsx           # Quick task creation (bottom sheet style)
      time-entry.tsx            # Quick time entry from any screen
      filter.tsx                # Filter/sort options for lists
      confirm-delete.tsx        # Destructive action confirmation

  components/                   # Mobile-specific components
    ui/                         # Base UI primitives
      TFButton.tsx              # Styled Pressable wrapper with haptics
      TFText.tsx                # Themed text component (uses Inter font)
      TFCard.tsx                # Card container with press animation
      TFInput.tsx               # Text input with label, error, and clear
      LoadingSpinner.tsx        # Activity indicator wrapper
      StatusBadge.tsx           # Colored pill badge (To Do, In Progress, Done)
      Avatar.tsx                # User avatar with initials fallback
    tasks/                      # Task domain components
      TaskCard.tsx              # Task summary card (title, assignee, due date, priority)
      TaskList.tsx              # Virtualized task list with pull-to-refresh
      TaskPriorityIcon.tsx      # Color-coded priority indicator (P1-P4)
    timesheet/                  # Timesheet domain components
      TimeEntryRow.tsx          # Single time entry row (project, duration, note)
      TimerWidget.tsx           # Active timer display with start/stop/pause
      WeekGrid.tsx              # 7-day timesheet grid
    projects/                   # Project domain components
      ProjectHeader.tsx         # Project title, color dot, member avatars
      ProjectCard.tsx           # Project summary card with progress bar
      MemberList.tsx            # Horizontal scrollable avatar list
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
    useTimer.ts                 # Active time-tracking timer (foreground)
    useTaskFilters.ts           # Task inbox filter state (status, assignee, priority)

  lib/                          # Utilities
    api.ts                      # tRPC client pointing to TaskFlow API
    storage.ts                  # MMKV helper (persisted filter prefs, theme)
    auth.ts                     # Token storage in SecureStore + refresh logic
    constants.ts                # API_URL, environment detection
    haptics.ts                  # Haptic feedback helpers (light, medium, success)
    linking.ts                  # Deep link config (taskflow://tasks/123)
    formatters.ts               # Duration, date, and currency formatters

  stores/                       # Zustand state management
    useAuthStore.ts             # Auth state (user, token, isAuthenticated)
    useTaskStore.ts             # Client-side task filter/sort preferences
    useTimerStore.ts            # Active timer state (taskId, startedAt, elapsed)
    useUIStore.ts               # UI state (modals, bottom sheets, toasts)

  constants/                    # Static configuration
    Colors.ts                   # Color palette (light + dark)
    Layout.ts                   # Screen dimensions, spacing scale (4, 8, 12, 16, 24, 32)
    Typography.ts               # Inter font, sizes: xs(11), sm(13), md(15), lg(17), xl(20), 2xl(24)

  assets/                       # Static assets
    images/                     # App icon, splash, empty-state illustrations
    fonts/                      # Inter-Regular, Inter-Medium, Inter-SemiBold, Inter-Bold
    animations/                 # Lottie: empty-tasks.json, success-check.json, timer-pulse.json
```

---

## Shared Package Imports

The mobile app consumes these packages from the monorepo:

```typescript
// Types — shared with web
import type { User, Task, Project, TimeEntry } from "@taskflow/types";

// Validators — shared with web
import { loginSchema, createTaskSchema, createTimeEntrySchema } from "@taskflow/validators";

// API client types — shared with web (tRPC)
import type { AppRouter } from "@taskflow/api";

// Utilities — shared with web
import { formatDuration, formatDate, getInitials } from "@taskflow/utils";
```

**What you CANNOT import from shared packages:**
- React web components (they use DOM elements, not React Native primitives)
- Tailwind CSS classes (React Native uses StyleSheet, not CSS)
- Next.js specific code (server components, middleware, API routes)
- Any package that imports from `react-dom`

---

## Key Files Explained

### `app.json` — Expo Configuration

```json
{
  "expo": {
    "name": "TaskFlow",
    "slug": "taskflow",
    "scheme": "taskflow",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1E40AF"
    },
    "ios": {
      "bundleIdentifier": "com.taskflow.mobile",
      "supportsTablet": true
    },
    "android": {
      "package": "com.taskflow.mobile",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#1E40AF"
      }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-local-authentication",
      "expo-camera",
      "expo-notifications"
    ]
  }
}
```

### `app/(tabs)/_layout.tsx` — Tab Bar Configuration

```tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: tint }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "checkbox" : "checkbox-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="time"
        options={{
          title: "Time",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "timer" : "timer-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "folder" : "folder-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

## Component Inventory

| Component | Location | Description | Used By |
|-----------|----------|-------------|---------|
| TFButton | `components/ui/TFButton.tsx` | Primary/secondary/destructive/ghost button with haptics | All screens |
| TFInput | `components/ui/TFInput.tsx` | Text input with label, validation error, clear icon | Forms |
| TFCard | `components/ui/TFCard.tsx` | Pressable card with spring animation | Lists |
| StatusBadge | `components/ui/StatusBadge.tsx` | Colored pill: To Do (gray), In Progress (blue), Done (green) | TaskCard, detail views |
| Avatar | `components/ui/Avatar.tsx` | 32/40/48px circular avatar with initials fallback | Headers, lists, members |
| TaskCard | `components/tasks/TaskCard.tsx` | Title, assignee avatar, due date, priority icon | Tasks tab, project detail |
| TimeEntryRow | `components/timesheet/TimeEntryRow.tsx` | Project color dot, description, formatted duration | Time tab |
| TimerWidget | `components/timesheet/TimerWidget.tsx` | Floating active-timer bar (start/stop/pause) | Global overlay |
| ProjectHeader | `components/projects/ProjectHeader.tsx` | Project name, color, member avatars, progress percentage | Project detail |
| ProjectCard | `components/projects/ProjectCard.tsx` | Project summary with task count and progress bar | Projects tab |

---

## First Steps After Scaffolding

### Immediate (Day 1)

- [x] Run `npx create-expo-app@latest apps/mobile --template tabs`
- [x] Replace generated structure with the directory layout above
- [x] Configure `metro.config.js` for monorepo
- [x] Verify monorepo packages resolve: `import { ... } from "@taskflow/types"`
- [x] Set up path aliases in `tsconfig.json` (`@/*` -> `./`)
- [x] Run `npx expo start` and confirm app loads on simulator

### Foundation (Days 2-3)

- [x] Install core deps: `zustand`, `@tanstack/react-query`, `react-native-mmkv`, `expo-secure-store`
- [x] Set up tRPC client in `lib/api.ts` pointing to `http://localhost:3000/api/trpc`
- [x] Create auth flow: `useAuthStore` + `lib/auth.ts` (JWT in SecureStore)
- [x] Wire up `(auth)/_layout.tsx` to redirect based on auth state
- [x] Configure color scheme in `constants/Colors.ts`

### Integration (Days 4-5)

- [x] Set up EAS project: `eas init` -> `eas build:configure`
- [x] Create development build: `eas build --profile development --platform ios`
- [x] Test deep linking: `npx uri-scheme open taskflow://tasks/123 --ios`
- [x] Set up push notification token registration
- [x] Add pull-to-refresh on Tasks, Time, and Projects tabs
