# Enforcement Gates — Master Verification System

> **Purpose:** These gates verify that work WAS done correctly. They do not instruct — they enforce.
> Every gate blocks forward progress until its proof artifacts exist and pass criteria are met.
> No exceptions. No "we'll fix it later." No manual overrides without documented justification.

---

## Gate Summary Matrix

| # | Gate Name | Trigger Step(s) | Proof Artifacts Required | Blocks |
|---|-----------|-----------------|--------------------------|--------|
| 1 | AI Context Verification | Session boundaries + Step 8.6 | Context audit log | Next AI session / Phase sign-off |
| 2 | Design Consistency | Step 13 + Feature gates | Design audit checklist per screen | Feature completion |
| 3 | Responsive Verification | Feature gates | Responsive proof per screen (4 breakpoints) | Feature completion |
| 4 | Implementation Integrity (No Shells) | Feature gates | Shell detector checklist per feature | Feature completion |
| 5 | Dead UI Prevention | Step 8.6 + Feature gates | Dead UI checklist per screen | Phase sign-off / Feature completion |
| 6 | Workflow Completeness | Step 8.5 + Step 8.6 | `workflow-coverage-matrix.md` | Phase sign-off |
| 7 | Screen User-Completeness | Step 6.5 | Screen completeness checklist per screen | Screen approval |
| 8 | User Journey Verification | Step 16 | `journey-coverage-matrix.md` | Launch readiness |
| 9 | DR Verification | Step 18.6 | 7 DR playbooks + restore proof | Production launch |
| 10 | Infrastructure Cost & Sizing | Step 17 | `infrastructure-sizing.md` | Production launch |
| 11 | Persona-Screen Completeness | Step 6.5 | Persona workflow trace per persona | Screen approval |
| 12 | Cross-Document Consistency | Step 9.6 | 6-point consistency checklist | Phase sign-off |
| 13 | Phantom Table Check | Step 8.6 | Entity reference inventory | Phase sign-off |
| 14 | Dead UI Sweep | Step 7 (existing apps) | Dead UI sweep report | Phase sign-off |
| 15 | Regulatory Completeness | Step 14 (conditional) | Regulatory requirement matrix | Launch readiness |
| 16 | Client Log Consistency | Session boundaries | Client log vs DEVLOG cross-check | Session completion |

---

## How to Use These Gates

1. **Gates block progress.** When a step's gate is not satisfied, you do NOT move to the next step. The ORCHESTRATOR enforces this — if proof artifacts are missing or criteria fail, the step is incomplete.

2. **Proof artifacts are files, not claims.** "I tested it" is not proof. A screenshot, a test recording, a checklist with evidence — those are proof. Every gate specifies exactly what constitutes proof.

3. **Fail actions are mandatory.** When a gate fails, the fail action is not a suggestion. It is what happens. No negotiation.

4. **Multiple gates can trigger simultaneously.** A feature gate triggers Gates 2, 3, 4, and 5 together. ALL must pass.

5. **Templates live in `08-quality-testing/enforcement/`.** Copy the relevant `.template.md` file, fill it out per screen/feature, and store in `dev_docs/enforcement-proofs/`.

---

## Gate 1: AI Context Verification

**Trigger:** Every session boundary (new conversation, context window refresh) + Step 8.6 cumulative audit.

**Purpose:** Prevent AI hallucination, stale references, and invented entities from contaminating deliverables.

**Required Proof Artifacts:**
- [ ] Context audit log entry in `dev_docs/ai-context-audits/session-YYYY-MM-DD-NNN.md`
- [ ] Entity name cross-reference against `{{PROJECT_CONFIG_FILE}}`
- [ ] File path verification (every referenced file exists on disk)
- [ ] Numeric claim spot-check (at least 3 numbers verified against source)

**Pass Criteria:**
- ALL entity names (app name, service names, persona names) match `{{PROJECT_CONFIG_FILE}}` exactly
- ALL file paths reference files that exist in the repository
- ALL numeric claims (user counts, performance targets, costs) are traceable to a source document
- ZERO invented services, screens, endpoints, or personas that don't exist in specs

**Fail Action:**
- Flag every discrepancy in the audit log
- Correct all hallucinated references before any new work proceeds
- If >5 discrepancies found in a single session, discard session output and regenerate from verified sources

---

## Gate 2: Design Consistency

**Trigger:** Step 13 (design system finalization) + every feature gate.

**Purpose:** Ensure every screen follows the anti-slop rulebook and uses design tokens — not hardcoded values.

