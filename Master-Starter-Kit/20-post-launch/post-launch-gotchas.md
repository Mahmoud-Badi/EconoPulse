# Post-Launch Gotchas

> **Ten hard-won lessons from the real world of keeping products alive after launch.** Each of these was learned the expensive way. Read them before launch day. Re-read them monthly. They compound.

---

## How to Use This File

These are not tips. They are warnings from the field. Each gotcha follows the pattern established in the kit's `13-lessons-gotchas/` section:

1. **The gotcha** — What bites you
2. **Why it happens** — The root cause
3. **What it costs** — The real damage
4. **How to prevent it** — The fix

Read all ten before your product goes live. Tape the titles to your monitor if that helps. These are the mistakes that kill products slowly enough that you do not notice until it is too late.

---

## 1. Launch Is Not the Finish Line — It Is the Starting Line

**The gotcha:** You ship. You celebrate. You exhale. Then you move on to the next project, or take a break, or lose the intensity that got you to launch. The product slowly deteriorates. Users encounter bugs nobody is watching for. Feature requests pile up unread. The product you launched is not the product your users need six months from now.

**Why it happens:** Launch culture treats shipping as the climax. Every productivity framework, every sprint planning tool, every project management methodology is optimized for getting to launch. Almost none of them tell you what to do the day after.

**What it costs:** The first 90 days post-launch determine whether your product gains traction or quietly dies. Products that lose momentum in this window rarely recover it. Users who have a bad experience in the first week do not come back for your "big update" three months later.

**How to prevent it:** Before launch, write down the post-launch operating plan. Who monitors the dashboards? Who triages bugs? Who reads feedback? Who decides what to build next? If the answer to any of these is "we will figure it out after launch," you are already behind. Use the `post-launch-checklist.template.md` in this section. Start it on Day 1.

---

## 2. Feature Requests Are Not a Roadmap

**The gotcha:** Users start requesting features. You dutifully add them all to a list. The list grows. You start building from the top of the list. Six months later, you have built 15 features that 15 different users wanted, and your product has no coherent identity. New users are confused. Existing users cannot find anything. You have a Frankenstein product.

**Why it happens:** Feature requests feel like validated demand. "A real user asked for this" feels safer than "I think users need this." But individual requests are not demand signals — they are anecdotes. The plural of anecdote is not data.

**What it costs:** Product coherence. Every feature you add increases complexity for every user, not just the one who asked. A product that does 50 things poorly loses to a product that does 5 things well. Always.

**How to prevent it:** Feature requests are raw inputs, not decisions. They go through the triage process in `feature-request-triage.md`. They get RICE-scored. They get grouped into themes. They get evaluated against the product vision. The roadmap is built from themes and strategy, informed by feature requests — not composed of them.

---

## 3. Your First 100 Users Define Your Product — Listen Harder Than You Code

**The gotcha:** Your first 100 users are telling you everything you need to know about your product. They are telling you through their behavior (what they use, what they ignore), their support tickets (what confuses them), their feedback (what they wish existed), and their silence (what they expected but did not find). Most founders spend this critical period writing code instead of listening.

**Why it happens:** Coding feels productive. Listening feels passive. Developers default to building because that is their comfort zone. Talking to users is uncomfortable, especially when they tell you things you do not want to hear.

**What it costs:** You build the wrong thing. You spend three months on a feature that solves a problem your users do not have, while ignoring the problem they are shouting about in support tickets. The opportunity cost of misallocated development time in the first 90 days is enormous.

**How to prevent it:** Schedule five user calls in Week 1. Not surveys. Not feedback forms. Phone calls (or video calls) where you watch them use your product and ask open-ended questions. "What were you trying to do?" "Where did you get stuck?" "What did you expect to happen?" The answers will surprise you. They will also save you months of building the wrong thing.

---

## 4. Silent Churn Is Worse Than Vocal Complaints

**The gotcha:** You look at your support inbox. It is quiet. You look at your feedback channel. It is quiet. You conclude: "Users are happy." Then you look at your retention curve three months later and realize you have lost 60% of your users. They did not complain. They did not cancel with a reason. They just stopped showing up.

