# Stack Audit Gotchas

> Not every audit finding requires action. Some are false alarms that waste engineering time. Others look minor but hide real danger. This file helps you tell the difference — calibrated by production experience, not theoretical risk.

---

## Overview

The first time you run a stack health audit, the results will alarm you. npm audit will report 47 vulnerabilities. Half your dependencies will be "outdated." GitHub stars for your ORM will look low. The temptation is either to panic and upgrade everything, or to dismiss the audit as noise and ignore it entirely. Both reactions are wrong. This file trains your judgment on what matters, what does not, and what looks harmless but will hurt you later.

**When to read this:** After completing your first stack health audit. Revisit whenever an audit finding seems ambiguous.

---

## Gotcha 1: Being One Minor Version Behind Is Not a Security Risk

**Type: FALSE ALARM**

**What the audit shows:** Your framework is on v14.1.0 and v14.2.3 is available. The audit flags it as BEHIND.

**Why it feels urgent:** The word "behind" implies risk. Your instinct says "update everything."

**The reality:** Minor version updates contain bug fixes and small features. They almost never contain security patches that were not also backported to your minor version. Being one minor version behind is normal engineering. Most teams pin to a minor version and update deliberately, not reactively.

**When it IS a problem:** When the minor version contains a specific security patch that was NOT backported. Check the release notes — if the changelog mentions CVE fixes, read them. Otherwise, schedule the update for your next maintenance window and move on.

**Real example:** A team spent two developer-days urgently upgrading from Next.js 14.0.4 to 14.1.0 because the audit flagged them as "behind." The upgrade introduced a subtle hydration behavior change that caused a production bug. The "outdated" version had no security issues. The upgrade was pure waste.

---

## Gotcha 2: npm audit "High Severity" Does Not Always Mean Exploitable

**Type: FALSE ALARM (usually)**

**What the audit shows:** `npm audit` reports 12 high-severity vulnerabilities. Your dashboard turns red.

**Why it feels urgent:** "High severity" sounds like your application is actively vulnerable to attack.

**The reality:** npm audit reports vulnerabilities in your entire dependency tree, including transitive dependencies five levels deep that your application never directly invokes. A "high severity" ReDoS vulnerability in a Markdown parser used by a dev-only documentation generator is not exploitable in your production application. The severity rating reflects the vulnerability's potential impact if the vulnerable code path is reached — it does not tell you whether YOUR code reaches it.

**When it IS a problem:** When the vulnerability is in a direct dependency AND the vulnerable code path is reachable from your application's execution flow AND the input that triggers it comes from untrusted sources. That combination is rare but real — when it exists, it is genuinely critical.

**How to triage:** For each high/critical finding, answer three questions: (1) Is this a direct or transitive dependency? (2) Does my application invoke the vulnerable function? (3) Can untrusted input reach that function? If any answer is "no," the finding is informational, not actionable.

**Real example:** A SaaS team blocked a release for a week to resolve 23 npm audit findings. Twenty-one were in transitive dependencies of their test framework — completely unreachable in production. The two real findings were in a direct dependency and took 30 minutes to patch. The other 21 hours were wasted.

---

## Gotcha 3: Low GitHub Stars Does Not Mean Abandoned

**Type: FALSE ALARM**

**What the audit shows:** A dependency in your stack has 2,000 GitHub stars while the popular alternative has 45,000. The community health section flags it as a risk.

**Why it feels urgent:** Stars feel like a proxy for quality and sustainability. Fewer stars implies fewer users, less testing, higher abandonment risk.

**The reality:** GitHub stars measure marketing, not maintenance. A library that solves a niche problem exceptionally well may have 2,000 stars and a dedicated maintainer who ships weekly releases. A library with 45,000 stars may have a burned-out maintainer who has not merged a PR in six months. Stars are vanity metrics. Commit frequency, release cadence, and issue response time are health metrics.

**When it IS a problem:** When low stars COMBINE with other red flags — no commits in 6+ months, unresponded issues, no releases in a year, sole maintainer with no activity. Low stars alone is noise. Low stars plus inactivity is a signal.

