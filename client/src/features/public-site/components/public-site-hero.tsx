import type { ReactNode } from "react";

import { cn } from "@/shared/lib";
import { ContentContainer } from "@/shared/ui";
import HeroLightBackground from "@/features/public-site/components/hero-light-background";
import type { HeroLightTheme } from "@/features/public-site/lib/hero-light-renderer";

interface PublicSiteHeroProps {
  headingId: string;
  title: ReactNode;
  eyebrow: ReactNode;
  actions: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  contentId?: string;
  theme?: HeroLightTheme;
  className?: string;
}

/** One responsive composition for public-page heroes; pages supply content and color. */
export default function PublicSiteHero({
  headingId, title, eyebrow, actions, description, aside, contentId,
  theme = "home", className,
}: PublicSiteHeroProps) {
  return (
    <section data-public-site-hero data-ui-tone="dark" aria-labelledby={headingId} className={cn("relative isolate min-h-dvh overflow-hidden bg-black font-eigen-body text-white", className)}>
      <HeroLightBackground theme={theme} />
      <ContentContainer className="grid min-h-dvh content-center gap-10 pb-16 pt-28 sm:gap-12 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(140px,1fr)_minmax(0,760px)_minmax(140px,1fr)] lg:content-stretch lg:items-center lg:gap-8 lg:pb-14 lg:pt-28">
        <div id={contentId} className="mx-auto w-full max-w-[760px] text-center lg:col-start-2 lg:row-start-1">
          <p className="mx-auto mb-5 max-w-xl text-base font-normal leading-relaxed text-white/85">{eyebrow}</p>
          <h1 id={headingId} className="text-balance break-words font-medium text-[clamp(2rem,8.5vw,3.75rem)] leading-[1.05] tracking-[-0.045em] lg:text-[clamp(3rem,4.5vw,4.5rem)]">{title}</h1>
          {description && <p className="ui-section-copy mx-auto mt-7 max-w-md">{description}</p>}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">{actions}</div>
        </div>
        {aside}
      </ContentContainer>
    </section>
  );
}
