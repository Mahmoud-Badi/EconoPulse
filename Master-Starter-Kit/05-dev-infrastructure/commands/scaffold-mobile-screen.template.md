# /scaffold-mobile-screen $ARGUMENT

Generate a mobile screen with navigation setup, loading/error/empty states, and platform-appropriate patterns.

## Steps

1. **Read the mobile screen spec** (if documented):
   ```
   dev_docs/screens/mobile-$ARGUMENT.md
   ```
   Extract: route, navigation type, data requirements, gestures, offline behavior, platform differences.

2. **Read mobile architecture** to understand framework and patterns:
   ```
   dev_docs/mobile-architecture.md
   ```

3. **Determine screen location**:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   - `apps/mobile/app/(tabs)/$ARGUMENT.tsx` — if it is a tab screen
   - `apps/mobile/app/$ARGUMENT.tsx` — if it is a stack screen
   - `apps/mobile/app/$ARGUMENT/[id].tsx` — if it is a detail screen
   - `apps/mobile/app/(auth)/$ARGUMENT.tsx` — if it is an auth screen
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   - `apps/mobile_flutter/lib/screens/$ARGUMENT_screen.dart`
<!-- ENDIF -->

4. **Generate the screen**:

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```tsx
   import { View, Text, FlatList, RefreshControl } from "react-native";
   import { SafeAreaView } from "react-native-safe-area-context";
   import { useQuery } from "@tanstack/react-query";
   import { Stack } from "expo-router";

   export default function {Screen}Screen() {
     const { data, isLoading, error, refetch, isRefetching } = useQuery({
       queryKey: ["{resource}"],
       queryFn: () => api.{resource}.list(),
     });

     if (isLoading) return <{Screen}Skeleton />;
     if (error) return <ErrorState message={error.message} onRetry={refetch} />;
     if (!data?.length) return <EmptyState title="No {resource} yet" />;

     return (
       <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
         <Stack.Screen options={{ title: "{Screen Title}" }} />
         <FlatList
           data={data}
           keyExtractor={(item) => item.id}
           renderItem={({ item }) => <{Screen}ListItem item={item} />}
           refreshControl={
             <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
           }
         />
       </SafeAreaView>
     );
   }
   ```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```dart
   import 'package:flutter/material.dart';
   import 'package:flutter_riverpod/flutter_riverpod.dart';

   class {Screen}Screen extends ConsumerWidget {
     const {Screen}Screen({super.key});

     @override
     Widget build(BuildContext context, WidgetRef ref) {
       final state = ref.watch({screen}Provider);

       return Scaffold(
         appBar: AppBar(title: const Text('{Screen Title}')),
         body: state.when(
           loading: () => const {Screen}Skeleton(),
           error: (error, _) => ErrorState(
             message: error.toString(),
             onRetry: () => ref.invalidate({screen}Provider),
           ),
           data: (items) => items.isEmpty
             ? const EmptyState(title: 'No {resource} yet')
             : RefreshIndicator(
                 onRefresh: () => ref.refresh({screen}Provider.future),
                 child: ListView.builder(
                   itemCount: items.length,
                   itemBuilder: (context, index) => {Screen}ListTile(item: items[index]),
                 ),
               ),
         ),
       );
     }
   }
   ```
<!-- ENDIF -->

5. **Generate supporting components** in the screen's directory:
   - `{Screen}Skeleton` — loading placeholder with shimmer/skeleton animation
   - `{Screen}ListItem` (or `{Screen}ListTile`) — individual item component
   - `ErrorState` — error display with retry button (if not already in shared components)
   - `EmptyState` — empty state with illustration and message (if not already shared)

6. **Register the route** in the navigation:
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   - If using Expo Router: the file location IS the route (no manual registration)
   - If tab screen: add to `app/(tabs)/_layout.tsx` tab configuration
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   - Add route to GoRouter configuration in `lib/routes/router.dart`
<!-- ENDIF -->

7. **Register deep link** (if applicable):
   - Add URL pattern to deep link configuration
   - Test with: `xcrun simctl openurl booted "{{PROJECT_SLUG}}://{route}"` (iOS)

8. **Run typecheck and lint**:
   ```bash
   {{TYPE_CHECK_CMD}} 2>&1 | tail -20
   ```

9. **Output report**:
   ```
   MOBILE SCREEN GENERATED
   =======================
   Name: {Screen}
   File: {file path}
   Route: {route}
   Deep Link: {{PROJECT_SLUG}}://{route}
   Type: List / Detail / Form / Dashboard / Map / Camera
   Navigation: Stack / Tab / Modal
   States: Loading ✓ | Error ✓ | Empty ✓ | Offline {yes/no}
   Platform: iOS ✓ | Android ✓
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **SafeAreaView on every screen**: Wrap content in SafeAreaView (React Native) or respect MediaQuery.padding (Flutter). Never render under the notch or home indicator.
- **Loading state is a skeleton, not a spinner**: Use skeleton/shimmer placeholders that match the content layout. Spinners are a last resort.
- **Pull-to-refresh on all data screens**: Every screen that fetches data should support pull-to-refresh.
- **Error states must have a retry action**: Never show a dead-end error. Always offer a retry button.
- **Empty states must be helpful**: Include a message explaining what will appear here and, if applicable, a CTA to create the first item.
- **Keyboard avoidance on forms**: Wrap form screens in KeyboardAvoidingView (React Native) or let Scaffold handle it (Flutter).
- **Touch targets minimum 44x44pt / 48x48dp**: All interactive elements must meet minimum touch target sizes.
- **Test on both platforms**: Verify the screen renders correctly on both iOS simulator and Android emulator.
