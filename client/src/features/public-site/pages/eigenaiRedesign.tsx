import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import {
  founderPanelSpeakers,
  keynoteSpeakers,
  researchPanelSpeakers,
  speakerSession,
} from "@/features/public-site/data/eigenai";
import { EigenAILockup } from "@/features/public-site/components/eigenai-lockup";
import { EigenNavigation } from "@/features/public-site/components/eigenai-navigation";
import {
  EigenGlassSurface,
  EigenSpeakerPortrait,
} from "@/features/public-site/components/eigenai-surfaces";
import { StatItem } from "@/features/public-site/components/stats";
import { EigenAIWordmark } from "@/features/public-site/components/eigenai-wordmark";
import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";
import discordLogo from "@/assets/logos/discord.svg";
// import facebookLogo from "@/assets/logos/facebook.svg";
import githubLogo from "@/assets/logos/github.svg";
import instagramLogo from "@/assets/logos/instagram.svg";
import linkedinLogo from "@/assets/logos/linkedin.svg";
// import mediumLogo from "@/assets/logos/medium.svg";
// import xLogo from "@/assets/logos/x.svg";
import ellipseA from "@/assets/eigenai-redesign/ellipse-a.svg";
import ellipseB from "@/assets/eigenai-redesign/ellipse-b.svg";
import ellipseC from "@/assets/eigenai-redesign/ellipse-c.svg";
import ellipseD from "@/assets/eigenai-redesign/ellipse-d.svg";
import ellipseE from "@/assets/eigenai-redesign/ellipse-e.svg";
import ellipseF from "@/assets/eigenai-redesign/ellipse-f.svg";
import ellipseRingInner from "@/assets/eigenai-redesign/ellipse-ring-inner.svg";
import ellipseRingMiddle from "@/assets/eigenai-redesign/ellipse-ring-middle.svg";
import ellipseRingOuter from "@/assets/eigenai-redesign/ellipse-ring-outer.svg";
import iconCloud from "@/assets/eigenai-redesign/icon-cloud.svg";
import closingOrbit from "@/assets/eigenai-redesign/closing-orbit.svg";
import lambdaHeroBack from "@/assets/eigenai-redesign/lambda-hero-back.svg";
import lambdaHeroFront from "@/assets/eigenai-redesign/lambda-hero-front.svg";
import lambdaWorkshopBack from "@/assets/eigenai-redesign/lambda-workshop-back.svg";
import lambdaWorkshopFront from "@/assets/eigenai-redesign/lambda-workshop-front.svg";
import techOrbit from "@/assets/eigenai-redesign/tech-orbit.svg";

const concentricRings = [
  { id: "outer", src: ellipseRingOuter, width: 951.318 },
  { id: "inner", src: ellipseRingInner, width: 731.172 },
  { id: "middle", src: ellipseRingMiddle, width: 532.68 },
];

const mobileRingGroups = [
  { id: "hero-right", left: "88%", top: "6%", width: "min(88vw, 22rem)" },
  { id: "about-left", left: "4%", top: "30%", width: "min(82vw, 20rem)" },
  { id: "speakers-right", left: "92%", top: "54%", width: "min(86vw, 21rem)" },
  { id: "workshops-left", left: "2%", top: "76%", width: "min(82vw, 20rem)" },
  { id: "closing-right", left: "88%", top: "94%", width: "min(88vw, 22rem)" },
] as const;

const FIGMA_BACKDROP_WIDTH = 1440;
const FIGMA_BACKDROP_HEIGHT = 8192;

