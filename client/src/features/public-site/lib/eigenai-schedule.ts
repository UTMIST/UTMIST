import type {
  EigenAIScheduleDay,
  EigenAIScheduleItem,
} from "@/features/public-site/types/eigenai";

function timeRange(label: string): readonly [number, number] | null {
  const match = label.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (!match) return null;

  const [, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] = match;
  const hours = [Number(startHour), Number(endHour)];
  const minutes = [Number(startMinute), Number(endMinute)];
  if (hours.some((hour) => hour < 1 || hour > 12) || minutes.some((minute) => minute > 59)) {
    return null;
  }

  const toMinutes = (hour: number, minute: number, period: string) =>
    (hour % 12) * 60 + minute + (period.toUpperCase() === "PM" ? 720 : 0);
  let start = toMinutes(hours[0], minutes[0], startPeriod ?? endPeriod);
  const end = toMinutes(hours[1], minutes[1], endPeriod);
  // A shared PM suffix can describe a session crossing noon, e.g. 11:30–12:30 PM.
  if (!startPeriod && start > end) start -= 720;
  return start >= 0 && start < end ? [start, end] : null;
}

export function buildScheduleTimeline(schedule: readonly EigenAIScheduleDay[]) {
  const days = schedule.map(({ day, date, items }) => {
    const grouped = new Map<string, EigenAIScheduleItem[]>();
    for (const item of items) {
      const sessions = grouped.get(item.time);
      if (sessions) sessions.push(item);
      else grouped.set(item.time, [item]);
    }
    return {
      day,
      date,
      slots: Array.from(grouped, ([time, sessions]) => ({
        time,
        sessions,
        range: timeRange(time),
      })),
    };
  });

  const aligned = days.length === 2 && days.every(
    (day) => day.slots.length > 0 && day.slots.every((slot) => slot.range !== null),
  );
  const boundaries = aligned
    ? [...new Set(days.flatMap((day) => day.slots.flatMap((slot) => slot.range ?? [])))].sort((a, b) => a - b)
    : [];

  return {
    boundaries,
    days: days.map((day) => ({
      ...day,
      slots: day.slots.map((slot) => ({
        ...slot,
        // Row 1 is the shared day header; subsequent lines mark event times.
        rowStart: aligned && slot.range ? boundaries.indexOf(slot.range[0]) + 2 : undefined,
        rowEnd: aligned && slot.range ? boundaries.indexOf(slot.range[1]) + 2 : undefined,
      })),
    })),
  };
}
