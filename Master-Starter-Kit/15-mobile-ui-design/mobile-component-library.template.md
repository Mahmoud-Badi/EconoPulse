# Mobile Component Library

> **Project:** {{PROJECT_NAME}}
> **Framework:** {{MOBILE_FRAMEWORK}}
> **Last Updated:** {{DATE}}

## How to Use This Template

This is your mobile component inventory. Each component lists the recommended implementation per framework, key props/configuration, and platform-specific behavior. When you build a component, check the entry here first — it prevents reinventing the wheel and ensures platform-native feel.

**Conventions:**
- Always use the platform-native component where one exists.
- Custom components must still meet touch target minimums (44pt iOS / 48dp Android).
- Every interactive component must include an accessibility label.
- Loading and error states are not optional — define them for every component.

---

## 1. Button

The most used component. Must feel native on each platform — bounce animation on iOS, ripple on Android.

**Sizes:** Small (32pt/36dp), Medium (44pt/48dp), Large (50pt/56dp)
**States:** Default, Pressed, Disabled, Loading

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

**React Native:**

```tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', isLoading, disabled }: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </Pressable>
  );
}
```

**Library alternative:** `react-native-paper` Button, or build custom with `Pressable`.

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

**Flutter:**

```dart
// Use Material 3 buttons — they handle ripple, elevation, and state automatically.
ElevatedButton(
  onPressed: isLoading ? null : onPressed,
  child: isLoading
    ? SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
    : Text(title),
);

// Variants:
// ElevatedButton — primary action (filled + shadow)
// FilledButton — primary action (filled, no shadow)
// FilledButton.tonal — secondary action
// OutlinedButton — tertiary action
// TextButton — lowest emphasis
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

**iOS (SwiftUI):**

```swift
Button(action: { onPress() }) {
    if isLoading {
        ProgressView()
    } else {
        Text(title)
    }
}
.buttonStyle(.borderedProminent) // Primary
// .borderedProminent — filled, primary color
// .bordered — tinted background
// .borderless — text only
// .plain — no chrome
.controlSize(.large) // .mini, .small, .regular, .large
.disabled(isDisabled || isLoading)
.sensoryFeedback(.impact(flexibility: .solid, intensity: 0.5), trigger: tapCount)
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

**Android (Compose):**

```kotlin
Button(
    onClick = { onPress() },
    enabled = !isLoading && !isDisabled,
    modifier = Modifier.heightIn(min = 48.dp),
) {
    if (isLoading) {
        CircularProgressIndicator(
            modifier = Modifier.size(20.dp),
            strokeWidth = 2.dp,
            color = MaterialTheme.colorScheme.onPrimary,
        )
    } else {
        Text(title)
    }
}

// Variants: Button, FilledTonalButton, OutlinedButton, TextButton, ElevatedButton
```

<!-- ENDIF -->

---

## 2. Card

Container for grouped content. Elevation differs between platforms — iOS uses shadows, Android uses surface tint.

