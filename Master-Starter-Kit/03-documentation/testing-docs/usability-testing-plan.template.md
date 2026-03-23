# Usability Testing Plan

> Plan for testing **{{PROJECT_NAME}}** with real users at key milestones. Usability testing catches problems that automated tests cannot — confusing workflows, misleading labels, unexpected mental models. This plan structures testing so findings feed directly into the development backlog.

---

## Test Schedule

| Milestone | Phase | Target Date | Focus Area | Participants |
|-----------|-------|------------|------------|-------------|
| Round 1 | After Phase {{USABILITY_PHASE_1}} | {{USABILITY_DATE_1}} | Core workflows, navigation, terminology | {{USABILITY_PARTICIPANT_COUNT_1}} users |
| Round 2 | After Phase {{USABILITY_PHASE_2}} | {{USABILITY_DATE_2}} | End-to-end flows, edge cases, error recovery | {{USABILITY_PARTICIPANT_COUNT_2}} users |
| Round 3 | Pre-launch | {{USABILITY_DATE_3}} | Full application, onboarding, first-time experience | {{USABILITY_PARTICIPANT_COUNT_3}} users |

---

## Participant Recruitment

### Target: 5-8 Users Per Role

| Role | Description | Recruitment Source | Count |
|------|-------------|-------------------|-------|
| {{PERSONA_1_NAME}} | {{PERSONA_1_DESCRIPTION}} | {{RECRUITMENT_SOURCE_1}} | {{PERSONA_1_COUNT}} |
| {{PERSONA_2_NAME}} | {{PERSONA_2_DESCRIPTION}} | {{RECRUITMENT_SOURCE_2}} | {{PERSONA_2_COUNT}} |
| {{PERSONA_3_NAME}} | {{PERSONA_3_DESCRIPTION}} | {{RECRUITMENT_SOURCE_3}} | {{PERSONA_3_COUNT}} |

### Recruitment Criteria

**Include:**
- Matches target persona profile
- Has {{DOMAIN_EXPERIENCE_REQUIREMENT}} in the domain
- Comfortable thinking aloud during tasks
- Available for {{TEST_SESSION_DURATION}} minutes

**Exclude:**
- Internal team members (they know too much)
- Users who participated in a previous round (unless testing iteration effectiveness)
- Anyone with prior exposure to the application

### Incentive

| Session Type | Duration | Compensation |
|-------------|----------|-------------|
| In-person | {{TEST_SESSION_DURATION}} min | {{INCENTIVE_IN_PERSON}} |
| Remote | {{TEST_SESSION_DURATION}} min | {{INCENTIVE_REMOTE}} |

---

## Test Scenarios

10 critical workflows mapped to specific tasks. Each task has a clear success/failure criteria.

| # | Workflow | Task Description | Success Criteria | Priority | Phase Spec Reference |
|---|----------|-----------------|------------------|----------|---------------------|
| T1 | {{WORKFLOW_1}} | {{TASK_1_DESCRIPTION}} | {{TASK_1_SUCCESS}} | P1 | `{{TASK_1_SPEC_PATH}}` |
| T2 | {{WORKFLOW_2}} | {{TASK_2_DESCRIPTION}} | {{TASK_2_SUCCESS}} | P1 | `{{TASK_2_SPEC_PATH}}` |
| T3 | {{WORKFLOW_3}} | {{TASK_3_DESCRIPTION}} | {{TASK_3_SUCCESS}} | P1 | `{{TASK_3_SPEC_PATH}}` |
| T4 | {{WORKFLOW_4}} | {{TASK_4_DESCRIPTION}} | {{TASK_4_SUCCESS}} | P1 | `{{TASK_4_SPEC_PATH}}` |
| T5 | {{WORKFLOW_5}} | {{TASK_5_DESCRIPTION}} | {{TASK_5_SUCCESS}} | P2 | `{{TASK_5_SPEC_PATH}}` |
| T6 | {{WORKFLOW_6}} | {{TASK_6_DESCRIPTION}} | {{TASK_6_SUCCESS}} | P2 | `{{TASK_6_SPEC_PATH}}` |
| T7 | {{WORKFLOW_7}} | {{TASK_7_DESCRIPTION}} | {{TASK_7_SUCCESS}} | P2 | `{{TASK_7_SPEC_PATH}}` |
| T8 | {{WORKFLOW_8}} | {{TASK_8_DESCRIPTION}} | {{TASK_8_SUCCESS}} | P2 | `{{TASK_8_SPEC_PATH}}` |
| T9 | {{WORKFLOW_9}} | {{TASK_9_DESCRIPTION}} | {{TASK_9_SUCCESS}} | P3 | `{{TASK_9_SPEC_PATH}}` |
| T10 | {{WORKFLOW_10}} | {{TASK_10_DESCRIPTION}} | {{TASK_10_SUCCESS}} | P3 | `{{TASK_10_SPEC_PATH}}` |

