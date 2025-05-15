## 📘 `Home` Page Documentation

### 📂 File Location

```
pages/index.tsx
```

### 📄 Description

This file defines the **landing page** of the UTMIST website. It integrates multiple sections to provide an overview of the organization, including the call-to-action (CTA), sponsor recognition, statistics, mission, events, and a FAQ.

---

### 🛠️ Technologies Used

* **React + Next.js (App Router)** for component-based page rendering
* **Next.js Image Optimization** (`next/image`)
* **Tailwind CSS** for styling and responsive design
* **Component Composition** with modular imports

---

### 🧩 Sections Overview

#### 1. **Hero (CTA) Section**

```tsx
<div className="cta-container">
  ...
</div>
```

* Title: “Clear The MIST”
* Subtitle: “University of Toronto Machine Intelligence Student Team”
* Two call-to-action buttons: **Join Us**, **Contact Us**
* Includes the large UTMIST logo and a large stylized background title

✅ **Component Logic**: Static JSX, responsive layout

---

#### 2. **Sponsors Section**

```tsx
<Sponsors />
```

* Pulls in a custom component (`components/sponsors.tsx`)
* Displays logos or information about organizational sponsors

✅ **Componentized**, reusable

---

#### 3. **Statistics Section**

```tsx
<Statistics />
```

* Wrapped with a paragraph introducing UTMIST's impact
* Displays numeric facts about the organization (e.g. members, projects, events)

✅ Should support prop-based customization in future if reused

---

#### 4. **Mission/About Section**

```tsx
<section id="about-us">
  <HeroCard />
</section>
```

* **HeroCard** is used twice:

  * First: “Who We Are” section (exec photo)
  * Second: “Our Mission” section (co-president speech photo)
* Vertical divider (`hero-line`) separates the two cards

✅ Uses visual storytelling through custom photos
🧠 Could support animation/scroll reveals in future

---

#### 5. **Events Section**

```tsx
<Events />
```

* Imports a standalone component that likely displays upcoming/past events
* Positioned after the mission section

---

#### 6. **Value Proposition Section**

```tsx
<ValueProps />
```

* Likely lists out what benefits members can expect from UTMIST
* Preceded by a centered paragraph about UTMIST's inclusive, innovative culture

---

#### 7. **FAQ Section**

```tsx
<div className="faq-section">...</div>
<FAQ />
```

* Displays a static title encouraging user questions
* Includes an interactive accordion-style component for FAQs
* Each FAQ is expandable with a `+` toggle icon

---

### 🧠 Internal Notes

#### ✅ **Reusable Components**

* `HeroCard`, `Events`, `Sponsors`, `ValueProps`, `Statistics`, `FAQ`
* Well-structured modular architecture makes maintenance and scalability easier

#### 🔲 **Future Enhancements**

* Add anchor links for buttons (e.g., scroll to FAQ on "Have Questions?")
* Add Framer Motion or GSAP animations on section load
* Support CMS-driven content for events/stats/FAQs
* Improve accessibility (aria tags, alt text, keyboard nav in FAQ)

---

### 🧪 Sample DOM Outline

```html
<main>
  <div class="cta-container">
    <h2>Clear The MIST</h2>
    <p>University of Toronto Machine Intelligence Student Team</p>
    <button>Join Us</button>
    <button>Contact Us</button>
    <Image src="utmist-logo-large.svg" />
  </div>

  <Sponsors />

  <div class="statistics-container">
    <p>UTMIST is Canada’s largest...</p>
    <Statistics />
  </div>

  <section id="about-us">
    <HeroCard title="Who We Are" />
    <div class="hero-line"></div>
    <HeroCard title="Our Mission" />
  </section>

  <Events />

  <p>We bring together students, experts...</p>

  <ValueProps />

  <div class="faq-section">
    <h2>Have Questions?</h2>
    <h2>UTMIST Has Answers</h2>
  </div>

  <FAQ />
</main>
```

---

### 🎨 Styling Guidelines

You should define utility-first Tailwind styles in:

* `globals.css`
* Or specific `components/*.module.css` files

Example:

```css
.cta-container {
  @apply flex flex-col md:flex-row justify-between items-center p-12;
}

.cta-title {
  @apply text-4xl font-extrabold;
}

.primary-button {
  @apply px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700;
}
```

---

### 🧾 Summary

| Section          | Component? | Interactivity | Notes                            |
| ---------------- | ---------- | ------------- | -------------------------------- |
| CTA              | No         | ❌             | Static with buttons              |
| Sponsors         | ✅          | ❌             | Imported component               |
| Statistics       | ✅          | ❌             | Centered fact cards              |
| Mission/About Us | ✅ (twice)  | ❌             | Uses `HeroCard`, divided by line |
| Events           | ✅          | Maybe ✅       | Can be dynamic                   |
| Value Props      | ✅          | ❌             | Value list                       |
| FAQ              | ✅          | ✅             | Expand/collapse + icon rotation  |