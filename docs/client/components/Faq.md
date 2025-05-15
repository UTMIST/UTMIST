## 📘 `FAQ` Component Documentation

### 📂 File Location

```
components/FAQ.tsx
```

### 📄 Description

This component renders a Frequently Asked Questions (FAQ) section for the UTMIST website. It displays a list of questions that expand to reveal their answers when clicked. Each item includes a toggle icon and a horizontal divider.

---

### 🛠️ Technologies Used

* **React** with Hooks (`useState`)
* **Next.js Image Optimization** (`next/image`)
* **TypeScript** for type safety
* **Tailwind CSS** for styling

---

### 🧩 Props

This component does **not** accept any props. All data is hardcoded in a `faqData` array within the component. Future improvements could make this component reusable by passing the FAQ data as a prop.

---

### 📦 Internal Data Structure

```ts
const faqData: {
  question: string;
  answer: string;
}[]
```

Each FAQ entry includes:

* `question`: A string that appears in the header row
* `answer`: A string shown when the question is expanded

---

### 📌 Component Behavior

* Uses `useState` to track which FAQ entry is currently expanded (`expandedIndex`).
* Clicking a question toggles its expanded state.
* Only **one question** can be expanded at a time.
* A **plus icon** rotates 45 degrees to form an “X” when expanded.
* Each FAQ item is followed by a horizontal line separator (`<hr>`).

---

### 🖼️ Image Usage

```tsx
import plusIcon from "@/assets/icons/plus-icon.svg";
```

* This icon is used to indicate expandable sections.
* Uses Next.js `<Image />` for optimized image handling.

---

### 🧪 Sample DOM Output (Simplified)

```html
<div class="faq-container">
  <div>
    <div class="faq-row"> <!-- Clickable -->
      <h2 class="faq-row-title">How do I join UTMIST?</h2>
      <Image src={plusIcon} ... />
    </div>
    <div class="faq-answer">
      <p>You can join UTMIST by...</p>
    </div>
    <hr />
  </div>
  ...
</div>
```

---

### 🎨 Styling Notes

You can define the following CSS classes in a separate stylesheet or a Tailwind config override:

```css
.faq-section {
  @apply text-center py-10;
}

.faq-title {
  @apply text-3xl font-bold;
}

.faq-container {
  @apply max-w-3xl mx-auto my-6;
}

.faq-row {
  @apply flex justify-between items-center px-8 py-6 hover:bg-gray-100;
  position: relative;
}

.faq-row-title {
  @apply text-xl font-semibold;
}

.faq-answer {
  @apply bg-white text-gray-700;
}

.faq-tail-section {
  @apply text-center mt-16;
}

.faq-subtitle {
  @apply text-2xl text-blue-600 font-semibold;
}
```

If you want to add a **horizontal line with custom width and color** at the end of `.faq-row`, update your CSS:

```css
.faq-row::after {
  content: "";
  display: block;
  height: 2px;
  background-color: #3b82f6; /* blue-500 */
  width: 100%;
  margin-top: 12px;
}
```

Or just use the `<hr>` tag as shown.

---

### 📈 Future Enhancements

* ✅ Accept FAQ data as a prop
* ✅ Add animation when expanding/collapsing answers
* 🔄 Use `framer-motion` or `react-spring` for smoother transitions
* 🌐 Add accessibility (`aria-expanded`, keyboard support)
* 🌍 Localize questions/answers