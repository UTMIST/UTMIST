# EigenAI surfaces

The EigenAI redesign keeps its visual styling in Tailwind utilities colocated
with the feature components. It does not add EigenAI selectors to
`src/app/globals.css`.

## Reusable components

`EigenGlassSurface` in
`src/features/public-site/components/eigenai-surfaces.tsx` owns the shared
gradient-border pseudo-element and exposes four variants:

- `panel` for content cards and the event date pill
- `liquid` for the desktop navigation capsule
- `mobile` for the expanded mobile navigation surface
- `action` and `orb` for login and social links

Set `asChild` when the surface should style its single child link instead of
rendering a wrapper. `EigenSpeakerPortrait` contains the shared portrait-ring
treatment used by speaker cards.

`EigenAIWordmark` is a server component that renders a single text layer. Its
fill is `wordmark-mesh.webp`, a baked render of the Figma mesh-gradient shader,
which Tailwind sizes and positions over the glyph ink box. Its glass shimmer is
an inline SVG inner-shadow filter in `objectBoundingBox` primitive units. The
text span's box is sized in `em`, so the filter scales with the font and ships
in the server-rendered HTML with no client JavaScript. Changing that span's
line height or padding means updating `textBoxEm`. Each instance gets its own
filter id from `useId`. The optional cursor mask remains inline style data.

## Global chrome

The frontend layout wraps the standard site navbar, footer, and floating theme
toggle in `HideOnEigenAI`. The route-aware client component omits that shared
chrome on `/eigenai` and nested EigenAI routes, regardless of which feature-flag
variant is selected. The page selector restores the standard navbar, footer,
and floating theme toggle for the legacy branch, including flag-evaluation
failures. The redesign supplies its own navigation and footer instead.
