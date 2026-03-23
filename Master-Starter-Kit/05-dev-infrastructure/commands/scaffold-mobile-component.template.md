# /scaffold-mobile-component $ARGUMENT

Generate a mobile component with platform-appropriate variants, accessibility, and proper touch targets.

## Steps

1. **Read the component spec** (if documented):
   ```
   dev_docs/design/MOBILE-COMPONENT-LIBRARY.md
   ```
   Find the section for `$ARGUMENT`. Extract: variants, sizes, states, props, platform differences, accessibility requirements.

2. **Determine component location**:
   - `apps/mobile/components/ui/$ARGUMENT.tsx` — reusable across screens
   - `apps/mobile/components/{feature}/$ARGUMENT.tsx` — feature-specific

3. **Generate the component**:

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ```tsx
   import React from "react";
   import {
     Pressable,
     Text,
     StyleSheet,
     type PressableProps,
     Platform,
   } from "react-native";
   import * as Haptics from "expo-haptics";

   type {Component}Variant = "default" | "primary" | "destructive";
   type {Component}Size = "sm" | "md" | "lg";

   interface {Component}Props extends Omit<PressableProps, "style"> {
     variant?: {Component}Variant;
     size?: {Component}Size;
     children: React.ReactNode;
   }

   export function {Component}({
     variant = "default",
     size = "md",
     children,
     onPress,
     ...props
   }: {Component}Props) {
     const handlePress = (e: any) => {
       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
       onPress?.(e);
     };

     return (
       <Pressable
         onPress={handlePress}
         style={({ pressed }) => [
           styles.base,
           styles[variant],
           styles[size],
           pressed && styles.pressed,
         ]}
         accessibilityRole="button"
         {...props}
       >
         <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
           {children}
         </Text>
       </Pressable>
     );
   }

   const styles = StyleSheet.create({
     base: {
       alignItems: "center",
       justifyContent: "center",
       borderRadius: 8,
       minHeight: 44, // iOS minimum touch target
       minWidth: 44,
     },
     pressed: {
       opacity: Platform.OS === "ios" ? 0.7 : 0.85,
     },
     // Variants
     default: { backgroundColor: "#f4f4f5" },
     primary: { backgroundColor: "#2563eb" },
     destructive: { backgroundColor: "#dc2626" },
     // Sizes
     sm: { paddingHorizontal: 12, paddingVertical: 8 },
     md: { paddingHorizontal: 16, paddingVertical: 12 },
     lg: { paddingHorizontal: 24, paddingVertical: 16 },
     // Text
     text: { fontSize: 14, fontWeight: "600" },
     defaultText: { color: "#18181b" },
     primaryText: { color: "#ffffff" },
     destructiveText: { color: "#ffffff" },
     smText: { fontSize: 12 },
     mdText: { fontSize: 14 },
     lgText: { fontSize: 16 },
   });
   ```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ```dart
   import 'package:flutter/material.dart';
   import 'package:flutter/services.dart';

   enum {Component}Variant { primary, secondary, destructive }
   enum {Component}Size { sm, md, lg }

   class {Component} extends StatelessWidget {
     final {Component}Variant variant;
     final {Component}Size size;
     final VoidCallback? onPressed;
     final Widget child;

     const {Component}({
       super.key,
       this.variant = {Component}Variant.primary,
       this.size = {Component}Size.md,
       this.onPressed,
       required this.child,
     });

     @override
     Widget build(BuildContext context) {
       return SizedBox(
         height: _height,
         child: ElevatedButton(
           onPressed: onPressed != null
               ? () {
                   HapticFeedback.lightImpact();
                   onPressed!();
                 }
               : null,
           style: _buttonStyle(context),
           child: child,
         ),
       );
     }

     double get _height => switch (size) {
       {Component}Size.sm => 36,
       {Component}Size.md => 44,
       {Component}Size.lg => 52,
     };

     ButtonStyle _buttonStyle(BuildContext context) {
       // Implement variant-specific styles
       return ElevatedButton.styleFrom(
         minimumSize: const Size(48, 48), // Android minimum touch target
       );
     }
   }
   ```
<!-- ENDIF -->

4. **Accessibility checklist** — verify the generated component includes:
   - [ ] `accessibilityRole` / semantic widget for screen readers
   - [ ] `accessibilityLabel` on icon-only interactive elements
   - [ ] Minimum 44x44pt (iOS) / 48x48dp (Android) touch target
   - [ ] Haptic feedback on interactive elements
   - [ ] Press state visual feedback (opacity on iOS, ripple on Android)
   - [ ] Disabled state prevents interaction AND announces disabled to screen reader
   - [ ] Dynamic Type / font scaling support

5. **Run typecheck**:
   ```bash
   {{TYPE_CHECK_CMD}} 2>&1 | tail -20
   ```

6. **Output report**:
   ```
   MOBILE COMPONENT GENERATED
   ==========================
   Name: {Component}
   File: {file path}
   Variants: {list}
   Sizes: {list}
   Touch target: {min px} ✓
   Haptics: {yes/no}
   A11y: {checklist results}
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **Minimum touch targets enforced**: 44x44pt (iOS), 48x48dp (Android). Non-negotiable.
- **Haptic feedback on taps**: Use `Haptics.impactAsync` (React Native) or `HapticFeedback.lightImpact()` (Flutter) for interactive elements.
- **Platform-appropriate press feedback**: Opacity reduction on iOS, ripple effect on Android.
- **No inline styles on React Native**: Use `StyleSheet.create` for performance (styles are compiled once).
- **Semantic accessibility**: Every interactive element needs `accessibilityRole` (RN) or proper Semantics widget (Flutter).
- **Named exports**: Use `export function Component` not `export default`.
