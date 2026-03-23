# GraphQL Schema Documentation: {{PROJECT_NAME}}

> Generated during Orchestrator Step 10 (API Contract Registry) when `{{API_STYLE}}` is `graphql`.
> This document maps every screen to GraphQL operations and tracks implementation status.

---

## Schema Files

| File | Domain | Types | Queries | Mutations | Subscriptions |
|------|--------|-------|---------|-----------|---------------|
| `common.graphql` | Shared | {{COUNT}} | 0 | 0 | 0 |
| `{{DOMAIN_1}}.graphql` | {{DOMAIN_1_DISPLAY}} | {{COUNT}} | {{COUNT}} | {{COUNT}} | {{COUNT}} |
| `{{DOMAIN_2}}.graphql` | {{DOMAIN_2_DISPLAY}} | {{COUNT}} | {{COUNT}} | {{COUNT}} | {{COUNT}} |
| `{{DOMAIN_3}}.graphql` | {{DOMAIN_3_DISPLAY}} | {{COUNT}} | {{COUNT}} | {{COUNT}} | {{COUNT}} |

---

## Shared Types (common.graphql)

```graphql
scalar DateTime
scalar JSON

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type ValidationError {
  field: String!
  message: String!
  code: String
}

type AuthorizationError {
  message: String!
}

type NotFoundError {
  entityType: String!
  id: ID!
}
```

---

## Screen-to-Operation Mapping

| Screen | Queries Used | Mutations Used | Subscriptions |
|--------|-------------|---------------|---------------|
| {{SCREEN_1}} | `{{QUERY}}` | `{{MUTATION}}` | — |
| {{SCREEN_2}} | `{{QUERY}}` | `{{MUTATION}}` | `{{SUBSCRIPTION}}` |
| {{SCREEN_3}} | `{{QUERY}}` | — | — |

---

## Per-Domain Schema

### {{DOMAIN_1_DISPLAY}}

**Types:**

```graphql
type {{ENTITY}} {
  id: ID!
  # {{FIELDS_FROM_DATABASE_SCHEMA}}
  createdAt: DateTime!
  updatedAt: DateTime!
}

type {{ENTITY}}Connection {
  edges: [{{ENTITY}}Edge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type {{ENTITY}}Edge {
  cursor: String!
  node: {{ENTITY}}!
}
```

**Queries:**

```graphql
type Query {
  {{ENTITY_LOWER}}(id: ID!): {{ENTITY}}
  {{ENTITY_LOWER_PLURAL}}(
    first: Int
    after: String
    filter: {{ENTITY}}Filter
    orderBy: {{ENTITY}}OrderBy
  ): {{ENTITY}}Connection!
}

input {{ENTITY}}Filter {
  status: [{{ENTITY}}Status!]
  search: String
  # {{ADDITIONAL_FILTERS}}
}

enum {{ENTITY}}OrderBy {
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_DESC
  # {{ADDITIONAL_SORT_FIELDS}}
}
```

**Mutations:**

```graphql
type Mutation {
  create{{ENTITY}}(input: Create{{ENTITY}}Input!): Create{{ENTITY}}Payload!
  update{{ENTITY}}(id: ID!, input: Update{{ENTITY}}Input!): Update{{ENTITY}}Payload!
  delete{{ENTITY}}(id: ID!): Delete{{ENTITY}}Payload!
}

input Create{{ENTITY}}Input {
  # {{FIELDS_REQUIRED_FOR_CREATION}}
}

input Update{{ENTITY}}Input {
  # {{FIELDS_THAT_CAN_BE_UPDATED}}
}

union Create{{ENTITY}}Payload = {{ENTITY}} | ValidationError | AuthorizationError
union Update{{ENTITY}}Payload = {{ENTITY}} | ValidationError | NotFoundError
union Delete{{ENTITY}}Payload = {{ENTITY}} | NotFoundError | AuthorizationError
```

---

## Implementation Status

| Operation | Schema | Resolver | DataLoader | Tests | Status |
|-----------|--------|----------|------------|-------|--------|
| `{{QUERY_1}}` | {{DONE_OR_TODO}} | {{DONE_OR_TODO}} | {{DONE_OR_TODO}} | {{DONE_OR_TODO}} | {{STATUS}} |
| `{{MUTATION_1}}` | {{DONE_OR_TODO}} | {{DONE_OR_TODO}} | N/A | {{DONE_OR_TODO}} | {{STATUS}} |

---

## DataLoader Registry

| Loader | Batches By | Used In Resolvers |
|--------|-----------|-------------------|
| `{{ENTITY_LOWER}}ById` | `id` | {{RESOLVER_LIST}} |
| `{{ENTITY_LOWER_PLURAL}}By{{RELATION}}Id` | `{{RELATION_LOWER}}Id` | {{RESOLVER_LIST}} |

---

## Subscription Topics

| Topic | Payload Type | Filter By | Triggered By |
|-------|-------------|-----------|-------------|
| `{{ENTITY_LOWER}}.created` | `{{ENTITY}}` | `organizationId` | `create{{ENTITY}}` mutation |
| `{{ENTITY_LOWER}}.updated` | `{{ENTITY}}` | `organizationId`, `id` | `update{{ENTITY}}` mutation |
| `{{ENTITY_LOWER}}.statusChanged` | `{{ENTITY}}` | `organizationId`, `assigneeId` | Domain state transitions |

---

## Security Rules

- All queries filter by `organizationId` from auth context (tenant isolation)
- All mutations verify role-based permissions before executing
- Query depth is limited to **10 levels**
- Query complexity is limited to **1000 points**
- Introspection is **disabled** in production
- Persisted queries are **enabled** in production (no arbitrary queries from clients)
