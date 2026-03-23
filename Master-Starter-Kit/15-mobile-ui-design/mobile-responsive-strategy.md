# Mobile Responsive Strategy — Phone, Tablet & Foldable

## The Problem

Mobile responsive is not the same as web responsive. On web, you have a continuous range of widths from 320px to 2560px. On mobile, you have discrete device classes with fundamentally different interaction models:

- **Phone (portrait):** One-handed, thumb navigation, stacked content, 375-430pt wide.
- **Phone (landscape):** Two-handed, wider but shorter, specific use cases (video, dashboards).
- **Tablet (portrait):** Two-handed, content can split into columns, 768-834pt wide.
- **Tablet (landscape):** Desktop-like width, master-detail layouts, 1024-1194pt wide.
- **Foldable (folded):** Narrow phone-like (outer screen), 280-400dp wide.
- **Foldable (unfolded):** Tablet-like, with a physical fold in the middle of the screen.

A single phone layout stretched to tablet width looks terrible. A tablet layout crammed into a phone is unusable. This guide gives you the strategy for each device class.

---

## Device Classes and Breakpoints

| Device Class | Width Range | Layout Strategy | Examples |
|-------------|-------------|-----------------|----------|
| Compact | < 600dp | Single column, stacked | iPhone, Pixel, Galaxy S |
| Medium | 600-839dp | Optional two-column, expanded content | iPad Mini, foldable (unfolded), small tablet |
| Expanded | 840dp+ | Two-column master-detail, side-by-side | iPad Pro, Galaxy Tab S, Pixel Tablet |

These match Android's WindowSizeClass and approximate iOS size classes.

---

## Per-Framework Implementation

### React Native

```tsx
import { useWindowDimensions, Platform } from 'react-native';

type DeviceClass = 'compact' | 'medium' | 'expanded';

function useDeviceClass(): DeviceClass {
  const { width } = useWindowDimensions();
  if (width >= 840) return 'expanded';
  if (width >= 600) return 'medium';
  return 'compact';
}

// iPad detection (useful for specific overrides):
const isTablet = Platform.isPad; // iOS only
// Cross-platform: use width breakpoint instead

// Usage in a layout:
function DashboardScreen() {
  const deviceClass = useDeviceClass();

  if (deviceClass === 'expanded') {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 320 }}>
          <SidebarList />
        </View>
        <View style={{ flex: 1 }}>
          <DetailPanel />
        </View>
      </View>
    );
  }

  // Compact and medium: stacked layout
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={SidebarList} />
      <Stack.Screen name="Detail" component={DetailPanel} />
    </Stack.Navigator>
  );
}
```

**Responsive utilities for React Native:**

```tsx
// Responsive value helper:
function responsive<T>(compact: T, medium: T, expanded: T): T {
  const deviceClass = useDeviceClass();
  switch (deviceClass) {
    case 'expanded': return expanded;
    case 'medium': return medium;
    default: return compact;
  }
}

// Usage:
const columns = responsive(1, 2, 3);
const padding = responsive(16, 24, 32);
```

### Flutter

```dart
// LayoutBuilder — responds to parent constraints:
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth >= 840) {
      return ExpandedLayout();   // Master-detail
    } else if (constraints.maxWidth >= 600) {
      return MediumLayout();     // Adaptive
    } else {
      return CompactLayout();    // Phone
    }
  },
);

// MediaQuery — responds to screen dimensions:
final screenWidth = MediaQuery.of(context).size.width;
final isTablet = screenWidth >= 600;

// Responsive package (flutter_screenutil):
import 'package:flutter_screenutil/flutter_screenutil.dart';

ScreenUtilInit(
  designSize: Size(375, 812), // iPhone 14 as base
  builder: (context, child) => MaterialApp(home: HomeScreen()),
);

// Then use responsive values:
Container(
  width: 200.w,    // Scales proportionally to screen width
  height: 100.h,   // Scales proportionally to screen height
  padding: EdgeInsets.all(16.r), // Scales proportionally
  child: Text('Hello', style: TextStyle(fontSize: 16.sp)), // Scales with text
);
```

### Native iOS

