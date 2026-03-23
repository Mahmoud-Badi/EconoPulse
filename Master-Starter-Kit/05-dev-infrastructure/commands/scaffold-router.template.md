# /scaffold-router $ARGUMENT

Generate a tRPC router with input validation, auth guards, and a test scaffold.

## Steps

1. **Read the router spec**:
   ```
   {DOCS_PATH}/api/routers/$ARGUMENT.md
   ```
   Extract:
   - List of procedures (name, type: query/mutation, auth level)
   - Input schemas for each procedure
   - Output types
   - Business logic requirements

2. **Read middleware patterns** to understand auth levels:
   ```
   packages/api/src/trpc.ts
   ```
   Identify available procedures: `publicProcedure`, `protectedProcedure`, `adminProcedure`.

3. **Generate Zod validators** at `packages/validators/src/$ARGUMENT.ts`:

   ```typescript
   import { z } from "zod";

   // List input (pagination + filters)
   export const list{Entity}Input = z.object({
     page: z.number().int().positive().default(1),
     limit: z.number().int().min(1).max(100).default(20),
     search: z.string().optional(),
     status: z.enum([/* statuses from spec */]).optional(),
     sortBy: z.enum(["createdAt", "updatedAt", /* domain fields */]).default("createdAt"),
     sortOrder: z.enum(["asc", "desc"]).default("desc"),
   });

   // Get by ID
   export const get{Entity}Input = z.object({
     id: z.string().uuid(),
   });

   // Create input (all required fields)
   export const create{Entity}Input = z.object({
     // ... fields from spec, with proper Zod types
     // string: z.string().min(1).max(255)
     // email: z.string().email()
     // enum: z.enum(["value1", "value2"] as const)
     // money: z.number().int().nonnegative() (cents)
     // date: z.string().date() or z.coerce.date()
     // optional: z.string().optional()
     // FK: z.string().uuid()
   });

   // Update input (all fields optional except id)
   export const update{Entity}Input = z.object({
     id: z.string().uuid(),
   }).merge(create{Entity}Input.partial());

   // Delete input
   export const delete{Entity}Input = z.object({
     id: z.string().uuid(),
   });

   // Export types
   export type List{Entity}Input = z.infer<typeof list{Entity}Input>;
   export type Create{Entity}Input = z.infer<typeof create{Entity}Input>;
   export type Update{Entity}Input = z.infer<typeof update{Entity}Input>;
   ```

4. **Update validators barrel export** at `packages/validators/src/index.ts`:
   Add `export * from "./$ARGUMENT";`

5. **Generate the router** at `packages/api/src/routers/$ARGUMENT.ts`:

   ```typescript
   import { TRPCError } from "@trpc/server";
   import { and, desc, eq, ilike, sql } from "drizzle-orm";
   import { {tableName} } from "@{project}/db";
   import {
     create{Entity}Input,
     delete{Entity}Input,
     get{Entity}Input,
     list{Entity}Input,
     update{Entity}Input,
   } from "@{project}/validators";
   import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";

   export const {entity}Router = createTRPCRouter({
     list: protectedProcedure
       .input(list{Entity}Input)
       .query(async ({ ctx, input }) => {
         const { page, limit, search, status, sortBy, sortOrder } = input;
         const offset = (page - 1) * limit;

         const conditions = [];
         if (search) {
           conditions.push(ilike({tableName}.name, `%${search}%`));
         }
         if (status) {
           conditions.push(eq({tableName}.status, status));
         }
         // Soft-delete filter
         conditions.push(sql`${tableName}.deleted_at IS NULL`);

         const where = conditions.length > 0 ? and(...conditions) : undefined;

         const [items, countResult] = await Promise.all([
           ctx.db
             .select()
             .from({tableName})
             .where(where)
             .orderBy(sortOrder === "desc" ? desc({tableName}[sortBy]) : {tableName}[sortBy])
             .limit(limit)
             .offset(offset),
           ctx.db
             .select({ count: sql<number>`count(*)` })
             .from({tableName})
             .where(where),
         ]);

         return {
           items,
           total: Number(countResult[0]!.count),
           page,
           limit,
           totalPages: Math.ceil(Number(countResult[0]!.count) / limit),
         };
       }),

     getById: protectedProcedure
       .input(get{Entity}Input)
       .query(async ({ ctx, input }) => {
         const result = await ctx.db.query.{tableName}.findFirst({
           where: eq({tableName}.id, input.id),
           with: {
             // ... relations to include
           },
         });

         if (!result) {
           throw new TRPCError({ code: "NOT_FOUND", message: "{Entity} not found" });
         }

         return result;
       }),

     create: protectedProcedure
       .input(create{Entity}Input)
       .mutation(async ({ ctx, input }) => {
         const [created] = await ctx.db
           .insert({tableName})
           .values({
             ...input,
             // Add server-side defaults if needed
           })
           .returning();

         return created!;
       }),

     update: protectedProcedure
       .input(update{Entity}Input)
       .mutation(async ({ ctx, input }) => {
         const { id, ...data } = input;

         const [updated] = await ctx.db
           .update({tableName})
           .set({ ...data, updatedAt: new Date() })
           .where(eq({tableName}.id, id))
           .returning();

         if (!updated) {
           throw new TRPCError({ code: "NOT_FOUND", message: "{Entity} not found" });
         }

         return updated;
       }),

     delete: adminProcedure
       .input(delete{Entity}Input)
       .mutation(async ({ ctx, input }) => {
         // Soft delete
         const [deleted] = await ctx.db
           .update({tableName})
           .set({ deletedAt: new Date() })
           .where(eq({tableName}.id, input.id))
           .returning();

         if (!deleted) {
           throw new TRPCError({ code: "NOT_FOUND", message: "{Entity} not found" });
         }

         return { success: true };
       }),
   });
   ```

6. **Register in root router** at `packages/api/src/root.ts`:
   ```typescript
   import { {entity}Router } from "./routers/$ARGUMENT";
   // Add to createTRPCRouter:
   {entity}: {entity}Router,
   ```

7. **Generate test scaffold** at `packages/api/src/routers/__tests__/$ARGUMENT.test.ts`:

   ```typescript
   import { describe, it, expect, vi, beforeEach } from "vitest";

   describe("{entity} router", () => {
     beforeEach(() => {
       vi.clearAllMocks();
     });

     describe("list", () => {
       it("returns paginated results", async () => {
         // TODO: Implement with mock DB
         expect(true).toBe(true);
       });

       it("filters by status", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });

       it("requires authentication", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });
     });

     describe("getById", () => {
       it("returns a single record", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });

       it("throws NOT_FOUND for missing record", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });
     });

     describe("create", () => {
       it("creates with valid input", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });

       it("rejects invalid input", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });
     });

     describe("update", () => {
       it("updates existing record", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });
     });

     describe("delete", () => {
       it("soft-deletes the record", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });

       it("requires admin role", async () => {
         // TODO: Implement
         expect(true).toBe(true);
       });
     });
   });
   ```

8. **Run typecheck**:
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```

9. **Output report**:
   ```
   ROUTER GENERATED
   =================
   Entity: {entity}
   Files created:
   - packages/validators/src/$ARGUMENT.ts ({schema_count} schemas)
   - packages/api/src/routers/$ARGUMENT.ts ({procedure_count} procedures)
   - packages/api/src/routers/__tests__/$ARGUMENT.test.ts ({test_count} test cases)
   Files updated:
   - packages/validators/src/index.ts (barrel export)
   - packages/api/src/root.ts (router registration)
   Procedures: {list with auth levels}
   TypeScript: {PASS/FAIL}
   ```
