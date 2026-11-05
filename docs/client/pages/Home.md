# Home page

The route shell `client/src/app/(frontend)/page.tsx` re-exports the async server
page `features/public-site/pages/home.tsx`. It chooses between `home-legacy.tsx`
and `home-redesign.tsx` using `isWebRedesignEnabled()` from the shared server
barrel. `Web-Redesign` defaults Off; provider failures also keep the current site.

## Redesign

The hero fills at least the viewport (`100svh`), using Frame 96's blue background.
Its headline and subtitle follow the supplied screenshot: “North America’s Largest
Undergraduate Machine Learning Club” and “Where students learn, build, research,
and lead at the University of Toronto.” Join Us / Contact Us retain their destinations.
The first three existing statistics sit at the lower left on desktop and in a row
below the text on mobile; all six also appear in the impact section.
The remaining sections follow sandbox
frames **93 → 94 → 95**: sponsor grid and impact dashboard, dark
introduction/mission, and event cards.
The marketing copy, sponsor destinations, statistics, events, photos, MISTic R&D
and FAQ come from the existing site; sample Figma revenue, growth and attendance
figures are not used. The sponsor headline, description and “Learn more” label,
plus “Our footprint this year,” use the approved Figma wording.
MISTic R&D and FAQ remain below the referenced sections.

`components/home-impact-dashboard.tsx` renders Frame 93 (`25:1478`) with the
six existing statistics in a three-column, two-row desktop grid. It uses the
design's narrow icon rail, breadcrumb header, outlined cards, large values and
divided footers. The five sidebar SVGs are local exports from this Figma frame
under `public/home-redesign/dashboard/`; the brain reuses the site's logo.
The sidebar and summary labels are decorative, with no pretend navigation or
filters. “All time” describes the existing cumulative statistics; the mock
date range and growth percentages are omitted. Unknown CMS statistics retain
their full descriptions and receive a generic icon.
The panel extends below an overflow crop with a subtle bottom shadow and meets
the next dark section directly. All statistics and the CMS introduction remain
above the crop. Cards reflow to two columns on tablets and one on phones.

`readHomeImpact()` supplies the impact introduction and all six statistics to both versions.
During explicitly opted-in local development it reads the published
`content-sections` record with key `home-impact` through the shared typed
Payload adapter. Other runs use the existing static source while hosted CMS
selection remains in #495. A failed opted-in CMS read raises an error rather
than silently falling back. See the [reader recipe](../ContentReader.md).

