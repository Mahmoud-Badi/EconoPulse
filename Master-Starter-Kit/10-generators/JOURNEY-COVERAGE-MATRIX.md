# Journey Coverage Matrix Generator

> **Output file:** `dev_docs/completeness/journey-coverage-matrix.md`
> **Trigger:** Run at Step 16 (pre-launch verification)
> **Enforcement:** Gate 8 — User Journey Verification

---

## Purpose

This generator produces a matrix proving that every persona's complete user journey — from first awareness to advocacy — is implemented and tested. It answers the question: "For every stage a user goes through, is there a screen serving it and a test verifying it?"

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Personas | `{{PROJECT_CONFIG_FILE}}` → `personas` section | Yes |
| User journey diagram | `{{USER_JOURNEY_DIAGRAM_PATH}}` | Yes |
| Screen catalog | `dev_docs/screen-catalog.md` or `{{SCREEN_CATALOG_PATH}}` | Yes |
| Task files | `{{TASKS_DIR}}/` → all task `.md` files | Yes |
| E2E test specs | `{{E2E_TESTS_DIR}}/` → all E2E test files | Yes |

---

## Journey Stages

Every persona passes through these stages. Some stages may not apply to every persona — document the reason if a stage is marked N/A.

| # | Stage | Definition | Critical? |
|---|-------|------------|-----------|
| 1 | Awareness | User discovers the product exists | No |
| 2 | Consideration | User evaluates whether the product fits their need | No |
| 3 | Sign-Up | User creates an account | **Yes** |
| 4 | Onboarding | User completes initial setup and configuration | **Yes** |
| 5 | First Value ("Aha") | User experiences the core value proposition for the first time | **Yes** |
| 6 | Daily Use | User performs their primary recurring workflows | **Yes** |
| 7 | Advanced Use | User discovers and uses power features | No |
| 8 | Expansion | User adds team members, upgrades plan, integrates other tools | No |
| 9 | Advocacy | User recommends the product (reviews, referrals, case studies) | No |

**Critical stages MUST have E2E test coverage.** No exceptions.

---

## Output Format

Generate the following table for EACH persona:

### `{{PERSONA_NAME}}` — Journey Coverage

| Journey Stage | Screens Serving This Stage | Features Required | Task IDs | E2E Test Scenario | Status |
|---------------|---------------------------|-------------------|----------|-------------------|--------|
| Awareness | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Consideration | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Sign-Up | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Onboarding | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| First Value | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Daily Use | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Advanced Use | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Expansion | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |
| Advocacy | {{SCREENS}} | {{FEATURES}} | {{TASK_IDS}} | {{E2E_SCENARIO}} | {{COVERED_OR_GAP}} |

---

## Generation Rules

### Coverage Requirements

| Requirement | Rule | Enforcement |
|-------------|------|-------------|
| Stages per persona | ALL 9 stages mapped (or N/A with documented reason) | Missing stage without N/A justification = Gap |
| Screens per stage | ≥1 screen serving each stage | Stage without a screen = Gap |
| Tasks per screen | Every screen must have associated tasks | Screen without tasks = Gap |
| E2E tests for critical stages | Sign-Up, Onboarding, First Value, Daily Use MUST have E2E | Critical stage without E2E = launch blocker |

### Status Determination

- **Covered:** Screen(s) exist, tasks implemented, E2E test passes (for critical stages)
- **Gap:** Screen missing, tasks missing, or critical stage lacks E2E
- **N/A:** Stage does not apply to this persona (must document reason)

### Stage-Specific Checks

| Stage | What to Verify |
|-------|---------------|
| Awareness | Landing page exists, value proposition clear, CTA visible |
| Consideration | Pricing page, feature comparison, social proof visible |
| Sign-Up | Registration flow complete, email verification works, SSO works (if applicable) |
| Onboarding | Setup wizard exists, required config steps enforced, progress indicator shown |
| First Value | User can complete core action within first session, "aha" moment designed |
| Daily Use | Primary workflows accessible from dashboard, key metrics visible |
| Advanced Use | Power features discoverable, documentation/tooltips available |
| Expansion | Team invite flow works, plan upgrade flow works, integrations documented |
| Advocacy | Referral mechanism exists (if applicable), feedback/review prompt exists |

