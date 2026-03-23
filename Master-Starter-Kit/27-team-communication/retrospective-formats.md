# Retrospective Formats

> The retrospective is the only ceremony explicitly designed to improve the team's process. Skip it and the same mistakes repeat every sprint. Run it poorly and the team stops believing improvement is possible. This guide provides five complete formats with facilitation instructions so you never run a bad retro again.

---

## General Rules (Apply to All Formats)

Before choosing a format, internalize these principles:

1. **Retrospectives are blameless.** Critique processes, not people. "The deploy process failed" not "Alex broke the deploy."
2. **What is said in retro stays in retro.** Psychological safety is non-negotiable. If people fear retaliation, they will not speak honestly.
3. **Every retro produces 1-3 action items with owners.** A retro without action items is a venting session.
4. **Action items go into the next sprint as tasks.** If they are not in STATUS.md, they will not happen.
5. **Rotate the facilitator.** The same person running every retro creates a power dynamic and stale format.
6. **Timebox ruthlessly.** A 2-week sprint retro takes 60 minutes. A 1-week sprint retro takes 30-45 minutes. Respect the clock.
7. **Review last retro's action items first.** If the same issues keep appearing, the retro process itself needs fixing.

---

## Pre-Retro Checklist

Before every retrospective:

- [ ] Facilitator chosen and prepared
- [ ] Room booked or video call scheduled
- [ ] Digital whiteboard set up (Miro, FigJam, or simple shared doc)
- [ ] Last retro's action items pulled up for review
- [ ] Sprint metrics available (velocity, carry-over rate, bugs)
- [ ] Timer ready (phone timer or online timer visible to all)
- [ ] Anonymous submission option available (Google Form or sticky notes) for sensitive feedback

---

## Format 1: Start / Stop / Continue

**Complexity:** Simplest
**Best for:** New teams, first retrospective, teams new to retros
**Time:** 45-60 minutes

### The Three Categories

| Category | Prompt | Example |
|----------|--------|---------|
| **Start** | What should we START doing that we are not doing today? | Start writing tests before code. Start doing code reviews within 4 hours. |
| **Stop** | What should we STOP doing because it is not helping? | Stop having 60-minute standups. Stop merging without CI passing. |
| **Continue** | What should we CONTINUE doing because it is working? | Continue pair programming on complex tasks. Continue Friday demos. |

### Facilitation Script

**Step 1: Review last retro actions (5 min)**
> "Before we start, let us review the action items from last retro. [Read each item.] Which ones were completed? Which ones were not? For incomplete items, do we carry them forward or drop them?"

**Step 2: Silent brainstorming (5 min)**
> "Take 5 minutes to write your thoughts on sticky notes or in the shared doc. One idea per note. No talking — just write. Think about what we should Start, Stop, and Continue."

**Step 3: Share and group (10 min)**
> "Now let us go around the room. Each person shares their notes one at a time. Place them in the Start, Stop, or Continue column. If someone already said what you were thinking, put your note next to theirs — we will cluster similar items."

**Step 4: Dot vote (5 min)**
> "Everyone gets 3 votes. Place your dots on the items you think are most important to discuss. You can put all 3 on one item if you feel strongly."

**Step 5: Discuss top 3 (25 min)**
> "We will discuss the top 3 voted items, starting with the highest. For each item: What is the root cause? What would improvement look like? Who will own the action item?"

**Step 6: Commit to actions (5 min)**
> "Let us finalize our action items. Each action needs: a description, an owner, and a due date (usually next retro). I will add these to STATUS.md as sprint tasks."

**Step 7: Document (5 min)**
> "I will post the retro summary to [channel/doc]. Any final thoughts before we close?"

---

## Format 2: 4Ls (Liked, Learned, Lacked, Longed For)

**Complexity:** Moderate
**Best for:** Teams that want more nuance than Start/Stop/Continue
**Time:** 60 minutes

### The Four Categories

