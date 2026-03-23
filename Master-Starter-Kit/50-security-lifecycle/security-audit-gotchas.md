# Security Audit Gotchas

> The most dangerous security advice sounds reasonable until you understand the context it ignores.

---

## 1. npm audit severity != exploitability

**The gotcha:** `npm audit` reports 47 critical vulnerabilities. The team panics, spends two days upgrading everything, breaks three features, and ships a regression. Meanwhile, 45 of the 47 "critical" findings were in devDependencies or affected functions the project never calls.

**Why this happens:** npm audit uses the CVE's CVSS score, which measures theoretical worst-case impact in isolation. It does not check whether your code actually calls the vulnerable function, whether the dependency is used in production or only during builds, or whether user input can reach the vulnerable code path.

**What to do instead:**
- Always run `npm audit --production` to exclude devDependencies.
- Use Snyk's reachability analysis to determine if the vulnerable function is actually in your call graph.
- Triage by asking: "Can an attacker reach this code with untrusted input in production?" If the answer is no, it is medium priority at most.
- Document confirmed false positives so you do not re-triage them every sprint.

**Real example:** The `nth-check` ReDoS vulnerability (CVE-2021-3803) showed as "high severity" in npm audit for years. It affected `css-select`, which was only used by `cheerio` during build-time HTML parsing. No production user input ever touched this code path. Teams spent hundreds of cumulative hours "fixing" this by upgrading chains of transitive dependencies.

---

## 2. Security headers don't help if your auth is broken

**The gotcha:** A team scores A+ on securityheaders.com but has an IDOR vulnerability that lets any authenticated user access any other user's data by changing an ID in the URL. The headers provide zero protection against this.

**Why this happens:** Security headers are visible, easily measured, and have clear pass/fail criteria. They make excellent checklist items. Authorization logic is invisible, application-specific, and requires understanding business rules to test. Teams optimize for what is measurable.

**What to do instead:**
- Implement security headers (they matter for defense in depth), but never before authentication and authorization are solid.
- Priority order: (1) Authentication works correctly, (2) Authorization is enforced on every endpoint, (3) Input validation prevents injection, (4) Security headers add defense in depth.
- Test authorization with: wrong user, no user, expired token, different role, different tenant. If any of these return data they should not, you have a real vulnerability that no header can fix.

**Real example:** A SaaS application had perfect security headers and a CSP that would make Mozilla Observatory proud. It also had an API endpoint `/api/invoices/:id` where the `:id` was a sequential integer and no ownership check was performed. Any authenticated user could enumerate every invoice in the system. The security headers did nothing to prevent this.

---

## 3. Rate limiting without auth is security theater

**The gotcha:** The team implements rate limiting of 100 requests per minute per IP address on all endpoints. An attacker rotates through a botnet of 10,000 IPs, making 99 requests each, and brute-forces the login endpoint with 990,000 attempts per minute.

**Why this happens:** IP-based rate limiting is simple to implement and test. It feels like a security measure. But IP addresses are cheap — residential proxy services sell access to millions of rotating IPs for dollars per gigabyte.

**What to do instead:**
- IP-based rate limiting is a baseline, not a solution. Keep it, but do not rely on it alone.
- For login endpoints: implement account-based rate limiting (lock account after N failed attempts), progressive delays, and CAPTCHA after suspicious activity.
- For API endpoints: rate limit by authenticated user or API key, not just IP.
- For public endpoints (registration, password reset): combine IP limiting with CAPTCHA, email verification delays, and behavioral analysis.
- Consider Cloudflare Bot Management, AWS WAF, or similar services that use behavioral signals beyond IP address.

---

## 4. OWASP Top 10 is a starting point, not a complete security program

