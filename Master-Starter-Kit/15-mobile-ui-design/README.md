# 15 - Mobile UI & Design System

## Purpose

This section defines how to make your mobile app look and feel like a native product, not a web app wrapped in a shell. Every file exists because mobile UI has fundamentally different constraints from web: touch targets instead of mouse precision, system dark mode instead of CSS media queries, VoiceOver/TalkBack instead of screen readers, and platform conventions (iOS HIG / Material Design 3) that users unconsciously expect.

**Input:** Framework choice from `14-mobile-platform/`, design tokens from `07-ui-design-system/`
**Output:** A mobile UI system with platform-native components, accessibility, dark mode, and responsive layouts

---

## File Manifest

| # | File | Type | Description |
|---|------|------|-------------|
| 1 | `README.md` | Guide | This file — orchestrates the mobile UI section |
| 2 | `mobile-design-tokens.md` | Guide | Mobile-specific tokens: safe areas, touch targets, density, haptics, gesture zones |
| 3 | `platform-guidelines.md` | Guide | iOS HIG and Material Design 3 mapping with cross-platform decision framework |
| 4 | `mobile-component-library.template.md` | Template | 12-component inventory with per-framework variants |
| 5 | `dark-mode-mobile.md` | Guide | System dark mode detection, token switching, image handling per framework |
| 6 | `mobile-accessibility.md` | Guide | VoiceOver, TalkBack, Dynamic Type, reduced motion, testing checklist |
| 7 | `mobile-responsive-strategy.md` | Guide | Phone vs tablet layouts, orientation, split view, foldable support |
| 8 | `mobile-anti-slop.md` | Guide | 14 mobile-specific anti-patterns with wrong/correct/why for each |

---

## Reading Order

1. **Mobile design tokens** — extend your web tokens for mobile-specific constraints
2. **Platform guidelines** — understand what iOS and Android users expect
3. **Component library** — pick your per-framework component implementations
4. **Dark mode** — wire up system theme detection and token switching
5. **Accessibility** — add screen reader support and respect system preferences
6. **Responsive strategy** — handle phones, tablets, and foldables
7. **Anti-slop rulebook** — verify your mobile UI against common anti-patterns

## When to Use This Section

- You have chosen a mobile framework (Section 14) and are ready to build UI
- You are porting a web design system to mobile and need platform-native adaptations
- You need to add dark mode, accessibility, or tablet support to an existing mobile app
- You want to audit a mobile app for platform convention violations
