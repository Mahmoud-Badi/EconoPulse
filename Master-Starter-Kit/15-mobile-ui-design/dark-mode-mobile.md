# Dark Mode — Mobile Implementation

## Why Dark Mode Is Not Optional

On mobile, dark mode is a system-level setting that users expect every app to respect. Unlike web (where dark mode is a nice-to-have), mobile dark mode is table stakes:

- **OLED screens** (most modern phones) turn off individual pixels for true black, saving 30-60% battery life in dark mode.
- **iOS and Android** both provide system-wide dark mode toggles. Apps that ignore them feel broken.
- **App Store review** — both Apple and Google flag apps that do not adapt to system appearance.
- **Accessibility** — many users with light sensitivity rely on dark mode full-time.

This guide covers detection, token switching, image handling, and testing for every framework.

---

## System Dark Mode Detection

### React Native

```tsx
import { useColorScheme, Appearance } from 'react-native';

// Hook-based (recommended — auto-updates on change):
function App() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider value={theme}>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

// Imperative check (for non-component code):
const currentScheme = Appearance.getColorScheme();

// Listen for changes:
const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  console.log('System theme changed to:', colorScheme);
});
```

### Flutter

```dart
// In MaterialApp — automatic system detection:
MaterialApp(
  theme: AppTheme.light(),
  darkTheme: AppTheme.dark(),
  themeMode: ThemeMode.system, // Follows system setting
);

// Read current brightness in a widget:
final brightness = MediaQuery.platformBrightnessOf(context);
final isDark = brightness == Brightness.dark;

// Or from theme:
final isDark = Theme.of(context).brightness == Brightness.dark;
```

### Native iOS

```swift
// SwiftUI — automatic. Just use semantic colors and it works:
Text("Hello")
  .foregroundStyle(.primary) // Adapts automatically

// Detect manually:
@Environment(\.colorScheme) var colorScheme

var body: some View {
  VStack {
    Text(colorScheme == .dark ? "Dark mode" : "Light mode")
  }
}

// UIKit:
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
  super.traitCollectionDidChange(previousTraitCollection)
  if traitCollection.userInterfaceStyle != previousTraitCollection?.userInterfaceStyle {
    updateColors()
  }
}

// Check current style:
let isDark = traitCollection.userInterfaceStyle == .dark
```

### Native Android

```kotlin
// Compose — automatic with MaterialTheme:
@Composable
fun AppTheme(content: @Composable () -> Unit) {
  val darkTheme = isSystemInDarkTheme()

  val colorScheme = when {
    // Dynamic color (Android 12+):
    Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
      if (darkTheme) dynamicDarkColorScheme(LocalContext.current)
      else dynamicLightColorScheme(LocalContext.current)
    }
    darkTheme -> DarkColorScheme
    else -> LightColorScheme
  }

  MaterialTheme(colorScheme = colorScheme) { content() }
}

// Check manually:
val isNight = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
    Configuration.UI_MODE_NIGHT_YES
```

---

## Token Switching Strategy

The key to maintainable dark mode is **semantic color names** that auto-switch based on the current theme. Never use raw hex values in components.

### Semantic Color Tokens

