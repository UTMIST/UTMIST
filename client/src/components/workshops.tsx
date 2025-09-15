"use client";

import React, { useState } from "react";
import "@/styles/eigenai.css";
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
            content:
                "Preparing for technical interviews can feel overwhelming. In this workshop, participants will learn...",
            image: GoogleLogo,
        },
        {
            title: "Building Applications with the Claude API",
            subtitle: "UTMIST Academic Department in Partnership with Anthropic",
            content:
                "An introduction on how to integrate the Claude API into any application...",
            image: AnthropicLogo,
        },
        {
            title: "Accelerating Object Detection: Model Quantization & Deployment with NVIDIA Triton Server",
            subtitle: "UTMIST Academic Department",
            content:
                "This workshop covers (1) model quantization of pre-trained object detection model, and (2) deployment...",
        },
        {
            title: "AUTORULE: Reasoning Chain-of-thought Extracted Rule-based Rewards Improve Preference Learning",
            subtitle: "UTMIST Academic Department",
            content:
                "An automated rule based reinforcement method for large language models that reduces reward hacking...",
        },
        {
            title: "Recommendation Systems: How Netflix Knows What You’ll Watch Next",
            subtitle: "UTMIST Academic Department",
            content:
                "An introduction on how to integrate the Claude API into any application...",
        },
    ];

    const toggleAccordion = (index: number) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  return (
    <div className="basis-vectors-container">
      <h1 className="basis-vectors-title">This Year&apos;s Workshops</h1>

      <div className="basis-vectors-content">
        <div className="accordion-container">
          {accordionItems.map((item, index) => (
            <div
              key={index}
              className={`accordion-item ${
                openItemIndex === index ? "open" : ""
              }`}
            >
              <div
                className="accordion-header"
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
                <div className="accordion-content-container">
                  <div className="accordion-content">
                    <p>{item.subtitle}</p>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

          <div className="visualization-area">
              {accordionItems.map((item, index) => (
                  <div key={index} id={`visualization-${index}`}>
                      {openItemIndex === index && (
                          <div className="content">
                              {item.image ? (
                                  <div className="content-with-image">
                                      <Image
                                          src={item.image!}
                                          alt={item.title}
                                          className="content-image"
                                          width={180}
                                          height={180}
                                      />
                                      <div className="content-text">
                                          <p>{item.content}</p>
                                      </div>
                                  </div>
                              ) : (
                                  <p>{item.content}</p>
                              )}
                          </div>

                      )}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
