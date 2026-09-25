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

`EigenAIWordmark` uses a reusable internal layer component for its four text
layers. Its bespoke gradient and optional cursor mask remain inline style data;
all positioning, typography, opacity, masking configuration, and blending use
Tailwind utilities.

## Global chrome

The frontend layout wraps the standard site navbar, footer, and floating theme
toggle in `HideOnEigenAI`. The route-aware client component omits that shared
chrome on `/eigenai` and nested EigenAI routes, regardless of which feature-flag
variant is selected. The page selector restores the standard navbar, footer,
and floating theme toggle for the legacy branch, including flag-evaluation
failures. The redesign supplies its own navigation and footer instead.
