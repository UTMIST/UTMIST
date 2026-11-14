import { render, screen } from "@testing-library/react";
import { AcademicSessionCard } from "@/features/public-site/components/academic-session-card";
import type { AcademicSession } from "@/features/public-site/data/academics";

const session: AcademicSession = {
  id: "synthetic-session", title: "Synthetic session", track: "Foundations",
  description: "Synthetic description", date: "Unscheduled", time: "TBA", location: "TBA", resources: {},
};

it("does not link unpublished resources to a placeholder or unrelated workshop", () => {
  const { container } = render(<AcademicSessionCard session={session} />);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  expect(container.querySelectorAll('[aria-disabled="true"]')).toHaveLength(3);
});

it("uses the published destination independently for each available resource", () => {
  const resources = { slides: "https://example.org/slides.pdf", recording: "https://example.org/recording", code: "https://example.org/code" };
  const { rerender, container } = render(<AcademicSessionCard session={{ ...session, resources }} />);
  expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(Object.values(resources));
  screen.getAllByRole("link").forEach((link) => expect(link).toHaveAttribute("rel", "noopener noreferrer"));
  rerender(<AcademicSessionCard session={{ ...session, resources: { code: resources.code } }} />);
  expect(screen.getAllByRole("link")).toHaveLength(1);
  expect(container.querySelectorAll('[aria-disabled="true"]')).toHaveLength(2);
});
