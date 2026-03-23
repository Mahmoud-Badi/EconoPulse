# Audit: UX & Screen Coverage

> **App:** EconoPulse
> **Dimension:** E1-B
> **Date:** 2026-03-23
> **Rounds completed:** 3/3

---

## Score: 6/10 — Needs Work

---

## Round 1 Findings (Surface Scan)

**1. All screens/routes:**

Navigation is state-based (`useState<Section>` in `App.tsx`), not URL-based. There are 9 "panels" acting as screens:

| Panel | Route Key | Component |
|-------|-----------|-----------|
| Overview | `overview` | `OverviewPanel.tsx` |
| Markets (Stocks) | `markets` | `StocksPanel.tsx` |
| Crypto | `crypto` | `CryptoPanel.tsx` |
| Forex | `forex` | `ForexPanel.tsx` |
| Commodities | `commodities` | `CommoditiesPanel.tsx` |
| Macro | `macro` | `MacroPanel.tsx` |
| Countries | `countries` | `CountryPanel.tsx` |
| News | `news` | `NewsPanel.tsx` |
| Sentiment | `sentiment` | `SentimentPanel.tsx` |

**Missing screens (critical for the enhancement goals):**
- Login / Register
- User Profile / Settings
- Watchlist (personal saved items)
- Alert/notification settings

**2. Loading / Error / Empty states per screen:**
- Loading states: `LoadingSkeleton.tsx` exists — likely used across panels. ✓
- Error states: **Not visible in code**. No `<ErrorBoundary>` exists in `App.tsx` or `main.tsx`. If a TanStack Query call fails, the error state depends on individual panel implementations.
- Empty states: No dedicated empty state components found in `components/shared/`. If an API returns an empty array, panels likely render blank sections silently.

**3. Primary user flows documented:** No flow documentation exists anywhere in the repo.

**4. Mobile responsiveness:** Tailwind CSS is used, but the Bloomberg Terminal aesthetic is desktop-first by design. The layout uses `h-screen flex flex-col` with a fixed `Sidebar` — on small viewports this almost certainly breaks into a cramped or unusable state. No responsive breakpoint overrides are visible in the shared components.

**5. Navigation patterns:** Left sidebar (`Sidebar.tsx`) — Bloomberg-style, appropriate for a data terminal. Single-level navigation (no sub-menus, no breadcrumbs). `TopBar.tsx` provides global context (brand, likely theme toggle). `StatusBar.tsx` shows real-time metadata at the bottom (typical terminal pattern).

---

## Round 2 Findings (Deep Dive)

**6. Main user journey end-to-end friction points:**

User arrives at `econopulse.live` → sees Overview panel → clicks sidebar items → views data panels.

Friction points:
- **No URL routing**: Each panel is a state change, not a URL. Users cannot bookmark a panel, share a link to Crypto or Macro, or use browser back/forward. This is a significant UX regression vs. a standard SPA. React Router DOM is installed but unused for this purpose.
- **No return state on refresh**: Refreshing the page always resets to `overview`. A user studying the Crypto panel loses their place.
- **No user personalization**: No watchlists, no favorites, no saved layouts. Every visit is a cold start.
- **Data refresh is invisible**: TanStack Query refetches silently. There is no "last updated" timestamp visible per panel (only a global StatusBar, presumably). Users can't tell if data is stale.
- **Error states are silent**: If Finnhub is down, the Stocks panel presumably renders empty with no user-facing error message (no ErrorBoundary, no error state handling confirmed in audit).

**7. Client-side form validation:** No forms exist currently (no auth, no watchlist input, no search). When forms are added (login, register, watchlist), validation will need to be built from scratch. Consider `react-hook-form` + `zod` for consistency with the planned backend validation.

