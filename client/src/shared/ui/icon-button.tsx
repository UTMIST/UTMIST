import { forwardRef } from "react";

import { cn } from "@/shared/lib";
import { Button, type ButtonProps } from "./button";

type IconButtonProps = Omit<ButtonProps, "variant" | "size" | "iconSize"> & {
  tone?: "light" | "dark";
  "aria-label": string;
};

/** One 44px target and 20px glyph for circular actions and asChild links. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tone = "light", className, type = "button", asChild, ...props }, ref) => (
    <Button {...props} ref={ref} asChild={asChild} type={asChild ? undefined : type}
      variant="outline" size="icon" iconSize="md" data-ui-tone={tone}
      className={cn(
        "m-0 size-11 shrink-0 rounded-full p-0 hover:scale-100 [&_img]:size-5",
        tone === "dark"
          ? "border-[var(--border-on-dark)] bg-transparent text-white hover:border-[var(--brand-lilac)] hover:bg-[var(--surface-hover-dark)]"
          : "border-[var(--border-brand)] bg-white text-secondary hover:border-secondary hover:bg-[var(--surface-hover)]",
        className,
      )} />
  ),
);
IconButton.displayName = "IconButton";
