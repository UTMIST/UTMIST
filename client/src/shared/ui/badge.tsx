import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

type BadgeProps = ComponentProps<"span"> & { tone?: "light" | "dark" };

/** Non-interactive labels for artwork and photos. */
export function Badge({ tone = "light", className, ...props }: BadgeProps) {
  return <span {...props} className={cn(
    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs leading-4",
    tone === "dark"
      ? "border-[var(--border-on-dark)] bg-black/35 text-white backdrop-blur-sm"
      : "border-[var(--border-brand)] bg-white/95 text-muted-foreground",
    className,
  )} />;
}
