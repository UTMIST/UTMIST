# PublicSiteHero

`features/public-site/components/public-site-hero.tsx` is the shared server
composition for the homepage and Academics hero. It owns viewport sizing,
responsive gutters, the centered reading column, heading/eyebrow typography,
and action spacing. Page components supply content and the background theme.

Required props are `headingId`, `title`, `eyebrow`, and `actions`. Optional props
are `description`, `aside`, `contentId`, `theme` (`home` or `f2f`), and `className`
for color context. Do not use per-page geometry overrides: change this component
when adjusting hero alignment so both pages stay consistent.

The hero fills at least `100dvh`, grows with its content, and uses the shared
`ContentContainer`. Its central column is capped at 760px; desktop side columns
remain equal even when only the homepage supplies statistics in `aside`. On
smaller screens, the aside follows the content. Both pages use the same heading
scale and 56px `PillLink` actions.

`HeroLightBackground` owns the decorative canvas, pause control, and static
fallback. See [HeroLightBackground](HeroLightBackground.md). The shared navbar
remains in the frontend layout and is never rendered inside the hero.

Verify desktop/tablet/mobile alignment in the browser, including longer titles,
viewport resizing, action wrapping, and navigation between the two routes.
