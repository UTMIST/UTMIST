# HeroCard Component Documentation

## Overview
The HeroCard component is a reusable React component that displays a featured image with an associated title and description. It's designed for highlighting key content sections on the UTMIST website.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `image` | `string` | URL or path to the image to be displayed |
| `title` | `string` | Heading text for the card |
| `description` | `string` | Descriptive text content |

## Structure
```
HeroCard
├── Image Container
│   └── Next.js Optimized Image
└── Content Container
    ├── Title (h1)
    └── Description (p)
```

## Usage Example
```tsx
import HeroCard from '@/components/hero-card';

function Page() {
  return (
    <HeroCard
      image="/path/to/image.jpg"
      title="Who We Are"
      description="Description text goes here..."
    />
  );
}
```

## Features
- Optimized image loading using Next.js `Image` component
- Responsive design
- Rounded corners for images
- Structured content layout
- TypeScript support with defined prop types

## Styling
- Uses CSS modules from `home.css`
- Image container supports object-fit cover
- Rounded corners via `rounded-2xl` class
- Custom classes:
  - `hero-card-container`: Main wrapper
  - `hero-card-image`: Image container
  - `hero-card-content`: Text content wrapper
  - `hero-card-title`: Title styling
  - `hero-card-description`: Description text styling

## Dependencies
- next/image
- home.css styles
- TypeScript types

## File Location
hero-card.tsx