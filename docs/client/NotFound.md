# Not-found pages

The default UTMIST 404 lives in `app/(frontend)/not-found.tsx`, inside the public
site layout with its normal navigation, footer and styles.

The application has separate frontend and Payload root layouts. When
`CMS-Access` is Off, `src/middleware.ts` rewrites GET/HEAD requests for `/cms`,
its nested paths and `/cms-graphql-playground` to the frontend server page
`app/(frontend)/cms-unavailable/page.tsx`. That page always calls `notFound()`.
The requested browser URL is preserved and the response remains HTTP 404 with
noindex metadata and `Cache-Control: no-store`.

Neither the Payload layout nor its not-found boundary imports frontend
components. Keep these route trees separate: importing the frontend layout,
even conditionally, bundles its global CSS into enabled CMS pages and overrides
Payload's dashboard styles. Both Payload components independently check the
flag before invoking Payload, so bypassing the rewrite or disabling access
between evaluations still fails closed. Server-action POSTs stay in the Payload
tree and recheck their own gate.

The fallback renders the frontend layout, including its normal EigenAI flag
evaluation, and never invokes Payload. CMS API handlers continue to return
uncached JSON 404 responses; their methods and server-action gates are documented
in [Payload availability](Payload.md#availability-flag-443).

`/cms-graphql-playground` uses the same disabled-page rewrite. When enabled,
its original route handler serves Payload's native playground HTML directly.
The handler independently checks the flag with `withCmsAccess`, so bypassing
middleware or disabling access between evaluations still cannot invoke Payload.

The middleware uses the existing shared evaluator with an explicit request, so
local/Preview signed Explorer overrides are evaluated from that request's
cookies. Production still ignores overrides. The middleware runs on Node.js
and preserves Supabase's refreshed cookies and forwarded request headers when
rewriting; other routes keep the existing session response.

When changing this fallback, check a nonexistent public URL and disabled `/cms`,
`/cms/login`, `/cms/create-first-user`, `/cms-graphql-playground` and nested CMS
paths against a running build. Verify the UTMIST 404, home/dashboard links,
navigation/footer, HTTP 404, and the absence of Payload/database calls. Also
inspect the enabled CMS route's emitted stylesheets: they must include Payload
CSS and exclude frontend globals/Tailwind. Static copy or style changes do not
need content-matching unit tests.
