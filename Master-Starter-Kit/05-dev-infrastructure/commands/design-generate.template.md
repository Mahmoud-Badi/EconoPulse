# /design-generate $ARGUMENT

Full multi-AI design pipeline. Generates a UI implementation spec by combining research, AI concept generation, review, and component selection.

## Prerequisites

- Gemini MCP server connected (for review + image generation)
- Stitch MCP server connected (for UI concept generation)
- Magic MCP server connected (for component selection)
- Design tokens and brand guidelines documented

## Steps

### Step 1: Check for Existing Design Brief

```bash
ls {DOCS_PATH}/design/research/$ARGUMENT-brief.md 2>/dev/null
```

- If **found**: Read it and proceed to Step 2.
- If **not found**: Run `/design-research $ARGUMENT` first, then continue.

### Step 2: Read Design Context

Read all relevant design documentation:

```
{DOCS_PATH}/design/DESIGN-TOKENS.md
{DOCS_PATH}/design/BRAND-GUIDELINES.md
{DOCS_PATH}/design/ANTI-SLOP-RULES.md (if exists)
{DOCS_PATH}/design/research/$ARGUMENT-brief.md
```

Extract:
- Primary, secondary, accent colors (hex values)
- Font family and size scale
- Spacing scale
- Border radius values
- Shadow levels
- Brand personality (e.g., "professional, trustworthy, efficient")
- Anti-slop constraints (what to avoid)

### Step 3: Generate UI Concept with Stitch

Use the Stitch MCP server to generate an initial UI concept:

```
generate_screen_from_text:
  Screen type: $ARGUMENT
  Description: {description from brief}
  Brand colors: {primary}, {secondary}, {accent}
  Font: {font family}
  Style: {brand personality adjectives}
  Requirements:
  - {key requirement 1 from brief}
  - {key requirement 2}
  - {key requirement 3}
  Avoid:
  - {anti-slop rule 1}
  - {anti-slop rule 2}
```

If Stitch returns a concept, save the generated HTML/Tailwind for reference.

If Stitch is unavailable, skip to Step 5 (component selection) and build the spec from the research brief directly.

### Step 4: Review Concept with Gemini

Use Gemini MCP to review the generated concept for quality:

```
gemini-analyze-image: [screenshot of Stitch concept]
  Prompt: "Review this UI concept for a {$ARGUMENT} screen. Rate the following on a scale of 1-10:
  1. Slop risk (generic/AI-looking design) — higher = worse
  2. Brand alignment with these colors: {primary}, {secondary}
  3. Information hierarchy and readability
  4. Professional quality suitable for B2B SaaS
  5. Accessibility (contrast, touch targets, text size)

  Also identify:
  - Top 3 strengths
  - Top 3 weaknesses
  - Specific improvements needed"
```

**If slop-risk score > 5**: Iterate on the concept. Generate a new version with more specific constraints addressing the identified weaknesses. Repeat up to 3 times.

**If slop-risk score <= 5**: Proceed to Step 5.

### Step 5: Select Components with Magic MCP

Use the Magic MCP server to find pre-built, polished components:

```
21st_magic_component_inspiration:
  Query: "{$ARGUMENT} UI components"
```

For each identified component need (header, table, card, form, etc.):

```
21st_magic_component_builder:
  Description: "{component description with brand constraints}"
```

Evaluate each Magic component against:
- Does it match the brand colors?
- Does it use Tailwind classes (compatible with our stack)?
- Does it include accessibility attributes?
- Is it responsive?

Select components that fit. Note which need customization and which can be used as-is.

### Step 6: Identify and Generate Assets

Review the concept for images and illustrations needed:

- Empty state illustration
- Background pattern or image
- Icons (if custom, beyond Lucide)
- Hero image or graphic

For each needed asset, run `/generate-asset {type}`:
```
/generate-asset empty-state for {$ARGUMENT}
/generate-asset auth-bg (if auth page)
/generate-asset icon for {specific use}
```

### Step 7: Output Implementation Spec

Generate a complete implementation specification:

```markdown
# Implementation Spec: $ARGUMENT

## Overview
{What this screen does, who uses it, primary user goals}

## Layout
{Describe the overall layout structure}
```
┌─────────────────────────────────────────┐
│ Header: PageTitle + Actions             │
├───────────────┬─────────────────────────┤
│               │                         │
│   Sidebar     │   Main Content          │
│   (if any)    │   - Section 1           │
│               │   - Section 2           │
│               │   - Section 3           │
│               │                         │
└───────────────┴─────────────────────────┘
```

## Components

### Component 1: {Name}
- **Type**: {card / table / form / chart / etc.}
- **Source**: {Magic MCP / custom / shadcn}
- **Data**: {tRPC query to use}
- **Props**: {key props and their types}
- **States**: loading, error, empty, data
- **Responsive**: {how it adapts at each breakpoint}
- **Tailwind classes**: {key classes to apply}

### Component 2: {Name}
...

## Styling
- **Background**: {class name, e.g., bg-background}
- **Cards**: {classes, e.g., rounded-xl shadow-sm border}
- **Spacing**: {gap/padding pattern, e.g., gap-6, p-6}
- **Typography**: headings use {classes}, body uses {classes}

## Interactions
1. {interaction 1 — e.g., "Clicking a table row opens detail drawer"}
2. {interaction 2 — e.g., "Status badge click opens status change dialog"}
3. {interaction 3}

## Assets Needed
| Asset | Type | Generated? | Path |
|-------|------|-----------|------|
| {name} | {type} | {yes/no} | {path if generated} |

## Implementation Order
1. {Build this component first}
2. {Then this component}
3. {Then wire up data}
4. {Then add interactions}
5. {Then responsive adjustments}
6. {Then loading/error/empty states}

## Anti-Slop Checklist
- [ ] No gradients on functional pages
- [ ] No decorative illustrations that add no information
- [ ] Consistent spacing (no arbitrary values)
- [ ] Dense enough for power users (not marketing-page spacious)
- [ ] Real data looks good (not just demo data)
- [ ] Dark mode compatible (if applicable)
```

Save to:
```
{DOCS_PATH}/design/specs/$ARGUMENT-spec.md
```

### Output Summary

```
DESIGN PIPELINE COMPLETE
=========================
Screen: $ARGUMENT
Concept: {Stitch generated / manual}
Slop Score: {1-10 from Gemini review}
Components Selected: {count} ({list with sources})
Assets Generated: {count}

Spec saved to: {DOCS_PATH}/design/specs/$ARGUMENT-spec.md

Next: Implement the spec using /scaffold-page $ARGUMENT and the component details above.
```

## Notes

- The full pipeline takes 5-15 minutes depending on MCP server response times.
- If any MCP server is unavailable, skip that step and note it. The pipeline degrades gracefully.
- The implementation spec is the deliverable. It should contain enough detail for `/scaffold-page` and manual implementation to produce a polished result.
- Always run `/design-verify` and `/design-review` after implementing from the spec.
- Iteration is expected. The first concept rarely matches the brand perfectly. Budget 2-3 iterations in Step 4.
