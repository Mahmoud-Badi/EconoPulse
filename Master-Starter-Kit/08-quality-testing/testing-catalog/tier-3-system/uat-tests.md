# User Acceptance Testing (UAT)

## What It Is

User acceptance testing determines whether the feature solves the user's actual problem — not from the developer's perspective ("does the code work?") or the QA perspective ("does it match the spec?") but from the user's perspective ("can I accomplish what I came here to do?"). UAT bridges the gap between "technically correct" and "actually useful." A checkout flow can pass every E2E test and still fail UAT because users don't understand which button to click, can't find the promo code field, or abandon because the flow requires too many steps. UAT uses real people (or realistic personas) performing real tasks without guidance, measuring task completion rate, time-on-task, error rate, and subjective satisfaction. It is the last gate before a feature is considered done — the moment where the team discovers whether they built the right thing, not just built the thing right.

## What It Catches

- **Correct implementation of the wrong thing** — the feature matches the spec perfectly but the spec didn't capture what users actually need; users don't use the feature the way designers assumed
- **Confusing UI copy** — "Submit application" button on a form where users expect "Save" because they don't realize it's being sent somewhere; "Cancel" button that users think cancels the action but actually cancels their entire account setup
- **Missing mental model alignment** — users expect to find settings under their profile avatar but the app puts them under a gear icon in the sidebar they never noticed
- **Excessive friction in critical paths** — checkout requires 7 steps when competitors do it in 3; onboarding asks for information the app could infer from the user's first actions
- **Error recovery confusion** — a form shows "validation failed" with no indication of which field is wrong or what the correct format is
- **Accessibility gaps automation can't catch** — the screen reader can read every element but the reading order makes no logical sense; a blind user can Tab through the form but has no way to understand the multi-step wizard's progress
- **Task abandonment triggers** — users consistently drop off at the same step because the UI doesn't communicate what happens next, creating uncertainty
- **Feature discoverability failures** — a key feature exists and works perfectly but users don't know it's there because the entry point is buried three navigation levels deep

## When It's Required

- The feature handles money, billing, or financial data (C7) — users must understand exactly what they're paying, when, and how to cancel
- The feature is user-facing (C14) — any feature that external users interact with needs UAT validation
- The feature introduces a new workflow or significantly changes an existing one
- The feature is the product's primary value proposition (the thing users come to the product to do)
- The feature has been through multiple revision cycles or had significant scope changes during development
- Stakeholder sign-off is required before release (common in enterprise, regulated, or agency projects)

**Skip when:** The change is purely technical (dependency upgrade, refactor with no UI changes, backend performance optimization) with zero user-facing impact.

## Setup Guide

### Prerequisites

UAT doesn't require a test framework — it requires a process, a test environment, and real people.

**Environment:**
- A staging environment that mirrors production (real data or realistic seed data, not lorem ipsum)
- Test accounts pre-configured with different roles and states (new user, existing user with data, admin)
- A way to reset test accounts between sessions (script or admin panel)

**Participants:**
- 5 participants catches ~85% of usability issues (Nielsen Norman Group research)
- Recruit from the actual target user group, not from the development team
- For B2B: recruit from customer contacts, beta users, or customer success team members who understand user workflows
- For B2C: use user testing platforms (UserTesting.com, Maze, Lookback) or recruit from existing user base

**Facilitation tools:**
- Screen recording: Loom (free for short sessions), OBS (free, local recording)
- Remote sessions: Zoom with screen share, or Maze for unmoderated async testing
- Note-taking: structured spreadsheet or dedicated tool (Dovetail, EnjoyHQ)

### Session structure

Each UAT session should follow this structure:

1. **Brief (2 min)** — explain you're testing the product, not the user; there are no wrong answers; they should think aloud
2. **Background questions (3 min)** — establish the participant's context, experience level, and expectations
3. **Task scenarios (20-30 min)** — give scenario-based tasks (see template below), observe without helping
4. **Post-task questionnaire (5 min)** — SUS (System Usability Scale) or custom satisfaction questions
5. **Open discussion (5 min)** — "what confused you?", "what would you change?", "would you use this?"

## Template

### UAT scenario template

Write scenarios from the user's perspective using their language, not the developer's. A good UAT scenario describes a goal, not a procedure.

