# A/B Testing Framework for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Monthly Traffic:** {{MONTHLY_TRAFFIC}}
> **Date:** {{DATE}}

---

## What to A/B Test (and What NOT to Test)

A/B testing is powerful, but only if you test things that actually move the needle. Most teams waste time testing irrelevant details while ignoring high-impact elements.

### High-Impact Elements (TEST THESE)

| Element | Why It Matters | Expected Impact |
|---------|---------------|-----------------|
| **Headlines (landing page)** | First thing visitors read. Determines if they stay or leave. | 10-50% change in conversion rate |
| **Call-to-Action (CTA) copy** | The exact words that ask people to act. "Start Free Trial" vs "Get Started" matters. | 5-30% change in click-through |
| **Hero section layout** | Above-the-fold content determines first impression | 10-40% change in engagement |
| **Pricing page display** | How you present pricing (tiers, anchoring, default selection) affects purchase decisions | 10-50% change in revenue per visitor |
| **Form fields** | Every field you add reduces completion rate by 5-10% | 15-50% change in form completion |
| **Onboarding flow** | Number of steps, content, and order affect activation | 10-30% change in activation rate |
| **Email subject lines** | Determines whether your email gets opened or ignored | 10-40% change in open rate |
| **Social proof placement** | Where and how you show testimonials/logos/numbers | 5-20% change in conversion |
| **Navigation structure** | How easily people find what they need | 5-15% change in engagement |
| **Checkout flow** | Number of steps, payment options, trust signals | 10-30% change in checkout completion |

### Low-Impact Elements (DO NOT WASTE TIME)

| Element | Why It Does Not Matter Much |
|---------|---------------------------|
| Button colors | The "red vs green button" myth. Color rarely matters unless there is a contrast issue. |
| Footer layout | Almost nobody scrolls to the footer to make a purchase decision. |
| Font choices (within reason) | As long as it is readable, switching from Inter to Roboto will not move revenue. |
| Logo size | Unless it is comically large or invisible, this does not affect conversion. |
| Exact image on non-hero sections | Below-the-fold images have minimal impact on conversion. |
| Minor copy changes in body text | Changing one word in paragraph 3 will not be detectable in any reasonable sample. |

**The rule:** If you cannot articulate a clear hypothesis for why the change would improve a specific metric, do not test it.

---

## A/B Testing Process

### Step 1: Hypothesis

Every test starts with a clear hypothesis. No hypothesis = no test.

**Template:**
```
"Changing [SPECIFIC ELEMENT] from [CURRENT VERSION] to [NEW VERSION]
will increase [METRIC] by [ESTIMATED PERCENT]
because [REASONING BASED ON DATA OR USER RESEARCH]."
```

**Good Hypothesis Examples:**
- "Changing the CTA from 'Sign Up' to 'Start Free Trial' will increase signups by 15% because 'free trial' reduces perceived risk and sets clearer expectations."
- "Reducing the signup form from 5 fields to 3 (removing company name and phone) will increase form completion by 25% because user testing showed people abandon at field 4."
- "Moving customer logos from the bottom of the page to directly below the hero section will increase scroll-to-pricing rate by 20% because social proof early builds trust."

**Bad Hypothesis Examples:**
- "Let's try a blue button." (No metric, no reasoning.)
- "The page should look better." (Not measurable.)
- "We should test everything on the homepage." (Too broad, impossible to analyze.)

### Step 2: Design

**Control (A):** Your current version. Change nothing. This is the baseline.
**Variant (B):** The new version with ONE change. Only one.

**Why only one change?**
If you change the headline AND the CTA AND the image, and the variant wins, you do not know which change caused the improvement. Test one thing at a time.

**Exception:** Multivariate testing (see section below) allows testing combinations, but requires significantly more traffic.

### Step 3: Sample Size Calculation

You need enough visitors in each variant to detect a real difference. Testing with 50 visitors per variant is statistically meaningless.

**Minimum Sample Size Guidelines:**

| Baseline Conversion Rate | Minimum Detectable Effect | Sample Per Variant | Total Sample |
|--------------------------|--------------------------|-------------------|-------------|
| 1% | 50% relative (0.5% → 1.5%) | ~4,000 | ~8,000 |
| 3% | 30% relative (3% → 3.9%) | ~5,500 | ~11,000 |
| 5% | 20% relative (5% → 6%) | ~6,400 | ~12,800 |
| 10% | 15% relative (10% → 11.5%) | ~5,200 | ~10,400 |
| 20% | 10% relative (20% → 22%) | ~6,100 | ~12,200 |

