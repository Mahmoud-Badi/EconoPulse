# Competitive Monitoring Cadence

> Competitive intelligence is useless if it is not maintained. This guide defines exactly what to monitor, how often, who is responsible, and what tools to use — with strict time budgets so monitoring stays a discipline, not an obsession.

---

## The Monitoring Pyramid

Monitoring follows a pyramid structure: high-frequency activities are automated and lightweight; low-frequency activities are manual and thorough. The goal is to catch 80% of competitive moves passively (through alerts and RSS) and invest manual time only on the 20% that matters strategically.

```
          /\
         /  \     Annual: Full landscape refresh (1 day)
        /    \
       /------\   Quarterly: Deep reassessment (4 hours)
      /        \
     /----------\  Monthly: Structured review (2 hours)
    /            \
   /--------------\ Weekly: Manual scan (30 minutes)
  /                \
 /------------------\ Daily: Automated alerts (<5 minutes)
```

---

## Daily Monitoring (Automated, Less Than 5 Minutes)

These run passively. You only spend time when an alert fires.

| What to Monitor | Tool | Setup Time | Daily Effort |
|----------------|------|-----------|--------------|
| Competitor brand mentions | Google Alerts | 10 min | Scan email digest |
| Competitor product names in news | Google Alerts | 5 min | Scan email digest |
| Social media mentions and sentiment | Twitter/X lists, LinkedIn | 15 min | Glance at feed |
| Product changelog updates | RSS reader (Feedly, Inoreader) | 20 min | Scan new entries |
| Competitor website changes | Visualping (pricing, homepage) | 15 min | Review change alerts |
| App store rating changes | AppFollow or Appfigures (mobile only) | 10 min | Review alerts |

### Daily Routine (5 Minutes)

1. Open your email — scan Google Alert digests for anything noteworthy
2. Open your RSS reader — scan competitor changelogs for new features
3. Check Visualping notifications — any pricing or homepage changes?
4. If anything significant: note it in your competitive intelligence log and decide if it triggers immediate action (see `competitive-intelligence-decision-tree.md`)
5. If nothing significant: move on. Do not go looking for things that are not there.

---

## Weekly Monitoring (Manual Scan, 30 Minutes)

Dedicated time block, same day each week. Tuesday or Wednesday mornings work well — you are past Monday catch-up but early enough to act if needed.

| What to Scan | Where | What to Look For | Time |
|-------------|-------|-----------------|------|
| Competitor blog posts | Their blog/RSS | New feature announcements, thought leadership shifts, customer stories | 5 min |
| Competitor social media | Twitter/X, LinkedIn | Messaging changes, engagement patterns, ad spend signals | 5 min |
| Product review sites | G2, Capterra, TrustRadius, Product Hunt | New reviews (especially negative ones), rating trends | 5 min |
| Industry news | Hacker News, TechCrunch, relevant subreddits | Funding announcements, acquisitions, new entrants | 5 min |
| Competitor job postings | LinkedIn Jobs, their careers page | New roles signaling strategic direction | 5 min |
| Your own mentions vs. competitors | Twitter/X search, Reddit search | How users compare you to competitors organically | 5 min |

### Weekly Scan Checklist

```
[ ] Scanned competitor blogs for new posts
[ ] Checked competitor social accounts for messaging changes
[ ] Reviewed new G2/Capterra reviews (theirs and ours)
[ ] Searched industry news for relevant announcements
[ ] Checked competitor job postings for strategy signals
[ ] Searched for organic user comparisons mentioning us and competitors
[ ] Noted anything significant in competitive intelligence log
[ ] Determined: any immediate action required? (Y/N)
```

### Job Posting Signal Interpretation

Job postings are one of the most reliable leading indicators of competitor strategy. What they hire for today tells you what they will ship in 6-12 months.

