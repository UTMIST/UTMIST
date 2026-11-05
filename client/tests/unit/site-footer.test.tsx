import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

const mockFooter = jest.fn();
jest.mock("@/shared/ui/footer", () => ({
  __esModule: true,
  default: (props: unknown) => { mockFooter(props); return null; },
}));

import { SiteFooter } from "@/shared/ui/site-footer";

it("selects the standard footer only on the flagged homepage and updates after navigation", () => {
  jest.mocked(usePathname).mockReturnValue("/");
  const { rerender } = render(<SiteFooter redesignEnabled />);
  expect(mockFooter).toHaveBeenLastCalledWith({ variant: "standard" });

  jest.mocked(usePathname).mockReturnValue("/projects");
  rerender(<SiteFooter redesignEnabled />);
  expect(mockFooter).toHaveBeenLastCalledWith({ variant: "legacy" });

  jest.mocked(usePathname).mockReturnValue("/");
  rerender(<SiteFooter redesignEnabled={false} />);
  expect(mockFooter).toHaveBeenLastCalledWith({ variant: "legacy" });
});
