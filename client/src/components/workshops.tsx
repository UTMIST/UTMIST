"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import AnthropicLogo from "@/assets/photos/Anthropic.webp";
import GoogleLogo from "@/assets/photos/Google.webp";

interface AccordionItemProps {
    title: string;
    subtitle: string;
    content: string;
    image?: string | StaticImageData;
}

export default function Workshops() {
    const [openItemIndex, setOpenItemIndex] = useState<number | null>(3);

    const accordionItems: AccordionItemProps[] = [
        {
            title: "Mastering the Technical Interview: Strategies with Google",
            subtitle: "Allen Lee, Software Engineer @ Google",
            content: "Preparing for technical interviews can feel overwhelming. In this workshop, " +
                "participants will learn how to approach coding challenges, communicate their thought " +
                "process effectively, and handle common pitfalls to ace their technical interviews. " +
                "We’ll cover practical tips and frameworks for tackling problems that can be immediately " +
                "applied to interview prep!",
            image: GoogleLogo,
        },
        {
            title: "Building Applications with the Claude API",
            subtitle: "UTMIST Academic Department in Partnership with Anthropic",
            content:
                "An introduction on how to integrate the Claude API into any application, " +
                "using a chat app as a demonstration. The goal is to introduce fundamental " +
                "API integration skills including API key access, HTTP request authentication, " +
                "and JSON response handling. The workshop also covers Claude-specific parameters " +
                "such as temperature settings, system prompts and multi-turn conversation management.",
            image: AnthropicLogo,
        },
        {
            title: "Accelerating Object Detection: Model Quantization & Deployment with NVIDIA Triton Server",
            subtitle: "UTMIST Academic Department",
            content:
                "This workshop covers (1) model quantization of pre-trained object detection model, " +
                "and (2) deployment on NVIDIA Triton Inference Server for scalable, high-performance inference.",
        },
        {
            title: "AUTORULE: Reasoning Chain-of-thought Extracted Rule-based Rewards Improve Preference Learning",
            subtitle: "UTMIST Academic Department",
            content:
                "An automated rule based reinforcement method for large language models that " +
                " reward hacking and yields interpretable, dataset adaptive rules.",
        },
        {
            title: "Recommendation Systems: How Netflix Knows What You’ll Watch Next",
            subtitle: "UTMIST Academic Department",
            content:
                "In this introductory workshop, you’ll learn how recommendation systems power " +
                "platforms like Netflix, Spotify, and Amazon by personalizing user experiences. " +
                "Through a hands-on demo, we’ll build a simple recommender from scratch and explore " +
                "the key concepts, challenges, and applications behind these powerful AI tools.",
        },
    ];

    const toggleAccordion = (index: number) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-5 font-sans border border-[#e2e2e2] rounded-lg bg-white">
      <h1 className="text-[2.5rem] font-semibold mb-6 text-[#111111]">This Year&apos;s Workshops</h1>

      <div className="flex gap-5">
        <div className="flex-1 flex flex-col gap-3 md:flex md:flex-col">
          {accordionItems.map((item, index) => (
            <div
              key={index}
              className={`border rounded-md overflow-hidden transition-all duration-300 ${
                openItemIndex === index ? "border-[var(--gray2)] shadow-[0_2px_6px_rgba(0,0,0,0.05)]" : "border-[#e2e2e2]"
              }`}
            >
              <div
                className="p-4 flex justify-between items-center cursor-pointer bg-white text-black text-sm font-medium transition-colors duration-200"
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.title}</span>
                {openItemIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>

              {openItemIndex === index && (
                <div className="flex flex-col justify-center mx-auto">
                  <div className="px-4 py-1 text-[0.8rem] leading-6 text-[var(--gray1)] bg-white">
                    <p className="text-[0.9rem] font-medium text-[#374151]">{item.subtitle}</p>
                  </div>
                  <div className="mx-4 my-3 h-1.5 w-[calc(100%-2rem)] bg-[#f0f0f0] rounded-[20px]">
                    <div className="h-full w-[70%] rounded-[20px] bg-[#3b82f6] transition-[width] duration-1000 ease-in-out"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

          <div className="flex-[3] h-[30rem] border border-[#e0e0ff] rounded-md bg-[#f5f8ff] hidden md:block">
              {accordionItems.map((item, index) => (
                  <div key={index} id={`visualization-${index}`}>
                      {openItemIndex === index && (
                          <div className="bg-white rounded-[10px] p-6 m-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)] animate-[fadeIn_0.3s_ease-in-out]">
                              {item.image ? (
                                  <div className="flex items-start gap-6 bg-white rounded-[10px] p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                                      <Image
                                          src={item.image!}
                                          alt={item.title}
                                          className="w-[180px] h-auto rounded-lg object-cover flex-shrink-0"
                                          width={180}
                                          height={180}
                                      />
                                      <div className="flex-1 text-base leading-6 text-[#1f2937]">
                                          <p className="text-base leading-6 text-[#000000] mb-2">{item.content}</p>
                                      </div>
                                  </div>
                              ) : (
                                  <p className="text-base leading-6 text-[#000000] mb-2">{item.content}</p>
                              )}
                          </div>

                      )}
                  </div>
              ))}
          </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
