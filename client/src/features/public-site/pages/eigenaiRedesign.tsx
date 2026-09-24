import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import {
  founderPanelSpeakers,
  keynoteSpeakers,
  researchPanelSpeakers,
  speakerSession,
} from "@/features/public-site/data/eigenai";
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
        large ? "size-[2.481rem]" : "h-[1.985rem] w-[2.03rem]"
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
        className="eigenai-background-bloom absolute left-[12%] top-[-50rem] max-w-none opacity-95"
      />
      <Image
        src={ellipseA}
        alt=""
        className="eigenai-background-bloom absolute left-[-52rem] top-[28rem] max-w-none"
      />
      <Image
        src={ellipseB}
        alt=""
        className="eigenai-background-bloom absolute left-[7rem] top-[33rem] max-w-none"
      />
      <Image
        src={ellipseD}
        alt=""
        className="eigenai-background-bloom absolute right-[-78rem] top-[70rem] max-w-none"
      />
      <Image
        src={ellipseF}
        alt=""
        className="eigenai-background-bloom absolute left-[-30rem] top-[92rem] max-w-none"
      />
      <Image
        src={ellipseE}
        alt=""
        className="eigenai-background-bloom absolute right-[-6rem] top-[97rem] max-w-none"
      />
      <Image
        src={ellipseI}
        alt=""
        className="eigenai-background-bloom absolute left-[-30rem] top-[172rem] max-w-none"
      />
      <Image
        src={ellipseC}
        alt=""
        className="eigenai-background-bloom absolute right-[-65rem] top-[192rem] max-w-none"
      />
      <Image
        src={ellipseA}
        alt=""
        className="eigenai-background-bloom absolute left-[-46rem] top-[260rem] max-w-none"
      />
      <Image
        src={ellipseD}
        alt=""
        className="eigenai-background-bloom absolute right-[-72rem] top-[320rem] max-w-none"
      />
      <Image
        src={ellipseB}
        alt=""
        className="eigenai-background-bloom absolute left-[-32rem] top-[382rem] max-w-none"
      />

      <Image
        src={ellipseRingOuter}
        alt=""
        className="eigenai-background-orbit absolute left-[-19rem] top-[40rem] max-w-none opacity-90"
      />
      <Image
        src={ellipseRingMiddle}
        alt=""
        className="eigenai-background-orbit absolute left-[-12rem] top-[47rem] max-w-none opacity-90"
      />
      <Image
        src={ellipseRingInner}
        alt=""
        className="eigenai-background-orbit absolute left-[-10rem] top-[44rem] max-w-none opacity-90"
      />
      <Image
        src={ellipseG}
        alt=""
        className="eigenai-background-orbit absolute right-[-9rem] top-[123rem] max-w-none"
      />
      <Image
        src={ellipseH}
        alt=""
        className="eigenai-background-orbit absolute right-[-24rem] top-[218rem] max-w-none"
      />
    </div>
  );
}

function EigenLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <Image
        src={utmistWordmark}
        alt="UTMIST"
        width={compact ? 166 : 212}
        height={compact ? 51 : 65}
        className="mb-3 h-auto sm:mb-5"
      />
      <div
        className={`eigenai-lockup ${
          compact
            ? "text-[clamp(4.5rem,13vw,8rem)]"
            : "text-[clamp(5.5rem,17vw,10.8028rem)]"
        }`}
      >
        <div className="eigenai-wordmark eigenai-serif">
          <span className="eigenai-wordmark__base">eigenai</span>
          <span aria-hidden="true" className="eigenai-wordmark__depth">
            eigenai
          </span>
          <span aria-hidden="true" className="eigenai-wordmark__shine">
            eigenai
          </span>
          <span aria-hidden="true" className="eigenai-wordmark__glint">
            eigenai
          </span>
        </div>
        <p className="eigenai-lockup-subtitle eigenai-sans">CONFERENCE ’26</p>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="eigenai-section-heading eigenai-serif text-[clamp(3.5rem,9vw,6.25rem)] font-normal leading-[1.37] text-transparent">
      {children}
    </h2>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="eigenai-serif text-[clamp(4rem,12vw,10.8028rem)] leading-none text-white">
        {value}
      </p>
      <p className="eigenai-sans mt-1 text-lg font-semibold leading-[1.0417] text-white sm:text-3xl lg:text-5xl">
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
      className={`eigenai-glass-panel rounded-[2rem] sm:rounded-[3.1648rem] ${className}`}
    >
      <div className="relative z-[1] h-full rounded-[inherit]">{children}</div>
    </div>
  );
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <GradientPanel className="mt-[7.7rem] h-[20.25rem]">
      <article className="relative flex h-full flex-col px-[2.4rem] pb-8 pt-[6.25rem]">
        <div className="eigenai-speaker-portrait absolute left-1/2 top-0 size-40 -translate-x-1/2 -translate-y-[60%] rounded-full p-[2px] sm:size-[12.756rem]">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0c0249]">
            <Image
              src={speaker.profileImage}
              alt={`${speaker.name}, ${speaker.role}`}
              fill
              sizes="(max-width: 640px) 160px, 192px"
              className="object-cover"
            />
          </div>
        </div>
        <h3 className="eigenai-sans min-h-[5.2rem] text-2xl font-semibold leading-[1.111] text-white sm:text-[2.25rem]">
          {speaker.name}
        </h3>
        <p className="mt-4 text-lg leading-[1.07] tracking-[0.01em] text-[#5edbe7] sm:text-[1.75rem]">
          {speaker.role}
        </p>
      </article>
    </GradientPanel>
  );
}