```markdown
## UAT Scenario Card

**Feature:** Project creation and onboarding
**Persona:** Sarah, freelance designer, new to the platform
**Precondition:** Fresh account, just completed email verification

---

### Scenario 1: Create your first project

**Context:** You just signed up for [Product] because a colleague recommended it
for managing client projects. You have a real client project starting Monday.

**Task:** Set up your first project so you're ready to start tracking work on Monday.

**Success criteria:**
- [ ] User creates a project without asking for help
- [ ] User gives the project a name and relevant settings
- [ ] User can find the project on their dashboard after creation

**Observation notes:**
- Time to complete: ___ minutes
- Errors/wrong turns: ___
- Help requested: yes / no
- Confidence level (1-5): ___

---

### Scenario 2: Invite a team member

**Context:** You've set up your project. Now your developer Alex needs access
so they can see the task list.

**Task:** Add Alex (alex@example.com) to your project so they can see tasks.

**Success criteria:**
- [ ] User finds the invite mechanism without guidance
- [ ] User successfully sends an invitation
- [ ] User understands what permissions Alex will have

**Observation notes:**
- Time to complete: ___ minutes
- Errors/wrong turns: ___
- Help requested: yes / no
- Confidence level (1-5): ___

---

### Scenario 3: Track progress

**Context:** It's Wednesday. Your team has been working for 3 days. Your client
asks how the project is going.

**Task:** Find out the overall progress of your project and share a summary
with your client.

**Success criteria:**
- [ ] User finds a progress view/dashboard
- [ ] User can identify completed vs. pending work
- [ ] User finds a way to share or export a summary

**Observation notes:**
- Time to complete: ___ minutes
- Errors/wrong turns: ___
- Help requested: yes / no
- Confidence level (1-5): ___
```

### UAT metrics tracking spreadsheet

```markdown
## UAT Results Summary

**Feature:** _______________
**Date:** _______________
**Participants:** 5

### Task Completion Matrix

| Scenario | P1 | P2 | P3 | P4 | P5 | Completion Rate |
|----------|----|----|----|----|-----|-----------------|
| Create first project | ✓ | ✓ | ✓ | ✗ | ✓ | 80% |
| Invite team member | ✓ | ✓ | ✗ | ✓ | ✓ | 80% |
| Track progress | ✓ | ✗ | ✓ | ✗ | ✓ | 60% |

### Time on Task (minutes)

| Scenario | P1 | P2 | P3 | P4 | P5 | Median | Target |
|----------|----|----|----|----|-----|--------|--------|
| Create first project | 3.2 | 4.1 | 2.8 | 8.5* | 3.5 | 3.5 | < 5 min |
| Invite team member | 1.5 | 2.0 | 6.2* | 1.8 | 2.2 | 2.0 | < 3 min |
| Track progress | 2.1 | 7.3* | 3.0 | 5.8* | 2.5 | 3.0 | < 3 min |

*Asterisk indicates user required help or made significant errors.

### Error Analysis

| Error Pattern | Frequency | Severity | Recommendation |
|--------------|-----------|----------|----------------|
| Couldn't find invite button | 2/5 | High | Move invite action to project header, not settings |
| Confused "Archive" with "Delete" | 3/5 | Critical | Rename button, add confirmation with explanation |
| Didn't understand permission levels | 2/5 | Medium | Add tooltip explaining each role |

### SUS Score

| Participant | Score |
|------------|-------|
| P1 | 82.5 |
| P2 | 67.5 |
| P3 | 75.0 |
| P4 | 55.0 |
| P5 | 80.0 |
| **Average** | **72.0** |

SUS benchmarks: Below 51 = Unacceptable, 51-68 = Marginal, 68-80 = Acceptable, 80+ = Excellent

### Decision

| Threshold | Criteria | Result |
|-----------|----------|--------|
| Task completion | All scenarios > 80% | ✗ Scenario 3 at 60% — FAIL |
| Time on task | All scenarios within 2x target | ✓ |
| SUS score | Average > 68 | ✓ 72.0 |
| Critical errors | Zero critical unresolved | ✗ Archive/Delete confusion — FAIL |

**Verdict:** ☐ Approved  ☒ Approved with conditions  ☐ Rejected

**Conditions:**
1. Fix Archive/Delete confusion before release
2. Move invite action to visible location, retest with 3 participants
3. Add progress summary export feature to backlog (P2 priority)
```

