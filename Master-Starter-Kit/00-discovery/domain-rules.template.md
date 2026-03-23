# Domain Rules & Business Logic

> Capture every business rule, state machine, formula, validation, and edge case before writing a single line of code.
> This document is the "constitution" of your app — when a developer asks "what should happen when X?", the answer lives here.

---

## Why This Matters

Business logic bugs are 10x harder to fix than UI bugs because they affect data integrity. A wrong CSS color is a 1-minute fix. A wrong state transition that corrupts 500 records takes days to unwind. Capturing domain rules upfront prevents:

- "What should happen when..." questions during development
- Inconsistent behavior across different parts of the app
- Edge cases discovered in production instead of during design
- Developers making assumptions that contradict business intent

---

## How to Discover Domain Rules

### Method 1: Interview Domain Experts
Ask the people who currently do this work manually:
- "Walk me through a typical day. What do you do first?"
- "What are the most common things that go wrong?"
- "What rules do you keep in your head that aren't written down?"
- "What happens when [exception]? How do you handle it?"

### Method 2: Trace Workflows End-to-End
For each major workflow, trace every step from trigger to completion:
1. What triggers this workflow? (User action, schedule, external event)
2. What data is needed at each step?
3. What validations must pass?
4. What state changes occur?
5. What notifications are sent?
6. What happens if it fails at step N?

### Method 3: Identify State Machines
Every major entity in your app has states. Find them:
- What states can a {{ENTITY}} be in?
- What transitions are valid? (Which state can go to which?)
- What triggers each transition? (User action, time, external event)
- What side effects occur on transition? (Notifications, calculations, audit logs)

### Method 4: Ask "What If" Questions
For every rule, ask the adversarial version:
- What if the user does this twice?
- What if the user does this out of order?
- What if the data is missing?
- What if the external service is down?
- What if two users do this at the same time?

---

## Entity: {{ENTITY_1_NAME}}

### State Machine

```
                        ┌─────────────┐
                        │   {STATE_1} │
                        └──────┬──────┘
                               │ {TRIGGER_1}
                               ▼
                        ┌─────────────┐
              ┌────────►│   {STATE_2} │◄────────┐
              │         └──────┬──────┘         │
              │                │ {TRIGGER_2}    │ {TRIGGER_REVERT}
              │                ▼                │
              │         ┌─────────────┐         │
              │         │   {STATE_3} ├─────────┘
              │         └──────┬──────┘
              │                │ {TRIGGER_3}
              │                ▼
              │         ┌─────────────┐
              │         │   {STATE_4} │ (terminal)
              │         └─────────────┘
              │
              │         ┌─────────────┐
              └─────────│  {STATE_5}  │ (terminal — cancel path)
                        └─────────────┘
```

**States:**

| State | Description | Entry Conditions | Exit Conditions | Terminal? |
|-------|-------------|-----------------|-----------------|-----------|
| {{STATE_1}} | {{DESCRIPTION}} | {{HOW_ENTITY_ENTERS_THIS_STATE}} | {{WHAT_MUST_HAPPEN_TO_LEAVE}} | {Y/N} |
| {{STATE_2}} | {{DESCRIPTION}} | {{HOW_ENTITY_ENTERS_THIS_STATE}} | {{WHAT_MUST_HAPPEN_TO_LEAVE}} | {Y/N} |
| {{STATE_3}} | {{DESCRIPTION}} | {{HOW_ENTITY_ENTERS_THIS_STATE}} | {{WHAT_MUST_HAPPEN_TO_LEAVE}} | {Y/N} |
| {{STATE_4}} | {{DESCRIPTION}} | {{HOW_ENTITY_ENTERS_THIS_STATE}} | N/A | Yes |
| {{STATE_5}} | {{DESCRIPTION}} | {{HOW_ENTITY_ENTERS_THIS_STATE}} | N/A | Yes |

**Valid Transitions:**

| From | To | Trigger | Who Can Do It | Side Effects |
|------|----|---------|--------------|-------------|
| {{STATE_1}} | {{STATE_2}} | {ACTION/EVENT} | {ROLE(S)} | {NOTIFICATIONS, CALCULATIONS, LOGS} |
| {{STATE_2}} | {{STATE_3}} | {ACTION/EVENT} | {ROLE(S)} | {NOTIFICATIONS, CALCULATIONS, LOGS} |
| {{STATE_3}} | {{STATE_4}} | {ACTION/EVENT} | {ROLE(S)} | {NOTIFICATIONS, CALCULATIONS, LOGS} |
| {{ANY}} | {{STATE_5}} | {{CANCEL_ACTION}} | {ROLE(S)} | {{CLEANUP_ACTIONS}} |

