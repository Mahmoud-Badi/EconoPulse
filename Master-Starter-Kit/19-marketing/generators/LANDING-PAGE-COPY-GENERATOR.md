# Landing Page Copy Generator

**Purpose:** Generate complete, conversion-optimized landing page copy for every section of
the product's primary landing page. Produces multiple variants per section for A/B testing,
applies proven copywriting formulas, and adapts tone/structure to product type.

**Output:** `marketing/website-and-landing-pages/landing-page-copy.md`

---

## When to Run

Run this generator after completing:
1. Marketing Intake (Step 19) -- MARKETING_CONFIG is populated
2. Brand & Messaging (Step 21) -- brand voice guide and messaging framework exist
3. Value Proposition Canvas -- jobs, pains, and gains are defined

Run BEFORE the marketing plan generator, as the plan references landing page copy as a
Month 1 deliverable.

---

## Inputs Required

| Input | Location | What it provides |
|-------|----------|-----------------|
| MARKETING_CONFIG | Orchestrator STATE BLOCK | Product type, UVP, pricing, audience |
| Brand Voice Guide | `marketing/brand-messaging/brand-voice-guide.md` | Tone, personality, do/don't language |
| Value Proposition Canvas | `marketing/brand-messaging/value-proposition-canvas.md` | Jobs-to-be-done, pains, gains |
| Messaging Framework | `marketing/brand-messaging/messaging-framework.md` | Key messages, proof points, objection handling |
| Competitor Marketing Audit | `marketing/market-research/competitor-marketing-audit.md` | Competitor positioning, messaging, CTA approaches |
| Product Features | Project brief or tribunal specs | Feature list with descriptions |
| User Personas | `dev_docs/user-personas.md` | Target users, their language, pain points |

---

## Generation Algorithm

1. **Read the value proposition canvas.** Extract:
   - Customer jobs (functional, social, emotional)
   - Customer pains (frustrations, risks, obstacles)
   - Customer gains (desired outcomes, benefits, surprises)
   - Pain relievers your product provides
   - Gain creators your product provides

2. **Read the messaging framework.** Extract:
   - Primary message (headline-level)
   - Secondary messages (supporting points)
   - Proof points (evidence, numbers, testimonials)
   - Objection handling (for FAQ section)

3. **Read the brand voice guide.** Apply:
   - Tone (formal/casual/technical/friendly)
   - Vocabulary preferences (words to use, words to avoid)
   - Sentence structure preferences (short punchy vs. detailed explanatory)

4. **Read competitor marketing audit.** Note:
   - Competitor headline approaches (to differentiate from, NOT copy)
   - Competitor CTA strategies
   - Gaps in competitor messaging you can exploit

5. **Generate each landing page section** using the copywriting formulas specified below.

6. **Apply conditional formatting** based on `{{PRODUCT_TYPE}}`.

7. **Validate** all copy against character limits and quality gates.

---

## Copywriting Formulas Reference

Apply these formulas throughout generation. Each section below specifies which formula to use.

### AIDA (Attention, Interest, Desire, Action)
- **Attention:** Grab with a bold statement or question
- **Interest:** Present the problem or opportunity
- **Desire:** Show how your product delivers the solution
- **Action:** Clear CTA with low friction

### PAS (Problem, Agitation, Solution)
- **Problem:** State the pain point in the customer's language
- **Agitation:** Make the problem feel urgent (cost of inaction)
- **Solution:** Present your product as the answer

### BAB (Before, After, Bridge)
- **Before:** Describe life without your product (the struggle)
- **After:** Describe life with your product (the outcome)
- **Bridge:** Your product is the bridge between the two

### 4U Framework (Useful, Urgent, Unique, Ultra-Specific)
- Apply to headlines: Is it useful? Is it urgent? Is it unique? Is it specific?

---

## Output Format

Write to `marketing/website-and-landing-pages/landing-page-copy.md`:

