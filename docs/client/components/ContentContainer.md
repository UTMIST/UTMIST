# Content container

`ContentContainer`, exported from `@/shared/ui`, gives the redesigned navbar and
homepage sections a shared centered width. It caps the outer box at `max-w-7xl`
(80rem), with 1.25rem gutters on phones, 2rem from `sm`, and 3rem from `lg`.
Section backgrounds can still span the viewport.

```tsx
import { ContentContainer } from "@/shared/ui";

<section className="bg-secondary">
  <ContentContainer className="py-16">Section content</ContentContainer>
</section>
```

Use `asChild` to apply the container directly to one semantic element, such as
`nav` or `section`. It uses the existing Radix Slot primitive and forwards native
div props. Keep section-specific grids and vertical spacing in the caller.

The component adds no state, effects, or fetching. Check alignment, wrapping,
and navigation centering across phone, tablet, and desktop widths when changing
its shared dimensions.
