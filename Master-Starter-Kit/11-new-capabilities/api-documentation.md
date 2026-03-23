# API Documentation

## Purpose

This guide defines how {{PROJECT_NAME}} documents its API surface. Good API documentation is generated from code, versioned alongside it, and available to both developers and external consumers. This is not about writing docs by hand -- it is about setting up the pipeline so documentation stays current automatically.

---

## OpenAPI/Swagger Spec Template

If you are building a REST API (or exposing a REST layer alongside tRPC), start with this base spec.

```yaml
# docs/api/openapi.yaml
openapi: 3.1.0
info:
  title: {{PROJECT_NAME}} API
  version: 1.0.0
  description: |
    REST API for {{PROJECT_NAME}}.
    Base URL: https://api.{{PRODUCTION_DOMAIN}}/v1
  contact:
    name: {{TEAM_NAME}}
    email: {{TEAM_EMAIL}}

servers:
  - url: https://api.{{PRODUCTION_DOMAIN}}/v1
    description: Production
  - url: https://api.staging.{{PRODUCTION_DOMAIN}}/v1
    description: Staging
  - url: http://localhost:{{API_PORT}}/v1
    description: Local development

security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    ErrorResponse:
      type: object
      required: [success, error]
      properties:
        success:
          type: boolean
          enum: [false]
        error:
          type: object
          required: [code, message, requestId]
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input"
            category:
              type: string
              enum: [VALIDATION, AUTH, NOT_FOUND, CONFLICT, USER_ERROR, INTEGRATION, SYSTEM]
            details:
              type: object
            requestId:
              type: string
              example: "req_abc123"

    PaginatedResponse:
      type: object
      properties:
        data:
          type: array
          items: {}
        pagination:
          type: object
          properties:
            page:
              type: integer
            pageSize:
              type: integer
            total:
              type: integer
            totalPages:
              type: integer

paths:
  /health:
    get:
      summary: Health check
      security: []
      responses:
        "200":
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
```

---

## Auto-Generation from Code

### Option A: tRPC with OpenAPI (recommended for tRPC projects)

```bash
pnpm add trpc-to-openapi --filter @{{PROJECT_NAME}}/api
```

```typescript
// packages/api/src/routers/users.ts
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const usersRouter = router({
  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/users",
        tags: ["Users"],
        summary: "List all users",
        description: "Returns a paginated list of users. Requires admin role.",
      },
    })
    .input(z.object({
      page: z.number().int().positive().default(1),
      pageSize: z.number().int().min(1).max(100).default(20),
    }))
    .output(z.object({
      data: z.array(UserSchema),
      pagination: PaginationSchema,
    }))
    .query(async ({ input, ctx }) => {
      // implementation
    }),
});
```

```typescript
// packages/api/src/openapi.ts
import { generateOpenApiDocument } from "trpc-to-openapi";
import { appRouter } from "./root";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "{{PROJECT_NAME}} API",
  version: "1.0.0",
  baseUrl: process.env.API_URL || "http://localhost:{{API_PORT}}",
});
```

### Option B: NestJS with Swagger Decorators

```typescript
// NestJS auto-generates from decorators
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  @Get()
  @ApiOperation({ summary: "List all users" })
  @ApiResponse({ status: 200, type: [UserDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(@Query() query: ListUsersDto) {
    return this.usersService.findAll(query);
  }
}
```

### Option C: FastAPI (Python) -- built-in

```python
# FastAPI generates OpenAPI automatically from type hints
@router.get("/users", response_model=PaginatedResponse[UserOut])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """List all users. Returns paginated results."""
    ...
```

---

## Documentation Hosting

### Swagger UI (interactive, try-it-out)

```typescript
// packages/api/src/docs.ts
import { serve, setup } from "swagger-ui-express";

// Express route
app.use("/docs", serve, setup(openApiDocument, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "{{PROJECT_NAME}} API Docs",
}));
```

### Redoc (cleaner read-only view)

```html
<!-- docs/api/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{PROJECT_NAME}} API Reference</title>
  <meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css?family=Inter:300,400,700" rel="stylesheet">
</head>
<body>
  <redoc spec-url="/api/openapi.json" expand-responses="200,201"></redoc>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</body>
</html>
```

---

## Endpoint Documentation Standards

Every endpoint must document these fields:

