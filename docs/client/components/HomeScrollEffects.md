# Homepage scroll effects

`features/public-site/components/home-scroll-effects.tsx` is the client shell
around the redesigned homepage's server-rendered sections. It only mounts when
`Web-Redesign` is enabled. The legacy homepage and shared navigation are unaffected.

`lib/home-motion.ts` holds the shared timing, easing, reveal distances and network
wave timing. Section copy, headings, impact tiles, event cards, startup benefits
and FAQ rows all use the same 700ms entrance, moving up 16px on desktop or 8px on
phones. Add `data-home-reveal` to an element to use this preset without a wrapper.
Card grids use `data-home-stagger="row"`; the sponsor mosaic uses `"diagonal"`.
The controller measures the rendered grid to stagger by 70ms per column (and row
for the mosaic), capped at 420ms. Only occupied sponsor tiles animate; empty cells
remain as unpainted spacing.
Each item enters independently, so long grids still reveal as you scroll on phones.

All selection-style highlights (`.home-selection`)
fill from left to right on scroll down and retain their furthest progress on
scroll up. Partially filled highlights continue when scrolling farther down;
completed highlights stay filled for the lifetime of the page. The mission's
“all skill levels,” the sponsors' “together,” the events heading's “flagship,”
and the community statement's selected phrase share the same viewport timing:
from the top of their heading or statement reaching 75% of the viewport to its
midpoint reaching 30% (measured from the top of the screen). The later start
lets the copy enter before the fill begins; the longer scroll range slows the
sweep while the text is visible. Fill follows scrolling rather than a fixed
duration. Each highlight tracks its own progress through the common controller
and offsets in `home-motion.ts`.
Live text, gradient fade, rotation and selection handles keep their existing layout;
wrapped highlights retain their fill on every line. The complete fill is the
fallback without JavaScript or with reduced motion.
The hero's “University of Toronto” and the events attribution “@utmist” use
static colour accents and do not participate in the highlight animation.
The network plays one introductory wave on entry without selecting a discipline.
Hover, focus, tap and Escape immediately take precedence; its slow fade is retained.

All content is visible in the server HTML. Only offscreen elements are prepared for
entrance after hydration; content at a restored scroll position stays visible.
Keyboard focus completes an entrance immediately. Completed reveals do not replay.
Reduced motion shows the finished layout and skips autoplay, including when the
preference changes while the page is open. Cleanup cancels observers, scroll
subscriptions and timers; the page uses native browser scrolling throughout.
Switching reduced motion off keeps highlights fully filled rather than replaying them.

Unit tests cover reveal lifecycle, focus, preference changes, remounts and network
interaction during autoplay. Browser verification checks the actual stagger,
highlight progress, native scrolling, mobile layout and reduced-motion fallback.
