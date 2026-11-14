import Image from "next/image";

import { ContentContainer, PillLink, Section, SectionIntro } from "@/shared/ui";
import { readHomePage } from "@/features/public-site/lib/home-page";
import { pageEvent } from "@/features/public-site/data/home-events";
import HomeCopy from "@/features/public-site/components/home-copy";
import HomeHeroBackground from "@/features/public-site/components/home-hero-background";
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
  const { hero, about, impact, mission, sponsors, events, startups, faq } = await readHomePage();

  return (
    <HomeScrollEffects>
      <a href="#home-content" className="sr-only z-50 rounded-full bg-white px-5 py-3 text-secondary focus:not-sr-only focus:fixed focus:left-6 focus:top-6">Skip to content</a>
      <section data-ui-tone="dark" aria-labelledby="home-heading" className="home-hero home-dark relative isolate min-h-svh overflow-hidden bg-black">
        <HomeHeroBackground />
        <ContentContainer className="grid min-h-svh content-center gap-10 pb-16 pt-28 sm:gap-12 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(140px,1fr)_minmax(0,760px)_minmax(140px,1fr)] lg:content-stretch lg:items-center lg:gap-8 lg:pb-14 lg:pt-28">
          <div id="home-content" className="mx-auto w-full max-w-[760px] text-center lg:col-start-2 lg:row-start-1">
            <p className="home-body mx-auto mb-5 max-w-xl">
              {hero.eyebrow}
            </p>
            <h1 id="home-heading" className="font-medium text-[clamp(2rem,8.5vw,3.75rem)] leading-[1.05] tracking-[-0.045em] lg:text-[clamp(3rem,4.5vw,4.5rem)]">
              {hero.heading.split("\n").map((line, index) => <span className="block" key={index}>{line}{" "}</span>)}
            </h1>
            <p className="ui-section-copy mx-auto mt-7 max-w-md">
              <HomeCopy text={hero.description} highlight="University of Toronto." accent />
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {hero.links.map((link, index) => <PillLink key={index} href={link.href} tone="dark">{link.label}</PillLink>)}
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
            label={about.eyebrow} title={about.heading} description={about.description}>
            <PillLink href={about.cta.href}>{about.cta.label}</PillLink>
          </SectionIntro>
          <figure data-home-reveal className="home-about-photo w-full">
            {/* Anchor the crop to the floor: only excess ceiling is removed. */}
            <Image src={execPhoto} alt={about.imageAlt} sizes="(min-width: 1280px) 552px, (min-width: 1024px) calc((100vw - 176px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" className="aspect-[12/7] w-full rounded-xl object-cover object-bottom" />
            <figcaption className="home-caption mt-3">{about.caption}</figcaption>
          </figure>
        </ContentContainer>
        <ContentContainer>
          <HomeImpactTiles impact={impact} />
        </ContentContainer>
        <section id="home-mission" aria-labelledby="mission-heading" data-ui-tone="dark" className="home-mission home-dark py-[var(--ui-section-gap)]">
          <ContentContainer className="grid items-center gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <SectionIntro data-home-reveal className="max-w-xl" headingId="mission-heading" label={mission.eyebrow}
              title={<HomeCopy text={mission.heading} highlight="all skill levels." />}
              description={mission.description}>
              <PillLink href={mission.cta.href} tone="dark">{mission.cta.label}</PillLink>
            </SectionIntro>
            <HomeDisciplineNetwork />
          </ContentContainer>
        </section>
      </section>

      <Section aria-labelledby="sponsor-heading">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)] lg:gap-12 xl:gap-16">
          <SectionIntro data-home-reveal align="center" headingId="sponsor-heading" label={sponsors.eyebrow}
            className="home-sponsor-copy mx-auto w-full max-w-xl lg:order-last lg:mx-0 lg:text-left"
            title={<HomeCopy text={sponsors.heading} highlight="together" />}
            description={sponsors.description}>
            <PillLink href={sponsors.cta.href}>{sponsors.cta.label}</PillLink>
          </SectionIntro>
          <SponsorMosaic sponsors={sponsors.items} />
        </div>
      </Section>

      <Section id="home-events" aria-labelledby="events-heading" className="overflow-hidden">
        <SectionIntro data-home-reveal align="center" headingId="events-heading" label={events.eyebrow}
          className="mx-auto max-w-[620px]"
          title={<HomeCopy text={events.heading} highlight="@utmist" accent />}
          description={events.description} />
        <HomeCommunityStatement text={events.communityStatement} />
        <h2 data-home-reveal className="ui-section-heading mb-9"><HomeCopy text={events.listHeading} highlight="flagship" /></h2>
        <div data-home-stagger="row" className="grid gap-7 md:grid-cols-2">
          {events.items.map((event, index) => <HomeEventCard key={event.id ?? index} event={pageEvent(event)} />)}
        </div>
      </Section>

      <Section variant="tinted" aria-labelledby="startups-heading" contentClassName="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <SectionIntro data-home-reveal headingId="startups-heading" label={startups.eyebrow} className="max-w-md"
          title={<HomeCopy text={startups.heading} />} description={startups.description}>
          <PillLink href={startups.cta.href}>{startups.cta.label}</PillLink>
        </SectionIntro>
        <div data-home-stagger="row" className="grid grid-cols-1 gap-x-6 gap-y-9 min-[375px]:grid-cols-2">
          {startups.benefits.map(({title, description}) => <div data-home-reveal key={title} className="border-t border-border pt-5"><h3 className="home-card-heading">{title}</h3><p className="home-body mt-3">{description}</p></div>)}
        </div>
      </Section>

      <Section aria-labelledby="faq-heading" contentClassName="grid gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <SectionIntro data-home-reveal headingId="faq-heading" label={faq.eyebrow} title={faq.heading} />
        <div>
          {faq.items.map(({ question, answer }) => (
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