**Why it happens:** The users who complain are actually your most engaged users. They care enough to tell you something is wrong. The users who leave silently never cared enough — or they tried to care, hit a wall, and gave up. For every user who files a support ticket, there are 10 who had the same problem and said nothing.

**What it costs:** By the time you notice silent churn in your metrics, it has been happening for weeks. The users are gone. You have no data on why they left. You cannot fix a problem you did not know existed.

**How to prevent it:** Three things. First, watch retention cohorts weekly (see `post-launch-metrics-dashboard.template.md`). Do not wait for monthly reports. Second, set up automated exit surveys — when a user does not log in for 14 days, email them: "We noticed you have not been back. What happened?" Third, track feature adoption, not just logins. A user who logs in but never completes a workflow is churning in slow motion.

---

## 5. The Metrics You Do Not Track Are the Ones That Kill You

**The gotcha:** You set up basic analytics: page views, signups, maybe DAU. You feel instrumented. Then your database runs out of connections at 2 AM because nobody tracked connection pool utilization. Or your conversion rate drops 40% because nobody tracked the signup funnel step-by-step. Or your largest customer leaves because nobody tracked their specific usage patterns.

**Why it happens:** Setting up monitoring and analytics feels like overhead during the pre-launch sprint. Teams instrument the obvious metrics and skip the ones that require more setup effort. The result is blind spots in exactly the areas where problems emerge.

**What it costs:** Untracked metrics cause two types of damage: surprise failures (infrastructure metrics) and missed opportunities (product metrics). Both are expensive. A database outage at scale costs revenue and reputation. A broken conversion funnel that goes unnoticed for a month costs all the users you should have acquired.

**How to prevent it:** Before launch, make a list of every metric in `post-launch-metrics-dashboard.template.md` and verify each one is being captured. Not "we should track this" — actually verify the event fires, the data arrives in the dashboard, and the alert triggers when the threshold is crossed. Run a "game day" where you intentionally trigger each alert condition and verify the notification reaches the right person.

---

## 6. Post-Launch Is When Technical Debt Becomes Real

**The gotcha:** During the pre-launch sprint, you took shortcuts. You hardcoded a value here. You skipped input validation there. You wrote a SQL query that works for 100 rows but will not scale to 100,000. You knew these were shortcuts when you took them. You told yourself you would fix them after launch. Now it is after launch, and every shortcut is a ticking time bomb that detonates at the worst possible moment.

**Why it happens:** Pre-launch, technical debt is theoretical. "This query is O(n^2) but we only have 50 records." Post-launch, users create real data at real scale on real timelines you did not predict. The shortcuts that were fine at demo scale become critical failures at production scale.

**What it costs:** Emergency hotfixes at 2 AM. Data corruption that requires manual cleanup. Performance degradation that users experience as "this product is slow" (and they leave without telling you). Engineering time spent fighting fires instead of building features.

**How to prevent it:** Inventory your technical debt before launch. Write it down. Every shortcut, every TODO comment, every "we will fix this later." Then, in Week 1, triage that list. Prioritize by blast radius: "What is the worst thing that happens if this shortcut fails?" Fix the high-blast-radius items in the first month, before they detonate on their own schedule.

---

## 7. Your Deploy Process Is Only Tested When It Fails

**The gotcha:** You have a deploy pipeline. It works. It has worked every time you have used it. Then one day, a deploy fails halfway through. Or a deploy succeeds but introduces a regression. Or you need to roll back and discover that your rollback process does not work because you have never actually tested it. You are now debugging your deploy process during a production incident — the worst possible time to learn that something is broken.

**Why it happens:** Deploy pipelines are tested only in the happy path. Code passes CI, deploy succeeds, smoke test passes. Nobody tests: what happens when deploy fails mid-migration? What happens when rollback needs to revert a database schema change? What happens when two deploys run simultaneously?

**What it costs:** Extended downtime. An incident that should take 5 minutes (rollback) takes 2 hours (manual intervention). User trust damage. Team stress. The "we need to rewrite our deploy pipeline" project that consumes a sprint.

**How to prevent it:** Test your rollback process before launch. Actually deploy, then actually roll back, then verify everything works. Do this in staging AND in production (during low traffic). Test it quarterly thereafter. Document the exact rollback steps so that someone other than the person who built the pipeline can execute them at 3 AM.

