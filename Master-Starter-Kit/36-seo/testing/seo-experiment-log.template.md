# SEO Experiment Log — {{PROJECT_NAME}}

Track every SEO experiment. No test runs without an entry here. No results go undocumented. This is the institutional memory that prevents repeating failed tests and lets you compound winning patterns.

---

## Active Experiments

| ID | Experiment Name | Owner | Start Date | Planned End | Status |
| -- | --------------- | ----- | ---------- | ----------- | ------ |
| {{EXPERIMENT_ID}} | {{EXPERIMENT_NAME}} | {{EXPERIMENT_OWNER}} | YYYY-MM-DD | YYYY-MM-DD | 🔬 Running / ✅ Complete / ⏸ Paused / ❌ Aborted |

---

## Experiment Entry Template

Copy this block for each new experiment.

```markdown
### EXP-XXX: {{EXPERIMENT_NAME}}

**Owner:** {{EXPERIMENT_OWNER}}
**Status:** 🔬 Running

#### Hypothesis

> If we [specific change], then [metric] will [increase/decrease] by [estimated %] because [reasoning].

{{HYPOTHESIS}}

#### Test Design

| Field | Value |
| ----- | ----- |
| Variable changed | [Exact description of what was modified] |
| Pages affected | [URL list or pattern, e.g., /blog/* or specific URLs] |
| Control group | [Untreated pages for comparison, or "historical baseline"] |
| Test group | [Treated pages] |
| Primary metric | [The ONE metric that determines success] |
| Secondary metrics | [Supporting metrics to watch] |
| Minimum detectable effect | [What % change would be meaningful?] |
| Required impressions | [Minimum sample size for confidence] |

#### Timeline

| Milestone | Date | Notes |
| --------- | ---- | ----- |
| Baseline period start | YYYY-MM-DD | |
| Baseline period end | YYYY-MM-DD | |
| Change deployed | YYYY-MM-DD | |
| Observation period end | YYYY-MM-DD | |
| Analysis complete | YYYY-MM-DD | |

#### Baseline Data

| Metric | Value | Period | Source |
| ------ | ----- | ------ | ------ |
| [Primary metric] | | [Date range] | [GSC / GA4 / Ahrefs / etc.] |
| [Secondary metric] | | [Date range] | |

#### External Events During Test

| Date | Event | Potential Impact |
| ---- | ----- | ---------------- |
| | [Algorithm update, competitor change, site incident, PR coverage] | [High/Med/Low] |

#### Results

| Metric | Baseline | Test Period | Change | % Change |
| ------ | -------- | ----------- | ------ | -------- |
| [Primary metric] | | | | |
| [Secondary metric 1] | | | | |
| [Secondary metric 2] | | | | |

**Confidence level:** High / Medium / Low / Inconclusive
**Confounding factors:** [List any external events that may have affected results]

#### Decision

- [ ] **Roll out** — Apply change to all applicable pages
- [ ] **Revert** — Change did not produce desired effect
- [ ] **Iterate** — Modify and re-test with variation
- [ ] **Inconclusive** — Extend test or redesign

**Reasoning:** [Why this decision was made]

#### Learnings

- [What did we learn that applies beyond this specific test?]
- [What would we do differently next time?]
- [Does this inform any other planned experiments?]

#### Next Steps

- [ ] [Specific action item 1]
- [ ] [Specific action item 2]
```

---

## Example Experiment 1: Title Tag CTR Optimization

### EXP-001: Blog Post Title Tag Bracket Test

**Owner:** SEO Lead
**Status:** ✅ Complete

#### Hypothesis

> If we add year brackets (e.g., "[2026 Guide]") to blog post title tags, then average CTR will increase by 10-15% because bracketed titles stand out in SERPs and signal freshness.

#### Test Design

