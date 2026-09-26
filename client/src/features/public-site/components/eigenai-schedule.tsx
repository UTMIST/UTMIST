import { EigenGlassSurface } from "@/features/public-site/components/eigenai-surfaces";

type ScheduleItem = { time: string; title: string; description?: string; location: string };
type ScheduleDay = { date: string; day: string; items: ScheduleItem[] };

const description = "Session details will be announced soon.";
const location = "Room TBA";
const schedule: ScheduleDay[] = [
  {
    day: "Day 1",
    date: "Saturday, October 3",
    items: [
      { time: "9:00 AM", title: "Opening Session", description, location },
      { time: "10:00 AM", title: "Session Title", location },
      { time: "11:00 AM", title: "Session Title", description, location },
      { time: "12:00 PM", title: "Lunch Break", location },
      { time: "1:00 PM", title: "Session Title", location },
      { time: "2:00 PM", title: "Session Title", description, location },
      { time: "3:00 PM", title: "Session Title", location },
      { time: "4:00 PM", title: "Closing Session", location },
    ],
  },
  {
    day: "Day 2",
    date: "Sunday, October 4",
    items: [
      { time: "9:00 AM", title: "Welcome Back", description, location },
      { time: "10:00 AM", title: "Session Title", location },
      { time: "11:00 AM", title: "Session Title", description, location },
      { time: "12:00 PM", title: "Lunch Break", location },
      { time: "1:00 PM", title: "Session Title", location },
      { time: "2:00 PM", title: "Session Title", description, location },
      { time: "3:00 PM", title: "Session Title", location },
      { time: "4:00 PM", title: "Closing Session", location },
    ],
  },
];

function ScheduleDay({ date, day, items }: ScheduleDay) {
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
        <ol className="divide-y divide-white/15">
          {items.map((item) => (
            <li
              key={`${date}-${item.time}`}
              className="grid gap-1.5 py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 sm:py-5"
            >
              <time className="text-xs font-semibold text-[#5edbe7] sm:text-sm">
                {item.time}
              </time>
              <div>
                <h4 className="font-eigen-sans text-base/tight font-medium! text-white sm:text-lg/tight">
                  {item.title}
                </h4>
                {item.description ? (
                  <p className="mt-1.5 text-xs/relaxed text-white/70 sm:mt-2 sm:text-sm/relaxed">
                    {item.description}
                  </p>
                ) : null}
                <p className="mt-1.5 text-[0.6875rem] font-medium tracking-[0.04em] text-[#dfd6ff] uppercase sm:mt-2 sm:text-xs">
                  {item.location}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </article>
    </EigenGlassSurface>
  );
}

export function EigenAISchedule() {
  return (
    <div data-testid="eigenai-schedule" className="grid gap-5 md:grid-cols-2 md:gap-8">
      {schedule.map((day) => <ScheduleDay key={day.date} {...day} />)}
    </div>
  );
}