---

## 8. User Onboarding Is Never Done — Revisit It Monthly

**The gotcha:** You built an onboarding flow. It was great when you launched. Then you added features, changed the UI, updated the navigation, and renamed things. The onboarding flow still shows the old flow with the old screenshots and the old feature names. New users follow it and end up confused because the product no longer matches the onboarding. Or worse — you never update onboarding when you add major features, so new users never discover them.

**Why it happens:** Onboarding is treated as a launch task, not an ongoing responsibility. It is built once, tested once, and then forgotten while the product evolves around it. Nobody owns "onboarding maintenance" as a recurring task.

**What it costs:** Your onboarding completion rate declines over time. New user activation drops. Support tickets for "how do I do X?" increase. Users who should be retained in the first week are lost because the first-run experience is stale.

**How to prevent it:** Add "onboarding review" to your monthly checklist. Every month: run through the onboarding flow yourself as if you are a new user. Check that every screenshot, every instruction, and every flow matches the current product. Check your onboarding completion rate metric. If it is declining, investigate immediately. Assign a specific person to own onboarding — not "the team," a person.

---

## 9. Competitor Launches Feel Urgent but Rarely Are

**The gotcha:** A competitor launches a new feature. Or a new competitor enters your market. Or an existing competitor raises funding. The team panics. The roadmap gets thrown out. "We need to build [competitor's feature] immediately." Two months later, you have half-built a feature your users did not ask for, and the features they did ask for are delayed.

**Why it happens:** Competitive pressure triggers fight-or-flight. It feels existential even when it is not. Founders and product teams overestimate the impact of competitor moves because they are hyper-aware of the competitive landscape. Your users, meanwhile, probably did not even notice the competitor's launch.

**What it costs:** Roadmap instability. Team whiplash. Features built reactively instead of strategically. The opportunity cost of not building what your users actually need. And ironically, the competitor features you rush to copy are often their experiments — half of which they will kill within a year.

**How to prevent it:** When a competitor launches something, do this instead of panicking: survey your users. "Did you see that [competitor] launched [feature]? Would that be useful to you?" If fewer than 20% say yes, it is not urgent. Log it, revisit it in quarterly planning, and stay on your roadmap. Your users chose you for a reason. Protect that reason. Do not dilute it chasing someone else's strategy.

---

## 10. The Best Post-Launch Feature Is Often Removing a Feature

**The gotcha:** After launch, the instinct is to ADD. More features. More options. More settings. More integrations. But every feature you add has ongoing costs: maintenance, documentation, testing, support tickets, UX complexity, cognitive load for users. Meanwhile, there are features in your product that almost nobody uses — but they still cost you all of these things. The most impactful thing you can do is not add a feature but remove one.

**Why it happens:** Addition feels like progress. Subtraction feels like failure. "We are removing features" sounds like the product is dying. "We are adding features" sounds like growth. This bias is universal, from product teams to individual developers to users themselves (who will protest a feature removal even if they never used the feature).

**What it costs:** Product bloat. Every unused feature is a maintenance tax on every future change. It slows down development velocity, increases the testing surface area, confuses new users who encounter features that "nobody really uses but we cannot remove," and dilutes the product's identity.

**How to prevent it:** At the 90-day mark, run a feature adoption audit. For every feature, measure: what percentage of active users used this feature in the past 30 days? Any feature below 5% adoption is a candidate for removal or redesign. Do not let sentimental attachment to code you wrote prevent you from making the product better by making it smaller. Read `feature-deprecation-playbook.md` before you start. Follow the 90-day deprecation process. Communicate clearly. Then remove it and watch your product get faster, simpler, and more focused.

---

## The Meta-Lesson

All ten of these gotchas share a root cause: **treating launch as the destination instead of the departure point.** The product you launch is version 0.1 of what your product will become. The users you launch to are giving you the data to build version 1.0. The metrics you track post-launch are the compass. The feedback you collect is the map.

The teams that internalize this — that launch is the beginning of the learning, not the end of the building — are the teams whose products survive the first year and thrive in the second.

Ship the product. Then start the real work.
