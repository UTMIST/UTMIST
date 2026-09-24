# EigenAI page

`/eigenai` is a public event page served behind the `Eigen-AI-Redesign` Vercel
feature flag (#447). Which page a visitor sees is chosen **on the server**, so
there is no flash of the wrong page and the choice is never frozen at build.

## Location

- Route shell: `client/src/app/(frontend)/eigenai/page.tsx` — re-exports the
  selector's `default` and its `dynamic`.
- Selector (server): `client/src/features/public-site/pages/eigenaiFlagged.tsx`.
- Existing page (client): `client/src/features/public-site/pages/eigenai.tsx`.
- Redesign page: `client/src/features/public-site/pages/eigenaiRedesign.tsx`.

## How the selection works

`eigenaiFlagged.tsx` is an async server component with
`export const dynamic = "force-dynamic"` (per-request evaluation; `/eigenai` is
not statically prerendered). It reads the optional current profile with
`getCurrentUser()` — the page is public, so it never `requireUser()` — and calls:

```tsx
const showRedesign = await evaluateFlag(
  "Eigen-AI-Redesign",
  contextFromProfile(profile),
);
return showRedesign ? <EigenAIRedesign /> : <EigenAIPage />;
```

`evaluateFlag` (from `@/shared/lib/server`) is **default-off**: a missing flag,
missing configuration, or an evaluation failure returns `false`, so anything but
an explicit "on" keeps the existing page. See
[../flags.md](../flags.md) for the flag runtime, auth (per-environment SDK keys),
and the embedded-fallback mitigation.

## Rollout / opt-in

The flag is **off in production** until the redesign launches (#444). To preview
the redesign, turn `Eigen-AI-Redesign` **ON in the Development / Preview**
environment in the Vercel dashboard; a toggle takes effect on the next request
without a redeploy. The redesign is scoped to the `.eigenai-redesign` wrapper
and uses responsive metric, speaker, keynote, workshop, and event-lockup
components. It reuses the existing EigenAI content, speaker portraits, event
photography, UTMIST branding, social assets, and shared button primitive.
The redesign uses locally bundled copies of the Figma type families (DM Serif
Display, DM Sans, and Instrument Sans) and keeps its cyan, white, and lavender
text gradients and glow treatments scoped to that page.
When the redesign is present, page-scoped `:has()` selectors suppress the
shared site navbar, footer, and floating theme control. The redesign supplies
its own responsive navigation and footer inside the continuous orbital
background, using the same liquid-glass surface treatment as the event UI.
Until the final conference lineup is approved, the redesign intentionally uses
the placeholder speaker names, roles, and workshop copy shown in Figma. Those
cards reuse existing repository portraits; the canonical EigenAI speaker data
remains unchanged.
The UTMIST lockups use the exported Figma `White Side 2` artwork rather than a
typed approximation, preserving the custom letterforms in the hero, EigenAI
navigation, and footer.

## Gotchas

- The existing page reads `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and throws on render
  if it is unset. Because `/eigenai` is now `force-dynamic`, this throws at
  request time, not during `next build`.
- The redesign deliberately has **no** Maps dependency, so the "on" branch
  renders without that key.

## Tests

- `client/tests/unit/pages/eigenai-selector.test.tsx` — off → existing, on →
  redesign, default-off → existing (server barrel mocked).
- `client/tests/unit/pages/eigenai.test.tsx` — the existing page's own
  render/data/throw assertions (imports the component directly).
