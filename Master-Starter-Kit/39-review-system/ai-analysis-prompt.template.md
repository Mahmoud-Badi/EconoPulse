# AI Design Review Analysis Prompt

Use this prompt template to feed exported review JSON to Claude/AI for design direction synthesis.

## Prompt Template

```
You are a senior UI/UX designer analyzing design review feedback for {{PROJECT_NAME}}.

The team has reviewed {{TOTAL_DESIGNS}} design variations across {{SCREEN_COUNT}} screen types and {{STYLE_COUNT}} visual styles. Below is the exported review data in JSON format.

## Review Data

{{REVIEW_JSON}}

## Your Task

Analyze the review data and produce a **Design Direction Document** with these sections:

### 1. Executive Summary
- Which styles were most/least favored overall?
- What's the overall consensus strength (strong agreement vs. split opinions)?
- One-sentence design direction recommendation.

### 2. Style Rankings
For each style, provide:
- Average rating across all screens
- Approval/rejection count
- Standout strength (what reviewers liked most)
- Primary weakness (what reviewers disliked)
- Verdict: ADOPT / ADAPT / REJECT

### 3. Per-Screen Winners
For each screen type:
- Which style scored highest?
- Why (based on element feedback and notes)?
- Any screen where reviewers disagreed — flag for discussion.

### 4. Element Preference Map
Analyze the element-level feedback (liked/disliked tags) to identify:
- **Universally liked elements**: Elements liked across multiple styles/screens
- **Universally disliked elements**: Elements disliked consistently
- **Style-specific wins**: Elements that only work in certain styles
- Pattern: "Reviewers consistently prefer [X approach] over [Y approach] for [element type]"

### 5. Composite Direction
Based on the data, define the winning direction as a MIX of the best elements:
- "Take the [header] approach from [Style X]"
- "Use the [color palette] from [Style Y]"
- "Adopt the [layout pattern] from [Style Z] for [screen type]"

This is the most valuable section — it's rarely one style that wins entirely.

### 6. Token Implementation Plan
From the composite direction, extract concrete design token decisions:
- **Colors**: Primary, secondary, accent, neutral palette (with hex values if visible in designs)
- **Typography**: Heading style, body style, mono style
- **Spacing**: Dense vs. spacious, specific gap/padding patterns observed
- **Borders**: Radius preference (sharp, slightly rounded, very rounded)
- **Shadows**: Flat vs. elevated, shadow intensity
- **Layout**: Sidebar vs. top-nav, card-based vs. table-based, dense vs. airy

### 7. Open Questions
Flag any areas where:
- Reviews were split (no clear winner)
- Notes mentioned concerns not captured in ratings
- Important screens had no strong preference
- Element feedback contradicted overall style ratings

Format the output as a markdown document suitable for handoff to the development team.
Prioritize actionable decisions over observations.
```

## Usage

### Via /review:report
The `/review:report` command reads the export JSON and fills this template automatically.

### Manual
1. Export the review JSON from the gallery (Export button)
2. Copy this prompt template
3. Replace `{{REVIEW_JSON}}` with the exported JSON
4. Replace `{{PROJECT_NAME}}`, `{{TOTAL_DESIGNS}}`, `{{SCREEN_COUNT}}`, `{{STYLE_COUNT}}`
5. Send to Claude or any LLM

## Expected Output

The AI should produce a markdown document of 800-1500 words that:
- Makes a clear recommendation (not "it depends")
- References specific styles and screens by name
- Provides actionable token values
- Identifies the 2-3 decisions that need human discussion
- Can be directly used as input to Step 13.2 (Token Foundation)

## Output Location

Save the generated design direction document to:
```
dev_docs/foundations/design-direction.md
```

This file is then read by Step 13.2 (Token Foundation) to inform design token values.
