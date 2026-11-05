# Sponsor logo assets

Sponsor records live in `features/public-site/data/home-sponsors.ts`. The mosaic
uses the original brand colours, preserves aspect ratios, and places artwork
directly on white tiles with subtle indigo borders and shadows. Use official artwork with
enough contrast against that surface; do not invert, recolour, or add a backing
panel to a logo.

Two assets have transparent PNG copies to remove baked-in white backgrounds.
Keep the originals for source comparison.

| Original | Transparent copy |
| --- | --- |
| `client/src/assets/logos/aerocoustics.webp` | `client/src/assets/logos/aerocoustics-transparent.png` |
| `client/src/assets/logos/pwc.webp` | `client/src/assets/logos/pwc-transparent.png` |

The copies were made by removing the white background while retaining the brand
artwork. For replacement assets, prefer official transparent exports and check
fine edges, counters in letters, and translucent colour overlaps against the
tile background. The mosaic uses Modal's official transparent standalone symbol
at `client/src/assets/logos/modal-mark.png`, downloaded unchanged from the
[official logo article](https://modal.com/blog/what-is-modals-logo)
([source PNG](https://modal-cdn.com/modal-logo-icon.png)). Its wordmark remains in
the shared sponsor data for the legacy layout.

`components/sponsor-mosaic.tsx` stores optical bounds and display-only logo variants.
Bounds crop excess file padding for display without stretching the artwork.
When adding a sponsor, check its scale beside wide and tall logos, its hover and
focus contrast, alphabetical ordering, and its position at each breakpoint.
Phone tiles use three columns and a 4:3 frame to enlarge wordmarks; the final
sponsor is centered. Retain the unpainted empty cells for spacing on tablets
and desktops, where tiles stay square. Only occupied cells have a visible
tile surface; hover and keyboard focus add the light accent fill and indigo edge.
