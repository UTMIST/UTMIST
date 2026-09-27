import { render, screen, within } from "@testing-library/react";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

import EigenAIRedesign from "@/features/public-site/pages/eigenaiRedesign";
import {
  eigenAIContent,
  eigenAILongContent,
  eigenAIUnannouncedContent,
} from "@/features/public-site/data/eigenai-redesign";

it("renders unannounced sections without inventing a lineup or venue", () => {
  render(<EigenAIRedesign content={eigenAIUnannouncedContent} />);

  expect(
    screen.getByRole("heading", { level: 1, name: "EigenAI Conference" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Dates to be announced")).toBeInTheDocument();
  expect(
    screen.getByText("Speakers will be announced soon."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Workshops will be announced soon."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("The schedule will be announced soon."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("The venue will be announced soon."),
  ).toBeInTheDocument();
  expect(screen.queryByText("Keynote Speaker")).not.toBeInTheDocument();
  expect(screen.queryByText("@ LOCAT")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Get directions" }),
  ).not.toBeInTheDocument();
  expect(document.querySelector("iframe")).toBeNull();
  for (const id of ["speakers", "workshops", "schedule", "venue"]) {
    expect(document.getElementById(id)).not.toBeNull();
  }
});

it("renders long speaker bios and workshops without requiring optional images or links", () => {
  render(<EigenAIRedesign content={eigenAILongContent} />);
  const speaker = eigenAILongContent.speakers[0];
  const card = screen
    .getByRole("heading", { name: speaker.name })
    .closest("article")!;
  expect(within(card).getByText(speaker.bio!)).toBeInTheDocument();
  expect(within(card).queryByRole("img")).not.toBeInTheDocument();
  expect(within(card).queryByRole("link")).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: eigenAILongContent.workshops[0].title,
    }),
  ).toBeInTheDocument();
});

it("uses supplied content, profile links, and image alternatives", () => {
  const content = {
    ...eigenAIUnannouncedContent,
    dateLabel: "November 14",
    locationLabel: "New Hall",
    about: {
      paragraphs: ["A new conference introduction."],
      image: "/about.jpg",
      imageAlt: "Students at the conference",
    },
    speakers: [
      {
        name: "Taylor Example",
        role: "Researcher",
        profileURL: "https://example.com/taylor",
        profileImage: "/taylor.jpg",
      },
    ],
    closingLines: ["Learn together"],
  };
  render(<EigenAIRedesign content={content} />);

  expect(screen.getByText("November 14")).toBeInTheDocument();
  expect(screen.getByText("@ New Hall")).toBeInTheDocument();
  expect(
    screen.getByText("A new conference introduction."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Students at the conference" }),
  ).toHaveAttribute("src", "/about.jpg");
  expect(
    screen.getByRole("img", { name: "Taylor Example, Researcher" }),
  ).toHaveAttribute("src", "/taylor.jpg");
  expect(screen.getByRole("link", { name: "Taylor Example" })).toHaveAttribute(
    "href",
    "https://example.com/taylor",
  );
  expect(screen.getByText("Learn together")).toBeInTheDocument();
  expect(screen.queryByText("Jensen Huang")).not.toBeInTheDocument();
});

it("renders a provided venue without requiring a Maps key, and a day without sessions", () => {
  const previousKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  try {
    render(
      <EigenAIRedesign
        content={{
          ...eigenAIUnannouncedContent,
          venue: {
            name: "New Hall",
            address: "123 New Street",
            query: "New Hall, Toronto",
          },
          schedule: [{ day: "Day 1", date: "November 14", items: [] }],
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "New Hall" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get directions" }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining("New%20Hall%2C%20Toronto"),
    );
    expect(screen.getByText(/Map preview unavailable/)).toBeInTheDocument();
    expect(
      screen.getByText("Sessions will be announced soon."),
    ).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  } finally {
    if (previousKey === undefined)
      delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    else process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = previousKey;
  }
});

it("renders an optional keynote without a portrait", () => {
  render(
    <EigenAIRedesign
      content={{
        ...eigenAIContent,
        speakers: [],
        keynote: {
          name: "Morgan Example",
          role: "Scientist",
          bio: "Keynote biography.",
        },
      }}
    />,
  );
  const card = screen
    .getByRole("heading", { name: "Morgan Example" })
    .closest("article")!;
  expect(within(card).getByText("Keynote Speaker")).toBeInTheDocument();
  expect(within(card).getByText("Keynote biography.")).toBeInTheDocument();
  expect(within(card).queryByRole("img")).not.toBeInTheDocument();
});