**Behavior:** Optional press animation (scale down 0.97 on press), optional onPress handler.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
import { Pressable, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => { if (onPress) scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      style={[styles.card, animatedStyle]}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    // iOS shadow:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android elevation:
    elevation: 2,
  },
});
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
Card(
  elevation: 1, // Material 3 surface tint, not drop shadow
  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  clipBehavior: Clip.antiAlias,
  child: InkWell(
    onTap: onPress,
    borderRadius: BorderRadius.circular(12),
    child: Padding(
      padding: EdgeInsets.all(16),
      child: content,
    ),
  ),
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI: Use GroupBox or custom card
VStack(alignment: .leading, spacing: 8) {
    content
}
.padding(16)
.background(.background)
.clipShape(RoundedRectangle(cornerRadius: 12))
.shadow(color: .black.opacity(0.08), radius: 8, y: 2)
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
ElevatedCard(
    onClick = { onPress() },
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(12.dp),
    elevation = CardDefaults.elevatedCardElevation(defaultElevation = 1.dp),
) {
    Column(modifier = Modifier.padding(16.dp)) {
        content()
    }
}
```

<!-- ENDIF -->

---

## 3. List / FlatList

The backbone of mobile UI. Must support infinite scroll, pull-to-refresh, swipe actions, and section headers.

**Critical rules:**
- Always use a virtualized list (FlatList, not ScrollView with map). Non-virtualized lists kill performance.
- Implement `keyExtractor` (RN) or `key` (Flutter) for every list. Missing keys cause render bugs.
- Pull-to-refresh is expected on every data list. If data can change, add it.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
import { FlatList, RefreshControl } from 'react-native';

<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ListItem item={item} />}
  // Pull to refresh:
  refreshControl={
    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
  }
  // Infinite scroll:
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={isLoadingMore ? <ActivityIndicator /> : null}
  // Empty state:
  ListEmptyComponent={<EmptyState message="No items yet" />}
  // Section headers: use SectionList instead of FlatList
  // Swipe actions: use react-native-gesture-handler Swipeable
/>
```

**Library:** `@shopify/flash-list` for 5x faster list performance (drop-in FlatList replacement).

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
RefreshIndicator(
  onRefresh: handleRefresh,
  child: ListView.builder(
    itemCount: items.length + (isLoadingMore ? 1 : 0),
    itemBuilder: (context, index) {
      if (index == items.length) return CircularProgressIndicator();
      return Dismissible(
        key: Key(items[index].id),
        background: Container(color: Colors.red, child: Icon(Icons.delete)),
        onDismissed: (direction) => deleteItem(items[index]),
        child: ListTile(title: Text(items[index].title)),
      );
    },
  ),
);

// For section headers: use sliver_tools or grouped_list package
// For high performance: use CustomScrollView with SliverList
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI
List {
    ForEach(items) { item in
        ListRow(item: item)
            .swipeActions(edge: .trailing) {
                Button(role: .destructive) { delete(item) } label: {
                    Label("Delete", systemImage: "trash")
                }
            }
            .swipeActions(edge: .leading) {
                Button { archive(item) } label: {
                    Label("Archive", systemImage: "archivebox")
                }
                .tint(.blue)
            }
    }
}
.refreshable { await refresh() }
.searchable(text: $searchText)
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
val lazyListState = rememberLazyListState()
val pullRefreshState = rememberPullToRefreshState()

PullToRefreshBox(
    isRefreshing = isRefreshing,
    onRefresh = { viewModel.refresh() },
    state = pullRefreshState,
) {
    LazyColumn(state = lazyListState) {
        items(items, key = { it.id }) { item ->
            SwipeToDismissBox(
                state = rememberSwipeToDismissBoxState(),
                backgroundContent = { DeleteBackground() },
            ) {
                ListItem(
                    headlineContent = { Text(item.title) },
                    supportingContent = { Text(item.subtitle) },
                )
            }
        }
        if (isLoadingMore) {
            item { CircularProgressIndicator(modifier = Modifier.padding(16.dp)) }
        }
    }
}

// Detect end of list for pagination:
LaunchedEffect(lazyListState) {
    snapshotFlow { lazyListState.layoutInfo.visibleItemsInfo.lastOrNull()?.index }
        .collect { lastIndex ->
            if (lastIndex == items.size - 1) viewModel.loadMore()
        }
}
```

<!-- ENDIF -->

---

## 4. Bottom Sheet

The most important mobile-specific component. Replaces web modals, dropdowns, and side panels.

**Types:** Modal (blocks background), Persistent (coexists with content)
**Features:** Snap points (collapsed, half, expanded), gesture handle, dismiss on swipe down

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// Library: @gorhom/bottom-sheet (best in class for RN)
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

<BottomSheet
  ref={bottomSheetRef}
  index={-1} // Start closed
  snapPoints={snapPoints}
  enablePanDownToClose
  backgroundStyle={{ borderRadius: 24 }}
  handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
>
  <BottomSheetView>
    {content}
  </BottomSheetView>
</BottomSheet>
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
showModalBottomSheet(
  context: context,
  isScrollControlled: true, // Allows custom height
  useSafeArea: true,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
  ),
  builder: (context) => DraggableScrollableSheet(
    initialChildSize: 0.5,
    minChildSize: 0.25,
    maxChildSize: 0.9,
    expand: false,
    builder: (context, scrollController) => ListView(
      controller: scrollController,
      children: [
        // Drag handle
        Center(
          child: Container(
            width: 40, height: 4, margin: EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ),
        ...content,
      ],
    ),
  ),
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI (iOS 16+)
.sheet(isPresented: $showSheet) {
    SheetContent()
        .presentationDetents([.medium, .large, .fraction(0.25)])
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(24)
}

// UIKit
let vc = SheetViewController()
if let sheet = vc.sheetPresentationController {
    sheet.detents = [.medium(), .large(), .custom { _ in 200 }]
    sheet.prefersGrabberVisible = true
    sheet.preferredCornerRadius = 24
}
present(vc, animated: true)
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose Material 3
val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = false)

ModalBottomSheet(
    onDismissRequest = { showSheet = false },
    sheetState = sheetState,
    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
    dragHandle = { BottomSheetDefaults.DragHandle() },
) {
    Column(modifier = Modifier.padding(16.dp)) {
        content()
    }
}
```

<!-- ENDIF -->

---

## 5. Action Sheet / Bottom Dialog

Platform-native action menus. Always use the system component — custom implementations feel off.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
import { ActionSheetIOS, Platform } from 'react-native';

// iOS: native ActionSheet
if (Platform.OS === 'ios') {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Delete', 'Archive', 'Cancel'],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 2,
      title: 'Choose an action',
    },
    (buttonIndex) => { /* handle */ }
  );
}

