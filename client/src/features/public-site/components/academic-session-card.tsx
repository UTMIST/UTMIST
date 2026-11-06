import Image from "next/image";
import type { AcademicSession, LearningResource } from "@/features/public-site/data/academics";

const resources: { key: LearningResource; label: string; width: number }[] = [
  { key: "slides", label: "Slides", width: 63.1579 },
  { key: "recording", label: "Recording", width: 86.4266 },
  { key: "code", label: "Code", width: 59.8338 },
];

export function AcademicSessionCard({ session }: { session: AcademicSession }) {
  return (
    <article aria-labelledby={`${session.id}-title`} className="academic-session overflow-hidden rounded-[10px] border border-black/40 bg-white" data-track={session.track}>
      <div className="academic-session-heading relative px-4 pb-3 pt-10 text-white">
        <div className="absolute top-3 right-3">
          <span className="rounded-full border border-white/60 px-3 py-0.5 text-xs">{session.track}</span>
        </div>
        <h4 id={`${session.id}-title`} className="mb-1.5 text-[33px] font-medium leading-none tracking-[-0.04em]">{session.title}</h4>
        <p className="text-xs italic leading-none">{session.description}</p>
      </div>
      <div className="px-4 pb-2 pt-3 text-base leading-snug">
        <p className="font-semibold"><time dateTime={session.dateTime}>{session.date}</time></p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
          <span>{session.time}</span>
          <span className="flex items-center gap-1">
            <Image src="/academics-redesign/location.png" alt="" width={14} height={14} />
            {session.location}
          </span>
        </div>
        <ul aria-label={`${session.title} resources`} className="mt-1 flex flex-wrap gap-2">
          {resources.map(({ key, label, width }) => {
            const href = session.resources[key];
            const content = <>
              <Image src={`/academics-redesign/${key}-pill.svg`} alt="" width={width} height={24.3562} className="absolute inset-x-0 top-1/2 -translate-y-1/2" />
              <span className="relative">{label} <span aria-hidden="true">↗</span></span>
            </>;
            const className = "relative inline-flex min-h-11 items-center justify-center whitespace-nowrap text-xs";
            return <li key={key}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${session.title}: ${label} (opens in a new tab)`} className={className} style={{ width }}>{content}</a>
              ) : (
                <span aria-disabled="true" aria-label={`${label}: coming soon`} title={`${label}: coming soon`} className={`${className} text-black/60`} style={{ width }}>{content}</span>
              )}
            </li>;
          })}
        </ul>
      </div>
    </article>
  );
}
