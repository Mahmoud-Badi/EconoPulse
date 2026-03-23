# Mobile Design Tokens

## Why Mobile Needs Its Own Tokens

Web design tokens (`07-ui-design-system/design-token-guide.md`) handle colors, typography, spacing, and shadows. Mobile adds an entirely new layer: **physical device constraints**. Screens have notches, home indicators, and rounded corners. Fingers are 44pt wide, not 1px mouse cursors. Devices vibrate. Users hold phones with one hand, thumb at the bottom.

Your mobile tokens extend your web tokens — they don't replace them. Colors, brand, and semantic tokens stay the same. Everything below is additive.

---

## Safe Area Insets

Safe areas define the region of the screen not obscured by hardware (notch, Dynamic Island, home indicator, status bar, navigation bar).

**Never place interactive content outside safe areas. Never place readable text outside safe areas.**

| Token | Description | iOS Value (typical) | Android Value (typical) |
|-------|-------------|--------------------|-----------------------|
| `--safe-area-top` | Status bar + notch/Dynamic Island | 59pt (iPhone 15) | 24dp (status bar) |
| `--safe-area-bottom` | Home indicator | 34pt (Face ID devices) | 0dp (gesture nav varies) |
| `--safe-area-left` | Landscape left inset | 0pt (portrait) | 0dp (portrait) |
| `--safe-area-right` | Landscape right inset | 0pt (portrait) | 0dp (portrait) |

### Per-Framework Implementation

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

**React Native (Expo):**

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      {/* Content is always within safe area */}
    </View>
  );
}
```

With NativeWind (Tailwind for RN), use `pt-safe`, `pb-safe`, `pl-safe`, `pr-safe` utility classes.

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

**Flutter:**

```dart
Widget build(BuildContext context) {
  final padding = MediaQuery.of(context).padding;

  return Padding(
    padding: EdgeInsets.only(
      top: padding.top,
      bottom: padding.bottom,
      left: padding.left,
      right: padding.right,
    ),
    child: content,
  );
}

// Or simply:
return SafeArea(child: content);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

**Native iOS (SwiftUI):**

```swift
// SwiftUI handles safe areas automatically.
// Only ignore them when you intentionally want edge-to-edge:
VStack {
    content
}
.ignoresSafeArea(.container, edges: .top) // Full-bleed header image
```

**UIKit:**

```swift
let topInset = view.safeAreaInsets.top
let bottomInset = view.safeAreaInsets.bottom
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

**Native Android (Compose):**

```kotlin
// Enable edge-to-edge in Activity:
WindowCompat.setDecorFitsSystemWindows(window, false)

// Then consume insets in Compose:
Scaffold(
    modifier = Modifier.windowInsetsPadding(WindowInsets.systemBars)
) { innerPadding ->
    Content(modifier = Modifier.padding(innerPadding))
}
```

<!-- ENDIF -->

---

## Touch Target Minimums

Human fingertips are approximately 10mm wide. Both platforms enforce minimum touch target sizes to prevent mis-taps.

| Token | iOS (HIG) | Android (MD3) | Usage |
|-------|-----------|---------------|-------|
| `--touch-target-min` | 44x44pt | 48x48dp | Smallest tappable area allowed |
| `--touch-target-comfortable` | 50x50pt | 56x56dp | Recommended for primary actions |
| `--touch-target-spacing` | 8pt | 8dp | Minimum gap between adjacent targets |

**Critical rule:** The visual element can be smaller than the touch target. A 24x24 icon button must still have a 44x44pt / 48x48dp hit area. Use padding or `hitSlop` to expand the tappable region.

### Per-Framework Implementation

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// React Native: hitSlop expands touch area without changing layout
<TouchableOpacity
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  style={{ width: 24, height: 24 }}
  onPress={handlePress}
>
  <Icon size={24} />
</TouchableOpacity>

// Or use Pressable with explicit minimum size:
<Pressable
  style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
  onPress={handlePress}
>
  <Icon size={24} />
</Pressable>
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
// Flutter: MaterialTapTargetSize ensures 48dp minimum
IconButton(
  icon: Icon(Icons.close, size: 24),
  onPressed: onClose,
  constraints: BoxConstraints(minWidth: 48, minHeight: 48),
)

// For custom widgets, wrap in SizedBox:
SizedBox(
  width: 48,
  height: 48,
  child: GestureDetector(
    onTap: onTap,
    child: Icon(Icons.favorite, size: 24),
  ),
)
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI: frame modifier sets minimum hit area
Button(action: handlePress) {
    Image(systemName: "xmark")
        .font(.system(size: 16))
}
.frame(minWidth: 44, minHeight: 44)

// UIKit: override point(inside:with:) for expanded hit area
override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    let expandedBounds = bounds.insetBy(dx: -10, dy: -10)
    return expandedBounds.contains(point)
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: Modifier.sizeIn sets minimum dimensions
IconButton(
    onClick = { onClose() },
    modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)
) {
    Icon(Icons.Default.Close, contentDescription = "Close")
}

// TouchDelegate expands hit area in View system
```