**How to Calculate:**
- Use an online calculator: Evan Miller's sample size calculator (https://www.evanmiller.org/ab-testing/sample-size.html) or Optimizely's calculator.
- Input: baseline conversion rate, minimum detectable effect (how small a change you want to detect), statistical power (80%), significance level (95%).
- Output: required sample size per variant.

**If you do not have enough traffic:** Focus on testing high-traffic pages only, or test bigger changes (which need smaller samples to detect).

### Step 4: Duration

**Minimum: 2 weeks.** Even if you hit your sample size in 3 days, run for at least 2 weeks to capture:
- Weekday vs. weekend behavior differences.
- Paycheck cycle effects (beginning vs. end of month).
- Random fluctuations that smooth out over time.

**Maximum: 4-6 weeks.** If you have not reached statistical significance in 6 weeks, the difference is likely too small to matter. Call it inconclusive and move on.

**Do NOT peek at results daily and stop early.** This is the most common testing mistake (called "peeking problem"). It dramatically increases false positives.

### Step 5: Analysis

When the test concludes:

1. **Check statistical significance.** Is the result at 95% confidence? If not, the result is inconclusive — not a loss, just inconclusive.
2. **Check practical significance.** A 0.1% improvement might be statistically significant with enough data but practically meaningless. Is the improvement worth implementing?
3. **Check segments.** Did the variant perform differently for mobile vs. desktop? New vs. returning visitors? Different traffic sources? Sometimes a variant wins overall but loses for a key segment.
4. **Check for novelty effect.** Did the variant perform better in week 1 but normalize in week 2? That is novelty, not a real improvement.

### Step 6: Decision and Documentation

| Outcome | Action |
|---------|--------|
| Variant wins (95%+ confidence, meaningful improvement) | Implement the variant. Document the learning. |
| Control wins (variant is significantly worse) | Keep the control. Document why the hypothesis was wrong. |
| Inconclusive (no significant difference) | Keep the control (simpler). Document. Test a bigger change. |
| Variant wins for one segment, loses for another | Consider personalization. Or prioritize the higher-value segment. |

---

## Statistical Significance

### What It Means

Statistical significance (at 95% confidence) means: "There is a 95% probability that the difference we observed is real and not due to random chance."

Put differently: if you ran this exact test 100 times, 95 times you would see the same winner.

### Why 95% Matters

- At 80% confidence, 1 in 5 "winners" is actually a false positive. That is too many wrong decisions.
- At 95% confidence, only 1 in 20 is a false positive. Acceptable.
- At 99% confidence, 1 in 100 is a false positive — but you need much larger sample sizes.

**For most startups, 95% is the right threshold.** Do not go lower. Going higher requires significantly more traffic.

### Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| **Stopping early** | You see a winner at day 3 and stop. But the result is not stable yet. | Commit to a minimum duration before starting. |
| **Peeking and deciding** | Checking results daily inflates false positive rate to 30%+. | Use sequential testing methods, or only check at the pre-defined end date. |
| **Running too many variants** | Testing 5 variants at once requires 5x the traffic for significance. | Start with A/B (two variants). Add more only with high traffic. |
| **Ignoring segment differences** | The variant wins overall but destroys mobile conversion. | Always check key segments (device, source, new vs returning). |
| **Post-hoc analysis** | After seeing results, you find a sub-segment where it "works" and claim victory. | Define your analysis plan BEFORE the test. Sub-segment analysis is exploratory, not conclusive. |

---

## Testing Priority Framework (PIE Score)

You have a list of 20 things you could test. How do you decide what to test first?

Use the PIE framework: **Potential × Importance × Ease**

| Factor | Question | Score (1-10) |
|--------|----------|-------------|
| **Potential** | How much improvement is possible? (Based on data, user feedback, benchmarks) | 1 = tiny potential, 10 = massive potential |
| **Importance** | How valuable is this page/element? (Traffic volume, revenue impact) | 1 = low traffic/value, 10 = high traffic/value |
| **Ease** | How easy is it to implement and test? | 1 = very difficult, 10 = very easy |

**PIE Score = (P + I + E) ÷ 3**

### Testing Roadmap for {{PROJECT_NAME}}

Fill in with your specific tests:

| Test Idea | P | I | E | PIE Score | Priority |
|-----------|---|---|---|-----------|----------|
| ________________________________ | __ | __ | __ | ____ | 1 |
| ________________________________ | __ | __ | __ | ____ | 2 |
| ________________________________ | __ | __ | __ | ____ | 3 |
| ________________________________ | __ | __ | __ | ____ | 4 |
| ________________________________ | __ | __ | __ | ____ | 5 |
| ________________________________ | __ | __ | __ | ____ | 6 |
| ________________________________ | __ | __ | __ | ____ | 7 |
| ________________________________ | __ | __ | __ | ____ | 8 |

---

## What to Test First (By Area)

