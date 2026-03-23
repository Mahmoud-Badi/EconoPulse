# Database Setup Guide

Database provisioning and configuration for multiple providers. Choose one, follow the steps, verify the connection.

---

## Supabase (Recommended for Starting)

**Why Supabase:** Free tier is generous (500MB, 2 projects), PostgreSQL (the best relational DB), built-in connection pooling, dashboard for data inspection.

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Set database password (save it — you will need it for connection strings)
4. Choose region closest to your users (or Vercel deployment region)
5. Wait for project to provision (~2 minutes)

### Step 2: Get Connection Strings

Go to Settings > Database > Connection String.

You need TWO connection strings:

**Pooler connection (Transaction mode) — for your application:**
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```
- Set this as `DATABASE_URL`
- Uses PgBouncer connection pooling (port 6543)
- Handles many concurrent connections efficiently

**Session/Direct connection — for migrations only:**
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```
- Set this as `DIRECT_URL`
- Direct connection (port 5432)
- Used by `drizzle-kit generate` and `drizzle-kit push`
- Not pooled — do not use for application traffic

### Step 3: Configure Connection

```typescript
// packages/db/src/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  ssl: "require",        // CRITICAL: Must be explicit, URL sslmode alone is insufficient
  max: 10,               // Connection pool size
  idle_timeout: 20,      // Close idle connections after 20 seconds
  connect_timeout: 10,   // Timeout connection attempts after 10 seconds
});

export const db = drizzle(client, { schema });
```

**Gotcha:** `ssl: "require"` must be set explicitly in the postgres.js options. Even if the connection string includes `?sslmode=require`, postgres.js ignores the URL parameter. This will cause silent connection failures.

### Step 4: Configure Drizzle Kit

```typescript
// packages/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL!,    // Use session connection for migrations
  },
});
```

### Step 5: Verify Connection

```bash
cd packages/db
npx tsx -e "
  import { db } from './src/client';
  const result = await db.execute('SELECT 1 as connected');
  console.log('Connected:', result[0]);
  process.exit(0);
"
```

---

## pgSchema Isolation

When sharing a database with other apps (e.g., V1 and V2 of the same project), use pgSchema to isolate tables:

```typescript
// packages/db/src/schema/_schema.ts
import { pgSchema } from "drizzle-orm/pg-core";

export const schema = pgSchema("v3");  // All V3 tables live in the "v3" schema
```

```typescript
// packages/db/src/schema/users.ts
import { schema } from "./_schema";

export const users = schema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  // ... columns
});
```

This creates tables as `v3.users` instead of `public.users`, preventing conflicts with other apps using the same database.

**Gotcha:** Use `drizzle-kit generate` (not `drizzle-kit push`) for pgSchema. The `push` command has bugs with enum qualification in non-public schemas.

---

## Neon

**Why Neon:** Serverless PostgreSQL, automatic scaling, branching (create database copies for preview deployments).

### Setup

1. Create database at [neon.tech](https://neon.tech)
2. Get connection string from Dashboard > Connection Details
3. Set `DATABASE_URL` to the pooled connection string
4. Set `DIRECT_URL` to the non-pooled connection string

```
DATABASE_URL=postgresql://user:pass@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:pass@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Neon-specific:** Supports database branching — create a branch for each PR, with a copy of your data. Configure in Vercel via the Neon integration.

---

## Self-Hosted (Docker)

**Why self-hosted:** Full control, no usage limits, works offline, free.

### Docker Compose

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Connection

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/myapp
```

**No SSL needed** for local development (remove `ssl: "require"` from postgres.js config, or make it conditional):

```typescript
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});
```

---

## Migration Workflow

### Generate Migration (After Schema Change)

```bash
cd packages/db
npx drizzle-kit generate
```

This creates a SQL migration file in `drizzle/` based on the diff between your schema files and the previous migration state.

### Apply Migration (Development)

```bash
cd packages/db
npx drizzle-kit push
```

Or apply the generated SQL:

```bash
npx drizzle-kit migrate
```

### Apply Migration (Production)

**Option A:** Run migration as part of the build process:
```json
{
  "buildCommand": "pnpm --filter @{project}/db migrate && pnpm --filter @{project}/web build"
}
```

**Option B:** Run migration manually before deploying:
```bash
DATABASE_URL=production-url npx drizzle-kit migrate
```

**Option C:** Run migration in a CI/CD step before deployment.

### Rollback

Drizzle does not auto-generate rollback scripts. For each migration, manually create a down migration:

```sql
-- drizzle/0001_create_users.sql (up)
CREATE TABLE "v3"."users" ( ... );

-- drizzle/0001_create_users_down.sql (down — manual)
DROP TABLE "v3"."users";
```

---

## Seed Data

Every project needs seed data. It makes development, testing, and demos possible without manual data entry.

```bash
# Run seed script
cd packages/db
npx tsx src/seed/index.ts
```

### Seed Script Structure

```
packages/db/src/seed/
  index.ts          # Orchestrator — calls all seeders in order
  users.ts          # Creates users with known credentials
  entities.ts       # Creates main domain entities
  relationships.ts  # Creates records that reference other tables
```

### Seed Orchestrator Pattern

```typescript
// packages/db/src/seed/index.ts
import { db } from "../client";
import { seedUsers } from "./users";
import { seedEntities } from "./entities";
import { seedRelationships } from "./relationships";

async function main() {
  console.log("Seeding database...");

  // Order matters — seed parents before children
  await seedUsers(db);
  await seedEntities(db);
  await seedRelationships(db);

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
```

### Tips

- Use a known password for all seed users (e.g., `Password123!`) for easy testing
- Cover all enum values in seed data (every status, every role)
- Create enough records to test pagination (20+ for main entities)
- Make seed idempotent (use upsert or clear-then-insert)
