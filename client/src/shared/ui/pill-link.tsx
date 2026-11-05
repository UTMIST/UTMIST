import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib";
import { Button } from "./button";

interface PillLinkProps {
  href: string;
  children: ReactNode;
  light?: boolean;
  arrow?: "circle" | "plain" | "diagonal";
  variant?: "outline" | "link";
  className?: string;
}

/** Consistent CTA sizing built on the shared Button and Next Link. */
export function PillLink({
  href,
  children,
  light = false,
  arrow = "circle",
  variant = "outline",
  className,
}: PillLinkProps) {
  return (
    <Button asChild variant={variant} size="sm"
      className={cn(
        "relative m-0 h-12 min-h-12 gap-3 rounded-full py-[5px] text-base font-normal leading-5 hover:scale-100",
        arrow === "circle" ? "pl-5 pr-[5px]" : "px-4",
        light ? "text-white" : "text-black",
        variant === "outline" && (light
          ? "border-white bg-neutral-300/20 shadow-sm hover:border-white hover:bg-white/25"
          : "border-border"),
        className,
      )}>
      <Link href={href}>
        {children}
        <span aria-hidden="true" className={cn("relative flex shrink-0 items-center justify-center", arrow === "circle" ? "size-9 rounded-full bg-secondary" : "size-4")}>
          {light && arrow === "circle" ? <Image src="/redesign/cta-arrow-circle.svg" alt="" width={36} height={36} className="absolute inset-0 size-9" /> : null}
          <Image src="/redesign/cta-arrow.svg" alt="" width={16} height={16} className={cn(
            "relative size-4",
            arrow === "diagonal" && "-rotate-45",
            arrow !== "circle" && !light && "brightness-0",
          )} />
        </span>
      </Link>
    </Button>
  );
}
