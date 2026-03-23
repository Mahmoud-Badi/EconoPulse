# Persona-to-User Validation Protocol

> **Purpose:** After the tribunal creates personas, find real humans who match them and verify the personas are accurate. A persona that doesn't match reality produces a spec that nobody wants. This protocol bridges the gap between imagined users and actual users.
> **When to use:** After tribunal is complete (Step 2), before architecture begins (Step 3). This is a checkpoint, not a phase — it takes 4-6 hours total and saves weeks of building for the wrong user.
> **Time investment:** 30 minutes per persona interview (10 questions), plus 1 hour for synthesis. For 3-4 personas = 4-6 hours.
> **ROI justification:** See Section 7.

---

## 1. Finding Real People for Each Persona

For every persona the tribunal created, find 1-2 real humans who match. Not hypothetical — actual people you can talk to.

**Where to find them:**

| Persona Type | Where to Find Matches |
|-------------|----------------------|
| Internal operations user (dispatcher, admin) | Current employees. Ask the product owner: "Who does {{PERSONA_ROLE}} today?" |
| End customer / consumer | Existing customer base. If pre-launch, use LinkedIn, Reddit communities, or the product owner's network. |
| External partner (vendor, driver, supplier) | Current business partners. Ask: "Who is your most experienced {{PARTNER_TYPE}}?" |
| Power user / technical user | Beta testers, early adopters, people who complain the most about current tools (they care enough to complain). |
| Decision maker / buyer | Existing clients who purchased. If pre-launch, use LinkedIn outreach to people with the right job title. |

**Minimum viable validation:**
- 1 real person per persona = good
- 2 real people per persona = great
- 0 real people for a persona = RED FLAG — if you can't find anyone matching this persona, the persona may be fictional

**Recruitment script:**

```
Hi {{NAME}},

We're building a {{PRODUCT_TYPE}} and we've created a profile of someone in your role
to make sure we design it right. I'd love 30 minutes of your time to check if our
profile matches your reality.

This isn't a sales call — I genuinely need your expertise to avoid building the wrong thing.
I'll share what we've assumed about your workflow and you tell me where we're right and wrong.

Would {{DATE_OPTION_1}} or {{DATE_OPTION_2}} work for a quick call?
```

---

## 2. 30-Minute Validation Interview Guide

### Setup (2 minutes)

```
Thanks for your time. Here's what we're doing:

We've created a profile of someone in your role — a {{PERSONA_NAME}} who {{PERSONA_ONE_SENTENCE}}.
I'm going to describe what we think your daily work looks like, and I need you to tell me
where we got it right and where we got it wrong.

There are no right or wrong answers. If we're wrong about something, that's the most
valuable thing you can tell me.
```

### The 10 Questions

---

**Q1: Daily Workflow**

"We think your typical day looks like this: {{PERSONA_DAILY_WORKFLOW_FROM_TRIBUNAL}}. How close is that to reality? Walk me through what you actually do from when you start work to when you finish."

**What to listen for:**
- Steps they do that we didn't include (missing features)
- Steps we included that they don't actually do (phantom features)
- Order of operations — our assumed sequence vs. their real sequence
- Time spent on each activity — our estimates vs. reality

---

**Q2: Pain Points**

"We identified these as your biggest frustrations: {{PERSONA_PAIN_POINTS_FROM_TRIBUNAL}}. Do those resonate? What did we miss? What's the thing that makes you want to throw your computer out the window?"

**What to listen for:**
- Pain points we nailed (validates persona)
- Pain points we missed (enriches persona)
- Pain points we listed that they don't actually care about (persona inflation)
- Emotional intensity — mild annoyance vs. genuine hatred

---

**Q3: Current Tools**

"What tools do you currently use to do your job? Software, spreadsheets, paper, phone — everything."

**What to listen for:**
- Tools we didn't know about (integration opportunities or competition)
- Workarounds and hacks (features the current tools lack)
- Tools they love (design patterns to emulate)
- Tools they hate (anti-patterns to avoid)

---

**Q4: Tool Switching Triggers**

"Have you ever switched from one tool to another for this kind of work? What made you switch? What would make you switch again?"

**What to listen for:**
- Switching triggers = our acquisition strategy
- Switching barriers = our retention risks
- What they looked for when evaluating tools = our feature priority
- What made them stay with a bad tool = inertia we need to overcome

---

**Q5: Decision Factors**

"If you were evaluating a new {{PRODUCT_TYPE}} tomorrow, what are the top 3 things you'd look for? What would make you say 'no' in the first 5 minutes?"

**What to listen for:**
- Their top 3 vs. our assumed top 3 (priority alignment)
- Instant deal-breakers (must-have features we might have deprioritized)
- Surprising factors ("I'd look at the mobile app first" when we assumed desktop-first)

---

