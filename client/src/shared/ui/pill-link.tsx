import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Button } from "./button";

/** One CTA size across the redesigned public pages, with light/dark treatments. */
export function PillLink({ href, children, light = false, arrow = "circle", className }: {
  href: string;
  children: ReactNode;
  light?: boolean;
  arrow?: "circle" | "plain";
  className?: string;
}) {
  return (
    <Button asChild variant="outline" size="sm"
      className={cn(
        "relative m-0 h-12 min-h-12 gap-3 rounded-full py-[5px] text-base font-normal leading-5 hover:scale-100",
        arrow === "circle" ? "pl-5 pr-[5px]" : "px-4",
        light ? "border-white bg-neutral-300/20 text-white shadow-sm hover:border-white hover:bg-white/25" : "border-border text-black",
        className,
      )}>
      <Link href={href}>
        {children}
        <span aria-hidden="true" className={cn("relative flex shrink-0 items-center justify-center", arrow === "circle" ? "size-9 rounded-full bg-secondary" : "size-4")}>
          {light && arrow === "circle" ? <Image src="/redesign/cta-arrow-circle.svg" alt="" width={36} height={36} className="absolute inset-0 size-9" /> : null}
          <Image src="/redesign/cta-arrow.svg" alt="" width={16} height={16} className={cn("relative size-4", arrow === "plain" && !light && "brightness-0")} />
        </span>
      </Link>
    </Button>
  );
}
