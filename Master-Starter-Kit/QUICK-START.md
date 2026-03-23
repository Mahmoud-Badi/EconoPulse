# Quick Start Guide

> **Read this first if you've never used the Master Kit before.**

---

## What Is This?

The Master Kit is a **project planning autopilot**. You tell an AI about your project idea, and it automatically generates hundreds of planning documents — architecture specs, task lists, design systems, marketing plans, and more.

Think of it like hiring a senior tech lead, designer, and product manager who plan your entire project before a single line of code is written.

**You don't need to know how to code to use this kit.** You just need to be able to describe what you want to build.

---

## What Do I Need?

| Requirement | Why |
|-------------|-----|
| **Claude Code** (CLI or VSCode extension) | The AI that reads and runs the kit |
| **A project idea** | Could be a web app, mobile app, SaaS, API — anything |
| **30 minutes for the first conversation** | Claude asks you questions about your project |

That's it. No YAML files. No config. No terminal commands. Just a conversation.

---

## What Do I Actually Do?

### Step 1: Copy the kit (30 seconds)

Copy the entire `Master-Starter-Kit/` folder into your project directory.

### Step 2: Start the conversation (2 minutes)

Open Claude Code and type:

```
Read ORCHESTRATOR.md and set up this project
```

### Step 3: Answer questions (20-30 minutes)

Claude will ask you questions like a friendly consultant:
- "What does your product do?"
- "Who are your users?"
- "When do you want to launch?"

Just answer in plain English. If you don't know the answer, say **"you decide"** and Claude will pick a smart default.

### Step 4: Approve and watch (1-3 hours, mostly hands-off)

Claude runs on autopilot through up to 30 planning steps. It pauses at **gate checkpoints** to show you what it's done and ask "Does this look right?"

You just say yes or give feedback. That's it.

### Step 5: Start building

When it's done, you'll have a fully planned project with:
- Service specs (what to build)
- Screen specs (what it looks like)
- Task files (step-by-step coding work)
- A sprint dashboard (what to do this week)
- Design tokens (colors, fonts, spacing)
- Quality gates (definition of "done")

---

## How Long Does It Take?

| What | Time | Your involvement |
|------|------|-----------------|
| Intake conversation | 20-30 min | Active (answering questions) |
| Research & architecture | 1-2 hours | Mostly hands-off (approve at gates) |
| Specs & task generation | 1-2 hours | Mostly hands-off (approve at gates) |
| Infrastructure setup | 30-60 min | Approve at gates |
| **Total** | **3-5 hours** | **~1 hour of active participation** |

---

## Do I Have to Do All 30 Steps?

**No.** See [PATHS.md](PATHS.md) for recommended paths based on your project size:

- **Lite Path** (solo dev, small project) — 6 core steps, done in ~2 hours
- **Standard Path** (team, SaaS product) — 18 steps, done in ~4 hours
- **Full Path** (enterprise, multi-tenant, marketing) — all 30+ steps

---

## What If I Get Stuck?

| Problem | Solution |
|---------|----------|
| Claude asks a question I don't understand | Say "explain that in simple terms" |
| I don't know what to pick | Say "you decide" — Claude picks smart defaults |
| Something went wrong | Say "what just happened?" — Claude explains |
| I want to skip ahead | Say "skip to step [number]" |
| Context got lost (long session) | Say "read ORCHESTRATOR.md and resume from where we left off" |

---

## What Does "Done" Look Like?

After running the kit, your project folder will contain a `dev_docs/` directory with everything planned:

```
your-project/
├── dev_docs/
│   ├── PROJECT-OVERVIEW.md          ← What you're building
│   ├── STATUS.md                    ← Sprint dashboard
│   ├── service-hub-*.md             ← Backend service specs
│   ├── screen-spec-*.md             ← Every screen designed
│   ├── task-*.md                    ← Every coding task defined
│   ├── API-CONTRACT-REGISTRY.md     ← API mappings
│   ├── DESIGN-TOKENS.md             ← Colors, fonts, spacing
│   └── ...hundreds more files
├── Master-Starter-Kit/              ← The kit (reference only now)
└── your code files...
```

You go from **"I have an idea"** to **"I have a complete project plan with tasks I can start coding today."**

---

## Glossary of Terms Used in This Kit

Not sure what a term means? See [GLOSSARY.md](GLOSSARY.md) for plain-English definitions.

---

## Next Steps

1. Read this page (done!)
2. Skim [PATHS.md](PATHS.md) to pick your path
3. Copy the kit into your project folder
4. Tell Claude: "Read ORCHESTRATOR.md and set up this project"
5. Answer questions and approve gates
6. Start building!
