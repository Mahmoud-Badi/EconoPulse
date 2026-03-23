# PLG Gotchas

> Eighteen production-tested gotchas for product-led growth — organized by severity (CRITICAL, HIGH, MEDIUM, LOW) — covering premature paywalls, vanity metrics, dark patterns, gating mistakes, PQL miscalibration, free tier economics, and more.

---

## Severity Legend

| Severity | Meaning | Impact if Ignored |
|----------|---------|-------------------|
| CRITICAL | Will break your PLG motion or damage your brand | Revenue loss, user churn, legal risk |
| HIGH | Will significantly undermine growth metrics | Missed targets, wasted spend, slow growth |
| MEDIUM | Will create friction or inefficiency | Suboptimal conversion, technical debt |
| LOW | Will cause minor issues or missed opportunities | Small inefficiencies, polish gaps |

---

## Gotcha 1 — Premature Paywalls

**Severity: CRITICAL**

**The mistake:** Placing paywalls before users experience the product's core value. Users hit an upgrade prompt before they understand why the product is worth paying for.

**Why it happens:** Teams want to monetize early. Revenue pressure from leadership or investors pushes paywalls earlier and earlier. Product and finance teams disagree on what "free" should include.

**Real-world damage:** A project management tool gates collaboration (the core value) behind a paid plan. Users sign up, see an empty dashboard, try to invite a teammate, and hit a paywall. They leave without ever experiencing the product. Activation rate: 8%. After moving the paywall downstream of team collaboration, activation rate jumped to 34%.

**How to avoid:**
- [ ] Map your "aha moment" and ensure it is 100% reachable on the free tier
- [ ] Run a paywall audit: for each gate, ask "Has the user experienced value before hitting this?"
- [ ] Test by signing up as a new user — if you hit a paywall before your first success, you have this problem
- [ ] Rule of thumb: the free tier should deliver enough value that users would be disappointed if the product disappeared

---

## Gotcha 2 — Vanity Metrics

**Severity: CRITICAL**

**The mistake:** Tracking signups, page views, or registered users instead of activation rate, PQL conversion, and expansion revenue. Teams celebrate signup growth while actual product usage stagnates.

**Why it happens:** Signups are easy to measure, always go up, and make dashboards look good. Activation and conversion metrics are harder to define, instrument, and explain to stakeholders.

**Real-world damage:** A team reports "50,000 signups this quarter" to the board. Nobody mentions that 42,000 of those never completed onboarding, 6,000 used the product once, and only 2,000 became active. The 4% activation rate indicates a fundamental product-market or onboarding problem that signup numbers obscure.

**How to avoid:**
- [ ] Define your activation metric before launching any growth initiative
- [ ] Never report signups without activation rate alongside them
- [ ] Set up a dashboard that shows the full funnel: signup → activated → engaged → converted → expanded
- [ ] Train stakeholders to ask "activated users" not "signups"

---

## Gotcha 3 — Dark Patterns in Upgrade Flows

**Severity: CRITICAL**

**The mistake:** Using manipulative UX to trick users into upgrading — pre-checked add-ons, hidden cancellation flows, confusing plan comparisons, fake urgency ("Offer expires in 5 minutes!").

**Why it happens:** Short-term pressure to hit conversion targets. A/B tests show dark patterns "work" (they increase immediate conversion) without measuring downstream effects (chargebacks, negative reviews, regulatory risk).

**Real-world damage:** The FTC has taken enforcement action against companies for dark patterns. The EU's Digital Services Act explicitly prohibits them. Beyond legal risk, dark patterns generate negative word-of-mouth that undermines the viral loops PLG depends on. One viral tweet about a dark pattern can undo months of brand building.

**How to avoid:**
- [ ] Audit every upgrade flow for FTC dark pattern guidelines compliance
- [ ] Make cancellation as easy as signup (same number of clicks)
- [ ] Never pre-check upgrade add-ons or auto-enroll in higher plans
- [ ] Use real deadlines only (trial expiry), never fake urgency
- [ ] Measure 90-day retention of upgraded users, not just conversion rate

---

## Gotcha 4 — Over-Gating (Free Tier Too Restrictive)

**Severity: HIGH**

**The mistake:** Making the free tier so limited that users cannot evaluate whether the product meets their needs. Features that are essential for understanding the product's value are locked behind paid plans.

**Why it happens:** Fear of "giving away too much." Teams assume that restricting the free tier forces upgrades. In practice, it just forces users to leave — they cannot evaluate a product they cannot meaningfully use.