function KeynoteCard({ speaker }: { speaker: Speaker }) {
  return (
    <GradientPanel className="min-h-[15.3125rem]">
      <article className="relative grid min-h-[15.3125rem] items-center gap-8 px-7 py-10 sm:px-[4.25rem] md:grid-cols-[1fr_auto] md:pr-0">
        <div className="order-2 md:order-1">
          <p className="bg-[linear-gradient(90deg,#5edbe7_26.442%,#ffffff_55.769%,#f1dcff_79.327%)] bg-clip-text text-xl tracking-[0.01em] text-transparent sm:text-4xl">
            Keynote Speaker
          </p>
          <h3 className="eigenai-sans mt-0 text-3xl font-semibold leading-[1.04] text-white sm:text-5xl">
            {speaker.name}
          </h3>
          <p className="mt-4 text-lg tracking-[0.01em] text-[#5edbe7] sm:text-[1.75rem]">
            {speaker.role}
          </p>
        </div>
        <div className="eigenai-speaker-portrait relative order-1 mx-auto size-44 rounded-full p-[2px] sm:size-[18.3125rem] md:order-2 md:-my-20 md:-mr-7">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0c0249]">
            <Image
              src={speaker.profileImage}
              alt={`${speaker.name}, ${speaker.role}`}
              fill
              sizes="(max-width: 640px) 176px, 256px"
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
    <GradientPanel className="min-h-[25.4375rem]">
      <article className="grid min-h-[25.4375rem] gap-6 px-6 py-8 sm:px-[3.9375rem] sm:py-[3.625rem]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="eigenai-sans text-2xl font-semibold leading-[1.0417] text-white sm:text-5xl">
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
          <p className="mt-8 max-w-[64.5rem] text-base leading-[1.07] tracking-[-0.01em] text-white sm:text-[1.875rem]">
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
        className="mx-auto flex max-w-7xl items-center justify-between gap-4"
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
            className="h-auto w-[5.75rem] sm:w-28"
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
          className="relative z-10 shrink-0 rounded-[3.165rem] border-[1.582px] border-[#59e0e9] bg-[rgba(217,217,217,0)] px-5 py-2 text-xs font-normal tracking-[0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_24px_rgba(89,224,233,0.14)] backdrop-blur-xl transition hover:border-white hover:bg-white/[0.1] sm:px-8 sm:text-sm"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}

