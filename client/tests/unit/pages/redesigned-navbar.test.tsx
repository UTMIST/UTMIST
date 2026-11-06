import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockSignedIn = false;
let mockPathname = "/";
jest.mock("@/shared/lib/client", () => ({
  useUser: () => ({ user: mockSignedIn ? { id: "test-user" } : null }),
}));
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname }));

import Navbar from "@/shared/ui/navbar";

beforeEach(() => { mockSignedIn = false; mockPathname = "/"; });

it("uses the new navigation only when enabled", () => {
  const { rerender } = render(<Navbar />);
  expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
  rerender(<Navbar redesignEnabled />);
  expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
});

it("opens and closes the mobile menu, restoring focus on Escape", async () => {
  const user = userEvent.setup();
  render(<Navbar redesignEnabled />);
  const toggle = screen.getByRole("button", { name: "Open menu" });
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  await user.click(screen.getByRole("link", { name: "Projects" }));
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await user.click(toggle);
  screen.getByRole("link", { name: "Projects" }).focus();
  await user.keyboard("{Escape}");
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(toggle).toHaveFocus();
});

it("preserves programs and closes their disclosure with Escape", async () => {
  const user = userEvent.setup();
  render(<Navbar redesignEnabled />);
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  const programs = screen.getByRole("button", { name: "Programs" });
  programs.focus();
  await user.keyboard("{Enter}");
  const program = screen.getByRole("link", { name: "MISTic R&D" });
  expect(program).toHaveAttribute("href", "/startups");
  expect(screen.queryByRole("link", { name: "EigenAI" })).not.toBeInTheDocument();
  program.focus();
  await user.keyboard("{Escape}");
  expect(programs).toHaveAttribute("aria-expanded", "false");
  expect(programs).toHaveFocus();
});

it("opens EigenAI on Events hover while keeping Events a direct page link", async () => {
  const user = userEvent.setup();
  render(<Navbar redesignEnabled />);
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  const events = screen.getByRole("link", { name: "Events" });
  expect(events).toHaveAttribute("href", "/events");
  await user.hover(events);
  expect(screen.getByRole("link", { name: "EigenAI" })).toHaveAttribute("href", "/eigenai");
  await user.unhover(events);
  expect(screen.queryByRole("link", { name: "EigenAI" })).not.toBeInTheDocument();
  await user.click(events);
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});

it("supports the Events submenu with keyboard controls and restores focus on Escape", async () => {
  const user = userEvent.setup();
  render(<Navbar redesignEnabled />);
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  const toggle = screen.getByRole("link", { name: "Events" });
  toggle.focus();
  await user.keyboard("{ArrowDown}");
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  await user.tab();
  expect(screen.getByRole("link", { name: "EigenAI" })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(toggle).toHaveFocus();
});

it("keeps mobile submenu layout stable until the next navigation item is activated", async () => {
  const user = userEvent.setup();
  render(<Navbar redesignEnabled />);
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  const events = screen.getByRole("link", { name: "Events" });
  events.focus();
  await user.keyboard("{ArrowDown}");
  const programs = screen.getByRole("button", { name: "Programs" });
  programs.focus();
  // Touch focus happens before click; collapsing here would move Programs.
  expect(events).toHaveAttribute("aria-expanded", "true");
  await user.keyboard("{Enter}");
  expect(events).toHaveAttribute("aria-expanded", "false");
  expect(programs).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("link", { name: "MISTic R&D" })).toBeVisible();
});

it("links signed-out visitors to login and members to their profile", () => {
  const { rerender } = render(<Navbar redesignEnabled />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/auth");
  mockSignedIn = true;
  rerender(<Navbar redesignEnabled />);
  expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
});

it("closes the mobile menu on route changes", () => {
  const { rerender } = render(<Navbar redesignEnabled />);
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  mockPathname = "/events";
  rerender(<Navbar redesignEnabled />);
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});
