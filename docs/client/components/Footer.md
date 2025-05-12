# Footer Component Documentation

## Overview
The Footer component is a reusable React component that displays the UTMIST logo and social media links. It's designed to be used at the bottom of pages across the UTMIST website.

## Props
This component doesn't accept any props.

## Structure
- Main container with class `footer-container`
- UTMIST logo section with organization name
- Social media links section
- Decorative line element

## Social Media Integration
Includes links to:
- Discord
- LinkedIn
- Instagram
- Facebook
- Twitter
- GitHub
- Medium

## Usage Example
```tsx
import Footer from '@/components/footer';

function Page() {
  return (
    <div>
      {/* Your page content */}
      <Footer />
    </div>
  );
}
```

## Styling
- Uses CSS modules from `footer.css`
- Utilizes Tailwind CSS utility classes
- Images are optimized using Next.js `Image` component

## Dependencies
- next/image
- SVG logo assets
- footer.css styles

## Notes
- All social media links currently point to `/privacy` - these should be updated with actual social media URLs
- Logo container has fixed dimensions for consistent sizing
- Uses UTMIST's brand gradient for the logo text