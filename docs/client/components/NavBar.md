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
import Navbar from '@/components/navbar';

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
- Blog
- Events
- Careers

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
src/components/navbar.tsx