# Mobile Anti-Slop Rulebook

## What Is Mobile Slop?

Mobile slop is the collection of decisions that make an app feel like a web page stuffed into a phone shell instead of a native mobile product. Each violation on its own is minor. Combined, they create an experience that feels wrong — users cannot articulate why, but they uninstall.

This rulebook lists 14 specific anti-patterns. For each: the WRONG approach, the CORRECT approach, and WHY it matters. Treat every violation as a bug.

---

## Rule M1: Never Use Web-Style Dropdown Selects

### WRONG

```tsx
// HTML-style <select> dropdown on mobile
<Picker style={{ height: 40, borderWidth: 1 }}>
  <Picker.Item label="January" value="1" />
  <Picker.Item label="February" value="2" />
  {/* ... */}
</Picker>
```

A small dropdown that opens a tiny scrollable list. Difficult to tap options. Looks like a web form.

### CORRECT

```tsx
// iOS: native date picker wheel / action sheet
// Android: native date picker dialog / bottom sheet selector
import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker
  value={date}
  mode="date"
  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
  onChange={handleChange}
/>

// For custom options: use ActionSheet (iOS) or BottomSheet (Android)
ActionSheetIOS.showActionSheetWithOptions({
  options: ['January', 'February', 'March', 'Cancel'],
  cancelButtonIndex: 3,
}, handleSelect);
```

### WHY

Native pickers are designed for finger-sized interaction. They have inertial scrolling, large touch targets, and match user expectations from every other app on their phone. Web-style dropdowns feel broken on mobile because they are.

---

## Rule M2: Never Have Touch Targets Smaller Than 44x44pt / 48x48dp

### WRONG

```tsx
// Icon button with no padding — only 24x24 hit area
<TouchableOpacity onPress={onClose} style={{ width: 24, height: 24 }}>
  <CloseIcon size={24} />
</TouchableOpacity>
```

Users miss the target, tap twice, get frustrated. This fails accessibility audits.

### CORRECT

```tsx
// Visual element is 24px, but hit area is 44x44
<Pressable
  onPress={onClose}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
  accessibilityLabel="Close"
  accessibilityRole="button"
>
  <CloseIcon size={24} />
</Pressable>
```

### WHY

Human fingertips are approximately 10mm (44pt) wide. Apple's HIG requires 44x44pt minimums. Google's Material Design requires 48x48dp. These are not suggestions — they are physiological constraints. Below these sizes, error rates increase dramatically.

---

## Rule M3: Never Ignore Safe Areas

### WRONG

```tsx
// Content renders under the notch and home indicator
<View style={{ flex: 1 }}>
  <Text style={{ marginTop: 20 }}>This gets clipped by the notch</Text>
  <BottomButton style={{ marginBottom: 0 }}>Save</BottomButton>
</View>
```

Text is hidden behind the Dynamic Island. The save button overlaps with the home indicator gesture area.

### CORRECT

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Text>Safely below the notch</Text>
      <BottomButton style={{ marginBottom: 0 }}>Save</BottomButton>
    </View>
  );
}
```

### WHY

Modern phones have notches, Dynamic Islands, camera cutouts, rounded screen corners, and home indicator bars. Content placed in these areas is either invisible or interferes with system gestures. Every phone since iPhone X (2017) has safe area insets. There is no excuse for ignoring them.

---

## Rule M4: Never Use Web-Style Scroll Physics

### WRONG

```tsx
// A ScrollView with abrupt stopping, no overscroll, or wrong overscroll behavior
<ScrollView
  overScrollMode="never"          // Kills natural scroll feel on Android
  bounces={false}                 // Kills natural scroll feel on iOS
  decelerationRate="normal"
>
  {content}
</ScrollView>
```

The scroll stops dead. No rubber-band bounce (iOS) or edge glow (Android). Feels like dragging a web page.

### CORRECT

```tsx
// Let the platform handle scroll physics naturally
<ScrollView
  // iOS: bounces is true by default — leave it
  // Android: overScrollMode is "always" by default — leave it
  showsVerticalScrollIndicator={true}
  contentInsetAdjustmentBehavior="automatic" // iOS: adjusts for nav bar
>
  {content}
