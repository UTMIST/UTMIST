
## `Event`

Represents a general event with core details such as the title, description, and an external URL.

```ts
export interface Event {
  title: string;
  description: string;
  url: string;
}
```

**Fields:**

* `title` (`string`): The name or headline of the event.
* `description` (`string`): A short summary of the event's content or purpose.
* `url` (`string`): A link to additional event details or a registration page.

---

## `EventCardProps`

Used as props for the `EventCard` component, typically to render a preview of an event in card format.

```ts
export interface EventCardProps {
  title: string;
  description: string;
  url: string;
}
```

**Fields:**

* `title` (`string`): The event’s title displayed on the card.
* `description` (`string`): A short explanation of the event.
* `url` (`string`): A hyperlink used by the card for redirection.

---

## `HeroCardProps`

Defines the structure of props for a hero section card, used for featured content.

```ts
export interface HeroCardProps {
  image: StaticImageData;
  title: string;
  description: string;
}
```

**Fields:**

* `image` (`StaticImageData`): A statically imported image (used with `next/image`).
* `title` (`string`): The headline or main title of the hero card.
* `description` (`string`): Supporting text below the title for additional context.

---

## `StatItemProps`

Used to display a statistic or key figure along with a descriptive label.

```ts
export interface StatItemProps {
  number: string;
  description: string;
}
```

**Fields:**

* `number` (`string`): The main numeric/statistical value (e.g., "10+", "95%", etc.).
* `description` (`string`): A label describing what the number represents.
