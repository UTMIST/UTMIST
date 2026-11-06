# HeroLightBackground

`features/public-site/components/hero-light-background.tsx` provides the
decorative glass and light animation shared by the redesigned homepage and
Academics. It uses the shared `IconButton` for pause/resume and keeps animation
work outside React rendering.

```tsx
<section className="relative isolate min-h-dvh overflow-hidden bg-black">
  <HeroLightBackground theme="f2f" />
  {/* Hero content */}
</section>
```

The optional `theme` is `home` (the existing blue palette, the default) or `f2f`
(mint `#52ddac` and teal `#008787`). Each theme selects a local image fallback.
The containing section supplies sizing, clipping, and an isolated stacking
context; the component does not own the page's title, layout, or navigation.

`hero-light-renderer.ts` accepts a typed RGB palette and passes it as shader
uniforms. Pointer tracking, fixed glass ribs, ambient motion, and grain are
identical across themes. Reduced motion draws a still frame and hides the pause
control. Animation stops while paused, offscreen, or in a hidden tab. A missing
or lost WebGL context reveals the image fallback and hides the motion control.
Unmounting or changing themes releases listeners, observers, and GPU resources;
changing themes preserves the visitor's pause choice.

Behavior coverage lives in `hero-light-background.test.tsx` and
`hero-light-renderer.test.ts`. Browser verification should include both routes,
keyboard pause/resume, pointer response, reduced motion, and WebGL fallback.