function EigenFooter() {
  return (
    <footer className="relative z-10 flex min-h-[26.625rem] items-center justify-center bg-white/30 px-5 py-14">
      <div className="flex flex-col items-center text-center">
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
            className="h-auto w-[min(20.75rem,80vw)]"
          />
        </Link>

        <ul className="relative z-10 mt-9 flex flex-wrap justify-center gap-[2.375rem]">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`UTMIST on ${social.label}`}
                className="eigenai-liquid-orb flex size-14 items-center justify-center rounded-full transition hover:-translate-y-1 sm:size-[4.375rem]"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={35}
                  height={35}
                  className="size-[2.1875rem] brightness-0 invert"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
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
      <section className="relative flex min-h-[64rem] items-center justify-center overflow-hidden px-5 pb-24 pt-36 sm:px-10 sm:pb-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="absolute left-[3.25%] top-[52%] hidden md:block"
        >
          <Image
            src={lambdaHeroBack}
            alt=""
            className="eigenai-background-lambda-back h-auto w-auto"
          />
          <Image
            src={lambdaHeroFront}
            alt=""
            className="eigenai-background-lambda-front absolute left-px top-[-0.26rem] h-auto w-auto"
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
          className="right-[2.5%] top-[60%] -rotate-[30deg] scale-y-[-1]"
          large
        />
        <BackgroundGlassIcon src={iconNfc} className="right-[6.8%] top-[20%]" />
        <Image
          src={ornamentWave}
          alt=""
          className="eigenai-background-linework absolute left-[1%] top-[62%] hidden md:block"
        />
        <Image
          src={ornamentDiamond}
          alt=""
          className="eigenai-background-linework absolute left-[33%] top-[82%] hidden h-auto w-auto md:block"
        />
        <Image
          src={ornamentRibbon}
          alt=""
          className="eigenai-background-linework absolute -left-8 top-[90%] hidden md:block"
        />
        <Image
          src={ornamentSpark}
          alt=""
          className="eigenai-background-linework absolute left-[36.7%] top-[91.3%] hidden h-auto w-auto md:block"
        />
        <Image
          src={ornamentCluster}
          alt=""
          className="eigenai-background-glass-art absolute right-[28.1%] top-[54.5%] hidden md:block"
        />
        <div className="relative z-10 flex -translate-y-4 flex-col items-center">
          <EigenLogo />
          <div className="eigenai-glass-panel relative mt-12 flex min-h-[3.125rem] items-center justify-center rounded-[3.1648rem] px-6 text-sm font-normal leading-[1.07] tracking-[-0.01em] text-white sm:w-[26.9375rem] sm:px-12 sm:text-[1.875rem]">
            <span className="relative z-[1] whitespace-nowrap">
              October 3rd &amp; 4th @ LOCAT
            </span>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative px-5 py-24 sm:px-10 sm:pb-28 sm:pt-8"
      >
        <div className="relative z-10 mx-auto max-w-[72.25rem]">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            <Metric value="500+" label="Attendees" />
            <Metric value="20" label="Speakers" />
            <Metric value="11" label="Workshops" />
          </div>

          <div className="mt-28 sm:mt-[12.5rem]">
            <SectionHeading>What is eigenai?</SectionHeading>
            <div className="mt-[5.75rem] grid items-start gap-10 md:grid-cols-[29.1875rem_1fr] lg:gap-[5.4375rem]">
              <GradientPanel className="min-h-[24rem] overflow-hidden sm:min-h-[42.3125rem]">
                <div className="relative min-h-[24rem] overflow-hidden rounded-[inherit] sm:min-h-[42.3125rem]">
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
              <div className="text-lg leading-[1.07] tracking-[-0.01em] text-white sm:text-[1.875rem]">
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
        </div>
      </section>

      <section
        id="speakers"
        className="relative px-5 py-24 sm:px-10 sm:pb-32 sm:pt-20"
      >
        <div className="relative z-10 mx-auto max-w-[72.25rem]">
          <SectionHeading>Speakers</SectionHeading>
          <div className="mt-20">
            <KeynoteCard speaker={keynoteSpeaker} />
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:justify-between lg:gap-x-[3.0625rem]">
            {speakers.map((speaker, index) => (
              <SpeakerCard key={`${speaker.name}-${index}`} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="workshops"
        className="relative overflow-hidden px-5 py-24 sm:px-10 sm:pb-32 sm:pt-48"
      >
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 hidden md:block"
        >
          <Image
            src={lambdaWorkshopBack}
            alt=""
            className="eigenai-background-lambda-back h-auto w-auto"
          />
          <Image
            src={lambdaWorkshopFront}
            alt=""
            className="eigenai-background-lambda-front absolute left-px top-[-0.36rem] h-auto w-auto"
          />
        </div>
        <Image
          src={techOrbit}
          alt=""
          className="eigenai-background-orbit absolute right-[-32rem] top-[-10rem] hidden -rotate-[30deg] scale-y-[-1] lg:block"
        />
        <Image
          src={techOrbitContinuation}
          alt=""
          className="eigenai-background-orbit absolute right-[-32rem] top-[49rem] hidden -rotate-[30deg] scale-y-[-1] lg:block"
        />
        <div className="relative z-10 mx-auto max-w-[72.25rem]">
          <SectionHeading>Workshops</SectionHeading>
          <div className="mt-14 space-y-8 sm:mt-[6.625rem] sm:space-y-28">
            {workshops.map((workshop, index) => (
              <WorkshopCard
                key={`${workshop.title}-${index}`}
                workshop={workshop}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[64rem] items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-10 sm:py-40">
        <Image
          src={closingOrbit}
          alt=""
          className="eigenai-background-orbit absolute left-1/2 top-[23rem] hidden -translate-x-1/2 -rotate-[130deg] scale-y-[-1] md:block"
        />
        <div className="relative z-10 mx-auto max-w-[78.4375rem]">
          <p className="eigenai-closing-copy eigenai-body text-[clamp(3.25rem,9vw,7.5rem)] font-normal italic leading-[1.07] tracking-[0.01em] text-transparent">
            Across the Many
            <br />
            Frontiers of AI
          </p>
          <div className="mt-28 sm:mt-36">
            <EigenLogo compact />
          </div>
        </div>
      </section>

      <EigenFooter />
    </main>
  );
}
