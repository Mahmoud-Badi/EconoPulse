/**
 * Story Template
 *
 * Copy this file when creating stories for a new component.
 * Replace all instances of `ComponentName` with the actual component name.
 *
 * This is a STATIC file — no template variables. Copy and adapt directly.
 *
 * Steps:
 *   1. Copy this file to sit alongside your component
 *   2. Rename to `YourComponent.stories.tsx`
 *   3. Replace `ComponentName` with your component name
 *   4. Replace `Category` with the sidebar group (e.g., Primitives, Domain/Loads)
 *   5. Update argTypes to match your component's props
 *   6. Add story variants that cover meaningful states
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

// ---------------------------------------------------------------------------
// Meta — defines sidebar placement, controls panel, and defaults
// ---------------------------------------------------------------------------
const meta: Meta<typeof ComponentName> = {
  // Sidebar path: 'Category/ComponentName'
  title: 'Category/ComponentName',

  // The component being documented
  component: ComponentName,

  // Generate docs page automatically from JSDoc + props
  tags: ['autodocs'],

  // Customize the controls panel
  argTypes: {
    // Select control — renders as dropdown
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },

    // Select control — size options
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
      table: {
        defaultValue: { summary: 'md' },
      },
    },

    // Boolean control — renders as toggle
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },

    // Text control — renders as text input
    children: {
      control: 'text',
      description: 'Content inside the component',
    },

    // Action — logs events in the Actions panel
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },

  // Default args applied to all stories (can be overridden per story)
  args: {
    children: 'ComponentName',
    variant: 'default',
    size: 'md',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// ---------------------------------------------------------------------------
// Stories — each export is a separate story in the sidebar
// ---------------------------------------------------------------------------

/** Default state with no modifications */
export const Default: Story = {
  args: {},
};

/** Outline variant */
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

/** Ghost variant */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

/** Small size */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/** Large size */
export const Large: Story = {
  args: {
    size: 'lg',
  },
};

/** Disabled state */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * All variants side by side for visual comparison.
 * Uses a custom render function instead of args.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
    </div>
  ),
};

/**
 * All sizes side by side for visual comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

/**
 * Interactive test — validates behavior using play functions.
 * Requires @storybook/addon-interactions.
 */
// export const InteractionTest: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const element = canvas.getByRole('button');
//     await userEvent.click(element);
//     await expect(element).toBeVisible();
//   },
// };
