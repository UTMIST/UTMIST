## CSS Documentation for Hero Section Styles

### `.hero-section`

* **Layout:** Flex container, vertical column
* **Alignment:** Centered content horizontally and vertically (`justify-content: center; align-items: center;`)
* **Spacing:** Padding of 4rem top/bottom and 2rem left/right
* **Width:** Max width 1000px with horizontal auto margin to center the section
* **Text:** Center-aligned

---

### `.hero-title`

* **Font:** Large size (3rem), bold weight (700)
* **Text style:** Gradient text using `var(--gradient-bl1)` with `background-clip: text` and transparent fill for gradient effect
* **Font family:** Uses system font from CSS variable `--system-font`

---

### `.hero-subtitle`

* **Font:** Smaller size (1rem), light weight (200)
* **Color:** Dark gray (#111827)
* **Font family:** System font (`--system-font`)
* **Padding:** Horizontal padding of 15rem on both sides for wide spacing

---

### `.hero-blog-section`

* **Layout:** Horizontal flex container (`flex-direction: row`)
* **Alignment:** Space between items (`justify-content: space-between`)
* **Gap:** 1rem gap between child elements
* **Padding:** Horizontal padding of 14rem on both sides
