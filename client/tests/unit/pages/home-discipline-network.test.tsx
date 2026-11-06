import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { inView } from "framer-motion";

import HomeDisciplineNetwork from "@/features/public-site/components/home-discipline-network";

jest.mock("framer-motion", () => ({ inView: jest.fn() }));

let enter: () => void;
let reduced: boolean;
const stop = jest.fn();
beforeEach(() => {
  reduced = false;
  jest.clearAllMocks();
  Object.defineProperty(window, "IntersectionObserver", { configurable: true, value: jest.fn() });
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: reduced, addEventListener: jest.fn(), removeEventListener: jest.fn() }) });
  jest.mocked(inView).mockImplementation((element, callback) => {
    enter = () => { callback(element as Element, {} as IntersectionObserverEntry); };
    return stop;
  });
});
afterEach(() => { jest.useRealTimers(); });

it("supports keyboard selection, switching disciplines and clearing with Escape", async () => {
  const user = userEvent.setup();
  render(<HomeDisciplineNetwork />);
  const [first, second] = screen.getAllByRole("button");

  await user.tab();
  expect(first).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(first).toHaveAttribute("aria-pressed", "true");
  await user.tab();
  await user.keyboard(" ");
  expect(first).toHaveAttribute("aria-pressed", "false");
  expect(second).toHaveAttribute("aria-pressed", "true");
  await user.keyboard("{Escape}");
  expect(second).toHaveFocus();
  expect(screen.queryByRole("button", { pressed: true })).not.toBeInTheDocument();
});

it("previews connections without changing a pinned selection and toggles it off on a second click", async () => {
  const user = userEvent.setup();
  render(<HomeDisciplineNetwork />);
  const [first, second] = screen.getAllByRole("button");

  await user.click(first);
  fireEvent.pointerEnter(second, { pointerType: "mouse" });
  expect(second).toHaveAttribute("data-active", "true");
  expect(first).toHaveAttribute("aria-pressed", "true");
  expect(second).toHaveAttribute("aria-pressed", "false");
  fireEvent.pointerLeave(second);
  expect(first).toHaveAttribute("data-active", "true");
  await user.click(first);
  expect(screen.queryByRole("button", { pressed: true })).not.toBeInTheDocument();
  expect(first).toHaveAttribute("data-active", "false");
});

it("restarts the flash when pinning a hovered pill while preserving button focus", async () => {
  const user = userEvent.setup();
  render(<HomeDisciplineNetwork />);
  const business = screen.getByRole("button", { name: "Business" });

  await user.hover(business);
  const previewGlow = business.querySelector(".home-discipline-wave-glow");
  expect(previewGlow).not.toBeNull();
  await user.click(business);

  // Remounting the decoration restarts its CSS flash; the control stays mounted.
  expect(business.querySelector(".home-discipline-wave-glow")).not.toBe(previewGlow);
  expect(business).toHaveFocus();
  expect(business).toHaveAttribute("aria-pressed", "true");
  const pinnedGlow = business.querySelector(".home-discipline-wave-glow");
  await user.click(business);
  expect(business).toHaveAttribute("aria-pressed", "false");
  expect(business.querySelector(".home-discipline-wave-glow")).toBe(pinnedGlow);
});

it("plays an entrance wave without selecting a discipline, then releases it", () => {
  jest.useFakeTimers();
  render(<HomeDisciplineNetwork />);
  const network = screen.getByRole("group");
  act(() => enter());
  expect(network).toHaveAttribute("data-wave-intro", "true");
  expect(screen.queryByRole("button", { pressed: true })).not.toBeInTheDocument();
  act(() => jest.runAllTimers());
  expect(network).toHaveAttribute("data-wave-active", "false");
  act(() => enter());
  expect(network).toHaveAttribute("data-wave-intro", "false");
});

it("lets user selection supersede the entrance wave and survive its timer", () => {
  jest.useFakeTimers();
  const { unmount } = render(<HomeDisciplineNetwork />);
  act(() => enter());
  const physics = screen.getByRole("button", { name: "Physics" });
  fireEvent.click(physics);
  expect(screen.getByRole("group")).toHaveAttribute("data-wave-intro", "false");
  act(() => jest.runAllTimers());
  expect(physics).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("group")).toHaveAttribute("data-wave-active", "true");
  unmount();
  expect(stop).toHaveBeenCalled();
  expect(jest.getTimerCount()).toBe(0);
});

it("skips autoplay for reduced motion while keeping selection interactive", () => {
  reduced = true;
  render(<HomeDisciplineNetwork />);
  expect(inView).not.toHaveBeenCalled();
  const physics = screen.getByRole("button", { name: "Physics" });
  fireEvent.click(physics);
  expect(physics).toHaveAttribute("aria-pressed", "true");
});
