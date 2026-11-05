# Pill link

`PillLink` is exported from `@/shared/ui`. It composes the shared `Button` with
Next's `Link` for homepage and other public-page calls to action.

```tsx
import { PillLink } from "@/shared/ui";

<PillLink href="/projects">Our projects</PillLink>
<PillLink href="/careers" light arrow="plain">Join us</PillLink>
<PillLink href="mailto:utorontomist@gmail.com" light variant="link" arrow="diagonal">
  Contact us
</PillLink>
```

All variants use a 48px height, 16px label and arrow, and 12px gap. Width fits the
label. The default circular arrow has a 36px background. `light` supplies white
text and, for the outlined variant, a translucent fill and white border.
`variant="link"` gives an unbordered action. `arrow` accepts `circle`, `plain`,
or `diagonal`; `className` supports contextual colours without separate sizing.

Use this component for link actions. Use `Button` for actions that change state.
Both inherit the shared focus styles; the arrow is decorative. Keep labels
short enough to fit on narrow screens and check new wording at the smallest
supported viewport.
