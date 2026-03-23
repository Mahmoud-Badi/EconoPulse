<!-- IF {{HAS_MOBILE}} == "true" -->
# Mobile Documentation Strategy

How to document mobile features for {{PROJECT_NAME}} without duplicating effort, creating confusion between platforms, or blurring the line between App Store marketing copy and user support documentation.

---

## The Core Problem This Strategy Solves

Without a clear strategy, mobile documentation falls into three failure modes:

1. **Duplication**: A "Dashboard" guide written separately for web, iOS, and Android — three files to maintain that say nearly the same thing.
2. **Fragmentation**: Platform differences buried in footnotes or scattered across guides, with no consistent place to find them.
3. **Blurred intent**: App Store screenshots and descriptions mixed with user docs. Store copy is persuasive (convincing someone to download). User docs are instructional (helping someone use what they already have).

This strategy avoids all three.

---

## Principle 1: One Guide Per Feature, Not One Per Platform

### Cross-Platform Features

If a feature exists on both web and mobile, write **one guide** with platform-specific sections inside it. Do not create `dashboard-web.md`, `dashboard-ios.md`, and `dashboard-android.md`.

**Structure for a cross-platform feature guide:**

```markdown
# Feature Name

[Core description — platform-agnostic]

## How to Use Feature Name

[Web instructions — the primary flow]

## On Mobile

### iOS
[iOS-specific steps or differences]

### Android
[Android-specific steps or differences]

### Platform Differences
| Behavior | iOS | Android |
|----------|-----|---------|
| ...      | ... | ...     |
```

**Location:** `user_docs/guides/{{FEATURE_SLUG}}.md`

**Template:** `doc-types/feature-guide.template.md` — already includes the `<!-- IF {{HAS_MOBILE}} == "true" -->` mobile section.

### Platform-Only Features

If a feature exists only on mobile (e.g., push notifications, biometrics, offline mode), write a **dedicated mobile guide** in the `mobile/` subfolder.

**Location:** `user_docs/guides/mobile/{{FEATURE_SLUG}}.md`

**Templates:** The files in this directory (`mobile/`) are the starting points.

---

## Principle 2: Document Platform Differences In Context, Not Separately

When iOS and Android behave differently within the same feature, document the difference **inside that feature's guide** under a "Platform Notes" or "Platform Differences" section — not as a separate guide.

**Do this:**

```markdown
### Platform Differences

| Behavior | iOS | Android |
|----------|-----|---------|
| Biometric prompt style | Face ID / Touch ID sheet | Fingerprint / Face Unlock dialog |
| Settings path | Settings → {{PROJECT_NAME}} | Settings → Apps → {{PROJECT_NAME}} |
| Notification opt-in | System dialog after in-app prompt | Automatic (Android 12 and below) |
```

**Not this:**

- `biometrics-ios.md`
- `biometrics-android.md`

The exception: if the differences are so extensive that they make one guide unusable for either platform, use `platform-differences.template.md` to create a standalone reference document. This should be rare.

---

## Principle 3: App Store Docs and User Docs Are Separate Things

| Dimension | App Store / Play Store Listing | User Documentation |
|-----------|-------------------------------|-------------------|
| **Audience** | People who haven't downloaded yet | People who already have the app |
| **Goal** | Persuade them to download | Help them accomplish a task |
| **Tone** | Marketing: exciting, benefit-forward | Instructional: clear, direct, calm |
| **Screenshots** | Polished, may have device frames and text overlays | Clean captures, no frames, no overlays |
| **Text** | "The fastest way to manage your team" | "Tap the + button to add a team member" |
| **Location** | `user_docs/store-listing/` | `user_docs/guides/` |
| **Template** | `doc-types/app-store-listing.template.md` | `doc-types/feature-guide.template.md` |

**What they share:** The underlying screenshots (the raw captures). The designer takes the same screen capture and adds overlays/framing for the store listing. The raw capture goes directly into user docs.

**Rule:** Never copy marketing text into user documentation. Never copy instructional text into store listings. Write each for its audience.

---

## Decision Tree: Which Template Do I Use?

```
Is this feature available on mobile?
│
├─ NO → Use the standard feature guide template
│        doc-types/feature-guide.template.md
│        Location: user_docs/guides/{{FEATURE_SLUG}}.md
│
└─ YES → Is it also available on web?
         │
         ├─ YES (cross-platform) → Use the standard feature guide template
         │   The "On Mobile" section handles platform specifics.
         │   doc-types/feature-guide.template.md
         │   Location: user_docs/guides/{{FEATURE_SLUG}}.md
         │
         └─ NO (mobile-only) → Which type of mobile-only feature?
                               │
                               ├─ ONBOARDING → mobile-onboarding-guide.template.md
                               │
                               ├─ PUSH NOTIFICATIONS → push-notification-guide.template.md
                               │
                               ├─ OFFLINE MODE → offline-mode-guide.template.md
                               │                (only if {{MOBILE_OFFLINE}} == "true")
                               │
                               ├─ iOS vs ANDROID DIFFERENCES → platform-differences.template.md
                               │   (only when differences are too large for a table)
                               │
                               └─ OTHER MOBILE-ONLY FEATURE → use feature-guide.template.md
                                   with PLATFORM_SCOPE = "mobile-only"
                                   Location: user_docs/guides/mobile/{{FEATURE_SLUG}}.md
```

---

## Mobile-Only Feature Categories

These features always get dedicated guides in `user_docs/guides/mobile/`:

