import "@/styles/eigenai.css";
import Image from "next/image";
import { speakers } from "./data";
import verticalEigenai from "@/assets/photos/eigenai-vertical.webp";
import workshopEigenai from "@/assets/photos/eigenai-workshop.webp";
import confEigenai from "@/assets/photos/eigenai-conference.webp";
import PeopleGrid from "@/components/peopleGrid";
import LamdaSection from "@/components/lambda";
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import BasisVectors from "@/components/basisvectors";

export default function EigenAIPage() {
    const GoogleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!GoogleMapsAPIKey) {
        throw new Error("Google Maps API key is not defined");
    }

    return (
    <main className="sm:items-start sm:justify-center">
        {/* Hero Section */}
        <div className="hero-section">
            <h2 className="hero-title">EigenAI</h2>
            <p className="hero-subtitle">Help shape the future of AI and ML @ UTMIST</p>
            <button className="ticket-button">
                <a href="https://www.zeffy.com/en-CA/ticketing/eigenai--2025">Get Tickets!</a>
            </button>
        </div>

        {/* Intro Section */}
        <section className="flex flex-col lg:flex-row items-center
            lg:items-start justify-center gap-6 md:gap-8 px-4 md:px-6 lg:px-8 py-6 md:py-8 mx-auto w-full">
            <div className="w-full lg:w-1/2 max-w-md lg:max-w-lg">
              <h2 className="intro-section-title">What is EigenAI?</h2>
              <h3 className="intro-section-subtitle">September 20-21, 2025 | In-Person @ OISE, UofT</h3>
              <p className="intro-section-description">
                  EigenAI is a UTMIST flagship conference introducing students
                  to the world of AI, ML, software, and emerging technologies.
                  Through panels and workshops covering both fundamental and
                  advanced topics, participants gain hands-on experience and
                  practical insights. This year’s theme is Mapping AI through
                  the Multiverse, which invites students to journey through the
                  many dimensions of AI, allowing them to explore the field from
                  multiple perspectives and hear from professionals across diverse
                  industries. Beyond technical talks and workshops, students
                  have the opportunity to build their professional network and
                  connect with industry leaders, academic professionals, and like-minded peers.
              </p>
            </div>

            <iframe
                className="rounded-xl md:rounded-2xl shadow-lg w-full lg:w-1/2 max-w-lg aspect-[4/3]"
                title="Google Maps Location"
                width="600"
                height="350"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${GoogleMapsAPIKey}&q=OISE,252+Bloor+St+W,Toronto+ON`}>
            </iframe>
        </section>

        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mx-auto px-4 md:px-8">
            <div className="w-full sm:w-1/2 aspect-[4/3] relative">
                <Image
                    src={verticalEigenai}
                    alt="Executive photo from EigenAI event"
                    fill
                    className="rounded-xl md:rounded-2xl object-cover"
                />
            </div>

            <div className="w-full sm:w-1/2 flex flex-col gap-3 md:gap-4">
                <div className="aspect-[4/3] relative w-full">
                    <Image
                        src={workshopEigenai}
                        alt="Co-president speech at EigenAI"
                        fill
                        className="rounded-xl md:rounded-2xl object-cover"
                    />
                </div>
                <div className="aspect-[4/3] relative w-full">
                    <Image
                        src={confEigenai}
                        alt="Fibonacci sequence visualization"
                        fill
                        className="rounded-xl md:rounded-2xl object-cover"
                    />
                </div>
            </div>
        </div>

      {/* Speakers Section */}
      <section className="people-section px-4 md:px-8">
        <h2 className="people-section-title text-2xl md:text-3xl lg:text-4xl">
            Past Speakers
        </h2>
        <PeopleGrid people={speakers} />
      </section>

      {/* Lambda Section */}
      <section className="eigen-section px-4 md:px-8">
        <LamdaSection />
      </section>

      {/* Skill Levels Section */}
      <section className="lambda-statement-section px-4 md:px-8">
        <h2 className="lambda-statement-title text-2xl md:text-3xl lg:text-4xl">
          With over 500+ participants, EigenAI is built for AI practitioners of
          all skill levels
        </h2>
        <div className="lambda-skill-row flex-col sm:flex-row items-start sm:items-center">
          <Image
            key={"blue-tick-1"}
            src={blueTick}
            alt={"Blue Tick Icon"}
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
            className="flex-shrink-0"
          />
          <p className="lambda-skill-description">
            Begineers: Learn fundamentals of AI/ML, meet peers and build your
            network within UTMIST
          </p>
        </div>
        <div className="lambda-skill-row flex-col sm:flex-row items-start sm:items-center">
          <Image
            key={"blue-tick-2"}
            src={blueTick}
            alt={"Blue Tick Icon"}
            width={20}
            height={20}
            objectFit="cover"
            className="flex-shrink-0"
          />
          <p className="lambda-skill-description">
            Enthusiasts: Explore professional networking and internships, learn
            about latest AI applications in industry
          </p>
        </div>
        <div className="lambda-skill-row flex-col sm:flex-row items-start sm:items-center">
          <Image
            key={"blue-tick-3"}
            src={blueTick}
            alt={"Blue Tick Icon"}
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
            className="flex-shrink-0"
          />
          <p className="lambda-skill-description">
            Experts: Connect with professors and industry leaders to understand
            ML applications in production and research
          </p>
        </div>
      </section>

      <section className="basis-section">
        <BasisVectors />
      </section>
    </main>
    );
}
