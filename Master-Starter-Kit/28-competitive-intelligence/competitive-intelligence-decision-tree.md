# Competitive Intelligence Decision Tree

> "A competitor just did X — what should I do?" This guide provides structured decision frameworks for every common competitive scenario. The goal is to respond strategically instead of reactively. Most competitor moves require noting, not panicking.

---

## The Default Rule

Before reading any specific scenario below, internalize this:

> **The best response to most competitor moves is: "Note it. Review at quarterly assessment. Stay on your roadmap."**

Competitor moves feel urgent. They rarely are. Your existing users did not wake up wanting to switch because a competitor posted on Product Hunt. Your roadmap was built on user research, not competitor anxiety. Changing your roadmap every time a competitor does something is the fastest way to build a mediocre product that copies everyone and leads no one.

The decision trees below help you distinguish the 10% of competitor moves that genuinely require a strategic response from the 90% that require nothing more than a log entry.

---

## Scenario 1: Competitor Shipped a Feature We Do Not Have

```
A competitor shipped a new feature.
|
├── Is it a feature your users are actively requesting?
│   ├── YES (multiple users have asked for this)
│   │   ├── Is it a table-stakes feature? (Every competitor has it, users expect it)
│   │   │   ├── YES → PRIORITIZE. You have a blocking gap. Move this up on your
│   │   │   │         roadmap. This is not copying — it is meeting market expectations.
│   │   │   │         Timeline: Plan within 1 sprint. Ship within 1-2 quarters.
│   │   │   │
│   │   │   └── NO → EVALUATE. It is requested but not universal.
│   │   │             Ask: does this align with our product vision?
│   │   │             ├── YES → Add to roadmap with appropriate priority.
│   │   │             │         Do not rush. Build it better.
│   │   │             └── NO → Explain to users why you are not building it.
│   │   │                       "We solve this differently with [X]."
│   │   │
│   │   └── Are users threatening to churn over this?
│   │       ├── YES → Escalate. This is a retention risk. Assess build timeline.
│   │       │         Consider: can you solve the underlying need differently?
│   │       └── NO → Standard roadmap prioritization. No panic.
│   │
│   └── NO (users have not asked for this)
│       ├── Is this a genuine innovation? (New way to solve a problem)
│       │   ├── YES → Monitor user reaction. If users start asking for it,
│       │   │         reevaluate in 30 days. Do not preemptively build.
│       │   └── NO → Likely marketing fluff or a niche feature.
│       │             Log it. Move on. Review at quarterly assessment.
│       │
│       └── Is this a feature you already decided NOT to build?
│           ├── YES → Revisit the "Conscious Gaps" section in your feature
│           │         parity matrix. Is the decision still valid? If yes, hold.
│           └── NO → Add to "Unknown" status in feature matrix. Research later.
│
└── RESPONSE SUMMARY:
    - Update feature parity matrix immediately
    - Update battle card if the feature changes competitive dynamics
    - Do NOT announce you are "working on it" unless you actually are
    - Do NOT copy their implementation — solve the user need your way
```

### Key Principle: Build for Users, Not Against Competitors

If you build a feature solely because a competitor has it, you will always be 6-12 months behind. Instead, understand WHY users want it and build a solution that fits YOUR product's architecture and vision. You may find a better approach they did not think of.

---

## Scenario 2: Competitor Cut Their Prices

```
A competitor reduced their pricing significantly (>20%).
|
├── Are you currently losing deals primarily on price?
│   ├── YES (price is the #1 loss reason in win/loss data)
│   │   ├── Is the price cut sustainable for them? (Are they funded/profitable?)
│   │   │   ├── YES (well-funded, can sustain low prices)
│   │   │   │   → STRATEGIC RESPONSE NEEDED. Options:
│   │   │   │     1. Match their price on a specific tier (if margins allow)
│   │   │   │     2. Add value to justify your price (new features, support, guarantees)
│   │   │   │     3. Create a lower-cost tier that competes directly
│   │   │   │     4. Reposition as premium — lean into quality/service/trust
│   │   │   │     Do NOT engage in a race to the bottom unless you have cost advantages.
│   │   │   │
│   │   │   └── NO (likely burning cash, unsustainable)
│   │   │       → WAIT IT OUT. They will raise prices eventually. Position yourself
│   │   │         as the stable, predictable option. "We do not play pricing games."
│   │   │
│   │   └── Is the price cut temporary? (Promotional, time-limited)
│   │       ├── YES → Ignore. Promotions end. Your value prop stands.
│   │       └── NO → Permanent restructuring. Assess strategic response above.
│   │
│   └── NO (price is NOT the primary reason you lose deals)
│       → IGNORE. Your value prop is working at your current price.
│         A competitor cutting prices when you are not losing on price
│         is a sign that THEY are struggling, not that you need to react.
│         Position as premium. Stability beats cheap.
│
└── RESPONSE SUMMARY:
    - Update pricing comparison in feature parity matrix
    - Update battle card pricing section
    - Do NOT knee-jerk match their price without data supporting it
    - If responding, respond with VALUE (more features, better support)
      not just price
```

