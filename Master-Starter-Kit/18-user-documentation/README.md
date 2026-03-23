# User Documentation System

End-user facing documentation infrastructure for {{PROJECT_NAME}}. This system generates guides, FAQs, tutorials, troubleshooting articles, and in-app help content that your application's users see — not developer documentation.

---

## Philosophy

**"Write docs when context exists, add visuals when UI exists."**

The AI builder has perfect knowledge of a feature the moment it finishes building it. That knowledge is lost after compacting, context resets, or session boundaries. The text content of documentation must be captured **immediately after building**, while the AI still has full context. Screenshots and visual guides are added later, after the design phase is complete.

---

## Two-Layer System

### Content Layer (captured at build time)

After completing any feature task, the AI invokes `/document-feature` to generate:
- Feature guide with step-by-step instructions
- FAQ entries for common questions
- Troubleshooting entries for error states
- Changelog entry
- In-app help content (JSON)
- Screenshot **placeholders** with exact capture instructions

### Visual Layer (captured after design phase)

After the design/UI phase is complete, the AI runs `/capture-screenshots` to:
- Read all `<!-- SCREENSHOT_PENDING -->` markers across doc files
- Capture screenshots via Playwright (web) or simulator/emulator (mobile)
- Replace placeholders with actual images
- Generate a capture report

If the UI isn't ready, the placeholders stay — they are a clear record of what's still needed.

---

## Three Enforcement Layers

### Layer 1: Task-Level Acceptance Criteria

Every feature task includes a "User Documentation" layer in its acceptance criteria. The task is NOT complete until the user-facing docs are written. This is baked into:
- `04-phase-planning/task-decomposition-rules.md` — Layer 8
- `08-quality-testing/feature-completion-checklist.md` — Layer 6

### Layer 2: Post-Feature Skill

The `/document-feature` skill is invoked after completing any feature. The kickoff skill's "After Coding" section mandates this step (step 1.5, before commit).

### Layer 3: Phase-End Quality Gate

The `/doc-quality-gate` command runs at the end of each phase. It checks:
- Coverage: every feature has documentation
- Completeness: all required sections filled
- Screenshots: placeholders exist (even if not yet captured)
- Blocks phase transition if coverage < 90%

---

## Output Structure

When the documentation system runs, it generates files in `{{USER_DOCS_PATH}}/`:

```text
user_docs/
├── guides/                    # Per-feature user guides
│   └── mobile/                # Mobile-only feature guides (if HAS_MOBILE)
├── faq/                       # FAQ entries by category
├── getting-started/           # Role-based onboarding guides
├── tutorials/                 # Multi-feature workflow tutorials
├── troubleshooting/           # Problem → solution articles
├── changelog.md               # Release notes (auto-appended)
├── in-app/                    # In-app help JSON files (web)
│   └── mobile/                # Mobile in-app help (coach marks, bottom sheets)
├── screenshots/
│   ├── web/                   # Web screenshots (Playwright)
│   ├── ios/                   # iOS screenshots (Simulator)
│   ├── android/               # Android screenshots (Emulator)
│   └── store/                 # App Store / Play Store submission screenshots
│       ├── ios/
│       └── android/
├── store-listing/             # App Store / Play Store listing content (if HAS_MOBILE)
└── DOC-INDEX.md               # Documentation coverage tracker
```

---

## Folder Contents

| Subfolder | Purpose |
|-----------|---------|
| `doc-types/` | Templates for each documentation type (feature guide, FAQ, tutorial, etc.) |
| `site-structure/` | Documentation site scaffolding (sidebar, landing page, platform guide) |
| `in-app-help/` | In-app help system architecture and component specs |
| `screenshot-automation/` | Screenshot capture system (Playwright + mobile simulator) |
| `mobile/` | Mobile-specific documentation templates and strategy |

---

## Integration with ORCHESTRATOR

This system is set up during **Step 15.5: User Documentation** of the ORCHESTRATOR, between Observability (Step 15) and Handoff (Step 16). The generator at `10-generators/USER-DOC-GENERATOR.md` creates the initial documentation skeleton from the feature list and screen catalog.

---

## Skills and Commands

| Skill/Command | When to Use | What It Does |
|---------------|-------------|-------------|
| `/document-feature` | After completing any feature task | Generates feature guide, FAQ, troubleshooting, changelog, in-app help |
| `/capture-screenshots` | After design phase is complete | Captures web + mobile screenshots from placeholders |
| `/doc-quality-gate` | Before transitioning to next phase | Checks documentation coverage, blocks if < 90% |
