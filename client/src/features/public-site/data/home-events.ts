import type { StaticImageData } from "next/image";

import ai2Artwork from "@/assets/photos/ai2/ai2cube-3.png";

export interface HomeEvent {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  artwork: { kind: "eigenai" } | {
    kind: "image";
    src: string | StaticImageData;
    alt: string;
    fit: "cover" | "contain";
    position?: "top" | "center";
  };
}

/** Event identity and artwork travel together when entries are renamed or reordered. */
export const homeEvents: readonly HomeEvent[] = [
  {
    id: "eigenai",
    title: "EigenAI",
    description:
      "A student-led AI conference featuring hands-on workshops, expert talks, and diverse perspectives across fields like fintech, healthcare, and robotics.",
    url: "/eigenai",
    category: "AI conference",
    artwork: { kind: "eigenai" },
  },
  {
    id: "cucai",
    title: "CUCAI",
    description:
      "CUCAI (Canadian Undergraduate Conference on AI) is a national conference that showcases undergraduate AI research and connects students with industry leaders through workshops, and networking.",
    url: "https://cucai.ca",
    category: "AI conference",
    artwork: {
      kind: "image",
      src: "/home-redesign/cucai-conference.webp",
      alt: "Speaker beside the CUCAI conference banner",
      fit: "cover",
      position: "top",
    },
  },
  {
    id: "ai2",
    title: "AI Squared",
    description:
      "AI Squared is a machine learning tournament hosted by UTMIST where students build AI agents to compete in a 2D platform fighting game while gaining hands-on experience and mentorship.",
    url: "https://www.utmist.ca/ai2",
    category: "Machine learning tournament",
    artwork: { kind: "image", src: ai2Artwork, alt: "", fit: "contain" },
  },
  {
    id: "genai-genesis",
    title: "GenAI",
    description:
      "GenAI Genesis is Canada's largest AI hackathon, uniting over 700 participants to develop generative AI solutions addressing the U.N Sustainable Development Goals, powered by UTMIST and Google Developers",
    url: "https://genaigenesis.ca",
    category: "AI hackathon",
    artwork: {
      kind: "image",
      src: "/genai.webp",
      alt: "GenAI Genesis group photo",
      fit: "cover",
    },
  },
];
