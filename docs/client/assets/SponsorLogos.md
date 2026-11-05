# Sponsor logo assets

The homepage uses transparent background edits for two logos whose original
WebP files had opaque white backgrounds. The originals remain in the repository.
The built-in image editing tool was used with transparency enabled; the outputs
have alpha channels and no opaque white background pixels. The replacements
are consumed by the shared homepage sponsor data.

| Original | Transparent output |
| --- | --- |
| `client/src/assets/logos/aerocoustics.webp` | `client/src/assets/logos/aerocoustics-transparent.png` |
| `client/src/assets/logos/pwc.webp` | `client/src/assets/logos/pwc-transparent.png` |

## Edit prompts

### Aercoustics

Use case: background-extraction. Edit target: the attached existing aercoustics
sponsor logo. Remove ONLY the plain white background and replace it with genuine
alpha transparency, including background inside the letters and circular icon.
Preserve the ORIGINAL logo exactly: the blue and dark grey broken circular icon,
the thin grey lowercase text 'aercoustics', all letterforms, colours, positions,
proportions and edge detail. Do not redesign, redraw, recolour, thicken or add
anything. Preserve the source's wide canvas ratio and relative margins (source
274 by 90 pixels). Output one clean transparent PNG cutout, with no white
rectangle, checkerboard or shadow.

### PwC

Use case: background-extraction. Edit target: the attached existing PwC sponsor
logo. Remove ONLY the plain white background and replace it with genuine alpha
transparency, including the white gaps inside and between the lowercase letters.
Preserve the ORIGINAL logo exactly: black lowercase 'pwc' lettering in its exact
font and shape, the overlapping orange/red/yellow/magenta rectangular motif above
it, all original colours, translucent overlap colours, positions, proportions
and edges. Do not redesign, redraw, recolour, sharpen, thicken or add anything.
Preserve the source's square canvas and relative margins (source 600 by 600
pixels). Output one clean transparent PNG cutout with no white rectangle,
checkerboard or shadow.
