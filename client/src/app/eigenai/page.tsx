import "@/styles/eigenai.css";
import Image from "next/image";
import copresPhoto from "@/assets/photos/eigenai-copres-speech.webp";
import SpeakersGrid from "@/components/speakers";
import speakers from "@/assets/eigenai-speakers.json";
import LamdaSection from "@/components/lambda";
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import BasisVectors from "@/components/basisvectors";

export default function EigenAIPage() {
  return (
    <main>
      <div className="hero-section">
        <h2 className="hero-title">EigenAI</h2>
        <p className="hero-subtitle">
          Help shape the future of AI and ML at UTMIST
        </p>
        <button className="ticket-button">Get Your Tickets Now</button>
      </div>
      <section className="intro-section">
        <div className="intro-section-left">
          <h2 className="intro-section-title">What is EigenAI?</h2>
          <p className="intro-section-description">
            EigenAI is a UTMIST and CSSU conference exploring AI through diverse
            perspectives. Named after eigenvectors, it builds industry-academia
            connections, showcases various AI applications, offers hands-on
            workshops, and meets participants where they are.
          </p>
        </div>
        <div className="intro-section-right">
          <div className="intro-card-image">
            <Image
              src={copresPhoto}
              alt={"eigenai"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>
      <section className="speakers-section">
        <SpeakersGrid speakers={speakers} />
      </section>
      <section className="eigen-section">
        <LamdaSection />
      </section>
      <section className="lambda-statement-section">
        <h2 className="lambda-statement-title">
          With over 500+ participants, EigenAI is built for AI practitioners of
          all skill levels
        </h2>
        <div className="lambda-skill-row">
          <Image
            key={"blue-tick-1"}
            src={blueTick}
            alt={"Blue Tick Icon"}
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
          />
          <p className="lambda-skill-description">
            Begineers: Learn fundamentals of AI/ML, meet peers and build your
            network within UTMIST
          </p>
        </div>
        <div className="lambda-skill-row">
          <Image
            key={"blue-tick-2"}
            src={blueTick}
            alt={"Blue Tick Icon"}
            width={20}
            height={20}
            objectFit="cover"
          />
          <p className="lambda-skill-description">
            Enthusiasts: Explore professional networking and internships, learn
            about latest AI applications in industry
          </p>
        </div>
        <div className="lambda-skill-row">
          <Image
            key={"blue-tick-3"}
            src={blueTick}
            alt={"Blue Tick Icon"}
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
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
