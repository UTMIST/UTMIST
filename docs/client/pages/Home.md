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
| `data/home-content.ts` | Shared copy and shorter About/mission introductions for the redesigned layout |
| `data/home-events.ts` | Event IDs, titles, descriptions, destinations, categories, and artwork |
| `data/home-sponsors.ts` | Sponsor logos and destinations |
| `data/home-faq.ts` | Questions and answers shared by both layouts |
| `lib/home-impact.ts` | Typed impact introduction and statistics |
| `components/home-impact-tiles.tsx` | Linked statistic tiles in a dashboard frame cropped at the mission section |
| `pages/home-redesign.tsx` | Section composition and homepage-specific marketing copy |

The impact reader supplies the hero's first three statistics and all impact
tiles from the same data. Values describe cumulative community impact. It reads
Payload in explicitly enabled local development and Vercel Preview; Production
always uses the static source. Once CMS mode is selected, missing or invalid
content raises an error. See the [content reader contract](../ContentReader.md).

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
  `Link`. All homepage pill CTAs share one size and the same darker purple
  (`secondary`) arrow circle, including the hero, About, sponsors and
  startups sections. The `tone="dark"` prop adapts the label and outline for dark
  backgrounds without changing the arrow circle's colour.
- [ContentContainer](../components/ContentContainer.md) aligns the navbar and
  section content within a centered 80rem outer width and responsive gutters.
  Section backgrounds remain full width.
- The hero pause, mobile menu, scroll-to-top and footer social controls use
  [IconButton](../components/IconButton.md). The discipline network uses `Button`.
- [Section](../components/Section.md) owns standard vertical spacing with plain/tinted
  variants; [SectionIntro](../components/SectionIntro.md) owns heading and action rhythm.
- [CardLink](../components/CardLink.md) has flat event/impact and raised sponsor
  variants. Both share border, corner radius and keyboard/pointer feedback.
- [Badge](../components/Badge.md) has light/dark tones for categories and photo captions.
- [Footer](../components/Footer.md) owns its legacy/standard variants. The client
  shell selects the standard footer only on the flagged homepage.
- Use each primitive's documented variant or tone props. Keep layout classes
  at call sites and visual treatments in the library.
- `EigenAIEventArtwork` is shared with the Events page.
- Event cards remain single links; FAQs use native `details`/`summary` elements.
  Decorative tile icons and editor annotations are not separate interactive controls.

## Layout and interactions

### Typography and palette

`shared/ui/primitives.css` owns section typography; `styles/home-redesign.css`
defines the remaining homepage type roles. Use these
classes instead of giving each section its own size, weight, tracking or colour.
Instrument Sans is the interface and content font, including the scoped footer.
Sponsor logos and event wordmarks retain their own brand artwork.

| Role | Class | Phone / tablet / desktop |
| --- | --- | --- |
| Section heading | `ui-section-heading` | 32 / 36 / 40px, 600 weight, 1.15 line height |
| Card heading | `home-card-heading` | 20 / 24 / 24px, 600 weight |
| Section label | `ui-section-label` | 14px, 600 weight |
| Section introduction | `ui-section-copy` | 16 / 18 / 18px, 1.625 line height |
| Body text | `home-body` | 16px, 1.625 line height |
| Supporting text | `home-meta` | 14px, 20px line height |
| Compact caption | `home-caption` | 12px, 16px line height |

The typography breakpoints are 640px and 1024px. The hero title, statistic numbers
and community display composition remain distinct display roles. Highlighted
words use 700 weight. FAQ questions use 16 / 18 / 18px at 500 weight.

White sections use `--foreground`, `--muted-foreground`, and UTMIST's
`--secondary` indigo (`#1e19b1`). Borders and soft accents derive from that
indigo. Community text, selection handles, streams and toolbar accents share it.
The hero uses the `home-dark` colour context: white text, softened white body
copy and lilac labels. About's introduction and impact content use a white
surface, dark headings, muted body copy, indigo labels and light-tone CTAs.
Below the impact dashboard, the mission uses `#15026a` purple in a full-width
`home-mission` band with white text, lilac accents and a dark-tone CTA. Its palette
is scoped to that band. Fine indigo borders and a subtle interior tint define the impact dashboard.
MISTic R&D retains its separate tinted treatment.

### Sections

Section content is separated by `--ui-section-gap`: 56px on phones, 80px from
640px, and 96px from 1024px. `Section` contributes half on each edge, avoiding
doubled padding between neighbours. About's mission and impact blocks, both
sides of the community statement, and the standard footer use the same scale.
The full-height hero keeps its own internal composition.

Sections appear in this order: hero, About (white introduction, white impact
dashboard, purple mission band), sponsors, events, startups, and FAQ. Each About block
uses `ContentContainer` to maintain the shared horizontal alignment.