| Field | Value |
| ----- | ----- |
| Variable changed | Added "[2026 Guide]" to end of title tags |
| Pages affected | 15 blog posts in /blog/guides/* with >500 impressions/week each |
| Control group | 15 similar blog posts in /blog/tutorials/* (untreated, matched by traffic volume) |
| Test group | 15 blog posts in /blog/guides/* |
| Primary metric | CTR (clicks / impressions) from Google Search Console |
| Secondary metrics | Average position, total clicks, bounce rate from GA4 |
| Minimum detectable effect | 8% relative CTR increase |
| Required impressions | 10,000+ per group over test period |

#### Timeline

| Milestone | Date | Notes |
| --------- | ---- | ----- |
| Baseline period start | 2026-01-06 | 4-week baseline |
| Baseline period end | 2026-02-02 | |
| Change deployed | 2026-02-03 | Titles updated via CMS bulk editor |
| Observation period end | 2026-03-02 | 4-week observation |
| Analysis complete | 2026-03-05 | |

#### Baseline Data

| Metric | Value | Period | Source |
| ------ | ----- | ------ | ------ |
| CTR (test group) | 3.2% | Jan 6 - Feb 2 | GSC |
| CTR (control group) | 3.1% | Jan 6 - Feb 2 | GSC |
| Avg position (test) | 8.4 | Jan 6 - Feb 2 | GSC |
| Avg position (control) | 8.7 | Jan 6 - Feb 2 | GSC |

#### External Events During Test

| Date | Event | Potential Impact |
| ---- | ----- | ---------------- |
| 2026-02-14 | Google core update started rollout | Medium — both groups affected equally |

#### Results

| Metric | Baseline | Test Period | Change | % Change |
| ------ | -------- | ----------- | ------ | -------- |
| CTR (test group) | 3.2% | 3.8% | +0.6pp | +18.7% |
| CTR (control group) | 3.1% | 3.2% | +0.1pp | +3.2% |
| Avg position (test) | 8.4 | 8.1 | -0.3 | +3.6% (improvement) |
| Avg position (control) | 8.7 | 8.5 | -0.2 | +2.3% |
| Total clicks (test) | 4,200 | 5,180 | +980 | +23.3% |

**Confidence level:** High — control group showed minimal CTR change; test group showed consistent lift across all 4 weeks; core update affected both groups similarly.
**Confounding factors:** Core update rolled out mid-test but affected both groups equally (control group CTR barely moved).

#### Decision

- [x] **Roll out** — Apply bracket format to all evergreen blog posts

**Reasoning:** 18.7% CTR lift with high confidence. Control group validates that the lift was not caused by external factors. Position improvement likely a secondary effect of higher CTR signaling relevance.

#### Learnings

- Bracketed titles with year outperform plain titles for informational queries.
- The lift was strongest on queries with "best" and "guide" — users seeking current information respond to freshness signals.
- Posts with already-high CTR (>5%) saw smaller lifts — diminishing returns at the top.

#### Next Steps

- [ ] Roll out bracket format to all 120+ evergreen blog posts
- [ ] Test "[Updated March 2026]" vs. "[2026 Guide]" as next iteration
- [ ] Do NOT apply to product pages — different intent, needs separate test

---

## Example Experiment 2: FAQ Schema Impact

### EXP-002: FAQ Schema on Product Category Pages

**Owner:** Technical SEO Specialist
**Status:** ✅ Complete

#### Hypothesis

> If we add FAQ schema markup to product category pages with 3-5 frequently asked questions, then impressions will increase by 15% and CTR will increase by 10% because FAQ rich results expand SERP real estate.

#### Test Design

| Field | Value |
| ----- | ----- |
| Variable changed | Added FAQPage schema with 4 Q&A pairs per page |
| Pages affected | 8 product category pages (/products/category/*) |
| Control group | 8 similar product category pages (untreated) |
| Test group | 8 product category pages with FAQ schema added |
| Primary metric | Impressions and CTR from GSC |
| Secondary metrics | Rich result appearance rate (GSC Rich Results report), clicks |
| Minimum detectable effect | 10% impression increase |
| Required impressions | 5,000+ per group over test period |

#### Timeline

| Milestone | Date | Notes |
| --------- | ---- | ----- |
| Baseline period start | 2025-11-01 | 4-week baseline |
| Baseline period end | 2025-11-28 | |
| Change deployed | 2025-12-01 | Schema added via JSON-LD in page template |
| Observation period end | 2026-01-12 | 6 weeks (extended due to holiday season) |
| Analysis complete | 2026-01-15 | |

#### Baseline Data

| Metric | Value | Period | Source |
| ------ | ----- | ------ | ------ |
| Impressions (test) | 42,000 | Nov 1-28 | GSC |
| Impressions (control) | 38,500 | Nov 1-28 | GSC |
| CTR (test) | 2.1% | Nov 1-28 | GSC |
| CTR (control) | 2.3% | Nov 1-28 | GSC |

#### External Events During Test

| Date | Event | Potential Impact |
| ---- | ----- | ---------------- |
| 2025-12-15 - 2026-01-02 | Holiday shopping season peak | High — seasonal traffic spike in both groups |
| 2025-12-18 | Google announced FAQ rich results limited to gov/health sites | High — directly affects test hypothesis |

#### Results

| Metric | Baseline | Test Period | Change | % Change |
| ------ | -------- | ----------- | ------ | -------- |
| Impressions (test) | 42,000 | 55,000 | +13,000 | +31% |
| Impressions (control) | 38,500 | 51,000 | +12,500 | +32.5% |
| CTR (test) | 2.1% | 2.2% | +0.1pp | +4.8% |
| CTR (control) | 2.3% | 2.4% | +0.1pp | +4.3% |
| Rich result appearances | 0 | 12 total | — | Near zero |

**Confidence level:** Inconclusive — impression increases were driven by holiday seasonality (control group saw equivalent lift). FAQ rich results barely appeared, likely due to Google's December policy change restricting FAQ rich results.
**Confounding factors:** Holiday season inflated both groups equally. Google policy change during test period eliminated the primary mechanism (rich result display).

#### Decision

- [x] **Revert** — Remove FAQ schema from product category pages

**Reasoning:** FAQ rich results are no longer displayed for commercial pages as of Google's December 2025 policy. The schema adds page weight with no SERP benefit. Keeping it risks structured data warnings if Google tightens validation.

#### Learnings

- Google can remove rich result eligibility at any time. Do not build strategy around rich result appearances — they are a bonus, not a reliable channel.
- Always check Google's latest structured data documentation before investing in schema implementation.
- Holiday season makes Q4 a poor time for SEO tests on commercial pages — too much seasonal noise.

#### Next Steps

- [ ] Remove FAQ schema from all product category pages
- [ ] Investigate Product schema with review ratings instead (still supported for commercial pages)
- [ ] Re-test FAQ schema only on informational /help/* pages where it may still render

---

## Monthly Experiment Review Process

On the **first Monday of each month**, the SEO team reviews all experiments:

### Review Agenda (30 minutes)

1. **Active experiments status check** (5 min)
   - Any experiments that should be concluded?
   - Any experiments affected by external events that need extension?
   - Any experiments showing severe negative results that should be aborted?

2. **Completed experiment review** (10 min)
   - Review results from experiments completed in the prior month.
   - Validate that roll-out actions were actually implemented.
   - Check that reverted experiments were fully reverted.

3. **Learnings synthesis** (10 min)
   - What patterns are emerging across experiments?
   - Are there learnings that should be added to `36-seo/gotchas/seo-gotchas.md`?
   - Are there learnings that change our SEO strategy?

4. **Next month's experiment pipeline** (5 min)
   - What experiments are planned for next month?
   - Do we have enough traffic on target pages to run them?
   - Are there capacity constraints (max 3 concurrent experiments recommended)?

### Review Output

After each monthly review, update:

- [ ] This experiment log (status updates, late results)
- [ ] `36-seo/gotchas/seo-gotchas.md` (new gotchas discovered)
- [ ] SEO strategy document (if learnings change priorities)
- [ ] Quarterly audit findings (if experiments reveal systemic issues)

---

## Experiment Naming Convention

Format: `EXP-[sequential number]`

Categories for tagging:
- `TITLE` — Title tag tests
- `META` — Meta description tests
- `SCHEMA` — Structured data tests
- `CONTENT` — Content format/structure tests
- `LINKS` — Internal linking tests
- `SPEED` — Page speed tests
- `TECHNICAL` — Other technical SEO tests

---

## Cross-References

- **Testing methodology:** `36-seo/testing/seo-ab-testing.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md` (if a test causes a drop)
- **Monthly audit:** `36-seo/audit/monthly-audit-checklist.md`
- **Gotchas:** `36-seo/gotchas/seo-gotchas.md`
