import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HomeHeroBackground from "@/features/public-site/components/home-hero-background";

const mockSetPaused = jest.fn();
const mockDispose = jest.fn();
jest.mock("@/features/public-site/lib/hero-light-renderer", () => ({
  createHeroLightRenderer: () => ({ setPaused: mockSetPaused, dispose: mockDispose }),
}));

beforeEach(() => jest.clearAllMocks());

it("lets a visitor pause and resume the decorative background with the keyboard", async () => {
  const user = userEvent.setup();
  render(<section><HomeHeroBackground /></section>);

  await user.tab();
  expect(screen.getByRole("button", { name: "Pause background animation" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("button", { name: "Resume background animation" })).toHaveFocus();
  expect(mockSetPaused).toHaveBeenLastCalledWith(true);
  await user.keyboard(" ");
  expect(screen.getByRole("button", { name: "Pause background animation" })).toHaveFocus();
  expect(mockSetPaused).toHaveBeenLastCalledWith(false);
});

it("releases the renderer when the homepage is unmounted", () => {
  const { unmount } = render(<section><HomeHeroBackground /></section>);
  unmount();
  expect(mockDispose).toHaveBeenCalledTimes(1);
});
