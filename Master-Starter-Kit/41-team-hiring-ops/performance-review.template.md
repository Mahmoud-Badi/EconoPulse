# Performance Review

> Performance reviews exist to grow people, not grade them. This template provides the full cycle — self-assessment, manager assessment, peer feedback, calibration, improvement plans, and promotion criteria — designed so that every review produces specific, actionable growth signals rather than vague platitudes.

---

## 1. Review Cadence

<!-- IF {{REVIEW_CADENCE}} == "annual" -->
**Annual reviews:** One formal review per year with informal check-ins quarterly. Simple to administer but feedback arrives too late to course-correct. Supplement with monthly 1:1s focused on growth.
<!-- ENDIF -->

<!-- IF {{REVIEW_CADENCE}} == "semi-annual" -->
**Semi-annual reviews:** Two formal reviews per year (typically January and July). Balances thoroughness with timeliness. Most recommended for teams of 10-50.
<!-- ENDIF -->

<!-- IF {{REVIEW_CADENCE}} == "quarterly" -->
**Quarterly reviews:** Four formal reviews per year. High feedback frequency but high administrative burden. Best for fast-growing teams where roles and expectations shift rapidly.
<!-- ENDIF -->

### Review Cycle Calendar

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Self-assessment** | 1 week | Employee completes self-assessment form |
| **Peer feedback collection** | 1 week (overlapping) | 3-5 peers submit 360 feedback |
| **Manager assessment** | 1 week | Manager writes assessment, reviews peer feedback and self-assessment |
| **Calibration** | 1 session (2-3 hours) | Managers calibrate ratings across the team/org |
| **Review conversations** | 1-2 weeks | Manager delivers review in 1:1 meeting (45-60 min) |
| **Growth plan creation** | 1 week | Employee and manager create forward-looking growth plan |

**Total cycle time:** 4-5 weeks from start to completion.

---

## 2. Self-Assessment Template

Employees complete this before the review. It grounds the conversation in the employee's own perspective and surfaces blind spots.

### Self-Assessment Form

```
SELF-ASSESSMENT — {{REVIEW_PERIOD}}
Employee: ____
Role: ____
Level: ____
Manager: ____
Date: ____

SECTION 1: ACCOMPLISHMENTS
List 3-5 significant accomplishments this review period.
For each, describe:
- What you did (specific deliverable or outcome)
- The impact (quantify if possible — users affected, revenue, performance improvement)
- What was challenging about it

1. ____
2. ____
3. ____
4. ____
5. ____

SECTION 2: GROWTH AREAS
Identify 2-3 areas where you grew this period:
- What skill or capability improved?
- What evidence demonstrates the growth?
- How did you develop this (mentorship, practice, courses, feedback)?

1. ____
2. ____
3. ____

SECTION 3: CHALLENGES
Describe 1-2 significant challenges or setbacks:
- What happened?
- What did you learn?
- What would you do differently?

1. ____
2. ____

SECTION 4: DEVELOPMENT GOALS
What 2-3 areas do you want to develop in the next review period?
- What specific skill or behavior?
- How will you develop it?
- How will you know you have improved?

1. ____
2. ____
3. ____

SECTION 5: ROLE SATISFACTION (1-5 scale)
- How engaged are you in your work? ___
- How well does your role align with your career goals? ___
- How supported do you feel by your manager? ___
- How well does the team collaborate? ___
- How satisfied are you with your growth trajectory? ___

SECTION 6: OPEN FEEDBACK
Anything else you want your manager to know?
____
```

---

## 3. Manager Assessment Template

The manager completes this after reviewing the self-assessment and peer feedback. The assessment should contain no surprises — anything in the written review should have been discussed in 1:1s during the period.

### Manager Assessment Form

```
MANAGER ASSESSMENT — {{REVIEW_PERIOD}}
Employee: ____
Role: ____
Level: ____
Manager: ____
Date: ____

OVERALL RATING: ____
(See rating scale below)

SECTION 1: PERFORMANCE AGAINST EXPECTATIONS
For each key responsibility of the role, rate performance:

| Responsibility | Rating (1-5) | Evidence / Examples |
|---------------|-------------|---------------------|
| [Responsibility 1] | | |
| [Responsibility 2] | | |
| [Responsibility 3] | | |
| [Responsibility 4] | | |
| [Responsibility 5] | | |

SECTION 2: COMPETENCY ASSESSMENT
Rate against level expectations (see role-definition-framework.template.md):

| Competency | Rating (1-5) | Evidence / Examples |
|-----------|-------------|---------------------|
| Technical skill | | |
| Problem-solving | | |
| Communication | | |
| Collaboration | | |
| Leadership / Mentorship | | |
| Ownership / Initiative | | |
| Quality / Craftsmanship | | |

SECTION 3: KEY STRENGTHS (2-3)
What does this person do exceptionally well? Be specific.
1. ____
2. ____
3. ____

SECTION 4: DEVELOPMENT AREAS (2-3)
Where should this person focus their growth? Be specific and constructive.
1. ____
2. ____
3. ____

SECTION 5: IMPACT SUMMARY
One paragraph summarizing this person's impact on the team and organization
during this review period.
____

SECTION 6: COMPENSATION RECOMMENDATION
- [ ] No adjustment (at appropriate level for performance)
- [ ] Merit increase: ___% (above-expectations performance)
- [ ] Promotion to [level] (operating consistently at next level)
- [ ] Equity refresh grant (retention, high performance)
- [ ] Performance improvement plan (below expectations — see PIP section)
```