The `features/public-site/data/home-{content,sponsors,events,faq}.ts` modules
hold shared site content. Editing sponsors, events or FAQ updates both versions.
`components/sponsor-mosaic.tsx` lays out the sponsor logos in a wide, sparse grid:
10 columns on desktop, seven on tablets and four on phones. Empty cells are
white with a subtle border. Sponsor tiles use two consistent backgrounds: light
periwinkle and indigo blue, selected for each original logo's contrast. Logos sit
directly on their tiles, with no additional backing panels. Bright wordmarks
and light artwork use indigo blue; darker artwork uses light periwinkle. The
current 19 sponsors are split into nine dark tiles and ten light tiles.
Display-only artwork bounds trim excess padding while preserving aspect ratios;
wide wordmarks share an optical width and taller marks share a height limit.
Logos are never recoloured or filtered in CSS. Sponsors read alphabetically from left
to right, with irregular empty gaps. Dark tiles are spaced across the rows;
backgrounds are assigned by the artwork rather than alternating indices.
The baked-in white backgrounds in Aercoustics and PwC have been removed in
transparent PNG copies; the original files remain available. See
[sponsor asset notes and edit prompts](../assets/SponsorLogos.md).
The final decorative row fades to the page background without obscuring logos.
Sponsor tiles lift with a shadow on hover and keyboard focus. Dark tiles keep
their opaque indigo background and gain a cyan inner border, so the hover state
remains distinct without changing logo contrast. Reduced motion disables lift.
The adjacent sponsor copy uses a responsive 32–48px heading, 18–20px supporting
text and the large `PillLink` variant. Its desktop alignment accounts for the
empty fade row so the copy centers beside the populated grid.
All sponsors remain linked; Modal uses its official light wordmark
from [Modal's brand assets](https://modal.com/brand), stored in `assets/logos/modal.png`.
The legacy intro/statistics retain their prop-driven components and animation:
[OrganizationImpact](../components/OrganizationImpact.md),
[Statistics](../components/Statistics.md).

## Shared website shell and UI

`Web-Redesign` also selects the new **shared** navbar on frontend pages; the
EigenAI route family retains its own navigation. The navbar is not owned by
or imported from the homepage feature:

- `shared/ui/navbar.tsx` selects the original or redesigned navigation.
- `shared/ui/redesigned-navbar.tsx` implements the glass navigation from the
  Figma general page, Desktop - 2 (`22:102`). It overlays
  the new homepage and uses a dark background on other pages. It preserves
  About, Projects, Events, Sponsors, Careers, Programs, and Login/Profile.
- On desktop, one grid with equal outer columns positions the logo, links and
  Login/Profile. The disclosure wrapper uses `display: contents` on desktop so
  no nested grids affect alignment. The pill is capped at 620px with 14–16px
  text; mobile uses a scrollable disclosure anchored below the header.
- The mobile disclosure closes on navigation or Escape; Escape restores focus.
  Events and its chevron form one link to `/events`; hovering or keyboard focus
  reveals EigenAI. On touch, the first tap opens the submenu and a second tap
  follows Events. Programs reveals MISTic R&D and MLF on hover or button press.
  Only one submenu opens at a time; Escape closes it and restores focus.
- `PillLink`, exported from `@/shared/ui`, composes the existing `Button` with
  Next's `Link` and an arrow. Its `light` option works on dark sections; `size="lg"`
  gives the sponsor section a larger label and arrow without changing other CTAs.
  The light option follows Frame 94 (`25:1737`): a compact translucent pill,
  fine white border, 15px label and 24px blue arrow circle. Its small visual
  height has an extended pointer target; on phones the pill itself is at least
  44px tall. The circle and arrow are the original
  local Figma SVGs in `public/redesign/`, rendered at their exported dimensions.
- The About photo has no UTMIST call overlay. The mission network is implemented
  by `components/home-discipline-network.tsx`, using twelve real shared `Button`
  components, Lucide icons and SVG connections to recreate Figma `25:1782`.
  Hover or keyboard focus previews a discipline's connections; click, Enter or
  Space pins it. Selecting it again or pressing Escape clears the selection.
  `aria-pressed` exposes selection, and previewing another pill does not change
  the pinned selection. The four staggered desktop rows reflow to two columns
  when their container is narrow. The two About/Mission CTAs remain links.
  Highlights spread through the whole graph at 220ms per connection: the lines
  draw outward and each pill softly lights up as the wave reaches it. Clearing
  or leaving the network fades the retained glow over 1.2 seconds. React only
  updates on interactions; CSS runs the wave, and reduced motion uses instant
  static highlights. Decorative layers restart without replacing focused buttons.
- The EigenAI homepage event card uses `EigenAIEventArtwork` from the shared UI
  barrel, also used by the Events page. The Conference ’26 lockup, lambda,
  rings and gradient are composed from the existing brand components and assets.
  The GenAI Genesis card uses the existing group photo at `public/genai.webp`.
  The CUCAI card uses `public/home-redesign/cucai-conference.webp`, sourced from
  [CUCAI's official gallery](https://cucai.ca/) ([original photo](https://cucai.ca/gallery3.png)).
  It is a local WebP copy of their 1920px optimized image; the top-aligned crop
  keeps the speaker and CUCAI banner visible.
- Typography reuses the installed Instrument Sans; styling uses Tailwind,
  existing tokens/gradients, and scoped stylesheets in
  `features/public-site/styles/home-redesign.css` and
  `shared/ui/redesigned-navbar.css`.

## Responsive layout

The redesign shares one [scroll-motion system](../components/HomeScrollEffects.md)
for section entrances, staggered cards and sponsor tiles, the community text
selection, and the network's introductory wave. Motion respects reduced-motion
preferences and preserves the underlying server-rendered content and layout.

- Below 1024px the hero headline wraps naturally, with the brain icon kept next
  to “Machine.” The three hero statistics are centered below the actions in a
  bounded row, with each number centered over its label. Desktop retains the
  left-aligned statistics column.
- Sponsor copy is centered above the mosaic on phones and tablets, returning
  to left-aligned copy beside the mosaic on desktop. Below 640px the mosaic
  uses five columns and six complete rows, retaining all 19 logos, their order,
  light/dark treatments, deliberate gaps, and a separate fading row.
- The impact dashboard keeps six cards in two columns on phones, hides its
  decorative sidebar, and aligns the card titles, numbers and descriptions.
  Tablet and desktop retain the sidebar; desktop uses three columns. The bottom
  of the frame still disappears into the following section as in Figma.
- Phone body copy uses 16px text with relaxed leading and 20px page gutters.
  The mission card loses its inset border on phones so its copy aligns with
  the section. Network labels wrap inside larger two-column pill rows.
- Event cards share a flex layout that aligns their footer links across each
  desktop row. FAQ rows and phone CTAs have at least 44px touch targets.
- Homepage footer styles are scoped to the redesign: larger social targets,
  three-column wrapping on the narrowest screens, and visible keyboard focus.
  Social links have explicit accessible names. The shared scroll-to-top control
  is a native button and respects reduced-motion preferences.

`shared/lib/flags/web-redesign.ts` memoizes the flag with React `cache()` for
one request, keeping the layout and homepage consistent. It awaits `connection()`
so frontend rendering evaluates live flags per request instead of baking the
value into a static build. The layout is retained during client navigation;
refresh the page after changing a dashboard value or browser override.

## Assets and checks

`public/home-redesign/hero-background.webp` is a compressed copy of Frame 96's
background image. `utmist-wordmark.png` is the supplied general-page navbar
wordmark. Small interface icons are also local Figma assets; the remaining
photos come from existing site assets or the credited CUCAI gallery above. Figma screenshots and the mission
network's raster reference are not rendered as page content.

The redesigned Events introduction and community statement use the approved
screenshot wording: “A full year of events, built entirely by @utmist,” followed
by the EigenAI-to-GenAI-Genesis introduction and the 500+ student statement.
The highlighted phrase is “projects, research, workshops.”
`components/home-community-statement.tsx` reproduces the complete Figma
`25:1038` editor composition as live HTML: a 689.396px text measure, Instrument
Sans 600 at 47.363px/49.213px, seven reference lines, a single selected line,
four-degree rotation and the version/review/date and formatting annotations.
Container-relative sizing scales the composition on tablets. Below 640px, the
text reflows at a readable size with a gentler gradient and two-degree rotation;
the tiny decorative editor controls are hidden. Desktop retains the full Figma
composition and edge fade. The composition rotates around its center at every
breakpoint, without a horizontal offset, to stay aligned with the introduction.
The toolbar annotations are decorative and excluded from keyboard navigation
and the accessibility tree; the statement remains selectable and readable by
assistive technology. Original icons and guide lines are local SVGs under
`public/home-redesign/community/`.
The text uses Figma `25:1040`'s horizontal blue/violet gradient, fading to
near-transparent at its left and right edges. The selected phrase has opaque
lilac ends and crisp handles. Forced-color mode restores the system text color.

`components/home-hero-background.tsx` isolates the canvas and keyboard-accessible
pause control. `lib/hero-light-shaders.ts` procedurally recreates the blue light,
fluted glass and fine grain. The ribs stay fixed and vertical;
mouse/pen movement gently attracts the light to the pointer,
and leaving the hero returns it to an ambient path. Touch keeps the ambient
motion. Cursor travel is eased and capped at 18% of the normalized viewport per
second, with a slower blend when entering/leaving the hero, to avoid sudden
light jumps. Ambient light moves on roughly 80–125-second cycles. The text and
statistics stay stationary.

`lib/hero-light-renderer.ts` owns WebGL resources and uses animation frames
without updating React state on every frame. Rendering stops when paused, when
the hero is offscreen, or when the tab is hidden. Reduced-motion preferences
produce a still shader, disable pointer motion and hide the pause control.
The canvas renders at the display's native pixel density, subject only to GPU
dimension limits, and resizes with the viewport. The local
Figma still remains underneath as a fallback if WebGL is unavailable or its
context is lost. Listeners, observers and GPU resources are released on unmount.
No video, new dependency or remote animation asset is needed.

Behavior tests cover both homepage variants, content propagation, CTA links,
shared navbar selection, authenticated destinations, mobile navigation, Events/Programs
and route changes, plus the background pause/resume control and keyboard/reduced-motion
scroll-to-top behavior. Presentation and marketing copy are not pinned by tests.
See [feature flags](../flags.md#website-redesign) for preview instructions.