**The gotcha:** A team completes an "OWASP Top 10 audit," marks security as done, and moves on. Six months later, they are compromised through a supply chain attack (a dependency's maintainer account was hijacked) — a vector not covered by the Top 10.

**Why this happens:** The OWASP Top 10 is a consensus list of the most common web application vulnerabilities. It is excellent for prioritization but intentionally limited in scope. It does not cover supply chain attacks, insider threats, social engineering, physical security, CI/CD pipeline compromise, or many infrastructure-level vulnerabilities.

**What to do instead:**
- Use OWASP Top 10 as your minimum bar, not your ceiling.
- Supplement with OWASP ASVS (Application Security Verification Standard) for comprehensive coverage.
- Add supply chain security (Socket.dev, Sigstore, dependency pinning).
- Add infrastructure security (cloud IAM review, network segmentation).
- Add people security (phishing awareness, access reviews, offboarding checklists).

---

## 5. Your biggest risk is probably leaked credentials in git history

**The gotcha:** The team spends a week hardening against OWASP #7 (Identification and Authentication Failures) while their `.env.production` file was committed in the third commit of the repository, removed in the fourth, and remains fully accessible in git history to anyone with repo access.

**Why this happens:** Developers know not to commit secrets. But in the early days of a project — before CI is set up, before pre-commit hooks are configured, before the team has a secrets manager — someone commits a `.env` file "just to get it working." They remove it in the next commit and forget about it. Git never forgets.

**What to do instead:**
- Run `trufflehog git file://. --only-verified` on your repository right now. Do it before reading the next gotcha.
- If secrets are found: rotate them immediately (change the password/key/token), then optionally clean git history with `git filter-repo` or BFG Repo-Cleaner.
- Prevention: install `git-secrets` or `pre-commit` hooks that block secrets before they enter history. Add `.env*` to `.gitignore` before the first commit.
- Use a secrets manager (Vercel environment variables, AWS Secrets Manager, Doppler, 1Password CLI) from day one.

**Real example:** Uber's 2016 breach started with credentials found in a private GitHub repository. The credentials were for an AWS S3 bucket containing data on 57 million users. The repository was "private," but an attacker who compromised a developer's GitHub account found the credentials in git history.

---

## 6. Compliance != security — SOC2 certified companies get breached

**The gotcha:** A startup achieves SOC2 Type II certification. The founders tell customers "we are SOC2 compliant" and treat security as solved. The SOC2 audit checked that policies exist and are followed, but did not test whether the application is actually resistant to attack. A SQL injection in a reporting endpoint goes undetected because it was not in scope.

**Why this happens:** Compliance frameworks verify that security processes exist and are followed. They do not verify that those processes are effective at preventing attacks. SOC2 checks "do you have access control policies?" not "can I bypass your access controls?" These are fundamentally different questions.

**What to do instead:**
- Pursue compliance when your customers or regulators require it — it is a business necessity, not optional.
- Never treat compliance as a substitute for security testing. Compliance and security are overlapping but distinct concerns.
- After achieving compliance, continue running pen-tests, dependency scans, and security audits that test real defenses.
- Use compliance as a forcing function to establish good processes, then go beyond what compliance requires.

---

## 7. The most dangerous code is the code nobody reads

**The gotcha:** A team runs security audits on their newest features — the code they just wrote and understand well. Meanwhile, a utility file written by a departed developer two years ago has an `eval()` call that processes user-supplied template strings. Nobody audits it because nobody touches it.

**Why this happens:** Recency bias. Teams naturally focus security attention on code they are actively changing. Old code feels "proven" because it has been running without issues. But "without issues" may mean "without detection" — an exploitable vulnerability in rarely-touched code can exist for years before anyone notices.

**What to do instead:**
- During quarterly audits, specifically target the oldest and least-modified files. Sort by last-modified date and audit the bottom quartile.
- Run SAST tools across the entire codebase, not just changed files. Configure `semgrep` or `eslint-plugin-security` to scan everything.
- When a developer leaves, schedule a security review of their most critical code within 30 days.
- Use `git log --all --diff-filter=A --name-only` to find files that have not been modified since creation. These are prime audit targets.
- Set up code ownership (CODEOWNERS file) so every file has a responsible maintainer. Unowned files are security liabilities.

**Real example:** The Equifax breach of 2017 was caused by CVE-2017-5638, a vulnerability in Apache Struts. The vulnerable Struts version had been running in production for months. The patch was available for two months before the breach. Nobody was monitoring that component because it was "stable infrastructure" that nobody was actively developing.

---

## Prioritization Framework

When you have limited time (and you always have limited time), prioritize security work in this order:

1. **Rotate any leaked credentials** — minutes of work, prevents catastrophic breach.
2. **Fix authentication and authorization bugs** — the most impactful real-world vulnerability class.
3. **Patch actively-exploited CVEs in production dependencies** — time-sensitive, high impact.
4. **Fix injection vulnerabilities (SQL, XSS, command)** — high impact, well-understood attack vectors.
5. **Implement automated scanning in CI** — prevents future regressions, compounds over time.
6. **Add security headers** — quick wins for defense in depth.
7. **Address medium/low findings** — batch and tackle quarterly.
8. **Pursue compliance certifications** — when business requires it.

Do not invert this list. A team with perfect security headers but broken authentication is less secure than a team with no headers but solid auth.