**Required Proof Artifacts:**
- [ ] Completed `design-audit-checklist.template.md` for EVERY screen in the feature
- [ ] Anti-slop rules compliance report (23+ rules checked)
- [ ] Design token usage audit (grep for hardcoded hex colors, hardcoded px spacing)
- [ ] Visual regression screenshots at 375px, 768px, 1024px, 1440px per screen

**Pass Criteria:**
- ZERO anti-slop rule violations (or documented exception with rationale)
- ZERO hardcoded hex color values — all colors reference `{{DESIGN_TOKEN_PREFIX}}` tokens
- ZERO hardcoded spacing values — all spacing uses token scale
- ALL components sourced from `{{COMPONENT_LIBRARY_NAME}}` — no one-off custom components without documented exception
- Visual regression screenshots show no unintended differences from approved designs

**Fail Action:**
- List every violation with file path + line number
- Feature cannot be marked complete until ALL violations are resolved
- If >10 violations found, escalate to design review before fixing (pattern problem, not one-off)

---

## Gate 3: Responsive Verification

**Trigger:** Every feature gate.

**Purpose:** Prove that every screen works at every breakpoint — not just "looks okay on my laptop."

**Required Proof Artifacts:**
- [ ] Completed `responsive-proof.template.md` for EVERY screen in the feature
- [ ] Screenshots at 375px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop)
- [ ] Responsive design spec exists at `dev_docs/foundations/responsive-design-spec.md` (from Step 6.7)
- [ ] Completed `responsive-design-spec-checklist.template.md` showing intentional per-component responsive behavior
- [ ] Checklist verification per breakpoint

**Pass Criteria:**
- NO horizontal scroll at any breakpoint
- Touch targets ≥44px at 375px and 768px breakpoints
- Text readable without zooming at all breakpoints
- Navigation accessible (hamburger menu works on mobile, full nav on desktop)
- Forms usable with mobile keyboard (inputs not obscured, submit button visible)
- Images and media do not overflow or get cropped unexpectedly
- Modals and dialogs fit within the viewport at all breakpoints

**Fail Action:**
- Screen is NOT marked responsive
- Feature gate blocks until responsive proof passes for ALL screens
- Document which breakpoint(s) failed and the specific issue

---

## Gate 4: Implementation Integrity (No Shells)

**Trigger:** Every feature gate.

**Purpose:** Detect and reject shell implementations — UI that looks complete but does nothing real.

**Required Proof Artifacts:**
- [ ] Completed `shell-detector-checklist.template.md` for EVERY feature
- [ ] E2E test recording showing full workflow (not just page load)
- [ ] Code grep results for `TODO`, `FIXME`, `console.log`, `placeholder`, hardcoded mock arrays

**Pass Criteria:**
- EVERY button has a real handler that performs a real action (not `console.log('clicked')`)
- EVERY form submits to a real endpoint and handles success + error responses
- EVERY table/list loads data from an API (not hardcoded `const data = [...]`)
- EVERY navigation item leads to a real, implemented page
- ZERO `TODO` or `FIXME` comments in shipped code for the feature
- ZERO `console.log` statements used as placeholder logic
- E2E test demonstrates complete user workflow from start to finish

**Fail Action:**
- Feature is classified as a SHELL — not complete, not shippable
- List every shell indicator with file path + line number
- Feature returns to development — not to "polish" but to IMPLEMENT
- Shell features do not count toward sprint velocity

---

## Gate 5: Dead UI Prevention

**Trigger:** Step 8.6 (phase sign-off) + every feature gate.

**Purpose:** Ensure every pixel of shipped UI is functional. Dead UI is worse than missing UI.

**Required Proof Artifacts:**
- [ ] Completed `dead-ui-checklist.template.md` for EVERY screen
- [ ] Interactive element inventory (every button/link/toggle/dropdown cataloged)
- [ ] E2E coverage map showing every interactive element is exercised by at least one test

**Pass Criteria:**
- EVERY interactive element (button, link, toggle, dropdown, tab, accordion) has a working handler
- ZERO 404 pages reachable from any navigation path
- ZERO "Coming Soon" or "Under Construction" UI without a corresponding roadmap entry with target date
- ZERO non-functional toggles, switches, or filters
- ZERO Lorem ipsum, "John Doe", or placeholder content in shipped screens
- Every shipped screen has E2E test coverage for ALL interactive elements

**Fail Action:**
- Dead UI items must be either implemented or removed — not left as shells
- "Coming Soon" items without roadmap entry must be removed from navigation
- Screen cannot ship with any dead interactive elements

---

