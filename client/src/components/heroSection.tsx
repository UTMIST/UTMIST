import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string | React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => (
  <div className="flex flex-col justify-center items-center pt-32 pb-24 md:pt-24 md:pb-16 px-8 max-w-[1050px] mx-auto text-center">
    <h2
      className="text-5xl font-bold mb-2 bg-clip-text text-transparent leading-[1.5]"
      style={{
        background: "var(--gradient-bl1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: "var(--system-font)",
      }}
    >
      {title}
    </h2>
    <p className="text-base font-extralight text-[#111827] font-sans max-w-[768px] mx-auto mb-4 px-8">
      {subtitle}
    </p>
  </div>
);

export default HeroSection;
