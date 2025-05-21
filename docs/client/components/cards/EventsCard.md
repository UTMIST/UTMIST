# EventCard Component Documentation

## Overview
A reusable React component that displays event information with a title, description, and "View More" button.

## Props Interface
```typescript
interface EventCardProps {
    title: string;        // Event title
    description: string;  // Event description
    onClick?: () => void; // Optional click handler for the button
}
```

## Component Structure
```
EventCard
├── Content Container
│   ├── Title (h2)
│   └── Description (p)
└── View More Button
```

## Usage Example
```tsx
import EventCard from '@/components/cards/event-card';

function EventsPage() {
    return (
        <EventCard 
            title="EigenAI Conference"
            description="Annual AI conference featuring workshops and expert talks"
            onClick={() => console.log('Navigating to event details')}
        />
    );
}
```

## Required CSS Classes
- `event-card-container`: Main wrapper
- `event-card-content`: Content section container
- `event-card-title`: Title styling
- `event-card-description`: Description text styling
- `event-card-button`: View More button styling

## Dependencies
- React
- `home.css` for styling

## File Location
events-card.tsx

## Notes
- Typescript support with defined interfaces
- Optional click handler for button interactivity
- Modular design for reusability
- Follows UTMIST design system
- Button text is hardcoded as "View More"