| Token Name | Light Value | Dark Value | Usage |
|------------|------------|------------|-------|
| `background` | White (#FFFFFF) | Near-black (#121212 / #000000) | Screen background |
| `surface` | Light gray (#F9FAFB) | Dark gray (#1E1E1E) | Card, sheet background |
| `surfaceVariant` | Lighter gray (#F3F4F6) | Medium gray (#2C2C2C) | Grouped list background |
| `onBackground` | Near-black (#111827) | White (#F9FAFB) | Primary text on background |
| `onSurface` | Dark gray (#1F2937) | Light gray (#E5E7EB) | Primary text on surface |
| `onSurfaceVariant` | Medium gray (#6B7280) | Medium gray (#9CA3AF) | Secondary text |
| `primary` | Brand color 600 | Brand color 400 (lighter for contrast) | Buttons, links, active states |
| `onPrimary` | White | Near-black | Text on primary buttons |
| `outline` | Gray (#D1D5DB) | Gray (#374151) | Borders, dividers |
| `error` | Red (#EF4444) | Light red (#F87171) | Error states |
| `shadow` | Black 10% opacity | Black 40% opacity (or none) | Card shadows |

**Critical rule:** In dark mode, reduce elevation shadows and increase surface tint instead. On OLED screens, shadows on dark backgrounds are invisible — surface color differentiation matters more.

### React Native Token Implementation

```tsx
// theme/colors.ts
export const lightColors = {
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceVariant: '#F3F4F6',
  onBackground: '#111827',
  onSurface: '#1F2937',
  onSurfaceVariant: '#6B7280',
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  outline: '#D1D5DB',
  error: '#EF4444',
};

export const darkColors = {
  background: '#000000', // True black for OLED
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  onBackground: '#F9FAFB',
  onSurface: '#E5E7EB',
  onSurfaceVariant: '#9CA3AF',
  primary: '#818CF8', // Lighter shade for dark background contrast
  onPrimary: '#1E1B4B',
  outline: '#374151',
  error: '#F87171',
};

// Usage in components — NEVER hardcode:
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface, // Adapts automatically
    borderColor: theme.colors.outline,
  },
});
```

### Flutter Token Implementation

```dart
// theme/app_colors.dart
class AppColors {
  // Light
  static const lightScheme = ColorScheme.light(
    surface: Color(0xFFF9FAFB),
    onSurface: Color(0xFF1F2937),
    primary: Color(0xFF4F46E5),
    onPrimary: Color(0xFFFFFFFF),
    error: Color(0xFFEF4444),
    outline: Color(0xFFD1D5DB),
  );

  // Dark
  static const darkScheme = ColorScheme.dark(
    surface: Color(0xFF1C1C1E),
    onSurface: Color(0xFFE5E7EB),
    primary: Color(0xFF818CF8),
    onPrimary: Color(0xFF1E1B4B),
    error: Color(0xFFF87171),
    outline: Color(0xFF374151),
  );
}

// Usage in widgets — always read from theme:
Container(
  color: Theme.of(context).colorScheme.surface, // Adapts automatically
)
```

---

## Image Handling in Dark Mode

Images that look great on white backgrounds often look jarring on dark backgrounds.

### Strategy 1: Separate Dark Mode Variants

Provide two versions of illustrations, logos, and decorative images.

```
assets/
  images/
    logo-light.png      # Dark logo for light backgrounds
    logo-dark.png       # Light logo for dark backgrounds
    empty-state-light.png
    empty-state-dark.png
```

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
const colorScheme = useColorScheme();
const logoSource = colorScheme === 'dark'
  ? require('./assets/logo-dark.png')
  : require('./assets/logo-light.png');

<Image source={logoSource} />
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```
// In Asset Catalog:
// 1. Select the image set
// 2. In Attributes Inspector, set Appearances to "Any, Dark"
// 3. Drag light variant to "Any" slot, dark variant to "Dark" slot
// SwiftUI automatically picks the right one:
Image("logo") // Resolves based on current appearance
```

<!-- ENDIF -->

### Strategy 2: Dimming Filter

For user-uploaded images and photos, apply a subtle dimming overlay in dark mode to reduce eye strain.

```tsx
// React Native:
<View>
  <Image source={photo} style={styles.photo} />
  {colorScheme === 'dark' && (
    <View style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.15)', // 15% dim
    }} />
  )}
</View>
```

```dart
// Flutter:
ColorFiltered(
  colorFilter: isDark
    ? ColorFilter.mode(Colors.black.withOpacity(0.15), BlendMode.darken)
    : ColorFilter.mode(Colors.transparent, BlendMode.darken),
  child: Image.network(photo.url),
);
```

### Strategy 3: Transparent Backgrounds

For icons and illustrations, use transparent backgrounds (PNG or SVG) and tint them with the current theme's color.

```tsx
// React Native:
<Image source={icon} style={{ tintColor: theme.colors.onSurface }} />
```

```swift
// SwiftUI:
Image("custom-icon")
  .renderingMode(.template)
  .foregroundStyle(.primary)
```

```dart
// Flutter:
Icon(CustomIcons.chart, color: Theme.of(context).colorScheme.onSurface)
```

---

## Status Bar Styling

The status bar (time, battery, signal) must have light content on dark backgrounds and dark content on light backgrounds. Mismatched status bars are the first sign of broken dark mode.

### React Native

```tsx
import { StatusBar } from 'expo-status-bar';

// Auto-adapt (recommended):
<StatusBar style="auto" />

// Or manual:
<StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
```

### Flutter

```dart
// Set in AppBar or manually:
SystemChrome.setSystemUIOverlayStyle(
  isDark
    ? SystemUiOverlayStyle.light // Light icons on dark background
    : SystemUiOverlayStyle.dark,  // Dark icons on light background
);

// Or in AppBar (automatic):
AppBar(
  systemOverlayStyle: SystemUiOverlayStyle.light, // For dark app bars
);
```

### Native iOS

```swift
// SwiftUI: automatic based on background color

// UIKit: override in view controller
override var preferredStatusBarStyle: UIStatusBarStyle {
    return traitCollection.userInterfaceStyle == .dark ? .lightContent : .darkContent
}
```

### Native Android

```kotlin
// Compose:
val systemUiController = rememberSystemUiController()
val isDark = isSystemInDarkTheme()

SideEffect {
    systemUiController.setStatusBarColor(
        color = Color.Transparent,
        darkIcons = !isDark, // Dark icons in light mode, light icons in dark mode
    )
}

// Edge-to-edge (Android 15+):
enableEdgeToEdge() // In Activity.onCreate()
```

---

## Navigation Bar (Android) / Home Indicator (iOS)

The bottom navigation bar on Android and the home indicator area on iOS also need theme-aware styling.

```kotlin
// Android Compose:
systemUiController.setNavigationBarColor(
    color = Color.Transparent,
    darkIcons = !isDark,
)
```

```swift
// iOS: Home indicator automatically adapts.
// For full-screen content, you can control appearance:
override var prefersHomeIndicatorAutoHidden: Bool { true }
```

---

## Testing Dark Mode

### Simulator / Emulator Toggle

| Platform | How to Toggle |
|----------|--------------|
| iOS Simulator | Settings > Developer > Dark Appearance. Or: `xcrun simctl ui booted appearance dark` |
| Android Emulator | Settings > Display > Dark theme. Or: Quick Settings tile. |
| Xcode Preview | `.preferredColorScheme(.dark)` modifier on any preview |
| Android Studio Preview | Toggle dark mode icon in Compose Preview toolbar |

### React Native (Expo)

```bash
# iOS Simulator:
xcrun simctl ui booted appearance dark   # Switch to dark
xcrun simctl ui booted appearance light  # Switch to light

# Android Emulator:
adb shell cmd uimode night yes   # Switch to dark
adb shell cmd uimode night no    # Switch to light
```

### Testing Checklist

- [ ] Every screen renders correctly in both light and dark mode
- [ ] No hardcoded colors anywhere (all read from theme tokens)
- [ ] Text is readable on all surfaces (check contrast ratios: 4.5:1 minimum for body text)
- [ ] Images have dark mode variants or appropriate dimming
- [ ] Status bar content contrasts with the background on every screen
- [ ] Cards and surfaces are visually distinct from the background in both modes
- [ ] Primary color is lighter in dark mode (400 shade vs 600 shade) for sufficient contrast
- [ ] Shadows are reduced or replaced with surface tint in dark mode
- [ ] Dialogs, bottom sheets, and overlays use theme colors (not hardcoded white)
- [ ] Loading skeletons and shimmer effects use appropriate dark mode colors
- [ ] App transitions smoothly when user toggles system dark mode while app is running
- [ ] Navigation bar and tab bar backgrounds match the current mode
- [ ] Tested on an OLED device to verify true black renders correctly (no dark gray where black is expected)
