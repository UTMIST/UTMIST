# Organization introduction and impact

`features/public-site/components/organization-intro.tsx` renders a supplied
`heading` and optional `description` without reading CMS data.

`features/public-site/components/organization-impact.tsx` composes that intro
with `Statistics`, accepting a `HomeImpactContent` object. Use either component
elsewhere within the public-site feature with different props; both the static
source and the Payload source render through the same components. They retain
the homepage's existing typography, spacing, and statistic classes.

The homepage server loader in `features/public-site/lib/home-impact.ts` owns
source selection. [ContentReader.md](../ContentReader.md) documents the live
local source, offline example, permissions, and refresh behavior. The leaf
`StatItem` remains a client component for its count-up animation; content
access stays on the server.
