# Statistics Component Documentation

## Overview
A React component that displays UTMIST's key statistics in a grid layout. Contains a reusable `StatItem` sub-component for individual statistics.

## Components

### `StatItem`
A presentational component that renders a single statistic.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `number` | `string` | The numerical value to display (e.g., "100+") |
| `description` | `string` | Descriptive text for the statistic |

#### Usage
```tsx
<StatItem 
    number="100+" 
    description="developers across all teams"
/>
```

### `Statistics`
The main component that renders a grid of statistics.

## Current Statistics
- Developers count
- AI/ML projects completed
- Industry partnerships
- Academic workshops
- Published articles/notebooks
- Conference papers

## Example Usage
```tsx
import Statistics from '@/components/stats';

function Page() {
  return (
    <div>
      <Statistics />
    </div>
  );
}
```

## Required CSS Classes
- `stats-grid`: Grid container for statistics
- `stat-item`: Container for individual stat
- `stat-number`: Styling for the numerical value
- `stat-description`: Styling for the description text

## File Location
stats.tsx

## Notes
- Uses TypeScript for type safety
- Grid layout for responsive design
- Modular architecture with reusable components
- Currently renders 6 statistics items