iOS uses **size classes** — a compact/regular system for width and height:

| Width | Height | Device Configuration |
|-------|--------|---------------------|
| Compact | Regular | iPhone portrait |
| Compact | Compact | iPhone landscape |
| Regular | Regular | iPad (all orientations), iPhone Max landscape |
| Regular | Compact | Rare (some iPad multitasking) |

```swift
// SwiftUI — use horizontalSizeClass:
@Environment(\.horizontalSizeClass) var horizontalSizeClass

var body: some View {
    if horizontalSizeClass == .regular {
        // iPad / wide layout: side-by-side
        NavigationSplitView {
            SidebarList(selection: $selection)
        } detail: {
            DetailView(item: selection)
        }
    } else {
        // iPhone: stacked navigation
        NavigationStack {
            SidebarList(selection: $selection)
                .navigationDestination(for: Item.self) { item in
                    DetailView(item: item)
                }
        }
    }
}

// ViewThatFits — automatically picks the layout that fits:
ViewThatFits {
    HorizontalLayout() // Preferred if it fits
    VerticalLayout()   // Fallback
}

// UIKit — override traitCollectionDidChange:
override func traitCollectionDidChange(_ previous: UITraitCollection?) {
    super.traitCollectionDidChange(previous)
    if traitCollection.horizontalSizeClass == .regular {
        showSplitView()
    } else {
        showStackView()
    }
}
```

**iPadOS Multitasking:**

| Mode | Your App Width | What to Do |
|------|---------------|------------|
| Full screen | Full iPad width | Expanded layout |
| Split View (50/50) | Half iPad width | May drop to compact |
| Split View (66/33) | 2/3 or 1/3 width | Adaptive between medium and compact |
| Slide Over | iPhone-width overlay | Compact layout |

Your app MUST handle all of these. Use size classes, not device detection.

### Native Android

```kotlin
// WindowSizeClass (Jetpack library):
val windowSizeClass = calculateWindowSizeClass(this)

when (windowSizeClass.widthSizeClass) {
    WindowWidthSizeClass.Compact -> CompactLayout()
    WindowWidthSizeClass.Medium -> MediumLayout()
    WindowWidthSizeClass.Expanded -> ExpandedLayout()
}

// Resource qualifiers (for XML layouts):
// res/layout/          → default (compact)
// res/layout-sw600dp/  → medium (smallest width 600dp = tablet)
// res/layout-sw840dp/  → expanded
// res/layout-land/     → landscape variant

// Configuration change detection:
val configuration = LocalConfiguration.current
val screenWidthDp = configuration.screenWidthDp
val isLandscape = configuration.orientation == Configuration.ORIENTATION_LANDSCAPE
```

---

## Orientation Handling

### When to Lock Orientation

| Screen Type | Orientation | Reason |
|-------------|------------|--------|
| Most screens | Portrait only (phone), adaptive (tablet) | Phone landscape is awkward for most content |
| Video player | Landscape when playing, portrait otherwise | Video is best in landscape |
| Camera | Adaptive | Matches how user holds the device |
| Charts/dashboards | Adaptive | More data visible in landscape |
| Forms | Portrait only | Keyboard + form = no room in landscape |
| Games | Usually landscape | More screen real estate |

### Per-Framework Implementation

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

**React Native (Expo):**

```json
// app.json — global lock:
{
  "expo": {
    "orientation": "portrait" // "portrait" | "landscape" | "default" (adaptive)
  }
}

// Per-screen lock (expo-screen-orientation):
import * as ScreenOrientation from 'expo-screen-orientation';

// Lock to landscape for video:
useEffect(() => {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  return () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };
}, []);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

**Flutter:**

```dart
// Global lock:
SystemChrome.setPreferredOrientations([
  DeviceOrientation.portraitUp,
]);

// Per-screen:
@override
void initState() {
  super.initState();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
}

@override
void dispose() {
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);
  super.dispose();
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

**iOS:**

