# Section introduction

Import `SectionIntro` from `@/shared/ui` for the shared label → heading → copy →
action pattern. `align="left"` (default) and `align="center"` are the two layouts.

```tsx
<SectionIntro headingId="projects-heading" label="Our projects"
  title="Built by students" description="Explore our work.">
  <PillLink href="/projects">Explore projects</PillLink>
</SectionIntro>
```

`title` is required; `label`, `description`, `headingId` and action children are
optional. Heading and description accept React nodes for highlights or line
breaks. Label, heading, description and action gaps are owned by the component.
Use `className` for width or responsive alignment and normal div attributes for
reveal hooks. The `ui-section-heading`, `ui-section-label` and `ui-section-copy`
roles live in `shared/ui/primitives.css` and inherit the enclosing surface tone.
Do not put interactive children inside the heading or description.
