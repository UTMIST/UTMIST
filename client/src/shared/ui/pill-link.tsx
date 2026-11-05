import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "./button";

/** Compact link action used by the redesigned public pages. */
export function PillLink({ href, children, light = false, size = "sm" }: {
  href: string;
  children: ReactNode;
  light?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <Button asChild variant="outline" size="sm"
      className={`relative m-0 h-auto rounded-full font-normal hover:scale-100 ${size === "lg" ? "min-h-12 gap-4 py-1.5 pl-5 pr-1.5 text-base" : light ? "min-h-11 gap-2.5 py-[3px] pl-3 pr-[3px] text-[15px] before:absolute before:-inset-y-2 before:inset-x-0 sm:min-h-[31px]" : "min-h-11 gap-4 py-1 pl-4 pr-1 before:absolute before:-inset-y-0.5 before:inset-x-0 sm:min-h-10"} ${light ? "border-[0.5px] border-white bg-neutral-300/20 text-white shadow-sm hover:border-white hover:bg-white/25" : "border-border text-black"}`}>
      <Link href={href}>
        {children}
        {light ? (
          <span aria-hidden="true" className="relative flex size-[24.413px] shrink-0 items-center justify-center">
            <Image src="/redesign/cta-arrow-circle.svg" alt="" width={24.4125} height={24.4125} className="absolute" />
            <Image src="/redesign/cta-arrow.svg" alt="" width={8.83061} height={9.36941} className="relative" />
          </span>
        ) : (
          <span aria-hidden="true" className={`flex items-center justify-center rounded-full bg-secondary leading-none text-white ${size === "lg" ? "size-9 text-xl" : "size-7 text-base"}`}>→</span>
        )}
      </Link>
    </Button>
  );
}
