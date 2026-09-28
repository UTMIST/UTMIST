import type { EigenAIScheduleDay } from "@/features/public-site/types/eigenai";

import { EigenGlassSurface } from "@/features/public-site/components/eigenai-surfaces";

function ScheduleDay({ date, day, items }: EigenAIScheduleDay) {
  return (
    <EigenGlassSurface className="rounded-4xl sm:rounded-[3.1648rem]">
      <article className="relative z-1 p-4 sm:p-8 lg:p-10">
        <header className="border-b border-white/20 pb-4 sm:pb-5">
          <p className="text-xs font-medium tracking-[0.08em] text-[#5edbe7] uppercase sm:text-sm">
            {day}
          </p>
          <h3 className="font-eigen-sans mt-1 text-xl font-medium! text-white sm:text-3xl">
            {date}
          </h3>
        </header>
        {items.length === 0 ? (
          <p className="py-4 text-white/70">Sessions will be announced soon.</p>
        ) : null}
        <ol className="divide-y divide-white/15">
          {items.map((item) => (
            <li
              key={`${date}-${item.time}-${item.title}`}
              className="grid gap-1.5 py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 sm:py-5"
            >
              <time className="text-xs font-semibold text-[#5edbe7] sm:text-sm">
                {item.time}
              </time>
              <div className="min-w-0 wrap-anywhere">
                <h4 className="font-eigen-sans text-base/tight font-medium! text-white sm:text-lg/tight">
                  {item.title}
                  {item.location ? (
                    <span className="ml-2 text-[0.6875rem] font-medium tracking-[0.04em] text-[#dfd6ff] uppercase sm:text-xs">
                      · {item.location}
                    </span>
                  ) : null}
                </h4>
                {item.description ? (
                  <p className="mt-1.5 text-xs/relaxed text-white/70 sm:mt-2 sm:text-sm/relaxed">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </article>
    </EigenGlassSurface>
  );
}

export function EigenAISchedule({
  schedule,
}: {
  schedule: readonly EigenAIScheduleDay[];
}) {
  return (
    <div
      data-testid="eigenai-schedule"
      className="grid gap-5 md:grid-cols-2 md:gap-8"
    >
      {schedule.map((day) => (
        <ScheduleDay key={day.date} {...day} />
      ))}
    </div>
  );
}
