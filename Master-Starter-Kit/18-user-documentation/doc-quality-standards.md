# Documentation Quality Standards

Quality criteria for user-facing documentation in {{PROJECT_NAME}}. Used by the `/doc-quality-gate` command to evaluate documentation completeness and quality before phase transitions.

---

## Minimum Required Sections by Doc Type

### Feature Guide

Every feature guide MUST have all of these sections:

| Section | Required | Min Content |
|---------|----------|-------------|
| Metadata header | Yes | All fields populated (feature, task_id, generated_date) |
| What This Feature Does | Yes | 2-3 sentences minimum |
| Who This Is For | Yes | At least one user role identified |
| Before You Start | Yes | At least one prerequisite listed |
| How to Use (steps) | Yes | At least 2 numbered steps with expected results |
| Screenshot placeholders | Yes | At least 1 per major screen/action |
| Tips and Best Practices | Yes | At least 2 tips |
| Related Features | Yes | At least 1 link to a related guide |
| FAQ | Yes | At least 3 questions with answers |
| Troubleshooting | Yes | At least 1 problem/solution entry |

<!-- IF {{HAS_MOBILE}} == "true" -->
| On Mobile section | If cross-platform | Platform-specific steps + screenshot placeholders |
| Platform Differences table | If behavior differs | At least 1 row of differences |
<!-- ENDIF -->

### FAQ Entry

| Section | Required | Min Content |
|---------|----------|-------------|
| Category tag | Yes | Matches a feature group |
| Question | Yes | Clear, user-language question |
| Short answer | Yes | 1-2 sentences |
| Detailed answer | Yes | Steps or explanation |

### Onboarding Guide

| Section | Required | Min Content |
|---------|----------|-------------|
| Account creation | Yes | Step-by-step with screenshot placeholder |
| Profile setup | Yes | Key fields to configure |
| First workflow | Yes | Complete walkthrough of the primary action |
| What's Next links | Yes | At least 3 links to feature guides |

### Tutorial

| Section | Required | Min Content |
|---------|----------|-------------|
| Learning outcomes | Yes | At least 2 outcomes |
| Prerequisites | Yes | At least 1 |
| Multiple parts | Yes | At least 2 parts with steps |
| Summary | Yes | Recap of what was learned |

### Troubleshooting

| Section | Required | Min Content |
|---------|----------|-------------|
| Symptom description | Yes | Clear description of what the user sees |
| Possible causes | Yes | At least 1 cause |
| Solution steps | Yes | Numbered steps for each cause |
| Expected result | Yes | What the user should see after fixing |
| Escalation path | Yes | "Still having issues?" section with support link |

### Changelog Entry

| Section | Required | Min Content |
|---------|----------|-------------|
| Version number | Yes | Semantic versioning |
| Date | Yes | YYYY-MM-DD format |
| At least one category | Yes | New Features, Improvements, Bug Fixes, or Breaking Changes |
| Links to guides | Yes | Every new feature links to its guide |

---

## Writing Style Guide

User-facing documentation follows different rules than developer documentation.

### Voice and Tone

| Do | Don't |
|----|-------|
| "Click the **Create** button" | "Invoke the create handler" |
| "Your invoice has been sent" | "The POST request returned 200" |
| "If you see an error..." | "If an exception is thrown..." |
| "Choose the date" | "Select from the DatePicker component" |
| "You" and "your" (direct address) | "The user" or "one should" |
| Active voice: "Click Save" | Passive voice: "The Save button should be clicked" |
| Present tense: "The page shows..." | Future tense: "The page will show..." |

### Terminology

| User-Facing Term | Developer Term (avoid) |
|-----------------|----------------------|
| Sign in / Sign out | Authenticate / Deauthenticate |
| Page | Route / Component |
| Error message | Exception / Error object |
| Settings | Configuration / Config |
| Save | Persist / Commit |
| Delete | Drop / Destroy |
| Customer / User | Tenant / Actor |
| Search | Query / Filter predicate |

### Formatting Rules

- **Bold** for UI element names: Click **Save**, go to **Settings**
- `Code style` ONLY for things the user actually types (URLs, search queries). Never for UI labels
- **Numbered lists** for sequential steps (do this, then this)
- **Bullet lists** for non-sequential items (features, tips, options)
- **Screenshots** follow every significant action (not every click, but every major state change)
- **One action per step** — "Click Create and fill in the form" is two steps

---

## Screenshot Quality Standards

| Criteria | Requirement |
|----------|-------------|
| Resolution | 2x retina minimum (2560x1440 for desktop) |
| Seed data | Realistic data only — no "test123", "Lorem ipsum", "John Doe" |
| Consistency | Same browser, zoom, and theme across all screenshots in a guide |
| PII | No real user data, emails, or credentials visible |
| Annotations | Clean captures only — no arrows or highlights in the base screenshot |
| Currency/dates | Use the project's configured locale, or neutral formats |
| Status bar (mobile) | Include it — confirms the platform to the reader |
| Browser chrome (web) | Exclude it — screenshots should show app content only |

---

## Coverage Thresholds

The `/doc-quality-gate` uses these thresholds:

| Metric | Pass Threshold | Fail Threshold |
|--------|---------------|---------------|
| Feature guide coverage | >= 90% of features have guides | < 90% |
| FAQ coverage | >= 3 FAQ entries per feature | < 3 per feature |
| Troubleshooting coverage | >= 1 entry per feature | 0 entries for any feature |
| Changelog coverage | 100% of completed features have entries | Any missing |
| In-app help coverage | >= 80% of screens have help JSON | < 80% |
| Screenshot placeholders | 100% of guides have at least 1 | Any guide with 0 |

<!-- IF {{HAS_MOBILE}} == "true" -->
| Mobile section coverage | >= 90% of cross-platform features have "On Mobile" | < 90% |
| Mobile guide coverage | 100% of mobile-only features have guides | Any missing |
| Platform difference notes | Present where behavior differs | Missing where needed |
<!-- ENDIF -->

---

## Review Criteria

When reviewing documentation (manually or via quality gate):

1. **Accuracy:** Do the steps match what the app actually does? (Verified by screenshot capture)
2. **Completeness:** Are all required sections present and populated?
3. **Clarity:** Could a non-technical user follow these steps?
4. **Currency:** Is this up-to-date with the latest version of the feature?
5. **Consistency:** Same tone, formatting, and terminology across all docs?
6. **Discoverability:** Is the guide linked from the sidebar, FAQ, and related features?

---

## Stale Documentation Detection

Documentation becomes stale when the feature changes but the docs don't. The `/doc-quality-gate` checks for this by:

1. Comparing the `generated_date` in the doc metadata to the last commit date touching that feature's code
2. If code is newer than docs → flag as "potentially stale"
3. The AI re-reads the feature code and the doc, then either confirms it's still accurate or updates it

This is why the metadata header includes `last_verified: null` — it gets updated to today's date when the doc is confirmed accurate.
