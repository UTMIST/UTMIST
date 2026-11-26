"use client";
import { useState } from "react";
import "@/styles/faq.css";
import Image from "next/image";
import plusIcon from "@/assets/icons/plus-icon.svg";



export default function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number | null) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <>
      <div className="faq-section">
        <h2 className="faq-title">Have Questions?</h2>
        <h2 className="faq-title">UTMIST Has Answers</h2>
      </div>
      <div className="faq-container">
        {items.map((item, index) => (
          <div key={index}>
            <div
              className="faq-row cursor-pointer"
              onClick={() => toggleQuestion(index)}
            >
              <h2 className="faq-row-title">{item.question}</h2>
              <div className="flex items-center justify-center">
                <Image
                  src={plusIcon}
                  alt={expandedIndex === index ? "Collapse" : "Expand"}
                  width={20}
                  height={20}
                  className={`transition-transform duration-300 ${
                    expandedIndex === index ? "transform rotate-45" : ""
                  }`}
                />
              </div>
            </div>

            {expandedIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}

            <hr className="faq-line" />
          </div>
        ))}
      </div>
      <div className="faq-tail-section">
        <strong>More questions? Reach out to us on any platform!</strong>
      </div>
    </>
  );
}
