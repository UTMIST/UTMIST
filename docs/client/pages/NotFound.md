# Not-found pages

The frontend's `client/src/app/(frontend)/not-found.tsx` displays the UTMIST
404 page when a frontend route calls `notFound()`.

An unknown URL such as `/bleh` does not belong to either root route group.
`client/src/app/global-not-found.tsx` handles these requests using Next.js's
`experimental.globalNotFound` setting. It renders the same page inside the
frontend root layout, which supplies global styles, navigation, and the
required `<html>` and `<body>` elements. Keep both files: the group-level
file handles missing resources within a route, and the global file handles
unmatched URLs across the app, including after the Payload route group is added.
