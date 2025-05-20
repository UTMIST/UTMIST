import Image from "next/image";
import "../styles/home.css"; 
import amdLogo from "../assets/logos/amd.svg"; 
import qualcommLogo from "../assets/logos/qualcomm.svg"; 
import vectorLogo from "../assets/logos/vector.svg"; 
import googleCloudLogo from "../assets/logos/google-cloud.svg"; 
import cohereLogo from "../assets/logos/cohere.webp";
import jarvisLogo from "../assets/logos/jarvis.webp";
import rotmanLogo from "../assets/logos/rotman.webp";
import tenstorrentLogo from "../assets/logos/tenstorrent.png";
import aerocousticsLogo from "../assets/logos/aerocoustics.png";
import womboLogo from "../assets/logos/wombo.svg";


const logos = [
    { src: amdLogo, alt: "AMD Logo" },
    { src: qualcommLogo, alt: "Qualcomm Logo" },
    { src: vectorLogo, alt: "Vector Institute Logo" },
    { src: googleCloudLogo, alt: "Google Cloud Logo" },
    { src: cohereLogo, alt: "Cohere Logo" },
    { src: jarvisLogo, alt: "Jarvis Logo" },
    { src: rotmanLogo, alt: "Rotman School of Management Logo" },
    { src: tenstorrentLogo, alt: "Tenstorrent Logo" },
    { src: aerocousticsLogo, alt: "Aerocoustics Logo" },
    { src: womboLogo, alt: "Wombo Logo" },
];

export default function Sponsors() {
    return (
        <div className="sponsors-container">
            <h3 className="sponsors-title">Backed By</h3>
            <div className="sponsors-mask">
                <div className="sponsors-carousel">
                    {[...logos, ...logos].map((logo, index) => (
                        <div className="sponsors-logo" key={index}>
                            <Image 
                                src={logo.src}
                                alt={logo.alt}
                                width={150}
                                height={80}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
