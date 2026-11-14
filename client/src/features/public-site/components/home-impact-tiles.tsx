import Image from "next/image";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, FlaskConical, GraduationCap, Users } from "lucide-react";

import { CardLink } from "@/shared/ui";
import logo from "@/assets/logos/utmist-logo-small.svg";
import type { HomeImpactContent } from "@/features/public-site/data/home-impact";

const statisticPresentation = {
  "developers across all teams and departments": { title: "Developers", icon: Users, href: "/careers" },
  "AI/ML projects completed": { title: "AI/ML Projects", icon: Code2, href: "/projects" },
  "industry partners and collaborations": { title: "Industry Partners", icon: BriefcaseBusiness, href: "/sponsors" },
  "academic workshops conducted": { title: "Academic Workshops", icon: GraduationCap, href: "/ml-fundamentals" },
  "articles and notebooks published": { title: "Articles & Notebooks", icon: BookOpen, href: "https://medium.com/demistify" },
  "papers published in top-tier conferences": { title: "Research Papers", icon: FlaskConical, href: "/projects" },
} satisfies Record<string, { title: string; icon: typeof Users; href: string }>;

const sidebarIcons = ["folder", "upload", "bookmark", "calendar", "people"];

export default function HomeImpactTiles({ impact }: { impact: HomeImpactContent }) {
  // Match destinations by meaning so CMS reordering preserves each tile's link.
  const statistics = impact.statistics.map(stat => ({
    ...stat,
    presentation: Object.hasOwn(statisticPresentation, stat.description)
      ? statisticPresentation[stat.description as keyof typeof statisticPresentation]
      : undefined,
  }));

  return (
    <section aria-labelledby="impact-heading" className="mt-[var(--ui-section-gap)]">
      <div data-home-reveal className="mx-auto mb-8 max-w-2xl text-center">
        <h2 id="impact-heading" className="home-card-heading">Our footprint so far</h2>
        <p className="home-body mt-3">{impact.heading}</p>
        {impact.description && <p className="home-body mt-3">{impact.description}</p>}
      </div>
      <div className="home-impact-crop mx-auto max-w-4xl overflow-hidden rounded-t-xl">
        {/* Only the extra frame padding extends below the section; every tile stays visible. */}
        <div data-ui-tone="light" className="home-impact-dashboard -mb-8 grid grid-cols-1 overflow-hidden rounded-xl border border-[var(--border-brand)] bg-white pb-8 text-primary [--home-copy-color:var(--muted-foreground)] sm:grid-cols-[56px_minmax(0,1fr)]">
          <div aria-hidden="true" className="hidden flex-col items-center border-r border-[var(--border-brand)] sm:flex">
            <div className="flex h-12 items-center justify-center">
              <Image src={logo} alt="" width={24} height={24} />
            </div>
            <div className="flex flex-col items-center gap-2 pt-3">
              {sidebarIcons.map((icon, index) => (
                <span key={icon} className={`flex size-8 items-center justify-center rounded-lg border ${index === 0 ? "border-[var(--border-brand)] bg-white" : "border-transparent"}`}>
                  <Image src={`/home-redesign/dashboard/${icon}.svg`} alt="" width={18} height={18} />
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[var(--border-brand)] px-3 py-3 text-xs sm:px-4">
              <p>Community impact</p>
              <span className="shrink-0 text-muted-foreground">All time</span>
            </div>
            <div className="bg-[var(--accent)]/25 px-3 pb-6 pt-4 sm:px-4">
              <ul data-home-stagger="row" aria-label="Community impact"
                className="home-impact-cards grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
                {statistics.map((stat) => {
                  const { presentation } = stat;
                  const Icon = presentation?.icon ?? Users;
                  const content = (
                    <>
                      <span className="mb-3 flex items-center justify-between gap-3 text-secondary">
                        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                        {presentation && <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />}
                      </span>
                      <span className="home-impact-number block text-secondary">{stat.number}</span>
                      <span className="mt-2 min-h-10 text-sm font-medium leading-5 sm:min-h-5">{presentation?.title ?? stat.description}</span>
                    </>
                  );
                  const tileClass = "flex h-full min-w-0 flex-col p-3 sm:p-4";
                  return (
                    <li data-home-reveal key={stat.description} className="min-w-0">
                      {presentation ? (
                        <CardLink
                          href={presentation.href}
                          aria-label={`${stat.number} ${presentation.title}: ${stat.description}`}
                          className={`home-impact-tile ${tileClass}`}
                        >
                          {content}
                        </CardLink>
                      ) : (
                        <div className={`rounded-xl border border-[var(--border-brand)] bg-white ${tileClass}`}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
