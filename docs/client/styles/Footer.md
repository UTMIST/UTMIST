# Footer CSS Documentation

## Core Styles

### Container (`.footer-container`)
- Flex column layout
- Centered content
- Light padding
- Foreground token text color

### Logo Styles (`.footer-logo`)
- 1.25rem font size
- Bold weight
- Small bottom margin

### Logo Container (`.footer-logo-container`)
- Circular background (`--muted`)
- Fixed dimensions: 44x44px, with the border on the link so the full target is clickable
- Centered content
- No internal padding; icons remain 20x20px
- Social grid uses six columns, or three below 359px, in both footer variants
- Bug-report links have a minimum height of 44px

### Decorative Line (`.footer-line`)
- 90% width
- 5px height
- Dual gradient background
  - Uses `--gradient-line-1`
  - Uses `--gradient-line-2`
- Small vertical margins

## Dependencies
- CSS variables:
  - `--muted`
  - `--border`
  - `--foreground`
  - `--gradient-line-1`
  - `--gradient-line-2`

## File Location
footer.css

## Usage
Applied to footer component for consistent bottom page styling and social media links layout.