| Feature Category | Template | Condition |
|-----------------|----------|-----------|
| App onboarding (first launch) | `mobile-onboarding-guide.template.md` | Always (if HAS_MOBILE) |
| Push notifications | `push-notification-guide.template.md` | Always (if HAS_MOBILE) |
| Offline mode & sync | `offline-mode-guide.template.md` | Only if `{{MOBILE_OFFLINE}} == "true"` |
| Camera / document scanning | `feature-guide.template.md` (mobile-only) | If camera feature exists |
| Biometric authentication | `feature-guide.template.md` (mobile-only) | If biometrics implemented |
| Gesture navigation | `feature-guide.template.md` (mobile-only) | If complex gestures used |
| Location / maps | `feature-guide.template.md` (mobile-only) | If location feature exists |

---

## Platform Notes Section Standard

Every mobile feature guide should include a "Platform Notes" section using this format. Even if differences are minor, explicitly stating there are no meaningful differences is useful.

```markdown
## Platform Notes

### iOS

{{IOS_SPECIFIC_NOTES}}

![Screenshot: {{FEATURE_NAME}} on iOS]({{USER_DOCS_PATH}}/screenshots/ios/{{FEATURE_SLUG}}/main.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen -->

### Android

{{ANDROID_SPECIFIC_NOTES}}

![Screenshot: {{FEATURE_NAME}} on Android]({{USER_DOCS_PATH}}/screenshots/android/{{FEATURE_SLUG}}/main.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen -->

### Behavioral Differences

| Behavior | iOS | Android |
|----------|-----|---------|
| {{DIFFERENCE_1_LABEL}} | {{IOS_BEHAVIOR_1}} | {{ANDROID_BEHAVIOR_1}} |
| {{DIFFERENCE_2_LABEL}} | {{IOS_BEHAVIOR_2}} | {{ANDROID_BEHAVIOR_2}} |
```

If there are no meaningful differences: write "This feature behaves identically on iOS and Android." Do not leave the section empty.

---

## Screenshot Strategy for Mobile Docs

See `screenshot-automation/mobile-screenshot-guide.md` for the full capture workflow. The quick rules:

| Situation | Rule |
|-----------|------|
| Documentation screenshots | Raw captures, no device frames, no text overlays |
| App Store / Play Store screenshots | Polished, may include frames and overlays — see `app-store-screenshot-spec.md` |
| Permission dialogs | Always capture them — users need to see what to expect |
| Dark mode | Capture both light and dark if the app supports dark mode |
| Primary doc device (iOS) | iPhone 15 (390×844 logical pixels) |
| Primary doc device (Android) | Pixel 7 (412×915 logical pixels) |

Screenshot placeholders follow this format:

```markdown
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen -->
```

---

## Folder Layout for Mobile Docs

When the documentation generator runs, it produces:

```text
user_docs/
├── guides/
│   ├── {{FEATURE_SLUG}}.md          ← cross-platform features (includes "On Mobile" section)
│   └── mobile/
│       ├── onboarding.md            ← from mobile-onboarding-guide.template.md
│       ├── push-notifications.md    ← from push-notification-guide.template.md
│       ├── offline-mode.md          ← from offline-mode-guide.template.md (if MOBILE_OFFLINE)
│       └── {{MOBILE_FEATURE}}.md   ← other mobile-only features
├── screenshots/
│   ├── ios/
│   │   └── {{FEATURE_SLUG}}/
│   │       └── *.png
│   ├── android/
│   │   └── {{FEATURE_SLUG}}/
│   │       └── *.png
│   └── store/
│       ├── ios/
│       │   ├── 6.7in/               ← 1290×2796
│       │   ├── 6.5in/               ← 1284×2778
│       │   ├── 5.5in/               ← 1242×2208
│       │   └── ipad-12.9in/         ← 2048×2732
│       └── android/
│           └── phone/               ← 1080×1920
└── store-listing/
    ├── ios-listing.md               ← from doc-types/app-store-listing.template.md
    └── android-listing.md           ← from doc-types/app-store-listing.template.md
```

---

## When to Update Mobile Docs

| Trigger | Action Required |
|---------|----------------|
| New mobile-only feature shipped | Create guide in `user_docs/guides/mobile/` |
| Existing feature gains mobile support | Add "On Mobile" section to existing guide |
| iOS or Android UI change (visual only) | Recapture screenshots, update SCREENSHOT_PENDING markers |
| iOS or Android behavior change | Update "Platform Notes" table |
| New app version released | Update "What's New" in store listing; add changelog entry |
| New device class (e.g., new iPhone size) | Update `app-store-screenshot-spec.md` size table; recapture store screenshots |
| New language/locale added | Add localized screenshots per `app-store-screenshot-spec.md` |

---

## Quality Gate Checklist for Mobile Docs

Before a mobile feature ships, verify:

- [ ] Feature is covered in user docs (either in a cross-platform guide or a dedicated mobile guide)
- [ ] Screenshot placeholders exist for both iOS and Android views
- [ ] Platform Notes section explicitly addresses both platforms
- [ ] Push notification docs updated if the feature triggers any notifications
- [ ] Offline behavior documented if the feature has offline implications
- [ ] Store listing updated if the feature changes the app's core value proposition
- [ ] Dark mode screenshots captured if app supports dark mode

---

*This strategy document is part of the Mobile Documentation system. Related files: `platform-differences.template.md`, `mobile-onboarding-guide.template.md`, `push-notification-guide.template.md`, `offline-mode-guide.template.md`, `app-store-screenshot-spec.md`.*
<!-- ENDIF -->
