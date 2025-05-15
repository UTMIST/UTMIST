# `ProjectsPage` Component Documentation

## Overview

The `ProjectsPage` component is a client-side rendered page in a Next.js application that displays a categorized and searchable list of machine learning projects. It features carousels for different project categories and a gallery-style grid view of all projects with search functionality.

## Features

* Categorized project carousels with titles and descriptions
* Full searchable gallery of all projects
* GitHub and "Read More" links for each project
* Styled using custom CSS classes and Tailwind utilities
* Uses `lucide-react` icons and `next/image` for optimization

## File Location

`src/app/projects/page.tsx`

---

## Imports

```tsx
import "@/styles/projects.css";                       // Custom styles
import { useState } from "react";                    // State management
import Image from "next/image";                      // Optimized image handling
import { Search } from "lucide-react";               // Search icon
import projectsData from "@/assets/projects.json";   // Source data
import githubIcon from "@/assets/logos/github.svg";  // GitHub icon
import dummy from "@/assets/photos/fibseq.png";      // Placeholder image
import { ProjectCarousel } from "@/components/carousel";  // Carousel component
import { ProjectType, Project } from "@/types/projects"; // TypeScript types
```

---

## Component Structure

### `displayNames`

Maps each `ProjectType` enum to a human-readable display name.

### `projectTypeMap`

Maps raw string identifiers from the JSON to `ProjectType` enums for strong typing.

### `projects`

Transforms raw JSON data (`projects.json`) into an array of `Project` objects, injecting default values and types.

### `gradientClassMap`

Maps project types to custom Tailwind-compatible gradient CSS class names.

### `searchTerm` & `filteredProjects`

State hook for user search input and the filtered list of projects that match the search query.

---

## JSX Breakdown

### Hero Section

```tsx
<div className="hero-section">
  <h2 className="hero-title">Projects</h2>
  <p className="hero-subtitle">
    See the work of the engineers, researchers and pioneers of ML advancements
  </p>
</div>
```

### Project Carousels

Iterates over each `ProjectType` and displays projects in a horizontal carousel if any are available for that category.

```tsx
<ProjectCarousel projects={typeProjects} />
```

### Project Gallery (Grid View)

Below the carousels, all projects are shown in a searchable grid format with a responsive layout.

```tsx
<input
  type="text"
  className="search-bar-input"
  placeholder="Search projects..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

```tsx
{filteredProjects.map((card, index) => (
  <div key={index} className="project-card">...</div>
))}
```

---

## Props

This is a **page component**, so it does **not take props**. It operates with local state and imported data.

---

## Styling

CSS classes used include:

* **Page layout**: `hero-section`, `project-gallery-container`, `project-section-container`
* **Typography**: `hero-title`, `hero-subtitle`, `project-section-title`, `project-gallery-title`
* **Cards**: `project-card`, `project-card-title`, `project-card-description`, `project-image`
* **Buttons/Icons**: `github-link`, `github-icon`, `search-icon`

Gradient backgrounds are applied via the `gradientClassMap` to project section headers.

---

## Types Used

### `Project`

```ts
interface Project {
  title: string;
  description: string;
  github?: string;
  image: StaticImageData;
  imageAltText?: string;
  type: ProjectType;
  readMoreLink: string;
}
```

### `ProjectType`

```ts
enum ProjectType {
  genai = "genai",
  cvpr = "cvpr",
  finml = "finml",
  medai = "medai",
  supvlr = "supvlr",
  mlops = "mlops",
  aiapps = "aiapps",
}
```

---

## Accessibility

* All images have `alt` text
* External links use `target="_blank"` and `rel="noopener noreferrer"` for security
* Search input is keyboard and screen-reader accessible

---

## Optimization

* Uses `next/image` for lazy loading and responsive images
* JSON parsing ensures fallback values to prevent crashes
* Only loads carousels for categories with data

---

## Suggested Improvements

* Load actual image URLs per project instead of using a placeholder
* Extract constants like `gradientClassMap` into a separate config file
* Consider SSR or SSG for performance on larger project datasets
