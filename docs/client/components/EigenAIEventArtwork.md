# EigenAI event artwork

`EigenAIEventArtwork`, exported from `@/shared/ui`, renders the shared decorative
Conference ’26 graphic on the homepage and Events page. It composes the existing
lockup, lambda and concentric rings with the Events page's gradient backdrop.

Place it inside a positioned, sized container. It fills that container and clips
its decorations. The optional `fontSize` prop sizes the lockup; container-relative
units let narrower cards preserve the same composition. The artwork is hidden
from assistive technology, so the containing card must provide its event title.
