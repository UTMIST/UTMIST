import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib";
import { Button } from "./button";

interface PillLinkProps {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  direction?: "right" | "down";
  className?: string;
}

/** Shared CTA sizing and secondary-colour arrow circle on every surface. */
export function PillLink({
  href,
  children,
  tone = "light",
  direction = "right",
  className,
}: PillLinkProps) {
  return (
    <Button asChild variant="outline" size="sm" data-ui-tone={tone}
      className={cn(
        "relative m-0 h-14 min-h-14 gap-3 rounded-full py-[7px] pl-6 pr-[7px] text-base font-medium leading-5 hover:scale-100",
        tone === "dark"
          ? "border-[var(--border-on-dark)] bg-transparent text-white hover:border-[var(--brand-lilac)] hover:bg-[var(--surface-hover-dark)]"
          : "border-[var(--border-brand)] text-primary hover:bg-[var(--surface-hover)]",
        className,
      )}>
      <Link href={href}>
        {children}
        <span aria-hidden="true" className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--pill-link-accent,var(--secondary))]">
          <Image src="/redesign/cta-arrow.svg" alt="" width={20} height={20} className={cn("size-5", direction === "down" && "rotate-90")} />
        </span>
      </Link>
    </Button>
  );
}
