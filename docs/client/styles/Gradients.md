# UTMIST Gradient System Documentation

## Overview
Collection of custom CSS gradients used throughout the UTMIST website. These gradients are defined as CSS custom properties (variables) and correspond to specific design tokens in Figma.

## Gradient Variables

### Logo Gradient
```css
--gradient-logo: linear-gradient(0deg, rgba(8, 5, 91, 1) 2%, rgba(107, 102, 227, 1) 100%);
```
- **Usage**: UTMIST primary logo
- **Figma Link**: [Logo Gradient](https://www.figma.com/file/yourfile?node-id=1234:1)
- **Direction**: Bottom to top (0deg)

### Spotlight Gradient
```css
--gradient-spot: radial-gradient(circle, #C886C9 20%, #1E19B1 10%, #D9D9D9 0%);
```
- **Usage**: Decorative spotlight effects
- **Figma Link**: [Spotlight Effect](https://www.figma.com/file/yourfile?node-id=1234:2)
- **Type**: Radial with three color stops

### Black Linear Gradient
```css
--gradient-bl1: linear-gradient(90deg, #000000 0%, #5C5C5C 100%);
```
- **Usage**: Dark sections and overlays
- **Figma Link**: [Black Linear](https://www.figma.com/file/yourfile?node-id=1234:3)
- **Direction**: Left to right (90deg)

### Blue Gradients
```css
--gradient-b1: linear-gradient(180deg, #4A3D92 0%, #547BC5 47%, #99B4F9 100%);
--gradient-b2: linear-gradient(90deg, #6B66E3 0%, #1E19B1 100%);
--gradient-b3: linear-gradient(180deg, #1E19B1 0%, #A1A1A1 100%);
```
- **Usage**: 
  - B1: Vertical blue transitions
  - B2: Primary buttons and CTAs
  - B3: Secondary backgrounds
- **Figma Links**: 
  - [Blue Gradient 1](https://www.figma.com/file/yourfile?node-id=1234:4)
  - [Blue Gradient 2](https://www.figma.com/file/yourfile?node-id=1234:5)
  - [Blue Gradient 3](https://www.figma.com/file/yourfile?node-id=1234:6)

### Line Gradients
```css
--gradient-line-1: linear-gradient(90deg, #3D87F5 0%, #9C32E3 100%);
--gradient-line-2: linear-gradient(90deg, #98CDF9 0%, #1E19B1 100%);
```
- **Usage**: Decorative lines and borders
- **Figma Links**: 
  - [Line Gradient 1](https://www.figma.com/file/yourfile?node-id=1234:7)
  - [Line Gradient 2](https://www.figma.com/file/yourfile?node-id=1234:8)
- **Direction**: Left to right (90deg)

## Usage Example
```css
.element {
    background: var(--gradient-b2);
}
```

## File Location
gradients.css

## Notes
- Replace Figma links with actual design system URLs
- All gradients use standard CSS gradient syntax
- Variables follow a consistent naming convention
- Gradients support both RGB and HEX color formats