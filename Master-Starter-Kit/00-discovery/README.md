# Phase 0: Discovery & Project Intake

> **This is the first thing Claude does on any new project.**
> Before a single line of code is written, before architecture decisions are made, before documentation is generated — Claude conducts a structured interview with the user to deeply understand what they are building and why.

## Purpose

Phase 0 transforms a vague idea ("I want to build a TMS") into a precise, actionable project brief that drives every subsequent phase. The output is a complete **PROJECT-BRIEF.md** that becomes the single source of truth for the entire project.

## How It Works

### Step 1: Interactive Interview (15-30 minutes)

Claude walks the user through 25 structured questions organized in 5 categories:

| Category | Questions | Focus |
|----------|-----------|-------|
| **A: Core Concept** | 5 questions | What it does, who it's for, why it matters |
| **B: Users** | 6 questions | User types, workflows, frustrations, platforms |
| **C: Tech Preferences** | 6 questions | Stack choices, real-time, storage, integrations |
| **D: Scale & Deployment** | 4 questions | Hosting, database, compliance, multi-tenancy |
| **E: Timeline & Team** | 4 questions | Team size, deadlines, QA strategy |

### Step 2: Stop Gates

Questions marked with an asterisk (*) are **stop gates** — Claude must get answers to ALL starred questions before producing the brief. These are the non-negotiable inputs:

- **A1***: What does this product do?
- **A2***: Who is the paying customer?
- **A3***: What is the ONE thing users do every day?
- **B1***: List every user type
- **B2***: Biggest frustration per user type
- **D1***: Deployment target
- **E1***: How many developers?
- **E2***: Target MVP date?

If the user says "I don't know" to a non-starred question, Claude applies the **smart default** listed in the question bank and moves on.

### Step 3: Brief Generation

Once all stop gates are cleared, Claude generates a complete PROJECT-BRIEF.md using the template in this folder. The brief is reviewed with the user for accuracy before Phase 1 begins.

## Files in This Folder

| File | Purpose |
|------|---------|
| `README.md` | This file — phase orchestrator and instructions |
| `intake-questions.md` | The 25 structured interview questions with smart defaults |
| `project-brief.template.md` | Output template Claude fills after the interview |
| `user-roles.template.md` | Role definition matrix for RBAC planning |
| `domain-rules.template.md` | Business logic capture (state machines, rules, edge cases) |
| `features-list.template.md` | Feature inventory with priority and phase assignment |
| `integrations-map.template.md` | Third-party service catalog with mock strategies |
| `data-sensitivity.template.md` | Compliance classification for every data type |

## Claude's Interview Protocol

When conducting the intake interview, Claude should follow these rules:

1. **Ask one category at a time.** Don't dump all 25 questions at once. Start with Category A, confirm answers, then move to B, etc.

2. **Be conversational, not robotic.** Adapt follow-up questions based on answers. If the user says "It's a healthcare app," immediately note HIPAA in your mental model before they even get to compliance questions.

3. **Fill smart defaults silently for non-starred questions.** If the user says "I don't know" or "whatever you recommend" for a non-starred question, use the smart default and note it in the brief as "(default — confirm later)".

4. **Never skip stop gates.** If the user tries to rush past a starred question, explain why it matters and ask again. A vague answer to a stop gate is worse than no answer.

5. **Summarize after each category.** Before moving to the next category, read back what you captured. "So to confirm: your product is X, the paying customer is Y, and the core daily action is Z. Correct?"

6. **Generate the brief only when ready.** After all 5 categories are complete and all 8 stop gates are answered, generate the PROJECT-BRIEF.md and present it for review.

7. **Capture the unexpected.** If the user mentions something that doesn't fit any question (a regulatory concern, a competitor feature, a technical constraint), capture it in the "Tribunal Notes" section of the brief.

## After Discovery

Once PROJECT-BRIEF.md is approved, the project moves to:

- **01-research/** — Competitor analysis, persona development, feature deep-dives
- **02-architecture/** — Technical architecture, database schema, API design
- **03-documentation/** — Full documentation suite generation

## Estimated Time

| Activity | Time |
|----------|------|
| Interactive Q&A | 15-30 minutes |
| Brief generation | 2-3 minutes |
| User review & revision | 5-10 minutes |
| **Total** | **~30-45 minutes** |

This is the most important 30 minutes of the entire project. Every hour spent here saves 10 hours of rework later.
