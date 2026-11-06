# Footer

`Footer` is a server-safe primitive exported from `@/shared/ui`. Its two
appearances are `variant="legacy"` (default) and `variant="standard"`.

The standard variant uses the shared `IconButton` in link mode for its six
social destinations, circular focus outlines, 44px targets, Instrument Sans
and a responsive social grid. Its vertical padding is half the shared section
gap, keeping the distance from FAQ content consistent with other sections. The
legacy variant retains its palette and icons. Both variants use 44px social
links and a bug-report link at least 44px high. Their social grid has six columns,
or three below 359px, so the larger targets fit narrow phones without overflow.
Both preserve external URLs, accessible labels and `noopener noreferrer`.
All footer styles are owned by the component and `styles/footer.css`.

`SiteFooter`, exported from `@/shared/ui/client`, selects the standard appearance
only when the frontend layout's `redesignEnabled` decision is true **and** the
current pathname is `/`. It re-evaluates on client navigation. `HideOnEigenAI`
still controls visibility on the EigenAI route family. No homepage sibling CSS
reaches into the footer.

`ScrollToTop` uses the same flag/path decision for its standard `IconButton` and
retains the legacy appearance elsewhere. Both versions support keyboard
activation and request instant scrolling when reduced motion is enabled.

Tests cover flag/path selection, route changes and scroll behavior. Appearance
and circular focus outlines are verified in the browser.