```swift
// Info.plist: Set supported orientations per device
// iPhone: Portrait only (unless specific screens need landscape)
// iPad: All orientations

// Per-screen in UIKit:
override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    return .landscape // For video player
}

// SwiftUI (iOS 16+):
// Use AppDelegate or SceneDelegate to control orientation
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

**Android:**

```xml
<!-- AndroidManifest.xml — per-activity: -->
<activity
    android:name=".VideoPlayerActivity"
    android:screenOrientation="landscape" />

<!-- Adaptive (default): -->
<activity
    android:name=".MainActivity"
    android:screenOrientation="unspecified" />
```

```kotlin
// Programmatic:
requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
// Reset:
requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
```

<!-- ENDIF -->

---

## Split View Patterns

The most important responsive pattern: **master-detail**.

### Phone: Stack Navigation

```
┌──────────────┐     ┌──────────────┐
│              │     │  ← Detail    │
│   List       │     │              │
│   Item 1     │ ──> │  Item 1      │
│   Item 2     │     │  Content     │
│   Item 3     │     │              │
│              │     │              │
└──────────────┘     └──────────────┘
  List Screen          Detail Screen
  (full width)         (full width, pushed)
```

User taps an item, detail screen pushes onto the stack. Back gesture returns to list.

### Tablet: Side-by-Side

```
┌────────────────────────────────────┐
│  List          │  Detail           │
│                │                   │
│  Item 1 [sel]  │  Item 1           │
│  Item 2        │  Full content     │
│  Item 3        │  with more space  │
│                │                   │
│  320pt fixed   │  flex (remaining) │
└────────────────────────────────────┘
```

List stays visible on the left. Tapping an item updates the detail pane on the right. No navigation push.

### Implementation

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
function MasterDetailLayout() {
  const deviceClass = useDeviceClass();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (deviceClass === 'expanded') {
    // Tablet: side-by-side
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: 320, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
          <ItemList selectedId={selectedId} onSelect={setSelectedId} />
        </View>
        <View style={{ flex: 1 }}>
          {selectedId ? (
            <ItemDetail id={selectedId} />
          ) : (
            <EmptyState title="Select an item" message="Choose an item from the list to view details." />
          )}
        </View>
      </View>
    );
  }

  // Phone: stack navigation (handled by React Navigation)
  return null; // React Navigation stack handles this case
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth >= 840) {
      // Tablet: side-by-side
      return Row(
        children: [
          SizedBox(
            width: 320,
            child: ItemList(
              selectedId: selectedId,
              onSelect: (id) => setState(() => selectedId = id),
            ),
          ),
          VerticalDivider(width: 1),
          Expanded(
            child: selectedId != null
              ? ItemDetail(id: selectedId!)
              : Center(child: Text('Select an item')),
          ),
        ],
      );
    }

    // Phone: push navigation
    return ItemList(
      onSelect: (id) => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => ItemDetail(id: id)),
      ),
    );
  },
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI — NavigationSplitView handles this automatically:
NavigationSplitView {
    List(items, selection: $selectedItem) { item in
        NavigationLink(value: item) {
            ItemRow(item: item)
        }
    }
    .navigationTitle("Items")
} detail: {
    if let item = selectedItem {
        ItemDetail(item: item)
    } else {
        ContentUnavailableView("Select an Item", systemImage: "list.bullet")
    }
}
// On iPhone: renders as NavigationStack (push/pop)
// On iPad: renders as split view (sidebar + detail)
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: ListDetailPaneScaffold (Material 3 Adaptive)
val navigator = rememberListDetailPaneScaffoldNavigator<Item>()

ListDetailPaneScaffold(
    directive = navigator.scaffoldDirective,
    value = navigator.scaffoldValue,
    listPane = {
        ItemList(
            items = items,
            onSelect = { item ->
                navigator.navigateTo(ListDetailPaneScaffoldRole.Detail, item)
            },
        )
    },
    detailPane = {
        navigator.currentDestination?.content?.let { item ->
            ItemDetail(item = item)
        }
    },
)
// Automatically switches between stacked (phone) and side-by-side (tablet)
```

<!-- ENDIF -->

---

## Foldable Device Support

Foldable devices (Samsung Galaxy Fold, Google Pixel Fold) have two states:

