import clsx from "clsx";

type EigenAIContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function EigenAIContent({
  children,
  className,
}: EigenAIContentProps) {
  return (
    <div
      data-testid="eigenai-content"
      className={clsx(
        "relative z-10 mx-auto w-full max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EigenAISectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="font-eigen-serif! bg-[radial-gradient(ellipse_54%_100%_at_30%_48%,#fff_0%,#a272fb_100%)] bg-clip-text text-center text-[clamp(2rem,6vw,4rem)] leading-tight font-medium! text-transparent">
      {children}
    </h2>
  );
}

type EigenAISectionProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
  testId?: string;
  title?: React.ReactNode;
};

export function EigenAISection({
  children,
  className,
  contentClassName,
  id,
  testId,
  title,
}: EigenAISectionProps) {
  return (
    <section
      id={id}
      data-testid={testId}
      className={clsx("relative scroll-mt-20 px-5 sm:px-10 md:scroll-mt-28", className)}
    >
      <EigenAIContent className={contentClassName}>
        {title ? (
          <>
            <EigenAISectionHeading>{title}</EigenAISectionHeading>
            <div className="mt-6 sm:mt-12">{children}</div>
          </>
        ) : (
          children
        )}
      </EigenAIContent>
    </section>
  );
}