### Rating Scale

| Rating | Label | Definition | Expected Distribution |
|--------|-------|-----------|----------------------|
| 1 | **Does Not Meet Expectations** | Significant gaps in core responsibilities. PIP required. | 5-10% |
| 2 | **Partially Meets Expectations** | Some gaps that need attention. Specific improvement plan. | 10-15% |
| 3 | **Meets Expectations** | Performs all responsibilities at level. Solid contributor. | 50-60% |
| 4 | **Exceeds Expectations** | Consistently goes beyond role requirements. High impact. | 15-20% |
| 5 | **Significantly Exceeds Expectations** | Exceptional performance. Promotion candidate. | 5-10% |

**Important:** Forced distribution (mandatory quotas per rating) is corrosive and should be avoided. The percentages above are descriptive averages, not prescriptive targets. A team of strong performers should have above-average ratings.

---

## 4. Peer Feedback (360)

### Peer Feedback Request

Select 3-5 peers who have worked closely with the employee. Include at least one person from outside the immediate team if applicable. The employee can suggest peers, but the manager makes the final selection.

### Peer Feedback Form

```
PEER FEEDBACK — {{REVIEW_PERIOD}}
Feedback for: ____
Feedback from: ____
Relationship: [peer / cross-functional partner / mentee / tech lead]
Date: ____

1. What is [Name]'s greatest strength? Give a specific example.
____

2. What is one area where [Name] could improve? Be constructive and specific.
____

3. How effectively does [Name] collaborate with you and the team?
(1=poorly, 5=exceptionally)
Rating: ___
Example: ____

4. How effectively does [Name] communicate?
(1=poorly, 5=exceptionally)
Rating: ___
Example: ____

5. Would you want to work with [Name] again on a future project? Why or why not?
____

6. Is there anything else you would like the manager to know about
working with [Name]?
____
```

### Processing Peer Feedback

- Anonymize feedback before sharing with the employee (attribute by role, not name: "a cross-functional partner noted...")
- Look for patterns across multiple peers, not individual outliers
- Weight feedback from close collaborators more than from infrequent partners
- Never use a single peer comment as the basis for a rating — require corroboration

---

## 5. Calibration Process

Calibration ensures consistency across managers. Without it, a "4" from one manager means something different from a "4" from another.

### Calibration Meeting Structure

**Participants:** All managers at the same level (e.g., all EMs, or all Directors)
**Duration:** 2-3 hours
**Facilitator:** VP or Director (one level above the calibrating managers)

**Agenda:**

1. **Ground rules (5 min):** Remind participants of the rating scale definitions. Calibration is about consistency, not ranking employees against each other.
2. **Round 1 — Outliers (30 min):** Each manager presents employees rated 1, 2, or 5 first. These are the most likely to be miscalibrated. The group questions whether the evidence supports the rating.
3. **Round 2 — Borderline cases (30 min):** Employees rated on the border between two ratings (e.g., "3 or 4, I was not sure"). Group discusses.
4. **Round 3 — Full roster (30-60 min):** Quick review of remaining employees. Flag any that seem inconsistent with calibrated outliers and borderlines.
5. **Promotion nominations (20 min):** Managers nominate employees for promotion. Group evaluates against level criteria from `role-definition-framework.template.md`.
6. **PIP nominations (10 min):** Managers flag employees for performance improvement plans. Group reviews evidence.
7. **Summary and adjustments (10 min):** Document any rating changes made during calibration.

### Calibration Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Manager advocates for their reports like a lawyer | Manager presents evidence; the group evaluates it |
| Recency bias — only recent work is considered | Require managers to bring examples from the full review period |
| Stack ranking ("only 2 people can be a 4") | Each person is evaluated against level expectations, not against each other |
| Calibration becomes a popularity contest | Focus on deliverables, behavior evidence, and competency ratings |
| Manager downgrades after calibration without explaining to employee | Any calibration-driven change must be explained honestly in the review conversation |

---

## 6. Performance Improvement Plan (PIP) Template

A PIP is a structured intervention for employees who are not meeting expectations. It should be clear, fair, and time-bound. A well-designed PIP gives the employee a genuine chance to succeed and documents the process if they do not.

### PIP Document

