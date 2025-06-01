"use client";

import React, { useState } from "react";
import "@/styles/eigenai.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import copresPhoto from "@/assets/photos/eigenai-copres-speech.png";
import execPhoto from "@/assets/photos/eigenai-exec-photo.png";
interface AccordionItemProps {
  title: string;
  content?: string;
  image: StaticImageData;
}

export default function BasisVectors() {
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(3);

  const accordionItems: AccordionItemProps[] = [
    {
      title: "Building connections with engineers and researchers",
      content:
        "Connect with leading engineers and researchers in the field of machine learning and AI.",
      image: copresPhoto,
    },
    {
      title: "Showcasing diverse perspectives of the ML landscape",
      content:
        "Explore various viewpoints and approaches across the machine learning ecosystem.",
      image: execPhoto,
    },
    {
      title: "Gaining hands-on experience with technical workshops",
      content:
        "Participate in immersive technical workshops to develop practical skills.",
      image: copresPhoto,
    },
    {
      title: "Gaining hands-on experience with technical workshops",
      content:
        "Gaining hands-on experience with technical workshops, and much more and more. Gaining hands-on experience with technical workshops, and much more and more",
      image: execPhoto,
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  return (
    <div className="basis-vectors-container">
      <h1 className="basis-vectors-title">Basis Vectors of EigenAI</h1>

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
                    <p>{item.content}</p>
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
                <Image src={item.image} alt={item.title} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
