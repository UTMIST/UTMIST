"use client";
import "@/styles/ai2.css";
import { useState } from "react";
import { AI2Card } from "@/components/cards/ai2-new-feature-card";
import PeopleGrid from "@/components/peopleGrid";
import Image from "next/image";
import { Chrono } from 'react-chrono';
import {
  specialThanks,
  aiSquaredDetails,
  newFeatures,
  kickOff,
  finalsBracket,
  ai2Logo,
  agentDevelopment,
  sponsorsLogos
} from './data';
import { ai2speakers, panelSpeakers } from "./data";
// import Leaderboard from "@/components/Leaderboard";

// Types
interface TimelineItem {
  title: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
}

interface FeatureCard {
  title: string;
  desc: string;
  img: string;
}

interface StepDetail {
  image: string;
  title: string;
  text: string;
}

export default function AI2Page() {
  const [activeButton, setActiveButton] = useState<string>("November 2");

  const handleButtonClick = (buttonId: string): void => {
    setActiveButton(buttonId);
  };

  // const scrollToLeaderboard = () => {
  //   const leaderboardSection = document.getElementById('leaderboard-section');
  //   if (leaderboardSection) {
  //     leaderboardSection.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start'
  //     });
  //   }
  // };

  return (
    <main>
      <div className="bg">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">AI Squared</h1>
          <p className="hero-subtitle">(Brought to you by the Academics Department)</p>
          <p className="hero-subtitle-gradient">October 25 - November 2, 2025</p>
          <p className="hero-subtitle-gradient">In-person + Online</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="ticket-button">
              <a href="https://luma.com/jjw2v8rp">Apply!</a>
            </button>
            {/*<button className="leaderboard-button" onClick={scrollToLeaderboard}>*/}
            {/*  Show Leaderboard*/}
            {/*</button>*/}
          </div>
        </div>

        {/* Intro Section */}
        <section className="intro items-center md:items-start max-w-4xl mx-auto px-4">
          <div className="flex flex-col justify-center gap-">

            <div className="flex justify-center">
              <Image
                className="h-64 w-auto"
                src={ai2Logo}
                alt="AI2 Logo"
              />
            </div>
            <h1 className="ai2-h1">Join us for an incredible experience</h1>
            <p className="px-6 sm:px-8 md:px-0">
              Welcome back for UTMIST AI Squared 2025 Fall Split! Centered around groups of participants competing
              to design the best AI agent in a custom platform fighting game, AI Squared brings together individuals of all skill
              levels in a encouraging learning environment filled with fun and excitement!
            </p>
            <p className="px-6 sm:px-8 md:px-0">
              There will be workshops, speakers, as well as the grand finals. The tournament will be held in an double elimination bracket format of consecutive rounds of
              agents facing off 1v1 until the winner is crowned. Who will stand tall? Will it be you?
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h1 className="ai2-h1 mb-8">How it Works</h1>
          {aiSquaredDetails.map((step: StepDetail, i: number) => (
            <div
              className="flex items-center mb-8 last:mb-0 "
              key={i}
              style={{ background: 'radial-gradient(circle, rgba(103,128,253,0.2) 0%, rgba(103,128,253,0) 100%)' }}
            >
                <Image
                  src={step.image}
                  alt="Cube"
                  className="w-36 h-36 mr-8 object-contain"
                  width={96}
                  height={96}
                />
                <div>
                <h3 className="how-it-works-h3">{step.title}</h3>
                <p className="how-it-works-p">{step.text}</p>
              </div>
            </div>
          ))}
          <h2 className="ai2-h2 text-center">
            Find our open-source environment and server code <a href="https://github.com/UTMIST/UTMIST-AI2" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>
          </h2>
        </section>

        {/* Leaderboard */}
        {/*<section id="leaderboard-section" className="leaderboard-section mb-16">*/}
        {/*  <Leaderboard tableName="ai2_leaderboard" limit={10} />*/}
        {/*</section>*/}

        {/* YouTube Section */}
        <section className="youtube mb-12">
          <h1 className="ai2-h1">Check out the game!</h1>
          <div className="flex flex-col md:flex-row items-center justify-center px-8 py-10">
            <div className="flex-1 max-w-[600px] w-full">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl p-6 shadow transition-shadow duration-300 hover:shadow-xl shadow-[#1E19B1]/50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/oaU9cUHoIdg?si=CJwTBo02mpRYcEoC"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section className="new-features">
          <h1 className="ai2-h1">What&apos;s New</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 max-w-5xl mx-auto justify-items-center">
            {newFeatures.map((card: FeatureCard, i: number) => (
              <AI2Card key={i} title={card.title} description={card.desc} image={card.img} />
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline py-10 md:py-16 timeline-section">
          <h1 className="ai2-h1">Schedule</h1>
          <div className="bg-white flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center mx-auto py-4 sm:py-6 rounded-xl sm:rounded-full w-full sm:w-fit px-4">
            {["October 25", "October 25 - November 1", "November 2"].map((label: string) => (
              <button
                key={label}
                onClick={() => handleButtonClick(label)}
                className={`text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-0 w-full sm:w-60 rounded-full border-2 relative overflow-hidden text-center transition-colors ${
                  activeButton === label
                    ? "text-white"
                    : "text-[rgba(106,102,245,0.6)] border-[rgba(106,102,245,0.6)]"
                }`}
                style={{
                  background: activeButton === label
                    ? "linear-gradient(to right, rgba(106,102,245,0.6), rgba(106,102,245,0.8))"
                    : "transparent",
                  transition: "background 0.25s ease-in-out",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-10 mb-4 text-center">
            <div
              className="inline-block px-4 py-2 rounded-xl"
              style={{
                background: "linear-gradient(90deg, rgba(106,102,245,0.12), rgba(106,102,245,0.06) 50%, rgba(106,102,245,0.12))",
                boxShadow: "0 6px 18px rgba(106,102,245,0.06)",
              }}
            >
              {activeButton === "October 25" && <h2 className="ai2-h2 m-0">Kickoff</h2>}
              {activeButton === "October 25 - November 1" && <h2 className="ai2-h2 m-0">Agent Development</h2>}
              {activeButton === "November 2" && <h2 className="ai2-h2 m-0">Expo</h2>}
            </div>
          </div>
          <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center justify-end px-4 md:px-8">
            {(() => {
              let timeline: TimelineItem[] = [];
              let lineWidth: number = 3;
              if (activeButton === "October 25") {
                timeline = kickOff as TimelineItem[];
              } else if (activeButton === "November 2") {
                timeline = finalsBracket as TimelineItem[];
              } else if (activeButton == "October 25 - November 1") {
                timeline = agentDevelopment as TimelineItem[];
                lineWidth = -1;
              }

              return (
                <Chrono
                  items={timeline}
                  mode="VERTICAL"
                  disableToolbar
                  highlightCardsOnHover
                  cardHeight={45}
                  timelinePointDimension={20}
                  lineWidth={lineWidth}
                  theme={{
                    primary: "rgba(106, 102, 245, 0.6)",
                    secondary: "ffffff",
                    titleColor: "#000000",
                    titleColorActive: "#000000",
                    cardBgColor: "#ffffff",
                    cardTitleColor: "#000000",
                    cardSubtitleColor: "#000000",
                    cardDetailsColor: "#000000",
                    shadowColor: "rgba(106, 102, 245, 0.6)",
                    glowColor: "rgba(106, 102, 245, 0.6)",
                  }}
                />
              );
            })()}
          </div>
        </section>

        {/* Sponsor */}
        <section className="mx-auto mb-16">
            <h1 className="ai2-h1 mb-10">Sponsors</h1>
            <div className="mt-8 grid grid-cols-2 gap-8 justify-items-center justify-center w-fit mx-auto gap-x-16">
              {sponsorsLogos.map((sponsor, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <a href={sponsor.url}><div className="w-40 h-30 flex items-center justify-center mb-8">
                    <Image
                      src={sponsor.image}
                      alt={`${sponsor.name} logo`}
                      className="object-contain"
                    />
                  </div> </a>
                  <h3 className="font-medium text-black">{sponsor.name}</h3>
                  <p className="text-sm text-gray-500"><i>{sponsor.tier}</i></p>
                </div>
              ))}
              </div>
              <div className="mt-10 items-center max-w-4xl mx-auto px-4 flex flex-col justify-center gap-4 pl-2 pr-2 text-center">
                <h1 className="ai2-h1">Become a sponsor!</h1>
                <p>None of our work would be possible without our sponsors. They unite developers,
                  designers, and ML enthusiasts globally with connections that go beyond the tournament.
                  Keep checking back for our sponsors for AI Squared Fall 2025!
                </p>
                <h2 className="ai2-h2">Want to help bring AI Squared to life?</h2>
                <p>Shoot us an email at <a href="mailto:partnerships@utmist.skule.ca" target="_blank" rel="noopener noreferrer" className="underline">partnerships@utmist.skule.ca</a>!</p>

              </div>
        </section>

        {/* Speakers */}
        <section className="speakers items-center max-w-2xl mx-auto px-4 text-center mb-16">
          <div className="gap-4">
            <h1 className="ai2-h1">Speakers Session</h1>
            <h3 className="speakers-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Intro to the RL Paradigm</i></h3>
            <PeopleGrid people={[ai2speakers[0]]}/>
            <h3 className="speakers-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>How the Gaming Inustry Is Shifting to Agents</i></h3>
            <PeopleGrid people={[ai2speakers[1]]}/>
            <h3 className="speakers-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Deploying neural networks on Tenstorrent Hardware</i></h3>
            <PeopleGrid people={[ai2speakers[2]]}/>
            <h3 className="speakers-section-subtitle text-2xl md:text-3xl lg:text-4xl"><i>Designing AI for Fun in Games</i></h3>
            <PeopleGrid people={[ai2speakers[3]]}/>
          </div>
        </section>

        <section className="speakers items-center max-w-2xl mx-auto px-4 text-center mb-16">
          <div className="gap-4">
            <h1 className="ai2-h1">Panel Speakers</h1>
            <h3 className="speakers-section-subtitle text-2xl md:text-3xl lg:text-4xl">
              <i>AI & Gaming Industry Panel: Applications of Machine Learning in Video Games</i>
            </h3>
            <PeopleGrid people={panelSpeakers}/>
          </div>
        </section>



        {/* Special Thanks Section */}
        <section className="organizers mb-16">
            <h1 className="ai2-h1 mb-8">Our Past Organizers</h1>
            <PeopleGrid people={specialThanks} />
        </section>
      </div>
    </main>
  );
}