// Android: use @gorhom/bottom-sheet with action list, or react-native-paper Menu
// Cross-platform: @expo/react-native-action-sheet
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
// iOS-style
showCupertinoModalPopup(
  context: context,
  builder: (context) => CupertinoActionSheet(
    title: Text('Choose an action'),
    actions: [
      CupertinoActionSheetAction(
        isDestructiveAction: true,
        onPressed: () => delete(),
        child: Text('Delete'),
      ),
      CupertinoActionSheetAction(
        onPressed: () => archive(),
        child: Text('Archive'),
      ),
    ],
    cancelButton: CupertinoActionSheetAction(
      onPressed: () => Navigator.pop(context),
      child: Text('Cancel'),
    ),
  ),
);

// Platform-adaptive: use showAdaptiveActionSheet or check Platform.isIOS
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI
.confirmationDialog("Choose an action", isPresented: $showDialog) {
    Button("Delete", role: .destructive) { delete() }
    Button("Archive") { archive() }
    Button("Cancel", role: .cancel) { }
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: ModalBottomSheet with list items
ModalBottomSheet(onDismissRequest = { dismiss() }) {
    ListItem(
        headlineContent = { Text("Delete") },
        leadingContent = { Icon(Icons.Default.Delete, tint = MaterialTheme.colorScheme.error) },
        modifier = Modifier.clickable { delete() },
    )
    ListItem(
        headlineContent = { Text("Archive") },
        leadingContent = { Icon(Icons.Default.Archive) },
        modifier = Modifier.clickable { archive() },
    )
}
```

<!-- ENDIF -->

---

## 6. Tab Bar

Primary navigation component. Platform conventions are strict — follow them exactly.

| Rule | iOS | Android |
|------|-----|---------|
| Max items | 5 | 5 |
| Labels | Always visible | Always visible |
| Active indicator | Filled icon + tint | Filled icon + pill indicator |
| Badge | Red circle with count | Red dot or count |
| Hide on scroll | Optional | Optional (via `hideOnScroll`) |

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// Library: @react-navigation/bottom-tabs
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      const iconName = focused ? icons[route.name].filled : icons[route.name].outline;
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: { paddingBottom: insets.bottom },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Search" component={SearchScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
// Material 3 NavigationBar
NavigationBar(
  selectedIndex: currentIndex,
  onDestinationSelected: (index) => setState(() => currentIndex = index),
  destinations: [
    NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: 'Home',
    ),
    NavigationDestination(
      icon: Badge(child: Icon(Icons.notifications_outlined)),
      selectedIcon: Badge(child: Icon(Icons.notifications)),
      label: 'Alerts',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: 'Profile',
    ),
  ],
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI
TabView(selection: $selectedTab) {
    HomeView()
        .tabItem { Label("Home", systemImage: "house") }
        .tag(Tab.home)
        .badge(3)

    SearchView()
        .tabItem { Label("Search", systemImage: "magnifyingglass") }
        .tag(Tab.search)

    ProfileView()
        .tabItem { Label("Profile", systemImage: "person") }
        .tag(Tab.profile)
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: NavigationBar (Material 3)
NavigationBar {
    items.forEachIndexed { index, item ->
        NavigationBarItem(
            icon = {
                BadgedBox(badge = { if (item.badgeCount > 0) Badge { Text("${item.badgeCount}") } }) {
                    Icon(
                        if (selectedItem == index) item.selectedIcon else item.unselectedIcon,
                        contentDescription = item.label,
                    )
                }
            },
            label = { Text(item.label) },
            selected = selectedItem == index,
            onClick = { selectedItem = index },
        )
    }
}
```

<!-- ENDIF -->

---

## 7. Search Bar

Platform-native search bar with cancel button (iOS) and voice input (Android).

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// Option 1: React Navigation header search
// Option 2: Custom with TextInput
<View style={styles.searchContainer}>
  <Ionicons name="search" size={20} color="#9CA3AF" />
  <TextInput
    placeholder="Search..."
    value={query}
    onChangeText={setQuery}
    style={styles.searchInput}
    returnKeyType="search"
    autoCorrect={false}
    clearButtonMode="while-editing" // iOS only
    accessibilityLabel="Search"
  />
  {query.length > 0 && (
    <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search">
      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
    </Pressable>
  )}
</View>
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
// Material 3 SearchBar
SearchAnchor(
  builder: (context, controller) {
    return SearchBar(
      controller: controller,
      hintText: 'Search...',
      leading: Icon(Icons.search),
      trailing: [
        if (controller.text.isNotEmpty)
          IconButton(icon: Icon(Icons.clear), onPressed: () => controller.clear()),
      ],
      onTap: () => controller.openView(),
    );
  },
  suggestionsBuilder: (context, controller) {
    return suggestions.map((s) => ListTile(title: Text(s), onTap: () => select(s)));
  },
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI: .searchable modifier
NavigationStack {
    List(filteredItems) { item in
        ItemRow(item: item)
    }
    .searchable(text: $searchText, prompt: "Search items")
    .searchSuggestions {
        ForEach(suggestions) { suggestion in
            Text(suggestion.title).searchCompletion(suggestion.title)
        }
    }
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: SearchBar (Material 3)
var active by remember { mutableStateOf(false) }

SearchBar(
    query = query,
    onQueryChange = { query = it },
    onSearch = { active = false },
    active = active,
    onActiveChange = { active = it },
    placeholder = { Text("Search...") },
    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
    trailingIcon = {
        if (query.isNotEmpty()) {
            IconButton(onClick = { query = "" }) {
                Icon(Icons.Default.Clear, contentDescription = "Clear")
            }
        }
    },
) {
    suggestions.forEach { suggestion ->
        ListItem(
            headlineContent = { Text(suggestion) },
            modifier = Modifier.clickable { query = suggestion; active = false },
        )
    }
}
```

<!-- ENDIF -->

---

## 8. Pull-to-Refresh

Expected on every screen that displays server data. Use the platform-native indicator.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
<FlatList
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      tintColor={theme.colors.primary} // iOS spinner color
      colors={[theme.colors.primary]}  // Android spinner colors
    />
  }
  data={data}
  renderItem={renderItem}
/>
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
RefreshIndicator(
  onRefresh: () async { await viewModel.refresh(); },
  color: Theme.of(context).colorScheme.primary,
  child: ListView.builder(
    physics: AlwaysScrollableScrollPhysics(), // Enables pull even when content is short
    itemCount: items.length,
    itemBuilder: (context, index) => ItemTile(items[index]),
  ),
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
List(items) { item in
    ItemRow(item: item)
}
.refreshable {
    await viewModel.refresh()
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
PullToRefreshBox(
    isRefreshing = isRefreshing,
    onRefresh = { viewModel.refresh() },
) {
    LazyColumn { items(data) { item -> ItemRow(item) } }
}
```

<!-- ENDIF -->

---

## 9. Swipe Actions

Trailing swipe for destructive actions (delete), leading swipe for constructive actions (archive, pin).

**Rules:**
- Red for destructive (delete). Blue for constructive (archive). Green for positive (complete).
- Threshold: 40% of row width to trigger the action. Below that, snap back.
- Always confirm destructive swipes with haptic feedback.
- Show undo toast/snackbar after destructive swipe actions.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// Library: react-native-gesture-handler Swipeable, or react-native-reanimated swipe
import { Swipeable } from 'react-native-gesture-handler';

function SwipeableRow({ children, onDelete, onArchive }) {
  const renderRightActions = () => (
    <Pressable onPress={onDelete} style={styles.deleteAction}>
      <Ionicons name="trash" size={24} color="#fff" />
      <Text style={styles.actionText}>Delete</Text>
    </Pressable>
  );

  const renderLeftActions = () => (
    <Pressable onPress={onArchive} style={styles.archiveAction}>
      <Ionicons name="archive" size={24} color="#fff" />
      <Text style={styles.actionText}>Archive</Text>
    </Pressable>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') onDelete();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }}
    >
      {children}
    </Swipeable>
  );
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
Dismissible(
  key: Key(item.id),
  background: Container(
    color: Colors.blue,
    alignment: Alignment.centerLeft,
    padding: EdgeInsets.only(left: 16),
    child: Icon(Icons.archive, color: Colors.white),
  ),
  secondaryBackground: Container(
    color: Colors.red,
    alignment: Alignment.centerRight,
    padding: EdgeInsets.only(right: 16),
    child: Icon(Icons.delete, color: Colors.white),
  ),
  confirmDismiss: (direction) async {
    if (direction == DismissDirection.endToStart) {
      return await showDeleteConfirmation(context);
    }
    return true;
  },
  onDismissed: (direction) {
    if (direction == DismissDirection.endToStart) deleteItem(item);
    if (direction == DismissDirection.startToEnd) archiveItem(item);
  },
  child: ListTile(title: Text(item.title)),
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
ForEach(items) { item in
    ItemRow(item: item)
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button(role: .destructive) { delete(item) } label: {
                Label("Delete", systemImage: "trash")
            }
        }
        .swipeActions(edge: .leading, allowsFullSwipe: true) {
            Button { archive(item) } label: {
                Label("Archive", systemImage: "archivebox")
            }
            .tint(.blue)
        }
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
SwipeToDismissBox(
    state = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            when (value) {
                SwipeToDismissBoxValue.EndToStart -> { deleteItem(item); true }
                SwipeToDismissBoxValue.StartToEnd -> { archiveItem(item); true }
                else -> false
            }
        }
    ),
    backgroundContent = {
        // Render red/blue background based on swipe direction
        SwipeBackground(dismissState)
    },
) {
    ListItem(headlineContent = { Text(item.title) })
}
```

<!-- ENDIF -->

---

## 10. Loading Indicators

Three patterns for different scenarios: skeleton screens, shimmer effect, and activity indicator.

| Pattern | When to Use |
|---------|-------------|
| Skeleton screen | Initial page load — shows content shape before data arrives |
| Shimmer effect | Applied to skeleton to show progress (moving highlight) |
| Activity indicator | Inline loading (button, pull-to-refresh, load-more) |

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// Skeleton with shimmer: use react-native-skeleton-placeholder
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function CardSkeleton() {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item width={48} height={48} borderRadius={24} />
        <SkeletonPlaceholder.Item marginLeft={12}>
          <SkeletonPlaceholder.Item width={120} height={16} />
          <SkeletonPlaceholder.Item width={80} height={12} marginTop={6} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}

// Activity indicator:
import { ActivityIndicator } from 'react-native';
<ActivityIndicator size="large" color={theme.colors.primary} />
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
// Skeleton: use shimmer package
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: Column(children: [
    Container(width: 48, height: 48, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white)),
    SizedBox(height: 8),
    Container(width: 120, height: 16, color: Colors.white),
  ]),
);

// Activity indicator:
CircularProgressIndicator()
// Linear:
LinearProgressIndicator()
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI shimmer modifier (custom or via package)
VStack(alignment: .leading) {
    RoundedRectangle(cornerRadius: 8)
        .fill(Color.gray.opacity(0.3))
        .frame(width: 120, height: 16)
    RoundedRectangle(cornerRadius: 6)
        .fill(Color.gray.opacity(0.2))
        .frame(width: 80, height: 12)
}
.redacted(reason: .placeholder) // Built-in redaction
.shimmering() // Requires shimmer package or custom ViewModifier

// Activity indicator:
ProgressView()
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: Placeholder modifier (accompanist or custom)
// Or shimmer with Modifier.shimmer()

// Activity indicator:
CircularProgressIndicator(
    modifier = Modifier.size(48.dp),
    color = MaterialTheme.colorScheme.primary,
)
```

<!-- ENDIF -->

---

## 11. Toast / Snackbar

Brief messages at the bottom of the screen. For feedback after actions (saved, deleted, error).

**Rules:**
- Position: bottom, above tab bar, respecting safe area.
- Duration: 3-4 seconds for info, 5+ seconds if there is an action button.
- Queue: if a new toast fires while one is showing, queue it (do not stack).
- Action button: "Undo" for destructive actions, "Retry" for errors.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
// Library: react-native-toast-message (best DX) or burnt (native toasts)
import Toast from 'react-native-toast-message';

// Show:
Toast.show({
  type: 'success', // 'success' | 'error' | 'info'
  text1: 'Item deleted',
  text2: 'Tap to undo',
  position: 'bottom',
  visibilityTime: 4000,
  onPress: () => undoDelete(),
});

// Configure in App root:
<Toast config={toastConfig} bottomOffset={insets.bottom + 60} />
```

For truly native toasts, use `burnt` (Expo-compatible): `Burnt.toast({ title: 'Saved' })`.

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: Text('Item deleted'),
    action: SnackBarAction(
      label: 'UNDO',
      onPressed: () => undoDelete(),
    ),
    duration: Duration(seconds: 4),
    behavior: SnackBarBehavior.floating,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  ),
);
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// No system snackbar on iOS. Options:
// 1. SPIndicator (native HUD style, like AirPods connected)
// 2. SwiftMessages (customizable)
// 3. Custom toast view with .transition(.move(edge: .bottom))

// iOS convention: use the system HUD for success feedback,
// or a banner at the top for errors. Avoid Android-style bottom snackbars.
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
// Compose: Snackbar via Scaffold
val snackbarHostState = remember { SnackbarHostState() }

Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) {
    // Trigger:
    LaunchedEffect(deleteEvent) {
        val result = snackbarHostState.showSnackbar(
            message = "Item deleted",
            actionLabel = "Undo",
            duration = SnackbarDuration.Short,
        )
        if (result == SnackbarResult.ActionPerformed) undoDelete()
    }
}
```

<!-- ENDIF -->

---

## 12. Empty State

Shown when a list or screen has no data. Must include an illustration, message, and CTA.

**Rules:**
- Center vertically in the available space (not at the top).
- Illustration: simple, branded, not a stock photo. Use Lottie animation if appropriate.
- Message: explain WHY it is empty and WHAT the user can do.
- CTA button: the primary action to populate this screen.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

```tsx
function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Use Lottie animation or static illustration */}
      <LottieView source={require('./empty-animation.json')} autoPlay loop style={styles.illustration} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" />
      )}
    </View>
  );
}

// Usage:
<FlatList
  data={items}
  ListEmptyComponent={
    <EmptyState
      title="No trips yet"
      message="Create your first trip to get started tracking your fleet."
      actionLabel="Create Trip"
      onAction={() => navigation.navigate('CreateTrip')}
    />
  }
/>
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

```dart
class EmptyState extends StatelessWidget {
  final String title;
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;
  final String? lottieAsset;

  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (lottieAsset != null)
              Lottie.asset(lottieAsset!, width: 200, height: 200),
            SizedBox(height: 24),
            Text(title, style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
            SizedBox(height: 8),
            Text(message, style: Theme.of(context).textTheme.bodyMedium, textAlign: TextAlign.center),
            if (onAction != null) ...[
              SizedBox(height: 24),
              FilledButton(onPressed: onAction, child: Text(actionLabel!)),
            ],
          ],
        ),
      ),
    );
  }
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-ios" -->

