"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
    founderPanelSpeakers,
    researchPanelSpeakers,
    keynoteSpeakers,
    speakerSession
} from "./data";
import verticalEigenai from "@/assets/photos/eigenai-vertical.webp";
import workshopEigenai from "@/assets/photos/eigenai-workshop.webp";
import confEigenai from "@/assets/photos/eigenai-conference.webp";
import PeopleGrid from "@/components/peopleGrid";
import LamdaSection from "@/components/lambda";
import blueTick from "@/assets/icons/blue-tick-icon.svg";
import Workshops from "@/components/workshops";
import { Button } from "@/components/ui/button";

export default function EigenAIPage() {
    const GoogleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!GoogleMapsAPIKey) {
        throw new Error("Google Maps API key is not defined");
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = "//www.instagram.com/embed.js";
        document.body.appendChild(script);
    }, []);

    return (
        <main className="sm:items-start sm:justify-center">
            {/* Hero Section */}
            <div className="hero-section">
                <h2 className="hero-title">EigenAI</h2>
                <p className="hero-subtitle">Help shape the future of AI and ML @ UTMIST</p>
                <Button asChild className="ticket-button">
                    <a href="https://www.zeffy.com/en-CA/ticketing/eigenai--2025">Get Tickets!</a>
                </Button>
            </div>

            {/* Intro Section */}
            <div className="flex flex-col lg:flex-row items-center
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
            </div>

            {/* Image Gallery */}
            <div
                className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mx-auto px-4 md:px-8">
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

            {/* Schedule Section */}
            <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
                <h2 className="schedule-section-title text-2xl md:text-3xl lg:text-4xl mb-4">
                    Schedule
                </h2>

                <div className="w-full max-w-xl flex justify-center">
                    <blockquote
                        className="instagram-media w-full"
                        data-instgrm-permalink="https://www.instagram.com/p/DOyw_VokXbN/?utm_source=ig_embed&amp;utm_campaign=loading"
                        data-instgrm-version="14"
                        style={{
                            background: "#FFF",
                            border: 0,
                            borderRadius: "12px",
                            boxShadow: "0 0 4px rgba(0,0,0,0.15)",
                            margin: "0 auto",
                            maxWidth: "100%",
                            padding: 0,
                        }}
                    >
                        <a
                            href="https://www.instagram.com/p/DOyw_VokXbN/?utm_source=ig_embed&amp;utm_campaign=loading"
                            target="_blank"
                            rel="noreferrer"
                            className="block text-center w-full"
                        >
                            View this post on Instagram
                        </a>
                    </blockquote>
                </div>
            </div>

            {/* Keynote Speakers Section */}
            <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
                <h2 className="people-section-title text-2xl md:text-3xl lg:text-4xl">
                    Keynote Speaker
                </h2>

                <PeopleGrid people={keynoteSpeakers}/>
            </div>

            {/* Speakers Section */}
            <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
                <h2 className="people-section-title text-2xl md:text-3xl lg:text-4xl">
                    Speakers Session
                </h2>

                <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Agentic AI and The Future of Everything</i></h3>
                <PeopleGrid people={[speakerSession[0]]}/>
                <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Responsible AI 101: Building Trust in Tomorrow&apos;s Technology</i></h3>
                <PeopleGrid people={[speakerSession[1]]}/>
                <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>The Silent Layer: Privacy and Security at the Core of AI</i></h3>
                <PeopleGrid people={[speakerSession[2]]}/>
            </div>

            {/* Speakers Section */}
            <div className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
                <h2 className="people-section-title text-2xl md:text-3xl lg:text-4xl">
                    Panel Speakers
                </h2>

                <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Founders, Funders, and
                    Future AI</i></h3>
                <PeopleGrid people={founderPanelSpeakers}/>
                <h3 className="people-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>From Classroom to Lab:
                    Undergraduate Research Journeys</i></h3>
                <PeopleGrid people={researchPanelSpeakers}/>
            </div>

            <div className="py-24 px-8">
                <Workshops/>
            </div>

            {/* Lambda Section */}
            <div className="px-4 md:px-8">
                <LamdaSection/>
            </div>

            {/* Skill Levels Section */}
            <div className="flex flex-col justify-center items-center py-24 px-8 max-w-[1000px] mx-auto text-center">
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
                        style={{objectFit: "contain"}}
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
                        style={{objectFit: "contain"}}
                        className="flex-shrink-0"
                    />
                    <p className="lambda-skill-description">
                        Experts: Connect with professors and industry leaders to understand
                        ML applications in production and research
                    </p>
                </div>
            </div>
        </main>
    );
}
