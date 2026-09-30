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

it("shows one event photo identified as EigenAI 2024", () => {
  render(<EigenAIRedesign />);
  const about = within(document.getElementById("about")!);
  expect(about.getAllByRole("img")).toHaveLength(1);
  expect(
    about.getByRole("img", {
      name: "Panelists speaking with students at a past EigenAI conference",
    }),
  ).toBeInTheDocument();
  expect(about.getByText("EigenAI 2024")).toBeInTheDocument();
});

it("shows only the five guests with supplied headshots", () => {
  render(<EigenAIRedesign />);
  const speakers = within(document.getElementById("speakers")!);

  expect(speakers.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  for (const [name, role] of [
    ["Adrien Beyk", "Workshop host · Architecting Autonomy"],
    ["Aryan Yaghoubian", "Panelist · Building Your Path in Tech"],
    ["Iris Guo", "Panelist · Building Your Path in Tech"],
    ["Naomi Walch", "Associate · Northside Ventures"],
    ["Vincent Xue", "Panelist · Northside Ventures"],
  ]) {
    const card = speakers.getByRole("heading", { name }).closest("article")!;
    expect(within(card).getByRole("img", { name: `${name}, ${role}` })).toBeInTheDocument();
    expect(within(card).getByText(role)).toBeInTheDocument();
  }
  expect(speakers.getAllByRole("img")).toHaveLength(5);
  expect(speakers.queryByText("Keynote Speaker")).not.toBeInTheDocument();
  expect(speakers.queryByText(/Terry Fu|Michael Guerzhoy|David Liu/)).not.toBeInTheDocument();
  expect(speakers.queryByText(/@stripe\.com|@gmail\.com|Panorad/)).not.toBeInTheDocument();
});

it("uses the current schedule's revised times and titles", () => {
  render(<EigenAIRedesign />);
  const schedule = within(screen.getByTestId("eigenai-schedule"));
  for (const [title, time] of [
    ["Research Workshop", "10:30–11:30 AM"],
    ["Engineering Project Showcase", "11:30 AM–12:30 PM"],
    ["Lunch & Networking Session", "12:30–1:00 PM"],
    ["IEEE Workshop", "2:30–4:30 PM"],
    ["Architecting Autonomy", "2:30–4:30 PM"],
    ["Undergrad Research Panel", "10:00–11:00 AM"],
    ["Stripe Panel", "1:30–2:30 PM"],
    ["AI Agents Workshop", "2:45–3:45 PM"],
    ["aUtoronto Presentation", "2:45–3:45 PM"],
    ["Networking with Panel and Workshop Hosts", "3:45–4:15 PM"],
  ]) {
    const session = schedule.getByRole("heading", { name: title }).closest("li")!;
    expect(within(session).getByText(time)).toBeInTheDocument();
  }
  const saturday = schedule.getByRole("heading", { name: /Saturday October 3/ }).closest("article")!;
  const closing = within(saturday).getByRole("heading", { name: "Closing Ceremony" }).closest("li")!;
  expect(within(closing).getByText("4:30–5:00 PM")).toBeInTheDocument();
  expect(schedule.getAllByRole("heading", { name: /2026 · EDT/ })).toHaveLength(2);
  expect(screen.getByText(/Schedule subject to change/)).toHaveTextContent("Toronto (EDT)");
  expect(schedule.getByRole("heading", { name: "To Be Announced" })).toBeInTheDocument();
});

it("lists the six scheduled workshops with hosts and session details", () => {
  render(<EigenAIRedesign />);
  const workshops = within(document.getElementById("workshops")!);
  expect(workshops.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  const agents = workshops.getByRole("heading", { name: "AI Agents Workshop" }).closest("article")!;
  expect(within(agents).getByText("UTMIST Academics")).toBeInTheDocument();
  expect(within(agents).getByText("Sunday, October 4 · 2:45–3:45 PM · OI 2214")).toBeInTheDocument();
  const adrien = workshops.getByRole("heading", { name: "Architecting Autonomy" }).closest("article")!;
  expect(within(adrien).getByText("Adrien Beyk")).toBeInTheDocument();
  expect(within(adrien).getByText("Saturday, October 3 · 2:30–4:30 PM · OI 2212")).toBeInTheDocument();
  expect(workshops.getByText("Rotman Fintech Association")).toBeInTheDocument();
  expect(workshops.getByText("Saturday, October 3 · 2:30–4:30 PM · OI G162")).toBeInTheDocument();
  expect(workshops.queryByText("Details coming soon.")).not.toBeInTheDocument();
});

it("omits the event photo and caption when no image is supplied", () => {
  render(
    <EigenAIRedesign
      content={{
        ...eigenAIContent,
        about: { ...eigenAIContent.about, image: undefined },
      }}
    />,
  );

  expect(screen.queryByText("EigenAI 2024")).not.toBeInTheDocument();
  expect(screen.queryByRole("figure")).not.toBeInTheDocument();
});

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
  expect(screen.queryByText(/Schedule subject to change/)).not.toBeInTheDocument();
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
