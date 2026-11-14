# Academics: Foundations to Frontiers

## Routes and design ownership

[Issue #504](https://github.com/UTMIST/UTMIST/issues/504) implements the
[Academics desktop frame, `22:102`](https://www.figma.com/design/NO6Ltgze2CTZucVxSdBwVf/utmist-website?node-id=22-102)
inside the supplied `2:2` canvas. The frame is 1440 × 5592 and contains the
hero, program introduction, kick-off card, five workshop topics, FAQs, team,
and footer. There are no mobile/tablet frames on that canvas; smaller layouts
adapt the desktop hierarchy into stacked sections and wrapping grids.

The hero fills at least the current viewport height (`100dvh`) and can grow
with its content on short screens. `PublicSiteHero` gives it the same responsive
container, centered reading column, type scale, and CTA spacing as the homepage.
Both actions use shared `PillLink` components. It reuses the homepage's animated glass
background with the F2F mint/teal palette, a pause control, and a still frame for
reduced motion. The original Figma artwork is the fallback when WebGL is
unavailable. The page uses the standard shared site
footer, including the existing platform icons, instead of the Figma footer.

| Route | Ownership and behavior |
| --- | --- |
| `/ml-fundamentals` | #504: F2F redesign when `Web-Redesign` is On; original MLF page when Off or evaluation fails. |
| `/ml-fundamentals/2025` | #504: preserved MLF archive in either flag state, including all workshop/project resources and original team content. |
| `/ai2` | Outside this design; remains with #412. |

This is the implementation's route mapping for the coordination work in #331.
It does not change board assignments or constitute rollout acceptance.

## Components and content

- `features/public-site/pages/academics.tsx` selects the experience server-side
  through `isWebRedesignEnabled()` from `@/shared/lib/server`. The helper uses
  the existing `evaluateFlag("Web-Redesign")` and caches one decision per request
  for page and layout consistency. The existing catalog, Explorer integration,
  and default-Off fixture are reused.
- `pages/academics-redesign.tsx` renders validated `AcademicsContent` props as server components.
  FAQ disclosure uses native `details`/`summary`, with the first answer open.
- `components/public-site-hero.tsx` owns hero geometry shared with the homepage.
  See [PublicSiteHero](../components/PublicSiteHero.md).
- `components/hero-light-background.tsx` is the reusable client background used
  by the homepage and Academics. Academics selects its `f2f` theme; pointer
  tracking, pause, offscreen suspension, and GPU cleanup use the same renderer.
  See [HeroLightBackground](../components/HeroLightBackground.md).
- `components/academic-session-card.tsx` accepts an `AcademicSession`. Each
  optional resource URL is independent; a missing URL renders an unavailable
  label, never a fake link or a link to a different session. Published resources
  open a new tab with `noopener noreferrer`.
- `data/academics.ts` contains typed design-preview fixtures. Dates, descriptions,
  names, and team portraits are samples, visibly marked on the page. These are
  not a confirmed 2026 schedule or team roster. Replace them with approved
  content and real resource URLs before rollout. `lib/academics.ts` selects the
  real Payload reader during opted-in local development. See
  [Academics CMS](../AcademicsCMS.md) for fields, drafts/publishing, permissions
  and local setup. Hosted activation requires separate acceptance.
- `styles/academics.css` scopes the Figma mint/teal palette and card/timeline
  treatments. Shared `PillLink`, `ContentContainer`, focus styles, and typography
  are reused; Inter medium is self-hosted for workshop headings. The hero uses
  the same Instrument Sans typography as the homepage.
- The shared redesigned navbar keeps the same links and dimensions on both pages
  and stays mounted during client navigation. Past years remains in the hero and FAQ.
  `SiteFooter` selects the standard shared footer on that route with the flag On,
  matching the redesigned homepage.
  Both return to the legacy shell when the flag is Off. Other page navigation
  retains its existing destinations.

## Destinations

The hero's Explore link scrolls to `#program`. Past years in the hero,
preview note, and FAQ goes to `/ml-fundamentals/2025`. Programs continues to
offer `/startups` and `/ml-fundamentals`; existing About, Projects, Events,
EigenAI, Sponsors, Login/Profile, and footer social destinations are preserved.
The archive reuses the original page directly, retaining its eight workshops,
Phase 2 sessions, sample projects, slides, recordings, code, and FAQs.

## Assets and review

Default artwork is local under `client/public/academics-redesign/`. Editors can
replace content photos with supported public Supabase image URLs. Figma temporary
URLs are download sources only and are never used at runtime.

| Figma layer(s) | Local asset / slot |
| --- | --- |
| `25:127` | `hero.png`: local fallback for the animated background, exported from the artwork layer |
| `22:111` | Existing `/home-redesign/utmist-wordmark.png`: identical asset reused in the navbar |
| `25:1902` | `workshop.png`: workshop photo, preserving the frame's crop |
| `31:1903` | `intro-decoration.svg`: small introduction decoration |
| `44:3099`, `48:1002` | `timeline-start.svg`, `timeline-line.svg`: workshop sequence |
| `48:487` and repeated card layers | `location.png`: session location |
| Repeated resource-pill layers | `slides-pill.svg`, `recording-pill.svg`, `code-pill.svg` |
| `42:2630`, `44:4096` | `divider.svg`: introduction/team separators |
| FAQ disclosure layers | `faq-divider.svg`, `faq-open.svg`, `faq-closed.svg` |
| `44:4110` and repeated team layers | `team-placeholder.png`: Figma sample portrait, decorative because it is not a real team profile |
| `44:4122`, `48:44` | `director-star.svg`: director badges |

The [Figma reference](../assets/academics-redesign/figma-desktop.png) is a review
artifact only. The [comparison gallery](../assets/academics-redesign/index.html)
includes the implementation and desktop/tablet/mobile screenshots. Font sizes
and tap targets adapt for readability on smaller screens;
cards grow with content rather than using the overlapping text boxes in Figma.

## Verification and rollout

Run the four repository gates with Node 24: `npm run lint`, `npm run typecheck`,
`npm test`, and `npm run build`. Behavior tests cover flag switching, evaluator
failure fallback, archive availability, resource destinations/availability, and
page-specific navigation/footer selection. The archive's existing modal test
continues to protect resource access.

On a Vercel Preview, use Flags Explorer to exercise Off → On → Off with a full
refresh after each change. Check `/ml-fundamentals`, its navigation/footer, and
the 2025 archive. Verify at 1440px, 768px, and 375px, including keyboard FAQ and
menu controls, visible focus, all resource destinations, and no horizontal
overflow. Keep Production Off until approved content and rollout acceptance
are recorded. Disabling the existing flag restores the original MLF page.