---

## Test Environment Setup

| Requirement | Details |
|-------------|---------|
| Environment | {{USABILITY_TEST_ENVIRONMENT}} (staging, dedicated test instance) |
| URL | {{USABILITY_TEST_URL}} |
| Test accounts | Pre-created for each role: `{{TEST_ACCOUNT_PREFIX}}+role@{{TEST_DOMAIN}}` |
| Seed data | Loaded from `{{SEED_DATA_PLAN_PATH}}` — realistic but anonymized |
| Browser | Latest Chrome (standardize to avoid browser-specific confusion) |
| Screen resolution | 1920x1080 (match target user hardware) |
| Mobile testing | {{MOBILE_DEVICE}} with {{MOBILE_OS}} (if mobile is in scope) |

---

## Recording and Analysis

### Recording Method

| Item | Tool | Notes |
|------|------|-------|
| Screen recording | {{SCREEN_RECORDING_TOOL}} | Capture screen + audio |
| Think-aloud audio | Built into screen recording | Participant narrates their thinking |
| Observer notes | {{NOTE_TAKING_TOOL}} | Timestamped observations |
| Facial expression | Camera (optional) | For in-person sessions only |

### Session Structure ({{TEST_SESSION_DURATION}} minutes)

| Segment | Duration | Activity |
|---------|----------|----------|
| Introduction | 5 min | Explain the process, get consent, warm up |
| Background questions | 5 min | Current tools, pain points, expectations |
| Task scenarios | {{TASK_TIME}} min | Work through scenarios T1-T10 (prioritized subset per session) |
| Debrief | 10 min | Overall impressions, SUS questionnaire, open feedback |

### Analysis Framework

After each round, analyze recordings using this framework:

1. **Task completion rate** — % of users who completed each task without assistance
2. **Time on task** — Average time vs. expected time
3. **Error rate** — Number of wrong paths, mistakes, or recoveries per task
4. **Satisfaction** — System Usability Scale (SUS) score (target: > 68)
5. **Qualitative themes** — Common frustrations, confusions, or positive reactions

---

## Findings Template

For each finding, document:

| Field | Value |
|-------|-------|
| **Finding ID** | UF-{{FINDING_NUMBER}} |
| **Task Reference** | T{{TASK_NUMBER}} |
| **Severity** | Critical / Major / Minor / Cosmetic |
| **Frequency** | {{FREQUENCY_COUNT}} of {{TOTAL_PARTICIPANTS}} participants |
| **Description** | {{FINDING_DESCRIPTION}} |
| **User Quote** | "{{USER_QUOTE}}" |
| **Recommendation** | {{FINDING_RECOMMENDATION}} |
| **Screenshot/Timestamp** | {{FINDING_EVIDENCE}} |

### Severity Definitions

| Severity | Impact | Action |
|----------|--------|--------|
| **Critical** | User cannot complete the task at all | Must fix before next release |
| **Major** | User completes with significant difficulty or workaround | Fix in current phase |
| **Minor** | User notices but completes without real trouble | Schedule for next phase |
| **Cosmetic** | Polish issue, does not affect task completion | Backlog |

---

## Iteration Loop

Findings feed directly back into the development cycle:

```
Test → Analyze → Prioritize → Fix → Re-test
```

1. **Test:** Conduct usability testing round
2. **Analyze:** Document findings using the template above
3. **Prioritize:** Critical and Major findings added to the current sprint backlog
4. **Fix:** Implement changes, linking the PR to the finding ID (UF-XXX)
5. **Re-test:** Include fixed items in the next round to verify the fix worked

### Re-Test Criteria

A finding is considered resolved when:

- [ ] The fix is deployed to the test environment
- [ ] At least {{RETEST_PARTICIPANT_COUNT}} participants complete the task without the issue recurring
- [ ] Task completion rate for that task improves to > {{RETEST_SUCCESS_RATE}}%

---

## Deliverables Per Round

| Deliverable | Format | Location |
|-------------|--------|----------|
| Session recordings | Video files | `{{RECORDINGS_PATH}}` |
| Findings report | Markdown | `dev_docs/usability/round-{{ROUND_NUMBER}}-findings.md` |
| Prioritized fix list | Tasks in STATUS.md | Current sprint section |
| SUS score summary | Table | Included in findings report |