**Real-world damage:** A data analytics tool gates data import behind a paid plan. Free users can see demo data but cannot import their own. Since the entire value proposition is "analyze your data," free users have no way to evaluate whether the product works for their use case. They leave and try a competitor that offers free data import.

**How to avoid:**
- [ ] The free tier must support the complete core workflow, end to end
- [ ] Gate scale (limits), not capability (features users need for evaluation)
- [ ] Compare your free tier to competitors — if theirs is more generous, you will lose
- [ ] Ask: "Can a free user become an advocate for this product?" If not, the tier is too restrictive

---

## Gotcha 5 — Under-Gating (No Reason to Upgrade)

**Severity: HIGH**

**The mistake:** Making the free tier so generous that users never need to upgrade. The free plan satisfies all needs for the target user segment, and the paid tier only offers features that feel like nice-to-haves.

**Why it happens:** Over-correction from over-gating. Teams want to "delight" free users and keep adding features to the free tier. Product managers avoid difficult feature allocation decisions.

**Real-world damage:** A collaboration tool offers unlimited users, unlimited projects, and all core features on the free plan. The only paid features are SSO and audit logs — features that only matter to enterprise security teams, not to the SMB customers who make up 90% of the user base. Free-to-paid conversion rate: 0.8%.

**How to avoid:**
- [ ] Every feature allocation decision should answer: "Does this create a natural upgrade trigger?"
- [ ] Set a target free-to-paid conversion rate (industry standard: 2-5%) and track it
- [ ] Conduct upgrade intent surveys: ask free users what would make them pay
- [ ] Review feature gating quarterly — if conversion rate drops, the free tier may be too generous

---

## Gotcha 6 — PQL Scoring Too Aggressive

**Severity: HIGH**

**The mistake:** Setting PQL thresholds so low that sales teams are flooded with unqualified leads. Users who barely engaged get flagged as PQLs, leading to premature outreach that wastes sales time and annoys users.

**Why it happens:** Desire to fill the sales pipeline. Low thresholds generate more PQLs, which looks good on a dashboard. Sales leaders set aggressive pipeline targets that incentivize quantity over quality.

**Real-world damage:** A PQL threshold of 30 (out of 100) floods the sales team with 500 "PQLs" per week. Most are users who signed up, created one project, and went inactive. AEs spend time chasing dead leads. PQL-to-opportunity conversion drops to 3% (vs. 25% target). AE morale drops. The sales team stops trusting PQL signals entirely.

**How to avoid:**
- [ ] Calibrate PQL threshold by measuring actual conversion rates per score band
- [ ] A healthy PQL-to-opportunity conversion rate is 20-40% for Hot PQLs
- [ ] Start with a high threshold and lower it gradually as you gather data
- [ ] Get weekly feedback from AEs: "Were the PQLs this week qualified?"

---

## Gotcha 7 — PQL Scoring Too Loose

**Severity: HIGH**

**The mistake:** Setting PQL thresholds so high that only already-converted users qualify. The scoring model only flags users who have already decided to buy, providing no incremental value over self-serve checkout.

**Why it happens:** Over-correction from Gotcha 6. Teams raise the threshold after sales complaints about quality, but raise it too far. The model identifies users who would have converted anyway.

**Real-world damage:** Only accounts with 10+ active users and pricing page visits qualify as PQLs. These accounts are already self-serve converting at high rates. The PQL model adds no incremental revenue — it just gives sales credit for conversions that would have happened without outreach.

**How to avoid:**
- [ ] Measure incremental conversion: compare PQL conversion WITH sales outreach vs. WITHOUT
- [ ] The model should identify users who are ready to buy but have not yet self-served
- [ ] Include "approaching" signals (70% of limit, exploring paid features) not just "arrived" signals
- [ ] The sweet spot is users who demonstrate value but face a blocker that sales can resolve

---

## Gotcha 8 — Free Tier Cost Spiral

**Severity: HIGH**

**The mistake:** Failing to model and manage the cost of serving free users. As free user growth accelerates (which is the point of PLG), infrastructure costs grow faster than revenue from paid conversions.

**Why it happens:** Free tier costs are invisible in early stages. At 1,000 free users, the compute and storage costs are trivial. At 100,000 free users with a 3% conversion rate, free tier costs can exceed total revenue from the 3,000 paying customers.

**Real-world damage:** A startup offers 5 GB free storage. At 200,000 free users, storage costs reach $50,000/month. With 4,000 paying customers at $20/month ($80,000 MRR), free tier costs consume 62% of revenue. The product is growing but burning cash.

