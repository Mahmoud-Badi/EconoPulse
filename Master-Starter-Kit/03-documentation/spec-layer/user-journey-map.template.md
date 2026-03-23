# User Journey Maps — {{PROJECT_NAME}}

> **Generated at:** Step 6.9
> **Purpose:** Maps each persona's journey through 5 lifecycle phases, from first contact to mastery.
> **Cross-references:** Screen specs (Step 6), persona definitions (tribunal), workflow traces (Step 6.8)

---

## Journey Map Index

| Persona | Role | Journey Documented? | Screens Covered | Gaps Found |
|---------|------|--------------------|-----------------|-----------|
| {{persona_1}} | {{role}} | ☐ Yes | {{N}} | {{N}} |
| {{persona_2}} | {{role}} | ☐ Yes | {{N}} | {{N}} |

---

## Persona: {{PERSONA_NAME}}

**Role:** {{PERSONA_ROLE}}
**Technical skill level:** {{Novice / Intermediate / Expert}}
**Usage frequency:** {{Daily / Weekly / Occasional}}
**Primary goal:** {{what they're trying to accomplish}}
**Key frustrations with current tools:** {{what annoys them about existing solutions}}

---

### Phase 1: First-Time Setup (Day 0)

**Goal:** Get from zero to logged in with a configured profile.

| Step | Touchpoint | Screen | Emotion | Pain Point | Opportunity |
|------|-----------|--------|---------|------------|-------------|
| 1 | Receives invite email | Email | Curious, cautious | Link may look like phishing | Clear branding, preview of what they'll see |
| 2 | Clicks invite link | Signup/Accept | Hopeful | Too many form fields | Minimal fields, pre-fill from invite |
| 3 | Creates password | Signup | Slightly annoyed | Password requirements unclear | Show requirements upfront, strength meter |
| 4 | First login | Login → Dashboard | Overwhelmed or excited | Empty dashboard, what now? | Onboarding checklist, welcome modal |
| 5 | Profile setup | Profile/Settings | Task-oriented | Why do I need this now? | Explain why each field matters |

**Empty state strategy:** {{what do they see when there's no data? Helpful CTA, sample data, or guided tour?}}

**Onboarding tour:** {{3-5 key features to highlight on first login, in priority order}}

---

### Phase 2: Learning (Week 1)

**Goal:** Understand the core workflow and complete their first real task successfully.

| Step | Touchpoint | Screen | Emotion | Pain Point | Opportunity |
|------|-----------|--------|---------|------------|-------------|
| 1 | First real task | {{screen}} | Uncertain | Don't know where to start | Contextual help, suggested next steps |
| 2 | Makes first mistake | {{screen}} | Frustrated | No undo, no draft save | Auto-save, undo, clear error messages |
| 3 | Completes first task | {{screen}} | Relieved, satisfied | Was it saved? Did it work? | Success confirmation, progress indicator |
| 4 | Explores other areas | Navigation | Curious | Gets lost, can't find back | Breadcrumbs, recent items, search |
| 5 | Gets stuck | Help/Docs | Frustrated | Documentation doesn't match UI | Contextual help tooltips, in-app guide |

**Tooltips needed:** {{list 5-8 key UI elements that need explanatory tooltips for new users}}

**Help content needed:** {{list 3-5 help articles or in-app guides for common first-week questions}}

---

### Phase 3: Competency (Week 2-4)

**Goal:** Become efficient at daily tasks, discover shortcuts and advanced features.

| Step | Touchpoint | Screen | Emotion | Pain Point | Opportunity |
|------|-----------|--------|---------|------------|-------------|
| 1 | Repetitive daily task | {{screen}} | Bored, wants efficiency | Too many clicks | Keyboard shortcuts, bulk operations |
| 2 | Needs to find old data | Search/Filters | Impatient | Search is slow or imprecise | Saved searches, recent items, smart filters |
| 3 | Customizes their view | Settings/Dashboard | Empowered | Limited customization | Saved views, column preferences, pinned items |
| 4 | Needs to collaborate | Sharing/Assignments | Practical | Can't share or delegate easily | @mentions, assign, share links |
| 5 | Encounters edge case | Error/Edge state | Annoyed | App doesn't handle this case | Graceful degradation, clear error recovery |

**Keyboard shortcuts introduced:** {{list 5-10 shortcuts that power users would want}}

**Saved views/presets:** {{list common view configurations users would save}}

---

### Phase 4: Mastery (Month 2+)

**Goal:** Push the product to its limits, create custom workflows, become an advocate.

| Step | Touchpoint | Screen | Emotion | Pain Point | Opportunity |
|------|-----------|--------|---------|------------|-------------|
| 1 | Custom dashboard | Dashboard settings | Demanding | Default dashboard doesn't fit | Customizable widgets, drag-and-drop |
| 2 | Automation/rules | Settings/Automation | Ambitious | Manual repetitive work | Rules engine, templates, auto-assignments |
| 3 | Reporting | Reports/Analytics | Analytical | Reports don't show what I need | Custom report builder, export, scheduling |
| 4 | Teaching others | N/A | Proud, mentor | Hard to explain the "right" way | Shareable workflows, team templates |
| 5 | Feature request | Feedback | Invested | Missing something specific | In-app feedback, feature request board |

**Power user features:** {{list 3-5 advanced features that distinguish mastery}}

**"What's New" mechanism:** {{how do returning users learn about new features?}}

---

### Phase 5: Error Recovery (Any Time)

**Goal:** Recover from mistakes, handle unexpected situations, maintain trust.

| Scenario | User Action | System Response | Recovery Path | Screen |
|----------|------------|-----------------|---------------|--------|
| Accidental deletion | Deletes wrong item | Soft delete + undo toast (5s) | Click "Undo" or restore from trash | {{screen}} |
| Form data loss | Browser crashes mid-form | Auto-saved draft exists | Show "Resume draft?" on next visit | {{screen}} |
| Wrong submission | Submits incorrect data | Submission recorded | Edit after submit (within time window) | {{screen}} |
| Network failure | Action fails due to offline | Queue action, show offline indicator | Auto-retry when online, show sync status | {{screen}} |
| Permission error | Tries restricted action | 403 with explanation | Show who to contact, request access link | {{screen}} |
| Session expired | Returns after long idle | Redirect to login, preserve state | Return to exact page after re-login | Login → previous |

---

### Journey Gaps Found

| Gap | Phase | Impact | Resolution |
|-----|-------|--------|------------|
| {{gap description}} | {{phase #}} | {{High/Medium/Low}} | ☐ Create screen spec / ☐ Add to existing screen / ☐ Defer to post-MVP |

---

> **Repeat this entire template for each persona.**

---

## Cross-Reference Verification

After completing all journey maps:

- [ ] Every screen referenced in a journey map exists in the screen catalog
- [ ] Every persona has all 5 phases documented
- [ ] Every phase has at least 3 specific interaction descriptions
- [ ] Onboarding tour defined for every persona
- [ ] Empty state strategy defined for every persona's first view
- [ ] Error recovery covers at least 5 scenarios per persona
- [ ] "What's New" mechanism defined for the product

## Summary

| Persona | Phases Complete | Screens Referenced | Gaps Found | Gaps Resolved |
|---------|----------------|-------------------|------------|---------------|
| {{persona_1}} | {{5/5}} | {{N}} | {{N}} | {{N}} |
| {{persona_2}} | {{5/5}} | {{N}} | {{N}} | {{N}} |
