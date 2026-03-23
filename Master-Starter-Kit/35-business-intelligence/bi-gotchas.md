# Business Intelligence Gotchas

> Production lessons from teams that built data infrastructure, defined metrics, and delivered executive reporting — and got burned along the way. Every entry here represents a mistake that cost someone trust, time, or the ability to make good decisions. Read this before building your BI stack. It is significantly cheaper to learn from other people's data swamps than to drain your own.

---

## Data Infrastructure Gotchas

---

### Gotcha #1: Warehouse Sprawl

**The mistake**: Every analyst creates their own tables. Marketing has `marketing_sarah_mrr_v3_final`. Finance has `finance_team_mrr_corrected_jan`. The intern created `test_mrr_maybe_right`. There are 47 tables with "mrr" in the name. Nobody knows which one the board deck uses.

**Why teams fall into it**: Analysts need to move fast. Getting a PR reviewed and merged into the governed dbt project takes two days. Creating a personal table takes two minutes. Multiply that rational decision by 15 analysts over 18 months and you have a data warehouse that looks like a shared Google Drive — technically organized, practically unsearchable, and full of files named "final_v2_REAL_final."

**The fix**: Implement a clear schema strategy from day one. `raw.*` for ETL output (nobody touches). `staging.*` for cleaned/renamed source data. `marts.*` for governed business logic. `scratch.*` for analyst exploration (auto-deleted after 30 days). The governed schemas require PR review. The scratch schema is a free-for-all with an expiration date. This gives analysts speed without sacrificing governance. Crucially, any table referenced by a dashboard must live in `marts.*` — if it lives in `scratch.*` or a personal schema, it is not production-ready and should not be shown to anyone who makes decisions based on it.

---

### Gotcha #2: ETL Without Monitoring

**The mistake**: The ETL pipeline breaks on a Tuesday. The dashboard shows Monday's numbers all week. Nobody notices until Thursday's board meeting when the CFO asks why MRR has not changed in four days. The data engineer says "oh, the Stripe sync failed." The CFO says "when did it fail?" The data engineer says "...Tuesday?"

**Why teams fall into it**: ETL is infrastructure. Infrastructure is invisible when it works and catastrophic when it breaks. Teams invest heavily in building the pipeline and almost nothing in monitoring it. The ETL tool's built-in monitoring sends emails to a shared inbox that nobody reads. There are no freshness alerts. There are no row-count anomaly detections. There is a Slack message from three weeks ago saying "hey, anyone else seeing stale data?" that was never answered.

**The fix**: Every ETL job needs three things. First, a freshness SLA: "this table must be refreshed by 06:00 UTC daily." Second, a freshness alert: if the SLA is breached, alert the pipeline owner in a monitored channel. Third, a row-count anomaly check: if today's sync produces 50% fewer rows than yesterday, something is wrong even if the job technically "succeeded." The dbt `source freshness` command exists for exactly this purpose. Use it. Run it on a schedule. Alert on it. The 30 minutes you spend setting this up saves the careers of people who would otherwise present stale data to a board.

---

### Gotcha #3: Schema-on-Read Laziness

**The mistake**: The engineering team dumps raw JSON payloads from webhooks, API responses, and event streams directly into the warehouse. "We will figure out the schema later." Six months later, the warehouse contains 2TB of nested JSON that nobody can query without a 15-line LATERAL FLATTEN statement. "Later" never comes. The data is technically available and practically unusable.

**Why teams fall into it**: Schema-on-read feels like flexibility. It feels agile. It feels like you are not making premature decisions about data structure. What it actually is: deferring work from the person who understands the data (the engineer who built the integration) to the person who does not (the analyst who needs a number by Friday). The engineer moves on to the next project. The analyst writes a query that extracts 3 of the 47 nested fields and calls it done. The other 44 fields rot, unloved and unqueried.

**The fix**: Schema-on-write at the staging layer. The raw layer can store JSON — that is fine for auditability and reprocessing. But the staging layer must have explicit columns with types, constraints, and tests. `stg_billing__subscriptions` has a `subscription_id VARCHAR NOT NULL`, not a `raw_payload JSON`. If a field exists in the raw data and is useful, it gets a named column. If it is not useful, it does not get extracted. The staging model is the contract between "data at rest" and "data in use." A contract written in JSON is not a contract.

---

### Gotcha #4: No Backfill Strategy