### Stakeholder sign-off template

```markdown
## UAT Sign-Off

**Feature:** _______________
**UAT Round:** _______________
**Date:** _______________

### Results Summary
- Participants tested: 5
- Task completion rate: ___%
- Average SUS score: ___
- Critical issues found: ___
- Critical issues resolved: ___

### Acceptance Decision

☐ **Approved** — Feature meets acceptance criteria. Ship it.
☐ **Approved with conditions** — Feature is acceptable with the following changes
  before release:
  1. _______________
  2. _______________
☐ **Rejected** — Feature does not meet acceptance criteria. Must address:
  1. _______________
  2. _______________

### Signatures

| Name | Role | Decision | Date |
|------|------|----------|------|
| _______________ | Product Owner | ☐ Approve ☐ Reject | |
| _______________ | Design Lead | ☐ Approve ☐ Reject | |
| _______________ | Engineering Lead | ☐ Approve ☐ Reject | |
| _______________ | QA Lead | ☐ Approve ☐ Reject | |
```

## Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| **UAT scenarios are just E2E tests rewritten in English** | "Click the create button, fill in the name field, click save, verify the project appears." This tests procedure, not user understanding. | Write scenarios as goals with context: "You have a new client project starting Monday. Set up your workspace so you're ready." Let the user figure out how. |
| **Developers observe their own feature** | Developer is too invested — they unconsciously guide the user ("oh, that button is over there"), explain the UI, or rationalize failures ("they just didn't see it"). | Use a neutral facilitator who didn't build the feature. Developers can watch recordings later. If a developer must observe, enforce a strict "no helping" rule. |
| **UAT happens after the feature is "done"** | By the time UAT runs, the feature is code-complete, the sprint is ending, and there's no time to act on findings. UAT becomes a checkbox. | Schedule UAT when the feature is functionally complete but before the sprint ends. Budget at least 2-3 days between UAT and release for fixes. Better: run informal UAT with wireframes/prototypes before coding starts. |
| **Testing with the development team** | "We'll just have the PM and other developers test it." These people know the product's mental model. They'll navigate perfectly. | Recruit external participants — actual users or people matching the target persona. Internal testing is useful but it's not UAT. |
| **No defined acceptance criteria** | UAT runs, some issues are found, team debates whether they're blockers or nice-to-haves. No clear threshold for pass/fail. | Define acceptance criteria before UAT begins: minimum task completion rate (usually 80%), maximum acceptable SUS score (usually >68), zero critical issues unresolved. |
| **Not testing with realistic data** | Staging has 3 projects, each named "Test Project 1." Real users will have 50 projects with real names, making search and navigation much harder. | Seed the staging environment with realistic data volume and variety. Use production-like data (anonymized if needed). |

## Proof Artifact

The UAT process must produce:

1. **UAT session recordings or notes** — at least 5 participant sessions documented with time-on-task, error counts, and observation notes

2. **UAT results summary** — the completed metrics table showing:
   - Task completion rate per scenario (target: >80%)
   - Median time-on-task per scenario (target: within 2x of expected)
   - SUS score or equivalent satisfaction metric (target: >68)
   - Error pattern analysis with frequency counts

3. **Issue list with severity and resolution** — every issue found during UAT, classified as Critical / High / Medium / Low, with resolution status:
   ```
   | # | Issue | Severity | Status | Resolution |
   |---|-------|----------|--------|------------|
   | 1 | Users can't find invite button | High | Fixed | Moved to project header |
   | 2 | Archive/Delete confusion | Critical | Fixed | Renamed + confirmation |
   | 3 | No progress export | Medium | Backlogged | Scheduled for v1.2 |
   ```

4. **Stakeholder sign-off document** — the completed sign-off template with signatures from Product Owner, Design Lead, and Engineering Lead, with the acceptance decision clearly stated

5. **Before/after evidence** (if issues were fixed) — screenshots or short recordings showing the original problem and the fix, confirming the UAT-identified issues were actually addressed
