# Not-found pages

The frontend's `client/src/app/(frontend)/not-found.tsx` displays the UTMIST
404 page when a frontend route calls `notFound()`.

The catch-all route at `client/src/app/(frontend)/[...unmatched]/page.tsx`
calls `notFound()` for unknown URLs such as `/bleh`. Keeping unmatched URLs
inside the frontend route group gives the 404 page the frontend metadata and
layout, and preserves client-side navigation from its links.