<!-- ENDIF -->

---

## Screen Density Tokens

Devices render at different pixel densities. Design in **points (iOS) or dp (Android)**, not pixels.

| Token | iOS | Android | Pixel Multiplier |
|-------|-----|---------|-----------------|
| `--density-1x` | @1x (legacy) | mdpi (160dpi) | 1x |
| `--density-1.5x` | — | hdpi (240dpi) | 1.5x |
| `--density-2x` | @2x (Retina) | xhdpi (320dpi) | 2x |
| `--density-3x` | @3x (Super Retina) | xxhdpi (480dpi) | 3x |
| `--density-4x` | — | xxxhdpi (640dpi) | 4x |

**Practical impact:**
- Export images at 1x, 2x, and 3x for iOS; mdpi through xxxhdpi for Android.
- Use vector assets (SF Symbols, Material Symbols, SVG) wherever possible — they scale to any density without multiple exports.
- In React Native, use `PixelRatio.get()` to read device density. In Flutter, use `MediaQuery.of(context).devicePixelRatio`.

---

## Haptic Feedback Patterns

Haptics add physical confirmation to digital interactions. Use them sparingly and consistently.

| Token | Description | iOS Implementation | Android Implementation | When to Use |
|-------|-------------|-------------------|----------------------|-------------|
| `--haptic-light` | Subtle tap | `.light` (UIImpactFeedbackGenerator) | `HapticFeedbackConstants.CLOCK_TICK` | Toggle, selection change |
| `--haptic-medium` | Noticeable bump | `.medium` (UIImpactFeedbackGenerator) | `HapticFeedbackConstants.CONTEXT_CLICK` | Button press, card tap |
| `--haptic-heavy` | Strong thud | `.heavy` (UIImpactFeedbackGenerator) | `HapticFeedbackConstants.LONG_PRESS` | Destructive action confirm |
| `--haptic-selection` | Tick on selection | UISelectionFeedbackGenerator | `HapticFeedbackConstants.CLOCK_TICK` | Picker scroll, slider snap |
| `--haptic-success` | Ascending pattern | `.success` (UINotificationFeedbackGenerator) | Custom VibrationEffect | Task completion, save |
| `--haptic-warning` | Attention pattern | `.warning` (UINotificationFeedbackGenerator) | Custom VibrationEffect | Validation error, limit |
| `--haptic-error` | Descending pattern | `.error` (UINotificationFeedbackGenerator) | Custom VibrationEffect | Failed action, denied |

### Per-Framework Implementation

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
import * as Haptics from 'expo-haptics';

// Light tap (toggle, minor selection)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Success notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Selection tick (scrolling through picker)
Haptics.selectionAsync();
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
import 'package:flutter/services.dart';

// Light tap
HapticFeedback.lightImpact();

// Medium tap
HapticFeedback.mediumImpact();

// Heavy tap
HapticFeedback.heavyImpact();

