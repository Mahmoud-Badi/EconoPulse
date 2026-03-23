# Repurpose Intake

**Purpose:** Gather structured information about both the source application and the target vertical/industry before any pivot planning begins. Produces a confirmed intake document that drives the R1-R4 repurpose sequence.

**Output:** `dev_docs/intake/repurpose-intake.md`

**Path:** Repurpose only

---

## When to Run

Run this instead of the standard Step 1 intake when:

- You have a working application and want to adapt it for a new industry or vertical market
- You want to reuse core functionality for a different customer segment
- You're evaluating whether your app can be the foundation for a product fork

---

## Phase 1 — Auto-Scan the Source Application

> Scan the source codebase before asking a single question. Pre-fill everything you can detect.

Scan the following (same as Enhance Intake Phase 1):

**Priority 1 — Core project files:** README, package.json/requirements.txt/Gemfile, lock files, .env.example

**Priority 2 — Architecture signals:** Docker/CI configs, tsconfig, eslint config, test configs

**Priority 3 — Existing documentation:** docs/, dev_docs/, CHANGELOG, ARCHITECTURE

**Priority 4 — Code structure:** Top-level directory listing, src/ structure (2 levels), database schema files

After scanning, pre-fill the source app tech stack table (same format as Enhance Intake Phase 1 pre-fill table).

---

## Phase 2 — Source Application Questions

These questions are about the app as it currently exists — before any pivot.

### Section A — What the Source App Does

1. **In one sentence: what core problem does your source app solve, and for whom?**
   (Example: "A project management tool for freelance designers to track client work and invoices")

2. **What is the app's core data model?** (What are the 3-5 most important entities/tables?)
   (Example: User, Project, Task, Client, Invoice)

3. **What are the 3 most-used features by current users?**

4. **What features are most loved — i.e., users would quit if removed?**

5. **What are the biggest technical limitations of the current architecture?**
   - Hard-coded assumptions that would be painful to generalize
   - Performance ceilings
   - Features that are deeply entangled and hard to separate
   - Multi-tenancy issues
   - Compliance constraints baked in (or absent)

### Section B — Current Business Context

6. **Is the source app currently live and serving users?**
   - Live with paying customers
   - Live but free/beta
   - In development, not yet launched
   - Legacy/sunset — being replaced

7. **Should the source app continue to operate after the repurpose?**
   - Yes — both products will run in parallel
   - No — the source app is being replaced
   - Uncertain — depends on how the pivot goes

8. **What's wrong with just selling the source app to the new vertical as-is?**
   (This surfaces the real gaps — the delta between what exists and what the new vertical needs)

---

## Phase 3 — Target Vertical Questions

These questions are about where you're going — the new industry or vertical.

### Section C — The Target Market

9. **What industry or vertical are you targeting?**
   (Be specific: not "healthcare" but "outpatient physical therapy clinics" or not "finance" but "independent financial advisors")

10. **Who is the primary buyer in the new vertical?** (The person who signs the check)
    - Individual professional (self-serve)
    - Department head / manager
    - C-level / owner
    - IT / procurement committee

11. **Who is the primary day-to-day user in the new vertical?** (If different from buyer)

12. **What does a typical workday look like for your target user in the new vertical?**
    Walk through 3-5 steps of their actual workflow — this surfaces feature requirements better than any question list.

### Section D — Fit & Gap

13. **What does the new vertical need that your source app already does well?**
    (What transfers without changes)

14. **What does the new vertical need that your source app does NOT do?**
    (The new capability gaps — what must be built from scratch)

15. **What does your source app do that is irrelevant or actively wrong for the new vertical?**
    (Features to hide, remove, or replace)

16. **Are there terminology differences?** (What do your source users call things vs. what the new vertical calls them?)
    Example: Source app says "client" → New vertical says "patient"
    Example: Source app says "project" → New vertical says "case" or "matter"

### Section E — Compliance & Regulation

