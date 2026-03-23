# Mobile Accessibility

## Why This Is Non-Negotiable

Mobile accessibility is not a feature. It is a legal requirement in many jurisdictions (ADA, EAA, AODA) and an App Store requirement for both Apple and Google. Beyond compliance:

- **15% of the world's population** has some form of disability.
- **VoiceOver users** will abandon your app immediately if it is not navigable.
- **Dynamic Type / font scaling** is used by 25%+ of iOS users (many who do not consider themselves disabled — they just want larger text).
- **Accessibility features often improve UX for everyone.** Larger touch targets help all users. Clear labels help screen readers AND search indexing.

This guide covers the four pillars of mobile accessibility: screen readers, font scaling, motion sensitivity, and contrast.

---

## Pillar 1: Screen Readers (VoiceOver & TalkBack)

### React Native

Every interactive element needs three things: a label, a role, and a state.

```tsx
// REQUIRED for every touchable element:
<Pressable
  onPress={toggleFavorite}
  accessible={true}                              // Makes it a single accessibility node
  accessibilityRole="button"                     // Tells the screen reader what this is
  accessibilityLabel="Add to favorites"          // What the screen reader says
  accessibilityHint="Double-tap to add this trip to your favorites" // Optional: HOW to interact
  accessibilityState={{
    selected: isFavorite,                        // Conveys current state
    disabled: isLoading,
  }}
>
  <HeartIcon filled={isFavorite} />
</Pressable>

// For text that changes dynamically:
<Text
  accessibilityRole="text"
  accessibilityLabel={`Trip status: ${status}`}
  accessibilityLiveRegion="polite"   // Announces changes automatically (Android)
>
  {status}
</Text>

// For images:
<Image
  source={avatar}
  accessibilityRole="image"
  accessibilityLabel="Profile photo of John Smith"
/>

// For decorative images (screen reader should skip):
<Image
  source={decoration}
  accessibilityElementsHidden={true}       // iOS
  importantForAccessibility="no-hide-descendants"  // Android
/>
```

**Custom accessibility actions:**

```tsx
<View
  accessibilityActions={[
    { name: 'delete', label: 'Delete this trip' },
    { name: 'archive', label: 'Archive this trip' },
  ]}
  onAccessibilityAction={(event) => {
    switch (event.nativeEvent.actionName) {
      case 'delete': handleDelete(); break;
      case 'archive': handleArchive(); break;
    }
  }}
>
  <TripCard trip={trip} />
</View>
```

**Grouping:** Combine related elements into a single accessibility node so VoiceOver does not read each separately.

```tsx
// BAD: VoiceOver reads "John", "Smith", "5 trips" as three separate items
<View>
  <Text>John</Text>
  <Text>Smith</Text>
  <Text>5 trips</Text>
</View>

// GOOD: VoiceOver reads "John Smith, 5 trips" as one item
<View accessible={true} accessibilityLabel="John Smith, 5 trips">
  <Text>John</Text>
  <Text>Smith</Text>
  <Text>5 trips</Text>
</View>
```

### Flutter

```dart
// Semantics widget wraps any widget to add accessibility info:
Semantics(
  label: 'Add to favorites',
  hint: 'Double-tap to add this trip to your favorites',
  button: true,
  selected: isFavorite,
  child: GestureDetector(
    onTap: toggleFavorite,
    child: HeartIcon(filled: isFavorite),
  ),
);

// For icon buttons (common oversight — icon buttons MUST have tooltip or label):
IconButton(
  icon: Icon(Icons.favorite),
  onPressed: toggleFavorite,
  tooltip: 'Add to favorites', // Also serves as Semantics label
);

// Exclude decorative elements:
ExcludeSemantics(
  child: Image.asset('decoration.png'),
);

// Merge multiple elements into one semantic node:
MergeSemantics(
  child: Row(
    children: [
      Text('John Smith'),
      Text('5 trips'),
    ],
  ),
);

// Live region (announces dynamic updates):
Semantics(
  liveRegion: true,
  child: Text('Status: $status'),
);
```

### Native iOS

```swift
// SwiftUI — most elements are automatically accessible. Customize when needed:
Button(action: toggleFavorite) {
    Image(systemName: isFavorite ? "heart.fill" : "heart")
}
.accessibilityLabel("Favorite")
.accessibilityHint("Double-tap to add to favorites")
.accessibilityAddTraits(isFavorite ? .isSelected : [])

// Hide decorative elements:
Image("decoration")
    .accessibilityHidden(true)

// Group elements:
VStack {
    Text("John Smith")
    Text("5 trips")
}
.accessibilityElement(children: .combine) // Reads as "John Smith, 5 trips"

// Custom rotor actions:
.accessibilityAction(named: "Delete") { delete() }
.accessibilityAction(named: "Archive") { archive() }

// UIKit:
button.accessibilityLabel = "Add to favorites"
button.accessibilityTraits = [.button]
button.isAccessibilityElement = true

// Dynamic announcements:
UIAccessibility.post(notification: .announcement, argument: "Trip saved successfully")
```

