# Marketplace & Plugin Ecosystem — Gotchas

> Eighteen hard-won lessons from real marketplace and plugin ecosystem launches. Each gotcha is categorized by severity, explains why teams get bitten, and provides concrete mitigations. Read this before writing any marketplace code.

---

## Severity Legend

| Severity | Meaning |
|---|---|
| **CRITICAL** | Will kill your marketplace if not addressed before launch |
| **HIGH** | Will cause significant pain within 6 months |
| **MEDIUM** | Will accumulate friction and technical debt over time |
| **LOW** | Quality-of-life issue that compounds slowly |

---

## Gotcha 1 — The Empty Marketplace Problem (Cold Start Bootstrapping)

**Severity:** CRITICAL

### The Trap

You launch a marketplace with zero plugins. Users arrive, see nothing, and leave. Developers visit, see no users, and do not build. This is the classic two-sided marketplace chicken-and-egg problem, and it kills more marketplaces than any technical issue.

### Why Teams Fall Into It

Teams assume "if you build it, they will come." They invest months building marketplace infrastructure before ensuring a minimum viable catalog exists. They treat the marketplace as a technical project when it is fundamentally a go-to-market problem.

### Mitigation

| Strategy | Description | Effort |
|---|---|---|
| **Seed the catalog** | Build 10–20 plugins internally before launch. Staff them as if they were third-party. | High |
| **Partner pre-launch** | Recruit 5–10 partners 6+ months before launch. Co-develop their plugins. Fund development if needed. | High |
| **Hackathon launch** | Run a hackathon targeting developers in your community. Offer prizes. | Medium |
| **Integration focus** | Start with integrations (Slack, Google, GitHub) that users already expect. These are table stakes, not differentiators. | Medium |
| **Graduated launch** | Launch as "beta" or "labs" to set expectations. Only make the marketplace a prominent feature when catalog hits 30+ plugins. | Low |

**Metric to watch:** Do not publicly launch the marketplace until you have at least 20 plugins with at least 3 earning > 4.0 star ratings.

---

## Gotcha 2 — Quality vs. Quantity Trap

**Severity:** CRITICAL

### The Trap

You optimize for plugin count ("We have 500 plugins!") and end up with a marketplace full of abandoned, low-quality, and duplicate plugins. Users install one bad plugin, have a terrible experience, and associate that quality with your platform. They never return to the marketplace.

### Why Teams Fall Into It

Marketplace KPIs are usually set by leadership who think in "number of plugins" rather than "number of quality plugins." Early growth looks impressive on slides but hides the quality problem underneath.

### Mitigation

- Track "quality-weighted plugin count" instead of raw count: `count * avg_rating * retention_rate`
- Implement minimum quality thresholds (see `review-approval-workflow.template.md`)
- Sunset plugins that fall below 3.0 stars with < 10 installs for 6+ months
- Show health scores prominently on listings so users can self-select quality
- Curate a "Staff Picks" section that highlights quality over quantity
- Report "active plugins" (installs in last 30 days) instead of total plugins in all external communications

---

## Gotcha 3 — Malicious Plugin Supply Chain Attack

**Severity:** CRITICAL

### The Trap

A plugin passes review, gains installs, then pushes an update with malicious code (data exfiltration, credential theft, cryptomining). By the time you detect it, thousands of organizations are compromised. This is not theoretical — it happens regularly in npm, Chrome Web Store, and VS Code Marketplace.

### Why Teams Fall Into It

Review processes focus on initial submission and assume updates from verified developers are safe. Automated security scans catch known patterns but miss novel techniques. The update review pipeline is often weaker than the initial review.

### Mitigation

| Layer | Protection |
|---|---|
| **Update diffing** | Automatically diff update code against previous version. Flag new network calls, new permissions, obfuscated code. |
| **Behavioral monitoring** | Monitor plugin runtime behavior post-install. Flag unusual data access patterns, new external connections. |
| **Permission immutability** | Updates that request new permissions trigger full re-review (never auto-approve). |
| **Staged rollout** | Require staged rollout for updates: 1% → 10% → 50% → 100% with automatic rollback. |
| **Developer identity verification** | Require ID verification, business address, payment method before first publication. |
| **Incident response plan** | Prepare a "suspend all installs in 5 minutes" capability before you need it. |
| **Bug bounty** | Offer bounties for security researchers who find plugin vulnerabilities. |

---

## Gotcha 4 — Scope Creep from "Platform" to "Everything"

**Severity:** CRITICAL

### The Trap

