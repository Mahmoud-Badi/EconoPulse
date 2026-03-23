# OpenAPI Spec Generator

## Purpose

Transform the API contract registry and service specs into a valid OpenAPI 3.1 specification (`openapi.yaml`). This enables auto-generated client SDKs, interactive API documentation, and contract testing.

## Input Requirements

Before running this generator, ensure these files exist:

1. **API contract files** in `dev_docs/specs/api/` — one per router/service
2. **Service specs** in `dev_docs/specs/services/` — for entity schemas
3. **Auth design** in `dev_docs/specs/architecture/` — for security schemes

## Generation Process

### Step 1: Extract Endpoints

For each API contract file, extract:
- HTTP method (GET, POST, PUT, PATCH, DELETE)
- Path (e.g., `/api/v1/users/:id`)
- Request body schema (from Zod schemas or TypeScript types in the contract)
- Response schema (success and error shapes)
- Query parameters
- Path parameters
- Authentication requirements (public, authenticated, role-based)
- Tags (group by service name)

### Step 2: Build Component Schemas

For each entity in the service specs:
- Create a schema component with all fields, types, and constraints
- Include `required` fields
- Use `$ref` for shared schemas (e.g., `Pagination`, `ErrorResponse`, `TimestampFields`)

### Step 3: Define Security Schemes

From the auth design:
- Bearer token (JWT)
- API key (if applicable)
- OAuth2 flows (if applicable)
- Cookie-based session (if applicable)

### Step 4: Assemble OpenAPI Document

Generate `dev_docs/specs/api/openapi.yaml`:

```yaml
openapi: 3.1.0
info:
  title: {{PROJECT_NAME}} API
  version: 1.0.0
  description: Auto-generated from service specs and API contracts

servers:
  - url: http://localhost:{{BACKEND_PORT}}/api/v1
    description: Local development
  - url: https://{{PROJECT_SLUG}}.{{HOSTING_PROVIDER}}.app/api/v1
    description: Production

tags:
  - name: {service-name}
    description: {service one-liner from spec}
  # ... one tag per service

paths:
  /endpoint:
    get:
      tags: [{service}]
      summary: {from contract}
      operationId: {camelCase unique ID}
      parameters: [...]
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/{Entity}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    {Entity}:
      type: object
      properties: {...}
      required: [...]

    Pagination:
      type: object
      properties:
        page: { type: integer }
        pageSize: { type: integer }
        total: { type: integer }
        totalPages: { type: integer }

    ErrorResponse:
      type: object
      properties:
        error:
          type: object
          properties:
            code: { type: string }
            message: { type: string }
          required: [code, message]

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  responses:
    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

### Step 5: Validate

After generating:
1. Check that every endpoint in the API contracts appears in the OpenAPI spec
2. Check that every entity schema matches the service spec
3. Verify `$ref` paths resolve correctly
4. Ensure no duplicate `operationId` values

## Output

- **Primary:** `dev_docs/specs/api/openapi.yaml`
- **Optional:** `dev_docs/specs/api/openapi.json` (JSON version for tools that prefer it)

## Integration

Once generated, this file can be used with:
- **Swagger UI** or **Redocly** for interactive API docs
- **openapi-typescript** for auto-generated TypeScript types
- **Orval** or **openapi-generator** for client SDK generation
- **Prism** for API mocking during frontend development
- **Schemathesis** for fuzz testing the API