| Category | Prompt | Example |
|----------|--------|---------|
| **Liked** | What went well that we enjoyed? | Liked the new PR template — reviews are faster. |
| **Learned** | What did we learn (good or bad)? | Learned that our staging DB is too small for load testing. |
| **Lacked** | What was missing that we needed? | Lacked documentation for the payment API integration. |
| **Longed For** | What do we wish we had? | Longed for automated E2E tests to catch regressions. |

### Facilitation Script

**Step 1: Review last retro actions (5 min)**
Same as Format 1.

**Step 2: Silent brainstorming (7 min)**
> "Write your thoughts across all four columns. Some items might fit multiple categories — pick the one that feels most accurate. One idea per note."

**Step 3: Share and cluster (10 min)**
> "Share your notes round-robin. Group similar items. If a 'Lacked' item and a 'Longed For' item are essentially the same need, merge them."

**Step 4: Dot vote (5 min)**
> "3 votes each. Focus on items where action would have the highest impact."

**Step 5: Discuss top items (25 min)**
> "Starting with the highest-voted item. For 'Liked' items: how do we protect and reinforce this? For 'Learned' items: how do we apply this learning? For 'Lacked'/'Longed For' items: what specific action would address this?"

**Step 6: Commit to actions (5 min)**
Action items with owners and due dates.

**Step 7: Document (3 min)**
Post summary.

### When to Use 4Ls Over Start/Stop/Continue

- When the team needs to celebrate wins (the "Liked" column)
- When significant learning happened that should be captured
- When the team is feeling negative and needs a format that starts with positives
- After a particularly challenging sprint where growth occurred

---

## Format 3: Sailboat

**Complexity:** Moderate (visual)
**Best for:** Visual thinkers, teams that are bored with list-based formats, longer retrospectives
**Time:** 60-75 minutes

### The Metaphor

Draw a sailboat on a whiteboard or digital canvas:

```
                          [Island]
                         /  Goal  \
                        /  Destination\
                       /______________\

         ~~~  ~~~  ~~~  ~~~  ~~~  ~~~  ~~~

              Wind -->    ___
            (propels)    /   \___
                        /  BOAT  \
                       /___________\
                            |
                          Anchor
                        (holds back)

         ~~~  ~~~  ~~~  ~~~  ~~~  ~~~  ~~~

                        /\  /\  /\
                       / Rocks  /\
                      (risks ahead)
```

| Element | Represents | Prompt |
|---------|-----------|--------|
| **Wind** | What propels us forward | What is pushing us toward our goal? Tailwinds, strengths, momentum. |
| **Anchor** | What holds us back | What is slowing us down? Drag, friction, impediments. |
| **Rocks** | Risks ahead | What could sink us if we do not navigate carefully? Future dangers. |
| **Island** | Our goal / destination | What are we sailing toward? Sprint goal, product vision, team aspiration. |

### Facilitation Script

**Step 1: Draw the sailboat (2 min)**
Set up the visual. Remind the team what each element represents.

**Step 2: Review last retro actions (5 min)**
Same as other formats.

**Step 3: Define the island (3 min)**
> "First, let us agree on our island — our destination. For this sprint/quarter, what does success look like? [Write it on the island.]"

**Step 4: Silent brainstorming (7 min)**
> "Write sticky notes for each element. What is our wind? Our anchor? Our rocks? Place them on the visual."

**Step 5: Walk through each element (30 min)**
> "Let us start with Wind — what is working. [Read items, celebrate.] Now Anchors — what is dragging. [Read items, discuss root causes.] Now Rocks — what is ahead that worries us. [Read items, assess likelihood and impact.]"

**Step 6: Prioritize and act (10 min)**
> "Which anchors should we cut first? Which rocks need the most urgent navigation? Let us pick 2-3 action items."

**Step 7: Document (3 min)**
Post visual + action items.

---

## Format 4: Mad / Sad / Glad

**Complexity:** Simple
**Best for:** Teams with low psychological safety (emotions are less threatening than critiques), after stressful sprints, when the team needs to process feelings before problem-solving
**Time:** 45-60 minutes

### The Three Emotions

