import { render } from "@testing-library/react";

import OrganizationImpact from "@/features/public-site/components/organization-impact";

const mockIntro = jest.fn();
const mockStatistics = jest.fn();
jest.mock("@/features/public-site/components/organization-intro", () => ({
  __esModule: true,
  default: (props: unknown) => { mockIntro(props); return null; },
}));
jest.mock("@/features/public-site/components/stats", () => ({
  __esModule: true,
  default: (props: unknown) => { mockStatistics(props); return null; },
}));

it("passes changed intro fields and ordered CMS rows to reusable components", () => {
  const content = {
    heading: "Synthetic first heading",
    description: "Synthetic supporting text",
    statistics: [{ number: "7+", description: "Synthetic A" }, { number: "3", description: "Synthetic B" }],
  };
  const view = render(<OrganizationImpact content={content} />);
  expect(mockIntro).toHaveBeenLastCalledWith({ heading: content.heading, description: content.description });
  expect(mockStatistics).toHaveBeenLastCalledWith({ items: content.statistics });
  const edited = { ...content, heading: "Synthetic edit", statistics: content.statistics.toReversed() };
  view.rerender(<OrganizationImpact content={edited} />);
  expect(mockIntro).toHaveBeenLastCalledWith({ heading: edited.heading, description: edited.description });
  expect(mockStatistics).toHaveBeenLastCalledWith({ items: edited.statistics });
});
