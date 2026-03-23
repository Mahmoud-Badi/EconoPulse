# Release Cadence Strategy

> **How to ship software predictably, safely, and without surprises.** This guide covers semantic versioning, release cadence models, changelog standards, and the decision frameworks for choosing what works for your product.

---

## Semantic Versioning (SemVer)

Every release gets a version number in the format `MAJOR.MINOR.PATCH`. This is not optional. It is how users, integrators, and your future self understand what changed and whether an upgrade is safe.

### The Rules

```
MAJOR.MINOR.PATCH

MAJOR — Incremented when you make breaking changes
MINOR — Incremented when you add functionality in a backward-compatible way
PATCH — Incremented when you make backward-compatible bug fixes
```

### What Counts as What

| Change Type | Version Bump | Examples |
|-------------|-------------|---------|
| **Breaking** (MAJOR) | 1.x.x → 2.0.0 | Remove an API endpoint, rename a field, change response format, drop support for a platform, change authentication mechanism |
| **Feature** (MINOR) | 1.1.x → 1.2.0 | Add a new API endpoint, add optional fields, new UI feature, new integration, new configuration option |
| **Fix** (PATCH) | 1.1.1 → 1.1.2 | Bug fix, typo correction, performance improvement with no API change, security patch, dependency update |

### Real-World Examples

```
v1.0.0  — Initial public release
v1.0.1  — Fix: login button not responding on Safari
v1.0.2  — Fix: email notifications sent twice
v1.1.0  — Feature: CSV export for reports
v1.1.1  — Fix: CSV export includes header row twice
v1.2.0  — Feature: Slack integration
v1.2.1  — Fix: Slack webhook retry on failure
v2.0.0  — BREAKING: API authentication changed from API keys to OAuth 2.0
v2.0.1  — Fix: OAuth token refresh race condition
v2.1.0  — Feature: Team management (invite, roles, permissions)
```

### Pre-Release Versions

```
v2.0.0-alpha.1  — Early preview. Unstable. May change significantly.
v2.0.0-beta.1   — Feature complete. Unstable. Bug fixes only.
v2.0.0-rc.1     — Release candidate. Stable unless blocking bugs found.
v2.0.0          — General availability.
```

### SemVer Mistakes to Avoid

- **Shipping breaking changes in a MINOR or PATCH release.** This is the cardinal sin of SemVer. Users depend on MINOR and PATCH being safe upgrades.
- **Bumping MAJOR for non-breaking changes.** Major version bumps cause upgrade anxiety. Do not cry wolf.
- **Skipping versions.** Going from v1.2.0 to v1.5.0 because "we did a lot of work" confuses everyone. Increment by one.
- **Using version numbers for marketing.** "v3.0" because the redesign "feels" like a new version, but nothing is actually breaking. Use a brand name for marketing milestones.

---

## Release Cadence Models

### Model 1: Release Train (Time-Based)

Releases ship on a fixed schedule regardless of what is ready. Features that are not complete ride the next train.

```
Week 1: Development
Week 2: Development + Feature freeze (Friday)
Week 3: QA + Bug fixes only
Week 4: Release (Wednesday)
```

**Best for:**
- Teams of 3+ developers
- Products with external consumers who need predictability
- SaaS products with paying customers
- Products with a QA process

**Advantages:**
- Predictable schedule for users and stakeholders
- Forces scope discipline (if it is not ready, it waits)
- QA has a defined window
- Release notes can be prepared in advance

**Disadvantages:**
- Features may wait up to one cycle even if "ready"
- Pressure to rush features to make the train
- Overhead of maintaining a release branch

### Model 2: Continuous Delivery (Feature-Based)

Every merged feature is a potential release. Ship when ready, not on a schedule.

```
Feature branch → PR → Code review → Merge to main → Automated tests → Deploy
```

**Best for:**
- Solo developers or small teams (1-2)
- Internal tools
- Products in rapid iteration phase (first 6 months)
- Products with strong automated test coverage

**Advantages:**
- Fastest time from code to user
- No "release week" overhead
- Small, incremental changes (easier to debug if something breaks)
- Reduced merge conflicts

**Disadvantages:**
- Requires excellent automated testing (you are relying on CI, not humans)
- Harder to write coherent release notes
- Users may experience frequent small changes (change fatigue)
- No built-in QA window

### Model 3: Hybrid (Recommended for Most Products)

Continuous delivery for patches and fixes. Scheduled releases for features. Immediate releases for emergencies.

```
Patches:  Ship immediately after merge + passing CI
Features: Batch into biweekly or monthly releases
Hotfixes: Ship immediately, any time, any day
```

