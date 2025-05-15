# CSS Styles Documentation

## Table of Contents
1. [Call-to-Action (CTA) Component](#call-to-action-cta-component)
2. [Stats Components](#stats-components)
3. [Hero Components](#hero-components)
4. [Event Card Components](#event-card-components)
5. [Sponsors Section](#sponsors-section)
6. [Statistics Section](#statistics-section)
7. [Events Section](#events-section)
8. [Value Proposition Components](#value-proposition-components)
9. [FAQ Section](#faq-section)
10. [Footer Component](#footer-component)
11. [Responsive Design](#responsive-design)

## Call-to-Action (CTA) Component

**### Container (`.cta-container`)**
- Display flex layout
- Space-between justification
- Centered alignments
- Padding: 4rem 5rem
- Max-width: 1000px
- Centered margin

**### Content (`.cta-content`)**
- Flex column layout
- 1.5rem gap
- Right margin: 3rem

**### Title (`.cta-title`)**
- 3rem font size
- 700 weight
- Gradient background (--gradient-bl1)
- Background clip: text
- Transparent text fill
- System font family

**### Subtitle (`.cta-subtitle`)**
- 1.125rem font size
- #666666 color
- System font family
- Right padding: 20px

**### Buttons Container (`.cta-buttons`)**
- Display flex
- 1rem gap

**### Primary Button (`.primary-button`)**
- Padding: 0.5rem 1rem
- Gradient background (--gradient-b2)
- White text
- 25px border radius
- 500 font weight
- Opacity transition

**### Secondary Button (`.secondary-button`)**
- Padding: 0.5rem 1.5rem
- Transparent background
- #6B66E3 color
- 2px border, #6B66E3 color
- 9999px border radius
- 500 font weight
- Full transition

**### Big Title (`.cta-big-title`)**
- 1rem left margin
- 4rem font size
- 700 weight
- Gradient background (--gradient-logo)
- Background clip: text
- Transparent text fill
- Space Grotesk font

**## Dependencies**
- CSS variables:
  - `--gradient-bl1`
  - `--gradient-b2`
  - `--gradient-logo`
  - `--system-font`
  - `--font-space-grotesk`

**## Usage**
```html
<div class="cta-container">
  <div class="cta-content">
    <h2 class="cta-title">Your Attention-Grabbing Title</h2>
    <p class="cta-subtitle">Compelling description that encourages action</p>
    <div class="cta-buttons">
      <button class="primary-button">Get Started</button>
      <button class="secondary-button">Learn More</button>
    </div>
  </div>
</div>
```

## Stats Components

**### Container (`.stats-container`)**
- Display flex
- Row direction
- Space-between justification
- Padding: 2rem 0
- Max-width: 1200px
- Auto margins

**## Dependencies**
- None

**## Usage**
```html
<div class="stats-container">
  <!-- Stats items go here -->
</div>
```

## Hero Components

**### Main Container (`.hero-container`)**
- Display flex
- Row direction
- Padding: 4rem 2rem
- Max-width: 1000px
- 2rem margin
- 2rem gap

**### Card Container (`.hero-card-container`)**
- Display flex
- Column direction
- 2rem padding
- Max-width: 1200px
- Auto margins

**### Image Container (`.hero-card-image`)**
- Relative position
- 100% width
- 240px height
- 1rem border radius
- Hidden overflow

**### Content Container (`.hero-card-content`)**
- Display flex
- Column direction

**### Title (`.hero-card-title`)**
- 3rem font size
- 700 weight
- Gradient background (--gradient-bl1)
- Background clip: text
- Transparent text fill
- Space Grotesk font
- -3% letter spacing

**### Description (`.hero-card-description`)**
- 1.125rem font size
- 1.75 line height
- #4b5563 color
- System font family
- 65ch max-width

**### Divider Line (`.hero-line`)**
- 2px width
- 100px height
- Background: --gray1
- 1rem vertical margins
- 999px border radius

**## Dependencies**
- CSS variables:
  - `--gradient-bl1`
  - `--gray1`
  - `--font-space-grotesk`
  - `--system-font`

**## Usage**
```html
<div class="hero-container">
  <div class="hero-card-container">
    <div class="hero-card-image">
      <img src="path/to/image.jpg" alt="Hero image" />
    </div>
    <div class="hero-card-content">
      <h1 class="hero-card-title">Bold Statement</h1>
      <p class="hero-card-description">Detailed explanation of your offering.</p>
    </div>
  </div>
</div>
```

## Event Card Components

**### Container (`.event-card-container`)**
- Display flex
- Column direction
- Space-between justification
- 1.5rem padding
- White background
- 1rem border radius
- 200px min-height
- Box shadow

**### Content (`.event-card-content`)**
- Display flex
- Row direction
- Space-between justification
- Center alignment
- 0.75rem gap

**### Title (`.event-card-title`)**
- 1.5rem font size
- 600 weight
- #1a1a1a color
- Space Grotesk font

**### Description (`.event-card-description`)**
- 1rem font size
- 1.5 line height
- #666666 color
- System font family

**### Button (`.event-card-button`)**
- Self-aligned to flex-start
- 0.5rem 1rem padding
- 1.5px #6B66E3 border
- 999px border radius
- #6B66E3 color
- 0.875rem font size
- 500 weight
- Transparent background
- Full transition

**## Dependencies**
- CSS variables:
  - `--font-space-grotesk`
  - `--system-font`

**## Usage**
```html
<div class="event-card-container">
  <div class="event-card-content">
    <div>
      <h3 class="event-card-title">Event Name</h3>
      <p class="event-card-description">Brief description of the event</p>
    </div>
    <button class="event-card-button">Register</button>
  </div>
</div>
```

## Sponsors Section

**### Container (`.sponsors-container`)**
- Display flex
- Column direction
- Center alignment
- 4rem 2rem padding
- 1200px max-width
- Auto margins

**### Title (`.sponsors-title`)**
- 1.5rem font size
- 500 weight
- #1a1a1a color
- 2rem bottom margin
- Relative position
- Decorative underline after element

**### Grid (`.sponsors-grid`)**
- Display flex
- Center justification
- Center alignment
- 4rem gap
- Wrap enabled

**## Dependencies**
- CSS variables:
  - `--gradient-line-1`

**## Usage**
```html
<div class="sponsors-container">
  <h2 class="sponsors-title">Our Sponsors</h2>
  <div class="sponsors-grid">
    <!-- Sponsor logos go here -->
    <img src="sponsor1.png" alt="Sponsor 1" />
    <img src="sponsor2.png" alt="Sponsor 2" />
  </div>
</div>
```

## Statistics Section

**### Container (`.stats-section`)**
- Display flex
- Column direction
- Center alignment
- 4rem 2rem padding
- 1200px max-width
- Auto margins

**### Title (`.stats-title`)**
- 2.5rem font size
- Bold weight
- Center alignment
- 3rem bottom margin
- 800px max-width

**### Grid (`.stats-grid`)**
- Display grid
- 3 columns template
- 3rem gap
- 100% width

**### Stat Item (`.stat-item`)**
- Display flex
- Column direction
- Center alignment
- Center text

**### Stat Number (`.stat-number`)**
- 3rem font size
- Bold weight
- Gradient background (--gradient-b3)
- Background clip: text
- Transparent text fill

**### Stat Description (`.stat-description`)**
- 1rem font size
- #666666 color
- 200px max-width
- 1.5 line height

**## Dependencies**
- CSS variables:
  - `--gradient-b3`

**## Usage**
```html
<div class="stats-section">
  <h2 class="stats-title">Our Impact by the Numbers</h2>
  <div class="stats-grid">
    <div class="stat-item">
      <span class="stat-number">500+</span>
      <p class="stat-description">Attendees each year</p>
    </div>
    <!-- More stat items -->
  </div>
</div>
```

## Events Section

**### Container (`.events-section`)**
- 4rem 2rem padding
- 1200px max-width
- Auto margins

**### Title (`.events-title`)**
- 2.5rem font size
- 700 weight
- #1a1a1a color
- 3rem bottom margin
- 800px max-width
- Space Grotesk font
- 2.5rem line height

**### Grid (`.events-grid`)**
- Display grid
- Auto-fit columns, 300px minimum
- 2rem gap

**## Dependencies**
- CSS variables:
  - `--font-space-grotesk`

**## Usage**
```html
<div class="events-section">
  <h2 class="events-title">Upcoming Events</h2>
  <div class="events-grid">
    <!-- Event cards go here -->
  </div>
</div>
```

## Value Proposition Components

**### Conference Container (`.conference-container`)**
- 2rem padding

**### Content Grid (`.content-grid`)**
- 1000px max-width
- Auto margins
- Display grid
- 1fr column template
- 3rem gap
- 20px background size
- 2rem padding

**### Header (`.conference-header`)**
- 1rem vertical padding

**### Header Title**
- 2.5rem font size
- 700 weight
- #111 color
- 1.2 line height
- No margin

**### Features List (`.features-list`)**
- Display flex
- Column direction
- 2rem gap

**### Feature Item (`.feature-item`)**
- Display flex
- 1.5rem gap
- Flex-start alignment

**### Icon Container (`.icon-container`)**
- Display flex
- Center alignment and justification
- 60px width and height
- 12px border radius
- Flex-shrink: 0
- Color variants: .purple, .blue, .pink

**### Feature Content (`.feature-content`)**
- Flex: 1

**### Feature Title**
- 1.5rem font size
- 600 weight
- 0 0 0.5rem 0 margin
- #111 color

**### Feature Description**
- 1rem font size
- 1.5 line height
- #555 color
- No margin

**## Dependencies**
- None specific (color classes defined inline)

**## Usage**
```html
<div class="conference-container">
  <div class="content-grid">
    <div class="conference-header">
      <h1>Conference Title</h1>
    </div>
    <div class="features-list">
      <div class="feature-item">
        <div class="icon-container purple">
          <!-- SVG icon -->
        </div>
        <div class="feature-content">
          <h2>Feature Title</h2>
          <p>Feature description text</p>
        </div>
      </div>
      <!-- More feature items -->
    </div>
  </div>
</div>
```

## FAQ Section

**### Container (`.faq-section`)**
- Display flex
- Column direction
- Center justification and alignment
- 4rem 2rem padding
- 1000px max-width
- Auto margins
- Center text

**### Title (`.faq-title`)**
- 3rem font size
- 700 weight
- Gradient background (--gradient-bl1)
- Background clip: text
- Transparent text fill
- System font family

**### Container (`.faq-container`)**
- 0rem 18rem padding

**### Row (`.faq-row`)**
- Display flex
- Row direction
- Space-between justification
- Center alignment
- Flex-grow: 1
- 2rem padding
- 1000px max-width
- Auto margins
- Left text alignment

**### Row Title (`.faq-row-title`)**
- 1.2rem font size
- 200 weight
- Gradient background (--gradient-bl1)
- Background clip: text
- Transparent text fill
- System font family

**### Subtitle (`.faq-subtitle`)**
- 1.2rem font size
- 200 weight
- #111827 color
- System font family
- 0 15rem padding

**### Tail Section (`.faq-tail-section`)**
- Display flex
- Column direction
- Center justification and alignment
- 1rem 2rem padding
- 1000px max-width
- Auto margins
- Center text

**### Answer (`.faq-answer`)**
- 1rem font size
- 200 weight
- Gradient background (--gradient-bl1)
- Background clip: text
- Transparent text fill
- System font family

**### Plus Icon (`.plus-icon`)**
- 0.55 opacity

**## Dependencies**
- CSS variables:
  - `--gradient-bl1`
  - `--system-font`

**## Usage**
```html
<div class="faq-section">
  <h2 class="faq-title">Frequently Asked Questions</h2>
  <p class="faq-subtitle">Find answers to common questions</p>
  <div class="faq-container">
    <div class="faq-row">
      <h3 class="faq-row-title">How do I register?</h3>
      <span class="plus-icon">+</span>
    </div>
    <p class="faq-answer">Register through our website.</p>
  </div>
</div>
```

## Footer Component

**### Container (`.footer-container`)**
- Flex column layout
- Centered content
- Light padding
- White text color

**### Logo Styles (`.footer-logo`)**
- 1.25rem font size
- Bold weight
- Small bottom margin

**### Logo Container (`.footer-logo-container`)**
- Circular background (--gray3)
- Fixed dimensions: 35x35px
- Centered content
- Padding: 0.5rem
- Margin adjustments

**### Decorative Line (`.footer-line`)**
- 90% width
- 5px height
- Dual gradient background
- Uses `--gradient-line-1`
- Uses `--gradient-line-2`
- Small vertical margins

**## Dependencies**
- CSS variables:
  - `--gray3`
  - `--gradient-line-1`
  - `--gradient-line-2`

**## File Location**
footer.css

**## Usage**
Applied to footer component for consistent bottom page styling and social media links layout.

## Responsive Design

The stylesheet includes media queries to ensure components display properly on different device sizes:

**### Tablet (max-width: 768px)**
- CTA container: column layout, center text, 2rem gap
- CTA buttons: center justification
- Hero card container: 1rem padding
- Hero card title: 2rem font size
- Hero card description: 1rem font size
- Sponsors grid: 2rem gap
- Stats grid: 2 columns, 2rem gap
- Stats title: 2rem font size
- Events title: 2rem font size
- Feature items: column direction, 1rem gap
- Conference header title: 2rem font size

**### Mobile (max-width: 480px)**
- Stats grid: 1 column
