# Security Audit Cadence

> The right audit frequency depends on your team size, risk profile, and growth stage. This guide scales from solo founder to 100-person engineering team.

---

## Calendar View

### Every Sprint (1-2 weeks)

| Check | Time | Who | Automated? |
|-------|------|-----|------------|
| Dependency vulnerability scan | 5 min | CI pipeline | Yes |
| Secrets scan (git-secrets/trufflehog) | 5 min | CI pipeline | Yes |
| License compliance check | 2 min | CI pipeline | Yes |
| SAST (static analysis) | 10 min | CI pipeline | Yes |
| Review new scan findings at sprint planning | 15-30 min | Dev team | No |

### Every Month

| Check | Time | Who | Automated? |
|-------|------|-----|------------|
| Update security posture dashboard | 30 min | Security champion | No |
| Review and triage open vulnerability backlog | 1 hour | Security champion + lead dev | No |
| Verify Dependabot PRs are being merged (not ignored) | 15 min | Lead dev | No |
| Check certificate expiration dates | 5 min | CI pipeline or uptime monitor | Partially |

### Every Quarter

| Check | Time | Who | Automated? |
|-------|------|-----|------------|
| Deep security audit (code + infrastructure) | 1-3 days | Security specialist or senior dev | No |
| Penetration test (internal or external) | 2-5 days | Pen-tester | No |
| Incident response tabletop drill | 2 hours | Entire on-call team | No |
| Access review (human + service accounts) | 2-4 hours | Team lead + security | No |
| Secret rotation verification | 1-2 hours | DevOps / platform | No |
| Accepted risk re-review | 1 hour | Security champion | No |
| Third-party integration permission audit | 1-2 hours | Lead dev | No |

### Every Year

| Check | Time | Who | Automated? |
|-------|------|-----|------------|
| Full compliance audit (GDPR/SOC2/HIPAA/PCI) | 1-4 weeks | External auditor + internal team | No |
| Third-party security assessment / pen-test | 1-2 weeks | External firm | No |
| Security policy review and update | 1-2 days | Security lead + legal | No |
| Data retention audit | 1-2 days | Data team + legal | No |
| Architecture security review | 1-2 days | Senior engineers + security | No |
| Vendor security review (SOC2 reports from vendors) | 2-4 hours | Security lead | No |
| Insurance review (cyber liability) | 2 hours | Finance + legal | No |

---

## Gate Integration

These orchestrator gates require security sign-off before proceeding:

| Gate | Security Requirement | Blocker If Missing? |
|------|---------------------|-------------------|
| **Step 14 (Security Hardening)** | Initial security posture dashboard created, all critical findings resolved | Yes |
| **Step 16 (Pre-Release QA)** | OWASP Top 10 walkthrough complete, security headers verified, no critical/high findings past SLA | Yes |
| **Step 18.9 (Lifecycle Establishment)** | Recurring audit cadence configured, CI scans active, vulnerability tracker initialized | Yes |
| **Phase gates (ongoing)** | Security posture dashboard grade C or above, no critical findings past SLA | Yes |
| **Quarterly review** | Deep audit completed, accepted risks re-reviewed, access review done | Advisory (not blocking) |

---

## Staffing: Who Runs Each Audit

| Audit Type | Solo Founder | Small Team (2-5) | Medium Team (5-20) | Large Team (20-100) |
|-----------|-------------|------------------|-------------------|-------------------|
| Automated CI scans | You (set up once) | Any dev (set up once) | DevOps / platform team | Platform team |
| Sprint finding triage | You (15 min) | Rotating dev | Security champion | Security team |
| Monthly dashboard update | You (30 min) | Lead dev | Security champion | Security analyst |
| Quarterly deep audit | You + AI assistance | Senior dev | Security specialist (internal) | Internal security team |
| Quarterly pen-test | Skip or use automated tools | Automated tools or freelancer | External firm or internal specialist | Internal red team or external firm |
| Annual compliance | Self-assessment | Self-assessment + legal review | External auditor | External auditor + internal compliance |
| Annual pen-test | Bug bounty program | Freelance pen-tester | External firm | External firm + internal red team |

### The Security Champion Model

For teams of 3-20, designate a **security champion** — a developer who takes responsibility for security posture without being a full-time security engineer. This person:

- Reviews automated scan results weekly.
- Maintains the security posture dashboard.
- Triages new findings and assigns to the right developer.
- Stays current on security news relevant to your stack.
- Attends security training annually.
- Acts as the point of contact for security questions.

**Time commitment:** 2-4 hours per week on top of normal development work. Rotate the role every 6-12 months to spread knowledge.

---

## Budget: Expected Cost Per Audit Type

| Audit Type | Cost | Notes |
|-----------|------|-------|
| npm audit / automated CI scans | $0 | Built-in tooling |
| Snyk free tier | $0 | Limited to 200 tests/month |
| Snyk team plan | $25-100/mo per developer | Reachability analysis, fix PRs, reporting |
| Socket.dev | $0-100/mo | Supply chain detection |
| Dependabot | $0 | Included with GitHub |
| Internal deep audit | $0 (staff time) | 1-3 days of senior developer time |
| Freelance pen-tester | $2,000-10,000 | Per engagement, scope-dependent |
| External pen-test firm | $5,000-50,000 | Annual engagement, scope-dependent |
| SOC2 Type II audit | $15,000-50,000 | Annual, includes readiness + audit |
| HIPAA compliance audit | $10,000-40,000 | Annual, includes gap assessment |
| PCI-DSS assessment | $15,000-100,000+ | Annual, depends on SAQ level vs. full ROC |
| Bug bounty program | $500-50,000+/year | Platform fees + bounty payouts |
| Cyber liability insurance | $1,000-10,000/year | Based on revenue and data sensitivity |

---

## Scaling: How Cadence Changes as You Grow

### Solo Founder / Pre-Revenue

- Run `npm audit` before every deploy (manual or CI).
- Enable Dependabot on GitHub.
- Do a personal security review before each major release.
- Skip formal pen-testing — use automated tools (OWASP ZAP, Burp Suite Community).
- Skip compliance audits unless required by your industry.

### Small Team (2-5 developers)

- All automated scans in CI (block on critical).
- Designate a security champion (rotating quarterly).
- Monthly dashboard update.
- Quarterly internal audit (security champion + one other dev, 1 day).
- Annual automated pen-test or freelance pen-tester.
- Begin compliance preparation if you are selling to enterprise customers.

### Medium Team (5-20 developers)

- All automated scans in CI with Snyk or equivalent.
- Dedicated security champion (4 hours/week).
- Monthly security review meeting (30 min, whole team).
- Quarterly external pen-test.
- Annual SOC2 / compliance audit if selling to enterprise.
- Consider a part-time security consultant (10-20 hours/month).

### Large Team (20-100 developers)

- Dedicated security team (1 security engineer per 10-15 developers).
- Security review required for all architecture changes.
- Continuous monitoring (not just sprint scans).
- Quarterly internal + annual external pen-test.
- Full compliance program with dedicated compliance officer.
- Bug bounty program.
- Incident response team with on-call rotation.
- Security training for all developers (annual, with onboarding module).
