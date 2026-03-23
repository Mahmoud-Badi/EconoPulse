# Session Context Manifest

<!-- This file persists critical context across conversation sessions. -->
<!-- Updated at every Session Boundary (SB-1 through SB-6). Read this FIRST when resuming. -->
<!-- This is NOT a status file (that's STATUS.md). This carries forward REASONING and DECISIONS. -->

## Project Identity

- **Name:** {{PROJECT_NAME}}
- **Slug:** {{PROJECT_SLUG}}
- **Description:** {{PROJECT_DESCRIPTION}}
- **Industry:** {{INDUSTRY}}
- **Target Market:** {{TARGET_MARKET}}
- **Stack:** {{FRONTEND_FRAMEWORK}} + {{BACKEND_FRAMEWORK}} + {{DATABASE}} + {{ORM}}
- **Package Manager:** {{PKG_MANAGER}}
- **Monorepo:** {{MONOREPO}} ({{MONOREPO_TOOL}})
- **Team:** {{TEAM_SIZE}} developers, {{TIMELINE_WEEKS}} weeks
- **Scope:** {{EXPECTED_SERVICE_COUNT}} services, {{MVP_SCREENS}} screens
- **Project Type:** {{PROJECT_TYPE}}
- **Mobile:** {{HAS_MOBILE}} ({{MOBILE_FRAMEWORK}}, {{MOBILE_PLATFORMS}})

## User's Vision (in their own words)

<!-- Capture the user's EXACT language about what they want. Do not paraphrase. -->
<!-- This is the north star for all specs. When in doubt, re-read this section. -->

> [Paste the user's original description of their product here]

**What "great" looks like for this project:**
<!-- What did the user say about quality expectations? Competitor examples they admire? UX standards? -->

**What the user explicitly does NOT want:**
<!-- Capture rejections, dislikes, and anti-goals -->

## Intake Answers (All 15 Stop Gates)

<!-- Include the user's actual words, not just CONFIG values. -->
<!-- This section prevents re-asking questions on context reset. -->

| # | Stop Gate | User's Answer |
|---|-----------|---------------|
| 1 | Application type | |
| 2 | Product description | |
| 3 | Service/module count | |
| 4 | Who pays | |
| 5 | Core daily action | |
| 6 | Main entities | |
| 7 | User types + screen counts | |
| 8 | Biggest frustration per user type | |
| 9 | Deployment target | |
| 10 | Developer count | |
| 11 | MVP target date | |
| 12 | Native mobile needed | |
| 13 | Services enumerated | |
| 14 | Post-login landing per role | |
| 15 | Screen navigation tree per role | |

## Critical Decisions Log

<!-- Append-only. Every architectural or scope decision with rationale. -->
<!-- This is the most important section for context recovery. -->

| # | Decision | Rationale | Step | Rejected Alternatives |
|---|----------|-----------|------|-----------------------|

## Tribunal Verdict Summary

<!-- Max 500 words. Updated at SB-2. -->
<!-- Top 5 features by vote, top 3 deal-breakers per persona, key competitive gaps -->

## Service Architecture Summary

<!-- One line per service. Updated at SB-2. -->

| Service | Purpose | Entities | Screens | Priority | Key Constraint |
|---------|---------|----------|---------|----------|----------------|

## Screen Architecture Summary

<!-- Service-to-screen mapping. Updated at SB-3. -->

| Service | Screens | Types |
|---------|---------|-------|

## User's Concerns & Preferences

<!-- Things the user specifically flagged as important that might get lost in context compaction. -->
<!-- Styles they prefer, interactions they like, products they admire. -->

## Active Open Questions

<!-- Unresolved decisions or ambiguities that need user input in the next session. -->

## Session History

<!-- Append a row at every Session Boundary. -->

| Session | Date | Steps Completed | Key Outputs | Notes |
|---------|------|----------------|-------------|-------|