**Q6: Feature Reaction**

"Here are the features we're planning to build: {{TOP_5_FEATURES_FOR_THIS_PERSONA}}. For each one, tell me: must-have, nice-to-have, or don't care."

**What to listen for:**
- "Must-have" on something we planned for Phase 3 (needs to move up)
- "Don't care" on something we planned for Phase 1 (can move down or cut)
- Features they expected to see that aren't on the list
- Confusion about what a feature does (naming/description problem)

---

**Q7: Deal-Breakers**

"What would absolutely prevent you from using a product like this? Not 'would be annoying' — what would make you refuse to use it entirely?"

**What to listen for:**
- Deal-breakers that match our persona's deal-breakers (validates tribunal)
- Deal-breakers we didn't anticipate (critical gaps)
- Deal-breakers that contradict another persona's must-have (conflict that needs resolution)

---

**Q8: Workflow Exceptions**

"Think about the weirdest, most unusual situation you've had to handle in the last month. Something that broke your normal workflow. What was it and how did you handle it?"

**What to listen for:**
- Edge cases the persona didn't account for
- Error recovery patterns (how they fix things when they go wrong)
- Frequency of exceptions (rare = handle gracefully, frequent = needs a dedicated flow)
- Manual overrides they need that an automated system might remove

---

**Q9: Collaboration**

"Who else do you interact with during your work? Who gives you information? Who do you give information to? How?"

**What to listen for:**
- Handoff points between personas (integration surfaces)
- Communication tools (email, Slack, phone, in-person)
- Information bottlenecks (one person everyone depends on)
- Informal processes ("I just text the driver" — is this a feature or an anti-pattern?)

---

**Q10: Open Floor**

"Is there anything about your job that you think we'd get wrong if we designed a tool without talking to someone like you?"

**What to listen for:**
- The thing they've been wanting to say but no question prompted
- Domain knowledge that only comes from experience
- Political or cultural factors ("management will never let us use a tool that shows our error rates")
- Emotional needs ("I just need to feel like I'm in control, not the software")

---

## 3. Delta Documentation

After each interview, document where the persona diverges from the real person.

```markdown
## Persona Validation: {{PERSONA_NAME}} vs. {{REAL_PERSON_NAME}}

**Interview Date:** {{DATE}}
**Persona Source:** Tribunal Round {{N}}
**Real Person:** {{NAME}}, {{ACTUAL_ROLE}}, {{COMPANY_OR_CONTEXT}}
**Interview Duration:** {{MINUTES}} minutes

### Accuracy Score: {{N}}/10

| Aspect | Persona Said | Reality | Match? |
|--------|-------------|---------|--------|
| Daily workflow | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |
| Top pain point | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |
| Tools used | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |
| Decision factors | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |
| Deal-breakers | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |
| Feature priorities | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |
| Collaboration pattern | {{PERSONA_VERSION}} | {{REAL_VERSION}} | {{MATCH | PARTIAL | MISMATCH}} |

### Key Deltas

| # | What We Got Wrong | What's Actually True | Impact on Product |
|---|-------------------|---------------------|-------------------|
| 1 | {{PERSONA_ASSUMPTION}} | {{REALITY}} | {{WHAT_CHANGES}} |
| 2 | {{PERSONA_ASSUMPTION}} | {{REALITY}} | {{WHAT_CHANGES}} |
| 3 | {{PERSONA_ASSUMPTION}} | {{REALITY}} | {{WHAT_CHANGES}} |

### Surprises (Things We Didn't Even Think to Ask About)
- {{SURPRISE_1}}
- {{SURPRISE_2}}

### Quotes Worth Preserving
- "{{DIRECT_QUOTE}}" — re: {{TOPIC}}
- "{{DIRECT_QUOTE}}" — re: {{TOPIC}}
```

---

## 4. Persona Update Protocol

After all validation interviews are complete, decide which personas need updating.

### Decision Framework

| Accuracy Score | Action |
|---------------|--------|
| 9-10/10 | No changes needed. Persona is validated. Mark as VALIDATED. |
| 7-8/10 | Minor updates. Add missing details, adjust priorities. Mark as VALIDATED WITH EDITS. |
| 4-6/10 | Significant updates. Rewrite affected sections. May need to re-evaluate features prioritized for this persona. Mark as REVISED. |
| 1-3/10 | Persona is wrong. Major rewrite or replacement. Features built for this persona need re-evaluation. Mark as INVALIDATED — REBUILT. |

### Update Process

1. Update the persona document in `01-tribunal/personas/{{PERSONA}}.md`
2. Add a "Validated On" date and "Validation Source" to the persona header
3. If feature priorities changed, update the verdict (`dev_docs/specs/verdict.md`)
4. If deal-breakers changed, check the conflict log for affected resolutions
5. File a discovery delta for any insight that changes the plan (see `discovery-delta.template.md`)