| They Are Hiring | What It Signals | Your Response |
|----------------|----------------|---------------|
| ML/AI engineers | Building AI features | Assess if AI is relevant to your users |
| Enterprise sales reps | Moving upmarket | Expect enterprise features, compliance, SSO |
| DevRel / Developer Advocates | Targeting developers, building ecosystem | Expect API improvements, docs investment, community |
| Data engineers | Building analytics/reporting features | Assess if your reporting is competitive |
| Mobile developers | Building or expanding mobile app | Assess your mobile strategy |
| Customer success managers | Retention focus, moving to higher-touch model | Consider your retention and support model |
| Reducing headcount / layoffs | Financial trouble or pivot | Opportunity — position as stable alternative |
| Security engineers | Building compliance features (SOC 2, HIPAA) | Relevant if you sell to enterprise |
| Growth marketers | Scaling acquisition | Expect increased competitive marketing pressure |
| Localization / i18n roles | Expanding to new geographies | Assess if those markets matter to you |

---

## Monthly Monitoring (Structured Review, 2 Hours)

Once per month, sit down for a structured review. Block the time on your calendar. This is not a casual scan — it is a deliberate analysis session.

### Monthly Review Agenda (2 Hours)

| Time | Activity | Output |
|------|----------|--------|
| 0:00 - 0:20 | Review competitor changelogs from the past month | List of new features shipped |
| 0:20 - 0:40 | Check competitor pricing pages for changes | Updated pricing notes |
| 0:40 - 1:00 | Analyze competitor hiring patterns | Strategy inference notes |
| 1:00 - 1:20 | Update feature parity matrix | Updated `feature-parity-tracking.template.md` |
| 1:20 - 1:40 | Review your own win/loss data from the past month | Updated `win-loss-analysis.template.md` |
| 1:40 - 2:00 | Write monthly competitive intelligence summary | 1-paragraph summary in your log |

### Monthly Competitive Intelligence Summary Template

```
## Monthly CI Summary — [Month Year]

**Key Changes:**
- [Competitor A] shipped [feature]. Impact: [low/medium/high].
- [Competitor B] changed pricing from [old] to [new].
- No significant changes from [Competitor C].

**New Threats:** [None / Description]
**New Opportunities:** [None / Description]
**Action Items:** [None / List]
**Feature Parity Matrix Updated:** [Yes/No]
**Battle Cards Updated:** [Yes/No — only if significant changes]
```

---

## Quarterly Monitoring (Full Reassessment, 4 Hours)

The most important review cadence. See `quarterly-reassessment-protocol.md` for the complete 10-step process.

### Quarterly Review Outputs

- Updated feature parity matrix
- Updated battle cards for top competitors
- Win/loss pattern analysis
- 1-page competitive landscape summary
- Recommended strategic adjustments
- Decision: is a full competitor re-audit needed?

### Quarterly Review Trigger

Even if you feel like nothing has changed, run the quarterly review anyway. Gradual shifts are invisible without structured comparison. The competitor that "hasn't changed" may have quietly shipped 15 small improvements that collectively shifted their positioning.

---

## Annual Monitoring (Landscape Refresh, 1 Full Day)

Once per year, do a full reset of your competitive intelligence.

### Annual Review Activities (8 Hours)

| Time | Activity | Output |
|------|----------|--------|
| 0:00 - 1:00 | Search for new market entrants missed by monitoring | Updated competitor list |
| 1:00 - 2:00 | Re-run full competitor audit for top 3 competitors | Refreshed competitor profiles |
| 2:00 - 3:00 | Redraw market positioning map | Updated positioning map |
| 3:00 - 4:00 | Full feature parity matrix rebuild from scratch | Clean feature matrix |
| 4:00 - 5:00 | Review full year of win/loss data for strategic patterns | Annual win/loss report |
| 5:00 - 6:00 | Rebuild all battle cards from current data | Fresh battle cards |
| 6:00 - 7:00 | Assess market trends and macro shifts | Market trend summary |
| 7:00 - 8:00 | Write annual competitive intelligence report | Annual CI report |

### Annual Review Considerations

