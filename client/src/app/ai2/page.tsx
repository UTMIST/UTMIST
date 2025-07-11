"use client";
import "@/styles/ai2.css";
import { AI2Card } from "@/components/ai2-cards";
import { useState } from "react";
import Image from "next/image";
import ai2_demo from "@/assets/photos/ai2_demo.png";
import cube from "@/assets/photos/cube.gif";
import faces from "@/assets/photos/faces.png";
// import slider from "@/components/slider/slider";
import Slider from "@/components/slider/slider";
import img1 from "@/assets/photos/slider/img1.png";
import img2 from "@/assets/photos/slider/img2.png";
import img3 from "@/assets/photos/slider/img3.png";
import img4 from "@/assets/photos/slider/img4.png";

// import headshots from "@/assets/photos/headshots";
import andrew from "@/assets/photos/headshots/andrew_headshot.png";
import doga from "@/assets/photos/headshots/Doga_Baskan.jpg";
import kaden from "@/assets/photos/headshots/kaden-seto-headshot.jpg";
import martin from "@/assets/photos/headshots/Martin_Tin.png";
import matthew from "@/assets/photos/headshots/matthew_tamura_headshot.png";


const slides = [
  img1.src,
  img2.src,
  img3.src,
  img4.src,
];

const specialThanks = [
  {
    name: "Andrew",
    role: "Engineer @ UofT",
    photo: andrew.src
  },

  {
    name: "Doge Baskan",
    role: "Organizer",
    photo: doga.src
  },
  
  {
    name: "Kaden Seto",
    role: "Organizer",
    photo: kaden.src
  },

  {
    name: "Martin Tin",
    role: "Organizer",
    photo: martin.src
  },

  {
    name: "Matthew Tamura",
    role: "Organizer",
    photo: matthew.src
  },
];

// ...imports and data...

export default function AI2Page() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <div className="bg">
        {/* HERO */}
        <div className="hero-section px-4 py-8 md:py-16">
          <h2 className="hero-title text-3xl md:text-5xl">AI Squared</h2>
          <p className="hero-subtitle text-base md:text-lg">
            Canada’s largest Reinforcement Learning Hackathon
          </p>
          <p className="hero-subtitle-gradient text-base md:text-lg">
            (Brought to you by the Academics Dept.)
          </p>
        </div>

        {/* INTRO */}
        <section className="intro-section flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto px-4">
          <div className="intro-section-left w-full md:w-1/2">
            <h2 className="intro-section-title text-xl md:text-2xl text-center md:text-left mb-2">What is AI Squared?</h2>
            <p className="intro-section-description text-base md:text-lg text-center md:text-left">
              AI Squared is the inaugural reinforcement learning tournament run by UTMIST. The tournament centers around groups of students competing to design the best machine learning agent in a smash-bros style platform fighting game. 
              The tournament will be held in an elimination bracket format which will have consecutive rounds of agents facing off 1v1 until a final winner is determined.
            </p>
          </div>
          <div className="intro-section-right w-full md:w-1/2 flex justify-center">
            <img
              src={ai2_demo.src}
              alt="AI2 Demo"
              className="w-full max-w-xs md:max-w-md rounded-2xl"
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-it-works-section px-4 py-8">
          <h2 className="how-it-works-title text-xl md:text-2xl mb-6 text-center">AI Squared</h2>
          <div className="space-y-8">
            {[ // Example for 3 steps
              { title: "Explore the realm of RL", desc: "Help shape the future of AI and ML at UTMIST" },
              { title: "Train your own agent", desc: "Help shape the future of AI and ML at UTMIST" },
              { title: "Battle with other opponents", desc: "Help shape the future of AI and ML at UTMIST" },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center mb-4">
                <img src={cube.src} alt="Cube" className="w-20 h-20 md:w-24 md:h-24 mb-2 md:mb-0 md:mr-8" />
                <div className="text-center md:text-left">
                  <h3 className="how-it-works-h1 text-lg md:text-xl">{step.title}</h3>
                  <p className="how-it-works-p text-base">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT'S NEW */}
        <section className="mt-10">
          <h2 className="whats-new-title text-xl md:text-2xl text-center mb-6">What's New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 bg-gradient-to-b min-h-[50vh] max-w-5xl mx-auto justify-items-center">
            <AI2Card title="New Weapons" description="Exciting new weapons to try!" image={faces.src} />
            <AI2Card title="Interactive Environment" description="Engage with dynamic environments!" image={faces.src} />
            <AI2Card title="Better Customization" description="Personalize your agent like never before!" image={faces.src} />
          </div>
        </section>

        {/* TIMELINE */}
        <section className="py-10 md:py-20">
          <h2 className="timeline-section-title text-xl md:text-2xl text-center md:text-right mb-6">Timeline</h2>
          <div className="flex flex-col gap-8 md:gap-12 items-end justify-end px-4 md:px-8">
            <div className="w-full md:w-[100%] rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-4 md:p-8">
              <div className="text-xl md:text-3xl font-bold text-white text-right mb-2">Day 1: Kickoff</div>
              <div className="text-base md:text-lg text-white text-right">Start building your RL agent!</div>
            </div>
            <div className="w-full md:w-[70%] rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-4 md:p-8">
              <div className="text-xl md:text-3xl font-bold text-white text-right mb-2">Day 2-4: Code Submissions Open</div>
              <div className="text-base md:text-lg text-white text-right">Start building your RL agent!</div>
            </div>
            <div className="w-full md:w-[50%] rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-4 md:p-8">
              <div className="text-xl md:text-3xl font-bold text-white text-right mb-2">Day 3: Final Showdown</div>
              <div className="text-base md:text-lg text-white text-right">Agents go 1v1 in an elimination bracket until the ultimate champion is crowned!</div>
            </div>
          </div>
        </section>

        {/* HIGHLIGHT BATTLES */}
        <section>
          <h2 className="highlight-battles-title text-xl md:text-2xl text-center mb-6">Highlight Battles</h2>
          <div className="flex flex-col items-center justify-center px-4 md:px-8 mb-10 md:mb-20">
            <Slider>
              {slides.map((i, s) => (
                <img src={i} key={s} className="w-full max-w-xs md:max-w-lg rounded-xl ml-[160px]" />
              ))}
            </Slider>
          </div>
        </section>

        {/* YOUTUBE */}
        <section>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 md:px-8 py-8 md:py-16">
            <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
              <h2 className="youtube-section-title text-xl md:text-2xl">Check Out Our YouTube!</h2>
            </div>
            <div className="flex-1 max-w-full md:max-w-[500px] w-full mr-[140px]">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow transition-shadow duration-300 hover:shadow-xl shadow-[#1E19B1]/50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/zOmkgw6jru4"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIAL THANKS */}
        <section>
          <h2 className="special-section-title text-xl md:text-2xl text-center mb-6">Special Thanks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto mb-10 md:mb-40">
            {specialThanks.map((person, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4 border-4 border-white shadow"
                />
                <div className="special-section-header text-base md:text-lg">{person.name}</div>
                <div className="text-gray-600 text-center text-sm md:text-base">{person.role}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}