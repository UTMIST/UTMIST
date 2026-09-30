# EigenAI page

`/eigenai` is a public event page served behind the `Eigen-AI-Redesign` Vercel
feature flag (#447). Which page a visitor sees is chosen **on the server**, so
there is no flash of the wrong page and the choice is never frozen at build.

## Location

- Route shell: `client/src/app/(frontend)/eigenai/page.tsx` — re-exports the
  selector's `default` and `generateMetadata`, and declares
  `dynamic = "force-dynamic"` itself.
- Selector (server): `client/src/features/public-site/pages/eigenaiFlagged.tsx`.
- Existing page (client): `client/src/features/public-site/pages/eigenai.tsx`.
- Redesign page: `client/src/features/public-site/pages/eigenaiRedesign.tsx`.

## How the selection works

`eigenaiFlagged.tsx` is an async server component. The route shell declares
`export const dynamic = "force-dynamic"` for per-request evaluation; `/eigenai` is
not statically prerendered. This is an environment-wide toggle: the selector
does not query Supabase for a user or profile. It uses the same anonymous flag
context as the layout, allowing the SDK to share matching
evaluations within a request:

```tsx
const showRedesign = await evaluateFlag("Eigen-AI-Redesign");
```

The selector wraps this lookup in React `cache()` so its metadata and page
content use the same result within a request, including in production. The
cache is request-scoped; later requests still evaluate the current flag.

When enabled, the selector renders `EigenAIRedesign`, which supplies its own
navigation and footer. Otherwise it renders `Navbar`, `EigenAIPage`, `Footer`,
and `FloatingThemeToggle` together, preserving the legacy page's standard site
controls. The frontend layout omits its copies on `/eigenai` through
`HideOnEigenAI`, so each variant renders exactly one set of controls.

`evaluateFlag` (from `@/shared/lib/server`) is **default-off**: a missing flag,
missing configuration, or an evaluation failure returns `false`, so anything but
an explicit "on" keeps the existing page. See
[../flags.md](../flags.md) for the flag runtime, OIDC authentication,
and the embedded-fallback mitigation.

## Rollout / opt-in

Production follows the **Production dashboard setting**. The public evaluator
checks `VERCEL_ENV=production` and reads the provider directly, ignoring Explorer
overrides. Provider authentication uses Vercel's automatic OIDC identity (or an
optional explicit `FLAGS` SDK key); the separate `FLAGS_SECRET` enables
authenticated Flags Explorer discovery and
browser overrides. In development/preview, an Explorer override takes
precedence for that browser; clear it to test dashboard toggles.

To preview the redesign, turn `Eigen-AI-Redesign` **ON** in the Preview Vercel
dashboard. Deployments authenticate automatically without a manual `FLAGS` key.
For live local Development values, link the project and run `vercel env pull`
from `client/`. Subsequent server evaluations follow provider updates without a
redeploy. Offline local development uses fixtures, which currently disable the
redesign.
See [../flags.md](../flags.md) for setup and verification.

## Search and social metadata

With the redesign enabled, `/eigenai` supplies the title `EigenAI 2026 | UTMIST`,
a description with the October 3–4 dates and OISE venue, and the canonical URL
`https://www.utmist.ca/eigenai`. Open Graph and Twitter large-image cards share
that copy and the existing `eigenai-conference.webp` photo, with its dimensions
and alternative text identifying it as a past conference. All metadata URLs
use the public production origin, including when viewing a local or preview
deployment. The imported photo's hashed asset URL updates if the file changes.

When the flag is off or fails closed, `generateMetadata` returns no overrides:
the original UTMIST title and description are inherited, and no 2026 social
metadata is published. The page remains dynamic so toggles affect subsequent
requests. Social platforms may retain previously fetched previews until they
recrawl the URL. The public `/eigenai` URL is also listed in `public/sitemap.xml`;
it exists in both flag states.

## Content contract and fixtures

`EigenAIRedesign` accepts `content?: EigenAIPageContent`. The types live in
`features/public-site/types/eigenai.ts`; default content lives in
`features/public-site/data/eigenai-redesign.ts`. Passing no prop uses the default
fixture. The contract covers the date
and location labels, metrics, About paragraphs/image, keynote, speakers,
workshops, schedule and its optional notice, venue, and closing copy.

The data module exports three review fixtures:

- `eigenAIContent`: the 2026 event content and existing EigenAI event photography.
- `eigenAIUnannouncedContent`: empty lineup, workshops, schedule, and venue.
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

### 2026 content sources

