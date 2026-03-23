# Persona Generation

## Purpose

Personas are the Tribunal's voice of the user. Each persona represents a distinct user type — someone with a specific role, daily workflow, pain points, and feature priorities. Personas are not marketing archetypes ("Busy Bob the Manager"). They are detailed, opinionated agents that can meaningfully debate feature priorities and identify deal-breakers.

The critical function of personas in the Tribunal is **voting**. Each persona allocates exactly 10 points across the feature list, creating a quantitative signal that surfaces consensus and conflict.

## How to Identify User Types

Read `00-discovery/PROJECT-BRIEF.md` and list every distinct role. A role is distinct if it has a **meaningfully different daily workflow**. Two tests:

1. **The screen test:** Would these two roles spend most of their time on different screens? If yes, they're different personas.
2. **The priority test:** Would these two roles disagree on what the #1 most important feature is? If yes, they're different personas.

### Examples

| Product | Roles That Seem Similar | Actually Distinct? | Why? |
|---------|------------------------|--------------------|------|
| Fleet management | "Admin" and "Manager" | Maybe | If Admin does config and Manager does operations, yes |
| Healthcare scheduling | "Doctor" and "Nurse" | Yes | Completely different workflows and priorities |
| E-commerce | "Buyer" and "Browser" | No | Same workflow, different intent — model as one persona with notes |
| NEMT | "Dispatcher" and "Scheduler" | Depends | If same person, no. If scheduler plans and dispatcher executes, yes |

## Generation Process

### Step 1: List All User Types

From the PROJECT-BRIEF.md, create a list:

```
1. [Role A] — [1 sentence description]
2. [Role B] — [1 sentence description]
3. [Role C] — [1 sentence description]
...
```

### Step 2: Spawn Parallel Agents

For each user type, spawn a dedicated agent. Each agent:

- Receives the `persona.template.md` template
- Receives the PROJECT-BRIEF.md (full context)
- Receives the `features-list.md` (for vote allocation)
- Produces a complete persona document

### Agent Prompt

```
You are creating a detailed user persona for the [PROJECT NAME] Tribunal.

Your assigned role: [ROLE TITLE]
Project context: [2-3 sentences from PROJECT-BRIEF.md]

Instructions:
1. Give this persona a realistic name, background, and daily routine
2. Make their pain points emotional and specific — not "I need better tools" but
   "I dread Monday mornings because I know 6 of my 40 scheduled trips will have
   wrong addresses and I'll spend 2 hours on the phone fixing them"
3. Allocate exactly 10 feature votes across the features list below
4. Vote selfishly — prioritize what matters to YOUR daily workflow, not what's
   "objectively important"
5. Identify 2-3 deal-breakers — features without which you'd refuse to adopt
6. Be opinionated — if another persona's priority would make your life harder,
   say so in your risk concerns

Features list:
[Paste features-list.md]

Output format: Follow persona.template.md exactly
Save to: personas/[firstname-role].md (e.g., personas/maria-dispatcher.md)
```

### Step 3: Review and Validate

After all persona agents complete:

1. Check that every persona allocated exactly 10 votes (no more, no less)
2. Check that at least 2 personas disagree on at least 1 feature (no unanimous agreement means personas aren't specific enough)
3. Check that deal-breakers are testable and specific
4. Check that no two personas are essentially the same person with different names

### Step 4: Build the Priority Matrix

Compile all votes into `priority-matrix.template.md` — the cross-persona voting synthesis that feeds directly into Round 1.

## Vote Allocation Rules

- Each persona gets exactly **10 votes**
- Votes can be split any way: 5+3+2, 4+3+2+1, 2+2+2+2+1+1, etc.
- A single feature can receive at most 5 votes from one persona (to prevent one persona from putting all eggs in one basket)
- Votes of 0 are meaningful — they signal "I don't care about this feature"
- The total across all features must equal exactly 10

## What Makes a Good Persona

### Good Persona Indicators
- Has a specific daily schedule ("I start at 5:45 AM because the first pickups are at 6:30")
- Names specific tools they currently use ("I track everything in a shared Google Sheet that 4 people edit simultaneously")
- Expresses frustration with concrete consequences ("Last month a wrong address caused a 45-minute delay and the patient missed their dialysis appointment")
- Has clear switching triggers ("If your product can save me even 30 minutes per day on address verification, I'll switch from [Competitor] tomorrow")

### Bad Persona Indicators
- Generic pain points ("I need better efficiency")
- No specific workflow ("I manage things")
- Vague deal-breakers ("It needs to be reliable")
- Votes spread evenly across all features (1+1+1+1+1+1+1+1+1+1 = no real priorities)

## Output Files

```
personas/
  README.md                       # This file
  persona.template.md             # Template for each persona
  priority-matrix.template.md     # Cross-persona vote compilation
  [firstname-role].md             # e.g., maria-dispatcher.md
  [firstname-role].md             # e.g., james-driver.md
  [firstname-role].md             # e.g., sarah-billing.md
  ...
  priority-matrix.md              # Compiled vote matrix
```

## Tips

- **Run persona generation in parallel.** Each agent is independent. 5 personas can be generated simultaneously in 15-30 minutes.
- **Don't sanitize personas.** If a persona is angry, let them be angry. If they hate a feature, let them hate it. Sanitized personas produce sanitized (useless) debates.
- **Include the skeptic.** At least one persona should be resistant to adopting new software. "I've been doing this on paper for 15 years and it works fine" is a valid perspective that surfaces onboarding and migration requirements.
- **Include the power user.** At least one persona should be technically savvy and want keyboard shortcuts, bulk operations, and API access. This persona catches missing features that others won't think of.
