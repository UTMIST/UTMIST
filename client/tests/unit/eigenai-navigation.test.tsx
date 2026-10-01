import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EigenNavigation } from "@/features/public-site/components/eigenai-navigation";

it("closes the mobile menu when Tab moves focus onto the page", async () => {
  const user = userEvent.setup();
  render(
    <>
      <EigenNavigation />
      <a href="https://example.com/directions">Get directions</a>
    </>,
  );

  await user.click(
    screen.getByRole("button", { name: "Open navigation menu" }),
  );
  const menu = document.getElementById("eigenai-mobile-menu")!;
  await user.tab();
  expect(menu.querySelector("a[href^='#']")).toHaveFocus();
  expect(
    screen.getByRole("button", { name: "Close navigation menu" }),
  ).toBeInTheDocument();

  // jsdom does not apply Tailwind's desktop/mobile visibility rules. Start at
  // the last visible navigation control, then follow the actual tab order.
  screen.getByRole("button", { name: "Dismiss navigation menu" }).focus();
  await user.tab();

  expect(screen.getByRole("link", { name: "Get directions" })).toHaveFocus();
  expect(
    screen.queryByRole("button", { name: "Dismiss navigation menu" }),
  ).not.toBeInTheDocument();
  expect(document.body.style.overflow).not.toBe("hidden");
});

it("returns focus to the toggle on Escape", async () => {
  const user = userEvent.setup();
  render(<EigenNavigation />);
  await user.click(
    screen.getByRole("button", { name: "Open navigation menu" }),
  );
  await user.tab();
  await user.keyboard("{Escape}");

  expect(
    screen.getByRole("button", { name: "Open navigation menu" }),
  ).toHaveFocus();
  expect(document.getElementById("eigenai-mobile-menu")).toBeNull();
});

it("closes on a section link and restores the previous scroll setting", async () => {
  document.body.style.overflow = "auto";
  const user = userEvent.setup();
  const { unmount } = render(<EigenNavigation />);
  await user.click(
    screen.getByRole("button", { name: "Open navigation menu" }),
  );
  fireEvent.click(
    document.getElementById("eigenai-mobile-menu")!.querySelector("a[href^='#']")!,
  );
  expect(document.body.style.overflow).toBe("auto");
  expect(document.getElementById("eigenai-mobile-menu")).toBeNull();
  unmount();
  document.body.style.overflow = "";
});
