import Image from "next/image";

import { PillLink } from "@/shared/ui";
import { homeContent } from "@/features/public-site/data/home-content";
import { homeEvents } from "@/features/public-site/data/home-events";
import { homeFaq } from "@/features/public-site/data/home-faq";
import { readHomeImpact } from "@/features/public-site/lib/home-impact";
import HomeHeroBackground from "@/features/public-site/components/home-hero-background";
import HomeImpactDashboard from "@/features/public-site/components/home-impact-dashboard";
import HomeDisciplineNetwork from "@/features/public-site/components/home-discipline-network";
import HomeEventCard from "@/features/public-site/components/home-event-card";
import HomeCommunityStatement from "@/features/public-site/components/home-community-statement";
import SponsorMosaic from "@/features/public-site/components/sponsor-mosaic";
import HomeScrollEffects from "@/features/public-site/components/home-scroll-effects";
import execPhoto from "@/assets/photos/eigenai-exec-photo.webp";
import logo from "@/assets/logos/utmist-logo-small.svg";
import "@/styles/gradients.css";
import "@/features/public-site/styles/home-redesign.css";

export default async function RedesignedHome() {
  const impact = await readHomeImpact();

  return (
    <HomeScrollEffects>
      <a href="#home-content" className="sr-only z-50 rounded-full bg-white px-5 py-3 text-secondary focus:not-sr-only focus:fixed focus:left-6 focus:top-6">Skip to content</a>
      <section aria-labelledby="home-heading" className="home-hero relative isolate min-h-svh overflow-hidden bg-black text-white">
        <HomeHeroBackground />
        <div className="mx-auto grid min-h-svh w-full max-w-[1600px] content-center gap-10 px-5 pb-16 pt-28 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(180px,1fr)_minmax(0,700px)_minmax(180px,1fr)] lg:content-stretch lg:items-center lg:gap-6 lg:px-12 lg:pb-14 lg:pt-28">
          <div id="home-content" className="mx-auto w-full max-w-[700px] text-center lg:col-start-2 lg:row-start-1">
            <p className="mb-4 text-sm leading-5">UTMIST</p>
            <h1 id="home-heading" className="text-[clamp(2rem,8.8vw,3rem)] leading-[1.08] tracking-[-0.04em] lg:text-[clamp(1.8rem,3.33vw,3rem)] lg:leading-[0.98]">
              <span className="lg:block">North America’s Largest</span>{" "}
              <span className="lg:block">Undergraduate{" "}<span className="whitespace-nowrap"><span aria-hidden="true" className="mx-1 inline-flex size-[0.75em] translate-y-[-0.05em] items-center justify-center rounded-full border border-white/50 bg-[var(--home-blue)] align-middle"><Image src={logo} alt="" width={24} height={24} className="size-[65%] brightness-0 invert" /></span>Machine</span></span>{" "}
              <span className="lg:block">Learning Club</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[340px] text-base leading-relaxed text-white/95 lg:mt-7 lg:max-w-[320px] lg:text-[15px] lg:leading-[1.4]">Where students learn, build, research,<br className="hidden sm:block" /> and lead at the <span className="home-hero-highlight">University of Toronto.</span></p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <PillLink href="/careers" light arrow="plain" className="border-[var(--home-cyan)] bg-white/15">Join Us</PillLink>
              <PillLink href="mailto:utorontomist@gmail.com" light variant="link" arrow="diagonal">Contact Us</PillLink>
            </div>
          </div>
          <dl className="home-hero-statistics mx-auto grid w-full max-w-[640px] grid-cols-3 gap-4 lg:col-start-1 lg:row-start-1 lg:max-w-none lg:grid-cols-1 lg:gap-7 lg:self-end">
            {impact.statistics.slice(0, 3).map((stat) => (
              <div key={stat.description} className="home-stat-marker relative flex flex-col items-center text-center lg:max-w-[190px] lg:items-start lg:pl-6 lg:text-left">
                <dt className="order-2 mt-2 text-xs leading-4 text-white/85">{stat.description}</dt>
                <dd className="home-stat-number text-[clamp(2rem,4.5vw,4rem)] leading-none tracking-[-0.06em]">{stat.number}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="sponsor-heading" className="mx-auto max-w-[1800px] px-5 pt-14 sm:px-6 lg:px-12 lg:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)] lg:gap-12 xl:gap-16">
          {/* Offset the decorative bottom row so the copy aligns with the logos. */}
          <div data-home-reveal className="home-sponsor-copy mx-auto w-full max-w-xl text-center lg:order-last lg:mx-0 lg:pb-[23%] lg:text-left">
            <p className="mb-4 text-base xl:text-lg">Our Sponsors</p>
            <h2 id="sponsor-heading" className="text-[clamp(2rem,3vw,3rem)] leading-[1.06] tracking-[-0.045em]">Scaling machine intelligence, <span className="text-secondary underline decoration-1 underline-offset-[0.12em]">together</span></h2>
            <p className="mb-7 mt-5 text-base leading-relaxed sm:mt-6 sm:text-lg xl:text-xl">We work with leading companies and startups to deliver hands-on projects, events, mentorship, and career pathways for our community</p>
            <PillLink href="/sponsors">Learn more</PillLink>
          </div>
          <SponsorMosaic />
        </div>
        <HomeImpactDashboard impact={impact} />
      </section>

      <section id="about-us" aria-labelledby="about-heading" className="overflow-hidden bg-[var(--home-ink)] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 sm:py-20 md:px-[6%] lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-28">
            <div data-home-reveal className="relative">
              <Image src={execPhoto} alt="UTMIST student team at EigenAI" sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[1.92] w-full rounded-xl object-cover" />
              <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-xs backdrop-blur-sm">Built by students.</span>
            </div>
            <div data-home-reveal>
              <p className="mb-3 text-sm">Who We Are</p>
              <h2 id="about-heading" className="text-3xl leading-[1.1] tracking-[-0.04em] md:text-[34px]">{homeContent.title}</h2>
              <p className="mb-6 mt-5 text-base leading-relaxed text-white/90">{homeContent.about}</p>
              <PillLink href="/projects" light>Our projects</PillLink>
            </div>
          </div>
          <div className="mt-16 grid items-center gap-12 lg:mt-28 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div data-home-reveal className="sm:rounded-3xl sm:border sm:border-[var(--home-lilac)]/30 sm:p-8 lg:p-10">
              <p className="mb-4 text-sm">Our Mission</p>
              <h2 className="text-3xl leading-[1.1] tracking-[-0.04em]">Empower students of <span className="text-[var(--home-lilac)]">all skill levels.</span></h2>
              <p className="mb-7 mt-5 text-base leading-relaxed text-white/90">{homeContent.mission}</p>
              <PillLink href="/careers" light>Join Us</PillLink>
            </div>
            <HomeDisciplineNetwork />
          </div>
        </div>
      </section>

      <section id="home-events" aria-labelledby="events-heading" className="mx-auto max-w-[1440px] overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:px-[8%] lg:py-28">
        <div data-home-reveal className="mx-auto max-w-[620px] text-center">
          <p className="mb-4 text-sm">Our Events</p>
          <h2 id="events-heading" className="text-3xl leading-[1.08] tracking-[-0.045em] md:text-[36px]">A full year of events, built<br className="hidden sm:block" /> entirely by <span className="text-secondary">@utmist</span></h2>
          <p className="mt-6 text-base leading-relaxed md:text-lg">From EigenAI in the fall to GenAI Genesis in the spring, UTMIST runs a full calendar of workshops, hackathons, and conferences, built by students, for students, all year long.</p>
        </div>
        <HomeCommunityStatement />
        <h2 data-home-reveal className="mb-9 text-3xl tracking-[-0.05em] md:text-[38px]">Our <span className="home-selection">flagship</span> events</h2>
        <div data-home-stagger="row" className="grid gap-7 md:grid-cols-2">
          {homeEvents.map((event) => <HomeEventCard key={event.id} event={event} />)}
        </div>
      </section>

      <section aria-labelledby="startups-heading" className="border-y border-border bg-[var(--accent)]/45 px-5 py-14 sm:px-6 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-24">
          <div data-home-reveal>
            <p className="mb-4 text-sm">MISTic R&D</p>
            <h2 id="startups-heading" className="text-4xl leading-[1.05] tracking-[-0.05em] md:text-5xl">Ready to build<br />the future?</h2>
            <p className="my-6 max-w-md text-base leading-relaxed text-muted-foreground">{homeContent.startups}</p>
            <PillLink href="/startups">Learn More</PillLink>
          </div>
          <div data-home-stagger="row" className="grid grid-cols-2 gap-x-6 gap-y-9">
            {[
              ["Funding", "Access to capital and investment opportunities to scale your AI startup"],
              ["Users", "Connect with early adopters and build your user base through our network"],
              ["Cofounders", "Find the perfect cofounder to complement your skills and vision"],
              ["Community", "Join an unstoppable community of builders and innovators"],
            ].map(([title, description]) => <div data-home-reveal key={title} className="border-t border-secondary/30 pt-5"><h3 className="text-xl tracking-tight">{title}</h3><p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p></div>)}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-24 md:grid-cols-[1fr_1.5fr] md:gap-24">
        <div data-home-reveal><p className="mb-4 text-sm">Get to know UTMIST</p><h2 id="faq-heading" className="text-4xl leading-[1.05] tracking-[-0.05em]">Frequently asked questions</h2></div>
        <div>
          {homeFaq.map(({ question, answer }) => (
            <details data-home-reveal key={question} className="group border-b border-border first:border-t">
              <summary className="flex min-h-16 cursor-pointer list-none items-start justify-between gap-5 py-5 text-base"><span>{question}</span><span aria-hidden="true" className="text-2xl leading-5 text-secondary group-open:rotate-45">+</span></summary>
              <p className="pb-5 pr-7 text-base leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </HomeScrollEffects>
  );
}
