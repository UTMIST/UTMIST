"use client";
import "@/styles/ai2.css";
import { AI2Card } from "@/components/ai2-cards";
import SpeakersGrid from "@/components/speakers";

import * as ai2Assets from "@/assets/photos/ai2";
import * as specialThanksPhotos from "@/assets/photos/headshots";

const specialThanks = [
  { name: "Andrew", role: "Engineer @ UofT", profileURL: "", profileImage: specialThanksPhotos.andrew },
  { name: "Doge Baskan", role: "Organizer", profileURL: "", profileImage: specialThanksPhotos.doga },
  { name: "Kaden Seto", role: "Organizer", profileURL: "", profileImage: specialThanksPhotos.kaden },
  { name: "Martin Tin", role: "Organizer", profileURL: "", profileImage: specialThanksPhotos.martin },
  { name: "Matthew Tamura", role: "Organizer", profileURL: "", profileImage: specialThanksPhotos.matthew },
];

const howItWorksSteps = [
  { title: "Explore the realm of RL", text: "Help shape the future of AI and ML at UTMIST" },
  { title: "Train your own agent", text: "Help shape the future of AI and ML at UTMIST" },
  { title: "Battle with other opponents", text: "Help shape the future of AI and ML at UTMIST" },
];

const whatsNewCards = [
  { title: "New Weapons", desc: "Exciting new weapons to try!", img: ai2Assets.new_weapons.src },
  { title: "Interactive Environment", desc: "Engage with dynamic environments!", img: ai2Assets.interactive_environment.src },
  { title: "Better Customization", desc: "Personalize your agent like never before!", img: ai2Assets.better_customization.src },
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
          <p className="hero-subtitle">Canada’s largest Reinforcement Learning Hackathon</p>
          <p className="hero-subtitle-gradient">(Brought to you by the Academics Dept.)</p>
        </div>

        {/* Intro Section */}
        <section className="items-center md:items-start max-w-4xl mx-auto px-4">
          <h2 className="intro-section-title">What is AI Squared?</h2>
          <p className="intro-section-description">
            AI Squared is the inaugural reinforcement learning tournament run by UTMIST. The tournament centers
            around groups of students competing to design the best machine learning agent in a smash-bros style
            platform fighting game. The tournament will be held in an elimination bracket format with consecutive
            rounds of agents facing off 1v1 until a final winner is determined.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          {howItWorksSteps.map((step, i) => (
            <div className="flex items-center mb-8 last:mb-0" key={i}>
              <img src={ai2Assets.cube.src} alt="Cube" className="w-24 h-24 mr-8" />
              <div>
                <h3 className="how-it-works-h1">{step.title}</h3>
                <p className="how-it-works-p">{step.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* What's New Section */}
        <section className="mt-30">
          <h2 className="whats-new-title">What's New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-40 p-8 bg-gradient-to-b min-h-screen max-w-5xl mx-auto justify-items-center">
            {whatsNewCards.map((card, i) => (
              <AI2Card key={i} title={card.title} description={card.desc} image={card.img} />
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-10 md:py-20">
          <h2 className="timeline-section-title text-xl md:text-2xl text-center md:text-right mb-6">Timeline</h2>
          <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-12 items-center md:items-end justify-end px-4 md:px-8">
            {timelineEvents.map((event, i) => (
              <TimelineCard key={i} date={event.date} detail={event.detail} width={event.width} delay={i + 1} />
            ))}
          </div>
        </section>

        {/* YouTube Section */}
        <section>
          <h2 className="section-title text-xl md:text-2xl text-center mb-6">Check Out Our YouTube!</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-16">
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
