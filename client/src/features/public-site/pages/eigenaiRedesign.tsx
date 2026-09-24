import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import {
  founderPanelSpeakers,
  keynoteSpeakers,
  researchPanelSpeakers,
  speakerSession,
} from "@/features/public-site/data/eigenai";
import { EigenAILockup } from "@/features/public-site/components/eigenai-lockup";
import conferencePhoto from "@/assets/photos/eigenai-conference.webp";
import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";
import discordLogo from "@/assets/logos/discord.svg";
import githubLogo from "@/assets/logos/github.svg";
import instagramLogo from "@/assets/logos/instagram.svg";
import linkedinLogo from "@/assets/logos/linkedin.svg";
import xLogo from "@/assets/logos/x.svg";
import closingOrbit from "@/assets/eigenai-redesign/closing-orbit.svg";
import ellipseA from "@/assets/eigenai-redesign/ellipse-a.svg";
import ellipseB from "@/assets/eigenai-redesign/ellipse-b.svg";
import ellipseC from "@/assets/eigenai-redesign/ellipse-c.svg";
import ellipseD from "@/assets/eigenai-redesign/ellipse-d.svg";
import ellipseE from "@/assets/eigenai-redesign/ellipse-e.svg";
import ellipseF from "@/assets/eigenai-redesign/ellipse-f.svg";
import ellipseG from "@/assets/eigenai-redesign/ellipse-g.svg";
import ellipseH from "@/assets/eigenai-redesign/ellipse-h.svg";
import ellipseI from "@/assets/eigenai-redesign/ellipse-i.svg";
import ellipseRingInner from "@/assets/eigenai-redesign/ellipse-ring-inner.svg";
import ellipseRingMiddle from "@/assets/eigenai-redesign/ellipse-ring-middle.svg";
import ellipseRingOuter from "@/assets/eigenai-redesign/ellipse-ring-outer.svg";
import iconCloud from "@/assets/eigenai-redesign/icon-cloud.svg";
import iconGroup from "@/assets/eigenai-redesign/icon-group.svg";
import iconNfc from "@/assets/eigenai-redesign/icon-nfc.svg";
import iconSitemap from "@/assets/eigenai-redesign/icon-sitemap.svg";
import lambdaHeroBack from "@/assets/eigenai-redesign/lambda-hero-back.svg";
import lambdaHeroFront from "@/assets/eigenai-redesign/lambda-hero-front.svg";
import lambdaWorkshopBack from "@/assets/eigenai-redesign/lambda-workshop-back.svg";
import lambdaWorkshopFront from "@/assets/eigenai-redesign/lambda-workshop-front.svg";
import ornamentCluster from "@/assets/eigenai-redesign/ornament-cluster.svg";
import ornamentDiamond from "@/assets/eigenai-redesign/ornament-diamond.svg";
import ornamentRibbon from "@/assets/eigenai-redesign/ornament-ribbon.svg";
import ornamentSpark from "@/assets/eigenai-redesign/ornament-spark.svg";
import ornamentWave from "@/assets/eigenai-redesign/ornament-wave.svg";
import techOrbit from "@/assets/eigenai-redesign/tech-orbit.svg";
import techOrbitContinuation from "@/assets/eigenai-redesign/tech-orbit-continuation.svg";

const currentSpeakers = [
  ...speakerSession,
  ...founderPanelSpeakers,
  ...researchPanelSpeakers,
];

const placeholderSpeakerCopy = [
  {
    name: "Someguy Lastnameem",
    role: "Staff Software Engineer and Manager @ Google",
  },
  {
    name: "Some Guy",
    role: "Data Scientist @ Super Long Company Name",
  },
  {
    name: "Guy With Threenames",
    role: "CEO @ Short",
  },
] as const;

const speakers = currentSpeakers.slice(0, 8).map((speaker, index) => ({
  ...placeholderSpeakerCopy[index % placeholderSpeakerCopy.length],
  profileURL: "",
  profileImage: speaker.profileImage,
}));

const keynoteSpeaker = {
  ...keynoteSpeakers[0],
  name: "Jensen Huang",
  role: "CEO @ NVIDIA",
};

