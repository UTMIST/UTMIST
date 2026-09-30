import { render, screen, within } from "@testing-library/react";
import { EigenAISchedule } from "@/features/public-site/components/eigenai-schedule";
import { eigenAIContent } from "@/features/public-site/data/eigenai-redesign";
import { buildScheduleTimeline } from "@/features/public-site/lib/eigenai-schedule";

it("aligns shared clock times and spans longer sessions across intervening events", () => {
  const { days, boundaries } = buildScheduleTimeline(eigenAIContent.schedule);
  const saturday = days[0].slots;
  const sunday = days[1].slots;
  const slot = (day: typeof saturday, time: string) => day.find((item) => item.time === time)!;

  expect(boundaries[0]).toBe(8 * 60 + 30);
  expect(boundaries.at(-1)).toBe(17 * 60);
  expect(slot(saturday, "9:00–9:30 AM").rowStart).toBe(slot(sunday, "9:00–9:30 AM").rowStart);
  expect(slot(saturday, "9:30–10:15 AM").rowStart).toBe(slot(sunday, "9:30–10:00 AM").rowStart);
  expect(slot(saturday, "12:30–1:00 PM").rowStart).toBe(slot(sunday, "12:30–1:30 PM").rowStart);

  const afternoon = slot(saturday, "2:30–4:30 PM");
  expect(afternoon.rowStart).toBe(slot(sunday, "2:30–2:45 PM").rowStart);
  expect(afternoon.rowEnd).toBe(slot(saturday, "4:30–5:00 PM").rowStart);
  expect(afternoon.rowEnd).toBeGreaterThan(slot(sunday, "3:45–4:15 PM").rowEnd!);
  expect(slot(saturday, "4:30–5:00 PM").rowEnd).toBe(slot(sunday, "4:15–5:00 PM").rowEnd);
});

it("places shared and explicit AM/PM labels correctly across noon", () => {
  const { days, boundaries } = buildScheduleTimeline([
    {
      day: "Day 1", date: "Saturday",
      items: [{ time: "11:30–12:30 PM", title: "Crossing noon" }],
    },
    {
      day: "Day 2", date: "Sunday",
      items: [
        { time: "11:30 AM–12:00 PM", title: "Before noon" },
        { time: "12:00–1:00 PM", title: "After noon" },
      ],
    },
  ]);
  expect(boundaries).toEqual([690, 720, 750, 780]);
  expect(days[0].slots[0].rowStart).toBe(days[1].slots[0].rowStart);
  expect(days[0].slots[0].rowEnd).toBeGreaterThan(days[1].slots[1].rowStart!);
});

it("keeps unscheduled labels visible without assigning a guessed time", () => {
  const { days, boundaries } = buildScheduleTimeline([
    { day: "Day 1", date: "Saturday", items: [{ time: "TBA", title: "Pending session" }] },
    { day: "Day 2", date: "Sunday", items: [{ time: "10:00–11:00 AM", title: "Confirmed session" }] },
  ]);
  expect(boundaries).toEqual([]);
  expect(days[0].slots[0].sessions[0].title).toBe("Pending session");
  expect(days.flatMap((day) => day.slots).every((slot) => slot.rowStart === undefined)).toBe(true);
});

it("groups simultaneous sessions under one time label within each day", () => {
  render(<EigenAISchedule schedule={eigenAIContent.schedule} />);

  expect(screen.getAllByTestId("eigenai-schedule-day")).toHaveLength(2);

  for (const [titles, time] of [
    [["Research Workshop", "Publicus AI Workshop"], "10:30–11:30 AM"],
    [["Architecting Autonomy", "IEEE Workshop"], "2:30–4:30 PM"],
    [[
      "Applying Fintech Concepts and Industry Practices Using AI Agents",
      "aUtoronto Presentation",
      "AI Agents Workshop",
    ], "2:45–3:45 PM"],
  ] as const) {
    const row = screen.getByRole("heading", { name: titles[0] }).closest("li")!;
    expect(within(row).getAllByRole("heading")).toHaveLength(titles.length);
    for (const title of titles) {
      expect(within(row).getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(within(row).getAllByText(time)).toHaveLength(1);
    expect(within(row).getByRole("region", { name: /simultaneous sessions/ }))
      .toHaveAttribute("tabindex", "0");
  }
});

it("keeps matching times on different days separate and preserves session order", () => {
  render(
    <EigenAISchedule
      schedule={[
        {
          day: "Day 1",
          date: "Saturday",
          items: [
            { time: "10:00–11:00 AM", title: "First session" },
            { time: "11:00 AM–12:00 PM", title: "Later session" },
            { time: "10:00–11:00 AM", title: "Parallel session" },
          ],
        },
        {
          day: "Day 2",
          date: "Sunday",
          items: [{ time: "10:00–11:00 AM", title: "Next day session" }],
        },
      ]}
    />,
  );

  const saturday = screen.getByRole("heading", { name: "Saturday" }).closest("article")!;
  const sunday = screen.getByRole("heading", { name: "Sunday" }).closest("article")!;
  const rows = within(saturday).getAllByRole("listitem");
  expect(rows).toHaveLength(2);
  expect(within(rows[0]).getAllByRole("heading").map((heading) => heading.textContent))
    .toEqual(["First session", "Parallel session"]);
  expect(within(rows[1]).getByRole("heading", { name: "Later session" })).toBeInTheDocument();
  expect(within(sunday).getAllByRole("listitem")).toHaveLength(1);
  expect(within(sunday).getByRole("heading", { name: "Next day session" })).toBeInTheDocument();
  expect(screen.getAllByText("10:00–11:00 AM")).toHaveLength(2);
  expect(within(sunday).queryByRole("region")).not.toBeInTheDocument();
});