## Gate 6: Workflow Completeness

**Trigger:** Step 8.5 (task generation complete) + Step 8.6 (phase sign-off).

**Purpose:** Verify that every persona's every workflow is fully covered by tasks and tests.

**Required Proof Artifacts:**
- [ ] `dev_docs/completeness/workflow-coverage-matrix.md` exists and is current
- [ ] Matrix covers ALL personas from `{{PROJECT_CONFIG_FILE}}`
- [ ] Every workflow has: steps → tasks → E2E tests mapped

**Pass Criteria:**
- EVERY persona has ≥3 documented workflows
- EVERY workflow has ≥4 steps
- EVERY workflow step maps to a specific task ID
- EVERY workflow has at least one E2E test covering the happy path
- EVERY workflow has error path coverage documented
- ZERO gaps in the matrix (no empty cells in Task ID or E2E Test ID columns)

**Fail Action:**
- Generate missing tasks for any workflow step without a task assignment
- Generate missing E2E test specs for any workflow without test coverage
- Do NOT proceed to next phase until matrix has zero gaps

---

## Gate 7: Screen User-Completeness

**Trigger:** Step 6.5 (screen design approval).

**Purpose:** Answer one question: "Does the user truly have everything they need on this screen?"

**Required Proof Artifacts:**
- [ ] Completed `screen-user-completeness.template.md` for EVERY screen
- [ ] Evidence for each checklist item (screenshot, code reference, or test result)

**Pass Criteria:**
- User can accomplish their primary goal without leaving the screen
- All data needed for decision-making is visible (no hidden-by-default critical info)
- Errors are actionable — user knows what went wrong AND what to do about it
- Empty states guide the user toward their first action (not just "No data found")
- Undo/correction path exists for destructive or important actions
- Keyboard navigation works with logical tab order
- Screen reader landmarks and ARIA labels are present
- Color contrast meets WCAG AA minimum

**Fail Action:**
- Screen returns to design — it is not ready for implementation
- List every completeness gap with severity (Critical / Major / Minor)
- Critical gaps block implementation entirely
- Major gaps must be addressed before feature gate

---

## Gate 8: User Journey Verification

**Trigger:** Step 16 (pre-launch verification).

**Purpose:** Verify that every persona's complete journey — from first awareness to advocacy — is implemented and tested.

**Required Proof Artifacts:**
- [ ] `dev_docs/completeness/journey-coverage-matrix.md` exists and is current
- [ ] Matrix covers ALL personas across ALL journey stages
- [ ] Critical stages have E2E test coverage

**Pass Criteria:**
- EVERY persona has EVERY journey stage mapped (Awareness → Advocacy)
- EVERY stage has ≥1 screen serving it
- EVERY screen has associated tasks
- Critical stages (Sign-Up, Onboarding, First Value, Daily Use) have E2E test scenarios
- ZERO stages with Status = "Gap"

**Fail Action:**
- Journey gaps at critical stages block launch
- Journey gaps at non-critical stages must have roadmap entries with target dates
- Generate missing screen specs, tasks, or E2E tests to fill critical gaps

---

## Gate 9: DR Verification

**Trigger:** Step 18.6 (production readiness).

**Purpose:** Prove that disaster recovery is real — not a document that's never been tested.

**Required Proof Artifacts:**
- [ ] Completed `dr-verification.template.md`
- [ ] 7 DR playbooks exist (database corruption, hosting outage, ransomware, region loss, key person unavailability, vendor discontinuation, data breach)
- [ ] Backup restore test log with timestamp and data integrity confirmation
- [ ] RPO/RTO documentation with achievability proof

**Pass Criteria:**
- ALL 7 DR scenarios have step-by-step playbooks (not strategy documents — actual commands)
- Backup restore tested within last 30 days — restore log shows timestamp + data integrity check
- RPO (Recovery Point Objective) and RTO (Recovery Time Objective) documented and achievable with current infrastructure
- On-call rotation defined with escalation timeline (5 min acknowledge / 15 min assess / 30 min act)
- Incident communication plan exists with template messages and stakeholder notification list
- At least one runbook tested by someone who did NOT write it

**Fail Action:**
- Missing playbooks must be written before production launch
- Untested backup restore procedure = assume backup doesn't work
- If RTO cannot be met with current infrastructure, either adjust RTO or upgrade infrastructure
- Production launch blocked until ALL DR criteria pass

---

## Gate 10: Infrastructure Cost & Sizing

**Trigger:** Step 17 (infrastructure planning).

**Purpose:** Ensure infrastructure is right-sized and costs are understood — not guessed.