const workshopDescription =
  "An introduction on how to integrate the Claude API into any application, using a chat app as a demonstration. The goal is to introduce fundamental API integration skills including API key access, HTTP request authentication, and JSON response handling. The workshop also covers Claude-specific parameters such as temperature settings, system prompts and multi-turn conversation management.";

type Workshop = {
  title: string;
  host: string;
  description: string;
  image?: StaticImageData;
};

const workshops: Workshop[] = Array.from({ length: 3 }, () => ({
  title: "Building Applications with the Claude API",
  host: "",
  description: workshopDescription,
}));

const socialLinks = [
  {
    href: "https://www.instagram.com/uoft_utmist/",
    label: "Instagram",
    icon: instagramLogo,
  },
  {
    href: "https://www.linkedin.com/company/utmist/",
    label: "LinkedIn",
    icon: linkedinLogo,
  },
  {
    href: "https://discord.com/invite/88mSPw8",
    label: "Discord",
    icon: discordLogo,
  },
  {
    href: "https://github.com/UTMIST",
    label: "GitHub",
    icon: githubLogo,
  },
  {
    href: "https://x.com/utmist1",
    label: "X",
    icon: xLogo,
  },
];

const eigenNavigationLinks = [
  { href: "/#about-us", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Event" },
  { href: "/sponsors", label: "Sponsors" },
];

type Speaker = {
  name: string;
  role: string;
  profileURL: string;
  profileImage: StaticImageData;
};

function BackgroundGlassIcon({
  src,
  className,
  large = false,
}: {
  src: StaticImageData;
  className: string;
  large?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`eigenai-background-glass-orb absolute hidden items-center justify-center rounded-full md:flex ${
        large ? "size-8" : "size-6"
      } ${className}`}
    >
      <Image src={src} alt="" className="eigenai-background-icon" />
    </div>
  );
}

function ContinuousBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0c0249]" />

      <Image
        src={ellipseC}
        alt=""
        className="eigenai-background-bloom absolute -top-200 left-[12%] max-w-none opacity-95"
      />
      <Image
        src={ellipseA}
        alt=""
        className="eigenai-background-bloom absolute -left-208 top-112 max-w-none"
      />
      <Image
        src={ellipseB}
        alt=""
        className="eigenai-background-bloom absolute left-28 top-132 max-w-none"
      />
      <Image
        src={ellipseD}
        alt=""
        className="eigenai-background-bloom absolute -right-312 top-280 max-w-none"
      />
      <Image
        src={ellipseF}
        alt=""
        className="eigenai-background-bloom absolute -left-120 top-368 max-w-none"
      />
      <Image
        src={ellipseE}
        alt=""
        className="eigenai-background-bloom absolute -right-24 top-388 max-w-none"
      />
      <Image
        src={ellipseI}
        alt=""
        className="eigenai-background-bloom absolute -left-120 top-688 max-w-none"
      />
      <Image
        src={ellipseC}
        alt=""
        className="eigenai-background-bloom absolute -right-260 top-768 max-w-none"
      />
      <Image
        src={ellipseA}
        alt=""
        className="eigenai-background-bloom absolute -left-184 top-1040 max-w-none"
      />
      <Image
        src={ellipseD}
        alt=""
        className="eigenai-background-bloom absolute -right-288 top-1280 max-w-none"
      />
      <Image
        src={ellipseB}
        alt=""
        className="eigenai-background-bloom absolute -left-128 top-1528 max-w-none"
      />

      <Image
        src={ellipseRingOuter}
        alt=""
        className="eigenai-background-orbit absolute -left-76 top-160 max-w-none opacity-90"
      />
      <Image
        src={ellipseRingMiddle}
        alt=""
        className="eigenai-background-orbit absolute -left-48 top-188 max-w-none opacity-90"
      />
      <Image
        src={ellipseRingInner}
        alt=""
        className="eigenai-background-orbit absolute -left-40 top-176 max-w-none opacity-90"
      />
      <Image
        src={ellipseG}
        alt=""
        className="eigenai-background-orbit absolute -right-36 top-492 max-w-none"
      />
      <Image
        src={ellipseH}
        alt=""
        className="eigenai-background-orbit absolute -right-96 top-872 max-w-none"
      />
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="eigenai-section-heading eigenai-serif text-[clamp(2.5rem,6vw,4rem)] font-normal leading-tight text-transparent">
      {children}
    </h2>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="eigenai-serif text-[clamp(3rem,8vw,6rem)] leading-none text-white">
        {value}
      </p>
      <p className="eigenai-sans mt-2 text-base/tight font-semibold text-white sm:text-xl lg:text-2xl">
        {label}
      </p>
    </div>
  );
}

function GradientPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`eigenai-glass-panel rounded-4xl sm:rounded-[3.1648rem] ${className}`}
    >
      <div className="relative z-1 h-full rounded-[inherit]">{children}</div>
    </div>
  );
}

function ContentContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-testid="eigenai-content"
      className={`relative z-10 mx-auto w-full max-w-6xl ${className}`}
    >
      {children}
    </div>
  );
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <GradientPanel className="mt-24 min-h-64">
      <article className="relative flex min-h-64 min-w-0 flex-col px-6 pb-6 pt-20 sm:px-8">
        <div className="eigenai-speaker-portrait absolute left-1/2 top-0 size-32 -translate-x-1/2 translate-y-[-55%] rounded-full p-0.5 sm:size-40">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0c0249]">
            <Image
              src={speaker.profileImage}
              alt={`${speaker.name}, ${speaker.role}`}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              className="object-cover"
            />
          </div>
        </div>
        <h3 className="eigenai-sans text-xl/tight font-semibold text-white sm:text-2xl">
          {speaker.name}
        </h3>
        <p className="mt-3 text-sm/relaxed tracking-[0.01em] wrap-anywhere text-[#5edbe7] sm:text-base">
          {speaker.role}
        </p>
      </article>
    </GradientPanel>
  );
}

function KeynoteCard({ speaker }: { speaker: Speaker }) {
  return (
    <GradientPanel className="min-h-52">
      <article className="relative grid min-h-52 min-w-0 items-center gap-8 px-7 py-8 sm:px-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="order-2 min-w-0 md:order-1">
          <p className="bg-[linear-gradient(90deg,#5edbe7_26.442%,#ffffff_55.769%,#f1dcff_79.327%)] bg-clip-text text-base tracking-[0.01em] text-transparent sm:text-lg">
            Keynote Speaker
          </p>
          <h3 className="eigenai-sans mt-1 text-2xl/tight font-semibold text-white sm:text-3xl">
            {speaker.name}
          </h3>
          <p className="mt-3 text-base tracking-[0.01em] text-[#5edbe7] sm:text-lg">
            {speaker.role}
          </p>
        </div>
        <div className="eigenai-speaker-portrait relative order-1 mx-auto size-40 rounded-full p-0.5 sm:size-52 md:order-2">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0c0249]">
            <Image
              src={speaker.profileImage}
              alt={`${speaker.name}, ${speaker.role}`}
              fill
              sizes="(max-width: 640px) 160px, 208px"
              className="object-cover"
            />
          </div>
        </div>
      </article>
    </GradientPanel>
  );
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
    <GradientPanel>
      <article className="grid min-h-72 min-w-0 gap-6 px-6 py-8 sm:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="eigenai-sans max-w-3xl text-2xl/tight font-semibold text-white sm:text-3xl">
              {workshop.title}
            </h3>
            {workshop.image ? (
              <span className="relative block h-9 w-24 overflow-hidden rounded-md bg-white p-1">
                <Image
                  src={workshop.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain p-1"
                />
              </span>
            ) : null}
          </div>
          {workshop.host ? (
            <p className="mt-3 text-sm font-normal tracking-[0.01em] text-[#5edbe7] sm:text-base">
              {workshop.host}
            </p>
          ) : null}
          <p className="mt-6 max-w-3xl text-base/relaxed tracking-[-0.01em] text-white sm:text-lg">
            {workshop.description}
          </p>
        </div>
      </article>
    </GradientPanel>
  );
}

function EigenNavigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        aria-label="EigenAI"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4"
      >
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center gap-2.5"
          aria-label="UTMIST home"
        >
          <Image
            src={utmistWordmark}
            alt="UTMIST"
            width={112}
            height={34}
            className="h-auto w-23 sm:w-28"
          />
        </Link>

        <div className="eigenai-liquid-glass hidden items-center rounded-full px-12 py-3 md:flex">
          <ul className="relative z-10 flex items-center gap-7">
            {eigenNavigationLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm tracking-[0.04em] text-white/75 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/auth"
          className="relative z-10 shrink-0 rounded-[3.165rem] border-[1.582px] border-[#59e0e9] bg-transparent px-5 py-2 text-xs font-normal tracking-[0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_24px_rgba(89,224,233,0.14)] backdrop-blur-xl transition hover:border-white hover:bg-white/10 sm:px-8 sm:text-sm"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}