const backdropColorFields = [
  { id: "hero-purple-top", src: ellipseC, x: 180, y: -801, width: 1738 },
  { id: "hero-purple-left", src: ellipseA, x: -752, y: 453, width: 1738 },
  { id: "hero-blue", src: ellipseB, x: 122, y: 566, width: 1338 },
  { id: "hero-cyan", src: ellipseF, x: -399.54, y: 517.46, width: 965.753 },
  { id: "hero-purple-right", src: ellipseA, x: 540, y: 317, width: 1738 },
  { id: "about-lavender", src: ellipseD, x: 504, y: 1355, width: 2135 },
  {
    id: "about-cyan-right",
    src: ellipseE,
    x: 799.46,
    y: 1338.46,
    width: 764.073,
  },
  {
    id: "about-cyan-left",
    src: ellipseF,
    x: -7.54,
    y: 1794.46,
    width: 965.753,
  },
  { id: "speaker-purple-left", src: ellipseC, x: -1250, y: 2238, width: 2070 },
  { id: "speaker-purple-right", src: ellipseC, x: 337, y: 3050, width: 1738 },
  { id: "workshop-purple-right", src: ellipseA, x: 671, y: 3596, width: 1738 },
  {
    id: "closing-cyan-left",
    src: ellipseF,
    x: -379.54,
    y: 5620.46,
    width: 965.753,
  },
  { id: "closing-purple", src: ellipseC, x: -130, y: 6415, width: 1738 },
] as const;

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
    href: "https://discord.com/invite/88mSPw8",
    label: "Discord",
    icon: discordLogo,
  },
  {
    href: "https://www.linkedin.com/company/utmist/",
    label: "LinkedIn",
    icon: linkedinLogo,
  },
  {
    href: "https://www.instagram.com/uoft_utmist/",
    label: "Instagram",
    icon: instagramLogo,
  },
  // {
  //   href: "https://www.facebook.com/UofT.MIST",
  //   label: "Facebook",
  //   icon: facebookLogo,
  // },
  // {
  //   href: "https://x.com/utmist1",
  //   label: "X",
  //   icon: xLogo,
  // },
  {
    href: "https://github.com/UTMIST",
    label: "GitHub",
    icon: githubLogo,
  },
  // {
  //   href: "https://utorontomist.medium.com/",
  //   label: "Medium",
  //   icon: mediumLogo,
  // },
];

type Speaker = {
  name: string;
  role: string;
  profileURL: string;
  profileImage: StaticImageData;
};

function ConcentricRingGroup({
  centerX,
  centerY,
}: {
  centerX: number;
  centerY: number;
}) {
  return (
    <div
      aria-hidden="true"
      data-testid="eigenai-ring-group"
      className="absolute hidden aspect-square -translate-x-1/2 -translate-y-1/2 md:block"
      style={{
        left: `${(centerX / FIGMA_BACKDROP_WIDTH) * 100}%`,
        top: `${(centerY / FIGMA_BACKDROP_HEIGHT) * 100}%`,
        width: `${(951.318 / FIGMA_BACKDROP_WIDTH) * 100}%`,
        maxWidth: "951.318px",
      }}
    >
      {concentricRings.map((ring, index) => (
        <Image
          key={ring.id}
          src={ring.src}
          alt=""
          data-ring-index={index}
          className="absolute top-1/2 left-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-42 mix-blend-screen [filter:drop-shadow(0_0_5px_rgb(255_255_255/0.12))_drop-shadow(0_0_18px_rgb(89_224_233/0.12))_saturate(132%)]"
          style={{ width: `${(ring.width / 951.318) * 100}%` }}
        />
      ))}
    </div>
  );
}

function MobileConcentricRingGroups() {
  return mobileRingGroups.map((group) => (
    <div
      key={group.id}
      aria-hidden="true"
      data-testid="eigenai-mobile-ring-group"
      className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 md:hidden"
      style={{ left: group.left, top: group.top, width: group.width }}
    >
      {concentricRings.map((ring, index) => (
        <Image
          key={ring.id}
          src={ring.src}
          alt=""
          data-ring-index={index}
          className="absolute top-1/2 left-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-68 mix-blend-screen [filter:drop-shadow(0_0_6px_rgb(255_255_255/0.2))_drop-shadow(0_0_20px_rgb(89_224_233/0.2))_saturate(145%)]"
          style={{ width: `${(ring.width / 951.318) * 100}%` }}
        />
      ))}
    </div>
  ));
}

function BackdropImage({
  src,
  x,
  y,
  width,
  className,
  transform,
}: {
  src: StaticImageData;
  x: number;
  y: number;
  width: number;
  className: string;
  transform?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      data-testid="eigenai-backdrop-image"
      className={`absolute h-auto max-w-none ${className}`}
      style={{
        left: `${(x / FIGMA_BACKDROP_WIDTH) * 100}%`,
        top: `${(y / FIGMA_BACKDROP_HEIGHT) * 100}%`,
        width: `${(width / FIGMA_BACKDROP_WIDTH) * 100}%`,
        maxWidth: `${width}px`,
        transform,
        transformOrigin: "center",
      }}
    />
  );
}