The redesign content was checked on September 29, 2026 against the
[EigenAI master sheet](https://docs.google.com/spreadsheets/d/1f6ECrqE1sOGjYU2lR0KKJAMg2JgMZZZGbnEB1S0alj4/edit):
`01 Overview`, `03 Contributions`, and `06 Partners Guests`. The `05 Event
Schedule` tab points to the
[current workshop/panel schedule](https://docs.google.com/document/d/1xP4nbr0664GQG40kwARpMumu47qZHiUWzSHRzO-LJOI/edit),
which takes precedence over that tab's partially filled draft rows for times
and rooms. These are manually maintained public content snapshots; the page
does not fetch private planning documents at runtime.
The live document's first tab was rechecked on September 29, 2026. Session names
follow that tab, including Undergrad Research Panel, Stripe Panel, and AI Agents
Workshop. Adrien's workshop remains Saturday 2:30–4:30 PM in OI 2212; the Sunday
2:45–3:45 PM AI Agents Workshop in OI 2214 belongs to UTMIST Academics. The
tentative request for extra engineering booths is not treated as a confirmed
session. The existing times and rooms were reconfirmed without changes.

The public speaker lineup contains only the five guests with supplied headshots.
Guests awaiting photos, the research-panel backup, and unconfirmed outreach
contacts are omitted, along with private contact details, sponsor amounts,
internal staffing, and logistics notes. No keynote is designated.
Affiliations describe the listed sessions rather than inventing job titles.
Adrien Beyk is listed in his own name, following the current schedule's note.
The organizer subsequently supplied headshots for Adrien Beyk, Aryan Yaghoubian,
Iris Guo, Naomi Walch, and Vincent Xue. Their accompanying names and affiliations
take precedence over the sheet: Naomi's name is spelled Walch and her role is
Associate at Northside Ventures; Vincent is also at Northside Ventures. Aryan
and Iris are Building Your Path in Tech panelists. The organizer confirmed
Architecting Autonomy as Adrien's Saturday workshop title; the planning document
only names its host. This supplied title is used in his speaker card, workshop
card, and schedule, while Sunday's separate session remains AI Agents Workshop.
Profile links remain unset until supplied.

The six workshop cards use session titles, hosts, dates, times, and rooms from
these sources. They use compact text and padding with no fixed minimum height,
stacking on phones and forming two columns from `md`. Saturday's 1:00–1:30 PM
block remains explicitly unannounced.
The schedule notice says it is subject to change. The theme follows the current
schedule: “Across the Many Frontiers of AI.” No attendance metric is inferred
from the sheet's capacity goal.

The flag-off page restores the original pre-#456 `pages/eigenai.tsx`: September
20–21, 2025 copy, the three-image gallery, the Instagram schedule, and the original
speaker groups and workshops from `data/eigenai.ts`. It does not import the 2026
redesign data. If the optional Maps key is missing, a directions link replaces
the embed so switching Off still renders a working page. The Instagram script is
removed when the page unmounts. Provider errors select this same rollback view.

## Presentation

The About section uses only `eigenai-conference.webp`, the second photo from the
previous three-image layout. Introductory paragraphs form two columns from `md`,
followed by one image spanning the content width. Its frame uses a 16:9 ratio on
phones and 21:9 from `sm`, with the crop positioned toward the panelists. The
caption identifies it as a past conference. `about.image` and `about.imageAlt`
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

The default content includes the current two-day schedule for October 3 and 4
in Toronto local time (EDT), with explicit AM/PM labels.
`eigenai-schedule.tsx` accepts typed schedule data and owns its
responsive layout: Saturday and Sunday are equal-height columns inside a single
blue glass timetable from the medium breakpoint, with the days stacked on phones.
The outer timetable reuses `EigenGlassSurface` for the same cyan/white/lavender
gradient outline as the other event cards. Its `asChild` composition preserves
the timetable grid without adding a wrapper.
Day headers separate the weekday from the date, with no colored top borders.
Cyan accents appear on both days' labels and times. The transparent timetable uses
the original glass panel's light blur, saturation, and contrast to preserve the
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
The unassigned Saturday block is labelled “To Be Announced”; the optional
`scheduleNotice` appears only when schedule days are present.
The default venue is OISE at 252 Bloor St W, Toronto, ON M5S 1V6, Canada.
`eigenai-venue.tsx` accepts a venue prop and shows an address and directions link
in all environments. When `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is configured, it
also renders a lazy-loaded Google Maps preview; without the key, it renders a
non-blocking fallback instead of taking down the redesign.
The reusable `EigenAILockup` component includes the UTMIST logo and accepts one
responsive `fontSize` value. The logo and conference subtitle are sized and
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
instead of section-local elements. Their exported white strokes reproduce the
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
navbar, footer, and floating theme control; the selector restores them only for
the legacy branch. The redesign supplies
its own responsive navigation and footer inside the continuous orbital
background, using the same liquid-glass surface treatment as the event UI. Its
links navigate to About, Speakers, Workshops, Schedule, and Venue on the current
page. The UTMIST wordmark remains the route back to the main site, while the
navigation does not include a separate home or authentication action.
Outside `/eigenai`, the frontend layout evaluates `Eigen-AI-Redesign` on the
server and passes the result to the shared navbar. Only an enabled flag renders
the `/eigenai` promotional link; a disabled flag, missing configuration, and
provider failures omit it. The link uses the same shared small gradient
button styling as the Login/Profile action on both desktop and mobile, while
the client navbar receives only the resolved boolean.
When the EigenAI promotion is present, the shared navbar uses tighter tablet
spacing to keep Login/Profile on the same row at the 769px desktop breakpoint.
It also releases any mobile scroll lock when hidden, including when browser
Back/Forward returns to EigenAI with the main-site menu still open.
The wordmark and lockup are imported directly from `@/shared/ui` by both the
redesign and event card; there are no feature-level re-export wrappers.
The featured EigenAI card on `/events` always renders the redesign lockup,
lambda, rings, and indigo background, regardless of the flag. The Events page
passes the event's branding through directly and does not evaluate the flag;
event data supplies the branded background. The flag continues to control the
destination page's redesign and the shared navbar's promotional link.
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
behind the floating controls.
Keyboard focus can leave the navigation normally: doing so closes the mobile
overlay before a page link receives focus. Escape closes the menu and restores
focus to its toggle. Section scroll margins keep anchor headings below the fixed
navigation at both mobile and desktop sizes.
Mobile layouts keep the three headline metrics in one row immediately below a
full dynamic-viewport hero, center section headings and speaker-card copy, use
`1.25rem` page gutters and compact section/card spacing, and reduce
the type scale and footer footprint. The closing section uses a shorter mobile
canvas while retaining a prominent lower event lockup. The hero's concentric ring
groups remain visible on small screens at alternating viewport edges and repeat
down the full page with stronger contrast; the original Figma coordinate and
scale resume at `md`.
The 2026 content includes five named guests with headshots and six workshops.
There are no placeholder speaker cards in the public lineup. Workshop descriptions
give the available session details without inventing abstracts.
Speaker cards use a centered wrapping layout: one per row on phones, two from
`sm`, and three from `md`. Incomplete rows stay centered, giving the five-person
lineup a balanced three-over-two arrangement on wider screens. The cards have
compact, content-driven heights and centered names and roles.
The UTMIST lockups use the exported Figma `White Side 2` artwork rather than a
typed approximation, preserving the custom letterforms in the hero, EigenAI
navigation, and footer.

## Gotchas

- Both page variants render their event details without requiring a Maps
  API key. The redesign treats Maps as an enhancement and shows a directions
  fallback when the key is absent.

## Tests

- `client/tests/unit/pages/eigenai-content.test.tsx` — custom content, optional
  images/links, long copy, unannounced sections, venue fallback, named guests,
  the past-event photo, workshop details, and revised schedule times and titles.
- `client/tests/unit/eigenai-navigation.test.tsx` — keyboard dismissal, focus
  restoration, and section-link dismissal.
- `client/tests/unit/eigenai-schedule.test.tsx` — shared clock boundaries, noon
  handling, unscheduled labels, and simultaneous sessions sharing a
  time row, different days remain separate, and session order is preserved.
- `client/tests/unit/event-card.test.tsx` — EigenAI artwork and event-supplied
  backgrounds, plus generic rendering for other events.
- `client/tests/unit/pages/events.test.tsx` — EigenAI card branding with the flag
  on or off, alongside loading and filtering behavior.
- `client/tests/unit/pages/eigenai-selector.test.tsx` — off → existing, on →
  redesign, default-off → original 2025 page (only the server barrel mocked).
  Also checks enabled search/social metadata and the flag-off metadata rollback.
  Both pages render with real content. Checks that the
  legacy/default-off branches retain standard navigation, footer, and theme
  controls, and the redesign has only its own chrome.
- `client/tests/unit/pages/eigenai.test.tsx` — the existing page's own
  original 2025 event details, speaker sections, workshops, and missing-Maps-key
  fallback (imports the component directly).
