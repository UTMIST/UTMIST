import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EigenNavigation } from "@/features/public-site/components/eigenai-navigation";

it("closes the mobile menu when Tab moves focus onto the page", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <>
      <EigenNavigation />
      <a href="https://example.com/directions">Get directions</a>
    </>,
  );

  const toggle = container.querySelector<HTMLButtonElement>(
    'button[aria-controls="eigenai-mobile-menu"]',
  )!;
  await user.click(toggle);
  const menu = document.getElementById("eigenai-mobile-menu")!;
  await user.tab();
  expect(menu.querySelector("a[href^='#']")).toHaveFocus();
  expect(toggle).toHaveAttribute("aria-expanded", "true");

  // jsdom does not apply Tailwind's desktop/mobile visibility rules. Start at
  // the last visible navigation control, then follow the actual tab order.
  container.querySelector<HTMLButtonElement>('button:not([aria-controls])')!.focus();
  await user.tab();

  expect(container.querySelector('a[href="https://example.com/directions"]')).toHaveFocus();
  expect(container.querySelector('button:not([aria-controls])')).not.toBeInTheDocument();
  expect(document.body.style.overflow).not.toBe("hidden");
});

it("returns focus to the toggle on Escape", async () => {
  const user = userEvent.setup();
  const { container } = render(<EigenNavigation />);
  const toggle = container.querySelector<HTMLButtonElement>(
    'button[aria-controls="eigenai-mobile-menu"]',
  )!;
  await user.click(toggle);
  await user.tab();
  await user.keyboard("{Escape}");

  expect(toggle).toHaveFocus();
  expect(document.getElementById("eigenai-mobile-menu")).toBeNull();
});

it("closes on a section link and restores the previous scroll setting", async () => {
  document.body.style.overflow = "auto";
  const user = userEvent.setup();
  const { container, unmount } = render(<EigenNavigation />);
  await user.click(
    container.querySelector('button[aria-controls="eigenai-mobile-menu"]')!,
  );
  fireEvent.click(
    document.getElementById("eigenai-mobile-menu")!.querySelector("a[href^='#']")!,
  );
  expect(document.body.style.overflow).toBe("auto");
  expect(document.getElementById("eigenai-mobile-menu")).toBeNull();
  unmount();
  document.body.style.overflow = "";
});