### Native Android

```kotlin
// Compose:
IconButton(
    onClick = { toggleFavorite() },
    modifier = Modifier.semantics {
        contentDescription = "Add to favorites"
        stateDescription = if (isFavorite) "Selected" else "Not selected"
        role = Role.Button
    },
) {
    Icon(Icons.Default.Favorite, contentDescription = null) // null because parent provides description
}

// Hide decorative elements:
Image(
    painter = painterResource(R.drawable.decoration),
    contentDescription = null, // null = hidden from TalkBack
    modifier = Modifier.semantics { invisibleToUser() },
)

// Live region for dynamic content:
Text(
    text = "Status: $status",
    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
)

// Merge semantics:
Row(modifier = Modifier.semantics(mergeDescendants = true) {}) {
    Text("John Smith")
    Text("5 trips")
}

// View system (XML):
// android:contentDescription="Add to favorites"
// android:importantForAccessibility="yes"
// android:accessibilityLiveRegion="polite"
```

---

## Pillar 2: Dynamic Type / Font Scaling

Users set their preferred font size in system settings. Your app MUST respect it. Text that does not scale is a critical accessibility failure.

### How Font Scaling Works

| Platform | Setting Location | Scale Range |
|----------|-----------------|-------------|
| iOS | Settings > Accessibility > Display & Text Size > Larger Text | 0.82x to 3.12x (with Accessibility Sizes enabled) |
| Android | Settings > Accessibility > Font size | 0.85x to 2.0x (varies by OEM) |

### React Native

```tsx
// React Native Text scales with system font by default. DO NOT disable this.
// NEVER set allowFontScaling={false} unless you have a specific, justified reason.

// BAD:
<Text allowFontScaling={false}>This ignores user preference</Text>

// GOOD:
<Text>This scales with system font size</Text>

// For containers that need to accommodate scaled text:
<Text
  style={{ fontSize: 16 }} // Base size — will be multiplied by system scale factor
  numberOfLines={0}         // Allow wrapping at large sizes
  adjustsFontSizeToFit={false} // Do NOT shrink text to fit — let it reflow
>
  {content}
</Text>

// Set maximum scale if truly necessary (e.g., tab bar labels):
<Text maxFontSizeMultiplier={1.5}>Tab Label</Text>

// Read current scale:
import { PixelRatio } from 'react-native';
const fontScale = PixelRatio.getFontScale(); // 1.0 = default, 2.0 = largest
```

### Flutter

```dart
// Flutter respects textScaleFactor by default. Do NOT override globally.

// Read current scale:
final textScaler = MediaQuery.textScalerOf(context);

// For fixed-size text (rare, justified cases only):
Text(
  'Fixed',
  textScaler: TextScaler.noScaling, // Use only for decorative text
);

// Layout must accommodate scaled text:
// Use Flexible/Expanded instead of fixed widths for text containers
// Use overflow: TextOverflow.ellipsis as a last resort, not a first choice
```

### Native iOS

```swift
// SwiftUI: Use system text styles — they scale automatically:
Text("Body text")
    .font(.body) // Scales with Dynamic Type

// UIKit: Use preferred fonts:
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true

// Custom fonts must also scale:
let customFont = UIFont(name: "CustomFont", size: 17)!
label.font = UIFontMetrics(forTextStyle: .body).scaledFont(for: customFont)
```

### Native Android

```kotlin
// Compose: Use Material typography — it scales with system font:
Text(
    text = "Body text",
    style = MaterialTheme.typography.bodyLarge, // Scales automatically
)

// sp units scale with system font. dp units do not.
// ALWAYS use sp for text size, dp for spacing and dimensions.

// XML:
// android:textSize="16sp"  <-- Scales (correct)
// android:textSize="16dp"  <-- Does NOT scale (wrong for text)
```

### Layout Considerations at Large Font Sizes

At maximum font scaling (3x on iOS), your layout WILL break unless you plan for it:

- **Buttons:** Text wraps or truncates. Use `minHeight` instead of fixed `height`.
- **Tab bars:** Labels may overflow. Allow two lines or use `maxFontSizeMultiplier`.
- **Cards:** Content grows vertically. Use flexible layouts, not fixed heights.
- **Headers:** Long titles wrap. Use `numberOfLines={2}` with ellipsis as a fallback.
- **Input fields:** Text inside fields grows. Use `minHeight`, not `height`.

---

## Pillar 3: Reduced Motion

Some users experience motion sickness, vertigo, or seizures from animations. Both platforms provide a "reduce motion" setting.

### Detection

```tsx
// React Native:
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);
useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
  return () => sub.remove();
}, []);

// Use in animations:
const duration = reduceMotion ? 0 : 300;
```

```dart
// Flutter:
final reduceMotion = MediaQuery.of(context).disableAnimations;

// Use in animations:
AnimatedContainer(
  duration: reduceMotion ? Duration.zero : Duration(milliseconds: 300),
  // ...
);
```

```swift
// SwiftUI:
@Environment(\.accessibilityReduceMotion) var reduceMotion

withAnimation(reduceMotion ? nil : .spring()) {
    showDetail = true
}
```

