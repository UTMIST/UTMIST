import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

import ScrollToTop from "@/shared/ui/scrollToTop";

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");

afterEach(() => {
  jest.restoreAllMocks();
  if (originalMatchMedia) Object.defineProperty(window, "matchMedia", originalMatchMedia);
  else Reflect.deleteProperty(window, "matchMedia");
});

it.each([[false, false], [false, true], [true, false], [true, true]])("supports keyboard activation with reduced motion %s and redesign %s", async (reducedMotion, redesignEnabled) => {
  jest.mocked(usePathname).mockReturnValue("/");
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockReturnValue({ matches: reducedMotion }),
  });
  const scroll = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const user = userEvent.setup();
  render(<ScrollToTop redesignEnabled={redesignEnabled} />);
  await user.tab();
  expect(screen.getByRole("button", { name: "Scroll to top" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
});