**The mistake**: A bug is discovered in the dbt model that calculates MRR. The formula was excluding annual subscriptions that started mid-month — a logic error that has been present for four months. The engineer fixes the bug. MRR jumps 12% overnight. The dashboard shows a beautiful hockey stick. The CFO calls an emergency meeting thinking the company just had its best month ever. It did not — it has been underreporting MRR for four months.

**Why teams fall into it**: Fixing a transformation bug is a forward-looking action. Nobody thinks about what happens to the four months of historical data that was computed with the broken logic. The fix is applied, and the pipeline overwrites the latest snapshot. But the historical snapshots — stored in snapshot tables, exported to board decks, screenshotted in investor updates — all contain the wrong numbers. Nobody goes back to correct those artifacts because "it is just history."

**The fix**: Before fixing any transformation bug, answer three questions. First: how far back does the bug go? Second: which downstream artifacts (dashboards, reports, board decks, investor updates) consumed the incorrect data during that period? Third: can the historical data be recomputed, and if so, what is the backfill procedure? Document the backfill scope, run the reprocessing, and annotate any historical charts with a note explaining the restatement. Yes, this is embarrassing. It is less embarrassing than a board member discovering the discrepancy six months later during due diligence.

---

### Gotcha #5: CDC Without Handling Deletes

**The mistake**: The team sets up Change Data Capture (CDC) to stream changes from the application database to the warehouse. Inserts and updates flow beautifully. Then a customer exercises their GDPR right to deletion. The application database soft-deletes their record (sets `deleted_at`). The CDC pipeline sees the update to the `deleted_at` column and dutifully records it. But the staging model filters on `deleted_at IS NULL` for "active" records — which means the customer vanishes from the warehouse entirely. Their historical MRR, their support tickets, their feature usage — all gone. The MRR waterfall now does not balance because the churn event references a customer who does not exist in the data.

**Why teams fall into it**: CDC pipelines are typically configured to capture INSERT and UPDATE events. Soft deletes are UPDATEs, so they are captured. But the downstream transformation logic was written assuming records either exist or do not — it does not handle the "exists but is deleted" state. Hard deletes are worse: if the application permanently removes a row, the CDC pipeline never sees the delete event (most CDC tools require a tombstone record or a separate delete log). The warehouse retains the last version of the row forever, showing the customer as active when they have been purged.

**The fix**: Implement explicit delete handling at every layer. At the staging layer, add a `is_deleted` boolean column derived from `deleted_at IS NOT NULL`. At the mart layer, decide per metric whether deleted records should be included (yes for historical MRR calculations, no for current active customer counts). For hard deletes, either configure the application to soft-delete first (preferred) or maintain a delete log table that the CDC pipeline can consume. Test this explicitly: insert a record, delete it, and verify the warehouse handles it correctly at every downstream table.

---

### Gotcha #6: Connection Pooling Mismanagement

**The mistake**: The BI tool (Metabase, Looker, Tableau) is configured with default connection settings. It opens a new database connection for every dashboard panel, every filter change, and every auto-refresh. The executive dashboard has 12 panels, auto-refreshes every 5 minutes, and is open on 8 monitors in the office. That is 12 x 8 = 96 queries every 5 minutes, each holding a connection. Add 15 analysts running ad-hoc queries and you have exceeded the warehouse's connection limit. The warehouse either rejects connections (dashboards show errors), throttles queries (dashboards take 45 seconds to load), or crashes (everything breaks, including the application if it shares the warehouse — see Gotcha #1 in database-gotchas.md for why that is a separate problem).

**Why teams fall into it**: Connection pooling is a backend concern. BI tools abstract it away. The person configuring the dashboard has no idea how many connections are being opened. The DBA does not know that a BI tool was pointed at the warehouse until the connection graph spikes. There is no shared visibility between the "people who build dashboards" and the "people who manage database connections."

**The fix**: Configure the BI tool's connection pool explicitly: max connections, connection timeout, query timeout, and idle connection reclaim. Use a read replica or a dedicated analytics endpoint — never point the BI tool at the primary application database. Set query timeouts aggressively (30 seconds for dashboard queries, 5 minutes for ad-hoc). Implement query result caching in the BI tool so repeated identical queries (same dashboard panel, same filters, same time range) hit cache instead of the warehouse. Monitor active connections and set an alert at 70% of the warehouse's connection limit.

---

## Metric Definition Gotchas

---

### Gotcha #7: Metric Drift