**How to avoid:**
- [ ] Model free tier cost per user before launching (compute + storage + bandwidth + support)
- [ ] Set free tier limits based on cost modeling, not just competitive benchmarking
- [ ] Target free tier costs < 15% of total revenue
- [ ] Implement progressive rate limits or quality degradation for high-cost free accounts
- [ ] Archive or restrict inactive free accounts after 90 days

---

## Gotcha 9 — Spammy Virality

**Severity: HIGH**

**The mistake:** Implementing viral mechanics that feel like spam — auto-inviting contacts, sending unsolicited emails on behalf of users, adding "Invite your team!" popups on every page.

**Why it happens:** Teams measure K-factor and optimize for invitations sent without considering invite quality or recipient experience. "More invites = higher K-factor" is mathematically true but practically destructive.

**Real-world damage:** A product auto-imports Gmail contacts and sends invitations to all of them. Users are embarrassed. Recipients are annoyed. The product earns a reputation as spam. CAN-SPAM complaints increase. Email deliverability drops, affecting transactional emails too. Net effect: viral coefficient decreases as brand trust erodes.

**How to avoid:**
- [ ] Every invite must be explicitly initiated by the user — never automated
- [ ] Invitees should be able to distinguish product invites from spam
- [ ] Set a "virality budget" per user (max invites per session/day/week)
- [ ] Monitor invite-to-unsubscribe ratio — if > 5%, your mechanics feel spammy
- [ ] Test invite emails with non-users — do they feel like something you would want to receive?

---

## Gotcha 10 — Ignoring Enterprise Signals

**Severity: MEDIUM**

**The mistake:** Building a pure self-serve PLG motion without any path to sales-assisted deals. Enterprise accounts that grow organically are never identified, contacted, or served.

**Why it happens:** PLG teams are product-focused and may resist involving sales. "If the product is good enough, they'll self-serve" is the philosophy. This works for SMB but not for enterprise accounts that require procurement, security review, and custom contracts.

**Real-world damage:** A company has 200 free accounts with 50+ users each. These accounts are using the product heavily but are stuck on the free plan because the enterprise buyers (VP of Engineering, CISO) never see the product and the individual users cannot approve $50K+ annual contracts. Meanwhile, competitors with sales teams are closing these accounts.

**How to avoid:**
- [ ] Build enterprise detection signals: team size > 20, SSO inquiry, security review request
- [ ] Create a clear "Contact Sales" path from the product and pricing page
- [ ] Alert sales when an account reaches enterprise thresholds
- [ ] Do not require enterprise accounts to self-serve — offer white-glove onboarding

---

## Gotcha 11 — Billing Edge Cases

**Severity: MEDIUM**

**The mistake:** Not handling billing edge cases that are rare individually but common in aggregate — proration, mid-cycle plan changes, currency conversion, tax calculation, failed payment retry, refund workflows, and VAT/GST compliance.

**Why it happens:** V1 billing systems handle the happy path (signup → pay → renew). Edge cases surface after launch when real users do unexpected things: upgrade mid-cycle, downgrade immediately, dispute charges, request refunds, switch billing entities, or change countries.

**Real-world damage:** A user upgrades from monthly Pro ($20) to annual Business ($400/year). The system charges $400 without prorating the remaining $15 of their current month. The user disputes the charge, creating a chargeback. Support manually processes a refund and re-bills correctly. This scenario repeats 20 times per month across different edge cases, each requiring manual intervention.

**How to avoid:**
- [ ] Use a billing provider with built-in proration (Stripe handles this well)
- [ ] Test every plan transition: free→pro, pro→business, business→pro, annual→monthly, monthly→annual
- [ ] Handle dunning (failed payment retry) with grace periods, not immediate access revocation
- [ ] Calculate and display taxes before checkout confirmation
- [ ] Ensure VAT/GST compliance for EU/international customers

---

## Gotcha 12 — Analytics Data Quality

**Severity: MEDIUM**

**The mistake:** Running growth experiments and making decisions on dirty data — duplicate events, missing properties, bot traffic, inconsistent event names, broken funnels.

**Why it happens:** Analytics instrumentation is often done quickly, by multiple engineers, without a shared naming convention. Events are added ad hoc as needed, not from a planned taxonomy. QA for analytics is rarely as rigorous as QA for product features.

