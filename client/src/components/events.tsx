import EventCard from "./cards/events-card";
import "../styles/home.css";
import { Event } from "@/app/types/home";

export default function Events() {
    const events: Event[] = [
        {
            title: "EigenAI",
            description: "A student-led AI conference featuring hands-on workshops, expert talks, and diverse perspectives across fields like fintech, healthcare, and robotics.",
            url: "https://eigenai.ca/"
        },
        {
            title: "AI^2",
            description: "A student-led AI conference featuring hands-on workshops, expert talks, and diverse perspectives across fields like fintech, healthcare, and robotics.",
            url: "https://eigenai.ca/"
        },
        {
            title: "GenAI Genesis",
            description: "A student-led AI conference featuring hands-on workshops, expert talks, and diverse perspectives across fields like fintech, healthcare, and robotics.",
            url: "https://eigenai.ca/"

        }
    ];

    return (
        <section className="events-section">
            <h1 className="events-title">
                Workshops, hackathons, and conferences to level up your AI journey.
            </h1>
            <div className="events-grid">
                {events.map((event, index) => (
                    <EventCard
                        key={index}
                        title={event.title}
                        description={event.description}
                        url={event.url}
                    />
                ))}
            </div>
        </section>
    );
}