### Key Principle: Price Is a Signal, Not a Command

When a competitor cuts prices, they are telling you something: they are struggling to win on value, they are trying to grab market share, or they are repositioning. None of these require you to cut your prices. React to your own data (win/loss analysis), not to their announcements.

---

## Scenario 3: New Competitor Entered the Market

```
A new competitor appeared in your market.
|
├── How much funding do they have?
│   ├── Well-funded (>$5M, VC-backed, notable investors)
│   │   ├── Is their product launched and functional?
│   │   │   ├── YES → HIGH ALERT.
│   │   │   │   1. Add to monitoring immediately
│   │   │   │   2. Run competitor teardown within 2 weeks
│   │   │   │   3. Create battle card
│   │   │   │   4. Sign up for their product (assess quality)
│   │   │   │   5. Assess: are they targeting your exact segment or an adjacent one?
│   │   │   │      ├── Your exact segment → Direct threat. Strengthen differentiators.
│   │   │   │      └── Adjacent segment → Monitor. They may expand your way later.
│   │   │   │
│   │   │   └── NO (pre-launch, announced but not shipped)
│   │   │       → MONITOR. Do not overreact to announcements. Many funded
│   │   │         startups never ship a competitive product. Add to quarterly
│   │   │         tracking. Check back in 90 days.
│   │   │
│   │   └── Who are the founders? (Domain experts? Serial entrepreneurs? First-time?)
│   │       ├── Domain experts with track record → Take seriously
│   │       ├── Serial entrepreneurs (different domain) → Monitor, they may pivot
│   │       └── First-time founders → Monitor casually, lower threat level
│   │
│   ├── Bootstrapped / Indie (<$5M or self-funded)
│   │   ├── Is their product better than yours in any dimension?
│   │   │   ├── YES → Respect the threat. Add to monitoring.
│   │   │   │         Bootstrapped companies can be dangerous —
│   │   │   │         they are efficient and customer-focused.
│   │   │   └── NO → Monitor casually. Add to annual assessment.
│   │   │
│   │   └── Add to Tier 2 or Tier 3 monitoring. Review quarterly.
│   │
│   └── Big company entering your niche (Google, Microsoft, Salesforce, etc.)
│       → HIGH ALERT. But do not panic.
│         Big companies entering your niche is scary but often less
│         threatening than it seems. They move slowly, build generic
│         solutions, and often abandon products that do not hit
│         internal revenue thresholds.
│         1. Assess within 2 weeks
│         2. Position as specialized vs. their generalist approach
│         3. Emphasize: focus, speed, customer intimacy, domain expertise
│         4. Monitor their commitment signals (dedicated team? executive sponsor?)
│         5. If they are serious: differentiate harder on niche use cases they
│            will never prioritize
│
└── RESPONSE SUMMARY:
    - Add to monitoring based on tier assessment
    - Run teardown if funded and launched
    - Do NOT change your roadmap based on a new entrant announcement
    - Stay focused on serving your existing users better
```

### Key Principle: New Entrants Are Overrated

Most new competitors that launch never reach meaningful market share. The ones that do succeed usually take 2-3 years to become a real threat. You have time. Use it to strengthen your product and customer relationships, not to panic.

---

## Scenario 4: Competitor Got Acquired

