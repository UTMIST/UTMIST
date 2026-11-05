# Homepage event card

`features/public-site/components/home-event-card.tsx` accepts one typed
`HomeEvent` from `data/home-events.ts`. Its whole surface is a single link;
external destinations open with `noopener noreferrer`, while internal routes
stay in the same tab. There are no nested interactive controls.

Each record carries its stable ID, title, description, URL, category, and
artwork. Image artwork specifies source, alternative text, fit, and optional
position. Branded EigenAI artwork reuses `EigenAIEventArtwork` from `@/shared/ui`.
Renaming or reordering records does not change their images or categories.

The parent owns the responsive grid and supplies `event.id` as the React key.
The card participates in the shared scroll reveal and aligns its footer with
neighbouring cards. Test content association and navigation behavior when
changing its data contract.