Once you open a plugin API, developers immediately ask for more: more extension points, more data access, more permissions, more UI surfaces. Each request seems reasonable. You say yes to maintain developer goodwill. Within 18 months, your API surface is enormous, undocumented in parts, and impossible to evolve without breaking someone.

### Why Teams Fall Into It

Developer relations teams are incentivized to say yes. Product teams underestimate the maintenance cost of each new API surface. There is no "API budget" — no one tracks the total cost of the API surface.

### Mitigation

- Define extension points upfront and publish the list. New extension points require a formal RFC process.
- Apply the "Rule of Three": do not add an API until three independent developers request it.
- Version extension points independently so you can evolve popular ones without touching stable ones.
- Track "API surface cost" as a metric: each endpoint has a maintenance multiplier.
- Have a public API roadmap so developers know what is coming and do not request workarounds.

---

## Gotcha 5 — Breaking Changes That Break Trust

**Severity:** HIGH

### The Trap

You ship a platform update that breaks 50 plugins. Developers who invested weeks building on your platform wake up to user complaints and broken installations. Even if the breaking change was necessary, the damage to developer trust is severe and long-lasting. Developers talk to each other. Word spreads: "Do not build on {{PROJECT_NAME}} — they break your stuff."

### Why Teams Fall Into It

Internal teams move fast and see the plugin API as "just another API" subject to normal refactoring. They do not realize that plugin developers have no control over platform release timelines and cannot fix their code before users are affected.

### Mitigation

- Follow the deprecation timeline in `plugin-lifecycle.template.md` — 12 months minimum for standard deprecations
- Never break an API without providing a migration path (codemod, shim, compatibility layer)
- Run all published plugins against platform PRs in CI ("ecosystem CI")
- Give developers early access to breaking changes (beta channel, 30+ days before GA)
- Appoint an "API steward" whose job includes saying "no" to internal teams requesting breaking changes
- Maintain a public breaking change calendar

---

## Gotcha 6 — Developer Experience Friction Kills Adoption

**Severity:** HIGH

### The Trap

Your plugin SDK is powerful but takes 2 hours to set up. Documentation is comprehensive but assumes prior knowledge. The sandbox takes 10 minutes to provision. The review process takes 3 weeks. Each friction point loses developers. You end up with a technically impressive ecosystem that nobody builds for.

### Why Teams Fall Into It

Teams optimize for the experienced developer ("our SDK is very flexible") instead of the first-time developer ("I want a working plugin in 5 minutes"). Documentation is written by the people who built the system, not by someone learning it for the first time.

### Mitigation

| Friction Point | Target | How to Measure |
|---|---|---|
| Signup to SDK installed | < 3 minutes | Funnel analytics |
| SDK installed to Hello World | < 5 minutes | Funnel analytics |
| Hello World to first submission | < 2 hours | Funnel analytics |
| Submission to approval | < {{PLUGIN_REVIEW_SLA_DAYS}} days | SLA tracking |
| Sandbox provisioning | < 30 seconds | Infrastructure metrics |
| Documentation search to answer | < 2 minutes | Session recording analysis |

- Run a "five-minute test" monthly: give the quickstart to someone who has never seen it. If they cannot get Hello World running in 5 minutes, fix the quickstart.
- Invest in error messages. Every SDK error should tell the developer exactly what went wrong and how to fix it.
- Provide a "doctor" command: `npx @{{PROJECT_NAME}}/plugin-cli doctor` that diagnoses common setup issues.

---

## Gotcha 7 — Review Bottleneck

**Severity:** HIGH

### The Trap

Your review team of 2 people cannot keep up with 50 submissions per week. Review times stretch to 3 weeks. Developers get frustrated and stop submitting. Your marketplace growth flatlines because the bottleneck is human reviewers, not developer interest.

### Why Teams Fall Into It

They start with a manual review process that works at 10 submissions/week, then do not invest in automation as volume grows. They also under-hire for review, treating it as a part-time responsibility rather than a dedicated function.

### Mitigation

- Automate everything that can be automated (see `review-approval-workflow.template.md` Section 2)
- Target: 80% of submissions should pass or fail on automated checks alone
- Implement fast-track for trusted developers (Section 5 of the same file)
- Hire dedicated reviewers: plan for 1 reviewer per 50 submissions/week
- Auto-approve patch updates from developers with clean track records
- Publish your review SLA and track it publicly — accountability drives improvement

---

## Gotcha 8 — Revenue Share That Drives Developers Away

**Severity:** HIGH

### The Trap

You set a 30% revenue share because Apple does it. But your marketplace has 1/1000th of Apple's distribution power. Developers do the math: they could sell directly to your users and keep 97% (only Stripe fees). Your marketplace provides insufficient value to justify a 30% cut.

