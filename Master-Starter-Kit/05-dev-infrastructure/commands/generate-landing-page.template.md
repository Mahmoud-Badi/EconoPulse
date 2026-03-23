# /generate-landing-page $ARGUMENT

Generate landing page copy and structure for {{PROJECT_NAME}}. The optional `$ARGUMENT` specifies the page type: `homepage`, `pricing`, `feature`, or `campaign`. Defaults to `homepage` if not specified.

## When to Use

- After brand messaging is defined (Step 20 of orchestrator)
- When launching a new feature or campaign
- When A/B testing landing page variants
- When refreshing marketing copy

## Steps

### Step 1: Read Brand Foundations

Read these files to establish voice and messaging:
- `19-marketing/brand-messaging/brand-voice-guide.template.md` (or generated version)
- `19-marketing/brand-messaging/value-proposition-canvas.template.md`
- `19-marketing/brand-messaging/messaging-framework.template.md`

### Step 2: Read Copy Frameworks

Read `19-marketing/website-and-landing-pages/copywriting-formulas.md` for:
- AIDA, PAS, BAB frameworks
- Headline formulas
- CTA copy patterns

### Step 3: Run Landing Page Generator

Run `19-marketing/generators/LANDING-PAGE-COPY-GENERATOR.md` for the specified page type:

**If `homepage` or default:**
- Hero section: 3 headline options + sub-headlines + CTA
- Social proof bar: user count, ratings, logos
- Problem/solution sections
- Feature showcase (3-6 key features)
- How it works (3-step process)
- Testimonial section structure
- FAQ (8-10 questions)
- Final CTA

**If `pricing`:**
- Pricing page structure from `19-marketing/website-and-landing-pages/pricing-page-strategy.template.md`
- Tier card copy, feature comparison table
- FAQ addressing pricing objections

**If `feature`:**
- Feature-specific landing page
- Problem → solution → demo → proof → CTA structure

**If `campaign`:**
- Campaign-specific landing page
- Urgency/scarcity elements, focused CTA

### Step 4: Generate A/B Variants

For each key section, generate:
- 3 headline variants (different approaches: benefit, curiosity, social proof)
- 2 CTA variants (different value propositions)
- 2 social proof variants (different proof types)

### Step 5: Apply SEO

Read `19-marketing/seo-and-content/seo-technical-checklist.md` and generate:
- Page title tag (60 chars)
- Meta description (155 chars)
- Open Graph tags
- Schema markup suggestions

### Step 6: Save

Save to `{{DOCS_PATH}}/marketing/landing-pages/{page-type}-copy.md`

### Output

```
LANDING PAGE COPY GENERATED
============================
Page type: $ARGUMENT
Sections: {count}
Headline variants: {count}
CTA variants: {count}

Saved to: {path}

A/B Testing Priority:
1. Test headline variants first
2. Test CTA copy second
3. Test social proof placement third

Next: Implement the landing page using /design-generate landing-page
```

## Notes

- Generated copy uses the brand voice from the messaging framework. If brand voice hasn't been defined, run orchestrator Step 20 first.
- All copy includes both short and long variants for responsive design.
- Social proof sections use placeholder markers — replace with real testimonials and metrics as they become available.
