# Dark/Light Theme Implementation Guide

## Architecture

### Core Components

1. **ThemeProvider** (`client/src/components/theme-provider.tsx`)
   - Wraps the entire application in `layout.tsx`
   - Uses `next-themes` library for theme management
   - Configuration:
     - `attribute="class"` - Uses CSS classes for theme switching
     - `defaultTheme="system"` - Respects user's system preference
     - `enableSystem` - Allows automatic system theme detection
     - `disableTransitionOnChange` - Prevents flash during theme changes

2. **ThemeToggle** (`client/src/components/theme-toggle.tsx`)
   - Provides theme switching button with sun/moon icons
   - Uses `useTheme()` hook from `next-themes`
   - Includes proper hydration handling to prevent SSR mismatches

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  // ... 
}
```

### CSS Variables System

The theme system uses CSS custom properties defined in `globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --card: #ffffff;
  --border: #d9d9d9;
  /* ... other light theme variables */
}

.dark {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --card: #1a1a1a;
  --border: #374151;
  /* ... other dark theme variables */
}
```

## Implementation Patterns

### Method 1: Tailwind Dark Mode Classes (Recommended)

Use Tailwind's `dark:` prefix for theme-aware styling:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content here
</div>
```

**Examples from codebase:**
- `bg-white dark:bg-gray-900`
- `bg-white dark:bg-gray-800 border-gray-200 dark:border-blue-800`
- `from-white/90 dark:from-gray-900/90`

Note: you must define both light (`bg-white`) and dark (`dark:bg-gray-900`). There must be a contrast - you can't just define dark theme, otherwise theme switching will not work.

### Method 2: CSS Custom Properties

Reference CSS variables defined in `globals.css`:

```tsx
<div 
  className="border"
  style={{
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)'
  }}
>
  ...
</div>
```