### Landing Page Tests

| Element | Control Ideas | Variant Ideas | Metric |
|---------|--------------|---------------|--------|
| Headline | Feature-focused ("Build X faster") | Benefit-focused ("Save 10 hours/week") | Signup rate |
| Headline | Generic ("The best X tool") | Specific ("X for freelance designers") | Signup rate |
| CTA button text | "Sign Up" | "Start Free Trial" or "Get Started Free" | Click rate |
| CTA button text | "Learn More" | "See How It Works" | Click rate |
| Hero image | Product screenshot | Person using product | Time on page, scroll depth |
| Social proof | Customer logos | "Used by 5,000+ teams" (number) | Signup rate |
| Social proof | At bottom of page | Directly below hero section | Signup rate |
| Form length | 5 fields (name, email, company, role, phone) | 2 fields (name, email) | Form completion |
| Page length | Long-form (all features, testimonials, FAQ) | Short-form (hero + CTA + social proof) | Signup rate |

### Email Tests

| Element | Control Ideas | Variant Ideas | Metric |
|---------|--------------|---------------|--------|
| Subject line | Descriptive ("New feature: X") | Curiosity ("You won't believe what we built") | Open rate |
| Subject line | No personalization | With name ("{{FIRST_NAME}}, check this out") | Open rate |
| Send time | Tuesday 10am | Thursday 2pm | Open rate |
| CTA | Text link | Button | Click rate |
| Email length | 500+ words | 100-150 words | Click rate |
| From name | Company name | Founder's personal name | Open rate |

### Pricing Page Tests

| Element | Control Ideas | Variant Ideas | Metric |
|---------|--------------|---------------|--------|
| Default selection | No default | Pre-select middle tier (most popular) | Revenue per visitor |
| Tier names | Generic (Basic, Pro, Enterprise) | Persona-based (Starter, Growth, Scale) | Plan distribution |
| Annual discount | 10% off | "2 months free" (same math, different framing) | Annual vs monthly ratio |
| Price anchoring | Show from low to high | Show from high to low | Revenue per visitor |
| Feature comparison | Feature list | Feature list with checkmarks and X marks | Conversion rate |
| Free tier | Shown prominently | De-emphasized (smaller, less visible) | Paid conversion rate |

### Onboarding Tests

| Element | Control Ideas | Variant Ideas | Metric |
|---------|--------------|---------------|--------|
| Number of steps | 7 steps | 3 steps (defer rest to later) | Completion rate |
| Progress indicator | No indicator | Progress bar with "Step 2 of 4" | Completion rate |
| Content | Text instructions | Video walkthrough | Activation rate |
| First action | "Set up your profile" | "Create your first [project]" (value-first) | Day 7 retention |
| Skip option | No skip allowed | "Skip for now" on optional steps | Completion rate |
| Welcome message | Generic | Personalized based on use case selection | Activation rate |

---

## A/B Testing Tools

| Tool | Cost | Best For | Notes |
|------|------|----------|-------|
| **PostHog** | Free (self-hosted), usage-based (cloud) | All-in-one: experiments + analytics + session replay | Best free option for startups |
| **Statsig** | Free tier available | Feature flags + experiments, developer-friendly | Good for product experiments |
| **VWO** | $99/mo+ | Visual editor for non-developers, landing page tests | Good for marketing teams |
| **Optimizely** | Custom pricing (expensive) | Enterprise-grade testing, full-stack experiments | Best for large-scale testing |
| **LaunchDarkly** | Free tier → $10/mo+ | Feature flags with built-in experimentation | Best for feature rollouts |
| **Google Optimize** | **Sunset (discontinued)** | N/A — do not use | Replaced by native GA4 experiments (limited) |
| **Webflow + built-in** | Included in Webflow plans | Simple A/B tests on Webflow sites | Good if already on Webflow |
| **Custom (feature flags)** | Free (DIY) | Roll your own with feature flags in code | Full control, more engineering effort |

**Recommendation for {{PROJECT_NAME}}:**
- < 1,000 visitors/month: Do not A/B test yet. Make big changes based on user feedback instead.
- 1,000-10,000/month: PostHog (free) or Statsig (free tier) for key tests.
- 10,000+/month: PostHog, VWO, or Statsig depending on team.

---

## Common A/B Testing Mistakes

### 1. Testing Without Enough Traffic

**Mistake:** Running a test with 200 visitors and declaring a winner.
**Why It Is Wrong:** With small samples, random variation overwhelms any real difference. You are just measuring noise.
**Solution:** Calculate required sample size BEFORE starting. If you cannot reach it in 4-6 weeks, do not run the test — make a decision based on qualitative data instead.

### 2. Stopping Tests Too Early