function OrbitCluster({
  src,
  x,
  y,
  width,
  transform,
  showCloud = true,
}: {
  src: StaticImageData;
  x: number;
  y: number;
  width: number;
  transform?: string;
  showCloud?: boolean;
}) {
  return (
    <div
      data-testid="eigenai-orbit-cluster"
      className="absolute hidden aspect-square md:block"
      style={{
        left: `${(x / FIGMA_BACKDROP_WIDTH) * 100}%`,
        top: `${(y / FIGMA_BACKDROP_HEIGHT) * 100}%`,
        width: `${(width / FIGMA_BACKDROP_WIDTH) * 100}%`,
        maxWidth: `${width}px`,
        transform,
        transformOrigin: "center",
      }}
    >
      <Image
        src={src}
        alt=""
        className="h-auto w-full max-w-none opacity-42 mix-blend-screen [filter:drop-shadow(0_0_5px_rgb(255_255_255/0.12))_drop-shadow(0_0_18px_rgb(89_224_233/0.12))_saturate(132%)]"
      />
      {showCloud ? (
        <span
          data-testid="eigenai-orbit-cloud"
          className="absolute z-1 flex aspect-square items-center justify-center rounded-full border border-white/55 opacity-62 mix-blend-screen drop-shadow-[0_0_4px_rgb(255_255_255/0.2)]"
          style={{
            left: "21.3%",
            top: "5.82%",
            width: "4.066%",
          }}
        >
          <Image src={iconCloud} alt="" className="h-auto w-1/2" />
        </span>
      ) : null}
    </div>
  );
}

function LambdaCluster({
  back,
  front,
  x,
  y,
  width,
  backOffset,
}: {
  back: StaticImageData;
  front: StaticImageData;
  x: number;
  y: number;
  width: number;
  backOffset: number;
}) {
  return (
    <div
      data-testid="eigenai-lambda-cluster"
      className="absolute hidden [container-type:inline-size] md:block"
      style={{
        left: `${(x / FIGMA_BACKDROP_WIDTH) * 100}%`,
        top: `${(y / FIGMA_BACKDROP_HEIGHT) * 100}%`,
        width: `${(width / FIGMA_BACKDROP_WIDTH) * 100}%`,
      }}
    >
      <Image
        src={back}
        alt=""
        className="relative h-auto w-full blur-[0.9693cqw]"
        style={{
          left: "-0.046%",
          transform: `translateY(${(backOffset / back.height) * 100}%)`,
        }}
      />
      <Image
        src={front}
        alt=""
        className="absolute top-0 left-0 h-auto w-full blur-[4.0711cqw]"
      />
    </div>
  );
}

function ContinuousBackdrop() {
  return (
    <div
      aria-hidden="true"
      data-testid="eigenai-continuous-backdrop"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0c0249]" />
      {backdropColorFields.map((field) => (
        <BackdropImage
          key={field.id}
          {...field}
          className="opacity-44 mix-blend-screen [filter:drop-shadow(0_0_34px_rgb(89_224_233/0.08))_saturate(122%)]"
        />
      ))}

      <OrbitCluster
        src={techOrbit}
        x={201}
        y={-679.9}
        width={951.318}
        transform="rotate(-30deg) scaleY(-1)"
        showCloud={false}
      />
      <OrbitCluster
        src={techOrbit}
        x={-279.4375}
        y={625.4805}
        width={951.318}
      />
      <ConcentricRingGroup centerX={1604.659} centerY={620.659} />
      <MobileConcentricRingGroups />

      <LambdaCluster
        back={lambdaHeroBack}
        front={lambdaHeroFront}
        x={47}
        y={532}
        width={321.409}
        backOffset={4.172}
      />
      <LambdaCluster
        back={lambdaWorkshopBack}
        front={lambdaWorkshopFront}
        x={995.205}
        y={4329}
        width={444.352}
        backOffset={5.768}
      />

      <OrbitCluster
        src={techOrbit}
        x={755.1}
        y={4509.1}
        width={951.318}
        transform="rotate(-30deg) scaleY(-1)"
      />
      <OrbitCluster
        src={closingOrbit}
        x={159.7}
        y={6745.7}
        width={1113.84}
        transform="rotate(-130deg) scaleY(-1)"
      />
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-eigen-serif! bg-[radial-gradient(ellipse_54%_100%_at_30%_48%,#fff_0%,#a272fb_100%)] bg-clip-text text-center text-[clamp(2rem,6vw,4rem)] leading-tight font-medium! text-transparent">
      {children}
    </h2>
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
    <EigenGlassSurface
      className={`rounded-4xl sm:rounded-[3.1648rem] ${className}`}
    >
      <div className="relative z-1 h-full rounded-[inherit]">{children}</div>
    </EigenGlassSurface>
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
    <GradientPanel className="mt-18 sm:mt-24 sm:min-h-64">
      <article className="relative flex min-w-0 flex-col px-5 pb-5 pt-16 text-center sm:min-h-64 sm:px-8 sm:pb-6 sm:pt-20 sm:text-left">
        <EigenSpeakerPortrait className="absolute top-0 left-1/2 size-32 -translate-x-1/2 translate-y-[-55%] rounded-full p-0.5 sm:size-40">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0c0249]">
            <Image
              src={speaker.profileImage}
              alt={`${speaker.name}, ${speaker.role}`}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              className="object-cover"
            />
          </div>
        </EigenSpeakerPortrait>
        <h3 className="font-eigen-sans text-lg/tight font-medium! text-white sm:text-2xl">
          {speaker.name}
        </h3>
        <p className="mt-2 text-xs/relaxed font-normal tracking-[0.01em] wrap-anywhere text-[#5edbe7] sm:mt-3 sm:text-base">
          {speaker.role}
        </p>
      </article>
    </GradientPanel>
  );
}