### Why Teams Fall Into It

They benchmark against the biggest marketplaces without considering their own distribution power. They set the rate before having data on what the marketplace actually delivers in terms of customer acquisition.

### Mitigation

- Start at 15% or lower when the marketplace is young. You need developers more than they need you.
- Implement progressive revenue share that decreases as developer revenue grows (see `marketplace-monetization.template.md`)
- Quantify the value the marketplace delivers: leads generated, conversion rate, customer acquisition cost savings
- Survey developers annually on revenue share satisfaction
- Offer alternatives to pure revenue share: flat listing fee, promoted placement, or usage-based pricing

---

## Gotcha 9 — Plugin Performance Degrading Platform

**Severity:** HIGH

### The Trap

A popular plugin has a memory leak. Another makes 200 API calls on page load. A third blocks the main thread for 500ms during render. Users do not know which plugin is causing slowness — they blame your platform. "{{PROJECT_NAME}} is slow" becomes the narrative, even though your core platform is fast.

### Why Teams Fall Into It

They focus on plugin functionality during review and neglect performance testing. They do not have runtime performance monitoring per plugin. When users complain about slowness, the support team cannot attribute it to a specific plugin.

### Mitigation

- Enforce performance budgets during review (max load time, max API calls, max bundle size)
- Implement per-plugin performance monitoring with attribution
- Add a "Plugin Impact" section to the settings UI showing each plugin's resource usage
- Set hard runtime limits: terminate plugins that exceed CPU/memory quotas
- Add a "safe mode" that disables all plugins so users can diagnose performance issues
- Name and shame (gently): show a warning if a plugin consistently exceeds performance thresholds

---

## Gotcha 10 — Data Privacy Compliance Nightmare

**Severity:** HIGH

### The Trap

A plugin accesses user email addresses and sends them to a third-party analytics service. An EU customer's DPA requires that all sub-processors are disclosed. Your Data Processing Agreement does not mention plugin developers as sub-processors. You are now potentially in violation of GDPR.

### Why Teams Fall Into It

Legal teams review the platform's own data practices but do not extend the analysis to the plugin ecosystem. The plugin permission model is treated as a technical feature, not a legal one.

### Mitigation

- Require every plugin with data access permissions to have a published privacy policy
- Maintain a list of all data sub-processors (each plugin developer is a potential sub-processor)
- Update your platform DPA to cover the plugin ecosystem
- Implement data classification: plugins cannot access PII without explicit user consent per plugin
- Add a "data used by plugins" section to your platform's privacy center
- Conduct annual privacy audits of the top 20 plugins by install count
- Implement data portability: users can export and delete all data a plugin has stored about them

---

## Gotcha 11 — SDK Versioning Hell

**Severity:** MEDIUM

### The Trap

You release SDK v2 with improvements. Half your plugins still use SDK v1. Some plugins pin to v1.3.7. You now maintain two SDK versions, two sets of documentation, and two test matrices. When a security patch is needed, you must backport it to both versions. This compounds with every major version.

### Why Teams Fall Into It

They add SDK features by bumping the major version instead of adding backward-compatible capabilities. They do not invest in codemods or migration tooling. They underestimate the inertia of developers who have working code and do not want to change it.

### Mitigation

- Minimize major version bumps. Add features as minor versions whenever possible.
- Support at most 2 major SDK versions simultaneously. Sunset the oldest when a new one ships.
- Provide automated migration tools (codemods) for every major version bump.
- Track SDK version distribution and set a sunset date for old versions with 12+ months notice.
- Design the SDK for extension, not modification: prefer new methods over changed method signatures.

---

## Gotcha 12 — Sandbox Environment Costs

**Severity:** MEDIUM

### The Trap

Every developer gets a sandbox. You have 500 developers. Each sandbox runs a full platform instance. Your sandbox infrastructure costs $50,000/month, and half the sandboxes have not been used in 30 days.

### Why Teams Fall Into It

They provision full-fidelity sandboxes (same as production) because "production parity" sounds important. They do not implement idle timeout or resource scaling. Each sandbox is always-on.

### Mitigation

- Implement aggressive idle timeout: suspend after 7 days of inactivity, terminate after 30 days
- Use shared infrastructure with tenant isolation instead of dedicated instances
- Scale sandbox resources dynamically: start small, scale up only during active development
- Offer a "lightweight sandbox" mode that uses mocked services for unit testing (no infrastructure cost)
- Track sandbox cost per developer and set per-developer budgets
- Show developers their sandbox resource usage and costs

---

## Gotcha 13 — Support Burden Mismatch

