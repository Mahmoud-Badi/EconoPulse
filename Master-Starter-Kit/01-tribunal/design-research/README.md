# Design Research

## Purpose

Design research establishes the visual and interaction direction for the product **before any UI code is written**. The goal is to arrive at Round 3 (Design Direction) with concrete references, a clear vocabulary, and specific anti-patterns — not vague adjectives like "modern" and "clean."

Good design research answers: "When someone opens our app for the first time, what should they **feel**? And what specific visual patterns create that feeling?"

## When to Do Design Research

- **Full Tribunal:** Always. Produce both the design brief and UX patterns catalog.
- **Abbreviated Tribunal:** Skip the formal research process. Pick 2-3 reference products, note what you like about each, and decide direction in 15 minutes during Round 4.

## Research Process

### Step 1: Identify Best-in-Class Products (30 minutes)

Don't limit yourself to direct competitors. Look for products in **adjacent domains** that solve similar UX challenges:

| Your Challenge | Adjacent Products to Study |
|---------------|---------------------------|
| Data-heavy dashboard | Stripe Dashboard, Datadog, Grafana |
| Kanban / board views | Linear, Notion, Monday.com |
| Scheduling / calendars | Calendly, Cal.com, Google Calendar |
| Maps / geospatial | Uber, DoorDash, Mapbox Studio |
| Data tables | Airtable, Notion, Retool |
| Chat / messaging | Slack, Intercom, Crisp |
| Forms / data entry | Typeform, Tally, JotForm |
| Settings / configuration | Vercel, GitHub, Stripe |

Target: **5-8 products** total. At least 2 should be from your direct domain; the rest can be from adjacent domains with excellent UX.

### Step 2: Scrape Reference Material (Firecrawl)

For each reference product, scrape:

| Target | Why |
|--------|-----|
| Landing page | Brand personality, color usage, typography |
| Product screenshots / demos | Layout patterns, data density, component style |
| Pricing page | How they present complexity simply |
| Documentation / help center | Information architecture, navigation patterns |
| Blog / changelog | Visual consistency across contexts |

### Step 3: Pattern Analysis (Gemini)

Feed scraped material to Gemini with this prompt:

```
Analyze the UI/UX patterns across these [N] products.

Products analyzed: [List]
Domain context: [What our product does and who uses it]

Produce:
1. Common navigation patterns (sidebar, topbar, breadcrumbs, tabs)
2. Data density approaches (sparse vs. dense, when each is used)
3. Color language patterns (how status, urgency, and health are communicated)
4. Typography patterns (font choices, hierarchy, weight usage)
5. Data table patterns (sorting, filtering, actions, selection, pagination)
6. Dashboard patterns (KPI layout, chart types, refresh patterns)
7. Form patterns (layout, validation, progressive disclosure)
8. Mobile patterns (responsive vs. adaptive, what gets hidden on mobile)
9. Common anti-patterns (what the worst implementations do wrong)
10. Recommended direction for our product (based on our domain and user types)
```

### Step 4: Produce Outputs

Fill out:
- `design-brief.template.md` — the approved design direction
- `ux-patterns.template.md` — patterns organized by screen type

## Focus Areas

### Data Density

The right data density depends on your user type:

| User Type | Density | Reasoning |
|-----------|---------|-----------|
| Power users (dispatchers, traders, analysts) | High | They need to see many items at once; they scan, not read |
| Occasional users (managers, executives) | Medium | They need summaries with drill-down capability |
| External users (customers, patients) | Low | They need clarity and guidance; too much data is overwhelming |

### Color Language

Color communicates status faster than text. Establish conventions early:

| Signal | Common Colors | Usage |
|--------|--------------|-------|
| Success / Healthy / Complete | Green (#22c55e) | Completed tasks, active statuses, positive KPIs |
| Warning / Attention | Amber/Yellow (#f59e0b) | Expiring items, moderate alerts, approaching limits |
| Error / Critical / Overdue | Red (#ef4444) | Failed tasks, overdue items, critical alerts |
| Info / Neutral / In-Progress | Blue (#3b82f6) | Active items, informational messages, links |
| Inactive / Disabled / Draft | Gray (#6b7280) | Draft items, disabled controls, historical data |

### Navigation Patterns

| Pattern | Best For | Considerations |
|---------|----------|---------------|
| Left sidebar | Apps with 5+ top-level sections, deep navigation | Consumes horizontal space; collapsible is essential |
| Top nav bar | Simple apps with 3-5 sections | Doesn't scale well beyond 7 items |
| Tab bar (bottom, mobile) | Mobile-first apps with 3-5 primary actions | Limited to 5 tabs; requires careful prioritization |
| Breadcrumbs | Deep hierarchies (settings, nested entities) | Supplements, doesn't replace primary navigation |
| Command palette | Power users who prefer keyboard | Must coexist with mouse-based navigation |

### Data Table Patterns

Data tables are the most complex UI component in most business applications. Research should cover:

- **Column configuration:** Can users show/hide columns? Reorder them?
- **Sorting:** Single-column? Multi-column?
- **Filtering:** Faceted filters? Text search? Advanced query builder?
- **Row actions:** Inline actions? Hover actions? Bulk selection?
- **Pagination:** Infinite scroll? Page numbers? Load-more button?
- **Empty states:** What shows when the table has no data?
- **Loading states:** Skeleton screens? Spinners? Progressive loading?
- **Responsiveness:** How does the table behave on mobile? (Horizontal scroll, card layout, or hidden columns?)

### Mobile Strategy

| Strategy | When to Use |
|----------|------------|
| **Responsive (same app, adapts)** | Most B2B SaaS. One codebase, flexible layout. |
| **Adaptive (different layout per breakpoint)** | When mobile users have fundamentally different tasks. |
| **Mobile-first** | When the primary user is on mobile (drivers, field workers). |
| **Separate native app** | When mobile needs offline support, GPS, camera, or push notifications. |
| **Desktop only** | When all users are at desks and mobile adds no value. Be honest about this. |

## Output Files

```
design-research/
  README.md                       # This file
  design-brief.template.md       # Design direction output
  ux-patterns.template.md        # UX patterns by screen type
  design-brief.md                # Filled design direction
  ux-patterns.md                 # Filled patterns catalog
```

## Tips

- **Screenshot aggressively.** Products change. Save screenshots to a local folder with clear naming (e.g., `stripe-dashboard-kpi-cards.png`).
- **Note the negative.** Bad examples are as valuable as good ones. "Competitor X's dispatch board uses 8 different shades of blue and I can't tell what's active vs. completed" is a concrete anti-pattern.
- **Consider the 5-second test.** When a user first opens each major screen, what should they understand within 5 seconds? If the answer isn't obvious, the design has a hierarchy problem.
- **Don't copy — translate.** Stripe's dashboard is beautiful, but a transportation dispatcher doesn't need Stripe's layout. Borrow the principles (clear hierarchy, consistent spacing, status color language) and translate them to your domain.
- **Prototype critical screens.** Before Round 3, consider using Stitch or Figma to create low-fidelity mockups of the 3-5 most important screens. Visual proposals generate better feedback than written descriptions.
