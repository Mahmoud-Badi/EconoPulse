# Mobile Adaptation Strategy for {{PROJECT_NAME}}

> **Define how the interactive demo adapts across devices, platforms, and input methods.**
> Ensure every viewer has a great experience regardless of how they access the demo.

---

## Table of Contents

1. [Product Platform Assessment](#product-platform-assessment)
2. [Web Responsive Strategy](#web-responsive-strategy)
3. [Mobile App Demo Strategy](#mobile-app-demo-strategy)
4. [Touch Interaction Mapping](#touch-interaction-mapping)
5. [Platform-Specific Features](#platform-specific-features)
6. [Viewport & Orientation Handling](#viewport--orientation-handling)
7. [Performance Considerations](#performance-considerations)
8. [Accessibility on Mobile](#accessibility-on-mobile)
9. [Testing Matrix](#testing-matrix)
10. [Checklist](#checklist)

---

## Product Platform Assessment

### What Is {{PROJECT_NAME}}?

| Question | Answer |
|----------|--------|
| **Product Type** | {{TYPE, e.g., "Web application" / "Mobile app" / "Desktop software" / "Cross-platform"}} |
| **Primary Platform** | {{PLATFORM, e.g., "Web (responsive)" / "iOS" / "Android" / "Desktop"}} |
| **Secondary Platform(s)** | {{SECONDARY, e.g., "Mobile web" / "None"}} |
| **Mobile App Exists?** | {{YES/NO}} |
| **Mobile App Framework** | {{FRAMEWORK, e.g., "React Native" / "Flutter" / "Swift" / "Kotlin" / "N/A"}} |

### Demo Audience Device Distribution

<!-- Estimate or use analytics data for your target audience's device usage. -->

| Device Type | Estimated % of Demo Viewers | Priority |
|------------|----------------------------|----------|
| Desktop (1024px+) | {{PERCENT, e.g., 65%}} | {{HIGH/MEDIUM/LOW}} |
| Tablet (768-1023px) | {{PERCENT, e.g., 15%}} | {{PRIORITY}} |
| Mobile (320-767px) | {{PERCENT, e.g., 20%}} | {{PRIORITY}} |

### Platform-to-Demo-Approach Matrix

| Product Platform | Demo Approach | Rationale |
|-----------------|--------------|-----------|
| Web-only product, viewed on desktop | {{APPROACH, e.g., "Full responsive demo"}} | {{RATIONALE}} |
| Web-only product, viewed on mobile | {{APPROACH, e.g., "Simplified mobile layout with key steps"}} | {{RATIONALE}} |
| Mobile app, viewed on desktop | {{APPROACH, e.g., "Phone frame mockup centered on page"}} | {{RATIONALE}} |
| Mobile app, viewed on mobile | {{APPROACH, e.g., "Full-width native-feel experience"}} | {{RATIONALE}} |
| Cross-platform, viewed on any device | {{APPROACH, e.g., "Detect device, show appropriate version"}} | {{RATIONALE}} |

---

## Web Responsive Strategy

### Breakpoint Definitions

| Breakpoint | Min Width | Max Width | Layout Changes | Demo Adjustments |
|-----------|-----------|-----------|---------------|-----------------|
| **Desktop Large** | {{WIDTH, e.g., 1440px}} | — | {{LAYOUT, e.g., "Full product layout"}} | {{ADJUSTMENTS, e.g., "No changes needed"}} |
| **Desktop** | {{WIDTH, e.g., 1024px}} | {{WIDTH, e.g., 1439px}} | {{LAYOUT}} | {{ADJUSTMENTS}} |
| **Tablet Landscape** | {{WIDTH, e.g., 768px}} | {{WIDTH, e.g., 1023px}} | {{LAYOUT, e.g., "Sidebar collapses"}} | {{ADJUSTMENTS, e.g., "Tooltip repositions, spotlight area adjusts"}} |
| **Tablet Portrait** | {{WIDTH, e.g., 600px}} | {{WIDTH, e.g., 767px}} | {{LAYOUT}} | {{ADJUSTMENTS}} |
| **Mobile** | {{WIDTH, e.g., 320px}} | {{WIDTH, e.g., 599px}} | {{LAYOUT, e.g., "Single column, bottom nav"}} | {{ADJUSTMENTS, e.g., "Steps simplified, tooltips full-width bottom sheet"}} |

### Responsive Component Behavior

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| **Tooltip** | {{BEHAVIOR, e.g., "Positioned near target element"}} | {{BEHAVIOR, e.g., "Positioned below, wider"}} | {{BEHAVIOR, e.g., "Bottom sheet overlay"}} |
| **Spotlight / Overlay** | {{BEHAVIOR, e.g., "Circular cutout"}} | {{BEHAVIOR}} | {{BEHAVIOR, e.g., "Full-width highlight band"}} |
| **Progress Bar** | {{BEHAVIOR, e.g., "Top horizontal bar"}} | {{BEHAVIOR}} | {{BEHAVIOR, e.g., "Step dots below tooltip"}} |
| **Mode Toggle** | {{BEHAVIOR, e.g., "Top-right toggle button"}} | {{BEHAVIOR}} | {{BEHAVIOR, e.g., "Floating action button"}} |
| **CTA Banners** | {{BEHAVIOR, e.g., "Inline card"}} | {{BEHAVIOR}} | {{BEHAVIOR, e.g., "Full-width bottom bar"}} |
| **Navigation** | {{BEHAVIOR, e.g., "Next/Back buttons"}} | {{BEHAVIOR}} | {{BEHAVIOR, e.g., "Swipe or bottom buttons"}} |
| **Entry Gate Form** | {{BEHAVIOR, e.g., "Centered card"}} | {{BEHAVIOR}} | {{BEHAVIOR, e.g., "Full-screen"}} |

### Touch Target Sizes

| Element | Minimum Touch Target | Current Size | Compliant? |
|---------|---------------------|-------------|-----------|
| Buttons | 44x44px (WCAG) / 48x48px (Material) | {{SIZE}} | {{YES/NO}} |
| Links | 44x44px | {{SIZE}} | {{YES/NO}} |
| Hotspot beacons | 44x44px | {{SIZE}} | {{YES/NO}} |
| Close (X) buttons | 44x44px | {{SIZE}} | {{YES/NO}} |
| Form inputs | 44px height minimum | {{SIZE}} | {{YES/NO}} |
| Next/Back nav | 48x48px recommended | {{SIZE}} | {{YES/NO}} |

### Gesture Support

| Gesture | Action | Where Available |
|---------|--------|----------------|
| **Swipe left** | {{ACTION, e.g., "Next step"}} | {{WHERE, e.g., "Guided mode, mobile only"}} |
| **Swipe right** | {{ACTION, e.g., "Previous step"}} | {{WHERE}} |
| **Swipe down** | {{ACTION, e.g., "Dismiss tooltip"}} | {{WHERE}} |
| **Tap** | {{ACTION, e.g., "Interact with target / open hotspot"}} | {{WHERE, e.g., "All modes, all devices"}} |
| **Long-press** | {{ACTION, e.g., "Show feature description"}} | {{WHERE}} |
| **Pinch-to-zoom** | {{ACTION, e.g., "Disabled — demo controls zoom level"}} | {{WHERE}} |
| **Double-tap** | {{ACTION, e.g., "Not used"}} | — |

---

## Mobile App Demo Strategy

<!-- IF {{MOBILE_APP_EXISTS}} -->

### Phone Frame Mockup

| Property | Value |
|----------|-------|
| **Frame Style** | {{STYLE, e.g., "iPhone 15 Pro / Samsung Galaxy S24 / Generic smartphone"}} |
| **Frame Color** | {{COLOR, e.g., "Space Black / matches brand"}} |
| **Screen Aspect Ratio** | {{RATIO, e.g., "19.5:9"}} |
| **Frame Width on Desktop** | {{WIDTH, e.g., "375px (realistic) inside 800px container"}} |
| **Background** | {{BACKGROUND, e.g., "Subtle gradient matching brand colors"}} |
| **Rotate Option** | {{YES/NO}} — show landscape mode for applicable screens |

### Device Type Selection

<!-- IF {{MULTI_DEVICE}} -->
| Device Shown | When | Rationale |
|-------------|------|-----------|
| {{DEVICE_1, e.g., "iPhone"}} | {{WHEN, e.g., "Default on desktop"}} | {{RATIONALE}} |
| {{DEVICE_2, e.g., "Android"}} | {{WHEN, e.g., "User toggles or auto-detected"}} | {{RATIONALE}} |
| {{DEVICE_3, e.g., "Tablet"}} | {{WHEN}} | {{RATIONALE}} |
<!-- ENDIF -->

### App Screen Capture Strategy

| Method | Description | Pros | Cons |
|--------|-----------|------|------|
| **Screenshots** | Static images of each screen | Simple, fast | Not interactive |
| **Screen recordings** | Short video clips per step | Realistic, shows animations | Large file size, not interactive |
| **Live app in frame** | Actual app running in iframe/webview | Most realistic | Complex, needs mobile backend |
| **HTML recreation** | Rebuilt screens in HTML/CSS | Interactive, lightweight | Build effort |

**Selected method:** {{SELECTED_METHOD}}

### Mobile-Specific Demo Steps

| Step # | Mobile Screen | Interaction | Touch Gesture | Notes |
|--------|-------------|-------------|--------------|-------|
| {{STEP}} | {{SCREEN}} | {{INTERACTION}} | {{GESTURE}} | {{NOTES}} |
| {{STEP}} | {{SCREEN}} | {{INTERACTION}} | {{GESTURE}} | {{NOTES}} |
| {{STEP}} | {{SCREEN}} | {{INTERACTION}} | {{GESTURE}} | {{NOTES}} |
| {{STEP}} | {{SCREEN}} | {{INTERACTION}} | {{GESTURE}} | {{NOTES}} |
| {{STEP}} | {{SCREEN}} | {{INTERACTION}} | {{GESTURE}} | {{NOTES}} |

<!-- ENDIF -->

---

## Touch Interaction Mapping

### Desktop-to-Touch Translation

| Desktop Interaction | Touch Equivalent | Implementation Notes |
|--------------------|-----------------|---------------------|
| Mouse hover | {{TOUCH, e.g., "Tap to reveal (toggle)"}} | {{NOTES, e.g., "Add explicit 'tap to learn more' hint"}} |
| Right-click context menu | {{TOUCH, e.g., "Long-press"}} | {{NOTES}} |
| Drag and drop | {{TOUCH, e.g., "Touch-drag with handle indicator"}} | {{NOTES}} |
| Mouse wheel scroll | {{TOUCH, e.g., "Swipe scroll (native)"}} | {{NOTES}} |
| Keyboard shortcut | {{TOUCH, e.g., "On-screen button"}} | {{NOTES}} |
| Text selection | {{TOUCH, e.g., "Long-press + handles"}} | {{NOTES}} |
| Tooltip on hover | {{TOUCH, e.g., "Tap target element, tooltip appears"}} | {{NOTES}} |
| Resize handle | {{TOUCH, e.g., "Two-finger pinch or drag handle"}} | {{NOTES}} |

### Interaction Complexity on Mobile

| Demo Step | Desktop Interaction | Mobile Feasible? | Mobile Alternative | Priority |
|----------|--------------------|-----------------|--------------------|----------|
| {{STEP}} | {{DESKTOP_INTERACTION}} | {{YES/PARTIAL/NO}} | {{ALTERNATIVE}} | {{PRIORITY}} |
| {{STEP}} | {{DESKTOP_INTERACTION}} | {{FEASIBLE}} | {{ALTERNATIVE}} | {{PRIORITY}} |
| {{STEP}} | {{DESKTOP_INTERACTION}} | {{FEASIBLE}} | {{ALTERNATIVE}} | {{PRIORITY}} |
| {{STEP}} | {{DESKTOP_INTERACTION}} | {{FEASIBLE}} | {{ALTERNATIVE}} | {{PRIORITY}} |
| {{STEP}} | {{DESKTOP_INTERACTION}} | {{FEASIBLE}} | {{ALTERNATIVE}} | {{PRIORITY}} |

---

## Platform-Specific Features

### iOS vs Android Differences

<!-- IF {{MOBILE_APP_EXISTS}} -->

| Feature Area | iOS Behavior | Android Behavior | Demo Handling |
|-------------|-------------|-----------------|--------------|
| **Navigation** | {{IOS, e.g., "Back swipe from left edge"}} | {{ANDROID, e.g., "System back button"}} | {{HANDLING}} |
| **Status bar** | {{IOS}} | {{ANDROID}} | {{HANDLING}} |
| **Notifications** | {{IOS}} | {{ANDROID}} | {{HANDLING}} |
| **Share sheet** | {{IOS}} | {{ANDROID}} | {{HANDLING}} |
| **Haptic feedback** | {{IOS, e.g., "Taptic engine"}} | {{ANDROID, e.g., "Vibration API"}} | {{HANDLING}} |
| **Typography** | {{IOS, e.g., "SF Pro"}} | {{ANDROID, e.g., "Roboto"}} | {{HANDLING}} |
| **Safe areas** | {{IOS, e.g., "Notch + home indicator"}} | {{ANDROID, e.g., "Punch-hole camera"}} | {{HANDLING}} |

<!-- ENDIF -->

### Browser-Specific Considerations

| Browser | Market Share (target) | Known Issues | Workarounds |
|---------|---------------------|-------------|-------------|
| Chrome (Desktop) | {{SHARE}} | {{ISSUES, e.g., "None"}} | — |
| Chrome (Mobile) | {{SHARE}} | {{ISSUES}} | {{WORKAROUND}} |
| Safari (Desktop) | {{SHARE}} | {{ISSUES}} | {{WORKAROUND}} |
| Safari (Mobile) | {{SHARE}} | {{ISSUES, e.g., "100vh includes address bar"}} | {{WORKAROUND, e.g., "Use dvh or JS fallback"}} |
| Firefox | {{SHARE}} | {{ISSUES}} | {{WORKAROUND}} |
| Edge | {{SHARE}} | {{ISSUES}} | {{WORKAROUND}} |
| Samsung Internet | {{SHARE}} | {{ISSUES}} | {{WORKAROUND}} |

---

## Viewport & Orientation Handling

### Orientation Strategy

| Orientation | Supported? | Behavior |
|------------|-----------|----------|
| **Portrait (mobile)** | {{YES/NO}} | {{BEHAVIOR, e.g., "Default mobile layout"}} |
| **Landscape (mobile)** | {{YES/NO}} | {{BEHAVIOR, e.g., "Show landscape prompt or adapt layout"}} |
| **Portrait (tablet)** | {{YES/NO}} | {{BEHAVIOR}} |
| **Landscape (tablet)** | {{YES/NO}} | {{BEHAVIOR}} |

### Orientation Change Handling

| Scenario | Behavior |
|----------|---------|
| User rotates mid-step | {{BEHAVIOR, e.g., "Reposition tooltip, maintain step state"}} |
| User rotates to unsupported orientation | {{BEHAVIOR, e.g., "Show 'Please rotate to portrait' message"}} |
| Orientation lock preference | {{BEHAVIOR, e.g., "Suggest portrait but don't force"}} |

### Viewport Edge Cases

| Edge Case | Detection | Handling |
|-----------|----------|---------|
| Address bar showing/hiding | {{DETECTION, e.g., "resize event listener"}} | {{HANDLING, e.g., "Recalculate layout, use dvh units"}} |
| Virtual keyboard open | {{DETECTION, e.g., "visualViewport API"}} | {{HANDLING, e.g., "Scroll form field into view, hide bottom nav"}} |
| Notch / safe area insets | {{DETECTION, e.g., "env(safe-area-inset-*)"}} | {{HANDLING, e.g., "Pad content within safe areas"}} |
| Foldable devices | {{DETECTION, e.g., "Spanning viewport segments API"}} | {{HANDLING}} |
| Split-screen mode | {{DETECTION}} | {{HANDLING}} |

---

## Performance Considerations

### Mobile Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint** | {{TARGET, e.g., "<1.5s on 4G"}} | Lighthouse / WebPageTest |
| **Largest Contentful Paint** | {{TARGET, e.g., "<2.5s on 4G"}} | Lighthouse |
| **Time to Interactive** | {{TARGET, e.g., "<3.5s on 4G"}} | Lighthouse |
| **Total Page Weight** | {{TARGET, e.g., "<1MB initial load"}} | DevTools Network |
| **JavaScript Bundle** | {{TARGET, e.g., "<200KB gzipped"}} | Bundle analyzer |
| **Image Assets** | {{TARGET, e.g., "<500KB total, lazy-loaded"}} | DevTools |
| **Cumulative Layout Shift** | {{TARGET, e.g., "<0.1"}} | Lighthouse |

### Network Conditions

| Condition | Speed | Latency | Strategy |
|-----------|-------|---------|----------|
| 4G LTE | ~20 Mbps | ~50ms | {{STRATEGY, e.g., "Default experience, no adjustments"}} |
| 3G | ~1.5 Mbps | ~300ms | {{STRATEGY, e.g., "Lazy-load images, reduce animation"}} |
| Slow 3G | ~400 Kbps | ~600ms | {{STRATEGY, e.g., "Placeholder images, minimal assets"}} |
| Offline | — | — | {{STRATEGY, e.g., "Service worker cache, 'no connection' message"}} |

### Mobile Optimization Checklist

- [ ] Images served in WebP/AVIF with fallback
- [ ] Images lazy-loaded after initial viewport
- [ ] CSS and JS minified and gzipped
- [ ] Fonts subset to used characters only
- [ ] Animations use `transform` and `opacity` (GPU-accelerated)
- [ ] No layout thrashing (reads before writes)
- [ ] Touch events use `passive: true` where possible
- [ ] Service worker caches static assets for repeat visits
- [ ] Reduced motion respected (`prefers-reduced-motion`)
- [ ] No memory leaks from demo step transitions

---

## Accessibility on Mobile

### Mobile Accessibility Requirements

| Requirement | Standard | Implementation | Status |
|------------|---------|---------------|--------|
| **Touch target size** | WCAG 2.5.5 (44x44px min) | {{IMPLEMENTATION}} | {{STATUS}} |
| **Screen reader support** | VoiceOver (iOS), TalkBack (Android) | {{IMPLEMENTATION}} | {{STATUS}} |
| **Focus management** | WCAG 2.4.3 | {{IMPLEMENTATION, e.g., "Focus moves to tooltip on step change"}} | {{STATUS}} |
| **Color contrast** | WCAG 1.4.3 (4.5:1 text, 3:1 UI) | {{IMPLEMENTATION}} | {{STATUS}} |
| **Text resize** | WCAG 1.4.4 (200% zoom) | {{IMPLEMENTATION}} | {{STATUS}} |
| **Motion sensitivity** | WCAG 2.3.3 | {{IMPLEMENTATION, e.g., "Respect prefers-reduced-motion"}} | {{STATUS}} |
| **Orientation** | WCAG 1.3.4 (not locked) | {{IMPLEMENTATION}} | {{STATUS}} |
| **Meaningful sequence** | WCAG 1.3.2 | {{IMPLEMENTATION, e.g., "DOM order matches visual order"}} | {{STATUS}} |

### Screen Reader Step Announcements

| Event | Announcement |
|-------|-------------|
| Step change | {{ANNOUNCEMENT, e.g., "Step {{N}} of {{TOTAL}}: {{STEP_TITLE}}"}} |
| Tooltip appears | {{ANNOUNCEMENT, e.g., "{{TOOLTIP_TITLE}}. {{TOOLTIP_DESC}}"}} |
| Mode switch | {{ANNOUNCEMENT, e.g., "Switched to free explore mode"}} |
| CTA appears | {{ANNOUNCEMENT, e.g., "Call to action: {{CTA_TEXT}}"}} |
| Demo complete | {{ANNOUNCEMENT, e.g., "Demo complete. {{END_HEADLINE}}"}} |

### Keyboard Navigation on Mobile (External Keyboard)

| Key | Action |
|-----|--------|
| Tab | Move focus to next interactive element |
| Shift+Tab | Move focus to previous element |
| Enter/Space | Activate focused element |
| Escape | Dismiss tooltip / close modal |
| Arrow Right | Next step (guided mode) |
| Arrow Left | Previous step (guided mode) |

---

## Testing Matrix

### Device Testing Plan

| Device | OS Version | Browser | Screen Size | Priority | Tested? |
|--------|-----------|---------|------------|----------|---------|
| {{DEVICE, e.g., "iPhone 15 Pro"}} | {{OS, e.g., "iOS 17"}} | {{BROWSER, e.g., "Safari"}} | {{SIZE, e.g., "393x852"}} | {{PRIORITY}} | {{YES/NO}} |
| {{DEVICE, e.g., "iPhone SE (3rd gen)"}} | {{OS}} | {{BROWSER}} | {{SIZE, e.g., "375x667"}} | {{PRIORITY}} | {{YES/NO}} |
| {{DEVICE, e.g., "Samsung Galaxy S24"}} | {{OS, e.g., "Android 14"}} | {{BROWSER, e.g., "Chrome"}} | {{SIZE}} | {{PRIORITY}} | {{YES/NO}} |
| {{DEVICE, e.g., "Google Pixel 8"}} | {{OS}} | {{BROWSER}} | {{SIZE}} | {{PRIORITY}} | {{YES/NO}} |
| {{DEVICE, e.g., "iPad Air"}} | {{OS}} | {{BROWSER}} | {{SIZE}} | {{PRIORITY}} | {{YES/NO}} |
| {{DEVICE, e.g., "Samsung Galaxy Tab"}} | {{OS}} | {{BROWSER}} | {{SIZE}} | {{PRIORITY}} | {{YES/NO}} |

### Test Scenarios per Device

- [ ] Demo loads within performance budget
- [ ] Welcome screen renders correctly
- [ ] Entry gate form is usable (fields, keyboard, submit)
- [ ] All guided tour steps render and interact correctly
- [ ] Tooltips are readable and positioned correctly
- [ ] Spotlight overlays align with target elements
- [ ] Swipe gestures work for step navigation
- [ ] Free-explore hotspots are tappable
- [ ] CTAs are visible and functional
- [ ] End screen renders correctly
- [ ] Orientation change handled gracefully
- [ ] Virtual keyboard does not obscure form fields
- [ ] No horizontal scroll on any step
- [ ] Animations are smooth (60fps)
- [ ] Screen reader announces steps correctly

---

## Checklist

- [ ] Product platform assessed and demo approach selected per device
- [ ] Responsive breakpoints defined with layout changes documented
- [ ] Touch target sizes meet minimum (44x44px)
- [ ] Gesture support mapped (swipe, tap, long-press)
- [ ] Mobile app frame mockup designed (if applicable)
- [ ] Platform-specific differences addressed (iOS vs Android, browser quirks)
- [ ] Orientation handling defined
- [ ] Performance budget set for mobile networks
- [ ] Accessibility requirements implemented
- [ ] Device testing matrix created and testing plan in place

---

*This template is part of the Master Starter Kit walkthrough demo system. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*
