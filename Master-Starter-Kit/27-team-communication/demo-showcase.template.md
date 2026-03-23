# Sprint Demo & Showcase

> The sprint demo is where work becomes visible. Stakeholders see progress, the team gets feedback, and everyone aligns on what "done" actually looks like. A demo without structure wastes everyone's time. A demo without feedback capture wastes the feedback. This template ensures neither happens.

---

## Sprint {{SPRINT_NUMBER}} Demo

**Project:** {{PROJECT_NAME}}
**Date:** {{DATE}}
**Sprint Goal:** {{SPRINT_GOAL}} -- Result: ✅ Achieved / ⚠️ Partially / ❌ Missed
**Sprint Duration:** {{SPRINT_DURATION}}
**Presenter(s):** [name(s)]
**Audience:** [team, stakeholders, clients — list attendees]

---

### Sprint Summary

| Metric | Planned | Actual |
|--------|---------|--------|
| Story points committed | {{PLANNED_POINTS}} | {{COMPLETED_POINTS}} |
| Tasks committed | | |
| Tasks completed | | |
| Carry-over items | | |
| Velocity | | {{VELOCITY}}% |

**One-line summary:** [What the team shipped this sprint in plain language a non-developer can understand]

---

### Features Demonstrated

| # | Feature | Demo'd By | Status | Environment | Duration |
|---|---------|-----------|--------|-------------|----------|
| 1 | | | Live / Staging / Mockup | | 5 min |
| 2 | | | Live / Staging / Mockup | | 5 min |
| 3 | | | Live / Staging / Mockup | | 3 min |
| 4 | | | Live / Staging / Mockup | | 3 min |
| 5 | | | Live / Staging / Mockup | | 2 min |

**Total demo time:** [sum] minutes (target: 20-30 minutes for a 2-week sprint)

---

### Demo Script

For each feature, follow this structure:

#### Feature 1: [Name]

**What it is:** [1-2 sentences describing the feature in user terms, not technical terms]

**Why it matters:** [Business value — why a user or stakeholder should care]

**Demo steps:**
1. [Starting state — where does the demo begin?]
2. [Action — what does the presenter click/type/do?]
3. [Result — what happens? What should the audience notice?]
4. [Edge case — optional: show how it handles errors or unusual input]

**What is NOT included yet:** [Scope boundaries — what this does not do yet, and when it will]

#### Feature 2: [Name]

**What it is:**

**Why it matters:**

**Demo steps:**
1.
2.
3.

**What is NOT included yet:**

#### Feature 3: [Name]

**What it is:**

**Why it matters:**

**Demo steps:**
1.
2.
3.

**What is NOT included yet:**

---

### Key Metrics This Sprint

| Metric | Last Sprint | This Sprint | Trend | Notes |
|--------|------------|-------------|-------|-------|
| Tasks completed | | | ↑ ↓ → | |
| Bugs fixed | | | ↑ ↓ → | |
| Bugs introduced | | | ↑ ↓ → | Lower is better |
| Test coverage | | | ↑ ↓ → | |
| Build time | | | ↑ ↓ → | Lower is better |
| Deploy frequency | | | ↑ ↓ → | |
| P0/P1 issues open | | | ↑ ↓ → | Lower is better |
| User-facing uptime | | | ↑ ↓ → | |

---

### Technical Improvements (Not Demoed but Worth Noting)

Not everything is demo-able. Acknowledge technical work that improved the codebase:

| Improvement | Impact | Visible To Users? |
|------------|--------|-------------------|
| [e.g., Migrated to faster DB queries] | [Page load 40% faster] | Indirectly — better performance |
| [e.g., Added CI/CD pipeline] | [Deploys in 5 min instead of 30] | No — developer productivity |
| [e.g., Refactored auth module] | [Easier to add SSO next sprint] | No — reduces future development time |

---

### Known Issues / Caveats

Issues the audience should be aware of:

- [ ] [Issue description — and workaround if any]
- [ ] [Issue description — expected fix date]
- [ ] [Issue description — accepted risk with rationale]

---

### Feedback Captured

Capture feedback during the demo in real-time. Assign someone (not the presenter) to take notes.

| # | Feedback | From | Category | Priority | Action |
|---|----------|------|----------|----------|--------|
| 1 | | | Feature Request / Bug / UX / Question | High / Med / Low | |
| 2 | | | Feature Request / Bug / UX / Question | High / Med / Low | |
| 3 | | | Feature Request / Bug / UX / Question | High / Med / Low | |
| 4 | | | Feature Request / Bug / UX / Question | High / Med / Low | |
| 5 | | | Feature Request / Bug / UX / Question | High / Med / Low | |

**Feedback processing:**
- High priority items: Add to next sprint planning as candidates
- Medium priority items: Add to backlog, groom within 1 week
- Low priority items: Add to backlog, groom during next backlog refinement
- Questions: Answer within 24 hours via email/Slack, document in FAQ

