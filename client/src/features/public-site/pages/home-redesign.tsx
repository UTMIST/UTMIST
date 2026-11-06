import Image from "next/image";

import { ContentContainer, PillLink, Section, SectionIntro } from "@/shared/ui";
import { homeContent, homeRedesignContent } from "@/features/public-site/data/home-content";
import { homeEvents } from "@/features/public-site/data/home-events";
import { homeFaq } from "@/features/public-site/data/home-faq";
import { readHomeImpact } from "@/features/public-site/lib/home-impact";
import HeroLightBackground from "@/features/public-site/components/hero-light-background";
import HomeImpactTiles from "@/features/public-site/components/home-impact-tiles";
import HomeDisciplineNetwork from "@/features/public-site/components/home-discipline-network";
import HomeEventCard from "@/features/public-site/components/home-event-card";
import HomeCommunityStatement from "@/features/public-site/components/home-community-statement";
import SponsorMosaic from "@/features/public-site/components/sponsor-mosaic";
import HomeScrollEffects from "@/features/public-site/components/home-scroll-effects";
import execPhoto from "@/assets/photos/eigenai-exec-photo.webp";
import "@/styles/gradients.css";
import "@/features/public-site/styles/home-redesign.css";

export default async function RedesignedHome() {
  const impact = await readHomeImpact();

  return (
    <HomeScrollEffects>
      <a href="#home-content" className="sr-only z-50 rounded-full bg-white px-5 py-3 text-secondary focus:not-sr-only focus:fixed focus:left-6 focus:top-6">Skip to content</a>
      <section data-ui-tone="dark" aria-labelledby="home-heading" className="home-hero home-dark relative isolate min-h-svh overflow-hidden bg-black">
        <HeroLightBackground />
        <ContentContainer className="grid min-h-svh content-center gap-10 pb-16 pt-28 sm:gap-12 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(140px,1fr)_minmax(0,760px)_minmax(140px,1fr)] lg:content-stretch lg:items-center lg:gap-8 lg:pb-14 lg:pt-28">
          <div id="home-content" className="mx-auto w-full max-w-[760px] text-center lg:col-start-2 lg:row-start-1">
            <p className="home-body mx-auto mb-5 max-w-xl">
              North America’s Largest Undergraduate Machine Learning Club
            </p>
            <h1 id="home-heading" className="font-medium text-[clamp(2rem,8.5vw,3.75rem)] leading-[1.05] tracking-[-0.045em] lg:text-[clamp(3rem,4.5vw,4.5rem)]">
              <span className="block">University of Toronto</span>{" "}
              <span className="block">Machine Intelligence</span>{" "}
              <span className="block">Student Team</span>
            </h1>
            <p className="ui-section-copy mx-auto mt-7 max-w-md">
              Where students learn, build, research,<br className="hidden sm:block" /> and lead at the <span className="home-accent">University of Toronto.</span>
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <PillLink href="/careers" tone="dark">Join us</PillLink>
              <PillLink href="mailto:utorontomist@gmail.com" tone="dark">Contact us</PillLink>
            </div>
          </div>
          <dl className="home-hero-statistics mx-auto grid w-full max-w-[640px] grid-cols-3 gap-4 lg:col-start-1 lg:row-start-1 lg:max-w-none lg:grid-cols-1 lg:gap-7 lg:self-end">
            {impact.statistics.slice(0, 3).map((stat) => (
              <div key={stat.description} className="home-stat-marker relative flex flex-col items-center text-center lg:max-w-[190px] lg:items-start lg:pl-6 lg:text-left">
                <dt className="home-caption order-2 mt-2">{stat.description}</dt>
                <dd className="home-stat-number text-[clamp(2rem,3.2vw,3rem)] leading-none tracking-[-0.06em]">{stat.number}</dd>
              </div>
            ))}
          </dl>
        </ContentContainer>
      </section>

      <section id="about-us" aria-labelledby="about-heading" data-ui-tone="light" className="home-about overflow-hidden bg-background pt-[var(--ui-section-gap)]">
        <ContentContainer className="home-about-intro grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionIntro data-home-reveal className="max-w-lg" headingId="about-heading"
            label="Who we are" title={homeContent.title} description={homeRedesignContent.about}>
            <PillLink href="/projects">Our projects</PillLink>
          </SectionIntro>
          <figure data-home-reveal className="home-about-photo w-full">
            {/* Anchor the crop to the floor: only excess ceiling is removed. */}
            <Image src={execPhoto} alt="UTMIST student team at EigenAI" sizes="(min-width: 1280px) 552px, (min-width: 1024px) calc((100vw - 176px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" className="aspect-[12/7] w-full rounded-xl object-cover object-bottom" />
            <figcaption className="home-caption mt-3">The UTMIST team at EigenAI</figcaption>
          </figure>
        </ContentContainer>
        <ContentContainer>
          <HomeImpactTiles impact={impact} />
        </ContentContainer>
        <section id="home-mission" aria-labelledby="mission-heading" data-ui-tone="dark" className="home-mission home-dark py-[var(--ui-section-gap)]">
          <ContentContainer className="grid items-center gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <SectionIntro data-home-reveal className="max-w-xl" headingId="mission-heading" label="Our mission"
              title={<>Empower students of <span className="home-selection">all skill levels.</span></>}
              description={homeRedesignContent.mission}>
              <PillLink href="/careers" tone="dark">Join us</PillLink>
            </SectionIntro>
            <HomeDisciplineNetwork />
          </ContentContainer>
        </section>
      </section>

      <Section aria-labelledby="sponsor-heading">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)] lg:gap-12 xl:gap-16">
          <SectionIntro data-home-reveal align="center" headingId="sponsor-heading" label="Our sponsors"
            className="home-sponsor-copy mx-auto w-full max-w-xl lg:order-last lg:mx-0 lg:text-left"
            title={<>Scaling machine intelligence, <span className="home-selection">together</span></>}
            description="We work with leading companies and startups to deliver hands-on projects, events, mentorship, and career pathways for our community">
            <PillLink href="/sponsors">Learn more</PillLink>
          </SectionIntro>
          <SponsorMosaic />
        </div>
      </Section>

      <Section id="home-events" aria-labelledby="events-heading" className="overflow-hidden">
        <SectionIntro data-home-reveal align="center" headingId="events-heading" label="Our events"
          className="mx-auto max-w-[620px]"
          title={<>A full year of events, built<br className="hidden sm:block" /> entirely by <span className="home-accent">@utmist</span></>}
          description="From EigenAI in the fall to GenAI Genesis in the spring, UTMIST runs a full calendar of workshops, hackathons, and conferences, built by students, for students, all year long." />
        <HomeCommunityStatement />
        <h2 data-home-reveal className="ui-section-heading mb-9">Our <span className="home-selection">flagship</span> events</h2>
        <div data-home-stagger="row" className="grid gap-7 md:grid-cols-2">
          {homeEvents.map((event) => <HomeEventCard key={event.id} event={event} />)}
        </div>
      </Section>

      <Section variant="tinted" aria-labelledby="startups-heading" contentClassName="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <SectionIntro data-home-reveal headingId="startups-heading" label="MISTic R&D" className="max-w-md"
          title={<>Ready to build<br />the future?</>} description={homeContent.startups}>
          <PillLink href="/startups">Learn more</PillLink>
        </SectionIntro>
        <div data-home-stagger="row" className="grid grid-cols-1 gap-x-6 gap-y-9 min-[375px]:grid-cols-2">
          {[
            ["Funding", "Access to capital and investment opportunities to scale your AI startup"],
            ["Users", "Connect with early adopters and build your user base through our network"],
            ["Cofounders", "Find the perfect cofounder to complement your skills and vision"],
            ["Community", "Join an unstoppable community of builders and innovators"],
          ].map(([title, description]) => <div data-home-reveal key={title} className="border-t border-border pt-5"><h3 className="home-card-heading">{title}</h3><p className="home-body mt-3">{description}</p></div>)}
        </div>
      </Section>

      <Section aria-labelledby="faq-heading" contentClassName="grid gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <SectionIntro data-home-reveal headingId="faq-heading" label="Get to know UTMIST" title="Frequently asked questions" />
        <div>
          {homeFaq.map(({ question, answer }) => (
            <details data-home-reveal key={question} className="group border-b border-border first:border-t">
              <summary className="home-faq-question flex min-h-16 cursor-pointer list-none items-start justify-between gap-5 py-5"><span>{question}</span><span aria-hidden="true" className="text-2xl leading-5 text-secondary group-open:rotate-45">+</span></summary>
              <p className="home-body pb-5 pr-7">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </HomeScrollEffects>
  );
}
