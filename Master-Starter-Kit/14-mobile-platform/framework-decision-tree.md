# Mobile Framework Decision Tree

## How to Use This

Start at Node 1. Answer each question honestly. Follow the arrows. The tree is designed to get you to a decision in 3-4 nodes — you will not hit all 8. Record your final choice in `ARCHITECTURE/decisions-log.md`.

**The three options:**
- **React Native + Expo** — JavaScript/TypeScript, shares ecosystem with React web apps
- **Flutter** — Dart, Google's cross-platform framework, pixel-perfect custom UI
- **Native (Swift + Kotlin)** — Platform-specific, maximum control and performance

---

## Decision Nodes

### Node 1: Is the existing (or planned) web app built with TypeScript and React?

- **YES** → Go to Node 2
- **NO** → Go to Node 3

### Node 2: Do you need heavy custom native APIs (Bluetooth LE, NFC, ARKit/ARCore, custom camera pipelines, real-time audio processing)?

- **YES** → Go to Node 7 (lean Native)
- **NO** → Go to Node 4

### Node 3: Does the team already know Dart?

- **YES** → Go to Node 5 (lean Flutter)
- **NO** → Go to Node 2

### Node 4: Solo developer or small team with a fast timeline (MVP in < 8 weeks)?

- **YES** → **DECISION: Expo managed workflow** (React Native + Expo with managed builds)
- **NO** → Go to Node 6

### Node 5: Do you need pixel-perfect custom UI that looks identical on both platforms (not platform-native feel)?

- **YES** → **DECISION: Flutter**
- **NO** → Re-evaluate: if the web app is React/TS, go to Node 2. Otherwise → **DECISION: Flutter**

### Node 6: Is the project a monorepo with shared TypeScript packages (types, validators, utilities)?

- **YES** → **DECISION: React Native + Expo** (shares the TS ecosystem, consumes monorepo packages directly)
- **NO** → Go to Node 5

### Node 7: Enterprise project with platform-specific compliance requirements (HIPAA on-device encryption, government accessibility mandates, platform-specific MDM integration)?

- **YES** → **DECISION: Native (Swift + Kotlin)**
- **NO** → **DECISION: React Native + Expo** with custom dev client (for the native modules you need)

### Node 8 (escape hatch): Do you need pixel-perfect custom UI AND have no TypeScript/React on the web side?

- **YES** → **DECISION: Flutter**
- **NO** → Re-enter at Node 1

---

## Summary Comparison Table

| Criteria | React Native + Expo | Flutter | Native (Swift + Kotlin) |
|----------|-------------------|---------|----------------------|
| **Language** | TypeScript | Dart | Swift / Kotlin |
| **Code sharing with web** | High (shared TS packages) | Low (Dart =/= web stack) | None |
| **Performance** | Near-native (New Architecture / JSI) | Near-native (compiled to ARM) | Native |
| **Native API access** | Good (Expo modules + custom dev client) | Good (platform channels) | Full |
| **Learning curve (from React web)** | Low | Medium | High |
| **Learning curve (from scratch)** | Medium | Medium | High (two languages) |
| **Time to App Store** | Fast (EAS Build + Submit) | Fast (built-in tooling) | Slow (Xcode + Gradle manually) |
| **UI fidelity** | Platform-adaptive (follows OS conventions) | Pixel-perfect custom (same on both platforms) | Platform-native (best OS integration) |
| **Hot reload** | Yes (Fast Refresh) | Yes (Hot Reload) | Limited (SwiftUI previews / Compose previews) |
| **OTA updates** | Yes (expo-updates / EAS Update) | No (requires store release) | No (requires store release) |
| **Monorepo fit** | Excellent (same package manager, same bundler ecosystem) | Possible but awkward (Dart tooling separate) | Poor (separate build systems entirely) |
| **Community / ecosystem** | Very large (npm) | Large (pub.dev) | Platform-specific (large each) |

---

## When to Deviate

The decision tree gives you the default-correct answer. Deviate only when:

| Situation | Override |
|-----------|----------|
| You have an existing Flutter app and want to add web | Stick with Flutter, use Flutter Web (despite its limitations) |
| Startup with Flutter expertise but React web app | Use Flutter for mobile — hiring matters more than code sharing |
| React Native but you need a single complex native module (e.g., custom video editor) | Stay React Native, build one native module with Expo Modules API — do not switch to fully native |
| Performance-critical app (game, real-time video) | Native or Flutter — not React Native |
| Brownfield integration into existing native app | React Native (better brownfield support than Flutter) |
| App is primarily a WebView wrapper | Skip all three — use Capacitor or a PWA |

---

## Anti-Patterns

- **Choosing Native "for performance" when the app is CRUD** — Native is 3x the development cost for marginal performance gains on form-based apps.
- **Choosing Flutter because "it's newer"** — Framework novelty is not a technical requirement.
- **Choosing React Native without Expo** — Bare React Native without Expo is maintenance pain. Expo managed or custom dev client covers 99% of use cases.
- **Choosing based on a single blog post benchmark** — Real-world performance depends on your code, not synthetic benchmarks.
- **Splitting the team** — One framework, one codebase. Do not build iOS in Swift and Android in Kotlin unless you have dedicated platform teams.
