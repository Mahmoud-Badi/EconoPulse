---
name: bootstrap
description: Start a new project setup using the full ORCHESTRATOR workflow
allowed_tools:
  - Agent
  - Read
  - AskUserQuestion
---

# /bootstrap — Project Bootstrap

Launch the project-bootstrapper agent to set up a new project from scratch.

## Steps

1. Confirm the user wants to bootstrap a new project
2. Launch the `project-bootstrapper` agent with the current working directory as context
3. The agent will handle intake, stack detection, template resolution, and file generation

## Execution

Launch the `project-bootstrapper` agent:

```
Agent: project-bootstrapper
Prompt: "Bootstrap a new project in the current working directory. Read the ORCHESTRATOR at ${CLAUDE_PLUGIN_ROOT}/../ORCHESTRATOR.md and execute all steps. The project root is: {current working directory}"
```

The agent will ask intake questions, auto-detect the stack, and generate all documentation and configuration files.
