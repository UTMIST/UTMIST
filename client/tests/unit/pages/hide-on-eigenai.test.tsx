import { render, screen } from "@testing-library/react";

let mockPathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { HideOnEigenAI } from "@/shared/ui/hide-on-eigenai";

describe("HideOnEigenAI", () => {
  it.each(["/eigenai", "/eigenai/schedule"])(
    "hides shared chrome on %s",
    (pathname) => {
      mockPathname = pathname;

      render(
        <HideOnEigenAI>
          <div>Shared chrome</div>
        </HideOnEigenAI>,
      );

      expect(screen.queryByText("Shared chrome")).not.toBeInTheDocument();
    },
  );

  it("renders shared chrome on other routes", () => {
    mockPathname = "/events";

    render(
      <HideOnEigenAI>
        <div>Shared chrome</div>
      </HideOnEigenAI>,
    );

    expect(screen.getByText("Shared chrome")).toBeInTheDocument();
  });
});
