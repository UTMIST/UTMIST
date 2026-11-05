# Home page

The route shell `client/src/app/(frontend)/page.tsx` re-exports
`features/public-site/pages/home.tsx`. The server page chooses `home-legacy.tsx`
or `home-redesign.tsx` through `isWebRedesignEnabled()` from `@/shared/lib/server`.
The same request-scoped decision selects the shared navbar. `Web-Redesign`
defaults Off and fails closed; refresh after changing its value. See
[flag setup and preview instructions](../flags.md#website-redesign).

## Content and components

| Source | Responsibility |
| --- | --- |
| `data/home-content.ts` | Shared introduction, mission, and startup copy |
| `data/home-events.ts` | Event IDs, titles, descriptions, destinations, categories, and artwork |
| `data/home-sponsors.ts` | Sponsor logos and destinations |
| `data/home-faq.ts` | Questions and answers shared by both layouts |
| `lib/home-impact.ts` | Typed impact introduction and statistics |
| `pages/home-redesign.tsx` | Section composition and homepage-specific marketing copy |

The impact reader supplies the hero's first three statistics and all dashboard
cards from the same data. Values describe cumulative community impact. It reads
Payload only in explicitly enabled local development; deployed runs use the
static source. Once local CMS mode is selected, missing or invalid content raises
an error. See the [content reader contract](../ContentReader.md).

Keep content separate from presentation. Event artwork and categories belong to
event records, not array positions or titles. Use stable event IDs as React keys.
The [event card](../components/HomeEventCard.md) renders those records and reuses
[EigenAI artwork](../components/EigenAIEventArtwork.md) from the shared library.
Recurring event cards use an edition-neutral caption; dated event pages own
their edition-specific content.

## Shared UI

Import primitives through `@/shared/ui` and interactive shell components through
`@/shared/ui/client`. Feature code must not import another feature's components.

- [PillLink](../components/PillLink.md) composes the shared `Button` and Next
  `Link`. All homepage CTAs share one size, including Contact Us.
- The hero pause control and discipline network use `Button`. The shared
  [navbar](../components/NavBar.md) and scroll-to-top control also use it.
- `EigenAIEventArtwork` is shared with the Events page.
- Event cards remain single links; FAQs use native `details`/`summary` elements.
  Decorative dashboard icons and editor annotations are not interactive controls.

## Layout and interactions

The blue hero fills at least `100svh`. Statistics sit beside the centered copy
on desktop and below it on smaller screens. `home-hero-background.tsx` owns the
pause control and canvas; `hero-light-renderer.ts` owns WebGL resources. The light
follows mouse/pen movement gently while the vertical ribs remain fixed. Rendering
stops when paused, offscreen, or in a hidden tab. Reduced motion uses a still
frame. A local background image covers unavailable or lost WebGL contexts.
Listeners, observers, and GPU resources are released on unmount.

The sponsor mosaic sorts names alphabetically and leaves deliberate empty
cells. It uses ten columns on desktop, seven on tablets, and five on phones.
Light and indigo backgrounds are chosen for each logo's contrast; logos are not
recoloured. Artwork bounds remove excess file padding without changing aspect
ratios. A separate empty row fades into the background, so no logo is obscured.
See [logo maintenance](../assets/SponsorLogos.md).

The impact dashboard uses three columns on desktop and two on smaller screens.
Its sidebar is decorative and hidden on phones. Only the bottom of the frame is
cropped; statistics and their descriptions remain visible. Unknown statistic
descriptions retain their full label and receive a generic icon.

The About section pairs a team photo with the introduction and mission. The
network's twelve buttons preview connections on hover/focus and pin a selection
on click, Enter, or Space. Selecting the same pill or pressing Escape clears it.
`aria-pressed` exposes the pinned state. Labels wrap into two-column rows on phones.

The community statement is selectable HTML with decorative editor annotations,
edge fading, and selection handles. Its composition scales on tablets and
reflows on phones, where small annotations are hidden. Decorative layers are
excluded from keyboard navigation and the accessibility tree. Forced-colour
mode restores system text colours.

[Scroll effects](../components/HomeScrollEffects.md) share timing and easing for
entrances, text highlights, and network waves. Content remains visible without
JavaScript and with reduced motion. Native browser scrolling is preserved.

## Assets and verification

The [Figma design](https://www.figma.com/design/NO6Ltgze2CTZucVxSdBwVf/utmist-website)
is the visual reference. Local exports live under `public/home-redesign/` and
`public/redesign/`. Photos come from existing site assets, except the CUCAI image
from its [official gallery](https://cucai.ca/) ([source](https://cucai.ca/gallery3.png)).
The page renders live components rather than screenshots of controls or text.

[Desktop](../assets/home-redesign/desktop.jpg) and
[mobile](../assets/home-redesign/mobile.jpg) captures show completed motion states.
When changing layout, check narrow phones through wide desktop for overflow,
centering, wrapping, contrast, and touch targets. Verify keyboard navigation,
menu dismissal, network selection, animation pause, reduced motion, and both
flag states. Behavior tests cover these controls and content propagation;
marketing copy and visual styling are not pinned by unit tests.