| State | Behavior | Your Response |
|-------|----------|---------------|
| Folded (outer screen) | Narrow phone (280-400dp) | Compact layout. Verify nothing clips. |
| Unfolded (inner screen) | Tablet-like (700-900dp) | Medium/expanded layout. Content spans full width. |
| Tabletop posture | Folded at ~115 degrees, bottom half flat | Split content: video on top, controls on bottom. |

### Detection

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// React Native: No first-party API. Use react-native-device-info:
import DeviceInfo from 'react-native-device-info';

// Or use window dimensions — foldable unfolded width > 600dp:
const { width } = useWindowDimensions();
const isFoldableUnfolded = width >= 600 && width <= 900; // Heuristic
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
// Flutter: Use MediaQuery + hinge detection
import 'package:dual_screen/dual_screen.dart';

// Detect hinge:
final hinge = MediaQuery.of(context).displayFeatures
    .whereType<DisplayFeature>()
    .where((f) => f.type == DisplayFeatureType.hinge)
    .firstOrNull;

if (hinge != null) {
  // Foldable: place content on either side of the hinge
  return TwoPane(
    startPane: ListPane(),
    endPane: DetailPane(),
    panePriority: TwoPanePriority.both,
  );
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: Jetpack WindowManager
val windowLayoutInfo = WindowInfoTracker.getOrCreate(context)
    .windowLayoutInfo(context)
    .collectAsState()

val foldingFeature = windowLayoutInfo.value.displayFeatures
    .filterIsInstance<FoldingFeature>()
    .firstOrNull()

when {
    foldingFeature == null -> {
        // Not a foldable — normal layout
        RegularLayout()
    }
    foldingFeature.state == FoldingFeature.State.HALF_OPENED -> {
        // Tabletop mode: split at fold
        if (foldingFeature.orientation == FoldingFeature.Orientation.HORIZONTAL) {
            Column {
                Box(modifier = Modifier.weight(1f)) { TopContent() }  // Above fold
                Box(modifier = Modifier.weight(1f)) { BottomControls() } // Below fold
            }
        }
    }
    foldingFeature.state == FoldingFeature.State.FLAT -> {
        // Fully unfolded: use tablet layout
        ExpandedLayout()
    }
}
```

<!-- ENDIF -->

### Foldable Layout Rules

1. **Never place interactive elements directly on the fold/hinge.** Users cannot tap accurately on the physical crease.
2. **Content should flow naturally across the fold** unless the device is in tabletop posture.
3. **Test on Samsung Remote Test Lab** (free) or the Android Emulator foldable configuration.
4. **Outer screen (folded)** is a real use case — users check notifications, quick info without unfolding. Your compact layout must work at 280dp width.

---

## Responsive Navigation

Navigation structure should adapt to device class:

| Device Class | Primary Nav | Secondary Nav |
|-------------|-------------|---------------|
| Compact (phone) | Bottom tab bar | Stack push |
| Medium (small tablet) | Bottom tab bar or navigation rail | Stack push or split view |
| Expanded (large tablet) | Navigation rail or permanent drawer | Split view (master-detail) |

```
Phone:                    Tablet:
┌──────────────┐          ┌────┬─────────────────────┐
│              │          │    │                     │
│   Content    │          │ R  │    Content           │
│              │          │ A  │                     │
│              │          │ I  │                     │
│              │          │ L  │                     │
├──────────────┤          │    │                     │
│ Tab1 Tab2 T3 │          └────┴─────────────────────┘
└──────────────┘
```

---

## Checklist

- [ ] App renders correctly on compact (phone portrait) screens
- [ ] App renders correctly on expanded (tablet) screens
- [ ] Master-detail pattern implemented for list-to-detail flows
- [ ] Navigation adapts: tab bar on phone, navigation rail on tablet
- [ ] Orientation is locked where appropriate (forms = portrait, video = landscape)
- [ ] Layout uses size classes / breakpoints, not device detection
- [ ] iPadOS multitasking tested (Split View, Slide Over)
- [ ] Foldable behavior tested (if targeting Android)
- [ ] Outer screen of foldable devices works at narrow widths
- [ ] No content is clipped or inaccessible at any supported width
