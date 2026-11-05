import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ScrollToTop from "@/shared/ui/scrollToTop";

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");

afterEach(() => {
  jest.restoreAllMocks();
  if (originalMatchMedia) Object.defineProperty(window, "matchMedia", originalMatchMedia);
  else Reflect.deleteProperty(window, "matchMedia");
});

it.each([false, true])("supports keyboard activation with reduced motion set to %s", async (reducedMotion) => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockReturnValue({ matches: reducedMotion }),
  });
  const scroll = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const user = userEvent.setup();
  render(<ScrollToTop />);
  await user.tab();
  expect(screen.getByRole("button", { name: "Scroll to top" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
});