17. **Does the new vertical have industry-specific compliance requirements?**
    Select all that apply:
    - HIPAA (US healthcare)
    - GDPR (EU data protection)
    - SOC 2 (enterprise security)
    - PCI DSS (payment card industry)
    - FCA / FinCEN (financial services)
    - FERPA (US education)
    - Industry-specific certifications or standards
    - None that I know of

18. **How does the new vertical's compliance profile compare to your source app's?**
    - Less regulated (simpler)
    - Similar regulation level
    - More regulated (requires significant additions)

### Section F — Strategic Intent

19. **What's the relationship between the source app and the repurposed product?**
    - Same product, new vertical-specific branding/config only
    - New product line sharing the same codebase (feature-flagged)
    - Full product fork — two separate codebases maintained independently
    - Still deciding — let the pivot depth score guide the decision

20. **Timeline for the repurposed product:**
    - Live within 1 month
    - 1-3 months
    - 3-6 months
    - Longer-term — planning phase only

21. **Team resources for the repurpose effort:**
    - Solo developer
    - 2-3 person team
    - 4-10 person team
    - Larger team or dedicated vertical team

---

## Phase 4 — Output

Write `dev_docs/intake/repurpose-intake.md`:

```markdown
# Repurpose Intake — {Source App Name} → {Target Vertical}

> **Date:** {date}
> **Path:** Repurpose
> **Kit version:** Master Starter Kit

---

## Source Application

| Field | Value |
|-------|-------|
| App name | {name} |
| Core problem solved | {one sentence} |
| Core user type | {who uses it now} |
| Launch status | {Live / Beta / In development / Legacy} |
| Source app continues post-repurpose | {Yes / No / TBD} |

### Tech Stack (Confirmed)
{Same tech stack table as Enhance Intake format}

### Core Data Model
{List 3-5 primary entities with brief descriptions}

### Top Features (by usage)
1. {feature 1}
2. {feature 2}
3. {feature 3}

### Source App Limitations for This Pivot
1. {limitation 1}
2. {limitation 2}
3. {limitation 3}

---

## Target Vertical

| Field | Value |
|-------|-------|
| Target industry/vertical | {specific vertical} |
| Primary buyer | {buyer persona} |
| Primary user | {user persona} |
| Compliance requirements | {list or "None known"} |
| Compliance delta vs. source | {Simpler / Similar / More regulated} |

### Target User's Typical Workflow
{3-5 step walkthrough of what they do daily}

### Fit Analysis

**Transfers well from source app:**
1. {what works in new vertical}
2. {what works in new vertical}

**Missing from source app (new capabilities needed):**
1. {new need 1}
2. {new need 2}

**Irrelevant or wrong in new vertical (to remove/replace):**
1. {what to remove/hide}
2. {what to remove/hide}

### Terminology Map

| Source app term | New vertical term | Change type |
|----------------|------------------|-------------|
| {term} | {vertical term} | Rename / Repurpose / Replace |

---

## Strategic Intent

| Field | Value |
|-------|-------|
| Relationship model | {Same product / Feature-flagged / Full fork / TBD} |
| Timeline | {1mo / 1-3mo / 3-6mo / Longer} |
| Team size | {solo / 2-3 / 4-10 / Larger} |

---

## Next Step

Proceed to **Step R1: Pivot Depth Detector** — `38-repurpose/PIVOT-DEPTH-DETECTOR.md`
```

---

## Quality Rules

1. **Scan the source app before asking.** Don't ask "what framework does your app use?" if package.json answers it.
2. **The workflow walkthrough is the most valuable question.** Push for specificity — "they log in and manage cases" is useless. "They open the app, see a list of today's 8 appointments sorted by time, click into each to document session notes using a SOAP format, then mark the appointment as completed" is actionable.
3. **Limitations must be honest.** Sugarcoating source app limitations leads to under-scoped pivot plans that miss the real work.
4. **Compliance is a gate, not a checkbox.** HIPAA compliance is not "add a checkbox." Get this right in intake so the pivot depth score reflects it accurately.