**Invalid transitions (explicitly forbidden):**
- {{STATE_4}} cannot go back to any state (terminal)
- {{STATE_3}} cannot go back to {{STATE_1}} (skip not allowed)
- {{STATE_5}} cannot go to any state (cancelled is final)

### Business Rules

| Rule ID | Rule | Formula/Logic | Validation | Error Message |
|---------|------|--------------|------------|---------------|
| {{E1}}-R01 | {{RULE_DESCRIPTION}} | {{FORMULA_OR_LOGIC}} | {{WHAT_TO_CHECK}} | {USER-FACING_ERROR} |
| {{E1}}-R02 | {{RULE_DESCRIPTION}} | {{FORMULA_OR_LOGIC}} | {{WHAT_TO_CHECK}} | {USER-FACING_ERROR} |
| {{E1}}-R03 | {{RULE_DESCRIPTION}} | {{FORMULA_OR_LOGIC}} | {{WHAT_TO_CHECK}} | {USER-FACING_ERROR} |
| {{E1}}-R04 | {{RULE_DESCRIPTION}} | {{FORMULA_OR_LOGIC}} | {{WHAT_TO_CHECK}} | {USER-FACING_ERROR} |
| {{E1}}-R05 | {{RULE_DESCRIPTION}} | {{FORMULA_OR_LOGIC}} | {{WHAT_TO_CHECK}} | {USER-FACING_ERROR} |

### Compliance Notes

| Requirement | How It's Met | Implementation |
|-------------|-------------|----------------|
| {HIPAA/PCI/GDPR/SOC2} | {{HOW_THIS_ENTITY_COMPLIES}} | {{TECHNICAL_IMPLEMENTATION}} |

### Edge Cases

| Scenario | Expected Behavior | Implementation Notes |
|----------|-------------------|---------------------|
| {{EDGE_CASE_1}} | {{WHAT_SHOULD_HAPPEN}} | {{HOW_TO_IMPLEMENT}} |
| {{EDGE_CASE_2}} | {{WHAT_SHOULD_HAPPEN}} | {{HOW_TO_IMPLEMENT}} |
| {{EDGE_CASE_3}} | {{WHAT_SHOULD_HAPPEN}} | {{HOW_TO_IMPLEMENT}} |
| {{EDGE_CASE_4}} | {{WHAT_SHOULD_HAPPEN}} | {{HOW_TO_IMPLEMENT}} |

---

## Entity: {{ENTITY_2_NAME}}

*(Copy the entire section above for each major entity in your system)*

### State Machine

```
{ASCII_STATE_DIAGRAM}
```

**States:**

| State | Description | Entry Conditions | Exit Conditions | Terminal? |
|-------|-------------|-----------------|-----------------|-----------|
| | | | | |

**Valid Transitions:**

| From | To | Trigger | Who Can Do It | Side Effects |
|------|----|---------|--------------|-------------|
| | | | | |

### Business Rules

| Rule ID | Rule | Formula/Logic | Validation | Error Message |
|---------|------|--------------|------------|---------------|
| | | | | |

### Compliance Notes

| Requirement | How It's Met | Implementation |
|-------------|-------------|----------------|
| | | |

### Edge Cases

| Scenario | Expected Behavior | Implementation Notes |
|----------|-------------------|---------------------|
| | | |

---

## Entity: {{ENTITY_3_NAME}}

*(Copy the section structure again)*

---

## Global Business Rules

Rules that apply across all entities, not specific to one.

| Rule ID | Rule | Applies To | Logic | Error Message |
|---------|------|-----------|-------|---------------|
| G-R01 | {{RULE_DESCRIPTION}} | {ALL / LIST_OF_ENTITIES} | {{LOGIC}} | {{ERROR}} |
| G-R02 | {{RULE_DESCRIPTION}} | {ALL / LIST_OF_ENTITIES} | {{LOGIC}} | {{ERROR}} |
| G-R03 | {{RULE_DESCRIPTION}} | {ALL / LIST_OF_ENTITIES} | {{LOGIC}} | {{ERROR}} |

**Common global rules to consider:**
- Soft delete vs. hard delete (most entities should soft-delete)
- Audit logging (who changed what, when)
- Timezone handling (store UTC, display local)
- Currency handling (store cents as integers, never floats)
- Date range validations (end date must be after start date)
- Uniqueness constraints (email, phone, reference numbers)
- Cascading effects (deleting a parent entity — what happens to children?)

