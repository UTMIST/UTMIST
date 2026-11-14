import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";
import { ContentContainer } from "./content-container";

type SectionProps = ComponentProps<"section"> & {
  variant?: "plain" | "tinted";
  contentClassName?: string;
};

/** Standard marketing-section rhythm; the hero keeps its bespoke layout. */
export function Section({ variant = "plain", className, contentClassName, children, ...props }: SectionProps) {
  return (
    <section {...props} data-ui-tone="light" className={cn(
      "ui-section py-[calc(var(--ui-section-gap)/2)]",
      variant === "tinted" && "border-y border-[var(--border-brand)] bg-[var(--accent)]/45",
      className,
    )}>
      <ContentContainer className={contentClassName}>{children}</ContentContainer>
    </section>
  );
}