- Has the market category itself changed? (e.g., "project management" becoming "work management")
- Are there adjacent categories encroaching on your space?
- Have any competitors been acquired, shut down, or pivoted away?
- Has your own positioning drifted from what you planned?
- Are there new customer segments you should target based on competitive gaps?

---

## Trigger-Based Monitoring (Event-Driven)

Some events demand immediate review regardless of your regular cadence. When these triggers fire, drop what you are doing on the competitive intelligence front and assess.

| Trigger Event | Urgency | Response Time | Action |
|--------------|---------|--------------|--------|
| Competitor announces funding round (>$5M) | High | Within 48 hours | Assess strategic implications, update battle card |
| Competitor ships a major feature you lack | High | Within 1 week | Run feature gap assessment, update parity matrix |
| Competitor changes pricing significantly | High | Within 1 week | Update pricing comparison, assess positioning impact |
| New well-funded competitor enters market | High | Within 2 weeks | Run competitor teardown, add to monitoring |
| Competitor gets acquired | Medium | Within 2 weeks | Assess integration timeline, position as stable alternative |
| Competitor has major outage or PR crisis | Medium | Within 1 week | Note for battle cards, do NOT exploit publicly (bad taste) |
| Competitor shuts down or pivots away | Medium | Within 1 week | Target their churned users, update market map |
| Competitor runs major marketing campaign | Low | Next weekly scan | Note messaging, assess positioning overlap |
| Competitor launches in new geography | Low | Next monthly review | Assess if geography matters to you |
| Competitor open-sources a product | Medium | Within 1 week | Assess community adoption risk, positioning impact |

### Trigger Response Protocol

1. **Confirm the trigger** — verify the information from a primary source (not just Twitter rumors)
2. **Assess urgency** — use the table above; most things feel urgent but are not
3. **Update the relevant artifact** — battle card, feature matrix, pricing comparison
4. **Decide on response** — use `competitive-intelligence-decision-tree.md`
5. **Communicate to team** — brief stakeholders if the trigger has strategic implications
6. **Return to your roadmap** — do not let a competitor trigger derail your plans unless it is truly strategic

---

## Monitoring Responsibility Assignment

For solo founders and small teams, one person owns all monitoring. For larger teams, distribute responsibilities.

### Solo Founder / Solo Developer

You do everything. Keep it to the time budgets above. Set up as much automation as possible and resist the urge to manually check competitors more than once per day.

### Small Team (2-5 People)

| Role | Responsibility | Time Investment |
|------|---------------|----------------|
| Product lead / Founder | Weekly scan, monthly review, quarterly reassessment | ~4 hours/month |
| Marketing / Growth | Social monitoring, content tracking, messaging changes | ~2 hours/month |
| Sales (if applicable) | Win/loss data collection, battle card feedback | ~2 hours/month |

### Larger Team (6+ People)

| Role | Responsibility | Time Investment |
|------|---------------|----------------|
| Product Manager | Feature parity matrix, quarterly reassessment, roadmap implications | ~4 hours/month |
| Competitive Intelligence Lead (if exists) | All monitoring, alert triage, teardowns | ~8-12 hours/month |
| Marketing | Messaging and positioning tracking, SEO/traffic comparison | ~2 hours/month |
| Sales | Win/loss interviews, battle card usage feedback, competitive objections | ~3 hours/month |
| Engineering | Technical teardowns, architecture assessments | ~2 hours/quarter |

---

## Tool Setup Checklist

Set up these tools to automate as much monitoring as possible. Prioritize free tools first.

### Free Tools

