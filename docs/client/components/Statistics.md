# Statistics

`features/public-site/components/stats.tsx` exports `Statistics` (default) and
`StatItem`. It contains no hard-coded content or CMS access.

`Statistics` accepts `items: readonly Statistic[]`, preserves the supplied row
order, and renders a `stats-grid` of `StatItem` children. Import the universal
`Statistic` type from `@/shared/lib`. Each item has `number: string` and
`description: string`. The CMS contract allows an integer of up to nine digits
and an optional trailing `+`.

```tsx
import Statistics from "@/features/public-site/components/stats";

<Statistics items={[{ number: "7+", description: "Synthetic projects" }]} />
```

`StatItem` accepts `number`, `description`, and optional `className`,
`numberClassName`, and `descriptionClassName`. The existing EigenAI consumer
continues to use those customization props independently of the homepage.
It counts up over 1500ms once in view, retaining a trailing `+`, and cancels
pending animation frames when its target changes or it unmounts.

Existing CSS classes are `stats-grid`, `stat-item`, `stat-number`, and
`stat-description`. An outer `div` preserves the original grid's compact,
centered width inside the homepage flex layout. Keep this wrapper: placing the
100%-wide grid directly in that layout spreads the columns across the section.
The wrapper replaces the original nested `main` without changing its layout.
The [organization section](OrganizationImpact.md) supplies homepage content;
[ContentReader.md](../ContentReader.md) explains its data source.