| Emotion | Prompt | Example |
|---------|--------|---------|
| **Mad** | What frustrated us this sprint? | Mad that the deploy pipeline was broken for 3 days with no ETA. |
| **Sad** | What disappointed us? | Sad that we had to cut the feature we were excited about. |
| **Glad** | What made us happy? | Glad that the new team member ramped up so quickly. |

### Facilitation Script

**Step 1: Review last retro actions (5 min)**

**Step 2: Set the tone (2 min)**
> "This format is about feelings, which might feel unusual. There are no wrong answers. If something frustrated you, that is valid. If something made you happy, share it. This is a safe space."

**Step 3: Silent brainstorming (5 min)**
> "Write your mad, sad, and glad items. Be honest. These stay in this room."

**Step 4: Share — start with Glad (15 min)**
> "Let us start with Glad. What made us happy this sprint? [Round-robin, celebrate wins.] Now Sad. What disappointed us? [Round-robin, empathize.] Now Mad. What frustrated us? [Round-robin, validate.]"

Starting with Glad builds positive energy before addressing negatives.

**Step 5: Group and prioritize (5 min)**
> "What themes emerge? Where do we have the most energy for change?"

**Step 6: Problem-solve top items (20 min)**
> "For our top 2-3 items: What is the root cause? What specific action would reduce this frustration or protect this positive?"

**Step 7: Commit to actions and document (5 min)**

### Important Notes for Mad/Sad/Glad

- The facilitator must actively prevent blame. "I am mad at the code review process" is fine. "I am mad at Dave" is not.
- If someone gets emotional, acknowledge it: "That sounds really frustrating. Thank you for sharing."
- Do NOT try to fix feelings. Acknowledge them, then move to root cause analysis.

---

## Format 5: Timeline

**Complexity:** Most detailed
**Best for:** Long sprints (3+ weeks), sprints with significant events (launches, incidents, pivots), quarterly retrospectives
**Time:** 75-90 minutes

### The Process

Create a horizontal timeline of the sprint (day by day or week by week). The team marks events, highs, and lows.

```
Day 1    Day 2    Day 3    Day 4    Day 5    Day 6    Day 7    Day 8    Day 9    Day 10
  |        |        |        |        |        |        |        |        |        |
  |  HIGH  |        |        |  LOW   |        |  HIGH  |        |  LOW   |        |  HIGH
  | Sprint |        |        | Deploy |        | Fix    |        | Scope  |        | Demo
  | kicked |        |        | broke  |        | shipped|        | changed|        | went
  | off    |        |        | staging|        | fast   |        | midway |        | great
```

### Facilitation Script

**Step 1: Draw the timeline (3 min)**
Draw a horizontal line with sprint days marked. Include known events (deploy dates, meetings, deadlines).

**Step 2: Review last retro actions (5 min)**

**Step 3: Individual timeline marking (10 min)**
> "Walk through the sprint day by day. For each day, mark: Was it a high point or a low point? What happened? Write it on a sticky note and place it on the timeline at the right day."

**Step 4: Walk through chronologically (30 min)**
> "Let us walk through the sprint from start to finish. [Read events at each point.] What was happening on Day 1? Why was Day 4 a low? What made Day 6 a recovery?"

**Step 5: Identify patterns (10 min)**
> "Look at the timeline as a whole. Do you see patterns? Do lows follow specific types of events? Do highs correlate with anything? What themes emerge?"

**Step 6: Extract actions (10 min)**
> "Based on the patterns: What would prevent the lows? What would amplify the highs? Let us commit to 2-3 specific actions."

**Step 7: Document (5 min)**
Take a photo of the timeline. Post action items.

---

## Action Item Template

Every retro action item must follow this format:

```
**Action:** [Specific, measurable action — not "improve communication" but "create a #blockers Slack channel and post blockers there within 1 hour of encountering them"]
**Owner:** [One person — not "the team"]
**Due:** [Date — usually next retro, or sooner for urgent items]
**Success Metric:** [How we know this worked]
**Sprint Task ID:** [Added to STATUS.md as a task]
```

