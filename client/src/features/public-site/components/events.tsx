"use client";
import { homeContent } from "@/features/public-site/data/home-content";
import EventCard from "@/features/public-site/components/cards/events-card";
import { homeEvents } from "@/features/public-site/data/home-events";
import "@/styles/home.css";

export default function Events() {
  return (
    <section className="events-section">
      <h1 className="events-title">
        {homeContent.eventsHeading}
      </h1>

      <div className="flex flex-col gap-6 px-4 max-w-4xl mx-auto">
        {homeEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            url={event.url}
          />
        ))}
      </div>
    </section>
  );
}
