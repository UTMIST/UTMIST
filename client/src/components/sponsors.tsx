import Image from "next/image";
import "../styles/home.css";
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
  { src: cohereLogo, alt: "Cohere Logo", link: "https://cohere.ai/" },
  { src: jarvisLogo, alt: "Jarvis Logo", link: "https://www.jrvs.ca/" },
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
  { src: womboLogo, alt: "Wombo Logo", link: "https://www.wombo.ai/" },
];

export default function Sponsors() {
  return (
    <div className="sponsors-container">
      <h3 className="sponsors-title">Backed By</h3>
      <div className="sponsors-mask">
        <div className="sponsors-carousel">
          {[...logos, ...logos].map((logo, index) => (
            <div className="sponsors-logo" key={index}>
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
    </div>
  );
}
