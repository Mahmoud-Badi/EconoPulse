# Mock Server Generator

> Generates an API mock server from the API contract registry for **{{PROJECT_NAME}}**. Mock data is derived from the seed data plan, response shapes match actual DTOs, and error scenarios are simulated for frontend development without backend dependencies.

---

## Output

All generated files go to: `{{PROJECT_ROOT}}/dev_docs/mocks/`

```
dev_docs/mocks/
├── server.ts                    # Entry point — starts the mock server
├── README.md                    # Run instructions and configuration
├── config.ts                    # Port, latency, error rate settings
├── fixtures/
│   ├── {{SERVICE_1_SLUG}}.fixtures.ts
│   ├── {{SERVICE_2_SLUG}}.fixtures.ts
│   ├── {{SERVICE_3_SLUG}}.fixtures.ts
│   └── shared.fixtures.ts       # Common entities used across services
├── handlers/
│   ├── {{SERVICE_1_SLUG}}.handlers.ts
│   ├── {{SERVICE_2_SLUG}}.handlers.ts
│   └── {{SERVICE_3_SLUG}}.handlers.ts
└── utils/
    ├── delay.ts                  # Latency simulation
    ├── errors.ts                 # Error response factory
    └── pagination.ts             # Paginated response wrapper
```

---

## Generation Source

| Input | Location | Purpose |
|-------|----------|---------|
| API Contract Registry | `{{API_CONTRACT_REGISTRY_PATH}}` | Endpoint definitions, request/response shapes |
| Seed Data Plan | `{{SEED_DATA_PLAN_PATH}}` | Realistic fixture data |
| DTO Definitions | `{{DTO_DEFINITIONS_PATH}}` | TypeScript types for response shapes |
| OpenAPI Spec (if exists) | `{{OPENAPI_SPEC_PATH}}` | Auto-generate handlers from spec |

---

## Generation Instructions

### Step 1: Extract Endpoints

Read the API contract registry and build a list of all endpoints:

| Method | Path | Service | Request Body | Response Shape | Auth Required |
|--------|------|---------|-------------|----------------|---------------|
| GET | `/api/{{RESOURCE_1}}` | {{SERVICE_1}} | — | `{{RESPONSE_DTO_1}}[]` | Yes |
| POST | `/api/{{RESOURCE_1}}` | {{SERVICE_1}} | `{{CREATE_DTO_1}}` | `{{RESPONSE_DTO_1}}` | Yes |
| GET | `/api/{{RESOURCE_1}}/:id` | {{SERVICE_1}} | — | `{{RESPONSE_DTO_1}}` | Yes |
| PATCH | `/api/{{RESOURCE_1}}/:id` | {{SERVICE_1}} | `{{UPDATE_DTO_1}}` | `{{RESPONSE_DTO_1}}` | Yes |
| DELETE | `/api/{{RESOURCE_1}}/:id` | {{SERVICE_1}} | — | `{ success: true }` | Yes |

### Step 2: Generate Fixtures

For each service, generate fixture data derived from the seed data plan:

- Use realistic values — no `"test"`, `"foo"`, `"bar"`, or `"Lorem ipsum"`
- Fixture counts: minimum {{FIXTURE_COUNT_MIN}}, maximum {{FIXTURE_COUNT_MAX}} per entity
- All IDs use the project's ID format: {{ID_FORMAT}} (e.g., `cuid`, `uuid`, `nanoid`)
- Dates use ISO 8601 format
- Monetary values use cents (integer), not dollars (float)
- Fixtures must be type-safe — import and satisfy the DTO type

### Step 3: Generate Handlers

For each endpoint, generate a handler that:

- Accepts the correct request shape
- Returns the correct response shape (matching the actual DTO exactly)
- Supports filtering and pagination for list endpoints
- Returns appropriate HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500)

### Step 4: Generate Entry Point

The `server.ts` file must:

- Start on port `{{MOCK_SERVER_PORT}}` (default: 4000)
- Register all handlers
- Log each request to stdout: `[MOCK] GET /api/trips → 200 (45ms)`
- Support `--port` and `--delay` CLI flags

---

## Error Simulation Requirements

The mock server must support simulating error scenarios for robust frontend testing.

### Error Modes

| Mode | Behavior | Activation |
|------|----------|------------|
| Normal | All requests succeed | Default |
| Random errors | {{ERROR_RATE_PERCENTAGE}}% of requests return 500 | `?errorRate=10` query param |
| Specific error | Named endpoint returns specified error | `X-Mock-Error: 404` header |
| Timeout | Request hangs for {{TIMEOUT_DURATION}}ms | `X-Mock-Timeout: 5000` header |
| Unauthorized | All requests return 401 | `X-Mock-Auth: expired` header |

### Standard Error Response Shape

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "{{RESOURCE_TYPE}} with id '{{ID}}' not found",
    "statusCode": 404
  }
}
```

---

## Latency Simulation

| Setting | Default | Description |
|---------|---------|-------------|
| Base delay | {{BASE_LATENCY_MS}}ms | Minimum delay on every response |
| Random jitter | 0-{{JITTER_MAX_MS}}ms | Added randomly to simulate network variance |
| Slow mode | {{SLOW_MODE_MS}}ms | Simulates degraded performance |

Activate slow mode: set `MOCK_SLOW=true` environment variable.

---

## README Template

The generated `README.md` must include:

1. **Quick start:** `pnpm mock:start` or `npx tsx dev_docs/mocks/server.ts`
2. **Available endpoints:** Table of all mocked endpoints
3. **Configuration:** Environment variables and CLI flags
4. **Error simulation:** How to trigger errors for testing
5. **Adding new endpoints:** Step-by-step for extending the mock server
6. **Fixture customization:** How to modify seed data

---

## Integration with Development Workflow

### Package.json Scripts

```json
{
  "scripts": {
    "mock:start": "tsx dev_docs/mocks/server.ts",
    "mock:start:slow": "MOCK_SLOW=true tsx dev_docs/mocks/server.ts",
    "mock:reset": "tsx dev_docs/mocks/reset.ts"
  }
}
```

### Frontend Configuration

When running against the mock server, the frontend should point to:

```env
NEXT_PUBLIC_API_URL=http://localhost:{{MOCK_SERVER_PORT}}
```

---

## Validation Checklist

Before the mock server is considered complete:

- [ ] Every endpoint in the API contract registry has a corresponding handler
- [ ] All response shapes match the actual DTOs (type-checked)
- [ ] Fixture data is realistic and derived from the seed data plan
- [ ] Error simulation works for all documented modes
- [ ] Latency simulation is configurable
- [ ] README is generated with run instructions
- [ ] `pnpm mock:start` works without errors
- [ ] Frontend can run end-to-end against the mock server
