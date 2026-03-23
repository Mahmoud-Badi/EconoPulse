# Domain Rules: {{ENTITY_NAME}}

> **Business rules define how the system behaves.** These rules come from the business domain, not from technical constraints. They feed the `/domain-rules` command and are enforced in tRPC procedures.

---

## Entity Overview

| Field | Value |
|-------|-------|
| Entity | `{{ENTITY_NAME}}` |
| Table | `{{TABLE_NAME}}` |
| Domain | {{DOMAIN_NAME}} |
| Router | `{{ROUTER_NAME}}` |
| Stateful? | {Yes/No} (has status column with constrained transitions) |

**Definition:** {One paragraph explaining what this entity represents in the real world. Use domain language, not technical language. Example: "A Trip represents a single transportation service for one passenger from a pickup location to a drop-off location. Trips are the core unit of work in the system."}

---

## State Machine

> Include this section if the entity has a `status` column with constrained transitions. If the entity is stateless, delete this section.

### States

| State | Display Name | Description | Terminal? |
|-------|-------------|-------------|----------|
| `{{STATE_1}}` | {Display Name} | {When entity is in this state} | No |
| `{{STATE_2}}` | {Display Name} | {When entity is in this state} | No |
| `{{STATE_3}}` | {Display Name} | {When entity is in this state} | No |
| `{{STATE_4}}` | {Display Name} | {When entity is in this state} | Yes |
| `{{STATE_5}}` | {Display Name} | {When entity is in this state} | Yes |

### State Diagram

```
                    ┌──────────────┐
                    │  {STATE_1}   │ ← Initial state (created here)
                    │  ({DISPLAY}) │
                    └──────┬───────┘
                           │
                    {ACTION: e.g., "assign driver"}
                           │
                           ↓
                    ┌──────────────┐
           ┌────── │  {STATE_2}   │ ──────┐
           │       │  ({DISPLAY}) │       │
           │       └──────────────┘       │
           │                              │
    {ACTION_A}                     {ACTION_B}
    (happy path)                   (exception)
           │                              │
           ↓                              ↓
    ┌──────────────┐              ┌──────────────┐
    │  {STATE_3}   │              │  {STATE_5}   │ ★ Terminal
    │  ({DISPLAY}) │              │  ({DISPLAY}) │
    └──────┬───────┘              └──────────────┘
           │
    {ACTION_C}
           │
           ↓
    ┌──────────────┐
    │  {STATE_4}   │ ★ Terminal
    │  ({DISPLAY}) │
    └──────────────┘
```

### Transition Rules

| # | From | To | Trigger | Required Role | Required Fields | Side Effects |
|---|------|----|---------|--------------|----------------|-------------|
| T1 | `{{STATE_1}}` | `{{STATE_2}}` | {{ACTION}} | {{ROLE}} | {{FIELDS}} | {{EFFECTS}} |
| T2 | `{{STATE_2}}` | `{{STATE_3}}` | {{ACTION}} | {{ROLE}} | {{FIELDS}} | {{EFFECTS}} |
| T3 | `{{STATE_2}}` | `{{STATE_5}}` | {{ACTION}} | {{ROLE}} | `reason` (required) | {{EFFECTS}} |
| T4 | `{{STATE_3}}` | `{{STATE_4}}` | {{ACTION}} | {{ROLE}} | {{FIELDS}} | {{EFFECTS}} |

### Transition Enforcement Code Pattern

```typescript
// packages/api/src/routers/{entity}.ts
const VALID_TRANSITIONS: Record<string, string[]> = {
  "{STATE_1}": ["{STATE_2}"],
  "{STATE_2}": ["{STATE_3}", "{STATE_5}"],
  "{STATE_3}": ["{STATE_4}"],
  // Terminal states have no outgoing transitions
  "{STATE_4}": [],
  "{STATE_5}": [],
};

function validateTransition(from: string, to: string): void {
  const allowed = VALID_TRANSITIONS[from];
  if (!allowed?.includes(to)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Cannot transition from "${from}" to "${to}"`,
    });
  }
}
```

---

## Business Rules

> Numbered for easy reference in code comments: `// BR-{{ENTITY}}-{N}`

### Creation Rules

