<!-- IF {{HAS_MOBILE}} == "true" -->
# Mobile Help Patterns

Mobile-specific help patterns that replace or supplement web help patterns. Mobile has no cursor, no hover, and limited screen real estate — every web help pattern needs a mobile-appropriate alternative.

---

## Pattern 1: Tap-to-Reveal Info Icons (replaces hover tooltips)

Mobile cannot hover. Replace hover tooltips with tappable `ⓘ` icons next to form fields and UI elements.

**Behavior:**
- Tap the `ⓘ` icon → shows a small popover with the tooltip text
- Tap outside the popover → dismisses it
- Only one popover visible at a time

**Layout:**

```text
┌─────────────────────────────────┐
│  Due Date              [📅] [ⓘ]│
│  ┌─────────────────────────┐   │
│  │ 2025-03-15              │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ The date payment is     │   │
│  │ expected. Overdue items │   │
│  │ appear in red.          │   │
│  │          [Learn more →] │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Content source:** Same tooltip JSON as web (`{{USER_DOCS_PATH}}/in-app/{screen}.json` → `tooltips` array)

---

## Pattern 2: Coach Marks / Spotlight Overlays (feature discovery)

Step-by-step feature walkthroughs that highlight UI elements one at a time with a dimmed background.

**When to show:**
- First time a user visits a screen with new/complex features
- User taps "Take a tour" button
- After a significant app update (for changed features only)

**Behavior:**
- Dim the entire screen except the highlighted element
- Show a tooltip pointing to the highlighted element
- "Next" / "Skip" / step counter at the bottom
- Maximum 5 steps per tour (users lose attention beyond this)
- Store completion per-tour in user preferences

**Layout:**

```text
┌─────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░┌───────────────────────┐░░░░│
│░░░│  [Highlighted Element] │░░░░│
│░░░└───────────────────────┘░░░░│
│░░░░░░░░░░░░░│░░░░░░░░░░░░░░░░░│
│░░░░┌────────┴──────────┐░░░░░░░│
│░░░░│ Tap here to create │░░░░░░│
│░░░░│ your first invoice. │░░░░░░│
│░░░░│                    │░░░░░░│
│░░░░│ 1/3  [Skip] [Next] │░░░░░░│
│░░░░└───────────────────┘░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────┘
```

**Content source:** `{{USER_DOCS_PATH}}/in-app/mobile/{screen}-tour.json`

```json
{
  "screen": "invoices-list",
  "tour_id": "invoices-first-visit",
  "steps": [
    {
      "target": "button-create-invoice",
      "title": "Create an Invoice",
      "text": "Tap here to create your first invoice.",
      "position": "below"
    },
    {
      "target": "filter-bar",
      "title": "Filter and Search",
      "text": "Use these controls to find specific invoices.",
      "position": "below"
    }
  ]
}
```

---

## Pattern 3: Bottom Sheet Help Panels (replaces side panels)

On mobile, slide-out side panels don't work (too narrow). Use bottom sheets instead.

**Behavior:**
- Triggered by the `?` help button in the header
- Slides up from the bottom
- Draggable — snap to half-screen (peek) or full-screen
- Swipe down to dismiss
- Same content as the web contextual help panel

**Layout (half-screen peek):**

```text
┌─────────────────────────────────┐
│  Page content visible above...  │
│                                 │
│                                 │
├─────────────────────────────────┤  ← drag handle
│  ═══                            │
│  Help: Invoice Management       │
│                                 │
│  View, create, and manage your  │
│  invoices in one place.         │
│                                 │
│  ▸ Creating an Invoice          │
│  ▸ Filtering Invoices           │
│                                 │
│  📖 View full guide →           │
└─────────────────────────────────┘
```

**Content source:** Same JSON as web (`{{USER_DOCS_PATH}}/in-app/{screen}.json`)

---

## Pattern 4: Onboarding Carousel (replaces wizard)

On mobile, multi-step wizards feel heavy. Use a swipeable carousel instead.

**Behavior:**
- Full-screen cards, swipe left/right to navigate
- Page dots at the bottom
- "Skip" button always visible (top-right)
- Maximum 3-5 screens (users swipe past after 5)
- Last screen has a CTA button ("Get Started")
- "Don't show again" — stored in user preferences

**Layout:**

```text
┌─────────────────────────────────┐
│                          [Skip] │
│                                 │
│                                 │
│      [Illustration/Screenshot]  │
│                                 │
│                                 │
│    Welcome to {{PROJECT_NAME}}  │
│                                 │
│    Brief description of what    │
│    the app does for you.        │
│                                 │
│            ● ○ ○ ○              │
│                                 │
└─────────────────────────────────┘
```

---

## Pattern 5: Gesture Hints (animated guides)

Animated hints that teach non-obvious gestures. Show once per gesture, then never again.

**Gestures that need hints:**
- **Swipe to delete:** Animated hand swiping left on a list item
- **Pull to refresh:** Animated hand pulling down
- **Pinch to zoom:** Two-finger pinch animation (if applicable)
- **Long press:** Pulsing highlight on long-press targets

**When to show:**
- First time the user encounters a screen with that gesture
- Store "gesture_hint_{gesture_id}_shown" in user preferences

**Duration:** 2-3 seconds, then auto-dismiss. Non-blocking (user can interact through it).

---

## Pattern 6: Deep Links to Help

Every screen supports a deep link to its corresponding help article:

```text
{{DOCS_SITE_URL}}/guides/{feature-slug}
```

Used by:
- "Learn more" links in tooltips and help panels
- Error messages with "How to fix this" links
- Settings → "Help & Support" → opens docs site in in-app browser

<!-- IF {{MOBILE_OFFLINE}} == "true" -->

---

## Pattern 7: Offline Help

When the device is offline, help content must still be available.

**Strategy:**
- Bundle critical help content with the app binary (getting started, core features)
- Cache additional help content on first load
- Show an "offline" indicator on help content that couldn't be cached
- Deep links to the docs site show a "You're offline" message with cached content fallback
<!-- ENDIF -->

---

## Content Storage for Mobile

Mobile in-app help is stored in `{{USER_DOCS_PATH}}/in-app/mobile/`:

```text
in-app/mobile/
├── {screen}-help.json         # Bottom sheet content
├── {screen}-tour.json         # Coach mark tours
├── {screen}-tooltips.json     # Tap-to-reveal tooltips
├── gestures.json              # Gesture hint definitions
└── onboarding-carousel.json   # Onboarding screens
```
<!-- ENDIF -->
