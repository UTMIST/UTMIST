# EigenAI page

`/eigenai` is a public event page served behind the `Eigen-AI-Redesign` Vercel
feature flag (#447). Which page a visitor sees is chosen **on the server**, so
there is no flash of the wrong page and the choice is never frozen at build.

## Location

- Route shell: `client/src/app/(frontend)/eigenai/page.tsx` — re-exports the
  selector's `default` and declares `dynamic = "force-dynamic"` itself.
- Selector (server): `client/src/features/public-site/pages/eigenaiFlagged.tsx`.
- Existing page (client): `client/src/features/public-site/pages/eigenai.tsx`.
- Redesign page: `client/src/features/public-site/pages/eigenaiRedesign.tsx`.

## How the selection works

`eigenaiFlagged.tsx` is an async server component. The route shell declares
`export const dynamic = "force-dynamic"` for per-request evaluation; `/eigenai` is
not statically prerendered. The selector reads the optional current profile with
`getCurrentUser()` — the page is public, so it never `requireUser()` — and calls:

```tsx
const showRedesign = await evaluateFlag(
  "Eigen-AI-Redesign",
  contextFromProfile(profile),
);
```

When enabled, the selector renders `EigenAIRedesign`, which supplies its own
navigation and footer. Otherwise it renders `Navbar`, `EigenAIPage`, `Footer`,
and `FloatingThemeToggle` together, preserving the legacy page's standard site
controls. The frontend layout omits its copies on `/eigenai` through
`HideOnEigenAI`, so each variant renders exactly one set of controls.

`evaluateFlag` (from `@/shared/lib/server`) is **default-off**: a missing flag,
missing configuration, or an evaluation failure returns `false`, so anything but
an explicit "on" keeps the existing page. See
[../flags.md](../flags.md) for the flag runtime, per-environment SDK keys,
and the embedded-fallback mitigation.

## Rollout / opt-in

The flag is **always off in production** until launch (#444): the public
evaluator checks `VERCEL_ENV=production` before provider evaluation or Explorer
overrides. Provider authentication uses the environment's `FLAGS` SDK key; the
separate `FLAGS_SECRET` enables authenticated Flags Explorer discovery and
browser overrides. In development/preview, an Explorer override takes
precedence for that browser; clear it to test dashboard toggles.

To preview the redesign, configure the Development / Preview `FLAGS` key and
turn `Eigen-AI-Redesign` **ON** in that environment's Vercel dashboard. Subsequent
server evaluations follow provider updates without a redeploy. Local development
without a provider key uses fixtures, which currently enable the redesign.
See [../flags.md](../flags.md) for setup and verification.

The redesign is scoped to its `data-testid="eigenai-redesign"` wrapper
and uses responsive metric, speaker, keynote, workshop, and event-lockup
components. It reuses the existing EigenAI content, speaker portraits, event
photography, UTMIST branding, social assets, and shared button primitive.
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
The reusable `EigenAILockup` component includes the UTMIST logo and accepts one
responsive `fontSize` value. The logo and conference subtitle are sized and
positioned proportionally with `em` units, so every lockup size preserves the
same relationship between all three elements. Its layered text treatment comes
from the parallel `EigenAIWordmark` component, which can also appear inline in
headings without the logo or conference subtitle. The visible wordmark fill
reproduces the 16 colour-and-position controls from Figma shader node `99:236`;
its depth, shine, and glint layers reproduce that node's full-opacity white
inner shadow, whose offset and blur are both `6.2224px` at the Figma size. The
lockup can optionally include Figma cursor node `99:256`; the hero enables it,
while later lockups omit it. The cursor itself is outline-only, and its shape is
also used as a local mask on the hero wordmark layers. It therefore hides the
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
background, using the same liquid-glass surface treatment as the event UI. The
navigation login control combines the Figma `rgba(76, 229, 232, 0.4)` blue body
with the shared `1.582px` cyan-white-lavender glass outline.
On mobile, the event navigation follows the main site's hamburger pattern: its
white UTMIST event wordmark sits left, the matching hamburger sits right, and a
left-aligned page list places Login below it in a dismissible glass menu. A
mobile-specific liquid-glass surface is enabled only while the menu is open and
wraps the top bar and link list as one outlined shape. With the menu closed, the
plain dark bar has no outline. The wordmark remains at the far left and the menu
control at the far right. A short gradient below the fixed bar lets content fade beneath it, and
the open menu layers above that fade to meet the bar exactly without a gap. Its
lower corners retain the liquid-glass rounding. Desktop navigation has a
deeper dark-to-transparent top fade so scrolling content remains secondary
behind the floating controls.
Mobile layouts keep the three headline metrics in one row immediately below a
full dynamic-viewport hero, center section headings and speaker-card copy, use
`1.25rem` page gutters and compact section/card spacing, and reduce
the type scale and footer footprint. The closing section uses a shorter mobile
canvas while retaining a prominent lower event lockup. The hero's concentric ring
groups remain visible on small screens at alternating viewport edges and repeat
down the full page with stronger contrast; the original Figma coordinate and
scale resume at `md`.
Until the final conference lineup is approved, the redesign intentionally uses
the placeholder speaker names, roles, and workshop copy shown in Figma. Those
cards reuse existing repository portraits; the canonical EigenAI speaker data
remains unchanged.
The UTMIST lockups use the exported Figma `White Side 2` artwork rather than a
typed approximation, preserving the custom letterforms in the hero, EigenAI
navigation, and footer.

## Gotchas

- The existing page reads `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and throws on render
  if it is unset. Because `/eigenai` is now `force-dynamic`, this throws at
  request time, not during `next build`.
- The redesign deliberately has **no** Maps dependency, so the "on" branch
  renders without that key.

## Tests

- `client/tests/unit/pages/eigenai-selector.test.tsx` — off → existing, on →
  redesign, default-off → existing (server barrel mocked). Checks that the
  legacy/default-off branches retain standard navigation, footer, and theme
  controls, and the redesign has only its own chrome.
- `client/tests/unit/pages/eigenai.test.tsx` — the existing page's own
  render/data/throw assertions (imports the component directly).
