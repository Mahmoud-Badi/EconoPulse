# Persona-Screen Completeness Check — Gate 11 Proof Artifact

> **Purpose:** Verifies that every persona can complete their entire daily workflow without hitting a missing screen.
> **Gate:** 11 (Persona-Screen Completeness)
> **Trigger:** After Step 6.5 (Screen Completeness Audit)

---

## Instructions

For EACH persona defined in the project tribunal/intake:

1. List their daily workflow from login to logout
2. Map each workflow step to a specific screen
3. Verify the screen exists in the screen catalog
4. Verify the screen passes Gate 7 (Screen User-Completeness)
5. Flag any "dead ends" — steps with no screen or screens with no action

---

## Persona: {{PERSONA_NAME}}

**Role:** {{PERSONA_ROLE}}
**Primary goal:** {{what they're trying to accomplish daily}}
**Frequency of use:** {{daily / weekly / occasional}}

### Daily Workflow Trace

| # | Workflow Step | Screen Name | Screen Exists? | Gate 7 Pass? | Notes |
|---|-------------|-------------|----------------|--------------|-------|
| 1 | Log in to system | Login Screen | ☐ Yes / ☐ No | ☐ Yes / ☐ No | |
| 2 | View dashboard / home | {{screen}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | |
| 3 | {{first major action}} | {{screen}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | |
| 4 | {{second major action}} | {{screen}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | |
| 5 | {{review/verify}} | {{screen}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | |
| ... | ... | ... | ... | ... | |
| N | Log out / end session | {{screen}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | |

### First-Time Experience

| # | Onboarding Step | Screen Name | Screen Exists? | Notes |
|---|----------------|-------------|----------------|-------|
| 1 | Account creation / invite acceptance | {{screen}} | ☐ Yes / ☐ No | |
| 2 | Profile setup | {{screen}} | ☐ Yes / ☐ No | |
| 3 | First login / onboarding tour | {{screen}} | ☐ Yes / ☐ No | |
| 4 | First meaningful action | {{screen}} | ☐ Yes / ☐ No | |

### Edge Case Workflows

| Scenario | Screen(s) Needed | Screen Exists? | Notes |
|----------|-----------------|----------------|-------|
| Password reset | {{screen}} | ☐ Yes / ☐ No | |
| Error recovery | {{screen}} | ☐ Yes / ☐ No | |
| Permission denied | {{screen}} | ☐ Yes / ☐ No | |
| Empty state (no data yet) | {{screen}} | ☐ Yes / ☐ No | |
| Bulk operations | {{screen}} | ☐ Yes / ☐ No | |

### Dead End Analysis

**Information dead ends** (can see data, can't act on it):
- [ ] None found
- {{list any dead ends}}

**Action dead ends** (can act, can't see result):
- [ ] None found
- {{list any dead ends}}

**Navigation dead ends** (can reach screen, can't get back or forward):
- [ ] None found
- {{list any dead ends}}

---

## Summary

| Persona | Workflow Steps | Screens Mapped | Screens Missing | Gate 7 Gaps | Dead Ends |
|---------|--------------|----------------|-----------------|-------------|-----------|
| {{persona_1}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} |
| {{persona_2}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} |

---

## Pass Criteria

- [ ] Every persona has a completed workflow trace
- [ ] Every workflow step maps to an existing screen
- [ ] Every mapped screen passes Gate 7
- [ ] Zero dead ends (or dead ends have documented resolution plan)
- [ ] First-time experience is documented for every persona

**If any persona has a gap in their primary workflow:** Create the missing screen spec before proceeding.