</ScrollView>
```

### WHY

Users have subconscious expectations about scroll physics from every other app. iOS users expect rubber-band overscroll. Android users expect edge glow. When your scroll feels different, the entire app feels off — it is the uncanny valley of mobile UI.

---

## Rule M5: Never Skip Loading States on Slow Networks

### WRONG

```tsx
// Screen shows nothing while loading, then suddenly pops in
function TripList() {
  const { data } = useQuery('trips', fetchTrips);
  if (!data) return null; // Blank screen for 2-10 seconds on 3G
  return <FlatList data={data} renderItem={renderTrip} />;
}
```

On 3G (still common in many regions) or flaky mobile connections, the user sees a white screen for seconds. They think the app is broken.

### CORRECT

```tsx
function TripList() {
  const { data, isLoading, error } = useQuery('trips', fetchTrips);

  if (error) return <ErrorState message="Could not load trips" onRetry={refetch} />;
  if (isLoading) return <TripListSkeleton />; // Skeleton matching the real layout shape

  return (
    <FlatList
      data={data}
      renderItem={renderTrip}
      ListEmptyComponent={<EmptyState title="No trips" actionLabel="Create Trip" />}
    />
  );
}
```

### WHY

Mobile networks are unreliable. Users are on elevators, subways, moving cars. Every screen must have three states: loading (skeleton), error (retry button), and empty (CTA). A blank screen is indistinguishable from a crash.

---

## Rule M6: Never Omit an Offline Indicator

### WRONG

```tsx
// API calls fail silently when offline
// User taps "Save" — nothing happens
// No feedback that connectivity is lost
```

### CORRECT

```tsx
import NetInfo from '@react-native-community/netinfo';

function OfflineBanner() {
  const netInfo = useNetInfo();

  if (netInfo.isConnected === false) {
    return (
      <View style={styles.banner}>
        <Text style={styles.bannerText}>No internet connection</Text>
      </View>
    );
  }
  return null;
}

// Show at the top of every screen, below the status bar
// Also: queue actions while offline and sync when connectivity returns
```

### WHY

Mobile devices lose connectivity constantly. Users walk into dead zones, enter elevators, pass through tunnels. If your app silently fails, users lose data and trust. An honest "You're offline" banner is infinitely better than silent failure.

---

## Rule M7: Never Abuse Gradients on Mobile Surfaces

### WRONG

```tsx
// Every card and button has a gradient background
<LinearGradient colors={['#6366F1', '#8B5CF6', '#EC4899']} style={styles.card}>
  <Text style={{ color: 'white' }}>Trip #1234</Text>
</LinearGradient>
```

Multi-color gradients on every surface. Text readability suffers. On OLED screens, gradients show banding artifacts. The app looks like a crypto landing page.

### CORRECT

```tsx
// Solid surfaces with a single accent gradient used sparingly (header, hero)
<View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
  <Text style={{ color: theme.colors.onSurface }}>Trip #1234</Text>
</View>

// Gradient only on a single hero element, if at all:
<LinearGradient colors={['#4F46E5', '#6366F1']} style={styles.header}>
  <Text style={{ color: '#FFFFFF' }}>Dashboard</Text>
</LinearGradient>
```

### WHY

OLED screens (most modern phones) render gradients differently than LCD. Subtle gradients show visible color banding. Vibrant gradients drain battery (OLED pixels emit their own light — bright colors = more power). Use solid colors for surfaces and reserve gradients for a single hero element at most.

---

## Rule M8: Never Use alert() Dialogs for Everything

### WRONG

```tsx
// Every action confirmation is an alert dialog
Alert.alert('Confirm', 'Are you sure?', [
  { text: 'Cancel' },
  { text: 'OK', onPress: handleAction },
]);

// Used for: confirmations, selections, information, errors, everything
```

Alert dialogs interrupt the user's flow, require reading, and force a binary decision. Using them for everything creates alert fatigue — users start tapping "OK" without reading.

### CORRECT

```tsx
// Contextual UI instead of alerts:

// For confirmation: inline undo (swipe to delete → show undo toast)
Toast.show({ type: 'info', text1: 'Trip deleted', text2: 'Tap to undo', onPress: undoDelete });

// For selection: bottom sheet with options
bottomSheetRef.current?.present();

// For information: inline banner or callout within the screen
<Callout type="info" message="Your trip has been updated." />

// For destructive confirmation: action sheet (iOS) or bottom dialog (Android)
// Reserve Alert.alert for truly critical, irreversible actions only
```

### WHY

Alerts are the most disruptive UI pattern on mobile. They block the entire screen, require cognitive processing, and train users to dismiss without reading. Use contextual UI (toasts, inline messages, bottom sheets) for non-critical interactions. Reserve modal alerts for truly irreversible actions (delete account, discard unsaved changes).

---

## Rule M9: Never Use Horizontal Scrolling in Content Lists

### WRONG

```tsx
// A horizontally scrolling list of full cards in the main content area
<ScrollView horizontal>
  <TripCard trip={trips[0]} style={{ width: 300 }} />
  <TripCard trip={trips[1]} style={{ width: 300 }} />
  <TripCard trip={trips[2]} style={{ width: 300 }} />
