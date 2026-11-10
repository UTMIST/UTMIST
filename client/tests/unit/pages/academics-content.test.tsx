import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import AcademicsRedesign from "@/features/public-site/pages/academics-redesign";
import { academicsContent } from "@/features/public-site/data/academics";

jest.mock("@/features/public-site/components/public-site-hero", () => ({
  __esModule: true,
  default: ({ title, actions }: { title: ReactNode; actions: ReactNode }) => <section><h1>{title}</h1>{actions}</section>,
}));

it("renders edited content, ordered rows, and independently cleared resources through the existing page", () => {
  const edited = {
    ...academicsContent,
    hero: { ...academicsContent.hero, title: "Edited program", titleContinuation: "New semester" },
    workshops: { ...academicsContent.workshops, notice: undefined },
    kickoff: { ...academicsContent.kickoff, title: "Published kick-off", resources: { slides: "https://example.org/edited-slides" } },
    topics: [...academicsContent.topics].reverse(),
    faqs: [{ id: "edited-faq", question: "Edited question?", answer: "Edited answer", href: "/ml-fundamentals/2025", linkLabel: "Edited archive label" }],
    teamNotice: undefined,
    team: [{ id: "edited-person", name: "Synthetic Editor", role: "Workshop mentor", image: "/academics-redesign/workshop.png", isDirector: false }],
  };
  const { container } = render(<AcademicsRedesign content={edited} />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Edited program New semester");
  expect(screen.getByRole("link", { name: "Published kick-off: Slides (opens in a new tab)" })).toHaveAttribute("href", "https://example.org/edited-slides");
  expect(screen.queryByRole("link", { name: /Published kick-off: Code/ })).not.toBeInTheDocument();
  expect(Array.from(container.querySelectorAll(".academic-topic h3")).map((heading) => heading.textContent)).toEqual(edited.topics.map((topic) => topic.title));
  expect(screen.getByText("Edited answer")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edited archive label" })).toHaveAttribute("href", "/ml-fundamentals/2025");
  expect(screen.getByRole("heading", { name: "Synthetic Editor" })).toBeInTheDocument();
  expect(screen.getByText("Workshop mentor")).toBeInTheDocument();
  expect(container.querySelector(".academic-person-photo img")).toHaveAttribute("src", "/academics-redesign/workshop.png");
  expect(screen.queryByRole("note")).not.toBeInTheDocument();
  expect(screen.queryByText(academicsContent.teamNotice!)).not.toBeInTheDocument();
});
