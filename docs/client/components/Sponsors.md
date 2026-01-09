# Sponsors Component Documentation

## Overview
A React component that displays UTMIST's sponsor logos in a grid layout with a "Supported By" header.

## Dependencies
- `next/image`: For optimized image loading
- Local SVG logo files for sponsors:
  - AMD
  - Qualcomm
  - Vector Institute
  - Google Cloud

## Component Structure
```
Sponsors
├── Title ("Supported By")
└── Sponsors Grid
    ├── AMD Logo
    ├── Qualcomm Logo
    ├── Vector Institute Logo
    └── Google Cloud Logo
```

## Usage Example
```tsx
import Sponsors from '@/components/sponsors';

function Page() {
  return (
    <div>
      <Sponsors />
    </div>
  );
}
```

## Required Assets
All logos should be in SVG format and stored in:
```
src/
└── assets/
    └── logos/
        ├── amd.svg
        ├── qualcomm.svg
        ├── vector.svg
        └── google-cloud.svg
```

## Styling
- Uses CSS modules from `home.css`
- Key classes:
  - `sponsors-container`: Main wrapper
  - `sponsors-title`: Title styling
  - `sponsors-grid`: Logo grid layout

## Image Properties
- Uses Next.js Image optimization
- `objectFit: 'contain'` to preserve logo aspect ratios
- Alt text provided for accessibility

## File Location
sponsors.tsx

## Notes
- Responsive design for different screen sizes
- SVG format preferred for logo quality
- Next.js Image component for performance optimization
- No explicit dimensions set (consider adding width/height props)