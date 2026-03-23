# [SERVICE_NAME] — Service Specification

> Copy this template for each backend service. Fill in every section.
> Delete this instruction block when done.

---

## 1. Overview
**Service:** [Service Name]
**Module:** [Backend module path]
**Status:** [Draft | In Progress | Complete]
**Owner:** [Developer/Agent]

Brief description of what this service does and why it exists.

## 2. Business Context
- Why does this service exist?
- What business process does it support?
- What happens if this service is unavailable?

## 3. User Stories
- As a [role], I want to [action] so that [benefit].
- As a [role], I want to [action] so that [benefit].
- As a [role], I want to [action] so that [benefit].

## 4. Data Model
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| id | UUID | Yes | auto | Primary key |
| tenantId | UUID | Yes | from auth | Tenant isolation |
| | | | | |
| createdAt | DateTime | Yes | now() | Creation timestamp |
| updatedAt | DateTime | Yes | now() | Last update timestamp |
| deletedAt | DateTime | No | null | Soft-delete timestamp |

### Relationships
- [Entity] belongs to [Parent Entity]
- [Entity] has many [Child Entity]

## 5. API Endpoints
| Method | Path | Auth Roles | Description |
|---|---|---|---|
| GET | /api/[resource] | [roles] | List all (paginated) |
| GET | /api/[resource]/:id | [roles] | Get by ID |
| POST | /api/[resource] | [roles] | Create new |
| PATCH | /api/[resource]/:id | [roles] | Update existing |
| DELETE | /api/[resource]/:id | [roles] | Soft-delete |

## 6. Business Rules
1. [Rule description — e.g., "A load cannot be dispatched without an assigned carrier"]
2. [Rule description]
3. [Rule description]

## 7. Validation Rules
| Field | Rule | Error Message |
|---|---|---|
| [field] | [validation] | [message] |
| [field] | [validation] | [message] |

## 8. Status States
```
[INITIAL] --> [STATE_1] --> [STATE_2] --> [FINAL]
                  \--> [CANCELLED]
```

| Status | Description | Transitions To |
|---|---|---|
| [status] | [description] | [valid next states] |

## 9. Role Access Matrix
| Action | Super Admin | Admin | Manager | User | Carrier |
|---|---|---|---|---|---|
| Create | X | X | X | | |
| Read (own) | X | X | X | X | |
| Read (all) | X | X | | | |
| Update | X | X | X | | |
| Delete | X | X | | | |

## 10. Integration Points
- **Depends on:** [Other services this service calls]
- **Depended on by:** [Services that call this service]
- **External APIs:** [Third-party integrations]
- **Events emitted:** [WebSocket/event bus events]
- **Events consumed:** [Events this service listens to]

## 11. Performance Requirements
- **List endpoint:** < [X]ms for [Y] records
- **Detail endpoint:** < [X]ms
- **Write endpoint:** < [X]ms
- **Concurrent users:** [expected load]

## 12. Error Handling

> **Every error code MUST follow the `SERVICE_TYPE_SPECIFIC` format from the project's error catalog.** Each code listed here must also appear in `dev_docs/specs/catalogs/error-catalog.md`. The CROSS-REFERENCE-VALIDATOR Check 9 enforces this.
>
> **Target: 10+ error codes per service** covering: validation (3+), not-found (2+), conflict (2+), forbidden (1+), integration (1+), internal (1+).

| Error Code | HTTP Status | Trigger Condition | User Message | Recovery Action | Retry? |
|---|---|---|---|---|---|
| [SVC]_VALIDATION_[FIELD]_[RULE] | 422 | [exact trigger condition] | [user-safe message] | [what user should do] | No |
| [SVC]_NOT_FOUND_[ENTITY] | 404 | [exact trigger condition] | [user-safe message] | [what user should do] | No |
| [SVC]_CONFLICT_[SITUATION] | 409 | [exact trigger condition] | [user-safe message] | [what user should do] | No |
| [SVC]_FORBIDDEN_[ACTION] | 403 | [exact trigger condition] | [user-safe message] | [what user should do] | No |
| [SVC]_INTEGRATION_[PROVIDER]_FAILED | 502 | [exact trigger condition] | [user-safe message] | [what user should do] | Yes |
| [SVC]_INTERNAL_[CONTEXT] | 500 | [exact trigger condition] | [user-safe message] | [what user should do] | No |
<!-- Minimum 10 rows. Cover every error scenario from Business Rules and Edge Cases sections. -->
<!-- Format: SERVICE-PREFIX_ERROR-TYPE_SPECIFIC-CONTEXT in UPPER_SNAKE_CASE -->

## 13. Testing Strategy
- **Unit tests:** Business logic in service layer
- **Integration tests:** API endpoints with test database
- **Key scenarios:** [list critical test cases]
- **Edge cases:** [list edge cases to cover]

## 14. Migration Notes
- **New tables:** [list]
- **Schema changes:** [list]
- **Data backfill:** [describe if needed]
- **Breaking changes:** [list any]

## 15. Open Questions
- [ ] [Question that needs resolution]
- [ ] [Question that needs resolution]