| Tool | What It Monitors | Setup Steps |
|------|-----------------|-------------|
| **Google Alerts** | Competitor mentions, funding, product news | 1. Go to google.com/alerts 2. Create alerts for each competitor name, product name, and "competitor + funding/pricing/launch" 3. Set delivery to daily digest 4. Set language and region as appropriate |
| **Twitter/X Lists** | Competitor social activity | 1. Create a private list called "Competitors" 2. Add competitor company accounts and key employees 3. Check the list during weekly scans (not your main feed) |
| **LinkedIn** | Job postings, company updates | 1. Follow competitor company pages 2. Set up job alert for each competitor 3. Follow key competitor employees |
| **RSS Reader (Feedly/Inoreader)** | Competitor blogs and changelogs | 1. Create a "Competitors" folder 2. Subscribe to each competitor's blog RSS, changelog RSS, and release notes feed 3. Check during daily monitoring |
| **Reddit** | User sentiment, organic comparisons | 1. Search for your product category subreddits 2. Set up keyword alerts for competitor names and your product name 3. Use Reddit's saved searches |
| **Google Patents** | Patent filings (long-term strategy) | 1. Search patents.google.com for competitor assignee names 2. Set up alerts for new filings 3. Review quarterly |

### Paid Tools (When Budget Allows)

| Tool | What It Monitors | Cost | Priority |
|------|-----------------|------|----------|
| **Visualping** | Webpage changes (pricing, features) | Free tier available, $10+/mo for more | High — set up pricing page monitoring first |
| **SimilarWeb** | Traffic estimates, referral sources | Free tier limited, $125+/mo | Medium — useful for quarterly reviews |
| **Ahrefs / SEMrush** | SEO, keyword rankings, backlinks | $99+/mo | Medium — if SEO is a primary channel |
| **SpyFu** | Competitor paid search keywords | $39+/mo | Low — if paid search is relevant |
| **Crayon / Klue** | Full competitive intelligence platform | $1000+/mo | Low — only for teams with dedicated CI function |
| **AppFollow / Appfigures** | App store monitoring | $29+/mo | High — if you have a mobile app |
| **G2 / Capterra alerts** | Review monitoring | Free for basic alerts | High — set up immediately |

### Tool Setup Priority Order

1. **Google Alerts** — 15 minutes, free, immediate value
2. **RSS Reader** — 20 minutes, free, passive monitoring
3. **Twitter/X Lists** — 10 minutes, free, social monitoring
4. **Visualping** — 15 minutes, free tier, pricing page monitoring
5. **LinkedIn job alerts** — 10 minutes, free, strategy signals
6. **G2/Capterra alerts** — 10 minutes, free, review monitoring
7. **Reddit saved searches** — 10 minutes, free, user sentiment
8. Everything else — set up as needed during monthly or quarterly reviews

**Total initial setup time: approximately 90 minutes.** After setup, daily monitoring should take less than 5 minutes.

---

## Monitoring Log Format

Keep a simple running log of competitive intelligence. A shared Google Doc, Notion page, or markdown file works fine. Do not over-engineer this.

```
## Competitive Intelligence Log

### 2026-02-20
- **[Competitor A]** Shipped new API integration with Slack. Minor feature, not strategic.
- **[Competitor B]** Posted 3 new job listings for ML engineers. May be building AI features.
- **Action:** None. Note for quarterly review.

### 2026-02-15
- **[Competitor A]** Changed pricing — removed free tier, lowest plan now $19/mo (was $9/mo).
- **Action:** Updated pricing comparison. Opportunity to position on affordability.
- **Battle card updated:** Yes.

### 2026-02-10
- **[New Entrant]** Launched on Product Hunt. YC-backed, similar feature set.
- **Action:** Running competitor teardown this week. Added to monitoring.
```

---

## When to Increase Monitoring Frequency

Temporarily increase monitoring intensity when:

- You are preparing for a major launch or pricing change
- A competitor just raised significant funding
- You are entering a new market segment
- Win/loss data shows increasing competitive pressure
- You are preparing for investor discussions and need current competitive positioning

When the triggering event resolves, return to the standard cadence. Do not permanently escalate monitoring — that path leads to competitor obsession.

---

## When to Decrease Monitoring Frequency

Reduce monitoring when:

- You are in deep build mode and monitoring is creating distraction
- Your market is stable with no new entrants for 6+ months
- Your win rate is strong and consistent
- You have a clear differentiation that competitors are not closing

Even at reduced frequency, never skip the quarterly reassessment. That is the minimum viable competitive intelligence practice.
