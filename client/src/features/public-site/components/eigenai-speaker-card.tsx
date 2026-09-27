import Image from "next/image";
import type { EigenAISpeaker } from "@/features/public-site/types/eigenai";
import {
  EigenGlassSurface,
  EigenSpeakerPortrait,
} from "@/features/public-site/components/eigenai-surfaces";

function SpeakerPortrait({
  speaker,
  keynote,
}: {
  speaker: EigenAISpeaker;
  keynote: boolean;
}) {
  return (
    <EigenSpeakerPortrait
      className={
        keynote
          ? "relative order-1 mx-auto size-32 rounded-full p-0.5 sm:size-52 md:order-2"
          : "absolute top-0 left-1/2 size-32 -translate-x-1/2 translate-y-[-55%] rounded-full p-0.5 sm:size-40"
      }
    >
      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-[#0c0249]">
        {speaker.profileImage ? (
          <Image
            src={speaker.profileImage}
            alt={`${speaker.name}, ${speaker.role}`}
            fill
            sizes={
              keynote
                ? "(max-width: 640px) 128px, 208px"
                : "(max-width: 640px) 128px, 160px"
            }
            className="object-cover"
          />
        ) : (
          <span aria-hidden="true" className="text-3xl text-white/70">
            {speaker.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </span>
        )}
      </div>
    </EigenSpeakerPortrait>
  );
}

/** One presentation for fixture content and future speaker readers. */
export function EigenAISpeakerCard({
  speaker,
  keynote = false,
}: {
  speaker: EigenAISpeaker;
  keynote?: boolean;
}) {
  const details = (
    <>
      {keynote ? (
        <p className="bg-[linear-gradient(90deg,#5edbe7_26.442%,#ffffff_55.769%,#f1dcff_79.327%)] bg-clip-text text-xs tracking-[0.01em] text-transparent sm:text-lg">
          Keynote Speaker
        </p>
      ) : null}
      <h3
        className={
          keynote
            ? "font-eigen-sans mt-1 wrap-anywhere text-xl/tight font-normal! text-white sm:text-3xl"
            : "font-eigen-sans wrap-anywhere text-lg/tight font-medium! text-white sm:text-2xl"
        }
      >
        {speaker.profileURL ? (
          <a
            href={speaker.profileURL}
            className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {speaker.name}
          </a>
        ) : (
          speaker.name
        )}
      </h3>
      <p
        className={
          keynote
            ? "mt-2 wrap-anywhere text-xs font-normal tracking-[0.01em] text-[#5edbe7] sm:mt-3 sm:text-lg"
            : "mt-2 text-[0.6875rem] leading-relaxed font-normal tracking-[0.01em] wrap-anywhere text-[#5edbe7] sm:mt-3 sm:text-base"
        }
      >
        {speaker.role}
      </p>
      {speaker.bio ? (
        <p className="mt-3 wrap-anywhere text-xs/relaxed text-white/80 sm:text-base/relaxed">
          {speaker.bio}
        </p>
      ) : null}
    </>
  );

  return (
    <EigenGlassSurface
      className={`rounded-4xl sm:rounded-[3.1648rem] ${keynote ? "sm:min-h-52" : "mt-18 sm:mt-24 sm:min-h-64"}`}
    >
      <div className="relative z-1 h-full rounded-[inherit]">
        {keynote ? (
          <article className="relative grid min-w-0 items-center gap-5 p-5 sm:min-h-52 sm:gap-8 sm:px-10 sm:py-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="order-2 min-w-0 text-center md:order-1 md:text-left">
              {details}
            </div>
            <SpeakerPortrait speaker={speaker} keynote />
          </article>
        ) : (
          <article className="relative flex min-w-0 flex-col px-5 pb-5 pt-16 text-center sm:min-h-64 sm:px-8 sm:pb-6 sm:pt-20 sm:text-left">
            <SpeakerPortrait speaker={speaker} keynote={false} />
            {details}
          </article>
        )}
      </div>
    </EigenGlassSurface>
  );
}
