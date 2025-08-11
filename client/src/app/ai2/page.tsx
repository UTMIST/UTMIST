"use client";
import "@/styles/ai2.css";
import { AI2Card } from "@/components/cards/ai2-new-feature-card";
import PeopleGrid from "@/components/peopleGrid";
import Image from "next/image";
import { Chrono } from 'react-chrono';
import {
  specialThanks,
  aiSquaredDetails,
  newFeatures,
  timelineEvents,
  ai2Logo
} from './data';

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
        <section className="intro items-center md:items-start max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <Image
              className="h-64 w-auto"
              src={ai2Logo}
              alt="AI2 Logo"
            />  
          </div>          
          <h2>Join us for an incredible experience</h2>
          <p className="px-6 sm:px-8 md:px-0">
            Welcome back for UTMIST AI Squared 2025 Fall Split! Centered around groups of participants competing 
            to design the best agent in a custom platform fighting game, AI Squared brings together individuals of all skill 
            levels in a encouraging learning environment filled with fun and excitement! 
            You can find our open-source environment and server code <a href="https://github.com/kseto06/UTMIST-AI2-2025" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>!
          </p>  
          <p className="px-6 sm:px-8 md:px-0">
            There will be workshops, speakers, as well as the grand finals. The tournament will be held in an double elimination bracket format which will have consecutive rounds of 
            agents facing off 1v1 until the winner is crowned. Who will stand tall? Will it be you?
          </p>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>How it Works</h2>
          {aiSquaredDetails.map((step, i) => (
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
                <h3 className="how-it-works-h1">{step.title}</h3>
                <p className="how-it-works-p">{step.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* What's New Section */}
        <section className="new-features">
          <h2 className="intro-section-title">What&apos;s New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-6 max-w-5xl mx-auto justify-items-center">
            {newFeatures.map((card, i) => (
              <AI2Card key={i} title={card.title} description={card.desc} image={card.img} />
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline py-10 md:py-16 timeline-section">
          <h2>Timeline</h2>
          <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center justify-end px-4 md:px-8">
              <Chrono
                items={timelineEvents}
                mode="VERTICAL"
                disableToolbar
                highlightCardsOnHover
                cardHeight={50}
                theme={{
                  primary: "rgba(106, 102, 245, 0.6)",
                  secondary: "rgba(0, 0, 0, 0.1)",
                  
                  cardBgColor: "#ffffff",
                  cardTitleColor: "#000000",
                  cardSubtitleColor: "#000000",
                  cardDetailsColor: "#000000",
                  
                  shadowColor: "rgba(106, 102, 245, 0.6)",
                  glowColor: "rgba(106, 102, 245, 0.6)"
                }}
              />
          </div>
        </section>

        {/* YouTube Section */}
        <section className="youtube">
          <h2>Check Out Our YouTube!</h2>
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
        <section className="organizers">
          <h2>Our Past Organizers</h2>
          <PeopleGrid people={specialThanks} />
        </section>
      </div>
    </main>
  );
}
