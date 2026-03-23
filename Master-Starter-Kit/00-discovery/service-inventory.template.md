# Service Inventory: {{PROJECT_NAME}}

> Intermediate artifact from Phase 2: Deep Feature Mining
> Generated during intake, rolled into PROJECT-BRIEF.md
> Last updated: {{DATE}}

---

## Service Enumeration

**Expected service count (from A1-FOLLOW):** {{EXPECTED_SERVICE_COUNT}}
**Enumerated services:** {{ACTUAL_SERVICE_COUNT}}
**Delta:** {{DIFFERENCE}} ({{ACCEPTABLE_OR_NEEDS_REVIEW}})

| # | Service Name | Description | Entities Involved | User Types | Est. Screens | Est. API Endpoints | Priority |
|---|-------------|-------------|-------------------|------------|-------------|-------------------|----------|
| 1 | {{SERVICE_NAME}} | {{DESCRIPTION}} | {{ENTITIES}} | {{ROLES}} | {{N}} | {{N}} | {{PRIORITY}} |

---

## Operations Per Service

### {{SERVICE_NAME}}

**CRUD Operations:**

- Create {{ENTITY}} ({{ROLES}})
- Read {{ENTITY}} list ({{ROLES}})
- Read {{ENTITY}} detail ({{ROLES}})
- Update {{ENTITY}} ({{ROLES}})
- Delete {{ENTITY}} ({{ROLES}})

**Special Actions:**

- {{ACTION}} ({{ROLES}}) — {{DESCRIPTION}}

**Search/Filter:**

- Text search: {{FIELDS}}
- Filters: {{FILTERS}}
- Sort: {{SORT_OPTIONS}}

---

## Integration Map

| Service | Integration | Purpose | Direction | Priority | Phase |
|---------|------------|---------|-----------|----------|-------|
| {{SERVICE}} | {{INTEGRATION}} | {{PURPOSE}} | {{DIRECTION}} | {{PRIORITY}} | {{PHASE}} |

**Total integrations:** {{COUNT}}

---

## Import / Export / Bulk Operations

| Operation | Entity | Format | Frequency | Source/Destination | Priority |
|-----------|--------|--------|-----------|-------------------|----------|
| {{OPERATION}} | {{ENTITY}} | {{FORMAT}} | {{FREQUENCY}} | {{SOURCE}} | {{PRIORITY}} |

---

## Dashboards & Reports

| User Type | Dashboard/Report | KPIs | Charts | Frequency | Priority |
|-----------|-----------------|------|--------|-----------|----------|
| {{ROLE}} | {{NAME}} | {{KPIS}} | {{CHARTS}} | {{FREQUENCY}} | {{PRIORITY}} |

---

## Coverage Checks

### Entity Coverage

Every entity from A6 must appear in at least one service:

| Entity | Covered By Service(s) | Status |
|--------|----------------------|--------|
| {{ENTITY}} | {{SERVICES}} | {{COVERED_OR_MISSING}} |

### User Type Coverage

Every user type from B1 must interact with at least one service:

| User Type | Services Used | Status |
|-----------|--------------|--------|
| {{ROLE}} | {{SERVICES}} | {{COVERED_OR_MISSING}} |

---

## Summary

- **Services:** {{TOTAL}} ({{P0_COUNT}} P0, {{P1_COUNT}} P1, {{P2_COUNT}} P2, {{P3_COUNT}} P3)
- **Total operations:** {{TOTAL_OPERATIONS}}
- **Integrations:** {{TOTAL_INTEGRATIONS}}
- **Import/export needs:** {{TOTAL_IO}}
- **Dashboards:** {{TOTAL_DASHBOARDS}}
- **Entity coverage:** {{ALL_COVERED_OR_GAPS}}
- **User type coverage:** {{ALL_COVERED_OR_GAPS}}