**Mistake:** The variant is winning at day 3 with 90% confidence. Ship it!
**Why It Is Wrong:** Early results are unreliable. Confidence levels fluctuate wildly in the first few days. You might just be capturing one good day.
**Solution:** Pre-commit to a minimum test duration (2 weeks) and minimum sample size. Do not check results until both thresholds are met.

### 3. Testing Too Many Things at Once

**Mistake:** Running 8 tests simultaneously on the same page.
**Why It Is Wrong:** Tests interact with each other. If you change the headline AND the CTA, you cannot isolate which change caused the result.
**Solution:** One test per page/flow at a time. Prioritize using the PIE framework. Run tests sequentially.

### 4. Ignoring Segment Differences

**Mistake:** The variant wins by 10% overall. Ship it.
**Why It Is Wrong:** The variant might win 30% on desktop but lose 20% on mobile. You just degraded the mobile experience.
**Solution:** Always check results by key segments: device, traffic source, new vs returning, geography.

### 5. Over-Optimizing for a Local Metric

**Mistake:** You increase signup rate by 40% by removing all form fields except email. Victory!
**Why It Is Wrong:** Those low-friction signups might have terrible activation and retention. You optimized for quantity at the expense of quality.
**Solution:** Track downstream metrics too. A signup test should also measure activation, retention, and revenue from each variant.

### 6. Never Documenting Results

**Mistake:** Running a test, seeing the result, implementing the winner, and moving on.
**Why It Is Wrong:** In 6 months, nobody remembers what was tested, what won, or why. You might accidentally re-test the same thing.
**Solution:** Maintain a test log (template below) that captures every test, hypothesis, result, and learning.

---

## Multivariate Testing

### When to Use

Multivariate testing (MVT) tests multiple elements simultaneously to find the best combination. Instead of testing headline A vs B, you test headline A vs B × CTA 1 vs 2 × image X vs Y = 8 combinations.

**Only use when:**
- You have 10,000+ visitors per month (minimum).
- You need to test element interactions (does headline A work better with CTA 1 or CTA 2?).
- You have already optimized individual elements via standard A/B tests.

**Do NOT use when:**
- Traffic is low (you will never reach significance).
- You are early stage (just test one thing at a time).
- You are testing on a low-traffic page.

### MVT Traffic Requirements

| Combinations | Visitors Needed (minimum) | At 5K visitors/month | Duration |
|-------------|--------------------------|---------------------|----------|
| 4 (2×2) | ~16,000 | 3+ months | Too long |
| 8 (2×2×2) | ~32,000 | 6+ months | Way too long |
| 4 (2×2) | ~16,000 | At 50K/month: ~10 days | Feasible |

---

## Test Documentation Template

### Test Log Entry

```
TEST ID: ____
TEST NAME: ____________________________
DATE STARTED: __________
DATE ENDED: __________
STATUS: Running / Completed / Inconclusive / Stopped

HYPOTHESIS:
"Changing [____________] from [____________] to [____________]
will increase [____________] by [____]%
because [____________________________________________]."

TEST DETAILS:
- Page/Flow: ____________________________
- Element tested: ____________________________
- Control (A): ____________________________
- Variant (B): ____________________________
- Primary metric: ____________________________
- Secondary metrics: ____________________________
- Required sample: ____ per variant
- Actual sample: Control: ____ | Variant: ____

RESULTS:
- Control conversion rate: ____%
- Variant conversion rate: ____%
- Difference: +/- ____%
- Statistical confidence: ____%
- Practical significance: Yes / No

SEGMENT ANALYSIS:
| Segment | Control | Variant | Winner |
|---------|---------|---------|--------|
| Desktop | ____% | ____% | ______ |
| Mobile | ____% | ____% | ______ |
| New visitors | ____% | ____% | ______ |
| Returning visitors | ____% | ____% | ______ |

DECISION: Implement Variant / Keep Control / Inconclusive — Retest

KEY LEARNING:
________________________________________________________
________________________________________________________

FOLLOW-UP TEST IDEA:
________________________________________________________
```

### Test History Log

| Test ID | Date | Page | Element | Result | Lift | Confidence | Learning |
|---------|------|------|---------|--------|------|------------|----------|
| T001 | ________ | ________ | ________ | Win/Loss/NC | +/- __% | __% | ________ |
| T002 | ________ | ________ | ________ | Win/Loss/NC | +/- __% | __% | ________ |
| T003 | ________ | ________ | ________ | Win/Loss/NC | +/- __% | __% | ________ |
| T004 | ________ | ________ | ________ | Win/Loss/NC | +/- __% | __% | ________ |
| T005 | ________ | ________ | ________ | Win/Loss/NC | +/- __% | __% | ________ |

---

*This A/B testing framework is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*
