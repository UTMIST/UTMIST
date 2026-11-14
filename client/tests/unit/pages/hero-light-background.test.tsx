import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HeroLightBackground from "@/features/public-site/components/hero-light-background";

const mockSetPaused = jest.fn();
const mockDispose = jest.fn();
jest.mock("@/features/public-site/lib/hero-light-renderer", () => ({
  ...jest.requireActual("@/features/public-site/lib/hero-light-renderer"),
  createHeroLightRenderer: () => ({ setPaused: mockSetPaused, dispose: mockDispose }),
}));

beforeEach(() => jest.clearAllMocks());

it.each(["home", "f2f"] as const)("lets a visitor pause and resume the %s background with the keyboard", async (theme) => {
  const user = userEvent.setup();
  render(<section><HeroLightBackground theme={theme} /></section>);

  await user.tab();
  expect(screen.getByRole("button", { name: "Pause background animation" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("button", { name: "Resume background animation" })).toHaveFocus();
  expect(mockSetPaused).toHaveBeenLastCalledWith(true);
  await user.keyboard(" ");
  expect(screen.getByRole("button", { name: "Pause background animation" })).toHaveFocus();
  expect(mockSetPaused).toHaveBeenLastCalledWith(false);
});

it("releases the renderer when the hero is unmounted", () => {
  const { unmount } = render(<section><HeroLightBackground /></section>);
  unmount();
  expect(mockDispose).toHaveBeenCalledTimes(1);
});

it("preserves a visitor's pause choice when switching themes and replaces the renderer", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<section><HeroLightBackground /></section>);
  await user.click(screen.getByRole("button", { name: "Pause background animation" }));
  rerender(<section><HeroLightBackground theme="f2f" /></section>);
  expect(mockDispose).toHaveBeenCalledTimes(1);
  expect(mockSetPaused).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("button", { name: "Resume background animation" })).toBeInTheDocument();
});
