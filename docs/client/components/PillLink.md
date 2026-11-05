# Pill link

Import `PillLink` from `@/shared/ui`. It composes `Button` with Next `Link` and
has exactly two appearances: `tone="light"` (default) and `tone="dark"`.

```tsx
<PillLink href="/projects">Our projects</PillLink>
<PillLink href="/careers" tone="dark">Join us</PillLink>
```

Both use a 56px height, 16px medium-weight label, 20px arrow, 12px gap and 40px circular arrow
background. The circle has a balanced 7px inset inside the 1px border; label-side
padding is 24px. Grow height and arrow together to preserve the capsule proportions.
The circle always uses `secondary` (`#1e19b1`) with a white arrow,
including in the hero. The dark tone uses white text, a transparent fill and
muted lilac outline. Each tone uses the shared focus and hover tokens.

All homepage pill CTAs use this component without section colour overrides.
The former `light`, `arrow` and `variant` props are replaced by `tone`; alternate
arrow/link shapes were unused and are no longer separate visual variants.
`className` is for layout. Keep action labels in sentence case and check wrapping
at the smallest supported viewport. Use `Button` or `IconButton` for state changes.
