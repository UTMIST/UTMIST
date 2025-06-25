"use client";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { useState, useEffect, useRef } from "react";
import {Person} from "@/types/startups";

import Myhal from "../../../public/myhal.webp";
import genai from "../../../public/genai.webp";
import genaiTwo from "../../../public/genai-two.webp";
import MyhalTwo from "../../../public/myhal-two.webp";


// Placeholder avatar image (public domain SVG)
const placeholderAvatar =
  "https://www.svgrepo.com/show/484043/person-button.svg";

const guessSpeakers: Person[] = [
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
];

const investors: Person[] = [
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
  { name: "Name", image: placeholderAvatar },
];

const images: StaticImageData[] = [Myhal, genai, genaiTwo, MyhalTwo];

const PhotosGrid = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
      {images.map((img, idx) => {

        return (
          <div
            key={idx}
            className={`flex items-center justify-center overflow-hidden bg-white p-2 border border-gray-200 shadow-md rounded-xl`}
          >
            <Image
              src={img}
              alt={`grid-img-${idx}`}
              width={480}
              height={360}
              className={`object-cover rounded-lg w-full h-full`}
            />
          </div>
        );
      })}
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="flex flex-col gap-4 md:gap-6">
      {/* Hero Component */}
      <HeroIntroductionSection />
      <HeroStartupSection />
    </section>
  );
};

const HeroIntroductionSection = () => {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="font-bold text-2xl md:text-3xl">MISTic R&D</h1>
      <p className="text-base md:text-lg m-0 leading-snug text-center">
        <span className="block">
          Help build AI startups with Canada&#39;s largest student-led
        </span>
        <span className="block">
          organization for Artificial Intelligence and Machine
        </span>
        <span className="block">Learning</span>
      </p>
      <div>
        <Link
          href="/careers"
          className="bg-gradient-to-r from-indigo-400 to-blue-800 hover:from-indigo-600 hover:to-blue-900 text-white px-6 py-1 rounded-full text-base font-medium shadow mx-auto hover:shadow-lg transition-colors duration-400"
        >
          Apply
        </Link>
        <p className="text-xs text-gray-500 text-center mt-1">
          <span className="block">Applications close</span>
          <span className="block">Sept 31st</span>
        </p>
      </div>
    </div>
  );
};