```swift
// SwiftUI: ContentUnavailableView (iOS 17+)
ContentUnavailableView {
    Label("No Trips", systemImage: "car.fill")
} description: {
    Text("Create your first trip to get started tracking your fleet.")
} actions: {
    Button("Create Trip") { showCreateTrip = true }
        .buttonStyle(.borderedProminent)
}
```

<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "native-android" -->

```kotlin
@Composable
fun EmptyState(title: String, message: String, actionLabel: String?, onAction: (() -> Unit)?) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        // Lottie or static illustration
        Icon(Icons.Default.DirectionsCar, contentDescription = null, modifier = Modifier.size(96.dp), tint = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.height(24.dp))
        Text(title, style = MaterialTheme.typography.headlineSmall, textAlign = TextAlign.Center)
        Spacer(modifier = Modifier.height(8.dp))
        Text(message, style = MaterialTheme.typography.bodyMedium, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant)
        if (onAction != null && actionLabel != null) {
            Spacer(modifier = Modifier.height(24.dp))
            Button(onClick = onAction) { Text(actionLabel) }
        }
    }
}
```

<!-- ENDIF -->

---

## Component Checklist

For every component you build, verify:

- [ ] Meets minimum touch target (44pt iOS / 48dp Android)
- [ ] Has accessibility label, role, and state
- [ ] Has loading state defined
- [ ] Has error state defined
- [ ] Has empty state defined (where applicable)
- [ ] Supports dark mode (reads from theme, no hardcoded colors)
- [ ] Uses platform-native animation (bounce on iOS, ripple on Android)
- [ ] Tested with Dynamic Type at maximum size
- [ ] Tested with screen reader (VoiceOver / TalkBack)