**Best for:**
- Most products after the initial launch sprint
- Teams that want CD speed without sacrificing predictability

### Decision Tree: Choosing Your Model

```
START
  │
  ├─ Team size > 5? ─── YES ──→ Release Train (biweekly or monthly)
  │
  ├─ External API consumers? ─── YES ──→ Release Train (monthly, with beta channel)
  │
  ├─ Automated test coverage > 80%? ─── YES ──→ Continuous Delivery is safe
  │                                     NO ──→ Release Train until coverage improves
  │
  ├─ Product age < 6 months? ─── YES ──→ Continuous Delivery (you need iteration speed)
  │
  └─ None of the above clear? ──→ Hybrid model
```

---

## Changelog Format

Use the [Keep a Changelog](https://keepachangelog.com/) standard. It is widely adopted, human-readable, and machine-parseable.

### Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- New feature descriptions here

## [1.2.0] - 2026-02-15

### Added
- CSV export for all report types (#142)
- Keyboard shortcut Ctrl+K for global search (#156)

### Changed
- Dashboard now loads 40% faster due to query optimization (#149)
- Updated onboarding flow to include template selection step (#151)

### Fixed
- Login button unresponsive on Safari 17 (#143)
- Email notifications sent twice when multiple triggers fire simultaneously (#147)
- Date picker showing wrong timezone for UTC+ users (#150)

### Security
- Updated lodash to 4.17.21 to patch prototype pollution vulnerability (#148)

## [1.1.0] - 2026-01-20

### Added
- Slack integration for real-time notifications (#130)
- User profile page with avatar upload (#134)

### Deprecated
- API key authentication (use OAuth 2.0 instead, removal in v2.0.0) (#138)

### Fixed
- Memory leak in WebSocket connection handler (#131)

## [1.0.0] - 2026-01-01

### Added
- Initial release with core features: projects, tasks, team management
- REST API v1
- Email and Google OAuth authentication
```

### Changelog Categories

| Category | When to Use |
|----------|------------|
| **Added** | New features |
| **Changed** | Changes to existing functionality |
| **Deprecated** | Features that will be removed in a future version |
| **Removed** | Features removed in this version |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability patches |

### Changelog Rules

1. **Write for users, not developers.** "Fixed login button on Safari" not "Patched event handler delegation in auth-form.tsx."
2. **Include issue/PR numbers.** Makes it easy to find context.
3. **Put the most important changes first** within each category.
4. **Write the changelog as you develop, not at release time.** Add entries as PRs merge. Batch-writing changelogs from git log produces garbage.
5. **Never delete changelog entries.** The changelog is an append-only historical record.

---

## Migration Guide Template for Breaking Changes

Every MAJOR version bump requires a migration guide. No exceptions.

```markdown
# Migration Guide: v[X] to v[X+1]

## Overview
[1-2 sentences on what changed and why]

## Breaking Changes

### 1. [Change Name]
**What changed:** [Specific description]
**Why:** [Reason for the change]
**Before (v[X]):**
```[language]
// Old code
```
**After (v[X+1]):**
```[language]
// New code
```
**Migration steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### 2. [Next Change]
[Same format]

## Deprecated (Will Break in v[X+2])
- [Feature A]: Use [Alternative] instead. Removal planned for v[X+2].

## New Features in v[X+1]
[Brief list of new features, to incentivize upgrading]

## Support Timeline
- **v[X]**: Receives security patches until [DATE]. No new features.
- **v[X+1]**: Active development. Recommended version.

## Getting Help
[Link to docs, support channel, or migration assistance]
```

---

## Release Communication Protocol

### Who to Notify and How

| Audience | Channel | When | Content |
|----------|---------|------|---------|
| Internal team | Slack / Teams | Before deploy | "Deploying v1.2.0 in 30 minutes. Changelog: [link]" |
| All users (minor releases) | In-app notification + changelog page | On deploy | "New: [headline feature]. See what changed." |
| All users (major releases) | Email + in-app + blog post | 1 week before + on deploy | Full announcement with migration guide |
| API consumers | Email + API deprecation headers + docs update | 90 days before breaking change | Migration guide with code examples |
| Affected users only (fixes) | In-app or email | On deploy | "We fixed [issue]. Sorry for the inconvenience." |

### Release Announcement Template

```markdown
# What is New in [Your Product] v[X.Y.Z]

**Released:** [DATE]

## Headline
[One sentence summarizing the most exciting change]

## New Features
- **[Feature Name]** — [One sentence description]. [Link to docs]
- **[Feature Name]** — [One sentence description]. [Link to docs]

## Improvements
- [Improvement 1]
- [Improvement 2]

## Bug Fixes
- [Fix 1]
- [Fix 2]

## Breaking Changes (Major Releases Only)
- [Change]: [Migration guide link]

## What is Coming Next
[One sentence teaser for the next release to maintain excitement]

---
Full changelog: [link]
Questions? [support channel]
```

---

## Hotfix vs Scheduled Release Decision Tree

```
Is the issue...

├─ Security vulnerability (any severity)?
│  └─ YES → HOTFIX. Ship immediately. Do not wait for the next release.
│
├─ Data loss or data corruption?
│  └─ YES → HOTFIX. Ship immediately.
│
├─ Complete feature breakage for >10% of users?
│  └─ YES → HOTFIX. Ship within 24 hours.
│
├─ Partial feature breakage or degraded experience?
│  └─ How long until next scheduled release?
│     ├─ < 3 days → Wait for scheduled release
│     └─ > 3 days → HOTFIX
│
├─ Cosmetic issue or minor inconvenience?
│  └─ Always wait for scheduled release. Never hotfix cosmetic issues.
│
└─ Performance degradation?
   ├─ > 50% slower than baseline → HOTFIX
   └─ < 50% slower → Scheduled release
```

### Hotfix Process

```
1. Branch from the current production tag (not from develop/main HEAD)
   git checkout -b hotfix/v1.2.1 v1.2.0

2. Apply the minimal fix (do not sneak in other changes)

3. Test thoroughly (automated + manual verification of the specific issue)

4. Deploy to staging → verify → deploy to production

5. Merge hotfix branch back to main/develop

6. Tag the release: git tag v1.2.1

7. Update changelog

8. Notify affected users
```

---

## Feature Freeze and Code Freeze Definitions

### Feature Freeze

**When:** Typically 1-2 weeks before a scheduled release.

**What it means:**
- No new features may be merged
- Only bug fixes, performance improvements, and documentation changes
- Scope is locked — if a feature is not already in a mergeable state, it waits for the next release

**What it does NOT mean:**
- Development stops (you can still work on next-release features in branches)
- All PRs are blocked (bug fixes and docs are still welcome)

### Code Freeze

**When:** Typically 2-3 days before release (or not used if you have strong CI).

**What it means:**
- No code changes of any kind
- Only configuration changes and deployment activities
- QA is performing final verification

**What it does NOT mean:**
- You cannot fix a showstopper bug (code freeze can be broken for critical issues, with approval)

### When to Use Freezes

| Situation | Feature Freeze | Code Freeze |
|-----------|---------------|-------------|
| Continuous delivery, strong CI | Not needed | Not needed |
| Release train, small team | 3 days before release | Not needed |
| Release train, large team | 1 week before release | 2 days before release |
| Major version release | 2 weeks before release | 3-5 days before release |
| Regulatory or compliance release | 2 weeks before release | 1 week before release |

---

## Release Checklist

Use this for every scheduled release:

```markdown
## Release v[X.Y.Z] Checklist

### Pre-Release
- [ ] All "must-ship" PRs are merged
- [ ] Feature freeze is in effect (if applicable)
- [ ] All automated tests pass on the release branch
- [ ] Changelog is complete and reviewed
- [ ] Migration guide is written (major releases only)
- [ ] Release notes / announcement draft is ready
- [ ] Staging deployment is verified

### Release
- [ ] Deploy to production
- [ ] Smoke test core user flows in production
- [ ] Tag the release in git
- [ ] Publish changelog
- [ ] Send release announcement

### Post-Release
- [ ] Monitor error rates for 1 hour post-deploy
- [ ] Monitor performance metrics for 24 hours
- [ ] Merge release branch back to develop (if applicable)
- [ ] Close completed issues/tickets
- [ ] Update roadmap (move shipped items to "Recently Completed")
- [ ] Retrospective: anything to improve for next release?
```

---

## Cadence Recommendations by Product Stage

| Product Stage | Recommended Cadence | Rationale |
|--------------|-------------------|-----------|
| Pre-launch (beta) | Continuous delivery | Maximize iteration speed. Users expect instability. |
| Post-launch (Month 1-3) | Weekly releases | Rapid response to early user feedback and bugs. |
| Growth (Month 3-12) | Biweekly releases | Balance between speed and stability. |
| Mature (Year 1+) | Monthly releases | Predictability matters more than speed for established products. |
| Enterprise / API | Monthly with beta channel | Enterprises need advance notice and testing time. |
