# Timeline Estimates

## Per-Step Time Estimates

These are approximate times based on real ORCHESTRATOR runs. Actual time depends on project complexity, number of services/screens, and gate review time.

### Build Planning (Steps 0-16)

| Step | Name | Est. Time | Notes |
|------|------|-----------|-------|
| 0 | Ecosystem Setup | 10 min | One-time setup; faster on repeat runs |
| 1 | Discovery & Intake | 15-25 min | Depends on how quickly you answer questions |
| 1.7 | Stakeholder Comms Setup | 5-10 min | Identify stakeholders, generate kickoff deck |
| 2 | AI Config Generation | 5 min | Automated, minimal review |
| 3 | Tribunal | 45-90 min | Longer for competitive markets; scales with service count |
| 3.5 | Mobile Framework | 10 min | Skip if no mobile |
| 3.6 | Technical Spike Planning | 10-15 min | 3-8 spike files for high-risk unknowns |
| 4 | Foundation Docs | 10-15 min | Project overview, vision, phases |
| 5 | Service Specs | 20-40 min | ~5 min per service |
| 5.1 | Module Hub Files | 20-40 min | Skip if MODULE_HUBS=false; scales with service count |
| 5.2 | Domain Specs (Repurpose) | 15-25 min | Repurpose path only; skip if DOMAIN_SPECS=false |
| 5.5 | Mobile Services | 10-15 min | Skip if no mobile |
| 5.6 | Mobile Architecture | 10-15 min | Skip if MOBILE_FULL_PARITY=false |
| 5.7 | Mobile Offline | 10-15 min | Skip if no offline support |
| 5.8 | Mobile Screens | 15-25 min | Skip if MOBILE_FULL_PARITY=false |
| 5.9 | Mobile Testing/Deploy | 10-15 min | Skip if MOBILE_FULL_PARITY=false |
| 6 | Screen Specs | 15-30 min | ~3 min per screen |
| 6.5 | Screen Completeness + User-Completeness Gate | 15-20 min | Includes Gate 7 verification |
| 7 | Codebase Audit | 15-30 min | Skip if greenfield project |
| 7.1 | Directory Init | 5 min | Populates audit/ and components/ if Step 7 skipped |
| 8 | Task Generation | 15-25 min | Scales with service count |
| 8.1 | Component Catalog | 5-10 min | Extracts components from screen specs |
| 8.2 | Decision Log + Journal | 5-10 min | ADRs + lightweight decision journal |
| 8.4 | Catalog Generation | 15-25 min | Notifications, permissions, events, errors, integration health |
| 9 | Dashboard (STATUS.md) | 5-10 min | Automated |
| 8.3 | Sprint Plan Init | 5 min | Populates sprints/ from STATUS.md |
| 8.6 | Cross-Reference Validator + Gates 1,5,6 | 15-20 min | 12 checks + AI integrity + dead UI + workflow |
| 9.5 | Master Tracker | 15-25 min | Skip if MASTER_TRACKER=false; 500+ subtasks |
| 10 | API Contracts | 15-25 min | ~3 min per service's router |
| 10.5 | Code Template Generator | 10-15 min | Stack-specific code templates |
| 10.6 | API Mock Server | 10-15 min | Skip if MOCK_SERVER=false |
| 11 | Infrastructure | 15-20 min | Docker, CI/CD, git hooks |
| 11.5 | Mobile Infrastructure | 10 min | Skip if no mobile |
| 12 | Testing Setup | 10-15 min | Configs and patterns |
| 13 | Design System | 15-20 min | Design tokens, components |
| 14 | Security | 10-15 min | Auth, RBAC, validation |
| 14.5 | Mobile Security | 5-10 min | Skip if no mobile |
| 14.9 | Integration Strategy | 20-30 min | Skip if 0-3 integrations |
| 15 | Observability | 10-15 min | Logging, monitoring |
| 16 | Handoff | 5-10 min | Summary and verification |

**Subtotal (Standard Path):** ~3.5-5.5 hours

### Quality & Standards (Steps 16.1-16.5)

| Step | Name | Est. Time |
|------|------|-----------|
| 16.1 | Anti-Pattern Detection | 10 min |
| 16.2 | Security Deep Scan | 10 min |
| 16.3 | Performance Budgets | 10 min |
| 16.4 | Memory Verification | 5 min |
| 16.5 | SLO Definition | 10 min |