function KeynoteCard({ speaker }: { speaker: Speaker }) {
  return (
    <GradientPanel className="sm:min-h-52">
      <article className="relative grid min-w-0 items-center gap-5 p-5 sm:min-h-52 sm:gap-8 sm:px-10 sm:py-8 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="order-2 min-w-0 text-center md:order-1 md:text-left">
          <p className="bg-[linear-gradient(90deg,#5edbe7_26.442%,#ffffff_55.769%,#f1dcff_79.327%)] bg-clip-text text-sm tracking-[0.01em] text-transparent sm:text-lg">
            Keynote Speaker
          </p>
          <h3 className="font-eigen-sans mt-1 text-xl/tight font-normal! text-white sm:text-3xl">
            {speaker.name}
          </h3>
          <p className="mt-2 text-sm font-normal tracking-[0.01em] text-[#5edbe7] sm:mt-3 sm:text-lg">
            {speaker.role}
          </p>
        </div>
        <EigenSpeakerPortrait className="relative order-1 mx-auto size-32 rounded-full p-0.5 sm:size-52 md:order-2">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0c0249]">
            <Image
              src={speaker.profileImage}
              alt={`${speaker.name}, ${speaker.role}`}
              fill
              sizes="(max-width: 640px) 128px, 208px"
              className="object-cover"
            />
          </div>
        </EigenSpeakerPortrait>
      </article>
    </GradientPanel>
  );
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
    <GradientPanel>
      <article className="grid min-w-0 p-5 sm:min-h-72 sm:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <h3 className="font-eigen-sans max-w-3xl text-xl/tight font-medium! text-white sm:text-3xl">
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
            <p className="mt-3 text-sm font-medium tracking-[0.01em] text-[#5edbe7] sm:text-base">
              {workshop.host}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl text-sm/relaxed font-normal tracking-[-0.01em] text-white sm:mt-6 sm:text-lg">
            {workshop.description}
          </p>
        </div>
      </article>
    </GradientPanel>
  );
}

