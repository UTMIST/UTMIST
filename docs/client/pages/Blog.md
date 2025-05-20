## 📄 BlogPage Component Documentation

### 📁 Location

* **Path**: `pages/BlogPage.tsx` (or `.jsx` if not using TypeScript)
* **Imports**:

  * Global styles from `@/styles/blog.css`
  * Components: `BlogCardLarge`, `BlogCardSmall`
  * Image asset: `fibseq.png` (used as a placeholder)

---

### 🧩 Component: `BlogPage()`

#### ✅ Purpose:

Displays a blog landing page featuring:

* A **hero section** introducing the newsletter
* A featured blog post (`BlogCardLarge`)
* Two highlighted smaller blog posts (`BlogCardSmall`)
* A responsive **grid** of additional blog posts

---

### 📌 Sections:

#### `1. Hero Section`

```jsx
<div className="hero-section">
  <h2 className="hero-title">DeMISTify</h2>
  <p className="hero-subtitle">UTMIST’s technical content newsletter</p>
</div>
```

* Title and subtitle introducing the blog series.

#### `2. Featured Blogs`

```jsx
<div className="hero-blog-section">
  <BlogCardLarge ... />
  <BlogCardSmall ... />
  <BlogCardSmall ... />
</div>
```

* Large card for a main feature.
* Two small cards for recent or highlighted posts.

#### `3. Blog Grid`

```jsx
<div className="blog-grid-section mt-12 px-56">
  <h3>More from DeMISTify</h3>
  <div className="grid ...">
    {blogList.map(... => <BlogCardSmall />)}
  </div>
</div>
```

* Displays 6 additional blogs using the `blogList` array.
* Responsive grid: `1` column on mobile, `2` on small screens, `3` on large.

---

### 📦 `blogList[]` Data

An array of blog metadata:

```ts
{
  title: string;
  date: string;
  image: StaticImageData;
  url: string;
}
```

Used to populate the blog grid.

---

### 📘 Related Components

* `BlogCardLarge`: Displays a prominent featured blog card.
* `BlogCardSmall`: Compact blog preview used in lists and grids.