import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

type CardLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  variant?: "flat" | "raised";
};

/** A single navigable card with shared pointer and keyboard feedback. */
export function CardLink({ href, variant = "flat", className, target, rel, ...props }: CardLinkProps) {
  const linkTarget = target ?? (/^https?:\/\//i.test(href) ? "_blank" : undefined);
  const linkRel = linkTarget === "_blank"
    ? Array.from(new Set([...(rel?.split(/\s+/) ?? []), "noopener", "noreferrer"])).join(" ")
    : rel;

  return (
    <Link {...props} href={href} target={linkTarget} rel={linkRel}
      data-ui-tone="light" data-variant={variant}
      className={cn("ui-card-link ui-focus rounded-xl border border-[var(--border-brand)] bg-white text-primary", className)} />
  );
}
