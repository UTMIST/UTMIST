import "@/styles/eigenai.css";
import Image from "next/image";
import verticalEigenai from "@/assets/photos/eigenai-vertical.webp";
import workshopEigenai from "@/assets/photos/eigenai-workshop.webp";
import confEigenai from "@/assets/photos/eigenai-conference.webp";
import SpeakersGrid from "@/components/speakers";
import LamdaSection from "@/components/lambda";
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import BasisVectors from "@/components/basisvectors";

export default function EigenAIPage() {
  return (
    <main className="pt-24 sm:items-start sm:justify-center">
      <div className="hero-section px-4 md:px-8">
        <h2 className="hero-title text-4xl md:text-5xl lg:text-6xl">EigenAI</h2>
        <p className="hero-subtitle text-sm md:text-base px-4 md:px-8 lg:px-16">
          Help shape the future of AI and ML at UTMIST
        </p>
        <button className="ticket-button mt-4">Coming Soon</button>
      </div>
      <section className="flex flex-col lg:flex-row w-full gap-6 md:gap-8 items-start justify-center px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="w-full lg:w-1/2 max-w-md lg:max-w-lg">
          <h2 className="intro-section-title">What is EigenAI?</h2>
          <p className="intro-section-description">
            EigenAI is a UTMIST and CSSU conference exploring AI through diverse
            perspectives. Named after eigenvectors, it builds industry-academia
            connections, showcases various AI applications, offers hands-on
            workshops, and meets participants where they are.
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 md:gap-4">
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
      </section>

      <section className="speakers-section">
        <SpeakersGrid speakers={speakers} />
      </section>
      <section className="eigen-section">
        <LamdaSection />
      </section>
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

import * as speakerPhotos from "@/assets/photos/speakers";

const speakers = [
  {
    name: "Amrit Krishnan",
    role: "Technical Team Lead at Vector Institute",
    profileURL: "",
    profileImage: speakerPhotos.Amrit,
  },
  {
    name: "Devang Sharma",
    role: "Engineer at Amazon",
    profileURL: "",
    profileImage: speakerPhotos.Devang,
  },
  {
    name: "Tyler Smith",
    role: "Software Engineer at AI Warehouse",
    profileURL: "",
    profileImage: speakerPhotos.Tyler,
  },
  {
    name: "Priyanka Velagala",
    role: "Speaker",
    profileURL: "",
    profileImage: speakerPhotos.Priyanka,
  },
  {
    name: "Marcelo Ponce",
    role: "Professor at University of Toronto",
    profileURL: "",
    profileImage: speakerPhotos.Marcelo,
  },
  {
    name: "Mustafa Khan",
    role: "Technical Director at aUToronto",
    profileURL: "",
    profileImage: speakerPhotos.Mustafa,
  },

  {
    name: "Ryan Koh",
    role: "Postdoctoral Fellow at UofT/KITE-UHN",
    profileURL: "",
    profileImage: speakerPhotos.Ryan,
  },
];