**How to check properly:** Look at the commit graph (last 12 months), the issue response time (are maintainers engaging?), and the release history (when was the last release?). A library with 500 stars, weekly commits, and responsive maintainers is healthier than one with 50,000 stars and a dormant repository.

**Real example:** A team pivoted away from a well-maintained ORM (3,000 stars, weekly releases, responsive maintainer) to a "more popular" alternative (40,000 stars) because the audit flagged community health concerns. The popular alternative had architectural limitations that required workarounds, costing more engineering time than the original would have.

---

## Gotcha 4: Breaking Changes in Major Versions Are Expected, Not Scary

**Type: FALSE ALARM**

**What the audit shows:** A major dependency released v5.0.0 with 47 breaking changes. Your audit flags it as requiring migration.

**Why it feels urgent:** "Breaking changes" sounds like things will break. Forty-seven of them sounds catastrophic.

**The reality:** Breaking changes in major version releases are how healthy software evolves. Semantic versioning exists precisely to communicate this — a major version bump means "the API surface has changed intentionally." Most breaking changes are renamed functions, removed deprecated APIs, or changed default behaviors. They are documented, expected, and typically come with a migration guide and codemods.

**When it IS a problem:** When the breaking changes fundamentally alter the programming model (e.g., React class components to hooks, Angular.js to Angular 2+), when no migration guide exists, or when the breaking changes affect your most performance-critical code paths. In those cases, the migration is real work — but it is planned work, not an emergency.

**How to assess:** Read the migration guide before estimating effort. Most "47 breaking changes" boil down to 3-4 that actually affect your codebase, plus a find-and-replace for renamed imports. Run the codemod if one is provided and see how much it catches.

**Real example:** A team estimated 3 weeks to migrate from a framework's v4 to v5, citing "dozens of breaking changes." The migration guide included a codemod that handled 90% of the changes automatically. The actual migration took 2 days, including testing.

---

## Gotcha 5: License Changes ARE Scary — Watch for MIT to BSL/SSPL Shifts

**Type: REAL WARNING**

**What the audit shows:** A dependency you use changed its license from MIT to BSL (Business Source License) or SSPL (Server Side Public License) in the latest version.

**Why it might seem minor:** "It is still open source, right?" The code is still visible on GitHub. You can still read it, fork it, and even use it — under certain conditions.

**The reality:** BSL and SSPL are NOT traditional open-source licenses. BSL restricts commercial use — typically prohibiting you from offering a competing hosted service. SSPL requires that if you offer the software as a service, you must open-source your entire stack. These restrictions can be incompatible with your business model. Companies like MongoDB (SSPL), HashiCorp (BSL), and Elastic (SSPL then back) have made these shifts, and commercial users have been forced to fork or migrate.

**When you must act:** If you use the dependency in a SaaS product, read the new license immediately. Determine whether your use case falls under the restricted activities. If it does, you must either (a) stay on the last MIT-licensed version forever (it will stop receiving patches), (b) negotiate a commercial license, or (c) migrate to an alternative.

**How to detect:** Run `license-checker` or `license-report` in your CI pipeline. Diff the output between releases. Any change from a permissive license (MIT, Apache-2.0, BSD) to a restrictive one (BSL, SSPL, AGPL, Commons Clause) should trigger an immediate review.

**Real example:** When HashiCorp changed Terraform's license from MPL to BSL in August 2023, companies that had built commercial Terraform-as-a-Service offerings suddenly faced legal uncertainty. Those who detected it early had time to evaluate OpenTofu (the community fork). Those who missed it discovered the problem during legal review of their next funding round.

---

## Gotcha 6: Performance Benchmarks from Two Years Ago Do Not Reflect Current State

**Type: REAL WARNING**

**What the audit shows:** Your research into an alternative dependency surfaces a benchmark from 2023 showing it is 3x faster than your current choice.

**Why it seems reliable:** The benchmark was well-constructed, the methodology was sound, and the author is credible.