```markdown
# Landing Page Copy -- {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Target Persona:** {{PRIMARY_PERSONA}}
> **Brand Voice:** {{BRAND_VOICE_SUMMARY}}
> **Generated:** {{DATE}}

---

## Section 1: Hero

**Formula applied:** AIDA (Attention + Interest in headline, Desire in sub-headline, Action in CTA)

### Headline Options (pick one, A/B test the rest)

**Option A (Benefit-Led):**
> {Headline that leads with the primary benefit. 5-10 words. Speaks directly to the
> customer's #1 desired outcome. No jargon.}

**Option B (Problem-Led):**
> {Headline that calls out the primary pain point. Uses PAS formula. Creates "that's me!"
> recognition in the reader.}

**Option C (Curiosity/Disruptor):**
> {Headline that challenges conventional thinking or creates an information gap. Bold,
> slightly provocative, makes the reader want to learn more.}

### Sub-Headline Options (pair with headline)

**Option A:**
> {1-2 sentences expanding on the headline. Explains WHAT the product does and WHO it's for.
> Include a specific number or timeframe if possible.}

**Option B:**
> {Alternative sub-headline with different angle. If headline is benefit-led, sub-headline
> is problem-led, and vice versa.}

**Option C:**
> {Social proof sub-headline. "Join X,000 {audience type} who already {outcome}." Only use
> if you have real numbers.}

### CTA Button Text

| Option | Button Text | Below-Button Text |
|--------|-------------|-------------------|
| A | {primary CTA -- action verb + outcome} | {reduce friction: "No credit card required"} |
| B | {alternative CTA -- lower commitment} | {social proof: "X,000 users and counting"} |
| C | {curiosity CTA -- "See how it works"} | {time promise: "Takes less than 2 minutes"} |

### Supporting Text
{One sentence that reduces the biggest objection to clicking the CTA. Example: "Free
14-day trial. No credit card. Cancel anytime."}

---

## Section 2: Social Proof Bar

**Purpose:** Immediately build credibility below the hero.

### If You Have Users/Customers:
- **User count:** "{N}+ {user type} trust {{PROJECT_NAME}}"
- **Star rating:** "{X}/5 stars on {platform}" (only if 4.0+)
- **Company logos:** Display 4-6 recognizable customer logos

### If Pre-Launch (No Users Yet):
- **Waitlist count:** "{N} people on the waitlist" (only if 100+)
- **Backed by:** "Built by {credentials -- ex-Google, YC-backed, 10yr industry vet}"
- **Press mentions:** "As seen in {publication}" (only if real)
- **Technology trust:** "Built with {trusted tech stack}" (for dev tools)

### If Neither:
- Skip this section entirely. Do NOT fabricate social proof. Instead, move the problem
  section directly below the hero and let the copy do the trust-building.

---

## Section 3: Problem Statement

**Formula applied:** PAS (Problem, Agitation, Solution -- this section covers P and A only)

### Heading
> "{Question that makes the reader nod 'yes'}" or "The problem with {current approach}"

### Pain Point Copy

**Variant A (Empathy-Led):**
> {2-3 sentences acknowledging the reader's frustration. Use EXACT language from
> CUSTOMER_LANGUAGE in MARKETING_CONFIG. Show that you understand their world.}

**Variant B (Cost-of-Inaction):**
> {2-3 sentences quantifying what the problem costs the reader. Time wasted, money lost,
> opportunities missed. Use specific numbers where possible.}

**Variant C (Comparison):**
> {2-3 sentences comparing the "old way" (manual, expensive, frustrating) with what
> should be possible. Set up the contrast for the solution section.}

### Pain Point Bullets (use in all variants)
- {Pain point 1 -- from value proposition canvas, in customer language}
- {Pain point 2}
- {Pain point 3}
- {Pain point 4 (optional)}

---

## Section 4: Solution Statement

**Formula applied:** BAB (this section is the "After" and the "Bridge")

### Heading
> "Meet {{PROJECT_NAME}}" or "{Outcome statement}" or "There's a better way"

### Solution Copy
> {3-4 sentences explaining how {{PROJECT_NAME}} solves the problems listed above. Focus on
> OUTCOMES, not features. Do not list feature names -- describe what the user can now DO.
> Match the brand voice guide tone.}

### Key Outcome Bullets
- {Outcome 1 -- what they can now achieve, with specific metric if possible}
- {Outcome 2}
- {Outcome 3}

---

## Section 5: Features

**Generate 3-6 features based on product complexity.**

### Feature {N}: {Feature Name}

**Headline:** {5-8 word benefit statement -- not the feature name, but what it enables}

**Description:** {2-3 sentences explaining the feature in terms of user benefit.
Start with what the user can DO, then briefly explain how. Avoid technical jargon
unless the audience is technical (dev_tool product type).}

**Icon Suggestion:** {Describe an icon concept. Examples: "Clock with checkmark (time saved)",
"Shield with lock (security)", "Graph trending up (growth)". Designer will source actual icon.}

**Proof Point:** {If available: "Saves an average of X hours per week" or "Used by X% of
our power users" or "Replaces {manual process}"}

{Repeat for each feature. Prioritize features by:}
{1. Features that directly address the top pain point}
{2. Features that differentiate from competitors}
{3. Features that are visually demonstrable}

---

## Section 6: How It Works

**Purpose:** Reduce perceived complexity. Show the path from sign-up to value.

### Heading
> "How it works" or "Get started in 3 steps" or "From {problem} to {outcome} in minutes"

### Step 1: {Action Verb}
**Title:** {4-6 word step title}
**Description:** {1-2 sentences. What the user does, how long it takes, and what happens.}
**Visual suggestion:** {Screenshot or illustration concept}

### Step 2: {Action Verb}
**Title:** {4-6 word step title}
**Description:** {1-2 sentences. This step should show the core product experience.}
**Visual suggestion:** {Screenshot or illustration concept}

### Step 3: {Action Verb}
**Title:** {4-6 word step title}
**Description:** {1-2 sentences. This step shows the OUTCOME -- what the user achieves.}
**Visual suggestion:** {Screenshot or illustration concept}

### Below Steps CTA
> {Repeat the primary CTA from the hero. Same button text, same friction-reducer.}

---

## Section 7: Testimonials

**Purpose:** Let customers sell for you. Most persuasive section of any landing page.

### If You Have Testimonials:

**Format per testimonial:**
> "{Quote -- 1-3 sentences. Must be specific about the outcome, not generic praise.
> 'This tool is great!' is weak. 'We cut our scheduling time from 4 hours to 20 minutes'
> is strong.}"
>
> -- **{Full Name}**, {Title} at {Company} | {Photo placeholder}

**Placement guidance:**
- Use 3 testimonials minimum, 5 maximum
- Each testimonial should address a different benefit or objection
- Include at least one testimonial from each primary persona
- Video testimonials outperform text by 2-3x (note where video is available)

### If Pre-Launch (No Testimonials):

**Placeholder strategy:**
- Use beta tester feedback (even informal Slack/email messages, with permission)
- Use quotes from the problem validation phase
- Use "What early users are saying" framing
- Plan to replace with real testimonials within 30 days of launch

**Template for requesting testimonials:**
> "Hey {Name}, I'd love to feature a quote from you on our landing page.
> Could you answer: What was {problem area} like before {{PROJECT_NAME}},
> and what changed after you started using it? 2-3 sentences is perfect."

---

## Section 8: Pricing

**Adapt based on {{PRICING_MODEL}} from MARKETING_CONFIG:**

### Freemium Pricing Section

**Section Heading:** "Start free, upgrade when you're ready"

| | Free | Pro | Enterprise |
|---|------|-----|-----------|
| **Price** | $0/mo | ${X}/mo | Custom |
| **Tagline** | {what free is good for} | {what pro enables} | {what enterprise adds} |
| **Feature 1** | {included/limited} | {included} | {included} |
| **Feature 2** | {included/limited} | {included} | {included} |
| **Feature 3** | {not included} | {included} | {included} |
| **CTA** | "Get Started Free" | "Start Pro Trial" | "Contact Sales" |

**Most Popular Badge:** Place on Pro tier (or whichever tier you want to push).

### Free Trial Pricing Section

**Section Heading:** "Try {{PROJECT_NAME}} free for {X} days"

{Single pricing display with emphasis on the trial. CTA: "Start Your Free Trial"
Below CTA: "No credit card required. Full access for {X} days."}

### Paid-Only Pricing Section

**Section Heading:** "Simple, transparent pricing"

{Emphasize value: "Less than the cost of {relatable comparison}."
Include money-back guarantee prominently: "30-day money-back guarantee, no questions asked."}

### Pricing Section CTA
> {CTA specific to pricing model. Include the strongest friction reducer.}

---

## Section 9: FAQ

**Purpose:** Handle objections that prevent conversion. Every FAQ answer should end with
a reason to sign up.

**Generate 8-10 questions based on:**
- Top objections from the messaging framework
- Common questions from competitor FAQ pages
- Technical questions relevant to the product type
- Pricing/billing questions relevant to the pricing model

### Q1: {Most common objection phrased as a question}
**A:** {2-4 sentences. Acknowledge the concern, address it directly, provide evidence,
end with a positive statement or CTA.}

### Q2: "How does {{PROJECT_NAME}} compare to {top competitor}?"
**A:** {Honest comparison. Acknowledge competitor strengths, then pivot to your
differentiation. Never trash-talk competitors -- it makes you look insecure.}

### Q3: "Is my data secure?"
**A:** {Address security concerns with specifics: encryption, compliance, data location.
Link to security page or privacy policy if available.}

### Q4: {Pricing-related question based on pricing model}
**A:** {Clear answer about pricing, what's included, billing cycle, cancellation policy.}

### Q5: "How long does it take to get started?"
**A:** {Specific timeframe. "Most users are up and running in under {X} minutes."}

### Q6-Q10: {Additional questions specific to product type and audience}
{Generate questions based on:}
{- SaaS: integration, migration, support, uptime}
{- Mobile App: device support, offline access, data usage}
{- Dev Tool: documentation, open source, self-hosting}
{- Marketplace: safety, disputes, fees}
{- Client Site: process, timeline, revision policy}

---

## Section 10: Final CTA

**Formula applied:** AIDA (full formula compressed into closing section)

### Heading Options

**Option A (Benefit):**
> "{Restate the primary outcome. What will the reader's life look like after signing up?}"

**Option B (Urgency):**
> "{Create legitimate urgency. NOT fake countdown timers. Real urgency: limited beta spots,
> introductory pricing ending, waitlist position.}"

**Option C (Summary):**
> "Ready to {primary outcome verb}?"

### Closing Copy
> {2-3 sentences summarizing the entire value proposition in its most compelling form.
> This is the last chance to convert a reader who scrolled to the bottom. Hit the biggest
> pain point and the biggest benefit.}

### Final CTA Button
> {Same CTA as hero (consistency builds trust) or a slightly different variant if
> testing. Include friction reducer below.}

### Below-CTA Reassurance
> {Final objection handler: guarantee, support availability, or social proof.
> Example: "Join 5,000+ teams who switched this month. Cancel anytime."}
```