**Required Proof Artifacts:**
- [ ] `dev_docs/infrastructure/infrastructure-sizing.md` exists and is current
- [ ] Cost projections at 4 tiers (Starter, Growth, Scale, Enterprise)
- [ ] Break-even analysis completed

**Pass Criteria:**
- Infrastructure sizing documented for ALL components (server, database, cache, queue, storage, CDN, monitoring, email, auth, AI API)
- Cost projections exist at 4 tenant tiers (1-10, 11-50, 51-100, 101-500)
- If project has compliance requirements (`CONFIG.COMPLIANCE_REQUIREMENTS` != "none"), compliance cost overhead is broken out separately per tier (BAA premiums, audit costs, pen testing, encrypted storage)
- Server recommendations include specific providers + instance types with rationale
- Database sizing includes connection pools, storage estimates, read replica needs, backup frequency
- Cost per tenant calculated at each tier
- Break-even point identified (fixed costs + variable costs vs. revenue per user)
- Scaling triggers defined (metric → threshold → action)
- Cost monitoring alerts and dashboards specified

**Fail Action:**
- Infrastructure decisions without sizing data are guesses — do not proceed
- Missing cost projections = cannot validate pricing model
- No break-even analysis = no business case for the infrastructure choices
- Step 17 blocked until infrastructure sizing is complete and reviewed

---

## Enforcement Execution Checklist

When the ORCHESTRATOR reaches a gate trigger step, execute the following:

1. **Identify applicable gates** — check the summary matrix for which gates trigger at this step
2. **Locate proof artifacts** — verify each required artifact exists at its expected path
3. **Evaluate pass criteria** — check each criterion. Partial passes do not count.
4. **Document results** — write gate result to `dev_docs/enforcement-proofs/gate-N-result-YYYY-MM-DD.md`
5. **Execute fail action if needed** — if ANY criterion fails, execute the fail action. Do not skip.
6. **Record in phase log** — add gate pass/fail to the phase completion log

**There are no soft gates.** Every gate is mandatory. Every proof artifact is required. Every fail action is executed. This is how you ship quality.

---

## Gate 11: Persona-Screen Completeness

**Trigger:** Step 6.5 (after screen completeness audit).

**Purpose:** Verify that every persona can complete their entire daily workflow without hitting a missing screen, dead end, or information gap.

**Required Proof Artifacts:**
- [ ] Completed `persona-screen-completeness.template.md` for EVERY persona
- [ ] Daily workflow trace (login → tasks → logout) mapped to screens
- [ ] First-time experience documented per persona
- [ ] Dead end analysis (information, action, and navigation dead ends)

**Pass Criteria:**
- EVERY persona has a completed workflow trace covering their daily work
- EVERY workflow step maps to an existing screen that passes Gate 7
- ZERO dead ends in any persona's primary workflow
- First-time experience (account creation → first meaningful action) is documented for every persona
- Edge case workflows (password reset, permission denied, empty state) are mapped

**Fail Action:**
- Create missing screen specs for any workflow gap
- Resolve dead ends by adding actions, information, or navigation
- Do NOT proceed past Step 6.5 until all personas have complete workflow coverage

---

## Gate 12: Cross-Document Consistency

**Trigger:** Step 9.6 (after session protocol is established).

**Purpose:** Catch contradictions between documents — different entity names, mismatched counts, inconsistent service references — before they infect task files and development.

**Required Proof Artifacts:**
- [ ] Completed `cross-document-consistency.template.md` with all 6 checks
- [ ] `dev_docs/completeness/cross-document-consistency-audit.md` with results

**Pass Criteria (all 6 checks must pass):**
1. Entity names match CONFIG across all specs, screens, tasks, and schema docs
2. Service names are identical across service specs, hub files, STATUS.md, and task files
3. Persona names match between intake, tribunal, screen specs, and journey maps
4. Feature/task/subtask counts match between STATUS.md, master tracker, and service matrix
5. API endpoint names match between service specs, contract registry, and task files (20% sample minimum)
6. Screen names match between screen catalog, task files, navigation specs, and workflow matrix

**Fail Action:**
- Fix every discrepancy immediately — rename to match the CONFIG source of truth
- If counts disagree, determine which is correct and update all others
- Do NOT proceed past Step 9.6 until all 6 checks pass with zero discrepancies

---

## Gate 13: Phantom Table Check

**Trigger:** Step 8.6 (cross-reference validator) + after database schema docs are generated.

**Purpose:** Catch "phantom" database tables — entities referenced in specs but never defined in the schema. These cause implementation failures when developers try to query tables that don't exist.