// Selection tick
HapticFeedback.selectionClick();
```

<!-- ENDIF -->

**Rules:**
- DO trigger haptics on destructive actions (delete confirmation), successful completions, and selection changes in pickers.
- DO NOT trigger haptics on every tap, during scrolling, or on keyboard input.
- Always respect the system setting — if the user has haptics disabled, do nothing.

---

## Gesture Zones

When users hold their phone with one hand, only the bottom ~40% of the screen is comfortably reachable with the thumb.

```
┌────────────────────────┐
│                        │  HARD-TO-REACH ZONE (top 15%)
│   Status bar / title   │  No interactive elements here
│                        │  except navigation back button
├────────────────────────┤
│                        │
│                        │  STRETCH ZONE (middle 45%)
│   Content, lists,      │  Read-only content is fine
│   informational UI     │  Avoid frequent-use actions
│                        │
│                        │
├────────────────────────┤
│                        │
│   Primary actions,     │  THUMB ZONE (bottom 40%)
│   tab bar, FAB,        │  All primary interactive elements
│   bottom sheets        │  must live here
│                        │
└────────────────────────┘
```

**Practical rules:**
- Primary actions (submit, save, next) go in the bottom 40%.
- Tab bars and navigation live at the bottom.
- Search can start at top but should expand downward.
- Bottom sheets are ideal for action menus — they appear in the thumb zone.
- The top of the screen is for titles, status, and back navigation only.

---

## Token Mapping Table

This table maps your web design tokens to their mobile equivalents across platforms.

| Web Token | Mobile Token | React Native | Flutter | iOS Native | Android Native |
|-----------|-------------|-------------|---------|------------|----------------|
| `--color-primary` | `--color-primary` | `theme.colors.primary` | `Theme.of(context).colorScheme.primary` | `UIColor.tintColor` / `.accentColor` | `MaterialTheme.colorScheme.primary` |
| `--color-background` | `--color-background` | `theme.colors.background` | `Theme.of(context).scaffoldBackgroundColor` | `.systemBackground` | `MaterialTheme.colorScheme.background` |
| `--color-surface` | `--color-surface` | `theme.colors.card` | `Theme.of(context).cardColor` | `.secondarySystemBackground` | `MaterialTheme.colorScheme.surface` |
| `--color-on-surface` | `--color-on-surface` | `theme.colors.text` | `Theme.of(context).colorScheme.onSurface` | `.label` | `MaterialTheme.colorScheme.onSurface` |
| `--color-error` | `--color-error` | `theme.colors.error` | `Theme.of(context).colorScheme.error` | `.systemRed` | `MaterialTheme.colorScheme.error` |
| `--spacing-sm` (8px) | `--spacing-sm` | `8` (unitless = dp) | `8.0` (logical pixels) | `8` (points) | `8.dp` |
| `--spacing-md` (16px) | `--spacing-md` | `16` | `16.0` | `16` | `16.dp` |
| `--spacing-lg` (24px) | `--spacing-lg` | `24` | `24.0` | `24` | `24.dp` |
| `--radius-sm` (4px) | `--radius-sm` | `4` | `4.0` | `4` | `4.dp` |
| `--radius-md` (8px) | `--radius-md` | `8` | `8.0` | `8` | `8.dp` |
| `--radius-lg` (16px) | `--radius-lg` | `16` | `16.0` | `16` | `16.dp` |
| `--font-size-body` | `--font-size-body` | `16` (RN default) | `14.0` (MD3 body large) | `17pt` (iOS body) | `16sp` (MD3 body large) |
| `--shadow-sm` | `--elevation-sm` | `shadowOffset + shadowRadius` | `elevation: 1` | `shadow(radius: 2)` | `tonalElevation = 1.dp` |
| `--shadow-md` | `--elevation-md` | `shadowOffset + shadowRadius` | `elevation: 3` | `shadow(radius: 4)` | `tonalElevation = 3.dp` |
| `--shadow-lg` | `--elevation-lg` | `shadowOffset + shadowRadius` | `elevation: 6` | `shadow(radius: 8)` | `tonalElevation = 6.dp` |
| N/A | `--safe-area-top` | `useSafeAreaInsets().top` | `MediaQuery.of(context).padding.top` | `safeAreaInsets.top` | `WindowInsets.systemBars` |
| N/A | `--touch-target-min` | `44` (use iOS standard) | `48.0` (MD3 standard) | `44pt` | `48.dp` |

---

## Creating a Theme Provider

Centralize all tokens in a theme provider so every component reads from one source.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

**React Native Theme Provider:**

```tsx
// theme/tokens.ts
export const tokens = {
  colors: {
    primary: '{{PRIMARY_COLOR}}',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    onSurface: '#111827',
    error: '#EF4444',
    // Dark mode variants defined separately
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radii: { sm: 4, md: 8, lg: 16, full: 9999 },
  touchTarget: { min: 44, comfortable: 50 },
  haptics: {
    light: 'light' as const,
    medium: 'medium' as const,
    heavy: 'heavy' as const,
  },
} as const;

// theme/ThemeProvider.tsx
import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(tokens);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTokens : tokens;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

**Flutter ThemeData Extension:**

```dart
// theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() => ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Color(0xFF{{PRIMARY_COLOR_HEX}}),
      brightness: Brightness.light,
    ),
    useMaterial3: true,
    // Custom extensions below
  );

  static ThemeData dark() => ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Color(0xFF{{PRIMARY_COLOR_HEX}}),
      brightness: Brightness.dark,
    ),
    useMaterial3: true,
  );
}

// Usage in MaterialApp:
MaterialApp(
  theme: AppTheme.light(),
  darkTheme: AppTheme.dark(),
  themeMode: ThemeMode.system,
);
```

<!-- ENDIF -->

---

## Checklist

Before building any mobile UI, confirm these tokens are defined:

- [ ] Safe area insets are respected on every screen
- [ ] All interactive elements meet minimum touch target size (44pt / 48dp)
- [ ] Images are exported at appropriate density scales (or using vectors)
- [ ] Haptic feedback is wired to key interactions (not overused)
- [ ] Primary actions are placed in the thumb zone (bottom 40%)
- [ ] Web design tokens have been mapped to mobile equivalents
- [ ] A centralized theme provider exists and all components consume it
