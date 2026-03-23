# Screen: [Screen Name]

## API Contracts

> Defines the agreed interface between frontend and backend for this screen.
> Both sides develop against this contract. Update it when the API changes.

---

| # | Endpoint | Method | Request | Response | Status |
|---|----------|--------|---------|----------|--------|
| 1 | /api/v1/[resource] | GET | Query params: page, limit, search, filters | { data: [], meta: { total, page, pageSize } } | DB / API / FE / INT / VER |
| 2 | /api/v1/[resource]/:id | GET | Path param: id | { data: { ...resource } } | DB / API / FE / INT / VER |
| 3 | /api/v1/[resource] | POST | Body: { field1, field2, ... } | { data: { ...created } } | DB / API / FE / INT / VER |
| 4 | /api/v1/[resource]/:id | PATCH | Body: { field1?, field2? } | { data: { ...updated } } | DB / API / FE / INT / VER |
| 5 | /api/v1/[resource]/:id | DELETE | Path param: id | { data: { success: true } } | DB / API / FE / INT / VER |

### Status Legend

Mark each layer as it becomes ready. Cross out incomplete layers.

- **DB** -- Database model exists (entity/schema defined, migration applied)
- **API** -- Backend endpoint implemented (controller + service + validation)
- **FE** -- Frontend calls the endpoint (hook/service wired up)
- **INT** -- Integration tested end-to-end (frontend to database round-trip works)
- **VER** -- Verified in staging/production (manually confirmed working)

### Example

| # | Endpoint | Method | Request | Response | Status |
|---|----------|--------|---------|----------|--------|
| 1 | /api/v1/loads | GET | page, limit, search, status, carrierId | { data: Load[], meta: { total, page, pageSize } } | DB / API / FE / ~~INT~~ / ~~VER~~ |
| 2 | /api/v1/loads/:id | GET | -- | { data: Load } | DB / API / FE / INT / ~~VER~~ |

---

## Request/Response Shapes

### List Response Envelope
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "field1": "value",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  },
  "message": null
}
```

### Single Resource Response Envelope
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "field1": "value",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  "message": null
}
```

### Error Response Envelope
```json
{
  "success": false,
  "data": null,
  "message": "Descriptive error message",
  "errors": [
    { "field": "field1", "message": "Field1 is required" }
  ]
}
```

---

## Error Cases

| HTTP Status | Error Code | Condition | Message |
|---|---|---|---|
| 400 | VALIDATION_ERROR | Invalid request body | Field-specific error details |
| 401 | UNAUTHORIZED | Missing or invalid token | "Authentication required" |
| 403 | FORBIDDEN | Insufficient role/permissions | "Insufficient permissions" |
| 404 | NOT_FOUND | Resource does not exist | "[Resource] not found" |
| 409 | CONFLICT | Duplicate or state conflict | Context-specific message |
| 500 | INTERNAL_ERROR | Unexpected server error | "An unexpected error occurred" |

---

## Notes

- [Any special handling, edge cases, rate limits, or known issues]
