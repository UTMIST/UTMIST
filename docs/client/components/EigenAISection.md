# EigenAI section

`EigenAISection` centralizes the redesign's section-level Tailwind utilities in
`src/features/public-site/components/eigenai-section.tsx`. Every section gets
the same relative positioning, mobile and desktop gutters, `max-w-6xl` content
container, and `eigenai-content` test hook.
Sections also receive an 80px scroll margin (112px from `md`) so fragment links
keep their headings below the fixed EigenAI navigation.

Passing `title` adds the shared gradient `h2` and the standard responsive gap
before section content. `className` is reserved for section-specific vertical
rhythm or layout, while `contentClassName` customizes the inner container.
`EigenAIContent` and `EigenAISectionHeading` are exported separately for the
footer and About section, whose composition does not fit the standard titled
section shape.

The page keeps a small named component for each major region (`HeroSection`,
`AboutSection`, `SpeakersSection`, `WorkshopsSection`, `ScheduleSection`,
`VenueSection`, and `ClosingSection`). Those components own semantic IDs and
section-specific spacing while inheriting shared Tailwind from
`EigenAISection`.
