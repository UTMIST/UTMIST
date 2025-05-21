# Careers Page Component Documentation

This document describes the structure, functionality, and visual elements of the `CareersPage` React component in a Next.js application.

---

## 📁 File

```tsx
/pages/careers.tsx
```

---

## 📌 Purpose

The `CareersPage` component displays a careers landing page for an organization. It includes:

* A **hero section** with a title and subtitle.
* Two **career cards** highlighting benefits of joining the team.
* A dynamic list of **open positions** fetched from a predefined array.

---

## 📦 Imports

```ts
import "@/styles/careers.css"; // Custom CSS for the Careers page
import Image from "next/image"; // Optimized Next.js image component
import blueTick from "@/assets/icons/blue-tick-icon.svg"; // Light blue check icon
import darkBlueTick from "@/assets/icons/dark-blue-tick-icon.svg"; // Dark blue check icon
import { Positions } from "@/types/careers"; // Type definition for open positions
```

---

## 🧩 Component Structure

### `positions: Positions[]`

Hardcoded list of available positions.

```ts
const positions: Positions[] = [
  {
    title: "10x Engineer",
    department: "Engineering",
    division: "Internship"
  },
  {
    title: "Software Developer",
    department: "Engineering",
    division: "Internship"
  }
];
```

---

## 🧱 Layout Sections

### 1. **Hero Section**

```html
<div className="hero-section">
  <h2 className="hero-title">Careers</h2>
  <p className="hero-subtitle">
    Help shape the future of AI and ML at UTMIST
  </p>
</div>
```

Displays the title and mission statement for the careers page.

---

### 2. **Career Cards Section**

Displays two cards that describe benefits of joining:

* **Hands-on ML Experience**
* **Robust Professional Network**

Each card includes:

* An icon (either `blueTick` or `darkBlueTick`)
* A short description with supporting text
* Divider lines between rows

Example snippet:

```tsx
<div className="career-card">
  <h2 className="career-card-title">Hands on ML Experience</h2>
  <div className="career-card-row">
    <Image src={blueTick} alt="Blue Tick Icon" width={20} height={20} objectFit="cover" />
    <p className="career-card-description">Build impactful projects using AI and ML</p>
  </div>
</div>
```

---

### 3. **Open Positions Section**

Dynamically renders a list of job opportunities from the `positions` array. Each card includes:

* Title
* Department and Division
* “Apply Now” button (currently static)

```tsx
{positions.map((position, index) => (
  <div key={index} className="position-card">
    <div className="position-info">
      <h2 className="position-title">{position.title}</h2>
      <div className="position-details">
        <span>{position.department}</span>
        <span className="dot">•</span>
        <span>{position.division}</span>
      </div>
    </div>
    <button className="apply-button">Apply Now</button>
  </div>
))}
```

---

## 🖼 Icons Used

* `blueTick`: Used for technical skill benefits
* `darkBlueTick`: Used for networking/professional benefits

---

## 🧪 Types Used

```ts
export interface Positions {
  title: string;
  department: string;
  division: string;
}
```

This interface defines the structure for each open job posting.

---

## 🎨 CSS Classes

Defined in `/styles/careers.css`. Key classes include:

* `hero-section`, `hero-title`, `hero-subtitle`
* `career-card`, `career-card-title`, `career-card-description`
* `career-card-row`, `career-card-line`
* `open-positions-container`, `position-card`, `position-title`, `apply-button`, etc.

---

## 📈 Future Improvements

* Link “Apply Now” button to an application form or external job portal.
* Fetch job listings from a backend or CMS dynamically.
* Add filtering by department or division.