const HeroStartupSection = () => {
  return (
    <div className="flex flex-col md:flex-row text-center items-center w-full max-w-6xl mx-auto">
      {/* Left: Title & Description, fully centered vertically, left-aligned text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-center mb-3 md:mb-0">
        <h2 className="font-bold text-xl md:text-2xl mb-2">
          Startups @ UTMIST
        </h2>
        <p className="text-sm md:text-base text-gray-700">
          Build your AI startup without putting school on hold. Join the Startup
          Department @ UTMIST to turn your AI ideas into reality with
          mentorship, workshops, and a flexible, student-friendly structure.
        </p>
      </div>
      {/* Right: Visuals */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="rounded-2xl p-2 md:p-4 w-full max-w-full h-auto flex items-center justify-center">
          <PhotosGrid />
        </div>
      </div>
    </div>
  );
};

const SliderSection = ({
  title,
  people,
  direction = "right",
}: {
  title: string;
  people: Person[];
  direction?: "left" | "right";
}) => {
  const visibleCount = 3;
  const total = people.length;
  const [index, setIndex] = useState(direction === "right" ? 0 : total - 1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardWidth = 160; // w-40 in px
  const gap = 16; // px, matches gap-x-4
  const cardWithGap = cardWidth + gap;

  // If fewer than 3 people, fill with placeholders
  const filledPeople =
    people.length < visibleCount
      ? [
          ...people,
          ...Array.from({ length: visibleCount - people.length }, () => ({
            name: "",
            image: "",
          })),
        ]
      : people;
  const displayPeople =
    direction === "right"
      ? [...filledPeople, ...filledPeople.slice(0, visibleCount)]
      : [...filledPeople.slice(-visibleCount), ...filledPeople];

  // Auto-advance in the specified direction
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (direction === "right" ? prev + 1 : prev - 1));
      setIsTransitioning(true);
    }, 2000);
    return () => clearInterval(interval);
  }, [direction]);

  // Seamless looping logic for both directions
  useEffect(() => {
    if (direction === "right" && index === total) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    } else if (direction === "left" && index === -1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(total - 1);
      }, 500);
      return () => clearTimeout(timeout);
    } else if (!isTransitioning) {
      const reenable = setTimeout(() => {
        setIsTransitioning(true);
      }, 20);
      return () => clearTimeout(reenable);
    } else {
      setIsTransitioning(true);
    }
  }, [index, total, isTransitioning, direction]);

  // Calculate translateX percentage
  const translateX =
    direction === "right"
      ? `-${index * cardWithGap}px`
      : `-${(index + 1) * cardWithGap}px`;

  return (
    <>
      {/* Desktop/Tablet Slider */}
      <section
        className="hidden md:flex flex-row items-center py-4 bg-gradient-to-br from-[#f5f8ff] to-[#eaf1fb] rounded-2xl border border-blue-200 shadow-sm mx-auto w-full max-w-[700px]"
        style={{ marginBottom: "1.5rem" }}
      >
        <div className="w-1/4 text-right items-center justify-center text-center">
          <h2 className="font-bold text-2xl text-gray-700 justify-center p-2 text-center">
            {title}
          </h2>
        </div>
        <div
          className="relative w-auto overflow-hidden flex-shrink-0"
          style={{ width: `${visibleCount * cardWidth + (visibleCount - 1) * gap}px` }}
        >
          <div
            ref={rowRef}
            className={`flex gap-x-4 ${
              isTransitioning
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              width: `${displayPeople.length * cardWidth + (displayPeople.length - 1) * 16}px`,
              maxWidth: `${visibleCount * cardWidth + (visibleCount - 1) * 16}px`,
              minWidth: "100%",
              transform: `translateX(${translateX})`,
            }}
          >
            {displayPeople.map((person, idx) => (
              <article
                key={idx}
                className="flex-shrink-0 w-40 h-40 flex flex-col items-center bg-white rounded-xl shadow p-1 mb-1"
              >
                {person.image ? (
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={128}
                    height={112}
                    className="w-32 h-28 object-contain rounded-lg mb-1 border border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-28 rounded-lg mb-1 border border-gray-200 bg-gray-100" />
                )}
                <span className="font-medium text-base text-gray-800 mt-0.5">
                  {person.name || ""}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Grid */}
      <section className="block md:hidden bg-gradient-to-br from-[#f5f8ff] to-[#eaf1fb] rounded-2xl border border-blue-200 shadow-sm mx-auto w-full max-w-[400px] mb-4">
        <h2 className="font-bold text-base text-center text-gray-700 py-2">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-2 px-2 pb-2">
          {people.map((person, idx) => {
            const isOdd = people.length % 2 === 1;
            const isLast = idx === people.length - 1;
            if (isOdd && isLast) {
              // Center the last card in a row by wrapping it
              return (
                <div key={idx} className="col-span-2 flex justify-center">
                  <article className="w-full max-w-[10rem] h-28 flex flex-col items-center bg-white rounded-xl shadow p-1 mb-1">
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        width={96}
                        height={80}
                        className="w-24 h-20 object-contain rounded-lg mb-1 border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-20 rounded-lg mb-1 border border-gray-200 bg-gray-100" />
                    )}
                    <span className="font-medium text-xs text-gray-800 mt-0.5">
                      {person.name || ""}
                    </span>
                  </article>
                </div>
              );
            }
            return (
              <article
                key={idx}
                className="w-full h-28 flex flex-col items-center bg-white rounded-xl shadow p-1 mb-1"
              >
                {person.image ? (
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={96}
                    height={80}
                    className="w-24 h-20 object-contain rounded-lg mb-1 border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-20 rounded-lg mb-1 border border-gray-200 bg-gray-100" />
                )}
                <span className="font-medium text-xs text-gray-800 mt-0.5">
                  {person.name || ""}
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

const StartupsPage = () => {
  return (
    <main className="pt-10 px-4 md:px-16">
      <HeroSection />
      <div>
        <div className="mt-8 md:mt-12">
          <SliderSection
            title="Guess Speakers"
            people={guessSpeakers}
            direction="left"
          />
        </div>
        <div>
          {/* Guess Speakers slider with article cards */}
          <SliderSection
            title="Investors"
            people={investors}
            direction="right"
          />
        </div>
      </div>
      {/* Add a final quote that could be inspirational (Come make an impact at UTMIST) */}
    </main>
  );
};

export default StartupsPage;