```
A competitor was acquired.
|
├── Who acquired them?
│   ├── Larger company in the same space
│   │   → OPPORTUNITY WINDOW.
│   │     Expect 6-12 months of integration chaos:
│   │     - Product development slows during integration
│   │     - Key employees leave (especially founders and senior engineers)
│   │     - Customers are uncertain about the product's future
│   │     - Pricing often increases post-acquisition
│   │
│   │     Your response:
│   │     1. Position as the independent, agile alternative
│   │     2. Create targeted content: "[Competitor] acquired — what it means for users"
│   │     3. Offer migration assistance for their unhappy customers
│   │     4. Monitor their product for stagnation signals
│   │     5. Long-term: expect the combined entity to be stronger. Prepare.
│   │
│   ├── PE (private equity) firm
│   │   → OPPORTUNITY.
│   │     PE acquisitions typically lead to:
│   │     - Cost-cutting (reduced engineering, support, marketing)
│   │     - Price increases (extracting value from existing customers)
│   │     - Reduced innovation (focus on margins, not product)
│   │
│   │     Your response:
│   │     1. Position on product quality, innovation, and support
│   │     2. Monitor for price increases — target their unhappy customers
│   │     3. Expect their product to stagnate over 12-24 months
│   │     4. "We invest in our product. They invest in their margins."
│   │
│   ├── Company in a different space (acqui-hire or strategic pivot)
│   │   ├── Product being maintained?
│   │   │   ├── YES → Monitor. May continue as a smaller priority.
│   │   │   └── NO (product being sunset)
│   │   │       → IMMEDIATE OPPORTUNITY.
│   │   │         1. Target their churned users immediately
│   │   │         2. Create migration guides and landing pages
│   │   │         3. Reach out directly if you have contact information
│   │   │         4. Run targeted ads on "[competitor] alternative" keywords
│   │   │         5. Move fast — other competitors will do the same thing
│   │   │
│   │   └── Was it an acqui-hire? (Team absorbed, product killed)
│   │       → Same as product sunset. Target their users.
│   │
│   └── Unknown / undisclosed acquirer
│       → MONITOR. Wait for more information. Do not speculate publicly.
│
└── RESPONSE SUMMARY:
    - Update battle card with acquisition status
    - Assess the 6-12 month outlook for the combined entity
    - Do NOT publicly attack or celebrate — it looks petty
    - DO position yourself as stable and independent
    - DO create migration content if the product is being sunset
```

---

## Scenario 5: Competitor Is Struggling

```
Signs that a competitor is struggling:
- Layoffs or team reduction
- Founder departure
- Significant price cuts
- Reduced marketing activity
- Negative press / poor reviews
- Product stagnation (no updates for 3+ months)
|
├── Are their customers actively looking for alternatives?
│   ├── YES (appearing in your sales pipeline, asking on forums/Reddit)
│   │   → ACT.
│   │     1. Create targeted content: "Switching from [competitor]" guide
│   │     2. Offer migration assistance (free data import, dedicated onboarding)
│   │     3. Consider a limited-time offer for switchers
│   │     4. Reach out to contacts you have in their customer base
│   │     5. Monitor review sites for their dissatisfied users
│   │
│   └── NO (struggling but customers are not leaving yet)
│       → PREPARE but do not pounce.
│         1. Create migration content proactively (SEO for when they do search)
│         2. Position as stable, well-funded, actively developing
│         3. Do NOT publicly attack a struggling competitor — it is bad taste
│            and it makes you look desperate
│         4. Let your product quality speak for itself
│
└── RESPONSE SUMMARY:
    - Be ready, not aggressive
    - Create helpful migration content
    - Never celebrate a competitor's failure publicly
    - Focus on being the obvious best alternative when their users start looking
```

### Key Principle: Win With Class

When a competitor struggles, your response says more about you than about them. Help their users transition gracefully. Do not gloat. The startup community is small, and people remember how you behaved.

---

## Scenario 6: Competitor Launched a Major Marketing Campaign

