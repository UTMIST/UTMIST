# EigenAI page

`/eigenai` serves the published event page. Its content, search/social
metadata, and main-site navigation link do not depend on a feature flag or
provider availability.

## Location

- Route shell: `client/src/app/(frontend)/eigenai/page.tsx` — re-exports the
  feature page and static `metadata`.
- Feature entry: `client/src/features/public-site/pages/eigenai.tsx` — defines
  metadata and renders the launched view through a route-compatible, no-prop wrapper.
- Presentation: `client/src/features/public-site/pages/eigenaiRedesign.tsx`.

The page supplies its own navigation and footer. The frontend layout suppresses
its standard controls through `HideOnEigenAI`, leaving one set of controls.
Neither the page nor the layout evaluates the retired `Eigen-AI-Redesign` flag.
The feature view uses local content without evaluating a rollout flag.

## Route selection

The EigenAI route renders its event view unconditionally. Neither the homepage's
`Web-Redesign` flag nor a flag-provider failure changes that selection.
Changing the presentation requires a code change; CMS availability is controlled
separately by `CMS-Access`. See [flag configuration](../flags.md).

## Search and social metadata

The feature entry defines the title, description, canonical URL, Open Graph
fields, and Twitter card. Keep these aligned with the event content when changing
an edition. Social cards use `eigenai-conference.webp`, with its dimensions and
alternative text. The imported photo's hashed asset URL changes with the asset.

Metadata uses the public production origin in every environment and does not
depend on a feature flag. The route is also listed in `public/sitemap.xml`.

## Content contract and fixtures

`EigenAIRedesign` accepts `content?: EigenAIPageContent`. The types live in
`features/public-site/types/eigenai.ts`; default content lives in
`features/public-site/data/eigenai-redesign.ts`. Passing no prop uses the default
fixture. The contract covers the date
and location labels, metrics, About paragraphs/image, keynote, speakers,
workshops, schedule and its optional notice, venue, sponsors, and closing copy.

The data module exports three review fixtures:

- `eigenAIContent`: the 2026 event content and existing EigenAI event photography.
- `eigenAIUnannouncedContent`: empty lineup, workshops, schedule, venue, and sponsors.
- `eigenAILongContent`: long speaker names, roles, bios, and workshop titles,
  with optional photos, links, and host names omitted.

For a local preview, pass a fixture explicitly:

```tsx
<EigenAIRedesign content={eigenAIUnannouncedContent} />
```

An absent keynote is omitted. Empty sections show announcement placeholders and
retain their anchor targets. An empty schedule day shows an announcement message.
Speakers without a photo show decorative initials; a supplied `profileURL`
makes the name a link. Optional speaker bios wrap below the role. Image sources
may be static imports or strings; remote image hosts must be allowed by
`next.config.ts`. Future readers should supply `EigenAISpeaker` objects to the
same [EigenAISpeakerCard](../components/EigenAISpeakerCard.md) used here.

### Content sources and maintenance

`data/eigenai-redesign.ts` is the maintained public content snapshot. Its event
details come from the organizer's master sheet and linked workshop/panel schedule;
organizer-supplied names, affiliations, and portraits supplement those sources.
The page does not fetch planning documents at runtime.

When updating the event, confirm the public schedule and speaker information
with the organizers. Keep dates, times, rooms, workshop hosts, and page metadata
consistent. Use confirmed public information only; omit private contact details,
sponsor amounts, staffing notes, and unconfirmed outreach. Do not infer attendance
from venue capacity or create profile links that have not been supplied.

Workshop cards render supplied session details in a content-sized layout, stacking
on phones and using two columns from `md`. Their `rounded-3xl` corners match
speaker cards and schedule panels. Schedule notices and the event theme are
content fields; update the data rather than duplicating them in presentation code.

## Presentation

