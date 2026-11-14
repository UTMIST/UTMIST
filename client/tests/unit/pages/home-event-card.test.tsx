import { render, screen, within } from "@testing-library/react";

import HomeEventCard from "@/features/public-site/components/home-event-card";
import type { HomeEvent } from "@/features/public-site/data/home-events";

const event: HomeEvent = {
  id: "example-event",
  title: "Example event",
  description: "A synthetic event description",
  url: "/events/example",
  category: "Workshop",
  artwork: { kind: "image", src: "/example-event.png", alt: "Example event artwork", fit: "cover" },
};

it("keeps artwork with its record when cards are reordered and renamed", () => {
  const other: HomeEvent = {
    ...event,
    id: "other-event",
    title: "Another event",
    artwork: { kind: "image", src: "/other-event.png", alt: "Other artwork", fit: "cover" },
  };
  const { rerender } = render(<>{[event, other].map(item => <HomeEventCard key={item.id} event={item} />)}</>);
  const renamed = { ...event, title: "Updated event name" };
  rerender(<>{[other, renamed].map(item => <HomeEventCard key={item.id} event={item} />)}</>);

  const cards = screen.getAllByRole("link");
  expect(within(cards[0]).getByRole("img", { name: "Other artwork" })).toHaveAttribute("src", "/other-event.png");
  expect(within(cards[1]).getByRole("heading", { name: renamed.title })).toBeInTheDocument();
  expect(within(cards[1]).getByRole("img", { name: "Example event artwork" })).toHaveAttribute("src", "/example-event.png");
});

it("opens external destinations safely and keeps internal destinations in the same tab", () => {
  const { rerender } = render(<HomeEventCard event={event} />);
  expect(screen.getByRole("link")).toHaveAttribute("href", event.url);
  expect(screen.getByRole("link")).not.toHaveAttribute("target");

  rerender(<HomeEventCard event={{ ...event, url: "https://example.com/event" }} />);
  expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com/event");
  expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
});
