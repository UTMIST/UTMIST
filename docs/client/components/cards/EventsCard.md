# Legacy homepage event card

`features/public-site/components/cards/events-card.tsx` accepts `title`,
`description`, and `url` through `EventCardProps`. The legacy homepage renders
these props from the shared `data/home-events.ts` records.

The card shows a heading, description, and View More link. The link opens its
URL in a new tab with `noopener noreferrer`. Styling comes from `styles/home.css`.

The redesigned homepage uses [HomeEventCard](../HomeEventCard.md), which adds
record-owned artwork and makes the whole card a single link. Shared event
branding comes from [EigenAIEventArtwork](../EigenAIEventArtwork.md).
