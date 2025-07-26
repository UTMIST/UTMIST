"use client";
import "@/styles/ai2.css";
import { AI2Card } from "@/components/ai2-cards";
import { useState } from "react";
import Image from "next/image";
import ai2_demo from "@/assets/photos/ai2_demo.png";
import cube from "@/assets/photos/cube.gif";
import faces from "@/assets/photos/faces.png";
import weapon from "@/assets/photos/weapon.gif";
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

export default function AI2Page() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <div className="bg">
      <div className="hero-section">
        <h2 className="hero-title">AI Squared</h2>
        <p className="hero-subtitle">
          Canada’s largest Reinforcement Learning Hackathon
        </p>
        <p className="hero-subtitle-gradient">(Brought to you by the Academics Dept.)</p>
      </div>
      <section className="intro-section flex flex-col md:flex-row items-center md:items-start max-w-4xl mx-auto px-4">
      <div className="intro-section-left w-full md:w-1/2">
        <h2 className="intro-section-title">What is AI Squared?</h2>
        <p className="intro-section-description">
          AI Squared is the inaugural reinforcement learning tournament run by UTMIST. The tournament centers around groups of students competing to design the best machine learning agent in a smash-bros style platform fighting game. 
          The tournament will be held in an elimination bracket format which will have consecutive rounds of agents facing off 1v1 until a final winner is determined.
        </p>
      </div>
      <div className="intro-section-right w-full md:w-1/2 flex justify-center md:justify-start mt-8 md:mt-0">
        <img
          src={ai2_demo.src}
          alt="AI2 Demo"
          className="w-full max-w-xs md:max-w-md mx-auto md:ml-20 rounded-2xl"
        />
      </div>
    </section>
      <section className="how-it-works-section">
        <h2 className="how-it-works-title">AI Squared</h2>
      <div className="flex items-center mb-8">
        <img src={cube.src} alt="Cube" className="w-24 h-24 mr-8" />
        <div>
          <h3 className="how-it-works-h1">Explore the realm of RL</h3>
          <p className="how-it-works-p">Help shape the future of AI and ML at UTMIST</p>
        </div>
      </div>
      <div className="flex items-center mb-8">
        <img src={cube.src} alt="Cube" className="w-24 h-24 mr-8" />
        <div>
          <h3 className="how-it-works-h1">Train your own agent</h3>
          <p className="how-it-works-p">Help shape the future of AI and ML at UTMIST</p>
        </div>
      </div>
      <div className="flex items-center">
        <img src={cube.src} alt="Cube" className="w-24 h-24 mr-8" />
        <div>
          <h3 className="how-it-works-h1">Battle with other opponents</h3>
          <p className="how-it-works-p">Help shape the future of AI and ML at UTMIST</p>
        </div>
      </div>
    </section>
    <section className="mt-30">
      <h2 className="whats-new-title">What's New</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-40 p-8 bg-gradient-to-b min-h-screen max-w-5xl mx-auto justify-items-center">
      <AI2Card title="New Weapons" description="Exciting new weapons to try!" image={weapon.src} />
      <AI2Card title="Interactive Environment" description="Engage with dynamic environments!" image={faces.src} />
      <AI2Card title="Better Customization" description="Personalize your agent like never before!" image={faces.src} />
    </div>
    </section>
    <section className="py-20">
      <h2 className="timeline-section-title">Timeline</h2>
      <div className="flex flex-col gap-12 items-end justify-end px-8 py-16 mr-50">
        <div className="w-[100%] rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-8">
          <div className="text-3xl font-bold text-white text-right mb-2">Day 1: Kickoff</div>
          <div className="text-lg text-white text-right">Start building your RL agent!</div>
        </div>
        <div className="w-[70%] rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-8">
          <div className="text-3xl font-bold text-white text-right mb-2">Day 2-4: Code Submissions Open</div>
          <div className="text-lg text-white text-right">Start building your RL agent!</div>
        </div>
        <div className="w-[50%] rounded-xl bg-gradient-to-r from-blue-200 via-purple-400 to-blue-800 p-8">
          <div className="text-3xl font-bold text-white text-right mb-2">Day 3: Final Showdown</div>
          <div className="text-lg text-white text-right">Agents go 1v1 in an elimination bracket until the ultimate champion is crowned!</div>
        </div>
      </div>
    </section>
    <section>
      <h2 className="highlight-battles-title">Highlight Battles</h2>
      <div className="flex flex-col items-center justify-center px-8 mb-20">
          <Slider>
          {slides.map((i, s) => (
            <img src={i} key={s} />
          ))}
        </Slider>
      </div>
    </section>
    <section className="">
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-16">
      <div className="text-center md:text-left">
        <h2 className="youtube-section-title">
          Check Out Our YouTube!
        </h2>
      </div>
      <div className="flex-1 max-w-[500px] w-full">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl p-6 rounded-2xl shadow transition-shadow duration-300 hover:shadow-xl shadow-[#1E19B1]/50">
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
    <section>
    <h2 className="special-section-title">Special Thanks</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 max-w-5xl mx-auto mb-40">
      {specialThanks.map((person, i) => (
        <div key={i} className="flex flex-col items-center">
          <img
            src={person.photo}
            alt={person.name}
            className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-white shadow"
          />
          <div className="special-section-header">{person.name}</div>
          <div className="text-gray-600 text-center">{person.role}</div>
        </div>
      ))}
    </div>
  </section>
    {/* <section>
      <h2 className="special-section-title">Special Thanks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 max-w-5xl mx-auto mb-40">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
            <div className="special-section-header">Marcelo Ponce</div>
            <div className="text-gray-600 text-center">Engineer @ UofT</div>
          </div>
        ))}
      </div>
    </section> */}
    </div>
    </main>
  );
}
