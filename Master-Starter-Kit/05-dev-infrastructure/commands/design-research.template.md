# /design-research $ARGUMENT

Research UX/UI patterns for a specific screen type by analyzing reference products and current trends.

## Steps

### Step 1: Identify Reference Products

Based on the screen type `$ARGUMENT`, select reference products known for excellent UX in this category:

| Screen Type | Primary References | Secondary References |
|-------------|-------------------|---------------------|
| Dashboard | Vercel, Linear, Stripe Dashboard | Datadog, Grafana |
| List / Data Table | Stripe, Airtable, Notion | GitHub Issues, Linear |
| Detail Page | Stripe, GitHub PR View | Linear Issue, Jira |
| Form / Wizard | Stripe Onboarding, Typeform | Clerk, Auth0 |
| Kanban / Board | Linear, Trello, Jira | Monday.com, Asana |
| Calendar / Scheduler | Cal.com, Google Calendar | Calendly, Notion Calendar |
| Settings | GitHub Settings, Vercel Settings | Stripe Settings, Linear |
| Chat / Messaging | Slack, Discord | Intercom, Crisp |
| Auth / Login | Clerk, Auth0 | Vercel, Linear |
| Map / Geographic | Google Maps, Uber | Waze, Mapbox examples |
| Analytics / Charts | PostHog, Mixpanel | Amplitude, Plausible |
| Billing / Pricing | Stripe Billing, Vercel Pricing | AWS Console, Paddle |

### Step 2: Scrape Design Galleries

Use Firecrawl MCP to scrape design inspiration galleries:

```
firecrawl_scrape: https://dribbble.com/search/$ARGUMENT-dashboard-design
firecrawl_scrape: https://www.awwwards.com/websites/$ARGUMENT/
```

Extract:
- Common layout patterns (sidebar, top-nav, card grid, etc.)
- Color palette trends (dark mode, muted colors, accent usage)
- Typography patterns (font pairings, heading sizes)
- Spacing patterns (dense vs. spacious)
- Interactive patterns (hover effects, transitions, micro-interactions)

### Step 3: Scrape 2 Reference Apps

Use Firecrawl MCP to scrape 2 of the identified reference apps:

```
firecrawl_scrape: {reference_app_1_url}
firecrawl_scrape: {reference_app_2_url}
```

For each, extract:
- Page structure (header, sidebar, main content, footer)
- Component library used (shadcn, Radix, custom)
- Color scheme (light/dark, primary/accent colors)
- Data density (cards vs. tables, compact vs. spacious)
- Navigation patterns (breadcrumbs, tabs, sidebar sections)
- Action patterns (CTAs, dropdowns, modals, drawers)
- Status indicators (badges, dots, progress bars)
- Empty states and loading patterns

### Step 4: Gemini Deep Research

Use the Gemini MCP server for deep research on current trends:

```
gemini-deep-research: "Current UX/UI best practices for {$ARGUMENT} screens in SaaS/B2B applications 2025-2026. Focus on: layout patterns, data visualization, information hierarchy, accessibility, interaction design, and anti-patterns to avoid."
```

Extract:
- Emerging trends specific to this screen type
- Accessibility requirements (WCAG 2.2)
- Performance considerations (lazy loading, virtualization)
- Mobile-first vs. desktop-first recommendations
- Anti-patterns to actively avoid

### Step 5: Synthesize Design Brief

Combine all research into a structured design brief:

```markdown
# Design Brief: $ARGUMENT

## Screen Type
{description of what this screen does and its primary user goals}

## Patterns Observed
### Layout
- {common layout pattern 1 — e.g., "Two-column: sidebar nav + main content area"}
- {pattern 2}

### Components
- {component pattern 1 — e.g., "KPI cards in a 4-column grid at top"}
- {component pattern 2}

### Color & Visual
- {color usage pattern — e.g., "Muted backgrounds (gray-50), white cards with subtle shadows"}
- {visual pattern}

### Interaction
- {interaction pattern — e.g., "Hover reveals action buttons on table rows"}
- {pattern 2}

### Data Display
- {data pattern — e.g., "Tables for >5 columns, card grids for <5 attributes per item"}
- {pattern 2}

## Standout Examples
### {Reference App 1}
- What works: {specific elements that are excellent}
- Screenshot/reference: {URL or description}

### {Reference App 2}
- What works: {specific elements}
- Screenshot/reference: {URL or description}

## Domain-Specific Insights
{How these patterns apply specifically to {DOMAIN} / your industry}
- {insight 1 — e.g., "NEMT dispatchers need dense data views, not spacious dashboards"}
- {insight 2}

## Anti-Slop Notes
Avoid these common AI-generated design mistakes:
- Excessive whitespace that wastes screen real estate
- Generic blue-white color schemes with no brand identity
- Card-heavy layouts when a table would be more efficient
- Decorative illustrations that add no information
- Oversized headings that push content below the fold
- Rounded-everything without hierarchy distinction
- Gradient backgrounds on functional (non-marketing) pages

## Recommended Approach
{Specific, actionable recommendation for implementing this screen}
1. {step 1 — e.g., "Use a dense table layout with inline actions, not a card grid"}
2. {step 2}
3. {step 3}
```

### Step 6: Save the Brief

Save to:
```
{DOCS_PATH}/design/research/$ARGUMENT-brief.md
```

### Output

```
DESIGN RESEARCH COMPLETE
=========================
Screen type: $ARGUMENT
References analyzed: {count}
Galleries scraped: {count}
Gemini research: {summary of key findings}

Brief saved to: {DOCS_PATH}/design/research/$ARGUMENT-brief.md

Key Takeaways:
1. {most important finding}
2. {second finding}
3. {third finding}

Next: Run /design-generate $ARGUMENT to create the implementation spec.
```

## Notes

- This command requires Firecrawl MCP and Gemini MCP servers to be connected.
- If MCP servers are unavailable, fall back to manual analysis of known reference URLs via WebFetch.
- The anti-slop notes are critical -- AI-generated designs tend toward generic, over-decorated patterns. The brief should actively counter this tendency.
- Save the brief for reference during implementation. It serves as the "why" behind design decisions.
- Run this once per screen type, not once per page. A "list page" brief covers all list pages in the app.
