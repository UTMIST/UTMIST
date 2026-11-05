import { createRef } from "react";
import Link from "next/link";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardLink, IconButton } from "@/shared/ui";

it("keeps card destinations and protects new-tab links without losing supplied rel values", () => {
  const { rerender } = render(<CardLink href="/projects">Projects</CardLink>);
  expect(screen.getByRole("link")).toHaveAttribute("href", "/projects");
  expect(screen.getByRole("link")).not.toHaveAttribute("target");

  rerender(<CardLink href="https://example.com" rel="sponsored">Partner</CardLink>);
  expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  expect(screen.getByRole("link")).toHaveAttribute("rel", "sponsored noopener noreferrer");

  rerender(<CardLink href="https://example.com" target="_self">Partner</CardLink>);
  expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
  expect(screen.getByRole("link")).not.toHaveAttribute("rel");
});

it("supports keyboard activation and refs without submitting a containing form", async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  const onSubmit = jest.fn(event => event.preventDefault());
  const ref = createRef<HTMLButtonElement>();
  const { rerender } = render(<form onSubmit={onSubmit}><IconButton ref={ref} aria-label="Toggle preview" onClick={onClick}><span aria-hidden="true">▶</span></IconButton></form>);
  await user.tab();
  expect(ref.current).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();

  rerender(<IconButton aria-label="Toggle preview" disabled onClick={onClick} />);
  await user.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledTimes(1);
});

it("composes an icon link as one accessible anchor without button-only attributes", () => {
  render(<IconButton asChild aria-label="Profile"><Link href="/profile"><span aria-hidden="true">●</span></Link></IconButton>);
  const link = screen.getByRole("link", { name: "Profile" });
  expect(link).toHaveAttribute("href", "/profile");
  expect(link).not.toHaveAttribute("type");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
