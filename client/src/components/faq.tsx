"use client";
import { useState } from "react";
import Image from "next/image";
import plusIcon from "@/assets/icons/plus-icon.svg";

const faqData = [
  {
    question: "How do I join UTMIST?",
    answer:
      "You can join UTMIST by signing up through our website and attending our general meetings. We welcome students from all faculties and programs. Watch for membership registration announcements at the beginning of each semester!",
  },
  {
    question: "I don't know ML, can I still join UTMIST?",
    answer:
      "Of course you can! UTMIST welcomes people of all backgrounds. We offer beginner-friendly workshops and resources to help you get started with machine learning concepts. Many of our members started with zero ML knowledge and have grown their skills through our community.",
  },
  {
    question: "How do I start a project?",
    answer:
      "To start a project with UTMIST, you can either join an existing project team or propose your own idea. We host project pitch sessions at the beginning of each semester where you can share your ideas and form teams. Reach out to our project coordinators for guidance and support.",
  },
  {
    question: "What resources do UTMIST members have access to?",
    answer:
      "UTMIST members have access to computing resources, educational workshops, industry connections, mentorship opportunities, and collaborative project spaces. We also provide access to datasets, technical guides, and specialized software needed for ML/AI development.",
  },
  {
    question: "What are the events that UTMIST hosts?",
    answer:
      "UTMIST hosts a variety of events including technical workshops, research talks by faculty and industry professionals, hackathons, networking events, and our annual AI conference. We also run reading groups and project showcases throughout the year.",
  },
];

export default function FAQ() {
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
      <div className="flex flex-col justify-center items-center py-16 px-8 max-w-[1000px] mx-auto text-center">
        <h2 className="text-5xl font-bold bg-[image:var(--gradient-bl1)] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:var(--system-font)]">Have Questions?</h2>
        <h2 className="text-5xl font-bold bg-[image:var(--gradient-bl1)] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:var(--system-font)]">UTMIST Has Answers</h2>
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-4 justify-center">
        {faqData.map((item, index) => (
          <div key={index} className="w-full mb-4 rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-start flex-wrap w-full py-4 cursor-pointer"
              onClick={() => toggleQuestion(index)}
            >
              <h2 className="flex-1 pr-2 text-base">{item.question}</h2>
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
              <div className="w-full py-4 px-4 pb-6  rounded-b-lg">
                <p className="m-0 p-0 break-words whitespace-normal leading-6 text-gray-600 max-w-full">{item.answer}</p>
              </div>
            )}

            <hr className="mx-auto border-0 h-px bg-gray-200 w-full max-w-[1000px]" />
          </div>
        ))}
      </div>
      <div className="w-full py-8 px-4 flex justify-center items-center text-center text-black">
        <strong>More questions? Reach out to us on any platform!</strong>
      </div>
    </>
  );
}
