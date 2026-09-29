# EigenAI speaker card

`features/public-site/components/eigenai-speaker-card.tsx` exports
`EigenAISpeakerCard` for both regular speakers and the keynote presentation.

```tsx
<EigenAISpeakerCard speaker={speaker} />
<EigenAISpeakerCard speaker={keynote} keynote />
```

Both variants accept `EigenAISpeaker` from
`features/public-site/types/eigenai.ts`: required `name` and `role`, plus optional
`bio`, `profileURL`, `profileImage`, `profileImagePosition`, and
`profileImageScale`. The same contract can be supplied by
fixtures or future content readers; no CMS dependency is required to render it.

A missing portrait renders decorative initials. A missing profile URL renders
plain text; a supplied URL makes the speaker's name a keyboard-accessible link.
Names, roles, and bios wrap within the card. The keynote places its portrait
beside the description on desktop and above it on smaller screens; regular
cards keep the portrait above the panel and center the name and role at every
screen size. Regular cards use content-driven heights rather than a large fixed
minimum, so short speaker details do not leave an empty lower half.

Portraits use `object-fit: cover` inside a circular mask. Optional
`profileImagePosition` sets the CSS object position, and `profileImageScale`
zooms the displayed photo (default `1`) without changing the original asset.
The image's responsive `sizes` includes this scale to retain portrait detail.

See `tests/unit/pages/eigenai-content.test.tsx` for custom content, missing
portraits/links, and both regular and keynote states.