---

## Conditional Sections by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->

### SaaS-Specific Additions
- Add an **Integrations Section** after Features: "Works with the tools you already use"
  with logos of popular integrations (Slack, Zapier, Google, etc.)
- Add a **Security & Compliance Section** if B2B: SOC 2, GDPR, uptime SLA
- Pricing section should emphasize **annual vs monthly** savings

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->

### Mobile App-Specific Additions
- Add **App Store Badges** (Download on App Store / Get it on Google Play) as CTAs
- Replace "Sign up" CTAs with "Download" CTAs
- Add **Device Mockup Section** showing the app on phone screens
- Include **App Store Rating** in social proof bar if 4.0+

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->

### Dev Tool-Specific Additions
- Add a **Code Example Section** after the hero: show a real code snippet demonstrating
  the tool in action (must be syntactically correct and copy-pastable)
- Add **Docs Link** as a secondary CTA: "Read the docs" alongside "Get started"
- Replace generic social proof with **GitHub stars, npm downloads, or community size**
- Add **Performance Benchmarks** section if applicable

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->

### Marketplace-Specific Additions
- Create **TWO hero variants**: one for each side of the marketplace (buyer/seller)
- Add **How It Works** for both sides (separate step flows)
- Social proof should show **both sides**: "X sellers, Y buyers"

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->

