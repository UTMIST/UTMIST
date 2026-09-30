import clsx from "clsx";
import type { CSSProperties } from "react";
import type { EigenAIScheduleDay } from "@/features/public-site/types/eigenai";
import { buildScheduleTimeline } from "@/features/public-site/lib/eigenai-schedule";
import { EigenGlassSurface } from "@/features/public-site/components/eigenai-surfaces";

type ScheduleDayProps = ReturnType<typeof buildScheduleTimeline>["days"][number] & {
  aligned: boolean;
};

function ScheduleDay({ date, day, slots, aligned }: ScheduleDayProps) {
  const datedHeading = date.match(/^(Saturday|Sunday)\s+(.+)$/);

  return (
    <article className={clsx(
      "min-w-0 [--day-accent:#5edbe7]",
      aligned && "md:row-span-full md:grid md:grid-rows-subgrid",
    )}>
      <header className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3 lg:px-4">
        <h3 className="font-eigen-sans text-lg font-medium! text-white lg:text-xl">
          {datedHeading ? (
            <>
              {datedHeading[1]}
              <span className="mt-1 block text-xs font-normal text-white/60">
                {" "}{datedHeading[2]}
              </span>
            </>
          ) : date}
        </h3>
        <p className="shrink-0 text-[10px] font-semibold tracking-[0.12em] text-[var(--day-accent)] uppercase">
          {day}
        </p>
      </header>
      {slots.length === 0 ? (
        <p className="py-3 text-sm text-white/70">Sessions will be announced soon.</p>
      ) : null}
      <ol className={clsx("space-y-2", aligned && "md:contents md:space-y-0")}>
        {slots.map(({ time, sessions, rowStart, rowEnd }) => (
          <li
            key={time}
            className={clsx(
              "grid min-w-0",
              aligned && "md:mb-1.5 md:[grid-row:var(--session-start)/var(--session-end)] md:last:mb-0",
            )}
            style={aligned ? {
              "--session-start": rowStart,
              "--session-end": rowEnd,
            } as CSSProperties : undefined}
          >
            <div
              className="min-w-0 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              role={sessions.length > 1 ? "region" : undefined}
              aria-label={
                sessions.length > 1
                  ? `${day}, ${time}: simultaneous sessions`
                  : undefined
              }
              tabIndex={sessions.length > 1 ? 0 : undefined}
            >
              <div className="grid h-full auto-cols-[minmax(14rem,1fr)] grid-flow-col grid-rows-[auto_1fr] gap-1.5 md:auto-cols-fr">
                {sessions.map((item, index) => (
                  <div
                    key={`${item.title}-${item.location ?? ""}`}
                    className="row-span-2 grid min-w-0 grid-rows-subgrid rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 wrap-anywhere lg:px-3.5"
                  >
                    <div>
                      {index === 0 ? (
                        <>
                          <time className="block text-[11px]/tight font-medium text-[var(--day-accent)] tabular-nums">
                            {time}
                          </time>
                          {sessions.length > 1 ? (
                            <p className="mt-1 text-xs text-white/70 md:hidden">
                              Scroll to view {sessions.length} simultaneous sessions →
                            </p>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                    <div>
                      <h4 className="font-eigen-sans text-sm/snug font-medium! text-white/90 md:text-xs/snug lg:text-[13px]/snug">
                        {item.title}
                      </h4>
                      {item.location ? (
                        <p className="mt-1 text-[11px]/snug text-white/60">
                          <span className="sr-only">Room: </span>
                          {item.location}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function EigenAISchedule({
  schedule,
}: {
  schedule: readonly EigenAIScheduleDay[];
}) {
  const { days, boundaries } = buildScheduleTimeline(schedule);
  const aligned = boundaries.length > 1;

  return (
    <EigenGlassSurface asChild>
      <div
        data-testid="eigenai-schedule"
        className={clsx(
          "grid gap-6 rounded-3xl p-3 sm:p-4 md:grid-cols-2 md:gap-x-3 lg:gap-x-4",
          aligned && "md:gap-y-0 md:[grid-template-rows:var(--schedule-rows)]",
        )}
        style={aligned ? {
          "--schedule-rows": `auto repeat(${boundaries.length - 1}, minmax(1rem, auto))`,
        } as CSSProperties : undefined}
      >
        {days.map((day) => (
          <ScheduleDay key={day.date} {...day} aligned={aligned} />
        ))}
      </div>
    </EigenGlassSurface>
  );
}
