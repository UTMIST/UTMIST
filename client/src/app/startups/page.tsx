"use client";
import Link from "next/link";
import { Roboto } from "next/font/google";
import Image, { type StaticImageData } from "next/image";

import Myhal from "../../../public/myhal.webp";
import genai from "../../../public/genai.webp";
import genaiTwo from "../../../public/genai-two.webp";
import MyhalTwo from "../../../public/myhal-two.webp";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const images: StaticImageData[] = [Myhal, genai, genaiTwo, MyhalTwo];

const PhotosGrid = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
      {images.map((img, idx) => (
        <div key={idx} className="flex items-center justify-center">
          <Image
            src={img}
            alt={`grid-img-${idx}`}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="flex flex-col gap-8">
      {/* Hero Component */}
      <HeroIntroductionSection />
      <HeroStartupSection />
    </section>
  );
};

const HeroIntroductionSection = () => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <h1 className="font-bold text-4xl">Innovation @ UTMIST</h1>
      <p className="text-lg m-0 leading-snug text-center">
        <span className="block ">
          Help build AI startups with Canada&#39;s largest student-led
        </span>
        <span className="block ">
          organization for Artificial Intelligence and Machine
        </span>
        <span className="block ">Learning</span>
      </p>
      <div>
        <Link
          href="/apply"
          className="
                bg-gradient-to-r from-indigo-400 to-blue-800
                hover:from-indigo-600 hover:to-blue-900
                text-white px-12 py-1 rounded-full text-lg font-medium shadow mx-auto
                hover:shadow-lg transition-colors duration-400
              "
        >
          Apply
        </Link>
        <p className="text-xs text-gray-500 text-center mt-2">
          <span className="block">Applications close</span>
          <span className="block">Sept 31st</span>
        </p>
      </div>
    </div>
  );
};

const HeroStartupSection = () => {
  return (
    <div className="flex flex-row gap-10 items-center w-full max-w-6xl mx-auto">
      {/* Left: Title & Description, fully centered vertically, left-aligned text */}
      <div className="w-1/2 flex flex-col justify-center text-center">
        <h2 className="font-bold text-3xl mb-4">Startups @ UTMIST</h2>
        <p className="text-lg text-gray-700">
          Build your AI startup without putting school on hold. Join the Startup
          Department @ UTMIST to turn your AI ideas into reality with
          mentorship, workshops, and a flexible, student-friendly structure.
        </p>
      </div>
      {/* Right: Visuals */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 border-2 border-blue-300 rounded-2xl p-6 w-full max-w-lg h-64 flex items-center justify-center">
          <PhotosGrid />
        </div>
      </div>
    </div>
  );
};

// const SliderSection = (title: string, direction: string) => {
//   return (
//     <div>
//       <h1>Slider Section</h1>
//     </div>
//   );
// };

const StartupsPage = () => {
  return (
    <main className={`${roboto.className}`}>
      <HeroSection />
      <div>
        <div>
          <section>{/* Investors slider with article cards */}</section>
        </div>
        <div>
          <section>{/* Guess Speakers slider with article cards */}</section>
        </div>
      </div>
      {/* Add a final quote that could be inspirational (Come make an impact at UTMIST) */}
    </main>
  );
};

export default StartupsPage;
