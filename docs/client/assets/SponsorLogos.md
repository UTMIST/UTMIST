# Sponsor logo assets

Sponsor records live in `features/public-site/data/home-sponsors.ts`. The mosaic
uses the original brand colours, preserves aspect ratios, and places artwork
directly on light or indigo tiles. Choose the tile background for the artwork's
contrast; do not invert, recolour, or add a backing panel to a logo.

Two assets have transparent PNG copies to remove baked-in white backgrounds.
Keep the originals for source comparison.

| Original | Transparent copy |
| --- | --- |
| `client/src/assets/logos/aerocoustics.webp` | `client/src/assets/logos/aerocoustics-transparent.png` |
| `client/src/assets/logos/pwc.webp` | `client/src/assets/logos/pwc-transparent.png` |

The copies were made by removing the white background while retaining the brand
artwork. For replacement assets, prefer official transparent exports and check
fine edges, counters in letters, and translucent colour overlaps against both
tile backgrounds. Modal's wordmark comes from its [official brand assets](https://modal.com/brand).

`components/sponsor-mosaic.tsx` stores optical bounds and contrast treatments.
Bounds crop excess file padding for display without stretching the artwork.
When adding a sponsor, check its scale beside wide and tall logos, its hover and
focus contrast, alphabetical ordering, and its position at each breakpoint.
Retain empty cells and a separate fading row so every logo remains visible.