```
A competitor is running visible ads, PR, content marketing, or influencer campaigns.
|
├── Is their messaging directly positioning against you?
│   ├── YES (naming you, running comparison ads)
│   │   → ASSESS, then likely ignore.
│   │     If they are attacking you, it means you are big enough to matter.
│   │     That is a compliment.
│   │     1. Review their claims for accuracy
│   │     2. If claims are false or misleading: consider a factual response
│   │        (not emotional — factual corrections only)
│   │     3. If claims are accurate: improve on the weak points they highlighted
│   │     4. Do NOT engage in a public back-and-forth. You lose even if you "win."
│   │     5. Focus on serving your users. Let your product be the response.
│   │
│   └── NO (general marketing, not targeting you specifically)
│       → NOTE for quarterly review. Do not respond.
│         Their marketing campaign is not about you.
│         Continue executing your own marketing strategy.
│
├── Are they outspending you significantly?
│   ├── YES → Do not compete on spend. Compete on efficiency.
│   │         Focus on channels where money does not win:
│   │         - SEO (quality content beats ad spend long-term)
│   │         - Community (authentic engagement beats paid promotion)
│   │         - Product-led growth (good product generates word of mouth)
│   │         - Customer testimonials (earned media beats paid media)
│   │
│   └── NO → Continue your strategy. Their campaign will end.
│
└── RESPONSE SUMMARY:
    - Do not match competitor marketing spend reactively
    - Do not engage in public competitive attacks
    - Focus on your own marketing strategy
    - Note messaging themes for quarterly positioning review
```

---

## Scenario 7: Competitor Announced a Partnership or Integration

```
A competitor announced a major partnership or integration.
|
├── Is the partner/integration critical to your users?
│   ├── YES (your users use that tool/platform daily)
│   │   → ASSESS priority of building the same integration.
│   │     1. Check: do your users already have a workaround? (Zapier, manual, etc.)
│   │     2. How many users have requested this integration?
│   │     3. Is this partnership exclusive? (Usually not)
│   │     4. Can you build a BETTER integration? (Deeper, real-time, bi-directional)
│   │     5. Prioritize based on user demand, not competitor announcement.
│   │
│   └── NO (not a tool your users care about)
│       → IGNORE. Log for quarterly review. Not every integration matters.
│
└── RESPONSE SUMMARY:
    - Partnerships are rarely exclusive
    - Build integrations your users ask for, not ones competitors announce
    - A deep integration with 5 tools beats a shallow integration with 50
```

---

## Scenario 8: Competitor Pivoted or Changed Direction

```
A competitor significantly changed their product focus, target market, or positioning.
|
├── Did they pivot TOWARD your market?
│   ├── YES → Treat as new market entrant (Scenario 3).
│   │         They have existing technology and customers,
│   │         so they may be more dangerous than a startup.
│   │
│   └── NO (they pivoted AWAY from your market)
│       → OPPORTUNITY. They are de-prioritizing your space.
│         1. Target their customers who need what you offer
│         2. Fill the gaps they are leaving
│         3. They may maintain the old product as a cash cow — monitor
│         4. Do not assume they are gone — pivots can reverse
│
└── RESPONSE SUMMARY:
    - A competitor pivoting away is an opportunity
    - A competitor pivoting toward you is a new threat — assess quickly
    - Watch for signals in their product development and hiring
```

---

## The Master Decision Matrix

When in doubt, use this simplified matrix:

| Competitor Action | Urgency | Default Response | Escalate If... |
|------------------|---------|-----------------|----------------|
| Shipped a feature | Low | Log, update matrix | Users are churning over it |
| Cut prices | Low | Log, update comparison | You are losing 30%+ deals on price |
| New entrant (funded) | Medium | Add to monitoring, teardown in 2 weeks | They target your exact segment with a good product |
| New entrant (bootstrapped) | Low | Add to annual review | Their product is actually better |
| Got acquired | Medium | Position as independent alternative | Product is being sunset (target users) |
| Major marketing campaign | Low | Note, continue your strategy | They are directly attacking you with false claims |
| Partnership / integration | Low | Log, assess user demand | Users are requesting the same integration |
| Pivoted toward you | Medium | Treat as new entrant | They have significant existing tech/users |
| Pivoted away | Low | Target their users | N/A |
| Struggling / layoffs | Low | Prepare migration content | Their users are actively looking for alternatives |

---

## The Anxiety Test

Before reacting to any competitor move, ask yourself these three questions:

1. **Are my users asking for this?** If not, it does not matter what competitors do.
2. **Is this actually a threat, or does it just feel like one?** Most competitor moves feel urgent but are not.
3. **What would happen if I did nothing?** Usually: nothing bad. Your users are not watching your competitors as closely as you are.

If the answer to all three is "no, it just feels bad, and nothing would happen" — log it, move on, and review at the next quarterly assessment.

> "The best competitive advantage is not reacting to competitors. It is building what your users need, faster and better than anyone else."
