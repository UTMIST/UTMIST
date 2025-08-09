"use client";
import "@/styles/ai2.css";
import { AI2Card } from "@/components/ai2-cards";
import SpeakersGrid from "@/components/speakers";
import Image from "next/image";

import * as ai2Assets from "@/assets/photos/ai2";
import * as headshots from "@/assets/photos/ai2/headshots";

const specialThanks = [
  { name: "Andrew", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.andrew },
  { name: "Doga Baskan", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.doga },
  { name: "Kaden Seto", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.kaden },
  { name: "Martin Tin", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.martin },
  { name: "Matthew Tamura", role: "Eng Sci @ UofT", profileURL: "", profileImage: headshots.matthew },
  { name: "Ambrose Ling", role: "ECE @ UofT", profileURL: "", profileImage: headshots.ambrose },
];

const aiSquaredDetails = [
  { image: ai2Assets.cube_1.src, title: "Explore the realm of RL", text: "Explore RL policies and algorithms to see how each behaves in-game." },
  { image: ai2Assets.cube_2.src, title: "Train your own agent", text: "Train your agent by tuning rewards and hyperparameters to optimize your strategy." },
  { image: ai2Assets.cube_3.src, title: "Battle with other opponents", text: "Battle other agents, observe diverse play styles, and iterate on your approach." },
];

const newFeatures = [
  { 
    title: "New Weapons", 
    desc: "Unleash devastating new weapons that can turn the tide of battle — adapt your strategy or be outmatched!", 
    img: ai2Assets.new_weapons.src 
  },
  { 
    title: "Interactive Environment", 
    desc: "Battle in arenas that fight back — use moving platforms, hazards, and destructible terrain to outsmart your opponent.", 
    img: ai2Assets.interactive_environment.src 
  },
  { 
    title: "Better Customization", 
    desc: "Tailor your agent’s skills, style, and personality to dominate the competition in your own unique way.", 
    img: ai2Assets.better_customization.src 
  },
];

const timelineEvents = [
  { date: "October 25: Kickoff", detail: "A day of workshops and guest speakers", width: "100%" },
  { date: "October 25 — November 1", detail: "Build and train your agent, fight other opponents", width: "80%" },
  { date: "November 2", detail: "Watch the top teams battle it out in the bracket", width: "60%" },
];

function TimelineCard({ date, detail, width, delay }: { date: string; detail: string; width: string; delay: number }) {
  return (
    <div
      className={`timeline-card delay-${delay} rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-4 md:p-8`}
      style={{ width }}
    >
      <div className="text-lg md:text-3xl font-bold text-white text-right mb-2">{date}</div>
      <div className="text-base md:text-lg text-white text-right">{detail}</div>
    </div>
  );
}

export default function AI2Page() {
  return (
    <main>
      <div className="bg">
        {/* Hero Section */}
        <div className="hero-section">
          <h2 className="hero-title">AI Squared</h2>
          <p className="hero-subtitle">Canada&apos;s largest Reinforcement Learning Hackathon</p>
          <p className="hero-subtitle-gradient">(Brought to you by the Academics Dept.)</p>
        </div>

        {/* Intro Section */}
        <section className="items-center md:items-start max-w-4xl mx-auto px-4">
          <h2 className="intro-section-title">What is AI Squared?</h2>
          <p className="intro-section-description px-6 sm:px-8 md:px-0">
            AI Squared is the inaugural reinforcement learning tournament run by UTMIST. The tournament centers
            around groups of students competing to design the best machine learning agent in a smash-bros style
            platform fighting game. The tournament will be held in an elimination bracket format with consecutive
            rounds of agents facing off 1v1 until a final winner is determined. You can find our open-source environment and server code <a href="https://github.com/kseto06/UTMIST-AI2-2025" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>!
          </p>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          {aiSquaredDetails.map((step, i) => (
            <div className="flex items-center mb-8 last:mb-0" key={i}>
                <Image
                  src={step.image}
                  alt="Cube"
                  className="w-24 h-24 mr-8 object-contain"
                  width={96}
                  height={96}
                /> 
                <div>
                <h3 className="how-it-works-h1">{step.title}</h3>
                <p className="how-it-works-p">{step.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* What's New Section */}
        <section className="mt-16">
          <h2 className="whats-new-title">What&apos;s New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-6 max-w-5xl mx-auto justify-items-center">
            {newFeatures.map((card, i) => (
              <AI2Card key={i} title={card.title} description={card.desc} image={card.img} />
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-10 md:py-16">
          <h2 className="timeline-section-title text-center mb-6">Timeline</h2>
          <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-10 items-center md:items-end justify-end px-4 md:px-8">
            {timelineEvents.map((event, i) => (
              <TimelineCard key={i} date={event.date} detail={event.detail} width={event.width} delay={i + 1} />
            ))}
          </div>
        </section>

        {/* YouTube Section */}
        <section>
          <h2 className="timeline-section-title text-center mb-6">Check Out Our YouTube!</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-10">
            <div className="flex-1 max-w-[500px] w-full">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl p-6 shadow transition-shadow duration-300 hover:shadow-xl shadow-[#1E19B1]/50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/zOmkgw6jru4"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Special Thanks Section */}
        <section className="speakers-section">
          <SpeakersGrid speakers={specialThanks} />
        </section>
      </div>
    </main>
  );
}
