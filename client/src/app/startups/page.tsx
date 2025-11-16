"use client";
import Image, { type StaticImageData } from "next/image";
// import { useState, useEffect, useRef } from "react";
// import {Person} from "@/types/startups";

import Myhal from "../../../public/myhal.webp";
import genai from "../../../public/genai.webp";
import genaiTwo from "../../../public/genai-two.webp";
import MyhalTwo from "../../../public/myhal-two.webp";

// Startup logos
import CaidLogo from "@/assets/photos/startups/caid-logo.png";
import BuildSafeLogo from "@/assets/photos/startups/buildsafe-logo.png";
import ClearSiteLogo from "@/assets/photos/startups/clearsite-logo.png";

// Partner logos
import FrontRowLogo from "@/assets/photos/ventures/frv-black-logo.png";
import ForumLogo from "@/assets/photos/ventures/forum-black-purple-logo.png";


// // Placeholder avatar image (public domain SVG)
// const placeholderAvatar =
//   "https://www.svgrepo.com/show/484043/person-button.svg";

// const guessSpeakers: Person[] = [
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
// ];

// const investors: Person[] = [
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
//   { name: "Name", image: placeholderAvatar },
// ];

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
      <h1
        className="text-5xl font-bold mb-2 bg-clip-text text-transparent leading-[1.5]"
        style={{
          background: "var(--gradient-bl1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "var(--system-font)",
        }}
      >
        MISTic R&D
      </h1>
      <p className="m-0 leading-snug text-center text-sm md:text-base text-gray-700 font-sans">
        <span className="block">
          Building an AI startup? Join MISTic R&D, 
        </span>
        <span className="block">
          the incubator where ambitious founders find funding, users,
        </span>
        <span className="block">
          cofounders, and an unstoppable community of builders. 
        </span>
        <span className="block">
          Let’s turn your idea into impact.
        </span>
      </p>
    </div>
  );
};

