import { render, screen, within } from "@testing-library/react";

import HomeImpactTiles from "@/features/public-site/components/home-impact-tiles";
import { homeImpactContent } from "@/features/public-site/data/home-impact";

it("keeps each statistic linked to its destination when CMS rows are reordered", () => {
  const destinations = ["/careers", "/projects", "/sponsors", "/ml-fundamentals", "/blog", "/projects"];
  const statistics = homeImpactContent.statistics.map((stat, index) => ({ ...stat, number: String(101 + index) }));
  const view = render(<HomeImpactTiles impact={{ ...homeImpactContent, statistics }} />);

  for (const rows of [statistics, statistics.toReversed()]) {
    view.rerender(<HomeImpactTiles impact={{ ...homeImpactContent, statistics: rows }} />);
    const tiles = within(screen.getByRole("list", { name: "Community impact" }));
    statistics.forEach((stat, index) => {
      const link = tiles.getByText(stat.number).closest("a");
      expect(link).toHaveAttribute("href", destinations[index]);
      expect(link).not.toHaveAttribute("tabindex", "-1");
      expect(link).toHaveAccessibleName(expect.stringContaining(stat.description));
    });
  }
});

it("does not invent a navigation destination for an unknown CMS statistic", () => {
  const statistic = { number: "37", description: "Synthetic new metric" };
  render(<HomeImpactTiles impact={{ heading: "Synthetic introduction", statistics: [statistic] }} />);
  const tiles = within(screen.getByRole("list", { name: "Community impact" }));

  expect(tiles.getByText(statistic.number)).toBeVisible();
  expect(tiles.queryByRole("link")).not.toBeInTheDocument();
});

it("includes each visible tile label in its accessible name for voice navigation", () => {
  render(<HomeImpactTiles impact={{
    ...homeImpactContent,
    statistics: homeImpactContent.statistics.toReversed(),
  }} />);
  const tiles = within(screen.getByRole("list", { name: "Community impact" }));

  for (const link of tiles.getAllByRole("link")) {
    // Derive the visible text from the rendered tile so copy edits keep this contract.
    const visibleText = Array.from(link.querySelectorAll("span"))
      .map(element => element.textContent?.trim())
      .filter(Boolean)
      .join(" ");
    expect(visibleText).not.toBe("");
    const labelPattern = new RegExp(visibleText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    expect(link).toHaveAccessibleName(labelPattern);
  }
});