**Severity:** MEDIUM

### The Trap

Users contact your support team about plugin issues. Your support team does not know how the plugin works. They escalate to engineering. Engineering does not own the plugin. The ticket bounces between your team and the plugin developer for days. The user is furious.

### Why Teams Fall Into It

They do not define clear support responsibilities between the platform and plugin developers. Users do not distinguish between "platform bug" and "plugin bug" — they just know something is broken.

### Mitigation

- Implement clear support routing: "Is a plugin involved? → Route to plugin developer"
- Require all paid plugins to provide a support channel (email, forum, chat)
- Show the plugin developer's support link prominently in the installed plugin UI
- Provide support tools that attribute errors to specific plugins
- Set minimum support response time requirements for paid plugins (48 hours)
- Create a "Plugin Support" section in your help center explaining how plugin support works
- Build a "disable all plugins" toggle so support can quickly isolate plugin vs. platform issues

---

## Gotcha 14 — SEO Cannibalization

**Severity:** MEDIUM

### The Trap

Your marketplace listing pages rank for keywords that your marketing team is targeting. Plugin listings for "project management analytics" outrank your own product page for that term. You are now competing with your own marketplace for search traffic.

### Why Teams Fall Into It

Marketplace pages are content-rich (descriptions, reviews, screenshots) and search engines love them. SEO teams do not coordinate with marketplace teams. Nobody monitors keyword overlap.

### Mitigation

- Use `noindex` on low-quality plugin listings (< 10 installs, < 3.0 rating)
- Implement canonical URLs that point marketplace traffic to your product pages for core keywords
- Coordinate with marketing on keyword strategy — marketplace pages should target long-tail keywords, not head terms
- Use marketplace listings to link back to product pages ("Extend {{PROJECT_NAME}} with analytics tools")
- Monitor search rankings monthly for keyword overlap between marketplace and product pages

---

## Gotcha 15 — Ignoring Uninstall Signals

**Severity:** MEDIUM

### The Trap

Users uninstall plugins silently. You track install counts but not uninstall counts or reasons. A plugin with 10,000 installs and a 40% uninstall rate in the first week looks healthy by install count but is actually terrible. You promote it as "popular" based on cumulative installs.

### Why Teams Fall Into It

Uninstall tracking is treated as an afterthought. The uninstall flow does not ask why. Marketplace metrics focus on growth (installs) instead of retention (active installs).

### Mitigation

- Track net installs (installs minus uninstalls), not gross installs
- Show "active installs" on listings, not "total installs"
- Add an optional uninstall reason survey (1-click: "Did not need it" / "Did not work" / "Too expensive" / "Found alternative")
- Share uninstall data with developers on their dashboard
- Flag plugins with > 30% first-week uninstall rate for review
- Use uninstall rate as a signal in marketplace ranking algorithms (high uninstall = lower ranking)

---

## Gotcha 16 — First-Party Favoritism

**Severity:** LOW

### The Trap

Your internal team builds plugins for the marketplace. These plugins get featured placement, insider API access, and priority review. Third-party developers notice, feel disadvantaged, and publicly accuse you of unfair practices. The ecosystem trust erodes.

### Why Teams Fall Into It

Internal plugins are faster to build (no SDK friction), easier to review (trusted code), and strategically important. It is natural to give them advantages. But the perception of unfairness is more damaging than the actual advantages.

### Mitigation

- Subject first-party plugins to the same review process as third-party
- Do not give first-party plugins access to private APIs that third parties cannot use
- Label first-party plugins clearly as "Built by {{PROJECT_NAME}}"
- Publish marketplace ranking algorithm criteria (transparency)
- Rotate featured placement across first-party and third-party plugins
- Create an advisory board of external developers who provide input on marketplace policies

---

## Gotcha 17 — Discoverability at Scale

**Severity:** LOW

### The Trap

With 500+ plugins, users cannot find what they need. Category pages are overwhelming. Search is keyword-based and misses semantic intent. New plugins are buried under established ones. The marketplace feels like a junk drawer instead of a curated store.

### Why Teams Fall Into It

Discovery works fine at 50 plugins. At 500, the same category/search approach breaks down. Teams do not invest in discovery algorithms until the problem is severe. By then, years of undiscoverable plugins have accumulated.

### Mitigation

- Invest in semantic search early (before 100 plugins) — use embeddings, not just keyword matching
- Implement personalized recommendations based on org industry, size, and usage patterns
- Curate collections ("Analytics Stack," "Remote Work Essentials") with editorial oversight
- Add a "Similar Plugins" section to each listing page
- Implement "Related to what you use" recommendations on the homepage
- Add comparison pages for plugins in the same category
- Surface contextual plugin recommendations within the main product UI ("Need a Gantt chart? Install Timeline Pro")

