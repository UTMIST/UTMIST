import type { ContentSection } from "@/shared/lib";

export default function OrganizationIntro({ heading, description }: Pick<ContentSection, "heading" | "description">) {
  return (
    <>
      <p className="text-4xl font-bold text-center max-w-3xl text-[var(--foreground)] px-8 md:px-0">
        {heading}
      </p>
      {description ? <p className="text-center max-w-3xl px-8 md:px-0">{description}</p> : null}
    </>
  );
}
