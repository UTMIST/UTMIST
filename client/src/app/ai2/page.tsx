"use client";
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
      <div className="bg-cover bg-no-repeat bg-scroll bg-blend-lighten" style={{backgroundImage: 'url(/assets/photos/ai2/ai2_bg.png)', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-10 pb-16 mx-auto text-center min-h-[45vh] relative" style={{paddingTop: 'calc(5.5rem + env(safe-area-inset-top))'}}>
          <h1 className="text-5xl font-bold m-0" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>AI Squared</h1>
          <p className="text-base font-extralight text-gray-900 px-4 sm:px-60" style={{fontFamily: 'var(--system-font)'}}>(Brought to you by the Academics Department)</p>
          <p className="text-base font-normal mt-1.5 px-4 sm:px-48" style={{background: 'linear-gradient(#1E19B1, #0D0A4B)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)'}}>October 25 - November 2, 2025</p>
          <p className="text-base font-normal px-4 sm:px-48" style={{background: 'linear-gradient(#1E19B1, #0D0A4B)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)'}}>In-person + Online</p>
        </div>

        {/* Intro Section */}
        <div className="flex flex-col items-center md:items-start max-w-4xl mx-auto px-4">
          <div className="flex flex-col justify-center gap-">

            <div className="flex justify-center">
              <Image
                className="h-64 w-auto"
                src={ai2Logo}
                alt="AI2 Logo"
              />  
            </div>          
            <h1 className="text-4xl font-bold text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>Join us for an incredible experience</h1>
            <p className="px-6 sm:px-8 md:px-0 mt-2.5" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)'}}>
              Welcome back for UTMIST AI Squared 2025 Fall Split! Centered around groups of participants competing
              to design the best AI agent in a custom platform fighting game, AI Squared brings together individuals of all skill
              levels in a encouraging learning environment filled with fun and excitement!
            </p>
            <p className="px-6 sm:px-8 md:px-0 mt-2.5" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)'}}>
              There will be workshops, speakers, as well as the grand finals. The tournament will be held in an double elimination bracket format of consecutive rounds of
              agents facing off 1v1 until the winner is crowned. Who will stand tall? Will it be you?
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="flex flex-col items-center py-16 px-10 max-w-[500px] mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>How it Works</h1>
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
                <h3 className="text-xl font-bold" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)'}}>{step.title}</h3>
                <p className="text-[15px] font-bold" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)'}}>{step.text}</p>
              </div>
            </div>
          ))}
          <h2 className="text-2xl text-center">
            Find our open-source environment and server code <a href="https://github.com/UTMIST/UTMIST-AI2" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>
          </h2>
        </div>

        {/* YouTube Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>Check out the game!</h1>
          <div className="flex flex-col md:flex-row items-center justify-center px-8 py-10">
            <div className="flex-1 max-w-[600px] w-full">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl p-6 shadow transition-shadow duration-300 hover:shadow-xl shadow-[#1E19B1]/50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/srbaeBi_xmM?si=p9RwH4hTJqsA9RwG"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* What's New Section */}
        <div>
          <h1 className="text-4xl font-bold text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>What&apos;s New</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 max-w-5xl mx-auto justify-items-center">
            {newFeatures.map((card, i) => (
              <AI2Card key={i} title={card.title} description={card.desc} image={card.img} />
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="py-10 md:py-16">
          <h1 className="text-4xl font-bold text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>Timeline</h1>
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
        </div>

        {/* Become a sponsor */}
        <div className="items-center max-w-2xl mx-auto px-4 text-center mb-16">
          <div className="flex flex-col gap-4 pl-2 pr-2">
            <h1 className="text-4xl font-bold text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>Become a sponsor!</h1>
            <p>None of our work would be possible without our sponsors. They unite developers,
              designers, and ML enthusiasts globally with connections that go beyond the tournament.
              Keep checking back for our sponsors for AI Squared Fall 2025!
            </p>
            <h2 className="text-2xl">Want to help bring AI Squared to life?</h2>
            <p>Shoot us an email at <a href="mailto:partnerships@utmist.skule.ca" target="_blank" rel="noopener noreferrer" className="underline">partnerships@utmist.skule.ca</a>!</p>
          </div>
        </div>

        {/* Speakers */}
        <div className="items-center max-w-2xl mx-auto px-4 text-center mb-16">
          <div className="flex flex-col gap-4 pl-2 pr-2">
            <h1 className="text-4xl font-bold text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>Speakers</h1>
            <h2 className="text-2xl">Coming soon... so stay tuned!</h2>
          </div>
        </div>

        {/* Special Thanks Section */}
        <div className="mb-16">
            <h1 className="text-4xl font-bold mb-8 text-center" style={{background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--system-font)', textShadow: '5px 5px 8px rgba(0, 0, 0, 0.2)'}}>Our Past Organizers</h1>
            <PeopleGrid people={specialThanks} />
        </div>
      </div>
    </main>
  );
}
