import Image from "next/image";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, Ellipsis, FlaskConical, GraduationCap, Users } from "lucide-react";

import logo from "@/assets/logos/utmist-logo-small.svg";
import type { HomeImpactContent } from "@/features/public-site/data/home-impact";

const statisticPresentation = {
  "developers across all teams and departments": { title: "Developers", icon: Users },
  "AI/ML projects completed": { title: "AI/ML Projects", icon: Code2 },
  "industry partners and collaborations": { title: "Industry Partners", icon: BriefcaseBusiness },
  "academic workshops conducted": { title: "Academic Workshops", icon: GraduationCap },
  "articles and notebooks published": { title: "Articles & Notebooks", icon: BookOpen },
  "papers published in top-tier conferences": { title: "Research Papers", icon: FlaskConical },
} satisfies Record<string, { title: string; icon: typeof Users }>;

const sidebarIcons = ["folder", "upload", "bookmark", "calendar", "people"];

export default function HomeImpactDashboard({ impact }: { impact: HomeImpactContent }) {
  return (
    <section aria-labelledby="impact-heading" className="mt-12 sm:mt-20 md:mt-24" data-figma-node="25:1478">
      <h2 data-home-reveal id="impact-heading" className="mb-9 text-[clamp(2rem,3vw,3rem)] leading-tight tracking-[-0.05em] md:mb-10">
        Our footprint this <span className="home-selection">year</span>
      </h2>
      <div className="home-impact-crop relative overflow-hidden rounded-t-xl">
        <div className="home-impact-dashboard -mb-20 grid grid-cols-1 overflow-hidden rounded-xl border border-black/25 bg-[var(--accent)]/20 pb-28 sm:grid-cols-[64px_minmax(0,1fr)] lg:grid-cols-[80px_minmax(0,1fr)]">
          {/* The rail is part of the dashboard illustration, not a second navigation. */}
          <div aria-hidden="true" className="home-impact-sidebar -mb-28 hidden flex-col items-center border-r border-black/10 sm:flex">
            <div className="flex h-16 items-center justify-center lg:h-[72px]">
              <Image src={logo} alt="" width={30} height={30} className="size-6 lg:size-7" />
            </div>
            <div className="flex flex-col items-center gap-3 pt-3">
              {sidebarIcons.map((icon, index) => (
                <span key={icon} className={`flex size-9 items-center justify-center rounded-md ${index === 0 ? "bg-white" : ""}`}>
                  <Image src={`/home-redesign/dashboard/${icon}.svg`} alt="" width={20} height={20} className="size-[19px] object-contain" />
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-black/10 px-4 py-4 text-xs sm:px-5 lg:min-h-[72px] lg:px-6 lg:text-sm">
              <p><span className="hidden text-muted-foreground sm:inline">Dashboard / </span>UTMIST Community Impact</p>
              <div className="hidden items-center gap-3 sm:flex">
                <span className="rounded border border-black/40 bg-black/[0.02] px-3 py-2">All time</span>
                <span className="rounded border border-black/40 bg-black/[0.02] px-3 py-2">Summary</span>
              </div>
            </div>
            <div className="px-3 pt-5 sm:px-5 lg:px-6 lg:pt-6">
              <h3 className="mb-4 text-base lg:text-lg">Overview</h3>
              <dl data-home-stagger="row" className="home-impact-cards grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                {impact.statistics.map((stat) => {
                  const presentation = statisticPresentation[stat.description as keyof typeof statisticPresentation];
                  const Icon = presentation?.icon ?? Users;
                  return (
                    <div data-home-reveal key={stat.description} className="flex min-w-0 flex-col overflow-hidden rounded-[5px] border border-black/65 bg-white">
                      <dt className="flex flex-col items-start gap-2 px-3 pt-3 sm:flex-row sm:items-center sm:px-4 sm:pt-4 lg:gap-3 lg:px-5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded border border-black/25 bg-gradient-to-b from-muted to-black/[0.06] sm:size-11">
                          <Icon size={23} strokeWidth={1.25} aria-hidden="true" className="size-5 sm:size-[23px]" />
                        </span>
                        <span className="min-h-[2.5em] text-sm leading-tight tracking-[-0.02em] sm:min-h-0 sm:text-base xl:text-xl">{presentation?.title ?? stat.description}</span>
                        <Ellipsis size={17} strokeWidth={1.5} aria-hidden="true" className="ml-auto hidden shrink-0 sm:block" />
                      </dt>
                      <dd className="flex flex-1 flex-col">
                        <span className="block px-3 pb-3 pt-4 text-[clamp(2rem,9vw,2.75rem)] leading-none tracking-[-0.06em] sm:px-4 sm:pt-5 sm:text-[clamp(2.75rem,4vw,4rem)] lg:px-5">{stat.number}</span>
                        <p className="mt-auto flex min-h-16 items-center gap-2 border-t border-black/55 px-3 py-2 text-xs leading-4 sm:min-h-11 sm:px-4 lg:px-5 xl:text-sm">
                          <ArrowUpRight size={15} strokeWidth={1.25} className="hidden shrink-0 text-secondary sm:block" aria-hidden="true" />
                          {stat.description}
                        </p>
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-6 max-w-3xl text-xs leading-5 text-muted-foreground">{impact.heading}</p>
              {impact.description && <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">{impact.description}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