---

## Gap Detection

After generating the matrix, produce a gap analysis:

### Journey Gap Analysis

| Gap # | Persona | Stage | Critical? | What's Missing | Impact | Action Required |
|-------|---------|-------|-----------|----------------|--------|----------------|
| 1 | {{PERSONA}} | {{STAGE}} | {{YES_NO}} | {{MISSING_ITEM}} | {{IMPACT}} | {{ACTION}} |

**Impact scale:**
- **Launch Blocker:** Critical stage gap — cannot launch without resolution
- **Post-Launch Required:** Non-critical stage gap — must be in first post-launch sprint
- **Backlog:** Nice-to-have stage gap — add to roadmap

### Gap Resolution Rules

| Gap Type | Resolution |
|----------|------------|
| Critical stage without screen | Design and implement screen before launch |
| Critical stage without E2E | Write and pass E2E test before launch |
| Non-critical stage without screen | Add roadmap entry with target date ≤30 days post-launch |
| Stage with screen but no tasks | Generate tasks immediately — screen without tasks = untracked work |

---

## Verification Checklist

Run this at Step 16 to verify the matrix is complete:

- [ ] Every persona from `{{PROJECT_CONFIG_FILE}}` appears in the matrix
- [ ] Every persona has all 9 stages mapped (or N/A justified)
- [ ] Every stage has ≥1 screen (or N/A)
- [ ] Every screen has associated task IDs
- [ ] Sign-Up stage has E2E test — passes
- [ ] Onboarding stage has E2E test — passes
- [ ] First Value stage has E2E test — passes
- [ ] Daily Use stage has E2E test — passes
- [ ] Gap analysis has zero Launch Blockers
- [ ] All Post-Launch Required items have sprint assignments

---

## Cross-References

- **Gate 8** in `08-quality-testing/enforcement/ENFORCEMENT-GATES.md` — this matrix is the primary proof artifact
- **Workflow Coverage Matrix** in `10-generators/WORKFLOW-COVERAGE-MATRIX.md` — workflows map to Daily Use and Advanced Use stages
- **Screen Catalog** in `10-generators/SCREEN-CATALOG-GENERATOR.md` — screens referenced here originate from the catalog
- **Screen User-Completeness** in `08-quality-testing/enforcement/screen-user-completeness.template.md` — each screen listed here must also pass completeness checks

---

## Example

### "Small Business Owner" — Journey Coverage

| Journey Stage | Screens Serving This Stage | Features Required | Task IDs | E2E Test Scenario | Status |
|---------------|---------------------------|-------------------|----------|-------------------|--------|
| Awareness | Landing page, Blog | SEO, Content | TASK-001, TASK-002 | — | Covered |
| Consideration | Pricing, Comparison, Testimonials | Pricing display, Social proof | TASK-003 | — | Covered |
| Sign-Up | Registration, Email verify | Auth, Email | TASK-010..012 | E2E-001: Full signup flow | Covered |
| Onboarding | Setup wizard (3 steps) | Company profile, First project | TASK-020..025 | E2E-002: Complete onboarding | Covered |
| First Value | Dashboard, First report | Report generation | TASK-030..033 | E2E-003: Generate first report | Covered |
| Daily Use | Dashboard, Projects, Tasks | CRUD, Filters, Search | TASK-040..060 | E2E-004..008 | Covered |
| Advanced Use | Automations, Integrations | Workflow builder | TASK-070..075 | — | Covered |
| Expansion | Team settings, Billing | Invite, Role mgmt, Stripe | TASK-080..085 | — | **Gap** |
| Advocacy | Referral page | Referral link gen | — | — | **Gap** |

Gap analysis: Expansion has screens but no E2E (non-critical — Post-Launch Required). Advocacy has no tasks assigned (Backlog — add to roadmap).