---

## Formulas & Calculations

Document every formula the system uses. These are the most bug-prone parts of any app.

| Formula ID | Name | Inputs | Formula | Example |
|------------|------|--------|---------|---------|
| F-01 | {{NAME}} | {{INPUT_1}}, {{INPUT_2}} | {{FORMULA}} | {{CONCRETE_EXAMPLE_WITH_NUMBERS}} |
| F-02 | {{NAME}} | {{INPUT_1}}, {{INPUT_2}} | {{FORMULA}} | {{CONCRETE_EXAMPLE_WITH_NUMBERS}} |
| F-03 | {{NAME}} | {{INPUT_1}}, {{INPUT_2}} | {{FORMULA}} | {{CONCRETE_EXAMPLE_WITH_NUMBERS}} |

**Rules for formulas:**
- Always include a concrete example with real numbers
- Specify rounding rules (round half-up, truncate, ceiling)
- Specify precision (2 decimal places for currency, 0 for counts)
- Document the order of operations if the formula is complex
- Note whether the formula runs on the client, server, or both (prefer server for financial calculations)

---

## Scheduled Jobs & Automated Actions

Things the system does without a user clicking a button.

| Job | Schedule | Action | Failure Behavior |
|-----|----------|--------|------------------|
| {{JOB_1}} | {{CRON_SCHEDULE}} | {{WHAT_IT_DOES}} | {{WHAT_HAPPENS_IF_IT_FAILS}} |
| {{JOB_2}} | {{CRON_SCHEDULE}} | {{WHAT_IT_DOES}} | {{WHAT_HAPPENS_IF_IT_FAILS}} |
| {{JOB_3}} | {{CRON_SCHEDULE}} | {{WHAT_IT_DOES}} | {{WHAT_HAPPENS_IF_IT_FAILS}} |

---

## Notification Rules

When does the system send notifications, to whom, via which channel?

| Trigger | Recipients | Channel | Template | Urgency |
|---------|-----------|---------|----------|---------|
| {{EVENT_1}} | {ROLE(S)} | {Email/SMS/Push/In-app} | {{TEMPLATE_NAME}} | {Immediate/Batched/Daily digest} |
| {{EVENT_2}} | {ROLE(S)} | {Email/SMS/Push/In-app} | {{TEMPLATE_NAME}} | {Immediate/Batched/Daily digest} |
| {{EVENT_3}} | {ROLE(S)} | {Email/SMS/Push/In-app} | {{TEMPLATE_NAME}} | {Immediate/Batched/Daily digest} |

---

## Domain Glossary

Define every domain-specific term so the development team uses consistent language.

| Term | Definition | Example | Don't Confuse With |
|------|-----------|---------|-------------------|
| {{TERM_1}} | {{DEFINITION}} | {{EXAMPLE}} | {{SIMILAR_TERM}} |
| {{TERM_2}} | {{DEFINITION}} | {{EXAMPLE}} | {{SIMILAR_TERM}} |
| {{TERM_3}} | {{DEFINITION}} | {{EXAMPLE}} | {{SIMILAR_TERM}} |

---

## The `/domain-rules` Command

During development, Claude can use a `/domain-rules` custom skill to:

1. **Look up a rule** — "What happens when a {{ENTITY}} transitions from {{STATE_A}} to {{STATE_B}}?"
2. **Validate implementation** — Compare code against this document to check for missing rules
3. **Add new rules** — When edge cases are discovered during development, add them here
4. **Generate tests** — For each rule, generate a unit test that verifies the rule is enforced

This document is a living artifact. Update it whenever new rules are discovered during development.

---

## Discovery Checklist

Before marking domain rules as "complete," verify:

- [ ] Every entity has a state machine documented
- [ ] Every state has entry/exit conditions defined
- [ ] Every transition has: trigger, who can do it, and side effects
- [ ] Invalid transitions are explicitly listed
- [ ] All business rules have: ID, description, formula, validation, and error message
- [ ] All formulas include concrete examples with real numbers
- [ ] Edge cases are documented for each entity (minimum 3 per entity)
- [ ] Compliance requirements are mapped to specific implementations
- [ ] Notification rules are defined for all state transitions
- [ ] Domain glossary includes all domain-specific terms
- [ ] Global rules (soft delete, audit, timezone, currency) are documented