### What to Update in the Persona

```markdown
## Validation Status

**Status:** {{VALIDATED | VALIDATED_WITH_EDITS | REVISED | INVALIDATED_REBUILT}}
**Validated Against:** {{REAL_PERSON_NAME_1}}, {{REAL_PERSON_NAME_2}}
**Validation Date:** {{DATE}}
**Accuracy Score:** {{SCORE}}/10
**Key Changes from Validation:**
- {{CHANGE_1}}
- {{CHANGE_2}}
```

---

## 5. Quick Validation Option (5-Minute Survey)

When a 30-minute interview isn't possible, use this stripped-down survey. Less thorough, but better than zero validation.

**Send via email, Slack, or Google Form:**

```markdown
## Quick Persona Check — {{PERSONA_ROLE}}

We're building a {{PRODUCT_TYPE}} and want to make sure we understand your role.
5 questions, 5 minutes. Your answers directly shape what we build.

1. In one sentence, what is the most important thing you do at work every day?
   {{FREE_TEXT}}

2. What is your #1 frustration with your current tools or workflow?
   {{FREE_TEXT}}

3. If a new tool could do ONE thing perfectly for you, what would that be?
   {{FREE_TEXT}}

4. What would make you refuse to use a new tool? (Select all that apply)
   [ ] Too slow
   [ ] Too complicated
   [ ] Missing a critical feature (which one? ______)
   [ ] Can't access on mobile
   [ ] No offline mode
   [ ] Too expensive
   [ ] Other: ______

5. Rate these features for your work (Must-Have / Nice-to-Have / Don't Care):
   - {{FEATURE_1}}: ___
   - {{FEATURE_2}}: ___
   - {{FEATURE_3}}: ___
   - {{FEATURE_4}}: ___
   - {{FEATURE_5}}: ___
```

**Scoring quick validation:** If survey responses broadly match the persona, mark as PARTIALLY VALIDATED. If they contradict key persona attributes, escalate to a full interview.

---

## 6. Synthesis: Validation Summary

After all interviews, create a summary document.

```markdown
# Persona Validation Summary: {{PROJECT_NAME}}

**Date:** {{DATE}}
**Personas Validated:** {{COUNT}} of {{TOTAL_PERSONAS}}
**Real People Interviewed:** {{COUNT}}
**Method:** {{FULL_INTERVIEW | QUICK_SURVEY | MIX}}

## Results

| Persona | Validated Against | Score | Status | Key Delta |
|---------|------------------|-------|--------|-----------|
| {{PERSONA_1}} | {{NAME_1}}, {{NAME_2}} | {{N}}/10 | {{STATUS}} | {{ONE_LINE_SUMMARY}} |
| {{PERSONA_2}} | {{NAME_3}} | {{N}}/10 | {{STATUS}} | {{ONE_LINE_SUMMARY}} |
| {{PERSONA_3}} | (no match found) | N/A | UNVALIDATED | RED FLAG — persona may be fictional |

## Plan Changes Triggered
- {{CHANGE_1 — REFERENCE_DELTA_ID_IF_FILED}}
- {{CHANGE_2}}

## Unvalidated Personas — Risk Assessment
| Persona | Why No Match Found | Risk | Mitigation |
|---------|-------------------|------|------------|
| {{PERSONA}} | {{REASON}} | {{RISK}} | {{MITIGATION}} |
```

---

## 7. ROI Justification

Why spend 4-6 hours on persona validation when you could be building?

**The math:**

| Scenario | Cost |
|----------|------|
| 4-6 hours of validation interviews | ~$300-600 in team time |
| 1 sprint (2 weeks) building features for a wrong persona | ~$10,000-30,000 in dev time |
| Discovering the persona is wrong after 3 sprints | ~$30,000-90,000 in wasted dev time + rework |
| Shipping to production and discovering low adoption | ~$50,000-200,000 in dev time + opportunity cost + user trust damage |

**The pattern:**

Every project that skipped persona validation and later discovered a persona mismatch followed the same trajectory:

1. **Sprint 1-3:** Build confidently based on tribunal personas
2. **Sprint 4-5:** Early user feedback reveals something is off — "users aren't using Feature X the way we expected"
3. **Sprint 6-8:** Rework begins — redesign Feature X based on how users actually behave
4. **Sprint 9+:** More rework cascades — Feature Y depended on Feature X's original design

The 4-6 hours of validation compresses this entire cycle into a single pre-development checkpoint.

**When to skip validation (rarely):**
- The product owner IS the persona (they do the job daily — they are the real user)
- You have usage analytics from a previous version of the product
- The personas are based on actual customer interviews conducted during discovery (not assumed)

Even in these cases, a quick 5-minute survey to a second person is worthwhile insurance.