1. **BR-{{ENTITY}}-1:** {Rule about what's required to create this entity. Example: "A Trip must have a passenger, pickup address, and drop-off address at creation time."}
2. **BR-{{ENTITY}}-2:** {Rule about defaults. Example: "New Trips default to 'scheduled' status."}
3. **BR-{{ENTITY}}-3:** {Rule about validation. Example: "Pickup and drop-off addresses cannot be the same."}

### Update Rules

4. **BR-{{ENTITY}}-4:** {Rule about what can/cannot be changed. Example: "The passenger cannot be changed after the trip starts."}
5. **BR-{{ENTITY}}-5:** {Rule about conditional updates. Example: "Fare amount can only be modified by dispatchers or admins."}

### Deletion Rules

6. **BR-{{ENTITY}}-6:** {Rule about when deletion is allowed. Example: "A Trip can only be deleted (soft) if it hasn't started yet."}
7. **BR-{{ENTITY}}-7:** {Rule about cascading. Example: "Deleting a Driver soft-deletes their vehicle assignments but not the vehicles."}

### Calculation Rules

8. **BR-{{ENTITY}}-8:** {Formula or calculation. Example: "Total fare = base rate + (mileage * per-mile rate) + surcharges. Stored in cents."}
9. **BR-{{ENTITY}}-9:** {Aggregation rule. Example: "Invoice total = sum of all line item amounts. Recalculated on any line item change."}

### Permission Rules

10. **BR-{{ENTITY}}-10:** {Who can do what. Example: "Only dispatchers and admins can assign drivers to trips."}
11. **BR-{{ENTITY}}-11:** {Role-based visibility. Example: "Drivers can only see their own assigned trips, not other drivers' trips."}

### Time-Based Rules

12. **BR-{{ENTITY}}-12:** {Deadline or time rule. Example: "Trips must be scheduled at least 2 hours in advance."}
13. **BR-{{ENTITY}}-13:** {Expiry rule. Example: "Invoices become 'overdue' when the current date passes the due date."}

### Cross-Entity Rules

14. **BR-{{ENTITY}}-14:** {Rule involving other entities. Example: "A Driver cannot be assigned to two overlapping trips."}
15. **BR-{{ENTITY}}-15:** {Rule about entity relationships. Example: "A Vehicle can only be assigned to one active Driver at a time."}

---

## Compliance Notes

> Include this section if the entity has regulatory, legal, or industry-specific requirements.

| Requirement | Standard | Implementation |
|------------|----------|---------------|
| {{REQUIREMENT_1}} | {STANDARD — e.g., HIPAA, GDPR, SOC2} | {How it's implemented} |
| {{REQUIREMENT_2}} | {{STANDARD}} | {How it's implemented} |
| {{REQUIREMENT_3}} | {{STANDARD}} | {How it's implemented} |

### Data Retention

| Data Type | Retention Period | Action After Expiry |
|-----------|-----------------|-------------------|
| Active records | Indefinite | — |
| Soft-deleted records | {N} days/months | Hard delete or archive |
| Audit logs | {N} years | Archive to cold storage |
| {{SENSITIVE_DATA}} | {N} days | Anonymize or purge |

### Access Logging

| Action | Log? | Fields Logged |
|--------|------|--------------|
| View list | {Yes/No} | userId, timestamp, filters |
| View detail | {Yes/No} | userId, entityId, timestamp |
| Create | Yes | userId, entityId, all fields |
| Update | Yes | userId, entityId, changed fields (old+new) |
| Delete | Yes | userId, entityId, reason |
| Export | Yes | userId, timestamp, record count |

---

## Edge Cases

> Business-level edge cases that must be handled in code. Technical edge cases go in the implementation spec.

1. **{{EDGE_CASE_1}}:** {Description. Example: "Driver calls in sick after trip is assigned. System must allow reassignment without changing trip status."}
   - **Expected behavior:** {What should happen}
   - **Code reference:** BR-{{ENTITY}}-{N}

2. **{{EDGE_CASE_2}}:** {Description. Example: "Passenger cancels trip 5 minutes before pickup. Late cancellation fee may apply."}
   - **Expected behavior:** {What should happen}
   - **Code reference:** BR-{{ENTITY}}-{N}

3. **{{EDGE_CASE_3}}:** {Description. Example: "Two dispatchers try to assign different drivers to the same trip simultaneously."}
   - **Expected behavior:** {What should happen — e.g., last write wins, or optimistic lock}
   - **Code reference:** BR-{{ENTITY}}-{N}

4. **{{EDGE_CASE_4}}:** {Description}
   - **Expected behavior:** {What should happen}
   - **Code reference:** BR-{{ENTITY}}-{N}

5. **{{EDGE_CASE_5}}:** {Description}
   - **Expected behavior:** {What should happen}
   - **Code reference:** BR-{{ENTITY}}-{N}

---

## Status Display

> How each status appears in the UI.

| Status | Badge Color | Icon | Description Text |
|--------|-----------|------|-----------------|
| `{{STATE_1}}` | {blue/gray/yellow/green/red} | {IconName} | "{Display text}" |
| `{{STATE_2}}` | {color} | {IconName} | "{Display text}" |
| `{{STATE_3}}` | {color} | {IconName} | "{Display text}" |
| `{{STATE_4}}` | {color} | {IconName} | "{Display text}" |
| `{{STATE_5}}` | {color} | {IconName} | "{Display text}" |

---

## Related Documentation

- **Table doc:** `../database-docs/{table_name}.md`
- **Router spec:** `../api-docs/{router_name}.md`
- **Implementation spec:** `{feature}-spec.md`
- **Seed data:** `../database-docs/seed-data-spec.md`