The blue hero fills at least `100svh`. The full University of Toronto Machine
Intelligence Student Team name is the primary heading, with the club's scale
claim above it. Statistics sit beside the centered copy on desktop and below it
on smaller screens. `home-hero-background.tsx` owns the
pause control and canvas; `hero-light-renderer.ts` owns WebGL resources. Three
parallel diagonal light bands span the viewport and follow mouse/pen movement
gently, retaining their spacing while the vertical ribs remain fixed. A dark
overlay keeps the reading area calm; the canvas retains native pixel density.
Pointer movement is captured on the document and checked against the hero's
bounds, so the navbar, dropdowns and other overlays do not block the light's
response or lose their own interactions. Leaving the hero or viewport, scrolling,
or switching windows releases the light back to its ambient path.
The 44px pause control lines up with the 44px scroll-to-top control at the hero's
initial viewport position: both sit 16px from the bottom with a 20px gap.
Rendering
stops when paused, offscreen, or in a hidden tab. Reduced motion uses a still
frame. A local background image covers unavailable or lost WebGL contexts.
The blue hero ends at a straight edge above the white About section. Its
canvas and fallback are clipped to the hero, with no extended backdrop, colour
interpolation, or fade mask. The renderer sizes the canvas to the hero itself;
its glass ribs, light bands and pointer response stay inside that boundary.
The fallback image is hidden only while the canvas is ready and returns on
context loss. About's introduction uses one shared section gap above it,
followed by the impact component's own top gap. The impact crop ends flush with
the purple mission band, which has one shared gap of padding on each edge.
Ambient motion follows elapsed time even at lower frame rates. Pointer tracking
uses a gentle exponential ease without a travel-speed cap: it starts responding
immediately and follows most of the cursor's movement within about two seconds,
including at 10fps. Pointer smoothing caps long frame gaps to avoid jumps;
ambient motion continues to follow elapsed time. Resuming resets the frame clock
so time spent paused or offscreen does not advance the animation.
Listeners, observers, and GPU resources are released on unmount.

The sponsor mosaic sorts names alphabetically and leaves deliberate empty
cells on tablets and desktops. It uses eight columns on desktop, seven on tablets,
and three on phones. Phone tiles use a wider 4:3 frame and center the final logo,
so wordmarks remain readable without adding rows of empty cells. Tablet and desktop
tiles remain square.
Occupied tiles use white backgrounds, indigo borders and soft shadows; logos are not
recoloured. Modal uses its official standalone symbol. Artwork bounds remove
excess file padding without changing aspect
ratios. Empty cells have no painted surface, giving the logos space without a
visible grid of empty boxes. Hover and keyboard focus add a light accent fill.
See [logo maintenance](../assets/SponsorLogos.md).

The [impact tiles](../components/HomeImpactTiles.md) sit above the mission
inside the white About content, within a light dashboard visual. Its decorative
rail and Community impact title bar frame three columns from 768px upward and two on
smaller screens. The dashboard is centered and capped at 896px, with compact
card padding and 30 / 36px statistic numbers. Individual white tiles use the shared
flat `CardLink`: indigo borders, rounded corners and accent hover/focus fill.
Each metric shows its icon, number and a single 14px medium-weight label.
The link's accessible name starts with its visible number and title, followed
by the complete source description.
The dashboard resets text and keyboard focus to the light-surface palette.
The smaller `home-card-heading` title and 16px introduction are centered above the
frame. The introductory projects action lives in Who We Are; the dashboard has
no redundant button above it. The frame's extra bottom
padding is cropped flush at the purple mission band's top edge; all statistics
and links remain visible with 24px clearance. There is no white gap between the
dashboard crop and the purple background. Each known statistic is
a full-tile Next.js link:

| Statistic | Destination |
| --- | --- |
| Developers | `/careers` |
| AI/ML Projects | `/projects` |
| Industry Partners | `/sponsors` |
| Academic Workshops | `/ml-fundamentals` |
| Articles & Notebooks | [DeMISTify on Medium](https://medium.com/demistify) (opens in a new tab) |
| Research Papers | `/projects` (the existing projects and research catalogue) |

Unknown CMS statistics keep their generic icon and full description without an
invented link. Destination mapping follows the statistic description, so
reordering CMS rows does not change their links.

The About introduction uses equal desktop columns, with copy first and the team
photo on the right, separated by an 80px gap. Below 1024px they stack in reading
order with a 40px gap. The photo displays at 552px wide on a full-width desktop
container, in a 12:7 frame anchored to the bottom. This removes only excess
ceiling from the 3:2 source while preserving every person and the full image
width. Its caption sits below the image rather than over the people. Its redesigned
copy lives in `homeRedesignContent`; the legacy layout retains `homeContent`.
Mission copy introduces the opportunities without repeating the heading, and
sits directly on the background, aligned with the introduction's left edge. Mission and
impact rows use the shared `--ui-section-gap`.
The diagram uses `#3730c6` blue-purple capsules, white labels,
lilac icons and fine lilac connections on the mission's deep purple background.
Cyan-to-lilac edges and cyan travelling waves highlight the connections.
Connection midpoints carry short lilac dashes with small cyan junction dots.
These decorative details track each responsive path layout, stay a fixed pixel
size and sit behind the pills without intercepting input or adding motion.
Each pill has one 2px border. Active pills turn that border cyan; the travelling
wave flashes a cyan/lilac tint across the filled capsule and blooms its soft halo,
then settles back. A blurred inner light adds brightness without a second stroke.
Pinning a hovered or focused pill restarts the flash on click, Enter or Space.
Keyboard focus thickens the same edge to 3px with an overlapping cyan outline,
so the opaque fill reaches a single continuous border in every state.
Capsules use 13px regular-weight labels and 16px icons. Above a 440px container
width they are 56px high, with single-line labels and widths that follow the label,
giving the graph varied silhouettes.
Brighter active nodes, a cyan ring and travelling cyan waves provide emphasis
on interaction. The
network's twelve buttons preview connections on hover/focus and pin a selection
on click, Enter, or Space. Selecting the same pill or pressing Escape clears it.
`aria-pressed` exposes the pinned state. At or below a 620px container width the
network uses two columns and six rows in a 528px canvas; the wider canvas is 400px
high. At or below 440px, the two-column layout uses a compact 480px canvas with
64px-high buttons. Full names wrap within each button at the same font size;
no discipline is hidden or abbreviated. Each layout has matching connection and
wave paths; the buttons, focus order and selected state are shared across layouts.

MISTic R&D's four benefit descriptions stack below 375px so narrow phones have
comfortable reading widths; larger screens retain the two-column benefit grid.

The community statement is selectable HTML with decorative editor annotations,
edge fading, and selection handles. Clean indigo streaks enter from both viewport
edges and taper toward the highlighted phrase. Their 5em height adds dark colour
without crossing the text. A lighter trailing stroke follows each streak;
both follow the composition's tilt and scale to the side gutters.
Misty rides the left streak with an indigo paintbrush, scaling with the side gutter.
The generated illustration is a temporary stand-in to replace with approved artwork.
The entire community composition is hidden below 1280px, where the text, editor
annotations and side artwork become cramped. The events introduction then leads
directly into flagship events with the standard section gap. Decorative layers are
excluded from keyboard navigation and the accessibility tree. Forced-colour
mode restores system text colours.

[Scroll effects](../components/HomeScrollEffects.md) share timing and easing for
entrances, text highlights, and network waves. Content remains visible without
JavaScript and with reduced motion. Native browser scrolling is preserved.
Text highlights use UTMIST's shared indigo token (`--secondary`, `#1e19b1`)
for their fill and handles on light surfaces, and `--home-lilac` inside dark
sections. Selected words use Instrument Sans 700.

Inline copy uses two emphasis treatments:

- **Scrolling highlight** (`home-selection`): the main message to remember from a
  section, with bold text, a scroll-filled background, and selection handles.
  Used for “all skill levels,” “together,” “flagship,” and “projects, research,
  workshops.” The community statement keeps its editor composition as a
  contextual presentation of this treatment.
- **Colour accent** (`home-accent`): quieter emphasis for names, identity, or
  attribution. It inherits the surrounding font weight, with no underline or
  fill. Used for “University of Toronto” in the hero subtitle and “@utmist.”
  It shares `--home-accent-color` with section labels: indigo on light surfaces
  and lilac inside `home-dark` sections.

Use one treatment per phrase and at most one short highlighted phrase per
section or distinct content block. Plain text is the default: About, impact,
FAQ, and the generic “the future” wording do not need accents. Underlines are
not used for decorative text emphasis.

## Assets and verification

The [Figma design](https://www.figma.com/design/NO6Ltgze2CTZucVxSdBwVf/utmist-website)
is the visual reference. Local exports live under `public/home-redesign/` and
`public/redesign/`. Photos come from existing site assets, except the CUCAI image
from its [official gallery](https://cucai.ca/) ([source](https://cucai.ca/gallery3.png)).
The page renders live components rather than screenshots of controls or text.
The [Misty illustration notes](../assets/home-redesign/misty-painting.md) record
the asset's source and replacement requirements.

[Desktop (1440px)](../assets/home-redesign/desktop.jpg) and
[mobile (390px)](../assets/home-redesign/mobile.jpg) captures show completed motion states.
Refresh these captures when the layout changes. Older comparison assets are design
history, not the reference for the maintained implementation.
When changing layout, check narrow phones through wide desktop for overflow,
centering, wrapping, contrast, and touch targets. Verify keyboard navigation,
menu dismissal, network selection, animation pause, reduced motion, and both
flag states. Behavior tests cover these controls and content propagation;
marketing copy and visual styling are not pinned by unit tests.
