# EigenAI event artwork

`EigenAIEventArtwork`, exported from `@/shared/ui`, composes the shared lockup,
lambda symbol, and concentric rings into conference artwork for homepage and
Events cards. It supplies the edition-neutral `CONFERENCE` caption through
`EigenAILockup.caption`; event-specific pages can retain their own edition label.

Place it inside a positioned, sized container. It fills that container and clips
its decorations. The optional `fontSize` prop sizes the lockup; container-relative
units let narrower cards preserve the composition. The artwork is hidden from
assistive technology, so the containing card must provide its event title.