**Real-world damage:** A team runs an A/B test on onboarding. The test shows a 15% lift in activation rate. They ship the variant. Two weeks later, activation rate has not changed. Investigation reveals the "activation" event was double-firing for 30% of users in the variant group due to a React re-render bug. The actual lift was 2%, within noise.

**How to avoid:**
- [ ] Define event naming convention before writing any instrumentation code
- [ ] QA every analytics event as rigorously as you QA product features
- [ ] Run data quality checks daily (volume anomalies, missing properties, duplicate events)
- [ ] Filter bot traffic before analysis
- [ ] Validate experiment results with a holdout period after shipping

---

## Gotcha 13 — Low Experiment Quality

**Severity: MEDIUM**

**The mistake:** Running experiments without proper statistical rigor — peeking at results before reaching sample size, running too many variants, not defining success criteria upfront, calling inconclusive results as winners.

**Why it happens:** Pressure to show results. Teams want to "learn fast" and mistake speed for rigor. PMs peek at dashboards daily and declare victory as soon as the variant looks better, even with 200 users and 40% confidence.

**Real-world damage:** A team runs 10 experiments per quarter with an 80% "win rate." Sounds great — except most "wins" were called at 70-80% confidence (50/50 coin flip territory). When they audit the results 6 months later, only 3 of the 10 actually held up. The other 7 were false positives that wasted engineering time to ship.

**How to avoid:**
- [ ] Calculate required sample size before starting every experiment
- [ ] Do not peek at results before minimum sample is reached
- [ ] Set significance threshold at 95% for shipping decisions
- [ ] Use sequential testing if you must monitor early (but adjust alpha)
- [ ] Track experiment quality: what % of shipped experiments hold up after 4 weeks?

---

## Gotcha 14 — Mobile Upgrade Neglect

**Severity: MEDIUM**

**The mistake:** Designing upgrade flows only for desktop, leaving mobile users with broken checkout pages, tiny upgrade modals, or no upgrade path at all.

**Why it happens:** PLG products are often designed desktop-first. Mobile responsive design covers the product but not the upgrade/checkout flow, which is often a separate page or third-party integration.

**Real-world damage:** 35% of a product's traffic is mobile. Mobile users who hit feature gates see a desktop-sized modal with text they cannot read and a button they cannot tap. Mobile checkout completion rate: 8%. Desktop: 72%. The product is losing 35% of its upgrade opportunities.

**How to avoid:**
- [ ] Test all upgrade flows (modals, banners, checkout, pricing page) on mobile devices
- [ ] Support Apple Pay and Google Pay for one-tap mobile checkout
- [ ] Ensure upgrade modals are responsive with adequately-sized touch targets
- [ ] Track upgrade conversion rate segmented by device type

---

## Gotcha 15 — Referral Abuse

**Severity: MEDIUM**

**The mistake:** Launching referral incentives without abuse prevention. Users create fake accounts, use disposable emails, or build automated referral farms to harvest rewards.

**Why it happens:** Referral programs are designed for legitimate use cases. Abuse vectors are not considered until the program is live and being exploited. The incentive structure makes abuse profitable.

**Real-world damage:** A referral program offers $10 credit per referral. A user creates 50 fake accounts with disposable emails, earning $500 in credits. The fake accounts never activate. Cost per "acquired user": $10. Value per fake user: $0. The program's ROI turns negative when 20% of referrals are fraudulent.

**How to avoid:**
- [ ] Require referral activation (not just signup) before rewarding
- [ ] Block disposable email domains from referral eligibility
- [ ] Cap rewards per referrer (e.g., max 20 referrals)
- [ ] Flag accounts that generate referrals at abnormal rates
- [ ] Delay reward disbursement by 7-14 days to allow fraud detection
- [ ] Monitor referral-to-activation ratio — if < 10%, investigate fraud

---

## Gotcha 16 — Activation Metric Gaming

**Severity: LOW**

**The mistake:** Choosing an activation metric that can be completed without actually experiencing value — and then optimizing for it. The metric goes up, but retention does not follow.

**Why it happens:** Teams choose metrics that are easy to measure ("created an account" or "clicked the tutorial") rather than metrics that represent genuine value delivery ("completed first workflow with their own data").

**Real-world damage:** A team defines activation as "completed onboarding tutorial." They optimize the tutorial to be shorter and simpler. Tutorial completion rate goes from 30% to 70%. But D30 retention does not change because completing a tutorial is not the same as experiencing product value. The team optimized the wrong metric for 6 months.