**The mistake**: The product team reports churn is 2.1%. The finance team reports churn is 4.8%. The CEO asks "what is our churn rate?" and gets two different answers from two credible sources. Both teams are right. Product measures logo churn (percentage of customers who leave). Finance measures revenue churn (percentage of MRR lost). A single enterprise customer representing 15% of revenue churned — that is 1 customer (low logo churn) but massive revenue impact (high revenue churn). Neither team is wrong. The problem is that both call their number "churn rate" without qualification.

**Why teams fall into it**: Metric naming is a tragedy of the commons. Every team names metrics in the way that makes most sense for their context. Product cares about customer count (headcount drives support load, server load, feature usage). Finance cares about revenue (revenue drives runway, valuation, investor narrative). Both are valid frames. The problem is not that two definitions exist — the problem is that they share a name, creating an ambiguity that surfaces at exactly the worst moment: in front of the board, in an investor meeting, or in an all-hands where the CEO quotes one number and the VP of Product silently disagrees.

**The fix**: The unified metrics registry exists to prevent this. Every metric gets a unique, unambiguous name. There is no "churn rate" — there is "Churn Rate (Logo)" and "Churn Rate (Revenue)." Both are defined, both are tracked, both have owners. When someone says "churn rate" in a meeting without qualifying which one, the correct response is "which churn rate?" — and the registry is the reference that settles the question. This is not pedantry. This is how you prevent a $10M fundraising conversation from going sideways because the CEO and CFO quoted different numbers.

---

### Gotcha #8: Survivorship Bias in Dashboards

**The mistake**: The dashboard shows "Average Session Duration: 12 minutes." Leadership celebrates — users are deeply engaged. But the average is hiding a bimodal distribution: 60% of users bounce within 30 seconds (they opened the app, could not find what they needed, and left), and 40% have 25-minute sessions (power users). Nobody has a 12-minute session. The "average user" does not exist. The dashboard is showing the experience of a person who does not exist and hiding the experience of the 60% who are failing.

**Why teams fall into it**: Averages are easy. Medians require more SQL. Distributions require histograms, which require more dashboard real estate. Percentiles require explaining what "p50" means to executives who want a single number. So teams default to averages, which are misleading for any metric with a skewed distribution — and most engagement metrics are heavily skewed. The dashboard simplifies the complexity, and in doing so, erases the signal.

**The fix**: For any metric where user behavior varies widely (session duration, feature usage, revenue per customer), show the distribution, not just the average. At minimum, show median (p50) alongside the average — when they diverge significantly, the distribution is skewed and the average is lying. Better: show a histogram or at least the p25, p50, p75, and p95 values. Best: segment by user type (new vs. returning, free vs. paid, power vs. casual) and show metrics per segment. A metric that looks healthy in aggregate can be catastrophic for a specific segment that you care about.

---

### Gotcha #9: Vanity Metrics Addiction

**The mistake**: The weekly update proudly reports: total signups are up 15%, page views are up 22%, and the app has been downloaded 50,000 times. The board nods approvingly. But MRR is flat, activation rate is 8%, and 90% of those downloads never open the app again. The numbers that go up and to the right have no relationship to the numbers that determine whether the business survives. But they are in the slide deck because they feel good and because they grow monotonically (total signups can only go up — it is a cumulative metric, not a rate).

**Why teams fall into it**: Vanity metrics are psychologically rewarding. They provide a sense of progress. They are easy to grow (spend more on ads, get more signups). They are difficult to criticize ("are you saying more users is bad?"). They also tend to be cumulative, which means they never decline — and declining metrics create uncomfortable conversations. Teams gravitate toward metrics that create positive meetings, not metrics that create useful meetings.

**The fix**: Apply the "so what?" test to every metric in your dashboard. "Total signups are up 15%." So what? What does that mean for revenue? If signups go up but activation and conversion do not, you are filling a leaky bucket faster. Replace vanity metrics with actionable ones: instead of total signups, track activated signups. Instead of page views, track pages-per-session (engagement depth). Instead of app downloads, track 7-day retention (do they come back?). The rule of thumb: if a metric can go up while the business is dying, it is a vanity metric. Remove it from leadership dashboards. It can live in a marketing-specific dashboard where the context is understood.

---

### Gotcha #10: Lagging Indicator Fixation

**The mistake**: The team watches the churn dashboard religiously. On the first of every month, they review last month's churn number, analyze which customers left, and run a post-mortem. But by the time churn shows up in the dashboard, the customer decided to leave 30-90 days ago. The support tickets started three months before. The usage decline started four months before. The NPS score dropped six months before. Churn is the obituary. The team is reading obituaries when they should be reading vital signs.

