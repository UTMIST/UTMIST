import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib";

type SectionIntroProps = Omit<ComponentProps<"div">, "title"> & {
  headingId?: string;
  title: ReactNode;
  label?: string;
  description?: ReactNode;
  align?: "left" | "center";
};

/** One label, heading, description and action rhythm, in two alignments. */
export function SectionIntro({ headingId, title, label, description, align = "left", children, className, ...props }: SectionIntroProps) {
  return (
    <div {...props} className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {label && <p className="ui-section-label mb-4">{label}</p>}
      <h2 id={headingId} className="ui-section-heading">{title}</h2>
      {description && <p className="ui-section-copy mt-5">{description}</p>}
      {children && <div className="mt-7">{children}</div>}
    </div>
  );
}