### Good vs Bad Action Items

| Bad Action Item | Good Action Item |
|----------------|-----------------|
| "Improve code quality" | "Add ESLint rule for max function length of 50 lines by Friday" |
| "Communicate better" | "Post blockers in #blockers channel within 1 hour; team lead checks channel at 10am and 3pm daily" |
| "Write more tests" | "Every PR must include tests; add CI check that blocks merge if coverage drops below 80%" |
| "Be more careful with deploys" | "Add staging smoke test checklist (10 items) that must pass before production deploy" |
| "The team will do better" | Not an action item. Discard it. |

---

## Retro Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **Blame game** | "It is your fault we missed the deadline" | Facilitator intervenes: "Let us focus on the process, not the person. What in our process allowed this?" |
| **Same issues every sprint** | Carry-over items from retro are never completed | Make retro action items sprint tasks with the same priority as feature work |
| **No action items** | Team vents for 60 minutes, feels cathartic, changes nothing | Facilitator enforces: "We do not leave this room without 1-3 actions with owners" |
| **Skipping retros** | "We are too busy this sprint" or "Nothing to talk about" | Retro is non-negotiable. If "nothing to talk about," run a 15-min mini-retro with one question: "What is the one thing we would change?" |
| **Manager dominates** | Manager speaks first, longest, and loudest. Team agrees passively. | Manager speaks last. Or does not attend. Or facilitates (which means asking questions, not giving answers). |
| **Groupthink** | Everyone agrees on everything, no dissenting opinions | Use anonymous submission for brainstorming. Ask "What is the contrarian view?" |
| **Retro fatigue** | Team dreads retros, goes through the motions | Rotate formats. If you have been doing Start/Stop/Continue for 6 sprints, switch to Sailboat or Timeline. |
| **Action items are too big** | "Rewrite the test suite" — never gets done | Break into sprint-sized chunks: "Add tests for auth module this sprint" |

---

## Format Selection Guide

```
Is this the team's first retro?
  |
  +-- YES --> Start/Stop/Continue (simplest, lowest barrier)
  |
  +-- NO --> Has the team done 3+ retros with the same format?
              |
              +-- YES --> Switch formats to prevent fatigue:
              |           - Feeling analytical? --> 4Ls
              |           - Feeling creative? --> Sailboat
              |           - Feeling emotional? --> Mad/Sad/Glad
              |           - Long sprint or major event? --> Timeline
              |
              +-- NO --> Continue current format until it feels stale
```

---

## Remote Retro Tips

| Challenge | Solution |
|-----------|----------|
| Hard to read body language | Cameras on. Check in on energy at the start. |
| Dominant voices over quiet ones | Use written brainstorming first. Call on people by name. |
| Technical issues waste time | Test tools 5 minutes before. Have a backup (shared Google Doc). |
| Engagement drops | Keep it under 60 minutes. Use polls and reactions for voting. |
| Time zones make scheduling hard | Rotate meeting times to share the burden. Or run async retros (see below). |

### Async Retro Option

For teams that cannot meet synchronously:

1. **Day 1:** Facilitator posts the retro board (Miro, FigJam, or shared doc) with the chosen format
2. **Day 1-2:** Team members add their items asynchronously (48-hour window)
3. **Day 3:** Facilitator groups items and posts a summary with a voting form
4. **Day 3-4:** Team votes on top items (24-hour window)
5. **Day 5:** Facilitator posts action items based on votes; team confirms via emoji/comment
6. **Total elapsed time:** 5 days (but only ~20 minutes of individual effort)

---

## Retro Metrics

Track these over time to improve retro quality:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Action item completion rate | > 80% | Completed actions / total actions from last retro |
| Unique issues per retro | 5-15 | Count of distinct items raised (too few = groupthink, too many = unfocused) |
| Repeat issues | < 20% | Issues that appeared in previous retros |
| Participation rate | 100% | Team members who contributed at least 1 item |
| Team satisfaction with retro | > 7/10 | Quick poll at end of each retro |
