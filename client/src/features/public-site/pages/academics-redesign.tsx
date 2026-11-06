import Image from "next/image";
import Link from "next/link";
import { Button, ContentContainer } from "@/shared/ui";
import { AcademicSessionCard } from "@/features/public-site/components/academic-session-card";
import { academicTopics, academicsArchivePath, academicsFaqs, academicsPreviewTeam, kickoffSession } from "@/features/public-site/data/academics";
import "@/styles/academics.css";

function Divider() {
  return <Image src="/academics-redesign/divider.svg" alt="" width={633} height={1} className="mx-auto max-w-[70%]" />;
}

export default function AcademicsRedesign() {
  return (
    <main className="academics-page ui-surface bg-white font-eigen-body text-black" data-academics="redesign">
      <section className="relative flex min-h-[640px] items-center justify-center py-40 text-center text-white lg:min-h-[739px]" aria-labelledby="academics-title" data-ui-tone="dark">
        <Image src="/academics-redesign/hero.png" alt="" fill preload sizes="100vw" className="object-cover" />
        <ContentContainer className="relative max-w-[1240px] lg:translate-y-12">
          <p className="mb-4 text-lg leading-snug sm:text-[22px]">UTMIST Academics Department</p>
          <h1 id="academics-title" className="mx-auto max-w-[1090px] text-[clamp(2.6rem,5.56vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em]">
            Machine Learning<br className="hidden sm:block" /> Fundamentals to Frontiers
          </h1>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Button asChild variant="outline" className="h-14 gap-5 rounded-full border-[var(--brand-cyan)] bg-white/20 py-2 pl-6 pr-3 text-lg font-normal text-white hover:scale-100 hover:bg-white/30 sm:text-[22px]">
              <a href="#program">Explore the program
                <span className="relative inline-flex size-[33px] items-center justify-center" aria-hidden="true">
                  <Image src="/academics-redesign/cta-circle.svg" alt="" width={33} height={33} className="absolute" />
                  <Image src="/academics-redesign/cta-arrow.svg" alt="" width={11.6717} height={12.4} className="relative rotate-90" />
                </span>
              </a>
            </Button>
            <Link href={academicsArchivePath} className="rounded px-2 py-3 text-lg hover:underline sm:text-[22px]">Past years <span aria-hidden="true">↗</span></Link>
          </div>
        </ContentContainer>
      </section>

      <section id="program" aria-labelledby="program-heading" className="scroll-mt-8 py-24 lg:pb-18 lg:pt-28">
        <ContentContainer className="max-w-[1100px]">
          <div className="grid items-center gap-16 md:grid-cols-2 md:gap-14">
            <div className="relative">
              <Image src="/academics-redesign/intro-decoration.svg" alt="" width={32} height={32} className="absolute -top-14 -left-3" />
              <h2 id="program-heading" className="mb-7 text-[32px] font-medium leading-tight tracking-tight">Learn. Build. Explore.</h2>
              <div className="max-w-[459px] space-y-6 text-lg leading-[1.25] lg:text-xl">
                <p>Foundations to Frontiers (F2F) is UTMIST’s flagship AI/ML program for students of all skill levels, offering a choose-your-own-adventure learning experience from foundational concepts to cutting-edge implementations.</p>
                <p><strong>Foundations Track:</strong> Build your understanding of core concepts, math, and ML fundamentals.<br /><strong>Frontiers Track:</strong> Skip the basics and dive straight into advanced, hands-on implementations.</p>
              </div>
            </div>
            <div className="academic-collage relative mx-auto w-full max-w-[459px] pt-24 pb-10">
              <div aria-hidden="true" className="academic-square absolute top-0 right-[30%] bg-[var(--academic-mint)]" />
              <div className="relative aspect-[459/270] overflow-hidden rounded-[20px]">
                <Image src="/academics-redesign/workshop.png" alt="Students learning together at a UTMIST machine learning workshop" width={459} height={613} sizes="(max-width: 767px) 90vw, 459px" className="academic-workshop-photo absolute left-0 w-full max-w-none" />
              </div>
              <div className="academic-code absolute top-6 -left-3 z-10 w-[383px] max-w-[calc(100%+12px)] rounded-2xl bg-[var(--academic-code)] px-5 py-5 text-white shadow-lg lg:-left-24">
                <span className="absolute right-3 top-2 text-[10px] text-white/70" aria-hidden="true">py</span>
                <div className="flex gap-3 text-[clamp(8px,2vw,10px)] leading-[10px]">
                  <span aria-hidden="true" className="whitespace-pre text-right text-white/50">{"1\n2\n3\n4\n5"}</span>
                  <pre className="m-0"><code><span className="text-white/65"># Using autograd to compute a derivative</span>{"\n"}x <span className="text-[var(--academic-mint)]">=</span> torch.tensor(<span className="text-[var(--brand-lilac)]">2.0</span>, requires_grad=<span className="text-[var(--brand-lilac)]">True</span>){"\n"}y <span className="text-[var(--academic-mint)]">=</span> x <span className="text-[var(--academic-mint)]">**</span> <span className="text-[var(--brand-lilac)]">2</span>{"\n"}y.backward(){"\n"}print(<span className="text-[var(--brand-cyan)]">&quot;x.grad =&quot;</span>, x.grad)</code></pre>
                </div>
              </div>
              <div aria-hidden="true" className="academic-square absolute left-0 top-1/2 -translate-x-1/2 bg-[var(--academic-teal)]" />
              <div aria-hidden="true" className="academic-square absolute right-6 bottom-0 bg-[var(--brand-cyan)]" />
            </div>
          </div>
        </ContentContainer>
      </section>

      <Divider />

      <section aria-labelledby="workshops-heading" className="pt-20 lg:pt-24">
        <ContentContainer className="max-w-[1100px]">
          <div className="grid items-start gap-10 pb-20 md:grid-cols-[300px_1fr] md:gap-12 xl:gap-[175px]">
            <div className="md:col-start-2 md:row-start-1">
              <h2 id="workshops-heading" className="mb-7 text-[32px] font-medium leading-tight tracking-tight">Workshops at a Glance</h2>
              <p className="text-lg leading-[1.25] lg:text-xl">In Semester 1, each topic begins with a joint lecture, followed by your choice of a Foundations track to build core concepts and mathematical understanding, or a Frontiers track to explore advanced, hands-on applications. In Semester 2, put your knowledge into practice through workshops on research opportunities, production-ready projects, industry ML careers, and more.</p>
              <p className="mt-5 text-sm leading-relaxed text-[var(--academic-deep)]" role="note">Design preview: session dates, descriptions, and team profiles are sample content. Learning resources are coming soon. <Link href={academicsArchivePath} className="underline underline-offset-4">Visit the 2025 archive for published materials.</Link></p>
            </div>
            <div className="relative mx-auto flex w-full max-w-[360px] flex-col self-stretch md:col-start-1 md:row-start-1 md:max-w-[300px] xl:translate-x-7">
              <h3 className="sr-only">Program kick-off</h3>
              <AcademicSessionCard session={kickoffSession} />
              <div aria-hidden="true" className="academic-kickoff-connector relative left-3.5 hidden flex-1 md:block xl:-left-[60px]">
                <Image src="/academics-redesign/timeline-start.svg" alt="" width={197.996} height={114.131} className="absolute left-0 top-0" />
              </div>
            </div>
          </div>
        </ContentContainer>
        <div className="academic-timeline relative">
          <div aria-hidden="true" className="academic-timeline-line absolute top-7 bottom-7 hidden md:block">
            <Image src="/academics-redesign/timeline-line.svg" alt="" width={1749} height={2} className="absolute left-0 top-0 origin-top-left rotate-90 max-w-none" />
          </div>
          {academicTopics.map((topic, index) => (
            <section key={topic.id} aria-labelledby={`${topic.id}-heading`} className="academic-topic py-7" data-level={index}>
              <ContentContainer className="relative max-w-[1040px]">
                <div className="academic-topic-marker academic-square absolute top-0 hidden md:block" aria-hidden="true" />
                <p className="mb-1 text-base leading-tight lg:text-xl">{topic.label}</p>
                <h3 id={`${topic.id}-heading`} className="mb-5 text-[30px] font-medium leading-tight tracking-[-0.04em] lg:text-[33px]">{topic.title}</h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {topic.sessions.map((session) => <AcademicSessionCard key={session.id} session={session} />)}
                </div>
              </ContentContainer>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="academics-faq-heading" className="py-24 lg:py-32">
        <ContentContainer className="max-w-[1100px]">
          <h2 id="academics-faq-heading" className="mb-10 text-[32px] font-medium tracking-tight">FAQs</h2>
          <div className="space-y-4">
            {academicsFaqs.map((faq, index) => <details key={faq.id} id={`faq-${faq.id}`} open={index === 0} className="academic-faq group rounded-[10px] border border-black/40">
              <summary className="relative flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 rounded-[10px] px-5 py-4 text-lg leading-snug lg:text-xl">
                {faq.question}
                <span aria-hidden="true" className="relative flex size-5 shrink-0 items-center justify-center">
                  <Image src="/academics-redesign/faq-closed.svg" alt="" width={10.431} height={17.0569} className="rotate-90 group-open:hidden" />
                  <Image src="/academics-redesign/faq-open.svg" alt="" width={10.431} height={17.0569} className="hidden -rotate-90 group-open:block" />
                </span>
                <Image src="/academics-redesign/faq-divider.svg" alt="" width={976} height={1} className="absolute inset-x-0 bottom-0 hidden max-w-full group-open:block" />
              </summary>
              <div className="px-5 pt-4 pb-5 text-lg leading-snug lg:text-xl">
                <p>{faq.answer}</p>
                {faq.href && <Link href={faq.href} className="mt-3 inline-block underline underline-offset-4">{faq.linkLabel}</Link>}
              </div>
            </details>)}
          </div>
        </ContentContainer>
      </section>

      <Divider />

      <section aria-labelledby="academics-team-heading" className="pt-20 pb-28 lg:pt-24 lg:pb-36">
        <ContentContainer className="max-w-[1100px]">
          <h2 id="academics-team-heading" className="mb-4 text-[32px] font-medium tracking-tight">Meet the Team</h2>
          <p className="mb-12 text-sm text-[var(--academic-deep)]">Sample profiles for design preview. The program team will be announced here.</p>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
            {academicsPreviewTeam.map((person) => <li key={person.id} className="relative rounded-[10px] border border-black/40 bg-white">
              <div className="academic-person-photo relative h-[171px] rounded-t-[9px]">
                <Image src="/academics-redesign/team-placeholder.png" alt="" width={179} height={196} sizes="179px" className="absolute bottom-0 left-1/2 h-auto w-[179px] max-w-full -translate-x-1/2" />
                {person.role === "Program Director" && <span className="absolute right-2 top-2 flex size-10 items-center justify-center rounded border border-black/40 bg-[var(--academic-mint)]/80" aria-hidden="true">
                  <Image src="/academics-redesign/director-star.svg" alt="" width={24.7275} height={23.5172} />
                </span>}
              </div>
              <div className="min-h-[83px] border-t border-black/40 px-4 py-3">
                <h3 className="text-lg font-semibold leading-snug lg:text-xl">{person.name}</h3>
                <p className="mt-1 text-sm leading-snug text-[var(--academic-deep)] sm:text-base">{person.role}</p>
              </div>
            </li>)}
          </ul>
        </ContentContainer>
      </section>
    </main>
  );
}
