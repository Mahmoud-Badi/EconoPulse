# 14 - Mobile Platform Foundation

## Purpose

This section defines how to add a mobile application to your project. It covers framework selection, project structure, navigation, state management, and code sharing between web and mobile. Every file exists because mobile development has a distinct set of tradeoffs from web — and making the wrong structural decisions in week one creates months of pain.

**Input:** `ARCHITECTURE/` decisions (tech stack, API design, auth strategy)
**Output:** A scaffolded mobile project integrated into your existing codebase (or standalone)

---

## File Manifest

| # | File | Type | Description |
|---|------|------|-------------|
| 1 | `README.md` | Guide | This file — orchestrates the mobile platform section |
| 2 | `framework-decision-tree.md` | Guide | 8-node decision tree for choosing React Native, Flutter, or Native |
| 3 | `react-native-project-structure.template.md` | Template | Expo Router project structure for a Turborepo monorepo |
| 4 | `flutter-project-structure.template.md` | Template | Flutter project structure with Riverpod and GoRouter |
| 5 | `native-project-structure.template.md` | Template | Swift (SwiftUI) + Kotlin (Compose) native project structures |
| 6 | `monorepo-integration.md` | Guide | Adding mobile to an existing Turborepo + pnpm monorepo |
| 7 | `navigation-patterns.md` | Guide | Per-framework navigation architecture and deep linking |
| 8 | `state-management-mobile.md` | Guide | Per-framework state management, persistence, and server state |
| 9 | `shared-code-architecture.md` | Guide | What can and cannot be shared between web and mobile |
| 10 | `standalone-mobile-template.md` | Template | Project structure for mobile-only projects without a web companion |

---

## Reading Order

1. **Framework decision tree** — pick your framework before anything else
2. **Project structure template** — scaffold the chosen framework (pick one of files 3/4/5)
3. **Monorepo integration** — wire mobile into your existing monorepo (skip if standalone)
4. **Shared code architecture** — understand what crosses the web/mobile boundary
5. **Navigation patterns** — set up routing and deep links for your framework
6. **State management** — wire up state, server cache, and persistence
7. **Standalone template** — use instead of steps 2-3 if building mobile-only

## When to Use This Section

- You have a working web app and want to add a mobile companion
- You are starting a new project that needs both web and mobile from day one
- You are building a mobile-only product and need a structured starting point
- You need to decide between React Native, Flutter, and Native development
