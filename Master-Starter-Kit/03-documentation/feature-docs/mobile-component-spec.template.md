# Mobile Component Spec: {{COMPONENT_NAME}}

> Package: {{PACKAGE}} (`apps/mobile/components/` or `packages/ui-mobile/`)
> Platform variants: {{PLATFORMS}} (iOS / Android / Both)
> Priority: {{PRIORITY}}

---

## 1. Purpose

{{One-sentence description of what this component does.}}

---

## 2. Props / Parameters

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| {{PROP}} | {{TYPE}} | Yes / No | {{DEFAULT}} | {{DESCRIPTION}} |

---

## 3. Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | {{Standard appearance}} | {{When to use}} |
| `primary` | {{Emphasized appearance}} | {{When to use}} |
| `destructive` | {{Red/warning appearance}} | {{When to use}} |

---

## 4. Sizes

| Size | Dimensions | Font Size | Touch Target | Use Case |
|------|-----------|-----------|-------------|----------|
| `sm` | {{H x W}} | {{SIZE}} | 44x44pt min | Compact lists, secondary actions |
| `md` | {{H x W}} | {{SIZE}} | 44x44pt min | Default, most use cases |
| `lg` | {{H x W}} | {{SIZE}} | 48x48pt+ | Primary actions, accessibility |

---

## 5. States

| State | Visual | Interaction |
|-------|--------|-------------|
| Default | {{Description}} | Tappable |
| Pressed | {{Opacity change, scale, highlight}} | Feedback visible |
| Disabled | {{Reduced opacity (0.5), muted colors}} | Not tappable, `accessibilityState={{ disabled: true }}` |
| Loading | {{Activity indicator replaces content}} | Not tappable |
| Focused | {{Focus ring or highlight}} | Keyboard/switch control focused |

---

## 6. Platform Differences

| Aspect | iOS | Android |
|--------|-----|---------|
| Press feedback | Opacity reduction (0.7) | Ripple effect |
| Elevation/Shadow | `shadowOffset`, `shadowRadius` | `elevation` property |
| Typography | SF Pro | Roboto |
| {{Other}} | | |

---

## 7. Haptic Feedback

| Interaction | Haptic Type | Notes |
|-------------|------------|-------|
| Tap | `selection` | Light feedback on selection |
| Success action | `notificationSuccess` | After successful submission |
| Destructive action | `notificationWarning` | Before destructive confirmation |
| Toggle | `impactLight` | On state change |

---

## 8. Animation

| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Press | Scale to 0.96 | 100ms | ease-out |
| Appear | Fade in + slide up | 200ms | ease-out |
| Disappear | Fade out | 150ms | ease-in |
| State change | Cross-fade | 200ms | ease-in-out |

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
**Implementation:** Use `react-native-reanimated` for performant animations. Avoid `Animated` API for complex animations.
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
**Implementation:** Use implicit animations (`AnimatedContainer`, `AnimatedOpacity`) for simple transitions. `AnimationController` for complex sequences.
<!-- ENDIF -->

---

## 9. Accessibility

| Aspect | Value |
|--------|-------|
| **Role** | `button` / `link` / `checkbox` / `switch` / `image` / `text` |
| **Label** | `"{{ACCESSIBLE_LABEL}}"` |
| **Hint** | `"{{ACCESSIBLE_HINT}}"` (what happens on activation) |
| **State** | `{ disabled, selected, checked, expanded }` as applicable |
| **Min touch target** | 44x44pt (iOS) / 48x48dp (Android) — enforced even if visual size is smaller |
| **Focus order** | Natural document order unless overridden |

---

## 10. Dark Mode

| Token | Light | Dark |
|-------|-------|------|
| Background | {{LIGHT_BG}} | {{DARK_BG}} |
| Text | {{LIGHT_TEXT}} | {{DARK_TEXT}} |
| Border | {{LIGHT_BORDER}} | {{DARK_BORDER}} |
| Icon | {{LIGHT_ICON}} | {{DARK_ICON}} |

---

## 11. Usage Example

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
```tsx
import { {{COMPONENT_NAME}} } from "@/components/{{COMPONENT_NAME}}";

<{{COMPONENT_NAME}}
  variant="primary"
  size="md"
  onPress={() => handleAction()}
  accessibilityLabel="{{ACCESSIBLE_LABEL}}"
>
  {{CONTENT}}
</{{COMPONENT_NAME}}>
```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
```dart
{{ComponentName}}(
  variant: {{ComponentName}}Variant.primary,
  size: {{ComponentName}}Size.md,
  onTap: () => handleAction(),
  semanticsLabel: '{{ACCESSIBLE_LABEL}}',
  child: Text('{{CONTENT}}'),
)
```
<!-- ENDIF -->

---

## 12. Testing Checklist

- [ ] Renders correctly in all variants
- [ ] Renders correctly in all sizes
- [ ] All states work (default, pressed, disabled, loading)
- [ ] Haptic feedback fires on correct interactions
- [ ] Animations play smoothly (60fps)
- [ ] Dark mode appearance is correct
- [ ] Touch target meets minimum size (44x44pt / 48x48dp)
- [ ] Accessible via screen reader with correct label, role, and hint
- [ ] Works with Dynamic Type at max font size
- [ ] Platform differences rendered correctly (iOS vs Android)
