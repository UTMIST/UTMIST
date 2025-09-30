"use client";

import Image from "next/image";
import amdLogo from "../assets/logos/amd.svg";
import qualcommLogo from "../assets/logos/qualcomm.svg";
import vectorLogo from "../assets/logos/vector.svg";
import googleCloudLogo from "../assets/logos/google-cloud.svg";
import cohereLogo from "../assets/logos/cohere.webp";
import jarvisLogo from "../assets/logos/jarvis.webp";
import rotmanLogo from "../assets/logos/rotman.webp";
import tenstorrentLogo from "../assets/logos/tenstorrent.webp";
import aerocousticsLogo from "../assets/logos/aerocoustics.webp";
import womboLogo from "../assets/logos/wombo.svg";
import googleLogo from "../assets/logos/google.webp";
import pwcLogo from "../assets/logos/pwc.webp";
import rbcLogo from "../assets/logos/rbc.webp";
import edgeAILogo from "../assets/logos/EdgeAI.webp";
import cgiLogo from "../assets/logos/cgi.webp";

const logos = [
  { src: amdLogo, alt: "AMD Logo", link: "https://www.amd.com/en" },
  {
    src: qualcommLogo,
    alt: "Qualcomm Logo",
    link: "https://www.qualcomm.com/",
  },
  {
    src: vectorLogo,
    alt: "Vector Institute Logo",
    link: "https://vectorinstitute.ai/",
  },
  {
    src: googleCloudLogo,
    alt: "Google Cloud Logo",
    link: "https://cloud.google.com/",
  },
  {
    src: cohereLogo,
    alt: "Cohere Logo",
    link: "https://cohere.ai/",
  },
  {
    src: jarvisLogo,
    alt: "Jarvis Logo",
    link: "https://www.jrvs.ca/",
  },
  {
    src: rotmanLogo,
    alt: "Rotman School of Management Logo",
    link: "https://www.rotman.utoronto.ca/",
  },
  {
    src: tenstorrentLogo,
    alt: "Tenstorrent Logo",
    link: "https://tenstorrent.com/",
  },
  {
    src: aerocousticsLogo,
    alt: "Aerocoustics Logo",
    link: "https://aercoustics.com/",
  },
  {
    src: womboLogo,
    alt: "Wombo Logo",
    link: "https://www.wombo.ai/"
  },
  {
    src: googleLogo,
    alt: "Google Logo",
    link: "https://www.google.com/"
  },
  {
    src: pwcLogo,
    alt: "PwC Logo",
    link: "https://www.pwc.com/"
  },
  {
    src: rbcLogo,
    alt: "RBC Logo",
    link: "https://www.rbc.com/"
  },
  {    
    src: edgeAILogo,
    alt: "Edge AI Logo",
    link: "https://www.edgeaiinnovations.com/"
  },
  {
    src: cgiLogo,
    alt: "CGI Logo",
    link: "https://www.cgi.com/"
  }
];

export default function Sponsors() {
  return (
    <div className="overflow-hidden w-full py-8 bg-white">
      <h3 className="text-5xl font-bold text-center text-2xl mb-4" style={{ background: 'var(--gradient-bl1)', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Backed By</h3>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_45%,black_55%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_45%,black_55%,transparent)]">
        <div className="flex w-fit animate-[scrollLeft_10s_linear_infinite] hover:[animation-play-state:paused]">
          {[...logos, ...logos].map((logo, index) => (
            <div className="min-w-[200px] mx-8 flex items-center justify-center" key={index}>
              <a href={logo.link} target="_blank" rel="noopener noreferrer">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
