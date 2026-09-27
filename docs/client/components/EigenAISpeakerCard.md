# EigenAI speaker card

`features/public-site/components/eigenai-speaker-card.tsx` exports
`EigenAISpeakerCard` for both regular speakers and the keynote presentation.

```tsx
<EigenAISpeakerCard speaker={speaker} />
<EigenAISpeakerCard speaker={keynote} keynote />
```

Both variants accept `EigenAISpeaker` from
`features/public-site/types/eigenai.ts`: required `name` and `role`, plus optional
`bio`, `profileURL`, and `profileImage`. The same contract can be supplied by
fixtures or future content readers; no CMS dependency is required to render it.

A missing portrait renders decorative initials. A missing profile URL renders
plain text; a supplied URL makes the speaker's name a keyboard-accessible link.
Names, roles, and bios wrap within the card. The keynote places its portrait
beside the description on desktop and above it on smaller screens; regular
cards keep the portrait above the panel.

See `tests/unit/pages/eigenai-content.test.tsx` for custom content, missing
portraits/links, and both regular and keynote states.
