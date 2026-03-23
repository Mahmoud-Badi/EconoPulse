# API Catalog Generator

**Purpose:** Scan backend controller files for route decorators and produce a
comprehensive API endpoint registry with method, path, auth, status, and
screen-to-endpoint mapping.

**Output:** `dev_docs/api-catalog.md`

---

## When to Run

Run this generator:

- At project kickoff (baseline catalog of all existing endpoints)
- After adding new controllers or endpoints
- Before building a frontend screen (to verify which endpoints exist)
- After the Screen Catalog is generated (to cross-reference)

---

## Inputs Required

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Controller files | Backend controller directory (varies by framework) | Route decorators, method names |
| DTO files | DTO / schema directory | Request/response shapes |
| Guard / middleware files | Auth guards, middleware | Auth requirements |
| Module files | Module registration files | Controller registration |
| Service specs | `dev_docs/specs/services/*.md` | Expected endpoints |
| Screen catalog | `dev_docs/specs/screen-catalog.md` | Screen-to-endpoint mapping |

### Framework-Specific Scan Paths

| Framework | Controller pattern | Route decorator |
| --------- | ------------------ | --------------- |
| **NestJS** | `modules/*/controllers/*.controller.ts` | `@Get`, `@Post`, `@Patch`, `@Put`, `@Delete`, `@Controller` |
| **Express** | `routes/*.ts`, `controllers/*.ts` | `router.get`, `router.post`, etc. |
| **FastAPI** | `routers/*.py`, `api/*.py` | `@app.get`, `@router.get`, etc. |
| **Django** | `views.py`, `viewsets.py` | `path(`, `urlpatterns`, `ViewSet` |
| **Rails** | `controllers/*_controller.rb` | `resources :`, `get '`, `post '` |

---

## Scanning Algorithm

### Step 1: Find All Controllers

Glob for controller files using the framework-specific pattern above.

### Step 2: Extract Endpoints from Each Controller

For each controller file, extract:

| Field | How to Find |
| ----- | ----------- |
| **Controller prefix** | Class-level route decorator (e.g., `@Controller('loads')`) |
| **Method** | HTTP method decorator: `@Get`, `@Post`, `@Patch`, `@Put`, `@Delete` |
| **Sub-path** | Decorator argument: `@Get(':id')`, `@Post('bulk')` |
| **Full path** | Combine: `/api/{controller-prefix}/{sub-path}` |
| **Handler name** | Method name: `findAll()`, `create()`, `update()` |
| **Request DTO** | `@Body()` parameter type or request schema |
| **Response shape** | Return type annotation or API docs decorator |
| **Auth** | Guard decorators (`@UseGuards(JwtAuthGuard)`) or `@Public()` |
| **Roles** | Role decorators (`@Roles('admin')`) |
| **Query params** | `@Query()` parameter with DTO type |
| **URL params** | `@Param('id')` parameters |
| **Tenant isolated** | Whether tenantId filtering is applied |

### Step 3: Classify Endpoint Status

| Status | Criteria |
| ------ | ------- |
| **Production** | Has real business logic, calls service layer, handles errors, returns proper response |
| **Stub** | Route exists but returns hardcoded/mock data or throws "not implemented" |
| **Not Built** | Endpoint is needed (per spec) but no route exists |
| **Deprecated** | Endpoint exists but should not be used |

**How to determine status:**

- Read the handler method body
- If it calls `this.service.method()` with real logic: **Production**
- If it returns a hardcoded array or `{ message: 'not implemented' }`: **Stub**
- If a service spec lists it but no controller route exists: **Not Built**

### Step 4: Map Endpoints to Screens

Cross-reference with the screen catalog:

- For each screen, identify which API calls it makes (or will need to make)
- Flag screens whose required endpoints are stubs or not built
- Flag endpoints that no screen references (potentially unused)

### Step 5: Check Documentation Coverage

For each endpoint, check:

- Swagger/OpenAPI decorators exist (`@ApiTags`, `@ApiOperation`, `@ApiResponse`)
- JSDoc comments on the handler method
- DTO has validation decorators (`@IsString()`, `@IsNotEmpty()`, etc.)

---

## Catalog Output Format

Write to `dev_docs/api-catalog.md`:

