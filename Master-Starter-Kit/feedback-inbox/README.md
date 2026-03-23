# Feedback Inbox

Landing zone for project feedback. Populated automatically — no manual submissions needed.

## How Files Get Here (All Automatic)

| Source | Mechanism | Manual steps required |
|--------|-----------|----------------------|
| Remote repos | `/kit-harvest` auto-fetches via GitHub API / git archive | None — just register the repo URL below |
| Local projects | `/kit-harvest` auto-scans registered paths | None — just register the path below |
| Session end | Stop hook auto-exports and commits `.kit-feedback.json` to project repos | None — hook runs automatically |
| Direct drop | Kit maintainer places received files here | Only if someone sends a file manually |

## Setup: Register Your Projects

Edit `project-registry.json` in this directory:

**Local projects (on your machine):**
```json
{
  "local_projects": [
    { "path": "c:/Users/USER/Desktop/websites/1-LIVE/ProjectA", "name": "Project A" },
    { "path": "c:/Users/USER/Desktop/websites/1-LIVE/ProjectB", "name": "Project B" }
  ]
}
```

**Remote repos (friends' projects on GitHub):**
```json
{
  "remote_repos": [
    { "url": "https://github.com/friend/their-project", "name": "Friend's Project", "branch": "main" },
    { "url": "https://github.com/other/cool-app", "name": "Cool App", "branch": "main" }
  ]
}
```

Once registered, `/kit-harvest` handles everything else.

## What Happens Automatically

1. **On every session start** in the kit directory: the auto-scan hook checks all registered projects and reports if feedback is available
2. **When you run `/kit-harvest`**: it auto-fetches from all remote repos, scans all local projects, deduplicates, ranks, and presents for approval
3. **In every project session**: the AI auto-captures feedback candidates, and the Stop hook auto-exports and commits them

## Directory Structure

```
feedback-inbox/
  README.md                  -- This file
  project-registry.json      -- Registered local + remote project paths
  processed/                 -- Archive of applied feedback files
  WHATS-NEW.md               -- Generated after each harvest (what changed)
  *.kit-feedback.json        -- Pending submissions (auto-fetched or manually dropped)
```

## After Processing

Once `/kit-harvest` processes a file, it moves to `processed/` with a timestamp prefix. Nothing is ever deleted — the archive serves as a historical record.
