# Platform Guidelines — iOS HIG & Material Design 3

## Why Platform Conventions Matter

Users spend 95% of their screen time in other apps. They have built muscle memory for how navigation works, where the back button is, how pull-to-refresh feels, and what a delete swipe looks like. When your app violates these expectations, it feels broken — even if it technically works. This guide maps the two major design systems and tells you exactly when to follow platform conventions, when you can go cross-platform, and what to never do.

---

## iOS Human Interface Guidelines (HIG) Mapping

### Navigation Bar

| Pattern | Implementation | Notes |
|---------|---------------|-------|
| Large title | `navigationBarTitleDisplayMode(.large)` / `prefersLargeTitles = true` | Use on root screens of each tab. Collapses to inline on scroll. |
| Inline title | `navigationBarTitleDisplayMode(.inline)` | Use on pushed detail screens. |
| Back button | System-provided, shows previous screen's title | NEVER customize the back button icon. NEVER hide it. |
| Right bar items | 1-2 action buttons max | Use SF Symbols. No text labels in nav bar actions. |

### Tab Bar

| Rule | Detail |
|------|--------|
| Maximum items | 5 tabs. If you need more, the 5th is "More" with a list. |
| Icon style | SF Symbols, filled variant for selected, outline for unselected |
| Badge support | Red circle with count, system-provided |
| Persistence | Tab bar is always visible except during modal presentations and immersive experiences (video, photo editing) |
| Bottom position | ALWAYS at the bottom. Never at the top. Never as a sidebar on iPhone. |

### System Colors

iOS provides semantic colors that automatically adapt to light/dark mode and accessibility settings:

| Color | Light | Dark | Usage |
|-------|-------|------|-------|
| `.label` | Black | White | Primary text |
| `.secondaryLabel` | 60% gray | 60% white | Secondary text |
| `.systemBackground` | White | Black | Screen background |
| `.secondarySystemBackground` | Light gray | Dark gray | Card/grouped background |
| `.tintColor` | App accent | App accent | Interactive elements |
| `.systemRed` | Red | Red (adjusted) | Destructive, errors |
| `.separator` | Light gray | Dark gray | Divider lines |

**Rule:** Always use semantic colors, not hardcoded hex values. They auto-adapt to dark mode, high contrast, and increased contrast accessibility settings.

### SF Symbols

- 6,000+ system icons that match San Francisco font weight
- Use `Image(systemName:)` in SwiftUI or `UIImage(systemName:)` in UIKit
- Weight automatically matches nearby text weight
- Support multicolor, hierarchical, and palette rendering modes
- Prefer SF Symbols over custom icons for standard actions (share, delete, edit, search, settings)

### Haptic Feedback

```swift
// UIKit
let generator = UIImpactFeedbackGenerator(style: .medium)
generator.impactOccurred()

let notification = UINotificationFeedbackGenerator()
notification.notificationOccurred(.success)

// SwiftUI (iOS 17+)
Button("Save") { save() }
    .sensoryFeedback(.success, trigger: saveCompleted)
```

### Dynamic Type

All text must scale with the user's preferred font size. Use the system text styles:

| Style | Default Size | Usage |
|-------|-------------|-------|
| `.largeTitle` | 34pt | Screen titles |
| `.title` | 28pt | Section headers |
| `.title2` | 22pt | Subsection headers |
| `.title3` | 20pt | Card titles |
| `.headline` | 17pt semibold | Emphasized body |
| `.body` | 17pt | Primary content |
| `.callout` | 16pt | Secondary content |
| `.subheadline` | 15pt | Tertiary content |
| `.footnote` | 13pt | Captions, timestamps |
| `.caption` | 12pt | Fine print |

### Gesture Navigation

| Gesture | Behavior | Rule |
|---------|----------|------|
| Swipe from left edge | Navigate back | NEVER override or disable this |
| Swipe down on modal | Dismiss | Support for all modals presented as sheets |
| Long press | Context menu | Use for secondary actions on list items, images, links |
| Pinch | Zoom | Only on zoomable content (images, maps) |

---

## Material Design 3 Mapping

### Top App Bar

