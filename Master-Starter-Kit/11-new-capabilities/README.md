# 11 - New Capabilities

## Purpose

This section contains capability modules that are conditionally wired into your project during Orchestrator Step 17 (Advanced Capabilities Setup). Not every project needs every capability — the orchestrator reads your project CONFIG and activates only the relevant modules.

## Core Principle

Capabilities are additive. They are designed to be plugged in after core build planning (Steps 0-16) is complete. Each file is self-contained: it explains when to use the capability, how to configure it, and what output it produces.

## File Manifest

| File | Type | When to Use | Orchestrator Step |
|------|------|------------|-------------------|
| `security-hardening.md` | Guide | Always | 14 |
| `error-handling-strategy.md` | Guide | Always | 15 |
| `observability.md` | Guide | Always | 15 |
| `technical-debt-registry.template.md` | Template | Always | 17 |
| `cost-estimation.template.md` | Template | Always | 17 |
| `stakeholder-dashboard.template.md` | Template | Always | 17 |
| `caching-strategy.md` | Guide | CONFIG.CACHE != "none" | 17 |
| `feature-flags.md` | Guide | When feature flags needed | 17 |
| `i18n-setup.md` | Guide | CONFIG.I18N_ENABLED == "true" | 17 |
| `performance-budgets.md` | Guide | CONFIG.HAS_WEB == "true" | 17 |
| `analytics-tracking.md` | Guide | CONFIG.ANALYTICS_PROVIDER != "none" | 17 |
| `accessibility-guide.md` | Guide | Always (best practice) | — |
| `api-documentation.md` | Guide | Always | — |
| `backup-recovery.md` | Guide | Production readiness | — |
| `migration-upgrade-guide.md` | Guide | Existing projects | — |
| `onboarding-guide.md` | Guide | Team > 1 developer | 18 |
| `seo-optimization.md` | Guide | CONFIG.HAS_WEB == "true" | — |
| `state-management-patterns.md` | Guide | Frontend architecture | — |

## Reading Order

Read these in the order the orchestrator activates them:

1. `security-hardening.md` (Step 14)
2. `error-handling-strategy.md` + `observability.md` (Step 15)
3. All "Always" templates: `technical-debt-registry`, `cost-estimation`, `stakeholder-dashboard` (Step 17)
4. Conditional capabilities matching your CONFIG (Step 17)
5. Remaining guides as needed during development
