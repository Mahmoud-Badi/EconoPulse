# /scrape-reference $ARGUMENT

Scrape a website for design reference data. Extracts layout patterns, colors, typography, spacing, component styles, and visual hierarchy.

## Steps

### Step 1: Scrape the Target URL

Use the Firecrawl MCP server:

```
firecrawl_scrape:
  url: $ARGUMENT
  formats: ["markdown", "html"]
```

If Firecrawl is unavailable, fall back to WebFetch:
```
WebFetch: $ARGUMENT
  prompt: "Extract the full page structure, layout patterns, colors, typography, and UI components used."
```

### Step 2: Extract Design Patterns

From the scraped content, analyze and extract:

#### Layout Patterns
- Overall page structure (sidebar, top-nav, content area, footer)
- Grid system (columns, breakpoints, gaps)
- Content width constraints (max-width values)
- Header/navigation pattern (sticky, scrolling, transparent)
- Footer structure

#### Color Palette
- Primary brand color(s) -- extracted from buttons, links, accents
- Background colors -- page, card, section backgrounds
- Text colors -- heading, body, muted/secondary text
- Status/semantic colors -- success, warning, error, info
- Border colors

Format as Tailwind-compatible values:
```
Primary: #3B82F6 → closest Tailwind: blue-500
Background: #F9FAFB → closest Tailwind: gray-50
Text: #111827 → closest Tailwind: gray-900
Muted: #6B7280 → closest Tailwind: gray-500
Border: #E5E7EB → closest Tailwind: gray-200
```

#### Typography
- Font family (heading, body, mono)
- Font sizes used (headings h1-h6, body, small, caption)
- Font weights (headings, body, emphasis)
- Line heights
- Letter spacing

#### Spacing
- Section padding (vertical, horizontal)
- Card padding
- Gap between elements (cards, list items, form fields)
- Margin patterns

#### Component Styles
For each notable component on the page:
- **Buttons**: size, padding, border-radius, shadow, hover state
- **Cards**: padding, shadow, border, border-radius, background
- **Tables**: header style, row height, hover state, borders
- **Forms**: input style, label placement, error states
- **Badges/Tags**: size, colors, border-radius
- **Navigation**: item spacing, active indicator, hover state
- **Modals/Dialogs**: overlay style, max-width, padding, animation

#### Visual Hierarchy
- How the page guides attention (size, color, position, whitespace)
- What stands out first, second, third
- How sections are separated (borders, backgrounds, spacing)

### Step 3: Compare Against Current Design Tokens

Read current design tokens:
```
{DOCS_PATH}/design/DESIGN-TOKENS.md
```

Compare the scraped reference against your tokens:

```
COMPARISON:
┌────────────────┬──────────────────┬──────────────────┐
│ Element        │ Reference Site   │ Our Tokens       │
├────────────────┼──────────────────┼──────────────────┤
│ Primary        │ {ref color}      │ {our color}      │
│ Card shadow    │ {ref shadow}     │ {our shadow}     │
│ Border radius  │ {ref radius}     │ {our radius}     │
│ Body font      │ {ref font}       │ {our font}       │
│ Spacing scale  │ {ref spacing}    │ {our spacing}    │
└────────────────┴──────────────────┴──────────────────┘
```

Note meaningful differences and whether adopting the reference's approach would improve the design.

### Step 4: Check Against Anti-Slop Rules

Review the reference for patterns that look AI-generated or generic:

- [ ] Does it use gradients on functional pages? (bad)
- [ ] Does it have excessive whitespace? (bad for B2B tools)
- [ ] Are illustrations decorative or informative? (informative = good)
- [ ] Is the color palette distinct or generic blue-white? (distinct = good)
- [ ] Are components dense enough for power users? (dense = good for tools)
- [ ] Does it have personality or could it be any SaaS? (personality = good)

Flag any anti-slop violations found in the reference. Note patterns to adopt and patterns to explicitly avoid.

### Step 5: Output Structured Reference Document

```markdown
# Design Reference: {site name}
Source: $ARGUMENT
Scraped: {today's date}

## Layout
{layout description}

## Color Palette
| Role | Hex | Tailwind Equivalent |
|------|-----|-------------------|
| Primary | {hex} | {tw class} |
| Background | {hex} | {tw class} |
| Text | {hex} | {tw class} |
| ... | ... | ... |

## Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | {font} | {size} | {weight} |
| Body | {font} | {size} | {weight} |
| ... | ... | ... | ... |

## Component Styles
### Buttons
{description with Tailwind-equivalent classes}

### Cards
{description with Tailwind-equivalent classes}

### Tables
{description with Tailwind-equivalent classes}

## Spacing Pattern
{description of spacing approach}

## Key Takeaways
1. {What to adopt from this reference}
2. {What to adapt/modify}
3. {What to avoid}

## Comparison to Our Tokens
{table from Step 3}

## Anti-Slop Notes
{findings from Step 4}
```

### Step 6: Save (Optional)

If the reference is reusable (not a one-time lookup):

```
Save to: {DOCS_PATH}/design/references/{site-name}-reference.md
```

### Output

```
REFERENCE SCRAPED
==================
Source: $ARGUMENT
Patterns extracted: layout, colors ({count}), typography ({count}), components ({count}), spacing
Comparison: {count} differences from our tokens noted
Anti-slop: {count} concerns flagged

{If saved}: Saved to {DOCS_PATH}/design/references/{site-name}-reference.md
{If not saved}: Output displayed above (not saved — one-time reference)

Key insight: {single most useful finding from this reference}
```

## Notes

- This command requires the Firecrawl MCP server or WebFetch as fallback.
- Not every scraped site will have all design elements visible. Some sites use CSS-in-JS or minified styles that are hard to extract. Focus on what's visually observable.
- Color extraction from markdown is approximate. For exact values, inspect the site in browser DevTools.
- Save references only if you'll refer back to them during implementation. One-time lookups don't need to be persisted.
- This command is read-only -- it extracts data but doesn't modify your codebase.
