# Phantom Table Check — Gate 13 Proof Artifact

> **Purpose:** Verifies that every database table/entity referenced anywhere in the project documentation is actually defined in the database schema documentation.
> **Gate:** 13 (Phantom Table Check)
> **Trigger:** After database schema docs are generated (Step 5 for greenfield, Step 7 for existing apps)

---

## Instructions

1. Grep ALL project documentation (service specs, screen specs, task files, API contracts) for table/entity references
2. Cross-reference against the database schema documentation
3. Flag any "phantom" tables — referenced but never defined

---

## Entity Reference Inventory

> List EVERY database table/entity referenced in any project document.

| Entity/Table Name | Referenced In | Schema Definition Exists? | Has Column Definitions? | Has Relationships? |
|-------------------|--------------|---------------------------|------------------------|--------------------|
| {{table_1}} | {{service spec, task file, etc.}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No |
| {{table_2}} | {{documents}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No |

---

## Schema Completeness Checks

### Check 1: Every referenced table has a definition

- [ ] All tables referenced in service specs have schema definitions
- [ ] All tables referenced in screen specs have schema definitions
- [ ] All tables referenced in task files have schema definitions
- [ ] All tables referenced in API contracts have schema definitions

### Check 2: Every table has required columns

For each defined table, verify:

| Table | Has `id`? | Has `organizationId`? | Has `createdAt`? | Has `updatedAt`? | Has `deletedAt`? | Column Count |
|-------|-----------|----------------------|------------------|------------------|------------------|-------------|
| {{table}} | ☐ | ☐ | ☐ | ☐ | ☐ | {{N}} or "N+" estimate |

> **`organizationId`:** Required for ALL tenant-scoped tables. Skip only for pure reference tables (e.g., US states, time zones).
> **`deletedAt`:** Required for soft-delete support. Skip only for append-only tables (e.g., audit logs).

### Check 3: No "N+" column estimates

- [ ] Every table has actual column definitions (not just "N+ columns" or "various fields")
- List any tables with vague column definitions: {{list}}

### Check 4: Relationship integrity

- [ ] Every foreign key reference points to an existing table
- [ ] Every junction/join table is defined
- [ ] No circular dependencies without documented justification

---

## Phantom Tables Found

| Phantom Table | Referenced In | Impact | Resolution |
|--------------|--------------|--------|------------|
| {{table}} | {{document(s)}} | {{what breaks without it}} | ☐ Define it / ☐ Remove references / ☐ It's in another service |

---

## Pass Criteria

- [ ] Zero phantom tables (every referenced table has a definition)
- [ ] Every table has actual column definitions (not estimates)
- [ ] Every table has required columns (id, timestamps, organizationId where applicable, deletedAt)
- [ ] All foreign key references are valid

**If any phantom tables found:** Define them in the database schema documentation before proceeding.