---

## Gotcha 18 — Dependency Conflicts Between Plugins

**Severity:** LOW

### The Trap

Plugin A and Plugin B both modify the same UI area, hook the same event, or use conflicting CSS. When both are installed, they break each other. Users report bugs to both developers, each of whom says "it works fine for me." The platform has no conflict resolution mechanism because it was never designed for plugin interactions.

### Why Teams Fall Into It

Plugin systems are designed for a single plugin in isolation. Multi-plugin interactions are not tested during review. Extension points do not have a priority/ordering model. CSS isolation is incomplete.

### Mitigation

- Design extension points with explicit ordering: `priority` field in extension point registration
- Use CSS isolation (Shadow DOM, CSS Modules, or iframe boundaries) to prevent style leakage
- Test the top 10 plugin combinations during platform releases
- Provide a "conflict detection" API that warns when two plugins hook the same extension point
- Add a "compatibility" section to plugin listings where developers can declare known conflicts
- Build a "plugin compatibility matrix" that tracks known conflicts and publishes them publicly
- In the installed plugins UI, show a warning when two plugins may conflict

---

## Summary Table

| # | Gotcha | Severity | Primary Impact |
|---|---|---|---|
| 1 | Empty Marketplace (Cold Start) | CRITICAL | No ecosystem growth |
| 2 | Quality vs. Quantity | CRITICAL | User trust erosion |
| 3 | Malicious Plugin Supply Chain | CRITICAL | Security breach |
| 4 | Scope Creep / API Surface Bloat | CRITICAL | Unmaintainable API |
| 5 | Breaking Changes Break Trust | HIGH | Developer attrition |
| 6 | DX Friction Kills Adoption | HIGH | Low developer conversion |
| 7 | Review Bottleneck | HIGH | Growth ceiling |
| 8 | Revenue Share Pricing Wrong | HIGH | Developer economic disincentive |
| 9 | Plugin Performance Degradation | HIGH | User blames platform |
| 10 | Data Privacy Compliance | HIGH | Legal / regulatory risk |
| 11 | SDK Versioning Hell | MEDIUM | Maintenance burden |
| 12 | Sandbox Environment Costs | MEDIUM | Infrastructure cost spiral |
| 13 | Support Burden Mismatch | MEDIUM | Poor user support experience |
| 14 | SEO Cannibalization | MEDIUM | Marketing conflict |
| 15 | Ignoring Uninstall Signals | MEDIUM | Misleading health metrics |
| 16 | First-Party Favoritism | LOW | Developer trust erosion |
| 17 | Discoverability at Scale | LOW | Underutilized marketplace |
| 18 | Dependency Conflicts | LOW | Multi-plugin UX breakage |

---

## Pre-Launch Gotcha Review Checklist

Before launching a marketplace, verify mitigations are in place for all CRITICAL and HIGH severity gotchas:

**CRITICAL — Must be addressed before launch:**
- [ ] Marketplace seeded with 20+ plugins (Gotcha 1)
- [ ] Quality review process operational with minimum standards (Gotcha 2)
- [ ] Security review pipeline with update diffing and behavioral monitoring (Gotcha 3)
- [ ] Extension point list published and frozen for initial API version (Gotcha 4)

**HIGH — Must be addressed within first 6 months:**
- [ ] Breaking change policy published and enforced (Gotcha 5)
- [ ] Developer quickstart achieves Hello World in < 5 minutes (Gotcha 6)
- [ ] Review pipeline handles 2x current submission volume (Gotcha 7)
- [ ] Revenue share benchmarked against value delivered (Gotcha 8)
- [ ] Per-plugin performance monitoring deployed (Gotcha 9)
- [ ] Data privacy analysis for plugin ecosystem completed (Gotcha 10)

**MEDIUM — Should be addressed within first 12 months:**
- [ ] SDK versioning strategy documented with migration tooling (Gotcha 11)
- [ ] Sandbox idle timeout and cost monitoring active (Gotcha 12)
- [ ] Support routing clearly defined between platform and plugin developers (Gotcha 13)
- [ ] SEO keyword overlap monitored (Gotcha 14)
- [ ] Uninstall tracking and reason survey implemented (Gotcha 15)

**LOW — Address as ecosystem scales:**
- [ ] First-party plugin fairness policy published (Gotcha 16)
- [ ] Semantic search and personalized recommendations deployed (Gotcha 17)
- [ ] Plugin conflict detection mechanism implemented (Gotcha 18)
