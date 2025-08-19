"use client";
// import "keen-slider/keen-slider.min.css";
// import { useKeenSlider } from "keen-slider/react";
import EventCard from "./cards/events-card";
import "../styles/home.css";

interface Event {
  title: string;
  description: string;
  url: string;
}

export default function Events() {
  const events: Event[] = [
    {
      title: "EigenAI",
      description:
        "A student-led AI conference featuring hands-on workshops, expert talks, and diverse perspectives across fields like fintech, healthcare, and robotics.",
      url: "/eigenai",
    },
    {
      title: "CUCAI",
      description:
        "CUCAI (Canadian Undergraduate Conference on AI) is a national conference that showcases undergraduate AI research and connects students with industry leaders through workshops, and networking.",
      url: "https://cucai.ca",
    },
    {
      title: "AI Squared",
      description:
        "AI Squared is a machine learning tournament hosted by UTMIST where students build AI agents to compete in a 2D platform fighting game while gaining hands-on experience and mentorship.",
      url: "https://www.utmist.ca/ai2",
    },
    {
      title: "GenAI",
      description:
        "GenAI Genesis is Canada's largest AI hackathon, uniting over 700 participants to develop generative AI solutions addressing the U.N Sustainable Development Goals, powered by UTMIST and Google Developers",
      url: "https://genaigenesis.ca",
    },
  ];

  // const [sliderRef] = useKeenSlider<HTMLDivElement>({
  //   loop: false,
  //   mode: "free",
  //   slides: {
  //     perView: 1.2, // Default: ~1.2 cards on small screens
  //     spacing: 16,
  //   },
  //   breakpoints: {
  //     "(min-width: 640px)": {
  //       slides: {
  //         perView: 2.2, // Show ~2.2 cards on tablets
  //         spacing: 16,
  //       },
  //     },
  //     "(min-width: 1024px)": {
  //       slides: {
  //         perView: 3.2, // Show ~3.2 cards on desktops
  //         spacing: 16,
  //       },
  //     },
  //   },
  // });

  return (
    <section className="events-section">
      <h1 className="events-title">
        Workshops, hackathons, and conferences to level up your AI journey.
      </h1>

      <div className="flex flex-col gap-6 px-4 max-w-4xl mx-auto">
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
