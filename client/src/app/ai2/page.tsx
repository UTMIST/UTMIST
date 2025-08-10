"use client";
import "@/styles/ai2.css";
import { AI2Card } from "@/components/cards/ai2-new-feature-card";
import { AI2TimelineCard } from "@/components/cards/ai2-timeline-card";
import SpeakersGrid from "@/components/speakers";
import Image from "next/image";
import { Timeline } from "flowbite-react";

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
  { image: ai2Assets.cube_1.src, title: "Explore the realm of RL", text: "Are you a beginner? Don't worry, we will show you the ropes!" },
  { image: ai2Assets.cube_2.src, title: "Train your own agent", text: "Brainstorm, experiment, and show us your best strategy" },
  { image: ai2Assets.cube_3.src, title: "Battle other opponents", text: "Jump onto the platforms and take down the competition!" },
];

const newFeatures = [
  { 
    title: "New Weapons", 
    desc: "Unleash devastating new weapons that can turn the tide of battle — adapt your strategy or be outmatched!", 
    img: ai2Assets.new_weapons.src 
  },
  { 
    title: "Interactive Environment", 
    desc: "Battle in arenas that fight back — use moving platforms, learn the new terrain to outsmart your opponent", 
    img: ai2Assets.interactive_environment.src 
  },
  { 
    title: "Better Customization", 
    desc: "Tailor your agent’s skills, style, and personality to dominate the competition in your own unique way", 
    img: ai2Assets.better_customization.src 
  },
];

const timelineEvents = [
  { date: "October 25", body: "A day of workshops and guest speakers", title: "Kickoff"},
  { date: "October 25 — November 1", body: "Build and train your agent fighters", title: "Agent Development"},
  { date: "November 2", body: "Watch the top teams battle it out in the bracket", title: "Finals Bracket"},
];

export default function AI2Page() {
  return (
    <main>
      <div className="bg">
        {/* Hero Section */}
        <div className="hero-section">
          <h2 className="hero-title">AI Squared</h2>
          <p className="hero-subtitle">(Brought to you by the Academics Dept.)</p>
          <p className="hero-subtitle-gradient">October 25 - Novemember 2, 2025</p>
          <p className="hero-subtitle-gradient">In-person + Online</p>
        </div>

        {/* Intro Section */}
        <section className="items-center md:items-start max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <Image
              className="h-64 w-auto"
              src={ai2Assets.logo_sketch}
              alt="AI2 Logo"
            />  
          </div>          
          <h2 className="intro-section-title">Join us for an incredible experience</h2>
          <p className="intro-section-description px-6 sm:px-8 md:px-0">
            Welcome back for UTMIST AI Squared 2025 Fall Split! Centered around groups of participants competing 
            to design the best agent in a custom platform fighting game, AI Squared brings together individuals of all skill 
            levels in a encouraging learning environment filled with fun and excitement! 
            You can find our open-source environment and server code <a href="https://github.com/kseto06/UTMIST-AI2-2025" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>!
          </p>  
          <p className="intro-section-description px-6 sm:px-8 md:px-0">
            There will be workshops, speakers, as well as the grand finals. The tournament will be held in an double elimination bracket format which will have consecutive rounds of 
            agents facing off 1v1 until the winner is crowned. Who will stand tall? Will it be you?
          </p>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <h2 className="intro-section-title">How it Works</h2>
          {aiSquaredDetails.map((step, i) => (
            <div 
              className="flex items-center mb-8 last:mb-0 " 
              key={i} 
              style={{background: 'radial-gradient(circle, rgba(103,128,253,0.3) 0%, rgba(103,128,253,0) 100%)'}}
            >
                <Image
                  src={step.image}
                  alt="Cube"
                  className="w-36 h-36 mr-8 object-contain"
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
        <section >
          <h2 className="intro-section-title">What&apos;s New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-6 max-w-5xl mx-auto justify-items-center">
            {newFeatures.map((card, i) => (
              <AI2Card key={i} title={card.title} description={card.desc} image={card.img} />
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-10 md:py-16 timeline-section">
          <h2 className="timeline-section-title text-center mb-6">Timeline</h2>
          <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center justify-end px-4 md:px-8">
            <Timeline className="relative border-l border-gray-200">
              {timelineEvents.map((event, i) => (
                <AI2TimelineCard key={i} date={event.date} body={event.body} title={event.title} />
              ))}
            </Timeline>
          </div>
        </section>

        {/* YouTube Section */}
        <section>
          <h2 className="timeline-section-title text-center mb-6">Check Out Our YouTube!</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-10">
            <div className="flex-1 max-w-[600px] w-full">
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
