# Deep Dive Audit Checklist

> **Used by:** Step 32 (Deep Dive Audit & Enhancement)
> **Purpose:** Per-service, per-phase, per-feature checklist for comprehensive deep dive analysis.

---

## Round 1: Per-Service Deep Dive

For **every service** in `CONFIG.MVP_SERVICES`, answer these questions:

### Service: {{SERVICE_NAME}}

**Feature Completeness:**
- [ ] List ALL features this service provides (not just what's in the spec)
- [ ] Categorize each feature: **Must-Have** (blocks launch) vs **Nice-to-Have** (post-MVP)
- [ ] Are there industry-standard features for this type of service that we're missing?
- [ ] Does this service handle all CRUD operations for its entities?
- [ ] Are there bulk operations needed? (bulk create, bulk update, bulk delete, import, export)

**Edge Case Coverage:**
- [ ] What happens with the first user? (empty state, no data)
- [ ] What happens at scale? (1000+ records, concurrent users)
- [ ] What happens when dependent services are down?
- [ ] What happens with invalid/malicious input?
- [ ] What happens with timezone differences?
- [ ] What happens with currency/locale differences?

**Business Rules Verification:**
- [ ] Are all state transitions documented with a state machine diagram?
- [ ] Are all validation rules specific (not "validate input")?
- [ ] Are calculation formulas documented with examples?
- [ ] Are permission rules documented per user role?
- [ ] Do business rules match real-world scenarios? (walk through 3 realistic scenarios)

**Business Needs Assessment:**
- [ ] What would a business owner expect from this service that we haven't captured?
- [ ] What reporting/analytics does this service need?
- [ ] What administrative capabilities are needed? (override, manual adjustment, audit)
- [ ] What notification triggers exist? (status changes, thresholds, deadlines)

**Nice-to-Have Identification:**
- [ ] Automation opportunities (auto-assign, auto-escalate, auto-archive)
- [ ] Intelligence features (suggestions, predictions, anomaly detection)
- [ ] Integration opportunities (export to Excel, sync with calendar, webhook events)

---

## Round 2: Per-Phase Deep Dive

For **every phase** in `dev_docs/project-phases.md`:

### Phase: {{PHASE_NAME}}

**Breakdown Logic:**
- [ ] Does this phase have a clear, single objective?
- [ ] Are all tasks in this phase actually related to the phase objective?
- [ ] Are there tasks that belong in a different phase?
- [ ] Is the phase small enough to complete in the estimated timeframe?

**Dependency Correctness:**
- [ ] Are all dependencies on previous phases explicitly listed?
- [ ] Are there implicit dependencies not captured? (e.g., needs auth before billing)
- [ ] Can any tasks within this phase run in parallel?
- [ ] Are there external dependencies? (API keys, third-party accounts, design assets)

**Timeline Realism:**
- [ ] Is the effort estimate realistic for the team size?
- [ ] Does it account for testing and code review time?
- [ ] Does it account for integration complexity between services?
- [ ] Is there buffer for unknowns? (10-20% recommended)

**Resource Allocation:**
- [ ] Are the required skills available on the team?
- [ ] Are there bottleneck tasks that only one person can do?
- [ ] Are there tasks that need external input? (design, copy, legal)

**Gap Identification:**
- [ ] What tasks are missing from this phase?
- [ ] What testing tasks are needed that aren't listed?
- [ ] What documentation tasks should accompany this phase?
- [ ] What deployment/migration tasks are needed?

---

## Round 3: Per-Feature Deep Dive

For **every feature** in `dev_docs/features-list.md`:

### Feature: {{FEATURE_NAME}}

**End-to-End Specification Check:**
- [ ] **Data Model:** Entity defined? Fields specified? Relationships mapped? Indexes identified?
- [ ] **API:** Endpoints defined? Request/response schemas documented? Error codes listed?
- [ ] **UI:** Screens designed? All states covered (loading, error, empty, data)? Responsive?
- [ ] **Business Logic:** Validation rules documented? State transitions defined? Calculations specified?
- [ ] **Tests:** Unit test scenarios listed? Integration test scenarios listed? E2E test scenarios listed?
- [ ] **Documentation:** User-facing docs needed? Admin docs needed? API docs generated?

**Business Needs Not Yet Captured:**
- [ ] Reporting needs for this feature
- [ ] Admin override capabilities
- [ ] Audit trail requirements
- [ ] Data export requirements
- [ ] Notification requirements
- [ ] Search/filter requirements

**Nice-to-Have Enhancements:**
- [ ] UX improvements (keyboard shortcuts, drag-and-drop, inline editing)
- [ ] Performance optimizations (caching, lazy loading, optimistic updates)
- [ ] Accessibility enhancements beyond minimum (screen reader optimization, high contrast)
- [ ] Internationalization readiness

---

## Output Format

After completing all checklists, generate:

1. **deep-dive-summary.md** — consolidated findings with priority ratings
2. **nice-to-haves.md** — all nice-to-have features organized by service, with effort estimates
3. Per-round findings files with specific, actionable items