**The reality:** Framework and library performance changes significantly between major versions. A benchmark comparing Express v4 to Fastify v3 in 2023 tells you nothing about Express v5 vs Fastify v5 in 2026. Optimizations, architectural changes, and new features alter performance profiles. V8 engine improvements change the runtime characteristics of JavaScript code. Database drivers get rewritten. ORMs add query caching.

**When it IS useful:** Old benchmarks are useful for understanding relative architectural advantages — if Fastify was faster because of its schema-based serialization approach, that architectural advantage likely persists. But the magnitude of the difference will have changed.

**How to handle:** If a migration decision hinges on performance, run your own benchmark using your actual workload patterns, your actual data volumes, and current versions of both options. A 30-minute benchmark with realistic data is worth more than any blog post.

**Real example:** A team chose to migrate from one database driver to another based on a benchmark showing 40% better throughput. The benchmark was from 2022. By the time they migrated in 2025, the original driver had been rewritten with connection pooling improvements that made it 15% faster than the alternative. The migration cost 3 developer-weeks for a net performance regression.

---

## Gotcha 7: "Works on My Machine" Version Drift

**Type: REAL WARNING**

**What the audit shows:** The audit looks clean — all versions current, no CVEs.

**What is actually happening:** The audit ran against `package.json` or `requirements.txt`, not against what is actually deployed. Your lock file has not been regenerated in 8 months. Your CI installs from the lock file (correct), but a developer ran `npm install` without committing the updated lock file. Production, staging, and local development environments are running different dependency versions.

**Why this is dangerous:** Version drift between environments is the most common source of "works in dev, breaks in prod" bugs that are nearly impossible to reproduce. It also means your security audit may not reflect what is actually running in production.

**How to detect:** Compare lock file modification date to package.json modification date. If package.json was modified more recently, the lock file may be stale. Run `npm ci` (not `npm install`) in CI to ensure reproducible builds. Audit against the lock file, not the manifest.

**Real example:** A team's audit showed zero vulnerabilities. But their `package-lock.json` had not been regenerated in 11 months, and three transitive dependencies had been resolved to versions with known CVEs that newer lock file resolutions would have avoided. A clean `npm audit` against a stale lock file is a false negative.

---

## Gotcha 8: Free Tier Does Not Mean Free at Scale

**Type: REAL WARNING**

**What the audit shows:** Cost column looks great — several services on free tiers, total infrastructure under $100/month.

**What is actually happening:** You are 80% of the way to a pricing cliff. Your auth provider is free up to 10,000 MAU, then jumps to $250/month. Your database is free up to 500MB, then jumps to $25/month. Your hosting is free up to 100GB bandwidth, then charges $0.15/GB. None of these are visible in your current bill.

**Why this is dangerous:** Free tiers create a false sense of cost efficiency. When you hit the limits — and growth means you will — costs appear suddenly and simultaneously across multiple services. Teams that plan their runway based on current costs get surprised by a 10x infrastructure cost increase overnight.

**How to detect:** For every service on a free tier, document the limit and the cost at 2x and 10x your current usage. Plot the cost curve. Identify pricing cliffs. Factor the post-cliff costs into your financial model from day one.

**Real example:** A startup projected $200/month infrastructure costs for their seed-stage financial model. At 15,000 MAU (three months after launch), their auth provider kicked in at $250/month, their database tier jumped to $50/month, their email service started charging at $35/month, and bandwidth overages added $80/month. Their actual infrastructure cost was $615/month — 3x their projection — which materially affected their runway calculation during fundraising.

---

## Summary Decision Matrix

| Finding | Likely Verdict | Action |
|---------|---------------|--------|
| 1 minor version behind | False alarm | Schedule for next maintenance window |
| npm audit high severity in transitive dep | False alarm (usually) | Triage reachability before acting |
| Low GitHub stars | False alarm | Check commit frequency and release cadence instead |
| Major version breaking changes | Normal | Read migration guide, estimate with codemod, plan deliberately |
| License change to BSL/SSPL | Real warning | Immediate legal review, may require migration |
| Old performance benchmark | Real warning | Run your own benchmark with current versions |
| Clean audit against stale lock file | Real warning | Regenerate lock file, re-audit |
| Free tier pricing | Real warning | Model post-cliff costs immediately |
