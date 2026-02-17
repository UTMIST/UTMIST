# Dropdown Component Documentation

## Overview

The `Dropdown` component wraps the shadcn `Select` primitives with UTMIST styling, behavioural defaults, and a simplified prop interface. It is intended for navigation menus, filter panels, and form inputs where a compact list of options is required.

## Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `items` | `DropdownItem[]` | Array of options with `label`, `value`, and optional `disabled`. |
| `placeholder` | `string` | Text shown when no value is selected. |
| `value` | `string` | Controlled value supplied by the parent. |
| `defaultValue` | `string` | Initial selection for uncontrolled usage. |
| `onValueChange` | `(value: string) => void` | Callback fired when the user selects an option. |
| `label` | `string` | Optional text label rendered above the control. |
| `helperText` | `string` | Guidance text shown below the control. |
| `error` | `string` | Validation message; also styles the trigger in an error state. |
| `disabled` | `boolean` | Disables the dropdown and dims the trigger. |
| `className` | `string` | Tailwind classes applied to the outer container. |
| `id` | `string` | Optional id forwarded to the trigger for accessibility. |
| `ariaLabel` | `string` | Accessible label used when no visual label is provided. |

## Usage

```tsx
import { useState } from "react";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";

const options: DropdownItem[] = [
  { label: "AI²", value: "ai2" },
  { label: "EigenAI", value: "eigenai" },
  { label: "ML Fundamentals", value: "mlf" },
];

export function Example() {
  const [value, setValue] = useState<string | undefined>();

  return (
    <Dropdown
      label="Department"
      placeholder="Select department"
      items={options}
      value={value}
      onValueChange={setValue}
      helperText="Filters events by department."
    />
  );
}
```

## Styling Notes

- Trigger, content, and option states follow UTMIST colour gradients (`#6B66E3` → `#1E19B1`).
- Scrollable lists use a custom scrollbar thumb that matches the gradient palette.
- Error message applies a red border and text accent.
- Additional spacing or width constraints can be applied via the `className` prop.

## Demo

Interactive examples are available at `/dev/dropdown` while developing locally.


