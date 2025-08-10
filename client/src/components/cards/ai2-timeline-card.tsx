
import {
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";



export function AI2TimelineCard({ date, body, title }: { date: string; body: string; title: string }) {
  return (
    <TimelineItem>
      <TimelinePoint/>
      <TimelineContent>
        <TimelineTime>{date}</TimelineTime>
        <TimelineTitle className="dark:text-grey-900">{title}</TimelineTitle>
        <TimelineBody>{body}</TimelineBody>
      </TimelineContent>
    </TimelineItem>
  );
}