**How to avoid:**
- [ ] Validate activation metric against retention: activated users should retain at 2x+ the rate of non-activated users
- [ ] The activation metric should represent a user action that delivers value, not a product-imposed step
- [ ] Re-validate the correlation between activation and retention quarterly
- [ ] If activation rate improves but retention does not, the metric is wrong

---

## Gotcha 17 — Feature Flag Debt

**Severity: LOW**

**The mistake:** Running experiments via feature flags and never cleaning them up. Over time, the codebase accumulates dozens of stale feature flags, creating maintenance burden, testing complexity, and potential bugs.

**Why it happens:** Shipping the winning variant is more exciting than removing the old code. Feature flag cleanup is never prioritized because it generates no visible value. "We'll clean it up later" becomes "we have 47 stale flags."

**Real-world damage:** A codebase has 35 active feature flags, of which 28 are from shipped experiments that were never cleaned up. A new engineer accidentally toggles a stale flag in production, causing a regression. Debugging takes 8 hours because nobody remembers what the flag does. Test matrix is 2^35 theoretical combinations.

**How to avoid:**
- [ ] Every experiment has a "cleanup" task in the same sprint as "ship"
- [ ] Set a maximum age for feature flags (30 days after decision)
- [ ] Run a monthly flag audit: list all flags, owner, decision, cleanup status
- [ ] Automate stale flag detection: alert when a flag has not been modified in 30+ days

---

## Gotcha 18 — International Payment Friction

**Severity: LOW**

**The mistake:** Supporting only USD payment with US-centric checkout (ZIP code, US card types) when a significant portion of your user base is international.

**Why it happens:** MVP billing is built for the domestic market. International payment support (multi-currency, local payment methods, tax compliance) is deferred as "phase 2" and never prioritized.

**Real-world damage:** 40% of a product's users are outside the US. The checkout page shows prices in USD only, requires a ZIP code (which international users do not have), and does not accept popular European payment methods (SEPA, iDEAL). International checkout completion rate: 25%. Domestic: 75%. The product is losing significant international revenue.

**How to avoid:**
- [ ] Show prices in local currency (Stripe supports automatic currency detection)
- [ ] Remove US-specific form fields (ZIP code → postal code, state → region/province)
- [ ] Support popular payment methods per region (SEPA for EU, UPI for India, PIX for Brazil)
- [ ] Calculate and display local taxes (VAT for EU, GST for AU/IN)
- [ ] Test checkout flow from different countries using VPN

---

## Severity Summary

| Severity | Gotchas | Numbers |
|----------|---------|---------|
| CRITICAL | Premature paywalls, Vanity metrics, Dark patterns | 1, 2, 3 |
| HIGH | Over-gating, Under-gating, PQL too aggressive, PQL too loose, Free tier costs, Spammy virality | 4, 5, 6, 7, 8, 9 |
| MEDIUM | Ignoring enterprise, Billing edge cases, Analytics quality, Experiment quality, Mobile upgrade neglect, Referral abuse | 10, 11, 12, 13, 14, 15 |
| LOW | Activation gaming, Feature flag debt, International payments | 16, 17, 18 |

---

## Quick Audit Checklist

Run this checklist quarterly or before any major PLG launch:

### CRITICAL (must pass all)
- [ ] Free users can reach the "aha moment" without hitting a paywall
- [ ] Primary dashboard shows activation rate and conversion rate, not just signups
- [ ] Upgrade and cancellation flows have been audited for dark patterns
- [ ] Cancellation requires the same number of steps as signup

### HIGH (must pass 5 of 6)
- [ ] Free tier is generous enough for evaluation but limited enough to motivate upgrade
- [ ] PQL scoring model has been calibrated in the last 30 days
- [ ] Free tier cost per user is known and < 15% of revenue
- [ ] All invite mechanics require explicit user initiation
- [ ] PQL-to-opportunity conversion rate is > 15%
- [ ] Feature gating matrix has been reviewed this quarter

### MEDIUM (must pass 4 of 6)
- [ ] Enterprise detection signals are instrumented and routed to sales
- [ ] All billing edge cases (proration, downgrade, currency) are tested
- [ ] Analytics events have been QA'd in the last 30 days
- [ ] Experiments have documented sample sizes and significance thresholds
- [ ] Mobile upgrade flow has been tested on iOS and Android
- [ ] Referral program has abuse prevention (activation requirement, caps, fraud detection)

### LOW (should pass all)
- [ ] Activation metric is validated against retention data
- [ ] Feature flags are cleaned up within 30 days of experiment decision
- [ ] Checkout supports international payment methods and currencies
