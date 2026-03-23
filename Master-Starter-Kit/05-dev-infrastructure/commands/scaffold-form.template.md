# /scaffold-form $ARGUMENT

Generate a form component with react-hook-form, zodResolver, and proper validation UI.

## Steps

1. **Read the Zod input schema** for the entity:
   ```
   packages/validators/src/$ARGUMENT.ts
   ```
   Extract the `create{Entity}Input` schema to determine fields, types, and validation rules.

2. **Read the router** to understand how the form submits data:
   ```
   packages/api/src/routers/$ARGUMENT.ts
   ```
   Identify the `create` and `update` mutation signatures.

3. **Determine form mode**: The component should support both "create" and "edit" modes via a `mode` prop. In edit mode, it receives `defaultValues` from an existing record.

4. **Map Zod types to form fields**:

   | Zod Type | Component | Import From |
   |----------|-----------|-------------|
   | `z.string()` | `<Input />` | `@{project}/ui` |
   | `z.string().email()` | `<Input type="email" />` | `@{project}/ui` |
   | `z.enum([...])` | `<Select />` | `@{project}/ui` |
   | `z.boolean()` | `<Checkbox />` | `@{project}/ui` |
   | `z.coerce.date()` | `<DatePicker />` | `@{project}/ui` |
   | `z.string().date()` | `<Input type="date" />` | `@{project}/ui` |
   | `z.number().int()` | `<Input type="number" />` | `@{project}/ui` |
   | FK `z.string().uuid()` | `<Combobox />` | `@{project}/ui` |
   | `z.string().min(100)` | `<Textarea />` | `@{project}/ui` |

5. **Generate the form component** at `apps/web/src/components/{entity}/{Entity}Form.tsx`:

   ```tsx
   "use client";

   import { zodResolver } from "@hookform/resolvers/zod";
   import { useForm } from "react-hook-form";
   import type { z } from "zod";
   import { create{Entity}Input } from "@{project}/validators";
   import { Button } from "@{project}/ui/button";
   import {
     Form,
     FormControl,
     FormDescription,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
   } from "@{project}/ui/form";
   import { Input } from "@{project}/ui/input";
   // ... import other field components as needed
   import { toast } from "sonner";
   import { trpc } from "~/lib/trpc";

   type FormValues = z.infer<typeof create{Entity}Input>;

   interface {Entity}FormProps {
     mode: "create" | "edit";
     defaultValues?: Partial<FormValues>;
     entityId?: string; // Required for edit mode
     onSuccess?: () => void;
   }

   export function {Entity}Form({
     mode,
     defaultValues,
     entityId,
     onSuccess,
   }: {Entity}FormProps) {
     const utils = trpc.useUtils();

     const form = useForm<FormValues>({
       resolver: zodResolver(create{Entity}Input),
       defaultValues: {
         // Provide safe defaults for every field
         // string fields: ""
         // number fields: 0
         // enum fields: first enum value
         // boolean fields: false
         ...defaultValues,
       },
     });

     const createMutation = trpc.{entity}.create.useMutation({
       onSuccess: () => {
         toast.success("{Entity} created successfully");
         utils.{entity}.list.invalidate();
         form.reset();
         onSuccess?.();
       },
       onError: (error) => {
         toast.error(error.message);
       },
     });

     const updateMutation = trpc.{entity}.update.useMutation({
       onSuccess: () => {
         toast.success("{Entity} updated successfully");
         utils.{entity}.list.invalidate();
         utils.{entity}.getById.invalidate({ id: entityId! });
         onSuccess?.();
       },
       onError: (error) => {
         toast.error(error.message);
       },
     });

     const isSubmitting = createMutation.isPending || updateMutation.isPending;

     function onSubmit(values: FormValues) {
       if (mode === "edit" && entityId) {
         // Only send changed fields in edit mode
         const dirtyFields = form.formState.dirtyFields;
         const changedValues: Record<string, unknown> = { id: entityId };
         for (const key of Object.keys(dirtyFields)) {
           changedValues[key] = values[key as keyof FormValues];
         }
         updateMutation.mutate(changedValues as any);
       } else {
         createMutation.mutate(values);
       }
     }

     return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           {/* Generate a FormField for each field in the schema */}
           <FormField
             control={form.control}
             name="{fieldName}"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>{Field Label}</FormLabel>
                 <FormControl>
                   <Input placeholder="{placeholder}" {...field} />
                 </FormControl>
                 <FormDescription>{Help text if needed}</FormDescription>
                 <FormMessage />
               </FormItem>
             )}
           />

           {/* Repeat for each field... */}

           <div className="flex justify-end gap-3">
             <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
               Cancel
             </Button>
             <Button type="submit" disabled={isSubmitting}>
               {isSubmitting
                 ? mode === "edit" ? "Saving..." : "Creating..."
                 : mode === "edit" ? "Save Changes" : "Create {Entity}"}
             </Button>
           </div>
         </form>
       </Form>
     );
   }
   ```

6. **Run typecheck**:
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```

7. **Output report**:
   ```
   FORM GENERATED
   ===============
   Entity: {entity}
   File: apps/web/src/components/{entity}/{Entity}Form.tsx
   Fields: {count} ({list of field names})
   Field Types: {list of component types used}
   Modes: create + edit
   Mutations: create, update
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **Always use zodResolver**: Never skip client-side validation. The same Zod schema validates on both client and server.
- **Every field shows errors**: Every `FormField` must include `<FormMessage />` for validation error display.
- **Edit mode uses dirtyFields**: Only send changed fields to the API, not the entire form. This prevents overwriting concurrent edits.
- **Loading state on submit**: Disable the submit button and show "Saving..." / "Creating..." during mutation.
- **Toast feedback**: Show success and error toasts. Use `sonner` (or your toast library).
- **Invalidate queries on success**: Call `utils.{entity}.list.invalidate()` to refresh list views after create/update.
- **FK fields use Combobox**: Foreign key references (UUID fields referencing another table) should use a searchable Combobox that queries the related entity's list endpoint.
