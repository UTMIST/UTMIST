import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

const gradientBorder = clsx(
  "relative isolate border-0",
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-[1.582px] before:content-['']",
  "before:bg-[linear-gradient(101deg,#59e0e9_0%,transparent_20.1923%,#fff_47.1154%,transparent_79.3269%,#dfd6ff_100%)]",
  "before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:[mask-composite:exclude]",
);

const surfaceVariants = {
  panel:
    "bg-transparent backdrop-blur-[1.25px] backdrop-saturate-[1.32] backdrop-contrast-110",
  liquid: clsx(
    "bg-[radial-gradient(ellipse_45%_180%_at_10%_-45%,rgb(255_255_255/0.3),transparent_68%),radial-gradient(ellipse_60%_160%_at_95%_145%,rgb(223_214_255/0.2),transparent_70%),rgb(255_255_255/0.075)]",
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.32),0_18px_60px_rgb(6_0_61/0.28)] backdrop-blur-[22px] backdrop-saturate-[1.45]",
  ),
  mobile: clsx(
    "bg-[radial-gradient(ellipse_45%_180%_at_10%_-45%,rgb(255_255_255/0.22),transparent_68%),radial-gradient(ellipse_60%_160%_at_95%_145%,rgb(223_214_255/0.16),transparent_70%),rgb(12_2_73/0.9)]",
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.32),0_18px_60px_rgb(6_0_61/0.28)] backdrop-blur-[22px] backdrop-saturate-[1.45]",
  ),
  action: clsx(
    "overflow-hidden bg-[rgb(76_229_232/0.4)] shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_0_24px_rgb(89_224_233/0.14)]",
    "backdrop-blur-[22px] backdrop-saturate-[1.45] hover:bg-[rgb(76_229_232/0.5)]",
  ),
  orb: "bg-transparent hover:bg-white/8",
} as const;

type EigenGlassSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: keyof typeof surfaceVariants;
};

export function EigenGlassSurface({
  children,
  className,
  asChild = false,
  variant = "panel",
}: EigenGlassSurfaceProps) {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={clsx(gradientBorder, surfaceVariants[variant], className)}
    >
      {children}
    </Component>
  );
}

export function EigenSpeakerPortrait({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "border-[1.582px] border-transparent bg-[linear-gradient(#0c0249,#0c0249)_padding-box,linear-gradient(101deg,#59e0e9_0%,transparent_20.1923%,#fff_47.1154%,transparent_79.3269%,#dfd6ff_100%)_border-box]",
        className,
      )}
    >
      {children}
    </div>
  );
}
