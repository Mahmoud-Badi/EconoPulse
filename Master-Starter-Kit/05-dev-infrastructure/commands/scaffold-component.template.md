# /scaffold-component $ARGUMENT

Generate an accessible, design-token-compliant component with variant support.

## Steps

1. **Read the component spec** (if documented):
   ```
   {DOCS_PATH}/design/COMPONENT-LIBRARY.md
   ```
   Find the section for `$ARGUMENT`. Extract: variants, sizes, states, props, accessibility requirements.

2. **Read design tokens** to understand available values:
   ```
   {DOCS_PATH}/design/DESIGN-TOKENS.md
   ```
   Or check `tailwind.config.ts` / CSS custom properties for colors, spacing, typography, shadows.

3. **Determine component location**:
   - `packages/ui/src/components/$ARGUMENT.tsx` -- if reusable across features (buttons, cards, badges, modals)
   - `apps/web/src/components/{feature}/$ARGUMENT.tsx` -- if feature-specific (trip-card, driver-status-badge)

4. **Generate the component**:

   ```tsx
   import * as React from "react";
   import { cva, type VariantProps } from "class-variance-authority";
   import { cn } from "@{project}/ui/lib/utils";

   const {component}Variants = cva(
     // Base styles (always applied)
     "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
     {
       variants: {
         variant: {
           default: "bg-primary text-primary-foreground hover:bg-primary/90",
           secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
           outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
           ghost: "hover:bg-accent hover:text-accent-foreground",
           destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
         },
         size: {
           sm: "h-8 px-3 text-xs",
           default: "h-10 px-4 py-2",
           lg: "h-12 px-6 text-base",
           icon: "h-10 w-10",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     },
   );

   export interface {Component}Props
     extends React.HTMLAttributes<HTMLDivElement>,
       VariantProps<typeof {component}Variants> {
     // Component-specific props
     asChild?: boolean;
   }

   const {Component} = React.forwardRef<HTMLDivElement, {Component}Props>(
     ({ className, variant, size, ...props }, ref) => {
       return (
         <div
           ref={ref}
           className={cn({component}Variants({ variant, size, className }))}
           {...props}
         />
       );
     },
   );
   {Component}.displayName = "{Component}";

   export { {Component}, {component}Variants };
   ```

5. **Accessibility checklist** -- verify the generated component includes:
   - [ ] `role` attribute if not a native semantic element
   - [ ] `aria-label` on icon-only interactive elements
   - [ ] `aria-expanded`, `aria-haspopup` for disclosure components
   - [ ] `tabIndex` for custom focusable elements
   - [ ] Keyboard event handlers (`onKeyDown` for Enter/Space on clickable divs)
   - [ ] Focus ring styles (`focus-visible:ring-2`)
   - [ ] Minimum 44x44px touch target for interactive elements

6. **Update barrel export**:
   - If in `packages/ui/`: Update `packages/ui/src/index.ts`
   - If in `apps/web/`: No barrel export needed

7. **Run typecheck**:
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```

8. **Output report**:
   ```
   COMPONENT GENERATED
   ====================
   Name: {Component}
   File: {file path}
   Variants: {list of variant names}
   Sizes: {list of size names}
   Props: {list of custom props}
   A11y: {checklist results}
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **Design tokens for ALL styling**: Never use hardcoded hex colors, arbitrary spacing (`p-[13px]`), or inline styles. Use Tailwind utility classes that map to design tokens.
- **`className` prop always accepted**: Every component must accept and merge a `className` prop via `cn()`.
- **`cn()` for class merging**: Use `cn()` (which wraps `clsx` + `tailwind-merge`) for conditional and merged classes.
- **`cva` for variants**: Use `class-variance-authority` for any component with multiple visual variants. Define variants as a const object, export the variants type.
- **`forwardRef`**: All components that wrap DOM elements should use `React.forwardRef` for ref forwarding.
- **Named exports**: Use `export { Component }`, not `export default Component`. Named exports enable tree-shaking and consistent imports.
- **No inline styles**: Never use `style={{ ... }}`. All styling through Tailwind classes.
- **Display name**: Set `Component.displayName` for DevTools debugging.
