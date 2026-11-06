import Image from "next/image";
import "@/styles/home.css";
import { homeSponsors } from "@/features/public-site/data/home-sponsors";

export default function Sponsors() {
  return (
    <div className="sponsors-container">
      <h3 className="sponsors-title">Supported By</h3>
      <div
        className="mx-auto -mt-2 mb-6 h-[5px] w-[180px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(156, 50, 227, 0), #9C32E3), linear-gradient(to bottom, #98CDF9, #1E19B1)",
        }}
      />
      <div className="sponsors-mask">
        <div className="sponsors-carousel">
          {[...homeSponsors, ...homeSponsors].map((logo, index) => (
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