```
PERFORMANCE IMPROVEMENT PLAN
Employee: ____
Manager: ____
Start date: ____
End date: ____ (typically 30-60 days)
HR contact: ____

SECTION 1: PERFORMANCE GAPS
Specific behaviors or deliverables that are below expectations:

| Gap | Expected Standard | Current Performance | Evidence |
|-----|-------------------|--------------------| ---------|
| | | | |
| | | | |
| | | | |

SECTION 2: IMPROVEMENT OBJECTIVES
What must improve by the PIP end date:

| Objective | Success Criteria | How It Will Be Measured |
|-----------|-----------------|----------------------|
| | | |
| | | |
| | | |

SECTION 3: SUPPORT PROVIDED
What the company will provide to help the employee succeed:

- [ ] Weekly 1:1s with manager (minimum 30 min, focused on PIP progress)
- [ ] Mentorship from [senior person] on [specific skill]
- [ ] Reduced scope to focus on improvement areas
- [ ] Training or resources: ____
- [ ] Clear, immediate feedback on relevant work

SECTION 4: CHECK-IN SCHEDULE

| Date | Focus | Outcome |
|------|-------|---------|
| Week 1 | Initial progress assessment | |
| Week 2 | Mid-point review | |
| Week 3 | Progress assessment | |
| Week 4 | Final assessment | |

SECTION 5: OUTCOME
At the end of the PIP period, one of three outcomes:

- [ ] **PIP PASSED:** Performance meets expectations. Return to normal operations.
       Monitor for 90 days to confirm sustained improvement.
- [ ] **PIP EXTENDED:** Meaningful progress but not yet meeting expectations.
       Extend by 2 weeks with adjusted objectives. Maximum one extension.
- [ ] **PIP FAILED:** Performance has not improved sufficiently.
       Proceed with separation per company policy and local employment law.

SIGNATURES
Employee: ____  Date: ____
Manager: ____  Date: ____
HR: ____  Date: ____
```

**PIP Guidelines:**
- Never use a PIP as a pre-termination formality. If you have already decided to fire someone, do not put them through a PIP — it is dishonest and wastes everyone's time.
- A PIP should be a genuine investment in the employee's success, not a paper trail.
- Document everything. If the PIP leads to termination, documentation protects both parties.
- Never PIP for culture or "attitude" alone — specify observable behaviors.

---

## 7. Promotion Criteria by Level

Promotions are recognition that someone is already performing at the next level, not a reward for time served.

### Promotion Readiness Criteria

| Transition | Required Evidence | Minimum Time in Level |
|-----------|-------------------|----------------------|
| IC1 → IC2 | Consistently delivers features independently. Code quality meets team standard. | 12-18 months |
| IC2 → IC3 | Owns a system or domain. Designs features end-to-end. Mentors IC1. Influences technical decisions. | 18-24 months |
| IC3 → IC4 | Leads cross-team technical initiatives. Writes RFCs adopted by the org. Recognized as a domain authority. | 24-36 months |
| IC4 → IC5 | Shapes company-wide technical direction. Industry-level expertise. Creates leverage across the org. | 36+ months |
| IC → M1 | Successful tech lead rotation. Demonstrated people management aptitude. Wants to manage (not just doing it for the title). | N/A (lateral move) |
| M1 → M2 | Successfully manages multiple teams. Develops EMs. Drives organizational-level outcomes. | 24-36 months |

### Promotion Process

1. **Manager nominates** during calibration, with evidence packet
2. **Calibration group evaluates** against level criteria
3. **Skip-level approves** (manager's manager confirms)
4. **Compensation adjustment** calculated per `compensation-framework.template.md`
5. **Communication:** Manager delivers the news in 1:1. Public announcement follows.
6. **New expectations set:** Manager and employee discuss what "operating at the new level" means

---

## 8. Growth Plan Template

Every employee should have a living growth plan that is reviewed quarterly, regardless of performance rating.

### Growth Plan

```
GROWTH PLAN — {{REVIEW_PERIOD}} → next period
Employee: ____
Manager: ____
Current level: ____
Aspiration: ____ (next level, lateral move, skill deepening, etc.)

GROWTH OBJECTIVE 1: ____
- What skill or behavior are you developing?
- Why does this matter for your growth?
- How will you develop it?
  - [ ] Stretch assignment: ____
  - [ ] Mentorship from: ____
  - [ ] Course / reading: ____
  - [ ] Practice / repetition: ____
- How will we know you have improved?
  - Milestone 1 (30 days): ____
  - Milestone 2 (60 days): ____
  - Milestone 3 (90 days): ____

GROWTH OBJECTIVE 2: ____
[Same structure as above]

GROWTH OBJECTIVE 3: ____
[Same structure as above]

MANAGER COMMITMENT
What I will provide to support these growth objectives:
- ____
- ____
- ____

REVIEW DATE: ____
```

---

## Checklist

- [ ] Selected {{REVIEW_CADENCE}} review cadence and blocked calendar for the cycle
- [ ] Distributed self-assessment template to all employees
- [ ] Collected peer feedback from 3-5 peers per employee
- [ ] Completed manager assessment for each direct report
- [ ] Conducted calibration meeting with peer managers
- [ ] Delivered review conversations within 2 weeks of calibration
- [ ] Created or updated growth plans for every employee
- [ ] Initiated PIPs for any employee rated "Does Not Meet Expectations" (with HR guidance)
- [ ] Processed promotion nominations through the promotion process
- [ ] Updated compensation per calibration decisions (merit increases, equity refreshes)
- [ ] Filed completed reviews in employee records
- [ ] Scheduled next review cycle start date
