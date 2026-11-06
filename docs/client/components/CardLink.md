# Card link

Import `CardLink` from `@/shared/ui`. Its only visual variants are `flat`
(default, event and impact cards) and `raised` (sponsor tiles).

```tsx
<CardLink href="/projects" variant="raised">Project content</CardLink>
```

Both use a white surface, the shared brand border, 12px corners and identical
hover/focus colour feedback. Raised cards add a shadow and a 3px lift; reduced
motion disables the lift and transition. Layout and padding belong to the
caller. Do not add per-section surface or interaction overrides.

It renders one Next `Link`. HTTP(S) URLs default to a new tab; internal routes
stay in the current tab. `target` can override that choice. New-tab links always
include `noopener noreferrer`, preserving other supplied `rel` values. Children
must not contain nested interactive controls. Unknown impact destinations remain
non-interactive tiles rather than using a placeholder link.