---

### Next Sprint Preview

**Sprint {{SPRINT_NUMBER}} + 1 Goal:** [One sentence describing next sprint's focus]

**Planned highlights:**
1. [Feature or milestone expected next sprint]
2. [Feature or milestone expected next sprint]
3. [Feature or milestone expected next sprint]

**Key dependencies or risks for next sprint:**
- [Dependency or risk that stakeholders should know about]

---

## Demo Environment Checklist

Prepare the demo environment before the meeting. Nothing kills confidence like a broken demo.

### Pre-Demo Setup (Complete 1 Hour Before Demo)

- [ ] Demo environment is running and accessible (staging, localhost, deployed URL)
- [ ] Test accounts created with appropriate data
  - [ ] Account 1: [purpose, credentials]
  - [ ] Account 2: [purpose, credentials]
- [ ] Seed data loaded (realistic data, not "test123" or "asdf")
- [ ] No embarrassing test data visible (no "John Doe," "foo@bar.com," or placeholder images)
- [ ] Browser bookmarks set up for quick navigation between demo points
- [ ] Browser cleaned (no embarrassing tabs, bookmarks bar hidden if messy)
- [ ] Notifications silenced (Slack, email, OS notifications — all off)
- [ ] Screen resolution appropriate for projector/screen share (increase font size if needed)
- [ ] Demo script printed or on a separate device (not on the screen you are sharing)
- [ ] Backup plan ready: screenshots or recording in case live demo fails

### During Demo

- [ ] Screen sharing started and verified (ask "Can everyone see my screen?")
- [ ] Recording started (if recording for async viewers)
- [ ] Note-taker assigned (not the presenter)
- [ ] Timer visible to presenter (keep each feature within allotted time)

### Post-Demo

- [ ] Recording saved and shared (if applicable)
- [ ] Feedback notes cleaned up and posted to team channel within 1 hour
- [ ] High-priority feedback items added to backlog within 24 hours
- [ ] Thank-you message sent to stakeholders who attended

---

## Demo for Async / Remote Teams

If stakeholders cannot attend live, provide an async demo:

### Recording Guide

1. **Tool:** Loom (free), OBS Studio (free), or screen recording built into OS
2. **Format:** Screen recording with voiceover narration
3. **Length:** 10-15 minutes maximum (shorter than live demos — no Q&A padding)
4. **Structure:**
   - 0:00-1:00 — Sprint goal and summary
   - 1:00-10:00 — Feature demos (same script as live)
   - 10:00-12:00 — Metrics and technical improvements
   - 12:00-13:00 — Known issues and next sprint preview
5. **Share:** Post recording link + written summary in stakeholder channel
6. **Feedback:** Ask stakeholders to comment on the recording or respond via a shared doc within 48 hours

### Written Demo Summary (Email-Friendly)

```
Subject: Sprint [NUMBER] Demo — [PROJECT_NAME]

Hi [stakeholders],

Sprint [NUMBER] is complete. Here is what we shipped:

**Sprint Goal:** [goal] — [achieved/partially/missed]

**Key Features:**
1. [Feature name] — [one sentence description]. [Link to staging/video]
2. [Feature name] — [one sentence description]. [Link to staging/video]
3. [Feature name] — [one sentence description]. [Link to staging/video]

**Metrics:** [velocity]% velocity, [X] tasks completed, [Y] bugs fixed

**Known Issues:** [brief list or "none"]

**Next Sprint:** [one sentence preview]

Full demo recording: [link]
Feedback form: [link]

Thanks,
[team]
```

---

## Demo Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **No preparation** | Presenter fumbles, demo breaks, audience loses confidence | Use the demo environment checklist. Do a dry run 1 hour before. |
| **Technical jargon** | Stakeholders nod but do not understand | Describe features in user terms: "Users can now reset their password" not "We implemented the SMTP integration for token-based password reset flow." |
| **Showing unfinished work** | "This does not work yet, but imagine..." | Only demo what works. Mention planned features verbally without showing broken UI. |
| **No feedback capture** | Great feedback given verbally, lost forever | Assign a note-taker. Use the feedback table. |
| **Demo runs too long** | Audience checks out after 30 minutes | Timebox each feature. Cut less important demos. Target 20-30 minutes total. |
| **Only happy path** | Everything works perfectly in demo, fails in production | Show at least one error case or edge case per feature to build trust. |
| **Skipping the demo** | "We will just show it next sprint" | Demo every sprint. Even if it is small. Visibility builds trust and momentum. |

---

## Sprint Demo Metrics

Track demo effectiveness over time:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Demo attendance | > 80% of invited stakeholders | Headcount / invited count |
| Feedback items captured | 3-10 per demo | Count from feedback table |
| Action items from feedback | > 50% of feedback items | Items that become backlog tasks |
| Demo duration | 20-30 min (2-week sprint) | Timer |
| Sprint goal reported as achieved | > 80% of sprints | Goal result field |
