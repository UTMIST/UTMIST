# Icon button

Import `IconButton` from `@/shared/ui`. `tone="light"` (default) and `tone="dark"`
are its only appearances. Every instance has a 44px circular target and 20px
icon; use `className` for positioning, not different sizes or colours.

```tsx
<IconButton tone="dark" aria-label="Pause animation" onClick={pause}>
  <Pause aria-hidden="true" />
</IconButton>
<IconButton asChild aria-label="Profile">
  <Link href="/profile"><User aria-hidden="true" /></Link>
</IconButton>
```

An accessible name is required. Actions default to `type="button"`, support
refs, disabled states and keyboard activation through `Button`. `asChild`
produces a single link and omits button-only `type` attributes. The homepage menu,
hero pause, scroll-to-top and footer social links share this primitive.

The underlying legacy `Button` retains its existing semantic variants. Its
explicit `iconSize="sm" | "md"` selects 16px or 20px SVGs; `IconButton` owns the
20px choice. Set a semantic variant through props rather than a glyph's width
attribute, which CSS sizing would override.
