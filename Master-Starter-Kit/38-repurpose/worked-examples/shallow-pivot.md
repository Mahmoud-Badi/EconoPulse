# Worked Example: Shallow Pivot (Rebrand)

> **Scenario:** A project management tool for software teams → Project management tool for marketing teams

---

## What Makes This a Shallow Pivot

- Same core workflow (task boards, timelines, collaboration)
- Same data model (projects, tasks, users, teams, comments)
- Different terminology and templates
- Different integrations
- Different onboarding flow
- Reuse: **85-95%**

---

## What Changes

### Terminology Mapping

| Software PM Term | Marketing PM Term |
|-----------------|------------------|
| Sprint | Campaign |
| Story | Deliverable |
| Bug | Revision Request |
| Repository | Asset Library |
| Deploy | Publish / Go Live |
| CI/CD Pipeline | Approval Workflow |
| Code Review | Creative Review |
| Tech Debt | Content Backlog |

### Template Changes

| Template Type | Software Version | Marketing Version |
|--------------|-----------------|------------------|
| Project templates | Sprint planning, feature roadmap | Campaign calendar, content pipeline |
| Task templates | Bug report, feature request | Brief, creative request, revision |
| Status labels | In Dev, In Review, QA, Deployed | Drafting, In Review, Approved, Published |
| Dashboard widgets | Velocity, burndown, cycle time | Campaign ROI, deliverable pipeline, deadline tracking |

### Integration Swaps

| Software Integration | Marketing Integration | Effort |
|---------------------|----------------------|--------|
| GitHub / GitLab | Google Drive / Dropbox | Medium — file picker swap |
| Jira (import) | Asana / Monday (import) | Medium — different API shapes |
| Slack (dev channels) | Slack (marketing channels) | None — same integration |
| CI/CD webhooks | Social media scheduling APIs | Large — new integration |
| Code editor embed | Rich text / design preview | Large — different embed type |

### Onboarding Changes

**Software version:** "Create your first sprint" → add team → connect repo → create stories
**Marketing version:** "Plan your first campaign" → add team → connect asset library → create briefs

---

## What Stays the Same

- User authentication and team management (100% reuse)
- Permission system and roles (100% reuse — rename "Developer" to "Designer")
- Notification system (100% reuse)
- Comment and collaboration features (100% reuse)
- Task board (Kanban) engine (100% reuse — different column labels)
- Timeline / Gantt view (100% reuse)
- Reporting engine (95% reuse — different default charts)
- Search and filtering (100% reuse)
- File attachment system (100% reuse)
- API layer (95% reuse — same endpoints, different docs)

---

## Implementation Plan

### Phase 1: Terminology & Branding (1-2 days)
1. Create terminology mapping config (JSON/YAML — not hardcoded strings)
2. Update all UI strings via i18n system
3. Update landing page, marketing copy, onboarding flow
4. Update email templates
5. Update help documentation

### Phase 2: Templates & Defaults (2-3 days)
1. Create marketing-specific project templates
2. Create marketing task templates (briefs, creative requests)
3. Update default dashboard widgets
4. Update default status labels and workflows

### Phase 3: Integrations (1-2 weeks)
1. Add Google Drive / Dropbox file picker
2. Add social media scheduling preview
3. Add design tool embeds (Figma, Canva)
4. Update import/export for marketing tools

### Phase 4: Polish (2-3 days)
1. Update empty states with marketing-relevant illustrations
2. Add marketing-specific tooltips and hints
3. User testing with 3-5 marketing professionals
4. Iterate based on feedback

**Total estimated effort: 2-3 weeks**
**Reuse percentage: ~90%**

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fork or configure? | Configure (feature flag) | High reuse means one codebase can serve both verticals |
| Separate databases? | No — same schema, different tenant config | Data model is identical |
| Separate deployments? | Yes — different domains, same infrastructure | Brand separation matters for marketing |
| Pricing change? | Same tiers, marketing-specific feature names | No new technical capability needed |

---

## Pitfalls to Watch

1. **Don't just rename things** — marketing teams think in campaigns and deadlines, not sprints and velocity. The workflow metaphors need to feel native, not translated.
2. **Integration gap is larger than it looks** — design tool embeds are significantly more complex than code editor embeds. Budget extra time.
3. **Help content must be rewritten, not find-and-replaced** — marketing users have different mental models. "How to create a sprint" rewritten as "How to create a campaign" still reads like a developer wrote it.
4. **Sales and marketing for the new vertical is a separate effort** — having the product ready doesn't mean anyone knows about it. Budget marketing spend.
