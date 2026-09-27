import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { EventCard } from "@/features/events/components/event-card";
import { getFeaturedEvents } from "@/features/events/api/events";

it("renders the EigenAI artwork with the background supplied by event data", async () => {
  const eigenAI = (await getFeaturedEvents()).find(
    (event) => event.branding === "eigenai",
  )!;
  render(<EventCard {...eigenAI} />);

  expect(screen.getByRole("link", { name: /EigenAI/i })).toHaveAttribute(
    "href",
    "/eigenai",
  );
  expect(screen.getByTestId("eigenai-lockup")).toBeInTheDocument();
  // jsdom drops layered gradients when parsing CSS; verify the emitted style.
  expect(renderToStaticMarkup(<EventCard {...eigenAI} />)).toContain(
    `style="background:${eigenAI.background}"`,
  );
});

it("preserves the title and supplied background for other events", () => {
  render(<EventCard title="Workshop" url="/workshop" background="red" />);
  expect(screen.getByRole("heading", { name: "Workshop" })).toBeInTheDocument();
  expect(screen.getByRole("link").style.background).toBe("red");
  expect(screen.queryByTestId("eigenai-lockup")).not.toBeInTheDocument();
});
