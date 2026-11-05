# Badge

Import `Badge` from `@/shared/ui` for non-interactive photo captions and categories.
It renders a span and has exactly two tones: `light` (default) and `dark`.
Both share a pill shape, border, 12px type, 16px line height and padding.

```tsx
<Badge>AI conference</Badge>
<Badge tone="dark" className="absolute bottom-4 left-4">Built by students.</Badge>
```

The light tone suits event artwork; the dark tone supplies white text and a
translucent dark fill over photography. Position with `className`; do not use
badges for actions or give them button roles.
