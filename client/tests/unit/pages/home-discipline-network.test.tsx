import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HomeDisciplineNetwork from "@/features/public-site/components/home-discipline-network";

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
