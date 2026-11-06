# Navbar

`Navbar`, exported from `@/shared/ui/client`, selects the legacy or redesigned
navigation through its `redesignEnabled` prop. The frontend layout supplies the
server-evaluated `Web-Redesign` decision. The EigenAI route family has its own
navigation. Login links to `/auth`; signed-in visitors see Profile instead.

```tsx
import { Navbar } from "@/shared/ui/client";

<Navbar redesignEnabled={redesignEnabled} />
```

## Redesigned navigation

`shared/ui/redesigned-navbar.tsx` overlays the homepage and uses a dark background
on other routes. Equal outer grid columns keep desktop links centered between
the logo and account action. The shared
[ContentContainer](ContentContainer.md) aligns it with homepage section gutters.
Below the desktop breakpoint, a shared dark-tone `IconButton`
opens a scrollable disclosure; Login/Profile remains inside that disclosure.
Login/Profile matches the navigation labels' responsive type size and letter
spacing, and its desktop height includes the pill's two 1px borders.

The desktop pill, Login/Profile button, mobile disclosure, and dropdown borders
derive `--nav-edge` from the shared neutral `--gray1` token. The outlines stay
gray independently of the page's accent color. EigenAI supplies its own
navigation and palette.

Events and its chevron are one link to `/events`. Hover, keyboard focus, or
ArrowDown reveals EigenAI. On touch, the first tap reveals the submenu and the
next follows Events. Programs uses a shared `Button` to reveal MISTic R&D and MLF.
Only one submenu opens at a time. Escape closes the submenu and restores its
trigger's focus, or closes the main disclosure and focuses the menu toggle.
Navigation and pathname changes dismiss open menus.

## Legacy navigation

The legacy navbar keeps its original layout and direct EigenAI link. Its mobile
menu locks body scrolling while open, restoring the previous overflow on
close or unmount. Programs supports hover and click disclosure.

Tests in `navbar.test.tsx` and `pages/redesigned-navbar.test.tsx` cover both
layouts, destinations, authentication state, menu interactions, route changes,
and focus/scroll cleanup. Keep menu controls native buttons and destinations
links, and preserve their accessible names and expanded states.

Navigation uses the shared dark-surface palette and focus tokens. Its menu
control has a 44px target and a 20px icon, owned by `IconButton`.