**Required Proof Artifacts:**
- [ ] Completed `phantom-table-check.template.md` with entity reference inventory
- [ ] Every referenced table verified against schema documentation

**Pass Criteria:**
- ZERO phantom tables — every table referenced in service specs, screen specs, task files, or API contracts has a definition in database schema documentation
- Every table has actual column definitions (not "N+ columns" or "various fields")
- Every table has required columns: `id`, `createdAt`, `updatedAt`, `deletedAt` (soft delete), `organizationId` (tenant isolation, unless pure reference table)
- All foreign key references point to existing tables

**Fail Action:**
- Define every phantom table in the database schema documentation
- Add column definitions to any table that only has estimates
- Add missing required columns
- Do NOT proceed past Step 8.6 until zero phantom tables remain

---

## Gate 14: Dead UI Sweep

**Trigger:** Step 7 (codebase audit) — for existing codebases only. Skip for greenfield projects.

**Purpose:** Identify and eliminate all non-functional UI before planning new development. Dead UI from a previous product/version wastes development time and confuses users.

**Required Proof Artifacts:**
- [ ] Completed `dead-ui-sweep.template.md` across all 5 categories
- [ ] `scripts/dead-ui-sweep.sh` output showing zero findings (or all findings resolved)
- [ ] `dev_docs/audit/dead-ui-sweep-report.md` with resolution for each finding

**Pass Criteria:**
- ZERO ghost routes (every route has an implemented page with real content)
- ZERO stub buttons or empty click handlers in shipped code
- ZERO visible "Coming Soon" / "Under Construction" / placeholder text
- ZERO dead feature domains (entire feature areas that are non-functional)
- ZERO significant commented-out feature blocks

**Fail Action:**
- Remove or implement every dead UI element — no exceptions
- Create cleanup tasks for any items that will be implemented (not just left as shells)
- Do NOT proceed past Step 7 until the dead-ui-sweep script outputs zero findings

---

## Gate 15: Regulatory Completeness (Conditional)

**Trigger:** Step 14 (security hardening) — only when `CONFIG.COMPLIANCE_REQUIREMENTS` != "none".

**Purpose:** Ensure every regulatory requirement has a concrete implementation plan — not just a mention in a document. Missing compliance requirements can prevent product sales (e.g., NEMSIS certification for EMS) or trigger legal liability.

**Required Proof Artifacts:**
- [ ] Completed `regulatory-completeness.template.md` with requirement matrix
- [ ] `dev_docs/completeness/regulatory-completeness-matrix.md` with 100% coverage
- [ ] MVP-blocking requirements clearly separated from post-MVP items

**Pass Criteria:**
- EVERY applicable regulation is listed with specific requirements
- EVERY requirement maps to an implementation: code task (with task ID), configuration, process, or vendor agreement
- EVERY "MVP Required" item has a task ID in the task generation output
- ZERO unmapped requirements
- Requirements deferred past MVP that could prevent product use are flagged with risk assessment
- Distinction between "legally required at launch" and "nice to have" is documented

**Fail Action:**
- Create missing tasks for unmapped requirements
- If a requirement is legally blocking but has no implementation plan, escalate to user immediately
- Do NOT proceed past Step 14 until the regulatory matrix has 100% coverage

---

## Gate 16: Client Log Consistency

**Trigger:** Every session boundary (session completion checklist Step 6).

**Purpose:** Ensure the client-facing work log accurately reflects all completed work with proper developer attribution. Missing entries = invisible work. Wrong attribution = credit goes to the wrong person.

**Required Proof Artifacts:**
- [ ] Current week's `dev_docs/client-log/week-NN_YYYY-MM-DD.md` exists
- [ ] Entry count matches DEVLOG entries for the session
- [ ] Developer name is non-empty on every entry

**Pass Criteria:**
- EVERY task completed this session has a corresponding client log entry
- EVERY client log entry has a non-empty **Developer** field
- EVERY client log entry has a non-empty **What was delivered** field written in client-friendly language (no file paths, no internal jargon)
- The weekly header **Tasks completed** count matches the actual number of entries
- The weekly header **By developer** breakdown is accurate (developer names and counts match entries)
- Milestone progress percentages are consistent with STATUS.md
- Schedule status is consistent with timeline.md/milestones.md

**Fail Action:**
- Add missing client log entries for any task without one
- Fix developer attribution on any entry with empty or incorrect developer name
- Update weekly header to match actual entry counts
- Session completion checklist cannot pass until client log is consistent