**8. Accessibility:**
- No ARIA labels observed in layout components (Sidebar, TopBar, StatusBar).
- No keyboard navigation pattern visible in the Sidebar (likely relies on default browser behavior for clickable `div`s or `button`s — unconfirmed).
- No `focus-visible` styles confirmed in Tailwind config.
- Color contrast: Bloomberg-style dark terminals can struggle with WCAG AA on secondary text. Unverified without visual render.
- `ChangeIndicator.tsx` and `Sparkline.tsx` — numeric financial data relies on color (red/green) to convey meaning without text alternatives, which fails WCAG for color-blind users.

**9. Screens doing too much:** No screen is overloaded — each panel has a single domain (stocks, crypto, etc.). This is well-designed.

**10. Modals/dialogs:** None currently. When adding auth (login modal, watchlist create dialog), these will need proper focus trapping and keyboard escape handling.

**11. Component library consistency:** A coherent shared component set exists:
- `DataCard.tsx` — metric display card
- `ChangeIndicator.tsx` — red/green delta display
- `LoadingSkeleton.tsx` — loading placeholder
- `Sparkline.tsx` — mini chart
- `TickerBanner.tsx` — scrolling price ticker

This is a genuine strength — new screens can reuse these. The library is small but consistent.

---

## Recommendations

Ordered by priority:

1. **[P1]** Implement URL-based routing with React Router DOM — `frontend/src/App.tsx`, `frontend/src/main.tsx` — React Router is already installed but unused for panel navigation. Each panel should have its own URL (`/markets`, `/crypto`, `/macro`, etc.) so users can bookmark, share, and use browser history. This is a 2-hour change with large perceived quality improvement.

2. **[P1]** Add React ErrorBoundary — `frontend/src/App.tsx` or per-panel — Without error boundaries, any unhandled exception in a panel crashes the entire app silently. React 18's ErrorBoundary catches render errors and shows a fallback UI instead of a blank screen.

3. **[P1]** Add empty state components to all panels — `frontend/src/components/shared/EmptyState.tsx` — When an API returns empty data or a user's watchlist is empty, panels should render a meaningful empty state ("No data available — markets may be closed") rather than a blank section.

4. **[P1]** Build Login, Register, and Watchlist screens — new files — These are the highest-value missing screens for the resume enhancement goal. Each needs a spec before implementation.

5. **[P2]** Add "last updated" timestamp per panel — data freshness UX — Users of a financial terminal need to know if the data is from 30 seconds ago or 5 minutes ago. A small timestamp below each panel header (sourced from TanStack Query's `dataUpdatedAt`) solves this.

6. **[P2]** Improve mobile layout — `frontend/src/components/layout/Sidebar.tsx` — Add a collapsible/hamburger menu for viewports below `md`. The fixed sidebar at full width on mobile likely breaks the layout.

7. **[P3]** Add text alternatives to `ChangeIndicator.tsx` for color-blind accessibility — `frontend/src/components/shared/ChangeIndicator.tsx` — Supplement color coding with `▲`/`▼` arrows or `aria-label` attributes describing the direction of change.

---

## Protect List (this dimension)

| File | Score | Reason |
|------|-------|--------|
| `frontend/src/components/shared/DataCard.tsx` | 8/10 | Core display primitive used throughout. Extend for new data types, don't redesign. |
| `frontend/src/components/shared/LoadingSkeleton.tsx` | 8/10 | Clean loading pattern used consistently. |
| `frontend/src/components/layout/Sidebar.tsx` | 7/10 | Bloomberg sidebar pattern is intentional design. Add responsive toggle, don't rebuild. |

---

## Summary

EconoPulse's panel-per-domain UX structure is clean and intentional — the terminal metaphor is well-executed with a consistent component library and good separation of concerns. The critical gaps are the missing auth/watchlist screens (0 of 4 needed user-account screens exist), no URL-based routing (React Router is installed but unused), and no error boundaries. These are all achievable quick wins that dramatically improve the perceived quality and completeness of the app for a resume/portfolio context.