| Variant | When to Use | Scroll Behavior |
|---------|-------------|-----------------|
| Small | Default for most screens | Scrolls off (or stays pinned) |
| Medium | When title needs emphasis | Title collapses from medium to small on scroll |
| Large | Root screens, prominent title | Title collapses from large to small on scroll |
| Center-aligned | Simple screens, 1 action max | Stays pinned |

### Navigation Bar (Bottom)

| Rule | Detail |
|------|--------|
| Destinations | 3-5 destinations. Below 3, use tabs. Above 5, rethink IA. |
| Icon + label | Always show both icon and label. Never icon-only. |
| Active state | Filled icon + indicator pill + label. Inactive: outline icon + label. |
| Position | Always bottom. Use NavigationRail for tablets/large screens. |

### Material You Dynamic Color

Material 3 generates an entire color scheme from a single seed color (or the user's wallpaper on Android 12+):

```kotlin
// Compose: Dynamic color (Android 12+)
val colorScheme = when {
    dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        if (darkTheme) dynamicDarkColorScheme(context)
        else dynamicLightColorScheme(context)
    }
    darkTheme -> darkColorScheme(
        primary = Color(0xFF{{PRIMARY_COLOR_HEX}}),
        // ...
    )
    else -> lightColorScheme(
        primary = Color(0xFF{{PRIMARY_COLOR_HEX}}),
        // ...
    )
}

MaterialTheme(colorScheme = colorScheme) { content() }
```

### Shape System

Material 3 uses a consistent shape scale:

| Shape | Corner Radius | Usage |
|-------|--------------|-------|
| Extra small | 4dp | Chip, small badge |
| Small | 8dp | Button, text field |
| Medium | 12dp | Card, dialog |
| Large | 16dp | Bottom sheet, navigation drawer |
| Extra large | 28dp | FAB, large card |
| Full | 50% | Circular avatar, indicator pill |

### Type Scale

| Style | Size/Line height | Usage |
|-------|-----------------|-------|
| Display Large | 57sp/64sp | Hero numbers |
| Display Medium | 45sp/52sp | Large callouts |
| Display Small | 36sp/44sp | Section headers |
| Headline Large | 32sp/40sp | Screen titles |
| Headline Medium | 28sp/36sp | Card titles |
| Headline Small | 24sp/32sp | Subsection |
| Title Large | 22sp/28sp | Top app bar |
| Title Medium | 16sp/24sp | List section headers |
| Title Small | 14sp/20sp | Tabs |
| Body Large | 16sp/24sp | Primary content |
| Body Medium | 14sp/20sp | Secondary content |
| Body Small | 12sp/16sp | Captions |
| Label Large | 14sp/20sp | Buttons |
| Label Medium | 12sp/16sp | Chips, badges |
| Label Small | 11sp/16sp | Fine print |

### Elevation & Surface Tint

Material 3 replaced drop shadows with **surface tint** — elevated surfaces get a subtle overlay of the primary color:

| Level | Elevation | Tint Opacity | Usage |
|-------|-----------|-------------|-------|
| 0 | 0dp | 0% | Background |
| 1 | 1dp | 5% | Card, navigation bar |
| 2 | 3dp | 8% | FAB, bottom sheet (resting) |
| 3 | 6dp | 11% | Bottom sheet (dragged), dialog |
| 4 | 8dp | 12% | Unused (reserved) |
| 5 | 12dp | 14% | Unused (reserved) |

---

## Decision Framework: Platform vs Cross-Platform

### ALWAYS Follow Platform Conventions

These patterns are non-negotiable. Users have deep muscle memory and accessibility tools depend on them.

| Pattern | iOS | Android | Why |
|---------|-----|---------|-----|
| Back navigation | Swipe from left edge + nav bar back button | System back gesture (swipe from either edge) + system back button | Overriding breaks accessibility and muscle memory |
| System dialogs | UIAlertController | AlertDialog | Users recognize and trust them |
| Permissions | System permission dialog | System permission dialog | OS-enforced, cannot and should not customize |
| Share | UIActivityViewController | Intent.ACTION_SEND / ShareSheet | Exposes system share extensions |
| Scroll physics | Bounce (overscroll rubber-band) | Edge glow (overscroll) | Wrong physics feel fundamentally broken |
| Status bar | Light/dark content to contrast with background | Transparent/translucent, icons adapt | Mismatched status bar screams "not native" |
| Keyboard avoidance | System-managed with `KeyboardAvoidingView` | `android:windowSoftInputMode` | Content must move above keyboard |

### CAN Be Cross-Platform

These patterns can be consistent across platforms without feeling wrong.

| Pattern | Notes |
|---------|-------|
| Brand colors | Your primary, secondary, accent colors |
| Typography | Custom fonts (load on both platforms) |
| Custom components | Onboarding flows, dashboards, data visualizations |
| Content layout | Card designs, list item layouts, grid arrangements |
| Illustrations & imagery | Brand illustrations, empty states, onboarding |
| Animation style | Shared animation timing and easing (but use platform APIs) |
| Icon style | Custom product icons (but use SF Symbols / Material Symbols for system actions) |

### NEVER Do These

| Anti-Pattern | Problem |
|--------------|---------|
| iOS-style back button on Android | Android uses system back gesture. A left-arrow in the top-left is correct, but a chevron with "Back" text is iOS-specific. |
| Hamburger menu on iOS | iOS uses tab bars for primary navigation. Hamburger menus hide navigation and violate iOS conventions. |
| Custom scroll indicators | Both platforms have native scroll indicators users expect. Custom ones break inertial scrolling. |
| Android-style FAB on iOS | FABs are a Material pattern. iOS uses navigation bar buttons or prominent buttons. |
| iOS-style segmented control on Android | Use Material 3 tabs or filter chips instead. |
| Custom date/time pickers | Both platforms have excellent native pickers. Custom ones always lose to the system UX. |
| Overriding system font entirely | On iOS, San Francisco handles Dynamic Type. On Android, the system font handles accessibility scaling. Custom fonts must still support scaling. |

---

## Common UI Patterns — Cross-Platform Comparison

| Pattern | iOS (HIG) | Android (MD3) | React Native | Flutter |
|---------|-----------|---------------|-------------|---------|
| Primary navigation | Tab Bar (bottom, 2-5 items) | Navigation Bar (bottom, 3-5 items) | `@react-navigation/bottom-tabs` | `NavigationBar` widget |
| Secondary navigation | Back button + push stack | Back gesture + push stack | Stack navigator | `Navigator.push()` |
| Action menu | ActionSheet (bottom) | BottomSheetDialog or Menu | `ActionSheetIOS` / `@gorhom/bottom-sheet` | `showModalBottomSheet()` |
| Selection list | Checkmark (trailing) | Checkbox (leading) | Platform-adaptive checkmark | `CheckboxListTile` |
| Delete action | Swipe left → red "Delete" | Swipe left → trash icon | `react-native-swipeable` | `Dismissible` widget |
| Pull to refresh | Native spinner (top) | Linear progress (top) | `RefreshControl` | `RefreshIndicator` |
| Loading | Activity indicator (spinner) | Circular progress indicator | `ActivityIndicator` | `CircularProgressIndicator` |
| Toggle | `UISwitch` (green/gray) | `Switch` (primary/surface) | `Switch` (platform-adaptive) | `Switch.adaptive()` |
| Search | Search bar in nav (cancel button) | Search bar (voice icon) | `SearchBar` (platform-specific) | `SearchBar` widget |
| Empty state | Centered illustration + text | Centered illustration + text + button | Custom (same on both) | Custom (same on both) |
| Destructive confirm | Red button in alert | Red text in dialog | Platform-adaptive alert | `AlertDialog` with red action |
| Date picker | Scroll wheels (inline or modal) | Calendar grid (modal) | `@react-native-community/datetimepicker` | `showDatePicker()` |
| Context menu | Long press → preview + menu | Long press → popup menu | `ContextMenu` (iOS) / custom | `PopupMenuButton` |

---

## Checklist

Before finalizing your mobile UI:

- [ ] Navigation follows platform conventions (tab bar on iOS, navigation bar on Android)
- [ ] Back navigation uses system gestures and never overrides them
- [ ] System colors/semantic colors are used for standard UI elements
- [ ] Text uses platform type styles and supports Dynamic Type / font scaling
- [ ] Scroll physics match the platform (bounce on iOS, glow on Android)
- [ ] Dialogs and sheets use platform-native APIs
- [ ] Share, permissions, and date pickers use system components
- [ ] No cross-platform anti-patterns (hamburger on iOS, FAB on iOS, iOS back text on Android)
