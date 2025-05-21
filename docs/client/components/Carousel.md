# ProjectCarousel Component Documentation

## Overview

The `ProjectCarousel` component displays a horizontally scrollable list of project cards with smooth scroll behavior, arrow navigation, and fade effects at the edges for visual guidance. It is designed to showcase featured projects on the UTMIST website in a clean and interactive way.

## Dependencies

* `lucide-react` (for Chevron icons)
* Tailwind CSS utility classes
* `project-card.tsx` component
* `projects.css` for custom styling

## Structure

```
ProjectCarousel
├── Left Fade Gradient (conditionally rendered)
├── Left Navigation Button (conditionally rendered)
├── Scrollable Carousel (with ProjectCards)
├── Right Fade Gradient (conditionally rendered)
└── Right Navigation Button (conditionally rendered)
```

## Usage

```tsx
import { ProjectCarousel } from '@/components/carousels/project-carousel';
import type { Project } from '@/types/projects';

const projects: Project[] = [/* array of project data */];

function HomePage() {
  return (
    <div>
      <ProjectCarousel projects={projects} />
    </div>
  );
}
```

## Props

| Name       | Type        | Description                                                                    |
| ---------- | ----------- | ------------------------------------------------------------------------------ |
| `projects` | `Project[]` | An array of project objects used to render each `ProjectCard` in the carousel. |

## Behavior

* Scroll buttons appear only when there is more content to scroll in the respective direction.
* Smooth scrolling is triggered when the user clicks the left/right navigation buttons.
* Edge fade gradients appear on the sides to indicate overflow content.
* The component dynamically checks scroll position to toggle arrow and gradient visibility.

## Styling

* Uses Tailwind CSS for layout, transitions, and spacing
* Custom CSS file `projects.css` may contain additional scroll styling such as `no-scrollbar`

### Key Classes

| Class                 | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| `carousel-container`  | Wraps the entire carousel and buttons              |
| `no-scrollbar`        | Hides the default browser scrollbar                |
| `bg-gradient-to-r/l`  | Creates fade effect on the left/right edges        |
| `absolute`, `z-10/20` | Positions navigation buttons and gradient overlays |

## Notes

* The scroll offset is hardcoded to `300px` per button click
* Gradients and buttons are only rendered when needed (based on scroll position)
* Works well with responsive layouts due to Tailwind’s utility classes

## File Location

`src/components/carousels/project-carousel.tsx`
