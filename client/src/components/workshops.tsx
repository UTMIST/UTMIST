"use client";

import React, { useState } from "react";
import "@/styles/eigenai.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import copresPhoto from "@/assets/photos/eigenai-copres-speech.webp";
import execPhoto from "@/assets/photos/eigenai-exec-photo.webp";
interface AccordionItemProps {
  title: string;
  subtitle?: string;
  content?: string;
}

export default function Workshops() {
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(3);

  const accordionItems: AccordionItemProps[] = [
    {
        title: "Accelerating Object Detection: Model Quantization & Deployment with NVIDIA Triton Server",
        subtitle: "UTMIST Academic Department",
        content: "This workshop covers (1) model quantization of pre-trained object detection model," +
            "and (2) deployment on NVIDIA Triton Inference Server for scalable, high-performance inference.",
    },
    {
        title: "AUTORULE: Reasoning Chain-of-thought Extracted Rule-based Rewards Improve Preference Learning",
        subtitle: "UTMIST Academic Department",
        content: "An automated rule based reinforcement method for large language models that reduces reward " +
            "hacking and yields interpretable, dataset adaptive rules."
    },
    {
        title: "Recommendation Systems: How Netflix Knows What You’ll Watch Next",
        subtitle: "UTMIST Academic Department in Partnership with Anthropic",
        content: "An introduction on how to integrate the Claude API into any application, using a chat app as " +
            "a demonstration. The goal is to introduce fundamental API integration skills including API key access, " +
            "HTTP request authentication, and JSON response handling. The workshop also covers Claude-specific parameters" +
            "such as temperature settings, system prompts and multi-turn conversation management."
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  return (
    <div className="basis-vectors-container">
      <h1 className="basis-vectors-title">This Year's Workshops</h1>

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
                              <p>{item.content}</p>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
