# ProjectCard Component Documentation

## Overview

The `ProjectCard` component is a reusable UI card that visually presents details about a project, including its title, description, image, GitHub link, and a “Read More” button. It is typically used within the `ProjectCarousel` component to display a list of projects.

## Dependencies

* `next/image` (for optimized image rendering)
* GitHub icon (`github.svg`)
* Tailwind CSS for styling
* Project type interface (`Project`)

## Structure

```
ProjectCard
├── Project Image (top)
├── Project Title
├── Project Description
├── GitHub Link (optional)
└── Read More Link
```

## Usage

```tsx
import ProjectCard from '@/components/cards/project-card';
import type { Project } from '@/types/projects';

const sampleProject: Project = {
  title: 'My Project',
  description: 'This is a cool project.',
  image: '/path/to/image.png',
  github: 'https://github.com/user/project',
  readMoreLink: 'https://example.com',
};

<ProjectCard {...sampleProject} />;
```

## Props

| Name           | Type     | Required | Description                                                |
| -------------- | -------- | -------- | ---------------------------------------------------------- |
| `title`        | `string` | ✅        | The title of the project                                   |
| `description`  | `string` | ✅        | A short description of the project                         |
| `image`        | `string` | ✅        | Path or URL to the image used in the card                  |
| `github`       | `string` | ❌        | Optional GitHub repository URL                             |
| `readMoreLink` | `string` | ✅        | URL to the detailed project page                           |
| `imageAltText` | `string` | ❌        | Optional alt text for the image (default: "Project Image") |

## Behavior

* Renders the project image at the top of the card using `next/image`
* Displays a GitHub icon linking to the project repo (if provided)
* Includes a “Read More” link that opens in a new tab
* Applies consistent styling using utility classes and external CSS

## Styling

* Custom classes (defined in `project.css` or global styles):

  * `project-card`: Wrapper with max width and responsive design
  * `project-card-title`: Styles for project titles
  * `project-card-description`: Styles for project description text
  * `project-card-image`: Wrapper around the project image
  * `github-link`: Style for the GitHub link
  * `github-icon`: Sizing and spacing for the GitHub icon

## Notes

* The image uses `objectFit="cover"` for consistent aspect ratio
* Accessible by using `alt` text on all images
* `target="_blank"` and `rel="noopener noreferrer"` used for safe external linking

## File Location

`src/components/cards/project-card.tsx`