function EigenFooter() {
  return (
    <footer className="relative z-10 flex min-h-80 items-center justify-center bg-white/30 px-5 py-12">
      <ContentContainer className="flex flex-col items-center text-center">
        <Link
          href="/"
          className="relative z-10 flex items-center gap-3"
          aria-label="UTMIST home"
        >
          <Image
            src={utmistWordmark}
            alt="UTMIST"
            width={332}
            height={101}
            className="h-auto w-[min(14rem,70vw)]"
          />
        </Link>

        <ul className="relative z-10 mt-7 flex flex-wrap justify-center gap-4 sm:gap-6">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`UTMIST on ${social.label}`}
                className="eigenai-liquid-orb flex size-11 items-center justify-center rounded-full transition hover:-translate-y-1"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 brightness-0 invert"
                />
              </a>
            </li>
          ))}
        </ul>
      </ContentContainer>
    </footer>
  );
}

export default function EigenAIRedesign() {
  return (
    <main
      data-testid="eigenai-redesign"
      className="eigenai-redesign relative isolate overflow-hidden bg-[#0c0249] text-white"
    >
      <ContinuousBackdrop />
      <EigenNavigation />
      <section className="relative flex min-h-192 items-center justify-center overflow-hidden px-5 pb-20 pt-32 sm:min-h-216 sm:px-10 sm:pb-24 sm:pt-36">
        <div
          aria-hidden="true"
          className="absolute left-[3.25%] top-[52%] hidden md:block"
        >
          <Image
            src={lambdaHeroBack}
            alt=""
            className="eigenai-background-lambda-back size-auto"
          />
          <Image
            src={lambdaHeroFront}
            alt=""
            className="eigenai-background-lambda-front absolute left-px top-[-0.26rem] size-auto"
          />
        </div>
        <BackgroundGlassIcon
          src={iconGroup}
          className="left-[24.85%] top-[62.84%]"
        />
        <BackgroundGlassIcon
          src={iconSitemap}
          className="left-[2.01%] top-[72.95%]"
        />
        <BackgroundGlassIcon
          src={iconCloud}
          className="right-[2.5%] top-3/5 -rotate-30 -scale-y-100"
          large
        />
        <BackgroundGlassIcon src={iconNfc} className="right-[6.8%] top-1/5" />
        <Image
          src={ornamentWave}
          alt=""
          className="eigenai-background-linework absolute left-[1%] top-[62%] hidden md:block"
        />
        <Image
          src={ornamentDiamond}
          alt=""
          className="eigenai-background-linework absolute left-[33%] top-[82%] hidden size-auto md:block"
        />
        <Image
          src={ornamentRibbon}
          alt=""
          className="eigenai-background-linework absolute -left-8 top-9/10 hidden md:block"
        />
        <Image
          src={ornamentSpark}
          alt=""
          className="eigenai-background-linework absolute left-[36.7%] top-[91.3%] hidden size-auto md:block"
        />
        <Image
          src={ornamentCluster}
          alt=""
          className="eigenai-background-glass-art absolute right-[28.1%] top-[54.5%] hidden md:block"
        />
        <ContentContainer className="flex -translate-y-4 flex-col items-center">
          <EigenAILockup fontSize="clamp(4rem, 10vw, 7rem)" />
          <div className="eigenai-glass-panel relative mt-10 flex min-h-11 w-fit max-w-full items-center justify-center rounded-full px-5 py-2 text-sm/snug font-normal tracking-[-0.01em] text-white sm:px-8 sm:text-base">
            <span className="relative z-1 text-center sm:whitespace-nowrap">
              October 3rd &amp; 4th @ LOCAT
            </span>
          </div>
        </ContentContainer>
      </section>

      <section
        id="about"
        className="relative px-5 py-24 sm:px-10 sm:pb-28 sm:pt-8"
      >
        <ContentContainer>
          <div
            data-testid="eigenai-metrics"
            className="grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0"
          >
            <Metric value="500+" label="Attendees" />
            <Metric value="20" label="Speakers" />
            <Metric value="11" label="Workshops" />
          </div>

          <div className="mt-20 sm:mt-28">
            <SectionHeading>What is eigenai?</SectionHeading>
            <div className="mt-12 grid items-start justify-between gap-10 md:grid-cols-[minmax(16rem,24rem)_minmax(0,36rem)] lg:gap-16">
              <GradientPanel className="min-h-80 overflow-hidden sm:min-h-136">
                <div className="relative min-h-80 overflow-hidden rounded-[inherit] sm:min-h-136">
                  <Image
                    src={conferencePhoto}
                    alt="Students attending an EigenAI conference session"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-70 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_68%,rgba(89,224,233,0.42),transparent_36%),linear-gradient(to_top,rgba(12,2,73,0.82),transparent_68%)]" />
                </div>
              </GradientPanel>
              <div className="max-w-2xl text-base/relaxed tracking-[-0.01em] text-white sm:text-lg">
                <p>
                  EigenAI is a UTMIST flagship conference introducing students
                  to the world of AI, ML, software, and emerging technologies.
                  Through panels and workshops covering both fundamental and
                  advanced topics, participants gain hands-on experience and
                  practical insights.
                </p>
                <p className="mt-7">
                  This year’s theme is Mapping AI through the Multiverse, which
                  invites students to journey through the many dimensions of AI,
                  allowing them to explore the field from multiple perspectives
                  and hear from professionals across diverse industries. Beyond
                  technical talks and workshops, students have the opportunity
                  to build their professional network and connect with industry
                  leaders, academic professionals, and like-minded peers.
                </p>
              </div>
            </div>
          </div>
        </ContentContainer>
      </section>

      <section
        id="speakers"
        className="relative px-5 py-24 sm:px-10 sm:pb-32 sm:pt-20"
      >
        <ContentContainer>
          <SectionHeading>Speakers</SectionHeading>
          <div className="mt-12">
            <KeynoteCard speaker={keynoteSpeaker} />
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker, index) => (
              <SpeakerCard key={`${speaker.name}-${index}`} speaker={speaker} />
            ))}
          </div>
        </ContentContainer>
      </section>

      <section
        id="workshops"
        className="relative overflow-hidden px-5 py-24 sm:px-10 sm:py-32"
      >
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 hidden md:block"
        >
          <Image
            src={lambdaWorkshopBack}
            alt=""
            className="eigenai-background-lambda-back size-auto"
          />
          <Image
            src={lambdaWorkshopFront}
            alt=""
            className="eigenai-background-lambda-front absolute left-px top-[-0.36rem] size-auto"
          />
        </div>
        <Image
          src={techOrbit}
          alt=""
          className="eigenai-background-orbit absolute -right-128 -top-40 hidden -rotate-30 -scale-y-100 lg:block"
        />
        <Image
          src={techOrbitContinuation}
          alt=""
          className="eigenai-background-orbit absolute -right-128 top-196 hidden -rotate-30 -scale-y-100 lg:block"
        />
        <ContentContainer>
          <SectionHeading>Workshops</SectionHeading>
          <div className="mt-12 space-y-8 sm:space-y-12">
            {workshops.map((workshop, index) => (
              <WorkshopCard
                key={`${workshop.title}-${index}`}
                workshop={workshop}
              />
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="relative flex min-h-192 items-center justify-center overflow-hidden px-5 py-24 text-center sm:px-10 sm:py-32">
        <Image
          src={closingOrbit}
          alt=""
          className="eigenai-background-orbit absolute left-1/2 top-92 hidden -translate-x-1/2 -rotate-130 -scale-y-100 md:block"
        />
        <ContentContainer>
          <p className="eigenai-closing-copy eigenai-body mx-auto max-w-4xl text-[clamp(2.5rem,6vw,4rem)] font-normal italic leading-tight tracking-[0.01em] text-transparent">
            Across the Many
            <br />
            Frontiers of AI
          </p>
          <div className="mt-20 sm:mt-24">
            <EigenAILockup fontSize="clamp(3rem, 8vw, 5rem)" />
          </div>
        </ContentContainer>
      </section>

      <EigenFooter />
    </main>
  );
}
