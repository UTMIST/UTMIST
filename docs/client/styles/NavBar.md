# Navbar CSS Documentation

## Core Styles

### Logo Text
- Uses gradient background with text clip
- Space Grotesk font, 1.5rem size
- Custom gradient defined in variables

### Container
- Flex layout with space-between
- Rounded edges (border-radius: 9999px)
- Gray border using CSS variable
- Responsive margins at breakpoints:
  - Default: 12.5rem
  - 1200px: 7.75rem
  - 768px: 2.5rem

### Navigation Items
- Gray color with hover state
- Roboto font, 1rem size
- Light weight (200)

### Button
- Gradient background (--gradient-b2)
- Scale and opacity hover effects
- Rounded corners (10px)
- White text
- Padding: 0.2rem 1.4rem

## Dependencies
- TailwindCSS
- CSS variables for:
  - `--gradient-logo`
  - `--gradient-b2`
  - `--gray1`, `--gray3`
  - `--font-space-grotesk`
  - `--font-roboto`

## File Location
navbar.css

## Usage
Applied to navbar component with responsive design for desktop and mobile views.