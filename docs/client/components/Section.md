# Section

Import `Section` from `@/shared/ui`. It owns standard marketing section spacing
through `--ui-section-gap` (56px / 80px / 96px at mobile / 640px / 1024px) and composes `ContentContainer`
for consistent reading width and gutters.

```tsx
<Section aria-labelledby="program-heading" variant="tinted"
  contentClassName="grid gap-12 md:grid-cols-2">
  {/* Section content */}
</Section>
```

`variant="plain"` (default) and `variant="tinted"` are the only appearances.
Tinted sections add a soft accent surface and block borders. `contentClassName`
sets inner layout; `className` applies to the outer section. Pass its ID and
accessible heading association through normal section attributes. The hero
retains its specialized full-height layout; About uses this standard section.

Each section contributes half the shared gap as top and bottom padding, so
adjacent content blocks are separated by exactly one gap (plus any border).
Do not add per-section padding overrides. Nested About blocks and the event
community composition use the same token for their full vertical margins.
The standard footer contributes half the gap as well, matching the FAQ boundary.
Token values and breakpoints live in `app/globals.css`.