The Sponsors section (`#sponsors`) sits between Venue and the closing copy and
is the last top-navigation link.
Each `EigenAISponsor` supplies a `name` (used as the logo's alt text) and a
`logo`; files live under `src/assets/photos/eigenai-2026/sponsors/`. Logos are
centred with `object-contain` on 2:1 `rounded-3xl` glass panels, the same
`GradientPanel` surface and gradient outline as the workshop and speaker cards,
filled with translucent white (`bg-white/85`) so the mostly dark logos keep
their original colours and stay legible. Tiles stack on phones and
wrap two per row from `sm` and four per row from `lg`. Incomplete rows are centred.
Logo files are cropped to their artwork so `object-contain` can fill the tile.
On phones, where each tile spans the full width, larger padding keeps logos
smaller.
Square logos are height-limited in the wide tiles; an optional `logoScale`
resizes one to balance it with the others (Arc x2 and Cognition AI use `1.3`,
Publicus AI `1.15`, and RCFTA `0.85`). An empty list shows an announcement placeholder.

The About section uses `eigenai-conference.webp`. Introductory paragraphs form two
columns from `md`, followed by one image spanning the content width. Its frame uses a 16:9 ratio on
phones and 21:9 from `sm`, with the crop positioned toward the panelists. The
caption identifies it as EigenAI 2024. `about.image` and `about.imageAlt`
supply the photo and alternative text; omitting the image also omits its frame
and caption.
Speaker headshots use `profileImage` and live under
`src/assets/photos/eigenai-2026/headshots/`; event photos are not used as speaker
portraits. Optional `profileImagePosition` and `profileImageScale` control the
framing inside the circular portrait without modifying the supplied file.
Adrien's portrait uses these to bring his face into view, and image `sizes`
accounts for the scale so Next.js requests enough resolution.

The redesign is scoped to its `data-testid="eigenai-redesign"` wrapper
and uses responsive metric, speaker, keynote, workshop, and event-lockup
components. It reuses the existing EigenAI content, event
photography, UTMIST branding, social assets, and shared button primitive.
Its named page sections compose the shared `EigenAISection` primitive, which
owns the common responsive gutters, content width, heading treatment, and
heading-to-content spacing. See
[`../components/EigenAISection.md`](../components/EigenAISection.md).
The redesign uses locally bundled copies of the Figma type families (DM Serif
Display, DM Sans, and Instrument Sans) and keeps its cyan, white, and lavender
text gradients and glow treatments scoped to that page.
The implementation intentionally uses a smaller responsive web type scale than
the source Figma artwork: body copy starts at `1rem`, metric display text is
capped at `6rem`, the event wordmark at `7rem`, and section headings at `4rem`.
Instrument Sans copy uses weight `200`, while DM Sans and DM Serif Display
retain their display weights. The lockup's Instrument Sans conference subtitle
uses the Figma cyan-white-lavender text gradient.
Shared `max-w-6xl` content containers and narrower prose columns keep text and
cards wrapping predictably on wide screens. Footer social controls use standard
`44px` targets with `20px` icons.
The decorative icon orbs follow independent, slow bubble-like drift paths while
each complete orbit cluster rotates continuously on a 40-second Tailwind
`animate-spin` loop.
This carries every bubble around the ring center. Cloud icons are embedded in
the orbit SVGs so their size, opacity, colourful outline, blending, and motion
match the other icons without layered duplicates. Motion is disabled by the
user's reduced-motion preference. Each orbit SVG includes a transparent bleed
area so drifting bubbles remain visible beyond the original ring bounds.
The top-right desktop decoration uses the same full orbit cluster and bubble
set as the other desktop orbit artwork.

The default content defines a two-day schedule
in Toronto local time (EDT), with explicit AM/PM labels.
`eigenai-schedule.tsx` accepts typed schedule data and owns its
responsive layout: Saturday and Sunday are separate, equal-height glass panels
from the medium breakpoint, with the panels stacked on phones. Each panel reuses
`EigenGlassSurface` for the same cyan/white/lavender gradient outline as the
other event cards.
Day headers make the weekday a large cyan uppercase label and place the date
beneath it. Cyan accents also appear on times. The transparent panels use the
original glass treatment's light blur, saturation, and contrast to preserve the
brighter blue backdrop.
Each session has its own subtle filled card and border, making extended sessions
read as continuous blocks. Gaps separate cards vertically and horizontally.
Both day columns share CSS subgrid rows based on the combined start and end times.
Matching clock times line up across the columns, and longer sessions span the
intervening rows so each day finishes at the common 5:00 PM boundary. Track
heights accommodate the text; this is an aligned timetable, not a proportional
duration chart. `lib/eigenai-schedule.ts` groups sessions, resolves AM/PM ranges,
and supplies these shared boundaries. Unscheduled labels, empty days, and
fixtures with other day counts retain the ordinary list layout.
Sessions with the same time range within a day share one row and one time label,
and their individual cards appear in equal-width columns. Source order is preserved.
On narrow screens, simultaneous session columns scroll horizontally within their
row. These scroll areas are keyboard-focusable and labelled with the day and time.
The shared time label sits inside the first card; a nested subgrid aligns all
simultaneous session titles beneath it. Sessions with a room specified display it
in a small muted label below the title. Sessions without a room omit the label;
descriptions remain hidden to keep each row concise.
Compact typography and row spacing keep long titles manageable: session titles
are 14px on phones, 13px on larger desktops, and 12px in the narrower two-column
view. Time labels use compact tabular numerals in the matching day's accent color.
Empty source rows are omitted; the optional `scheduleNotice` appears only when
schedule days are present.
The default venue is OISE at 252 Bloor St W, Toronto, ON M5S 1V6, Canada.
`eigenai-venue.tsx` accepts a venue prop and shows an address and directions link
in all environments. When `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is configured, it
also renders a lazy-loaded Google Maps preview; without the key, it renders a
non-blocking fallback instead of taking down the redesign.
The reusable `EigenAILockup` component includes the UTMIST logo and accepts a
responsive `fontSize` and optional `caption`. Its default caption is edition-neutral;
this page passes `content.lockupCaption` from its event data. The logo and conference subtitle are sized and
positioned proportionally with `em` units, so every lockup size preserves the
same relationship between all three elements. Its glass text treatment comes
from the parallel `EigenAIWordmark` component, which can also appear inline in
headings without the logo or conference subtitle.
The lockup and wordmark live in shared UI so other site surfaces can reuse the
same identity without duplication. The featured EigenAI card on `/events` uses
the lockup instead of its generic title and pairs it with the redesign's deep
indigo base, cyan and violet glows, subtle glass highlight, and the same shared
three-SVG concentric orbit element as the redesign backdrop, clipped into its
upper-right corner. It also reuses the redesign's two-layer hero lambda symbol,
including the offset back stroke and glowing front stroke, raised from the
lower-left edge. The lockup stays above these
decorative layers at desktop and mobile sizes. Other featured cards retain
their existing title and background treatments.
The Events page must pass the featured event's `branding` discriminator through
to `EventCard`; the EigenAI lockup and ring artwork render only for that explicit
variant. Their foreground layers use fixed stacking levels above the card's
inline background and highlight overlay. All EigenAI-specific event-card
layout, decoration, stacking, and responsive rules live beside the JSX as
conditional Tailwind utilities; `events.css` retains only the generic featured
card system shared by every event.

The wordmark fill is Figma's
first-party "Mesh gradient" shader, a bicubic Catmull-Rom patch blended in
linear light, which CSS gradients cannot reproduce. It is therefore baked into
`src/assets/eigenai-redesign/wordmark-mesh.webp` from the 16 colour-and-position
controls on Figma node `136:7`. Like Figma, the page stretches it over the glyph
ink bounds rather than the text box. Re-bake the image if designers move those
points. The glass shimmer is Figma's full-opacity white inner shadow, whose
offset and blur are both `6.2224px` at `172.84px` (`0.036em`). CSS has no inner
shadow for text, so an SVG filter reproduces it: the glyph alpha is offset down,
blurred, subtracted from itself, and flooded white above the fill. The blur's
standard deviation is half the Figma radius. Its primitives are fractions of
the text span's `em`-sized box, so it renders at the correct scale on first
paint without measuring the font. The
lockup can optionally include Figma cursor node `99:256`; the hero enables it,
while later lockups omit it. The cursor itself is outline-only, and its shape is
also used as a local mask on the hero wordmark. It therefore hides the
overlapping part of the final `i` while allowing the live page backdrop to show
through instead of approximating the background with a solid fill.
Decorative artwork lives in a continuous page-level composition and section
backgrounds allow overflow, preventing lambda and ring artwork from being cut
at section boundaries. Outlined circles use reusable three-layer concentric
groups with shared center points and reduced opacity to remain secondary to the
page content. The composition normalizes the eight `1440 × 1024` Figma backdrop
frames into one `1440 × 8192` coordinate plane: blurred cyan, blue, purple, and
lavender fields cross the former frame boundaries without seams, while each
orbit keeps its rings, glass symbols, and line details in one logical cluster.
The hero and workshop lambdas are likewise paired layers in that same backdrop
instead of section-local elements, with dedicated mobile positions and sizes so
both remain visible below `md`. Their exported white strokes reproduce the
Figma treatment: the fine `1.0768px` layer has a `4.3071px` layer blur and the
heavy `4.3071px` layer has an `18.0897px` layer blur at the `444.352px` source
width. Container-relative blur units preserve those proportions responsively.
Horizontal scale follows the viewport and
vertical anchors follow the full rendered page, preserving the Figma sequence
while allowing the responsive content to determine the page height. Ellipse and
orbit widths are capped at their Figma-exported desktop dimensions so ultra-wide
viewports cannot enlarge separate clusters until they overlap. Orbit clusters
place the tightly bounded cloud-upload export from Figma node `99:465` over its
glass bubble explicitly, avoiding distortion from the former square icon canvas.
Glass panels use a fully transparent fill, the Figma gradient border, and a
light backdrop filter approximating the source refraction and dispersion
without introducing a blue colour tint.
The route-aware `HideOnEigenAI` wrapper suppresses the frontend layout's shared
navbar and footer. The page supplies
its own responsive navigation and footer inside the continuous orbital
background, using the same liquid-glass surface treatment as the event UI. Its
links navigate to About, Speakers, Workshops, Schedule, Venue, and Sponsors on the current
page. The UTMIST wordmark remains the route back to the main site, while the
navigation does not include a separate home or authentication action.
Outside `/eigenai`, the shared navbar always includes the `/eigenai` link.
The link uses the same shared small gradient button styling as the Login/Profile
action on desktop and mobile. The navbar uses tighter tablet spacing to keep
Login/Profile on the same row at the 769px desktop breakpoint.
It also releases any mobile scroll lock when hidden, including when browser
Back/Forward returns to EigenAI with the main-site menu still open.
The wordmark and lockup are imported directly from `@/shared/ui` by both the
redesign and event card; there are no feature-level re-export wrappers.
The featured EigenAI card on `/events` always renders the redesign lockup,
lambda, rings, and indigo background. The Events page
passes the event's branding through directly and does not evaluate the flag;
event data supplies the branded background.
On mobile, the event navigation follows the main site's hamburger pattern: its
white UTMIST event wordmark sits left, the matching hamburger sits right, and a
left-aligned section link list appears in a dismissible glass menu. A
mobile-specific liquid-glass surface is enabled only while the menu is open and
wraps the top bar and link list as one outlined shape. With the menu closed, the
plain dark bar has no outline. The wordmark remains at the far left and the menu
control at the far right. A short gradient below the fixed bar lets content fade beneath it, and
the open menu layers above that fade to meet the bar exactly without a gap. Its
lower corners retain the liquid-glass rounding. Desktop navigation has a
deeper dark-to-transparent top fade so scrolling content remains secondary
behind the floating controls. From `md` to `lg`, tighter link gaps and pill padding
leave room for the ticket button on a single line, including at 768px. The ticket
label does not wrap; wider desktop spacing resumes at `lg`.
Keyboard focus can leave the navigation normally: doing so closes the mobile
overlay before a page link receives focus. Escape closes the menu and restores
focus to its toggle. Section scroll margins keep anchor headings below the fixed
navigation at both mobile and desktop sizes.
Mobile layouts keep the three headline metrics in one row immediately below a
full dynamic-viewport hero, center section headings and speaker-card copy, use
`1.25rem` page gutters and compact section/card spacing, and reduce
the type scale and footer footprint. The closing section uses a shorter mobile
canvas while retaining a prominent lower event lockup. Mobile reduces the
background colour-field opacity and saturation to compensate for their tighter
crop on narrow screens. It uses the same
animated orbit artwork as desktop, including drifting icon orbs and the slow
40-second rotation. Six clusters keep alternating edge positions, including an
additional top-left cluster, and stronger contrast, with staggered delays. Both the rotation and
the SVG's internal drift stop for reduced-motion preferences. The original
desktop Figma coordinates and scale resume at `md`.
The public content supplies the speaker lineup and workshop list.
There are no placeholder speaker cards in the public lineup. Workshop descriptions
give the available session details without inventing abstracts.
Speaker cards use a centered wrapping layout: one per row on phones, two from
`sm`, and three from `md`. Incomplete rows stay centered. The cards have
compact, content-driven heights and centered names and roles.
The UTMIST lockups use the exported Figma `White Side 2` artwork rather than a
typed approximation, preserving the custom letterforms in the hero, EigenAI
navigation, and footer.

## Gotchas

- The page treats Maps as an enhancement and shows a directions fallback when
  the API key is absent.
- `peopleGrid.tsx` and `styles/eigenai.css` remain shared with AI2 and MLF; they
  are not legacy-only assets.

## Tests

- `client/tests/unit/pages/eigenai.test.tsx` — the route remains interactive
  without a flag provider or Maps key, including mobile-menu dismissal.
- `client/tests/unit/eigenai-navigation.test.tsx` — keyboard dismissal, focus
  restoration, and section-link dismissal.
- `client/tests/unit/eigenai-schedule.test.tsx` — shared clock boundaries,
  unscheduled labels, and simultaneous sessions grouped by day and time.
- `client/tests/unit/pages/hide-on-eigenai.test.tsx` — layout chrome suppression.
- `client/tests/unit/navbar.test.tsx` — main-site menu behavior and scroll-lock
  cleanup when navigating to EigenAI.
- `client/tests/integration/flags-explorer.test.ts` — the retired flag is absent
  from discovery and old signed overrides cannot restore it.
