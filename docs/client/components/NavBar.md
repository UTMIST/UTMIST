# Navbar Component Documentation

## Overview
The Navbar component is a responsive navigation bar for the UTMIST website, featuring the organization's logo, main navigation links, and a login button.

## Dependencies
- `next/image`
- `navbar.css`
- `gradients.css`
- SVG logo asset

## Structure
```
Navbar
├── Logo Section (left)
├── Navigation Links (center)
├── Light/Dark Mode (right)
└── Login Button (far right)
```

## Usage
```tsx
import { Navbar } from '@/shared/ui/client';

function Layout() {
  return (
    <div>
      <Navbar />
      {/* Page content */}
    </div>
  );
}
```

## Navigation Links
- Projects
- About Us
- Sponsors
- Events
- Careers
- Programs (MISTic R&D and MLF)
- EigenAI when `showEigenAI` is true

The server layout resolves `Eigen-AI-Redesign` and passes its boolean as
`showEigenAI`; the navbar does not evaluate flags in the browser. The optional
prop defaults to false. Login changes to Profile for a signed-in visitor.

At widths up to 768px, links appear in the mobile menu. The menu locks body
scrolling while open and restores the previous overflow style on dismissal or
unmount. Cleanup on unmount matters when browser history returns to EigenAI,
whose page supplies its own navigation. From 769px through 1024px, enabling the
EigenAI promotion tightens link spacing so Login/Profile remains on one row.

`client/tests/unit/navbar.test.tsx` covers the promotion, Programs menu, and
scroll-lock cleanup.

## Styling
- Uses Tailwind CSS utility classes for layout
- Custom CSS classes:
  - `navbar-container`: Main container styles
  - `navbar-logo-text`: Gradient text effect for logo
  - `nav-item`: Navigation link styles
  - `nav-button`: Login button styles

## Notes
- Logo dimensions are fixed at 32x32 pixels
- Navigation links use relative paths
- Layout is horizontally distributed using flexbox
- Custom gradient effects are imported from `gradients.css`

## File Location
`client/src/shared/ui/navbar.tsx`
