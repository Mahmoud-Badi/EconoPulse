# Feature Flag Registry

> Living registry of all feature flags for **{{PROJECT_NAME}}**. Every flag must be documented here before it is added to code. Review at the start of each phase to clean up stale flags.

---

## Flag Registry

| Flag Key | Feature | Default | Phase Enabled | Phase Removed | Reason for Flag | Owner |
|----------|---------|---------|---------------|---------------|-----------------|-------|
| `{{SERVICE_PREFIX}}_{{FLAG_NAME_1}}` | {{FEATURE_1}} | off | {{PHASE_ENABLED_1}} | {{PHASE_REMOVED_1}} | {{FLAG_REASON_1}} | {{FLAG_OWNER_1}} |
| `{{SERVICE_PREFIX}}_{{FLAG_NAME_2}}` | {{FEATURE_2}} | off | {{PHASE_ENABLED_2}} | {{PHASE_REMOVED_2}} | {{FLAG_REASON_2}} | {{FLAG_OWNER_2}} |
| `{{SERVICE_PREFIX}}_{{FLAG_NAME_3}}` | {{FEATURE_3}} | off | {{PHASE_ENABLED_3}} | {{PHASE_REMOVED_3}} | {{FLAG_REASON_3}} | {{FLAG_OWNER_3}} |

---

## Naming Conventions

### Format

```
{service_prefix}_{feature_area}_{descriptor}
```

### Rules

- **Case:** `snake_case` always — no camelCase, no kebab-case
- **Prefix:** Use the service or module prefix: `billing_`, `auth_`, `trip_`, `report_`, etc.
- **Descriptor:** Short, specific, and action-oriented: `new_checkout_flow`, `pdf_export_v2`, `realtime_updates`
- **Maximum length:** 50 characters
- **No generic names:** Never use `test`, `temp`, `new_feature`, `experiment_1`

### Examples

| Good | Bad | Why |
|------|-----|-----|
| `billing_stripe_checkout_v2` | `newCheckout` | Missing prefix, camelCase, too vague |
| `trip_realtime_eta_display` | `feature_flag_1` | Meaningless name |
| `auth_passkey_login` | `PASSKEY` | Wrong case, no prefix |
| `report_pdf_export` | `temp_pdf_thing` | Vague, uses temp |

---

## Flag Lifecycle

### Phase 1: Creation

- Add the flag to this registry BEFORE writing code
- Default value: `off` (flags ship disabled)
- Create the flag in your flag provider: {{FLAG_PROVIDER}}
- Add both code paths (flag on and flag off) in the same PR

### Phase 2: Rollout

- Enable in development/staging first
- Enable for internal team users
- Enable for {{BETA_PERCENTAGE}}% of production users
- Monitor error rates and performance for {{ROLLOUT_MONITORING_PERIOD}}
- Enable for 100% of production users

### Phase 3: Stabilization

- Flag has been at 100% for one full phase with no issues
- All tests pass with the flag permanently on
- No rollback was needed during the monitoring period

### Phase 4: Cleanup

- Remove the flag from code — delete the conditional, keep only the "on" path
- Remove the flag from {{FLAG_PROVIDER}}
- Update this registry: set Phase Removed column
- Remove associated flag tests

**Rule:** A flag must be removed no later than 1 phase after it reaches 100% stable. Flags older than 2 phases with no removal date are escalated in the phase review.

---

## Flag Cleanup Schedule

| Review Point | Action |
|--------------|--------|
| Phase start | Review all flags — identify any past their removal deadline |
| Phase end | All flags from 2+ phases ago must be removed or have a documented exception |
| Quarterly | Audit for orphan flags (in provider but not in registry, or vice versa) |

### Overdue Flags (Update Each Phase)

| Flag Key | Should Have Been Removed | Reason Still Active | Removal Plan |
|----------|--------------------------|---------------------|--------------|
| — | — | — | — |

---

## Testing Requirements

Every feature flag MUST have both paths tested. A flag that is only tested in the "on" state is a rollback risk.

### Required Tests Per Flag

| Test Type | Flag On | Flag Off | Notes |
|-----------|---------|----------|-------|
| Unit test | Required | Required | Test the component/function with flag in both states |
| Integration test | Required | Required | Test the workflow end-to-end in both states |
| E2E test | Required | Recommended | At minimum, verify no crash in the off state |

### Test Pattern

```
describe("{{FLAG_KEY}}", () => {
  describe("when enabled", () => {
    // Set flag to on
    // Test the new behavior
  });

  describe("when disabled", () => {
    // Set flag to off
    // Test the old behavior still works
  });
});
```

---

## Flag Provider Configuration

| Setting | Value |
|---------|-------|
| Provider | {{FLAG_PROVIDER}} |
| Dashboard URL | {{FLAG_DASHBOARD_URL}} |
| SDK | {{FLAG_SDK}} |
| Environment separation | `development`, `staging`, `production` |
| Default evaluation | Server-side (never trust client-side evaluation for access control) |

---

## Emergency Flag Procedures

### Kill Switch

For critical issues, disable a flag immediately:

1. Go to {{FLAG_DASHBOARD_URL}}
2. Find the flag
3. Set to `off` for production
4. Notify the team in {{TEAM_CHANNEL}}
5. Create an incident report

### Flags That Must Never Be Removed Without a Full Review

| Flag | Reason |
|------|--------|
| `{{CRITICAL_FLAG_1}}` | {{CRITICAL_FLAG_1_REASON}} |
| `{{CRITICAL_FLAG_2}}` | {{CRITICAL_FLAG_2_REASON}} |

---

## Integration with STATUS.md

When adding or removing flags, update the current sprint in STATUS.md:

```markdown
## Feature Flags Changed This Sprint
- [ADDED] `billing_stripe_checkout_v2` — New checkout flow (off by default)
- [ENABLED] `trip_realtime_eta_display` — Rolled to 100% after 2 weeks stable
- [REMOVED] `auth_magic_link_login` — Stable for 1 phase, cleanup complete
```