</ScrollView>
```

Users must scroll horizontally to see content. This conflicts with vertical page scrolling and breaks one-handed use. Content is hidden off-screen with no indication of how many items exist.

### CORRECT

```tsx
// Vertical list: all content visible through natural vertical scroll
<FlatList
  data={trips}
  renderItem={({ item }) => <TripCard trip={item} />}
  keyExtractor={(item) => item.id}
/>

// Exception: horizontal scroll is OK for:
// - Image carousels with page dots
// - Category chips/filters (single row, not full cards)
// - Story-style avatars (like Instagram)
// Always show a partial next item to indicate more content exists (peek)
```

### WHY

Mobile screens are narrow. Horizontal scrolling hides content behind an invisible edge. Users do not discover horizontal scroll naturally — vertical is the primary axis. When horizontal scrolling is truly needed (carousels), always show a peek of the next item and add pagination dots.

---

## Rule M10: Never Test Only on Simulators

### WRONG

```
"Looks great on the iOS Simulator!"
→ Ships to App Store
→ Janky animations on iPhone SE
→ Overheating on older Android devices
→ Touch targets too small on small screens
→ Memory crashes on 3GB RAM Android phones
```

### CORRECT

```
Development: Simulator for rapid iteration
Pre-release testing: Real devices, minimum:
  - iPhone SE (smallest iOS screen, weakest chip in circulation)
  - iPhone 15/16 (current standard)
  - Pixel 7 or Samsung Galaxy A-series (mid-range Android)
  - iPad (if supporting tablets)
  - One device with max font size + VoiceOver enabled

Performance budget:
  - App launch < 2 seconds on mid-range Android
  - List scroll: 60fps (no dropped frames)
  - Memory < 200MB for typical usage
```

### WHY

Simulators run on your development machine's hardware (fast CPU, unlimited RAM, SSD storage). Real phones have thermal throttling, limited RAM, slow storage, and background processes competing for resources. An animation that runs at 60fps on the simulator may drop to 30fps on a real mid-range phone. Performance testing on real devices is not optional.

---

## Rule M11: Never Ignore the Android System Back Gesture

### WRONG

```tsx
// Custom back button that navigates back, but hardware/gesture back exits the app
// No BackHandler registered
// User swipes from the edge → app exits instead of going back in navigation
```

### CORRECT

```tsx
import { BackHandler } from 'react-native';

// React Navigation handles this automatically when properly configured.
// For custom screens, register a BackHandler:
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (canGoBack) {
      navigation.goBack();
      return true; // Prevents default (exit app)
    }
    return false; // Allows default (exit app) on root screen
  });
  return () => backHandler.remove();
}, [canGoBack]);
```

### WHY

Android users rely on the system back gesture (swipe from edge or hardware button) for ALL navigation. If pressing back exits your app instead of navigating to the previous screen, you have broken the most fundamental Android interaction pattern. This is the #1 reason for 1-star reviews from Android users.

---

## Rule M12: Never Use Web-Style Forms

### WRONG

```tsx
// Small inputs, no keyboard type, no auto-focus, no keyboard avoidance
<View>
  <TextInput placeholder="Email" style={{ height: 30, fontSize: 12, borderWidth: 1 }} />
  <TextInput placeholder="Phone" style={{ height: 30, fontSize: 12, borderWidth: 1 }} />
  <TextInput placeholder="Amount" style={{ height: 30, fontSize: 12, borderWidth: 1 }} />
</View>
// Keyboard covers the form. User cannot see what they are typing.
// No "Next" button to move between fields. No appropriate keyboard type.
```

### CORRECT

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <TextInput
      placeholder="Email"
      keyboardType="email-address"       // Shows @ and .com on keyboard
      autoCapitalize="none"
      autoComplete="email"                // Enables autofill
      textContentType="emailAddress"      // iOS autofill hint
      returnKeyType="next"                // Shows "Next" instead of "Return"
      onSubmitEditing={() => phoneRef.current?.focus()} // Auto-advance
      style={{ height: 48, fontSize: 16, padding: 12 }}
    />
    <TextInput
      ref={phoneRef}
      placeholder="Phone"
      keyboardType="phone-pad"            // Shows number pad
      autoComplete="tel"
      textContentType="telephoneNumber"
      returnKeyType="next"
      onSubmitEditing={() => amountRef.current?.focus()}
      style={{ height: 48, fontSize: 16, padding: 12 }}
    />
    <TextInput
      ref={amountRef}
      placeholder="Amount"
      keyboardType="decimal-pad"          // Shows decimal number pad
      returnKeyType="done"
      onSubmitEditing={handleSubmit}
      style={{ height: 48, fontSize: 16, padding: 12 }}
    />
  </ScrollView>
</KeyboardAvoidingView>
```

