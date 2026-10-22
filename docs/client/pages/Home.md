# Home page

The route shell `client/src/app/(frontend)/page.tsx` re-exports the async server
page `features/public-site/pages/home.tsx`.

The page composes the CTA, sponsors, organization introduction/statistics,
Who We Are/Our Mission cards, events, value propositions, startups, and FAQ.
CTA destinations and the rest of the page retain their existing behavior.

`readHomeImpact()` supplies the intro and statistics to `OrganizationImpact`.
During explicitly opted-in local development it reads the published
`content-sections` record with key `home-impact` through the shared typed
Payload adapter. Other runs use the existing static source while hosted CMS
selection remains in #495. A failed opted-in CMS read raises an error rather
than silently falling back. See the [reader recipe](../ContentReader.md) for
setup, permissions, refresh behavior, and a database-free example.

The intro and statistics are reusable, prop-driven components. See
[OrganizationImpact](../components/OrganizationImpact.md) and
[Statistics](../components/Statistics.md). Only statistic animation runs in a
client component; Payload access stays on the server.

Homepage behavior tests await the server page and verify CTA destinations and
content propagation. They do not pin marketing copy or visual styling.
