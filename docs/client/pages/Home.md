# Home Page Component Documentation

## Overview
Main landing page component for the UTMIST website, featuring a hero section, sponsors, statistics, and mission statements.

## Component Structure
```
Home
├── Hero Section (CTA)
│   ├── Title & Subtitle
│   ├── Action Buttons
│   └── Logo
├── Sponsors Section
├── Statistics Section
└── Info Cards Section
    ├── "Who We Are" Card
    └── "Our Mission" Card
```

## Dependencies
```typescript
import HeroCard from "@/components/cards/hero-card"
import Image from "next/image"
import utmistLogo from "@/assets/logos/utmist-logo-large.svg"
import execPhoto from "@/assets/photos/eigenai-exec-photo.png"
import Sponsors from "@/components/sponsors"
import Statistics from "@/components/stats"
```

## Key Sections

### CTA Section
- Main hero section with "Clear The MIST" headline
- Organization subtitle
- Two action buttons: "Join Us" and "Contact Us"
- Large UTMIST logo display

### Statistics Display
- Centered headline about organization scale
- Statistical metrics component

### Hero Cards
- Two cards showing organization info
- Separated by gradient line
- Uses same image for both cards
- Consistent messaging across cards

## Styling
- Uses combination of custom CSS classes and Tailwind utilities
- Responsive design patterns
- Custom gradient effects
- Consistent spacing system

## File Location
page.tsx

## Usage
```typescript
// In app layout or router
import Home from './page'
```

## Notes
- Uses Next.js Image optimization
- Implements responsive design
- Prioritizes logo loading with `priority` prop
- Reuses components for consistent UI
- Content structure follows brand messaging