```kotlin
// Compose:
val reduceMotion = LocalReduceMotion.current
// Not directly available — read from system:
val reduceMotion = Settings.Global.getFloat(
    context.contentResolver,
    Settings.Global.ANIMATOR_DURATION_SCALE, 1f
) == 0f
```

### What to Do When Reduce Motion Is Enabled

| Animation Type | Normal | Reduced Motion |
|---------------|--------|----------------|
| Page transitions | Slide/fade (300ms) | Instant cut or cross-dissolve (150ms) |
| Loading spinners | Spinning animation | Static icon or progress bar |
| Parallax scrolling | Parallax effect | Disabled (static) |
| Auto-playing video | Plays automatically | Paused with play button |
| Hover/press animations | Scale, bounce | Opacity change only |
| Skeleton shimmer | Moving shimmer | Static gray placeholder |
| Lottie animations | Full animation | Static first/last frame |

---

## Pillar 4: High Contrast

Both platforms offer increased contrast modes that affect system UI. Your custom UI should also respond.

### Detection

```tsx
// React Native (iOS only natively — Android via settings check):
AccessibilityInfo.isHighContrastEnabled?.().then(setHighContrast);
```

```swift
// SwiftUI:
@Environment(\.accessibilityDarkerSystemColors) var darkerColors
@Environment(\.colorSchemeContrast) var contrast // .standard or .increased

// Adjust colors:
let borderColor = contrast == .increased ? Color.primary : Color.gray.opacity(0.3)
```

```dart
// Flutter:
final highContrast = MediaQuery.of(context).highContrast;
```

### What to Do in High Contrast Mode

- Increase border widths from 1px to 2px
- Replace subtle gray borders with solid dark borders
- Increase text contrast (ensure 7:1 ratio instead of 4.5:1)
- Remove decorative gradients that reduce readability
- Use solid fills instead of translucent overlays

---

## Switch Control / Keyboard Navigation

Some users navigate entirely via switch control (single-button input), external keyboards, or head tracking. Your app must support sequential focus navigation.

**React Native:**
- All `Pressable`, `TouchableOpacity`, and `Button` components are focusable by default.
- Ensure logical focus order by arranging elements in the correct order in the component tree (screen readers follow DOM order, not visual order).
- Use `accessibilityViewIsModal` on modal content to trap focus within the modal.

**Flutter:**
- Use `FocusTraversalGroup` and `FocusTraversalOrder` to control navigation order.
- `Focus` widget manages keyboard focus. `FocusScope` traps focus within a group.

**iOS:**
- SwiftUI automatically supports Switch Control when elements have accessibility traits.
- Use `accessibilityInputLabels` for Voice Control ("tap Save button").

**Android:**
- Compose supports keyboard navigation via `Modifier.focusable()`.
- Use `focusRequester` and `FocusRequester` to manage programmatic focus.
- Ensure `android:nextFocusDown`, `nextFocusRight` are set for View-based UI.

---

## Testing Checklist

Run through this checklist for every screen before shipping.

### Screen Reader Testing

- [ ] Enable VoiceOver (iOS) / TalkBack (Android) and navigate every screen
- [ ] Every interactive element has a descriptive `accessibilityLabel`
- [ ] Every button/link reads its purpose, not its visual appearance ("Delete trip" not "red button")
- [ ] Images have descriptive labels or are hidden from the screen reader (decorative)
- [ ] Dynamic content changes are announced (`accessibilityLiveRegion` / announcement)
- [ ] Custom gestures (swipe actions, long press) have accessible alternatives
- [ ] Modal content traps focus and dismisses to the trigger element
- [ ] Lists announce count ("1 of 15") via proper list semantics
- [ ] Headers are marked as headings for rotor navigation

### Font Scaling Testing

- [ ] Set system font to maximum size (Accessibility > Larger Text on iOS, Font Size on Android)
- [ ] Every screen is still usable — no overlapping text, no cut-off content
- [ ] Buttons are still tappable (text reflows, button height grows)
- [ ] Tab bar labels are readable (may use `maxFontSizeMultiplier`)
- [ ] Input fields accommodate larger text without clipping
- [ ] No `allowFontScaling={false}` without documented justification

### Motion Testing

- [ ] Enable Reduce Motion (Settings > Accessibility > Motion on iOS, Animator Duration Scale 0x on Android)
- [ ] Page transitions are instant or cross-dissolve (no slide/scale animations)
- [ ] No auto-playing animations (spinners, Lottie) — use static alternatives
- [ ] Parallax and scroll-linked animations are disabled
- [ ] Loading states use static placeholders instead of shimmer

### Contrast Testing

- [ ] Enable Increase Contrast (iOS) / High Contrast Text (Android)
- [ ] All text meets minimum contrast ratio: 4.5:1 for body, 3:1 for large text
- [ ] Interactive elements have visible focus indicators
- [ ] Disabled states are distinguishable from enabled states (not just color — use opacity or patterns)
- [ ] Error states are communicated via text/icon, not color alone