### Client/Agency Site-Specific Additions
- Replace pricing section with **"Our Process"** section
- Add **Portfolio/Case Studies** section with before/after results
- CTA should be **"Schedule a Call"** or **"Get a Quote"** not "Sign Up"

<!-- ENDIF -->

---

## A/B Testing Plan

For each section with multiple variants, specify the A/B test:

| Test | Section | Variant A | Variant B | Success Metric | Min. Sample Size |
|------|---------|-----------|-----------|----------------|-----------------|
| 1 | Hero headline | Benefit-led | Problem-led | Click-through to CTA | 500 visitors |
| 2 | CTA button text | Action verb | Curiosity | Button click rate | 300 visitors |
| 3 | Social proof | User count | Star rating | Section scroll-past rate | 500 visitors |
| 4 | Pricing layout | 3 tiers visible | Single tier + "see plans" | Pricing page visits | 300 visitors |

**Testing Rules:**
- Test ONE element at a time (not headline AND CTA simultaneously)
- Run each test for minimum 7 days or until statistical significance (p < 0.05)
- Winner becomes the new control; test the next element
- Document all test results in `marketing/website-and-landing-pages/ab-test-log.md`

---

## Quality Gates

Before finalizing landing page copy, verify:

- [ ] Every headline passes the "5-Second Test": would a stranger understand what the product does from the headline alone?
- [ ] Every CTA is specific (not "Submit" or "Click Here" but "Start Your Free Trial")
- [ ] No section uses jargon that the target persona would not understand
- [ ] Pain points use exact language from CUSTOMER_LANGUAGE in MARKETING_CONFIG
- [ ] At least 3 variants exist for the hero headline for A/B testing
- [ ] FAQ addresses the top 3 objections from the messaging framework
- [ ] Copy tone matches the brand voice guide throughout
- [ ] No fabricated social proof (fake numbers, fake testimonials, fake logos)
- [ ] All pricing information matches the actual pricing model
- [ ] Mobile readability: no paragraph exceeds 3 sentences (long paragraphs are unreadable on mobile)
- [ ] Page flow follows a logical persuasion sequence: attention -> problem -> solution -> proof -> action
- [ ] Every section has a clear purpose and advances the reader toward the CTA

---

## Validation Checklist

After generation, verify:
- [ ] All `{{PLACEHOLDER}}` variables are resolved
- [ ] Conditional sections match the actual product type
- [ ] Character limits are respected (headlines under 10 words, sub-headlines under 25 words)
- [ ] CTA button text is under 5 words
- [ ] FAQ answers are 2-4 sentences (not paragraphs)
- [ ] No two sections make the same point in the same way (each section adds new information)
- [ ] Copy reads naturally when read aloud (no awkward phrasing)
- [ ] Competitive differentiation appears in at least 2 sections (hero and features)
- [ ] The page can be built by a developer reading only this document