**Why teams fall into it**: Lagging indicators are precise. Churn either happened or it did not. There is no ambiguity. Leading indicators are probabilistic. A customer whose usage dropped 40% might churn, or they might be on vacation. A customer who filed 8 support tickets in a month might be frustrated, or they might be your most engaged power user. Leading indicators require judgment, interpretation, and the willingness to act on incomplete information. Lagging indicators let you wait until the answer is clear — by which point the answer is also irreversible.

**The fix**: Build a leading indicator dashboard that sits alongside (not instead of) the lagging indicators. The customer health score (Section 33) is one approach — it combines usage, engagement, support sentiment, and billing health into a predictive score. But even without a composite score, track these leading signals: usage trend (declining week-over-week), engagement recency (days since last login), support sentiment (are tickets getting angrier?), feature breadth (using fewer features than before), and billing friction (failed payments, plan downgrades). When a customer shows three or more declining leading indicators simultaneously, intervene before they churn. You will not save every at-risk customer, but you will save more than zero — which is exactly how many you save by staring at the lagging indicator after they have already left.

---

## Executive Reporting Gotchas

---

### Gotcha #11: Dashboard Proliferation

**The mistake**: Eighteen months after deploying the BI tool, there are 243 dashboards. Seven of them are used weekly. Thirty-one are used monthly. The rest were created for a one-time analysis, a specific meeting, or a curiosity that lasted one afternoon. Nobody deletes dashboards because nobody knows which ones someone else depends on. New analysts spend their first week trying to figure out which of the 12 "Revenue Overview" dashboards is the real one. (It is the one bookmarked on the finance director's browser, not any of the ones whose names suggest they are authoritative.)

**Why teams fall into it**: Creating a dashboard is easy and free. Deleting one is risky — what if someone was using it? What if the board asks for "that chart we showed last quarter" and it has been deleted? So dashboards accumulate like tabs in a browser. The BI tool becomes a digital hoarder's apartment: every surface is covered, nothing is findable, and the occupant insists they know where everything is.

**The fix**: Implement dashboard lifecycle management. Every dashboard gets a classification: Tier 1 (executive, always maintained, always accurate, reviewed monthly), Tier 2 (departmental, maintained by the owning team, reviewed quarterly), Tier 3 (exploratory, auto-archived after 90 days of no views). Archive — do not delete — unused dashboards after their grace period. Maintain a dashboard registry (yes, just like the metrics registry) that lists the canonical dashboard for each audience and purpose. When someone asks "where do I find revenue data?" the answer should be a single URL, not "check the BI tool and look for one of the revenue dashboards."

---

### Gotcha #12: Reporting Without Narrative

**The mistake**: The weekly metrics email is a grid of numbers. MRR: $487,231. Churn: 2.3%. DAU: 4,821. NPS: 47. The CEO reads it, has no idea whether these are good or bad, forwards it to the VP of Finance with "thoughts?", and goes back to whatever they were doing. The numbers are accurate. They are also meaningless without context. Is $487K MRR above or below target? Is 2.3% churn improving or worsening? Is 4,821 DAU a lot for a company this size? The report generates data. It does not generate understanding.

**Why teams fall into it**: Analysts are trained to present data objectively. Adding narrative feels like editorializing. "MRR is $487K" is a fact. "MRR is $487K, which is 3% below our quarterly target, primarily driven by slower-than-expected new business in the enterprise segment" is an interpretation. Analysts worry that narrative introduces bias, that their interpretation might be wrong, or that they are overstepping by suggesting what the numbers mean. So they present the numbers and leave the interpretation to the reader — who does not have time to interpret.

**The fix**: Every metrics report needs three components: the number, the context, and the implication. The number is what it is. The context is how it compares to target, last period, and trend. The implication is what the number means for the business and what, if anything, should be done. This is not opinion — it is analysis. "MRR is $487K (3% below Q1 target). The gap is driven by enterprise deal slippage — 4 deals expected to close in February pushed to March. If all close as projected, we recover to target by end of Q1. If not, we need to revisit the Q2 forecast." That is what makes a report useful. Numbers without narrative are just noise on a screen.

---

### Gotcha #13: Board Deck by Committee

**The mistake**: The board meeting is Thursday. On Monday, an email goes out: "Please add your slides to the board deck by Wednesday." Marketing adds 6 slides. Product adds 8. Engineering adds 5. Finance adds 7. Sales adds 6. HR adds 4. Customer Success adds 5. Legal adds 2. The result is a 43-slide deck. The board meeting is 90 minutes. That is 2 minutes per slide. The board checks out by slide 12. The strategic discussion that was supposed to happen at the end gets 7 minutes. The CEO ends the meeting saying "we covered a lot of ground" when in reality nothing was covered in any depth.

**Why teams fall into it**: Every department has important updates. Every department head wants board visibility. Saying "you only get 2 slides" feels political — whose slides get cut? The path of least resistance is to include everything and let the board decide what to focus on. But boards do not curate decks in real-time. They politely sit through 43 slides, ask a few superficial questions, and leave without understanding the three things that actually matter.

**The fix**: Board decks should be 10-15 slides maximum, structured around 3-5 strategic questions the board needs to weigh in on — not a department-by-department status update. The CEO or CFO owns the deck structure. Departments contribute data to the relevant strategic sections, not their own standalone sections. An appendix can contain the departmental detail for board members who want to dig deeper, but the presented deck must be ruthlessly focused. The board-deck-templates.template.md in this section provides a structure designed for this: executive summary, financials, product, growth, strategic questions, and ask. Every slide that does not serve one of those purposes gets moved to the appendix.

---

### Gotcha #14: Confusing Precision with Accuracy

**The mistake**: The MRR dashboard shows $487,231.47. The board deck reports ARR as $5,846,777.64. This level of precision implies the numbers are accurate to the penny. They are not. The underlying data has timing discrepancies (a subscription that started at 11:58 PM UTC — does it count in this month or next?), currency conversion rounding, proration edge cases, and the fact that three enterprise customers are on custom invoicing that gets reconciled manually once a month. The real MRR is "approximately $487K, give or take 2-3%." But the dashboard shows $487,231.47 and people treat it as gospel.

**Why teams fall into it**: Computers produce precise numbers. $487,231.47 is what the SQL query returns. Rounding feels like losing information. Nobody wants to report "$487K" when they could report "$487,231" because the more precise number feels more professional, more rigorous, more "data-driven." The irony is that false precision actually undermines rigor: it creates an illusion of accuracy that the underlying data cannot support, leading to arguments about $500 variances that are within the margin of error.

**The fix**: Report at the precision level your data supports. If your MRR calculation has a 2% margin of error, report to the nearest thousand. "$487K" is more honest than "$487,231.47." Use the precise number for reconciliation and debugging, but use rounded numbers for reporting and decision-making. As a rule of thumb: if two people independently computed the same metric and their answers differ by 2%, the data is not precise enough to report to the penny. Round to the level where independent calculations would agree. For most SaaS metrics, that is thousands for MRR under $1M and tens of thousands for ARR above $5M.

---

## Organizational Gotchas

---

### Gotcha #15: No Metric Ownership

**The mistake**: The MRR dashboard has been showing a 3% discrepancy with the billing provider's dashboard for two months. Everyone has noticed. Nobody has fixed it. Product thinks it is a Finance problem. Finance thinks it is a Data Engineering problem. Data Engineering thinks it is a BI Analyst problem. The BI Analyst thinks it is a billing provider configuration problem. The discrepancy persists, eroding trust in the data, until someone mentions it in a leadership meeting and the CEO asks "whose job is it to fix this?" followed by a silence that answers the question.

**Why teams fall into it**: When a metric is calculated by data engineering, displayed by the BI team, used by finance, and sourced from a system that product selected, ownership is genuinely ambiguous. Everyone assumes someone else is responsible. The metric exists in a no-man's-land between four teams, each of which has a reasonable argument for why it is not their problem. And without explicit ownership, "not my problem" is the rational response — nobody wants to volunteer for accountability they were not assigned.

**The fix**: Every metric in the unified registry has an Owner column. That owner is responsible for the accuracy of the number — full stop. If the pipeline breaks, the owner does not have to fix it personally, but they are responsible for making sure it gets fixed. If the definition is ambiguous, the owner resolves the ambiguity. If the dashboard shows the wrong number, the owner investigates. Metric ownership should be assigned during the metric registration process and reviewed quarterly. When someone leaves the company or changes roles, their metric ownership must be reassigned — it does not just evaporate.

---

### Gotcha #16: BI Team as Service Desk

**The mistake**: The BI team has a Slack channel where anyone can request a report. It gets 15 requests per week. "Can you pull a list of customers who signed up in Q3 but never activated?" "Can you break down MRR by industry?" "Can you tell me how many support tickets enterprise customers filed last month?" Each request takes 1-4 hours. The BI team of 2 analysts spends 80% of their time fulfilling ad-hoc requests and 20% building the systematic infrastructure (data models, governed dashboards, self-serve analytics) that would eliminate most of those requests. They are trapped in a service-desk loop: the more requests they fulfill, the more requests they get, and the less time they have to build the self-serve layer that would break the cycle.

**Why teams fall into it**: Ad-hoc requests have immediate, visible value. The requester gets their answer and is happy. Self-serve infrastructure has deferred, invisible value — it prevents future requests that nobody can quantify yet. When the BI team has to choose between "make the VP of Sales happy today" and "build a data model that will make all future sales questions self-serve," the VP of Sales wins every time. Leadership evaluates the BI team on responsiveness (how fast they answer requests), not on leverage (how many requests they eliminated).

**The fix**: Allocate BI team time explicitly: 60% systematic work (data models, governed dashboards, self-serve analytics), 40% ad-hoc support. Track ad-hoc requests by category. When the same type of request comes in three or more times, it becomes a systematic project: build a self-serve dashboard or data model that answers the question permanently. Measure the BI team on "questions that can be answered without a human analyst" — that number should increase over time. Implement office hours for ad-hoc requests instead of an always-open Slack channel — this creates natural batching and discourages low-value "just curious" requests.

---

### Gotcha #17: Premature Tool Migration

**The mistake**: The team has been using Metabase for 14 months. It works. The dashboards are built. Users know how to use it. Then the VP of Engineering goes to a conference, sees a Looker demo, and comes back saying "we need to migrate to Looker." The rationale is vague — "better governance," "more scalable," "LookML is the future." The migration begins. It takes 6 months. During those 6 months, both tools exist — some dashboards are in Metabase, some in Looker, nobody knows which is canonical. The old dashboards do not get maintained because "we are migrating anyway." The new dashboards are half-built because the migration keeps slipping. For 6 months, the organization has worse data access than before the migration started. After 6 months, the Looker dashboards are operational but missing 30% of the functionality the Metabase dashboards had. "We will add that later."

**Why teams fall into it**: Tool envy. Every BI tool has limitations. Every other BI tool's marketing materials promise to solve those limitations. The grass is always greener on the other side of a vendor demo. The real cost of migration — not the license cost, but the human cost of rebuilding every dashboard, retraining every user, and running two systems in parallel during the transition — is systematically underestimated because it does not appear in the vendor's pricing calculator.

**The fix**: Before approving any tool migration, answer three questions with specifics, not vibes. First: what specific capabilities does the new tool provide that the current tool cannot, and can the current tool be configured or extended to provide them? (Often yes.) Second: what is the total migration cost including analyst time to rebuild dashboards, user training, parallel-run period, and lost productivity? (Typically 3-6x the estimate.) Third: if you invested the same amount of time and money in improving your current setup, would you get a better outcome? (Often yes.) Tool migrations are sometimes necessary. But "someone saw a demo" is not a sufficient reason to throw away 14 months of dashboard development.

---

### Gotcha #18: Data Democracy Without Governance

**The mistake**: The organization embraces "data-driven decision making." Everyone gets SQL access to the warehouse. The marketing coordinator writes a query. It joins two tables without a WHERE clause, creating a 4-billion-row Cartesian product. The warehouse's compute bill spikes $800. The data engineer's queries slow to a crawl. Meanwhile, the VP of Sales runs a query that reads the entire customer table including unmasked PII, exports it to a CSV, and emails it to a partner for a joint analysis. Nobody authorized this. Nobody knows it happened. But everybody has SQL access because "we are data-driven."

**Why teams fall into it**: "Data-driven culture" has become an aspirational identity. Restricting data access feels like restricting empowerment. Requiring SQL training before granting access feels like gatekeeping. The BI team champions "self-serve analytics" without building the guardrails that make self-serve safe. It is the organizational equivalent of giving everyone the keys to the server room because you value transparency.

**The fix**: Data democracy requires data governance — they are not opposites, they are complements. Implement three layers. First, access control: not everyone needs access to everything. Marketing does not need the raw billing tables. Finance does not need the raw event stream. Create role-based access that exposes the marts and dashboards relevant to each role, not the entire warehouse. Second, query guardrails: set resource limits per user role (marketing analysts get 60-second query timeout, data engineers get 5-minute). Block queries without a WHERE clause on tables above a certain size. These are not restrictions on thinking — they are restrictions on accidentally spending $800 on a Cartesian product. Third, PII governance: mask or hash personally identifiable information in analytics tables. The marketing coordinator does not need email addresses to analyze conversion rates. Column-level security exists in every modern warehouse — use it.
