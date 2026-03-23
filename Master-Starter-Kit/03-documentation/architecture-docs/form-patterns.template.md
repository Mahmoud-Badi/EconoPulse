# Form Patterns — {{PROJECT_NAME}}

> **Every form in the app follows the same pattern:** react-hook-form + zodResolver + validators from the shared package. No exceptions.

---

## Form Architecture Stack

```
User Input
    ↓
react-hook-form (manages state, tracks dirty fields, handles submission)
    ↓
zodResolver (validates against Zod schema on blur/submit)
    ↓
Zod schema from @{PROJECT}/validators (shared with server)
    ↓
tRPC mutation (server validates again with same schema)
    ↓
Drizzle insert/update (database)
```

**Key insight:** The same Zod schema validates on BOTH client and server. Define once in `packages/validators/`, use everywhere.

---

## Field Type Mapping

Every data type maps to a specific UI component:

| Data Type | Zod Type | UI Component | Notes |
|-----------|----------|-------------|-------|
| Short text | `z.string()` | `<Input />` | Max 100 chars |
| Long text | `z.string()` | `<Textarea />` | Max 1000 chars |
| Email | `z.string().email()` | `<Input type="email" />` | |
| Phone | `z.string()` | `<Input type="tel" />` | Format on blur |
| Number | `z.number()` | `<Input type="number" />` | |
| Money | `z.number()` | `<MoneyInput />` | Display $, store cents |
| Enum/Status | `z.enum([...])` | `<Select />` | Dropdown |
| Boolean | `z.boolean()` | `<Checkbox />` or `<Switch />` | Switch for settings |
| Date | `z.date()` or `z.string()` | `<DatePicker />` | |
| DateTime | `z.date()` | `<DateTimePicker />` | With timezone |
| Time | `z.string()` | `<TimeInput />` | HH:MM format |
| UUID Foreign Key | `z.string().uuid()` | `<Combobox />` | Search + select |
| Multi-select FK | `z.array(z.string().uuid())` | `<MultiCombobox />` | Tags-style |
| File upload | `z.instanceof(File)` | `<FileUpload />` | Drag-drop zone |
| Rich text | `z.string()` | `<RichTextEditor />` | Markdown or HTML |
| Address | nested `z.object()` | `<AddressFields />` | Street, city, state, zip |

---

## Standard Form Template

### Create Form

```typescript
// apps/web/components/{entity}/{entity}-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  create{Entity}Schema,
  type Create{Entity}Input,
} from "@{PROJECT}/validators";
import { api } from "~/lib/trpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@{PROJECT}/ui";
import { Input, Select, Button, DatePicker, Combobox } from "@{PROJECT}/ui";
import { Loader2 } from "lucide-react";

interface {Entity}FormProps {
  defaultValues?: Partial<Create{Entity}Input>;
  mode?: "create" | "edit";
  entityId?: string; // Required for edit mode
}

export function {Entity}Form({
  defaultValues,
  mode = "create",
  entityId,
}: {Entity}FormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm<Create{Entity}Input>({
    resolver: zodResolver(create{Entity}Schema),
    defaultValues: defaultValues ?? {
      name: "",
      status: "{DEFAULT_STATUS}",
      {field}: {DEFAULT_VALUE},
      // ... all fields with defaults
    },
  });

  const createMutation = api.{entity}.create.useMutation({
    onSuccess: () => {
      utils.{entity}.list.invalidate();
      toast.success("{Entity} created successfully");
      router.push("/{entities}");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = api.{entity}.update.useMutation({
    onSuccess: () => {
      utils.{entity}.list.invalidate();
      utils.{entity}.getById.invalidate({ id: entityId! });
      toast.success("{Entity} updated successfully");
      router.push(`/{entities}/${entityId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: Create{Entity}Input) => {
    if (mode === "edit" && entityId) {
      // Only send changed fields
      const dirtyFields = form.formState.dirtyFields;
      const changedData = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          dirtyFields[key as keyof typeof dirtyFields]
        )
      );
      updateMutation.mutate({ id: entityId, ...changedData });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* TEXT FIELD */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ENUM/SELECT FIELD */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FOREIGN KEY COMBOBOX */}
        <FormField
          control={form.control}
          name="{relatedEntity}Id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{Related Entity}</FormLabel>
              <Combobox
                options={relatedEntities?.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Search {related entities}..."
                emptyMessage="No {related entities} found"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DATE FIELD */}
        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Date</FormLabel>
              <DatePicker
                date={field.value}
                onDateChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create {Entity}" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## Money Handling

> **Critical rule:** Display dollars to the user, store cents in the database.

```typescript
// packages/validators/src/{entity}.ts
export const create{Entity}Schema = z.object({
  // User sees "$125.50", we store 12550
  amount: z.number()
    .min(0, "Amount cannot be negative")
    .transform((val) => Math.round(val * 100)), // dollars → cents
});

// Display helper
export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

// Input helper: MoneyInput component
// - Shows "$" prefix
// - Allows decimal input (e.g., "125.50")
// - Stores as cents internally
```

---

## Form Checklist

Every form in the project MUST have:

- [ ] `zodResolver` with schema from `@{{PROJECT}}/validators`
- [ ] `FormMessage` on every field (displays Zod errors)
- [ ] Loading spinner on submit button (`isSubmitting` state)
- [ ] Submit button disabled during submission
- [ ] Success toast on completion
- [ ] Error toast on failure (with API error message)
- [ ] Cancel button (navigates back)
- [ ] Default values for all fields
- [ ] Dirty field tracking in edit mode (only send changed fields)
- [ ] Keyboard accessible (Tab through fields, Enter to submit)
- [ ] No horizontal scroll on mobile
- [ ] Field labels for every input (accessibility)

---

## Edit Mode vs Create Mode

| Aspect | Create Mode | Edit Mode |
|--------|------------|-----------|
| Default values | Empty/initial | Fetched from API |
| Submit endpoint | `{entity}.create` | `{entity}.update` |
| Payload | All fields | Only dirty fields + entity ID |
| Success redirect | List page | Detail page |
| Success message | "{Entity} created" | "{Entity} updated" |
| Delete button | No | Yes (with confirmation dialog) |

---

## Validation Patterns

```typescript
// packages/validators/src/{entity}.ts

// Base schema (shared fields)
const {entity}Base = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, "Invalid phone").optional(),
  status: z.enum(["{STATUS_1}", "{STATUS_2}", "{STATUS_3}"] as const),
  notes: z.string().max(1000).optional(),
});

// Create schema (all required fields)
export const create{Entity}Schema = {entity}Base;
export type Create{Entity}Input = z.infer<typeof create{Entity}Schema>;

// Update schema (all fields optional + required ID)
export const update{Entity}Schema = {entity}Base.partial().extend({
  id: z.string().uuid(),
});
export type Update{Entity}Input = z.infer<typeof update{Entity}Schema>;

// Filter schema (for list queries)
export const {entity}FilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["{STATUS_1}", "{STATUS_2}", "{STATUS_3}"] as const).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["name", "createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
```