| Field | Required | Description |
|-------|----------|-------------|
| Summary | Yes | One-line description (shows in endpoint list) |
| Description | For complex endpoints | Multi-line explanation of behavior, side effects |
| Tags | Yes | Group by domain (Users, Orders, Billing) |
| Request body | If applicable | Full schema with examples |
| Response 200/201 | Yes | Success response with example |
| Response 4xx | Yes | All expected error codes with example bodies |
| Auth required | Yes | Which auth scheme, which roles |

Example per-endpoint doc block:

```yaml
/v1/orders/{orderId}/cancel:
  post:
    summary: Cancel an order
    description: |
      Cancels an order if it has not yet been shipped.
      Triggers a refund if payment was already captured.
      Sends cancellation email to the customer.
    tags: [Orders]
    security:
      - bearerAuth: []
    parameters:
      - name: orderId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [reason]
            properties:
              reason:
                type: string
                enum: [customer_request, out_of_stock, fraudulent, other]
          example:
            reason: "customer_request"
    responses:
      "200":
        description: Order cancelled successfully
      "404":
        description: Order not found
      "409":
        description: Order already shipped and cannot be cancelled
```

---

## API Versioning Strategy

**Recommendation: URL-based versioning** (`/v1/users`). It is explicit, easy to route, and requires no special client headers.

| Strategy | Pros | Cons |
|----------|------|------|
| URL-based `/v1/` | Simple, visible, easy to route | URL pollution |
| Header-based `Accept: application/vnd.api.v1+json` | Clean URLs | Hidden, harder to test |
| Query param `?version=1` | Simple | Easy to forget, caching issues |

```typescript
// URL-based versioning in Express
import { v1Router } from "./routers/v1";
import { v2Router } from "./routers/v2";

app.use("/v1", v1Router);
app.use("/v2", v2Router);
```

---

## API Changelog Workflow

Maintain a changelog at `docs/api/CHANGELOG.md`. Update it with every PR that changes the API.

```markdown
# API Changelog

## [v1.3.0] - 2025-03-15
### Added
- `POST /v1/orders/{id}/cancel` -- cancel an order with reason

### Changed
- `GET /v1/users` -- added `role` filter parameter

### Deprecated
- `GET /v1/users/search` -- use `GET /v1/users?q=` instead (removal in v1.5.0)

### Breaking (v2)
- `POST /v1/auth/login` response shape changed: `token` moved to `data.accessToken`
```

**Rule:** Breaking changes require a new major version. Deprecations must announce a removal version and timeline (minimum 3 months).

---

## SDK Generation from OpenAPI

Auto-generate typed client SDKs from your OpenAPI spec.

```bash
# Install openapi-typescript for TypeScript clients
pnpm add -D openapi-typescript --filter @{{PROJECT_NAME}}/shared

# Generate types
npx openapi-typescript docs/api/openapi.yaml -o packages/shared/src/api-types.ts
```

For full SDK generation (with fetch client):

```bash
# openapi-fetch: lightweight typed fetch client
pnpm add openapi-fetch --filter @{{PROJECT_NAME}}/web

# Generate and use
npx openapi-typescript docs/api/openapi.yaml -o packages/shared/src/api-types.ts
```

```typescript
// apps/web/src/lib/api-client.ts
import createClient from "openapi-fetch";
import type { paths } from "@{{PROJECT_NAME}}/shared/api-types";

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

// Fully typed -- autocomplete on paths, params, and responses
const { data, error } = await api.GET("/v1/users", {
  params: { query: { page: 1, pageSize: 20 } },
});
```

---

## Postman/Thunder Client Collection Export

Export your OpenAPI spec as a Postman collection for manual testing.

```bash
# Install openapi-to-postman
npx openapi-to-postmanv2 -s docs/api/openapi.yaml -o docs/api/postman-collection.json

# Or use Postman's import feature directly:
# Postman > Import > Upload File > select openapi.yaml
```

Store the collection in `docs/api/postman-collection.json` and keep it in version control. Add a CI step to regenerate it on API changes.

---

## Checklist

- [ ] OpenAPI spec exists and covers all endpoints
- [ ] Spec is auto-generated from code (not manually maintained)
- [ ] Swagger UI or Redoc hosted at `/docs`
- [ ] Every endpoint has summary, tags, request/response schemas, and error codes
- [ ] API versioning strategy chosen and applied (URL-based recommended)
- [ ] API changelog maintained and updated with each PR
- [ ] TypeScript SDK auto-generated from OpenAPI spec
- [ ] Postman collection available for manual testing