```markdown
# API Endpoint Catalog

> **Total Endpoints:** {N}
> **Production:** {n} | **Stub:** {n} | **Not Built:** {n}
> **Documented (Swagger):** {n}/{N} ({percent}%)
> **Last Updated:** {date}

---

## Summary by Module

| Module | Controller | Total | Production | Stub | Not Built |
| ------ | ---------- | ----- | ---------- | ---- | --------- |
| Auth | AuthController | {n} | {n} | {n} | {n} |
| Loads | LoadsController | {n} | {n} | {n} | {n} |
| Carriers | CarriersController | {n} | {n} | {n} | {n} |
| ... | | | | | |
| **Total** | | **{N}** | **{n}** | **{n}** | **{n}** |

---

## Summary by HTTP Method

| Method | Count | Notes |
| ------ | ----- | ----- |
| GET | {n} | Read operations (list + detail) |
| POST | {n} | Create operations |
| PATCH | {n} | Partial update operations |
| PUT | {n} | Full replace operations |
| DELETE | {n} | Remove operations |

---

## Full Endpoint List

### Auth Module

| Method | Path | Handler | Request DTO | Response | Auth | Status | Docs |
| ------ | ---- | ------- | ----------- | -------- | ---- | ------ | ---- |
| POST | /api/auth/login | login | LoginDto | { token, user } | Public | Production | Yes |
| POST | /api/auth/register | register | RegisterDto | { token, user } | Public | Production | Yes |
| GET | /api/auth/me | getProfile | -- | UserDto | JWT | Production | No |

### Loads Module

| Method | Path | Handler | Request DTO | Response | Auth | Status | Docs |
| ------ | ---- | ------- | ----------- | -------- | ---- | ------ | ---- |
| GET | /api/loads | findAll | QueryDto | { data: Load[], meta } | JWT | Production | Yes |
| GET | /api/loads/:id | findOne | -- | Load | JWT | Production | Yes |
| POST | /api/loads | create | CreateLoadDto | Load | JWT | Production | No |
| PATCH | /api/loads/:id | update | UpdateLoadDto | Load | JWT | Production | No |
| DELETE | /api/loads/:id | remove | -- | void | JWT+Admin | Stub | No |

### Carriers Module

{same table format -- repeat for all modules}

---

## Screen-to-Endpoint Mapping

| Screen | Route | Endpoints Used | All Exist? | Missing |
| ------ | ----- | -------------- | ---------- | ------- |
| Load List | /loads | GET /api/loads | Yes | -- |
| Load Detail | /loads/[id] | GET /api/loads/:id, PATCH /api/loads/:id | Yes | -- |
| Load Create | /loads/new | POST /api/loads, GET /api/customers | No | GET /api/customers is stub |

---

## Response Envelope Pattern

Document the standard API response wrapper used across all endpoints:

### Success Response (single entity)

{describe shape, e.g.:}
{
  "data": { ... entity ... },
  "message": "Success"
}

### Success Response (list/paginated)

{describe shape, e.g.:}
{
  "data": [ ... entities ... ],
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}

### Error Response

{describe shape, e.g.:}
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}

**IMPORTANT for frontend:** All API calls must unwrap the envelope to extract
the `.data` property before passing to components. Failing to unwrap is a
common bug (components receive `{ data, meta }` instead of the array).

---

## Authentication & Authorization

### Auth Flow

{Describe: JWT in Authorization header, token refresh, session management}

### Role Matrix

| Endpoint Pattern | Admin | Manager | User | Public |
| ---------------- | ----- | ------- | ---- | ------ |
| GET /api/* (list) | Yes | Yes | Yes (own tenant) | No |
| GET /api/*/:id | Yes | Yes | Yes (own tenant) | No |
| POST /api/* | Yes | Yes | Limited | No |
| PATCH /api/*/:id | Yes | Yes | Own only | No |
| DELETE /api/*/:id | Yes | No | No | No |
| POST /api/auth/* | -- | -- | -- | Yes |

---

## Missing Endpoints

Endpoints needed by screens or specs but not yet built:

| Method | Path | Needed By | Priority | Task ID | Notes |
| ------ | ---- | --------- | -------- | ------- | ----- |
| GET | /api/customers | Load Create screen | P1 | {id} | Customer dropdown |
| POST | /api/loads/bulk | Load Import wizard | P2 | {id} | Batch creation |

---

## Unused Endpoints

Endpoints that exist but no screen references:

| Method | Path | Module | Action |
| ------ | ---- | ------ | ------ |
| GET | /api/debug/health | System | Keep (health check) |
| GET | /api/legacy/orders | Legacy | Remove or redirect |

---

## DTO Validation Coverage

| Module | Total DTOs | With Validation | Without Validation |
| ------ | ---------- | --------------- | ------------------ |
| Auth | {n} | {n} | {n} |
| Loads | {n} | {n} | {n} |
| Carriers | {n} | {n} | {n} |
| ... | | | |

---

## Status Tracking

Track implementation progress across the full stack:

| Status Code | Meaning |
| ----------- | ------- |
| DB | Database model / migration exists |
| API | Backend endpoint implemented and returning data |
| FE | Frontend calls the endpoint correctly |
| INT | Integration tested end-to-end |
| VER | Verified in staging/production |

### Endpoint Progress

| Endpoint | DB | API | FE | INT | VER |
| -------- | -- | --- | -- | --- | --- |
| GET /api/loads | x | x | x | | |
| POST /api/loads | x | x | | | |
| GET /api/carriers | x | x | x | x | |
```

---

## Validation Checklist

After generation, verify:

- [ ] Every `@Controller` class in the backend is represented
- [ ] Every route decorator (`@Get`, `@Post`, etc.) is captured
- [ ] Auth requirements are accurate (check guard decorators, not assumptions)
- [ ] Status classifications are correct (read handler body, do not guess)
- [ ] Screen-to-endpoint mapping covers all screens from the screen catalog
- [ ] Missing endpoints are identified with priority and task ID
- [ ] Response envelope pattern is accurately documented
- [ ] Role matrix matches actual guard/decorator configuration
- [ ] DTO validation coverage is checked (not assumed)