### WHY

Mobile forms are the most friction-filled interaction in any app. Every improvement matters: the right keyboard type saves 3 taps per field, auto-advance between fields saves users from hunting for the next input, keyboard avoidance prevents the "typing blind" problem. Web-style forms with tiny inputs and no keyboard intelligence feel like filling out a form on a broken website.

---

## Rule M13: Never Ignore System Dark Mode

### WRONG

```tsx
// App is always light theme regardless of system setting
const theme = lightTheme; // Hardcoded

// Or: custom dark mode toggle in settings, but ignores system preference
```

### CORRECT

```tsx
import { useColorScheme } from 'react-native';

function App() {
  const systemScheme = useColorScheme();
  const theme = systemScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="auto" />
      <AppNavigator />
    </ThemeProvider>
  );
}
```

### WHY

Users who enable system dark mode expect every app to follow it. A bright white app at 11 PM in bed is painful and damages trust. Both App Store review processes flag apps that ignore system appearance. See `dark-mode-mobile.md` for the full implementation guide.

---

## Rule M14: Never Ignore Keyboard Appearance

### WRONG

```tsx
// Input field at the bottom of the screen
// Keyboard opens → covers the input
// User cannot see what they are typing
// No way to dismiss the keyboard on Android (no "Done" button)
```

### CORRECT

```tsx
// 1. KeyboardAvoidingView pushes content above keyboard
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
    {/* Form content */}
  </ScrollView>
</KeyboardAvoidingView>

// 2. Dismiss keyboard on tap outside
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={{ flex: 1 }}>
    {/* Screen content */}
  </View>
</TouchableWithoutFeedback>

// 3. For chat/messaging UIs: use react-native-keyboard-controller
// for smooth keyboard animation syncing (iOS-style interactive dismiss)

// 4. Android: set windowSoftInputMode in AndroidManifest.xml
// android:windowSoftInputMode="adjustResize" for most screens
// android:windowSoftInputMode="adjustPan" for chat screens
```

### WHY

The software keyboard consumes 40-50% of the screen. Any input field below the midpoint of the screen WILL be covered. If users cannot see what they are typing, they make errors and get frustrated. Keyboard avoidance is not a nice-to-have — it is required for every screen with text input.

---

## Quick Reference — All 14 Rules

| # | Rule | Quick Test |
|---|------|-----------|
| M1 | No web-style dropdown selects | Are you using native pickers for date/time/selection? |
| M2 | Touch targets >= 44pt / 48dp | Can you comfortably tap every interactive element with your thumb? |
| M3 | Respect safe areas | Is content visible on iPhone with Dynamic Island? |
| M4 | Native scroll physics | Does scrolling bounce on iOS and glow on Android? |
| M5 | Loading states on slow networks | What does the screen show on 3G after 5 seconds? |
| M6 | Offline indicator | What happens when airplane mode is on? |
| M7 | No gradient abuse | Are surfaces solid colors with gradients limited to one hero? |
| M8 | No alert() for everything | Is the only modal alert for irreversible destructive actions? |
| M9 | No horizontal scroll for content lists | Is all important content accessible via vertical scroll? |
| M10 | Test on real devices | Has the app been tested on a mid-range Android phone? |
| M11 | Handle Android back gesture | Does back navigate within the app, not exit it? |
| M12 | Native-quality forms | Do inputs have correct keyboard types and auto-advance? |
| M13 | Respect system dark mode | Does the app follow the system light/dark preference? |
| M14 | Handle keyboard appearance | Is every input field visible when the keyboard is open? |

---

## Enforcement

Run this checklist before every release. Each violation is a bug, not a suggestion. Fix them before shipping.

For automated detection:
- **Touch targets:** Accessibility Inspector (Xcode) flags targets below 44pt. Android Lint checks 48dp minimum.
- **Safe areas:** Visual review on iPhone 15 Pro (Dynamic Island) and any Android with gesture navigation.
- **Dark mode:** Toggle system appearance while the app is running — every screen must adapt.
- **Keyboard:** Tap every input field and verify content stays visible.
- **Back gesture:** Navigate 3 levels deep on Android, then use system back — it should pop one level at a time.
- **Real device:** If you have not tested on a physical device this sprint, you have not tested.