const HeroStartupSection = () => {
  return (
    <div className="flex flex-col md:flex-row text-center items-center w-full max-w-6xl mx-auto" >
      {/* Left: Title & Description, fully centered vertically, left-aligned text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-center mb-3 md:mb-0 p-6 md:p-12">
        <h2 
          className="text-2xl text-center mb-2 font-bold bg-clip-text text-transparent"
          style={{
            background: "var(--gradient-bl1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--system-font)", 
          }}
        >
          Startups @ UTMIST
        </h2>
        <p className="text-sm md:text-base text-gray-700 font-sans">
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

// const SliderSection = ({
//   title,
//   people,
//   direction = "right",
// }: {
//   title: string;
//   people: Person[];
//   direction?: "left" | "right";
// }) => {
//   const visibleCount = 3;
//   const total = people.length;
//   const [index, setIndex] = useState(direction === "right" ? 0 : total - 1);
//   const [isTransitioning, setIsTransitioning] = useState(true);
//   const rowRef = useRef<HTMLDivElement>(null);
//   const cardWidth = 160; // w-40 in px
//   const gap = 16; // px, matches gap-x-4
//   const cardWithGap = cardWidth + gap;

//   // If fewer than 3 people, fill with placeholders
//   const filledPeople =
//     people.length < visibleCount
//       ? [
//           ...people,
//           ...Array.from({ length: visibleCount - people.length }, () => ({
//             name: "",
//             image: "",
//           })),
//         ]
//       : people;
//   const displayPeople =
//     direction === "right"
//       ? [...filledPeople, ...filledPeople.slice(0, visibleCount)]
//       : [...filledPeople.slice(-visibleCount), ...filledPeople];

//   // Auto-advance in the specified direction
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (direction === "right" ? prev + 1 : prev - 1));
//       setIsTransitioning(true);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [direction]);

//   // Seamless looping logic for both directions
//   useEffect(() => {
//     if (direction === "right" && index === total) {
//       const timeout = setTimeout(() => {
//         setIsTransitioning(false);
//         setIndex(0);
//       }, 500);
//       return () => clearTimeout(timeout);
//     } else if (direction === "left" && index === -1) {
//       const timeout = setTimeout(() => {
//         setIsTransitioning(false);
//         setIndex(total - 1);
//       }, 500);
//       return () => clearTimeout(timeout);
//     } else if (!isTransitioning) {
//       const reenable = setTimeout(() => {
//         setIsTransitioning(true);
//       }, 20);
//       return () => clearTimeout(reenable);
//     } else {
//       setIsTransitioning(true);
//     }
//   }, [index, total, isTransitioning, direction]);

//   // Calculate translateX percentage
//   const translateX =
//     direction === "right"
//       ? `-${index * cardWithGap}px`
//       : `-${(index + 1) * cardWithGap}px`;

//   return (
//     <>
//       {/* Desktop/Tablet Slider */}
//       <section
//         className="hidden md:flex flex-row items-center py-4 bg-gradient-to-br from-[#f5f8ff] to-[#eaf1fb] rounded-2xl border border-blue-200 shadow-sm mx-auto w-full max-w-[700px]"
//         style={{ marginBottom: "1.5rem" }}
//       >
//         <div className="w-1/4 text-right items-center justify-center text-center">
//           <h2 className="font-bold text-2xl text-gray-700 justify-center p-2 text-center">
//             {title}
//           </h2>
//         </div>
//         <div
//           className="relative w-auto overflow-hidden flex-shrink-0"
//           style={{ width: `${visibleCount * cardWidth + (visibleCount - 1) * gap}px` }}
//         >
//           <div
//             ref={rowRef}
//             className={`flex gap-x-4 ${
//               isTransitioning
//                 ? "transition-transform duration-500 ease-in-out"
//                 : ""
//             }`}
//             style={{
//               width: `${displayPeople.length * cardWidth + (displayPeople.length - 1) * 16}px`,
//               maxWidth: `${visibleCount * cardWidth + (visibleCount - 1) * 16}px`,
//               minWidth: "100%",
//               transform: `translateX(${translateX})`,
//             }}
//           >
//             {displayPeople.map((person, idx) => (
//               <article
//                 key={idx}
//                 className="flex-shrink-0 w-40 h-40 flex flex-col items-center bg-white rounded-xl shadow p-1 mb-1"
//               >
//                 {person.image ? (
//                   <Image
//                     src={person.image}
//                     alt={person.name}
//                     width={128}
//                     height={112}
//                     className="w-32 h-28 object-contain rounded-lg mb-1 border border-gray-200"
//                   />
//                 ) : (
//                   <div className="w-32 h-28 rounded-lg mb-1 border border-gray-200 bg-gray-100" />
//                 )}
//                 <span className="font-medium text-base text-gray-800 mt-0.5">
//                   {person.name || ""}
//                 </span>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Mobile Grid */}
//       <section className="block md:hidden bg-gradient-to-br from-[#f5f8ff] to-[#eaf1fb] rounded-2xl border border-blue-200 shadow-sm mx-auto w-full max-w-[400px] mb-4">
//         <h2 className="font-bold text-base text-center text-gray-700 py-2">
//           {title}
//         </h2>
//         <div className="grid grid-cols-2 gap-2 px-2 pb-2">
//           {people.map((person, idx) => {
//             const isOdd = people.length % 2 === 1;
//             const isLast = idx === people.length - 1;
//             if (isOdd && isLast) {
//               // Center the last card in a row by wrapping it
//               return (
//                 <div key={idx} className="col-span-2 flex justify-center">
//                   <article className="w-full max-w-[10rem] h-28 flex flex-col items-center bg-white rounded-xl shadow p-1 mb-1">
//                     {person.image ? (
//                       <Image
//                         src={person.image}
//                         alt={person.name}
//                         width={96}
//                         height={80}
//                         className="w-24 h-20 object-contain rounded-lg mb-1 border border-gray-200"
//                       />
//                     ) : (
//                       <div className="w-24 h-20 rounded-lg mb-1 border border-gray-200 bg-gray-100" />
//                     )}
//                     <span className="font-medium text-xs text-gray-800 mt-0.5">
//                       {person.name || ""}
//                     </span>
//                   </article>
//                 </div>
//               );
//             }
//             return (
//               <article
//                 key={idx}
//                 className="w-full h-28 flex flex-col items-center bg-white rounded-xl shadow p-1 mb-1"
//               >
//                 {person.image ? (
//                   <Image
//                     src={person.image}
//                     alt={person.name}
//                     width={96}
//                     height={80}
//                     className="w-24 h-20 object-contain rounded-lg mb-1 border border-gray-200"
//                   />
//                 ) : (
//                   <div className="w-24 h-20 rounded-lg mb-1 border border-gray-200 bg-gray-100" />
//                 )}
//                 <span className="font-medium text-xs text-gray-800 mt-0.5">
//                   {person.name || ""}
//                 </span>
//               </article>
//             );
//           })}
//         </div>
//       </section>
//     </>
//   );
// };

const StartupsSection = () => {
  const startups = [
    { 
      name: "Caid", 
      description: "AI-powered healthcare solutions",
      image: CaidLogo
    },
    { 
      name: "BuildSafe", 
      description: "Construction safety technology",
      image: BuildSafeLogo
    },
    { 
      name: "ClearSite.ai", 
      description: "AI-driven site analysis platform",
      image: ClearSiteLogo
    }
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent"
          style={{
            background: "var(--gradient-bl1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--system-font)",
          }}
        >
          Our Startups
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {startups.map((startup, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center transform"
            >
              {/* Startup logo */}
              <div className="w-full h-32 rounded-lg mb-4 flex items-center justify-center border border-gray-300 overflow-hidden bg-white">
                <Image
                  src={startup.image}
                  alt={`${startup.name} logo`}
                  width={200}
                  height={128}
                  className="object-contain w-full h-full p-2"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-center">
                          <div class="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span class="text-xs text-gray-500">Logo Placeholder</span>
                        </div>
                      `;
                      parent.className += ' bg-gradient-to-br from-gray-100 to-gray-200';
                    }
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{startup.name}</h3>
              <p className="text-gray-600 text-sm">{startup.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const partners = [
    { 
      name: "Front Row Ventures", 
      description: "Student-run venture capital fund",
      image: FrontRowLogo
    },
    { 
      name: "Forum Ventures", 
      description: "Early-stage venture capital firm",
      image: ForumLogo
    }
  ];

  return (
    <section className="py-2 md:py-4">
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent"
          style={{
            background: "var(--gradient-bl1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--system-font)",
          }}
        >
          Our Partners
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center min-h-[220px] flex flex-col justify-center transform"
            >
              {/* Partner logo */}
              <div className="w-full h-28 rounded-lg mx-auto mb-4 flex items-center justify-center border border-gray-200 overflow-hidden bg-gray-50 p-3">
                <Image
                  src={partner.image}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={100}
                  className="object-contain max-w-full max-h-full"
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-center">
                          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5" />
                          </svg>
                        </div>
                      `;
                      parent.className += ' bg-gradient-to-br from-blue-100 to-indigo-200';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{partner.name}</h3>
                <p className="text-gray-600">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StartupsPage = () => {
  return (
    <main className="pt-20 md:pt-18 px-6 md:px-20">
      <HeroSection />
      <StartupsSection />
      <PartnersSection />
      {/* <div>
        <div className="mt-8 md:mt-12">
          <SliderSection
            title="Guess Speakers"
            people={guessSpeakers}
            direction="left"
          />
        </div>
        <div>
          <SliderSection
            title="Investors"
            people={investors}
            direction="right"
          />
        </div>
      </div> */}
    </main>
  );
};

export default StartupsPage;