| 16.6 | Seed Data Planning | 15-25 min | Skip if SEED_DATA=false |
| 16.7 | Directory Population Audit | 5-10 min | Verifies all directories populated |

**Subtotal:** ~45 min + 20-35 min (new steps)

### Advanced Setup (Steps 17-18)

| Step | Name | Est. Time |
|------|------|-----------|
| 17 | Capabilities (flags, caching, i18n) | 15-20 min |
| 17.5 | Financial Modeling | 15-20 min |
| 17.6 | Multi-Tenant Setup | 15-20 min |
| 18 | Onboarding Docs | 10 min |

**Subtotal:** ~30-70 min (depends on modules selected)

### Operational Setup (Steps 18.5-18.8)

| Step | Name | Est. Time |
|------|------|-----------|
| 18.5 | Team Ceremonies | 10 min |
| 18.6 | Incident Response | 15 min |
| 18.7 | Customer Support | 10 min |
| 18.7.5 | CX Operations (conditional) | 20-40 min |
| 18.8 | Post-Launch Planning | 10 min |

**Subtotal:** ~45-85 min (depends on whether CX operations is included)

### Marketing Planning (Steps 19-28.5)

| Step | Name | Est. Time |
|------|------|-----------|
| 19 | Market Research | 15-20 min |
| 20 | Positioning & Messaging | 15 min |
| 21 | Content Strategy | 10-15 min |
| 22 | Email Marketing | 10 min |
| 23 | Social Strategy | 10 min |
| 24 | Channel Strategy | 10 min |
| 25 | Website/Landing Pages | 10-15 min |
| 26 | Launch Strategy | 15 min |
| 27 | Growth & Retention | 10 min |
| 28 | Competitive Intelligence | 15 min |
| 28.5 | Legal Documents | 15-20 min |

**Subtotal:** ~2-2.5 hours

### Hardening Phase (Steps 29-33) — Mandatory for All Paths

| Step | Name | Est. Time | Notes |
|------|------|-----------|-------|
| 29 | Post-Completion Audit | 25-35 min | 3 rounds: existence → sections → cross-refs |
| 30 | Enhancement Rounds | 35-50 min | 3 rounds: gaps → improvements → patterns |
| 31 | Depth Verification | 50-70 min | 5 rounds: phases → sub-tasks → milestones → depth → cross-refs |
| 32 | Deep Dive Audit | 50-70 min | 3 rounds: per-service → per-phase → per-feature |
| 33 | Expansion Planning | 20-30 min | Post-MVP roadmap, verticals, growth strategies |

**Subtotal:** ~3-4.5 hours (early exits reduce time if plan is already solid)

---

## Total Time by Path

| Path | Active Time | Review Time | Hardening | Total |
|------|-------------|-------------|-----------|-------|
| **Express** | 25 min | 5 min | ~3.5 hrs | ~4 hrs |
| **Lite** | 1.5 hrs | 15 min | ~3.5 hrs | ~5.5 hrs |
| **Standard** | 5 hrs | 45 min | ~3.5 hrs | ~9.5 hrs |
| **Standard + parallel** | 4 hrs | 45 min | ~3.5 hrs | ~8.5 hrs |
| **Full** | 8 hrs | 1.5 hrs | ~3.5 hrs | ~13 hrs |
| **Full + parallel** | 6.5 hrs | 1.5 hrs | ~3.5 hrs | ~11.5 hrs |

## Gate Review Time Budget

| Gate Mode | Time Per Gate | Total (26 gates) |
|-----------|---------------|-------------------|
| **Manual** | 3-5 min each | ~60-90 min |
| **Semi-auto** | 5-10 min each (5 gates) | ~25-50 min |
| **Auto** | 0 min during run + 30-60 min dashboard review | ~30-60 min |

## What Affects Duration

| Factor | Impact | Example |
|--------|--------|---------|
| Service count | +5 min per service for specs, tasks, contracts | 5 services = baseline; 15 services = +50 min |
| Screen count | +3 min per screen for specs | 10 screens = baseline; 30 screens = +60 min |
| Tribunal depth | +15-30 min for competitive markets | Crowded SaaS market = longer research |
| Mobile | +45-60 min total for mobile steps | React Native + iOS + Android |
| Existing codebase | +15-30 min for audit step | Large codebase = longer audit |
| User response time | Variable | Fast answerer saves 10-15 min on intake |