function EigenFooter() {
  return (
    <footer className="relative z-10 flex min-h-52 items-center justify-center bg-white/30 px-5 py-8 sm:min-h-64 sm:py-10">
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
            className="h-auto w-[min(10rem,55vw)] sm:w-[min(12rem,60vw)]"
          />
        </Link>

        <ul className="relative z-10 mt-5 flex flex-wrap justify-center gap-3 sm:mt-6 sm:gap-5">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <EigenGlassSurface asChild variant="orb">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`UTMIST on ${social.label}`}
                  className="flex size-11 items-center justify-center rounded-full transition hover:-translate-y-1"
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 brightness-0 invert"
                  />
                </a>
              </EigenGlassSurface>
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
      className="font-eigen-body relative isolate overflow-hidden bg-[#0c0249] font-medium text-white"
    >
      <ContinuousBackdrop />
      <EigenNavigation />
      <section
        data-testid="eigenai-hero"
        className="relative flex min-h-[100svh] items-center justify-center px-5 pb-10 pt-24 sm:min-h-216 sm:px-10 sm:pb-24 sm:pt-36"
      >
        <ContentContainer className="flex -translate-y-4 flex-col items-center">
          <EigenAILockup fontSize="clamp(4rem, 15vw, 10.5rem)" showCursor />
          <EigenGlassSurface className="mt-8 flex min-h-15 w-fit max-w-full items-center justify-center rounded-full px-4 py-4 text-lg leading-none tracking-[-0.01em] sm:mt-10 sm:min-h-11 sm:px-8 sm:text-3xl">
            <span className="relative z-1 text-center text-white sm:whitespace-nowrap">
              October 3rd &amp; 4th @ LOCAT
            </span>
          </EigenGlassSurface>
        </ContentContainer>
      </section>

      <section
        id="about"
        className="relative px-5 pb-10 pt-4 sm:px-10 sm:pb-28 sm:pt-8"
      >
        <ContentContainer>
          <div
            data-testid="eigenai-metrics"
            className="mx-auto grid max-w-3xl grid-cols-3 gap-x-2 sm:gap-x-0"
          >
            <StatItem
              number="500+"
              description="Attendees"
              className="text-center"
              numberClassName="font-eigen-serif text-[clamp(2.25rem,8vw,6rem)] leading-none text-white"
              descriptionClassName="font-eigen-body mt-1 text-xs/tight font-semibold text-white sm:mt-2 sm:text-xl lg:text-2xl"
            />
            <StatItem
              number="20"
              description="Speakers"
              className="text-center"
              numberClassName="font-eigen-serif text-[clamp(2.25rem,8vw,6rem)] leading-none text-white"
              descriptionClassName="font-eigen-body mt-1 text-xs/tight font-semibold text-white sm:mt-2 sm:text-xl lg:text-2xl"
            />
            <StatItem
              number="11"
              description="Workshops"
              className="text-center"
              numberClassName="font-eigen-serif text-[clamp(2.25rem,8vw,6rem)] leading-none text-white"
              descriptionClassName="font-eigen-body mt-1 text-xs/tight font-semibold text-white sm:mt-2 sm:text-xl lg:text-2xl"
            />
          </div>

          <div className="mt-10 sm:mt-28">
            <SectionHeading>
              What is <EigenAIWordmark />?
            </SectionHeading>
            <div className="mt-6 grid items-start justify-between gap-6 sm:mt-12 sm:gap-10 md:grid-cols-[minmax(16rem,24rem)_minmax(0,36rem)] lg:gap-16">
              <GradientPanel className="min-h-64 overflow-hidden sm:min-h-136">
                <div
                  aria-hidden="true"
                  className="min-h-64 rounded-[inherit] sm:min-h-136"
                />
              </GradientPanel>
              <div className="max-w-2xl text-sm/relaxed tracking-[-0.01em] text-white sm:text-lg">
                <p>
                  EigenAI is a UTMIST flagship conference introducing students
                  to the world of AI, ML, software, and emerging technologies.
                  Through panels and workshops covering both fundamental and
                  advanced topics, participants gain hands-on experience and
                  practical insights.
                </p>
                <p className="mt-5 sm:mt-7">
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
        className="relative px-5 py-10 sm:px-10 sm:pb-32 sm:pt-20"
      >
        <ContentContainer>
          <SectionHeading>Speakers</SectionHeading>
          <div className="mt-6 sm:mt-12">
            <KeynoteCard speaker={keynoteSpeaker} />
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:mt-12 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker, index) => (
              <SpeakerCard key={`${speaker.name}-${index}`} speaker={speaker} />
            ))}
          </div>
        </ContentContainer>
      </section>

      <section
        id="workshops"
        className="relative px-5 pb-4 pt-10 sm:px-10 sm:py-32"
      >
        <ContentContainer>
          <SectionHeading>Workshops</SectionHeading>
          <div className="mt-6 space-y-4 sm:mt-12 sm:space-y-12">
            {workshops.map((workshop, index) => (
              <WorkshopCard
                key={`${workshop.title}-${index}`}
                workshop={workshop}
              />
            ))}
          </div>
        </ContentContainer>
      </section>

      <section
        data-testid="eigenai-closing"
        className="relative flex items-center justify-center px-5 pb-10 pt-4 text-center sm:min-h-192 sm:px-10 sm:py-32"
      >
        <ContentContainer>
          <p className="font-eigen-body mx-auto max-w-4xl bg-[linear-gradient(90deg,#5edbe7_26.4423%,#fff_55.7692%,#f1dcff_79.3269%)] bg-clip-text text-[clamp(1.75rem,6vw,4rem)] leading-tight font-medium tracking-[0.01em] text-transparent italic">
            Across the Many
            <br />
            Frontiers of AI
          </p>
          <div className="mt-8 sm:mt-24">
            <EigenAILockup fontSize="clamp(3.5rem, 12vw, 5rem)" />
          </div>
        </ContentContainer>
      </section>

      <EigenFooter />
    </main>
  );
}
