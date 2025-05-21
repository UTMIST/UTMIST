## 🎯 Hero Section

### `.hero-section`

Defines the layout and appearance of the hero section:

* Centers content both vertically and horizontally.
* Limits width to 1000px and centers it with `margin: auto`.
* Applies padding and centers text.

### `.hero-title`

Stylizes the main title:

* Uses a large font size and bold weight.
* Applies a gradient to the text using `background-clip` and transparent fill.
* Uses the custom `--system-font`.

### `.hero-subtitle`

Stylizes the subtitle under the hero title:

* Smaller, lighter text.
* Padded left and right to control text width (especially on wider screens).
* Uses the same font as the title.

---

## 📦 Project Section

### `.project-section-container`

Container for each project section:

* Sets width and height.
* Uses `flex` layout to align content at the bottom.
* Rounded corners and internal padding.

### `.gradient-*`

Background gradient classes for each project type:

* Uses custom CSS variables like `--gradient-proj1` and `--gradient-proj4`.
* Some use `background-blend-mode: overlay` for blending effects.

### `.project-section-title`

Stylizes the project section's title:

* Large, bold, white text with left alignment.
* Slight letter spacing reduction.

### `.project-section-description`

Stylizes the project section's description:

* Slightly smaller white text.
* Adds margin for spacing from title.

---

## 🃏 Project Cards

### `.project-card`

Container for each individual project card:

* White background with rounded corners.
* Contains padding and a subtle border.
* Adds hover effects for interactivity.

### `.project-card-title`

Stylizes the title inside each project card:

* Medium-large font size, bold, and dark text.
* Uses `--font-space-grotesk` for a distinctive look.

### `.project-card-description`

Stylizes the description inside each card:

* Smaller font with muted gray color.

### `.github-link`

Styles the GitHub link inside cards:

* Inline flex for icon alignment.
* Uses system font with medium weight.

### `.github-icon`

Defines size for GitHub SVG icons.

---

## 🧱 Projects Grid

### `.projects-grid`

Grid layout for multiple cards:

* 3-column layout with responsive breakpoints:

  * 2 columns on medium screens (`max-width: 1024px`)
  * 1 column on small screens (`max-width: 640px`)
* Adds spacing and horizontal padding.

---

## 🖼 Project Gallery

### `.project-gallery-container`

Container for project gallery section:

* Centers items in a column.
* Adds vertical padding.

### `.project-gallery-title`

Stylized title:

* Uses gradient-filled text.
* Center-aligned.

### `.project-gallery-subtitle`

Light subtitle text under the title.

---

## 🔍 Search Bar

### `.search-bar-container`

Outer container for the search bar:

* Rounded pill shape with padding.
* Applies a decorative gradient border using `::before` with a mask trick.
* Uses `position: relative` for internal layout.

### `.search-bar-input`

Styles the input element:

* Transparent background.
* No borders or outlines.
* Black text color.

### `.search-icon`

Styles the magnifying glass icon:

* Positioned absolutely to the right of the input.
* Uses Tailwind-inspired gray color.

---

## 🎠 Carousel

### `.carousel-container`

Defines the wrapper of the carousel:

* Hides overflow, horizontally scrollable.
* Adds horizontal padding.

### `.carousel-content`

Scrollable container for the carousel:

* Uses `scroll-snap-type` for smoother scroll experience.
* Hides scrollbars on all browsers.

### `.carousel-content::-webkit-scrollbar`

Hides the scrollbar in WebKit browsers.

---

## ⬅️➡️ Carousel Navigation Buttons

### `.carousel-nav-button`

Circular buttons for left/right navigation:

* Positioned vertically centered.
* Adds shadow and hover effects.

### `.carousel-nav-button.left`

Positions the left button on the left side.

---

## 🙈 No Scrollbar Utility

### `.no-scrollbar`

Utility class to hide scrollbars:

* Compatible with WebKit and Firefox.

---

## 🌫 Fade Gradient Overlays

### `.fade-left` & `.fade-right`

Used to create fade effects on the edges of the carousel:

* Gradient fades from white to transparent.
* Positioned absolutely and disabled pointer events.