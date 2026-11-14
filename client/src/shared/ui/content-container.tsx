import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/shared/lib";

type ContentContainerProps = ComponentProps<"div"> & { asChild?: boolean };

/** Shared reading width and responsive gutters, independent of section backgrounds. */
export function ContentContainer({ asChild = false, className, ...props }: ContentContainerProps) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
