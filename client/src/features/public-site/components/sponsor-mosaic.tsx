import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import modalMark from "@/assets/logos/modal-mark.png";
import { CardLink } from "@/shared/ui";
import { homeSponsors } from "@/features/public-site/data/home-sponsors";

// Leave deliberate gaps between logos rather than filling the grid sequentially.
const slots = [0, 2, 4, 6, 9, 10, 13, 15, 17, 19, 20, 22, 24, 26, 28, 31, 33, 35, 37];
const mobileSlots = [0, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 18, 20, 21, 23, 25, 26, 28, 29];
const mobileEmptySlots = Array.from({ length: 30 }, (_, index) => index).filter((index) => !mobileSlots.includes(index));

type LogoArtwork = {
  ratio: number;
  // Visible artwork bounds (left, top, width, height) within the original asset.
  bounds?: [number, number, number, number];
  src?: StaticImageData;
};

// Display crops remove file padding without changing the original brand assets.
const logoArtwork: Record<string, LogoArtwork> = {
  "AMD Logo": { ratio: 160 / 38 },
  "Modal Logo": { ratio: 1102 / 576, src: modalMark },
  "Qualcomm Logo": { ratio: 207 / 38 },
  "Vector Institute Logo": { ratio: 151 / 62, bounds: [0.035, 0.09, 0.925, 0.82] },
  "Google Cloud Logo": { ratio: 270 / 180, bounds: [0.11, 0.4, 0.78, 0.2] },
  "Cohere Logo": { ratio: 1, bounds: [0.075, 0.42, 0.85, 0.16] },
  "Jarvis Logo": { ratio: 692 / 190 },
  "Rotman School of Management Logo": { ratio: 440 / 200 },
  "Tenstorrent Logo": { ratio: 1155 / 293 },
  "Aerocoustics Logo": { ratio: 2188 / 719, bounds: [0.06, 0.26, 0.91, 0.52] },
  "Wombo Logo": { ratio: 790 / 257, bounds: [0.06, 0.17, 0.88, 0.66] },
  "Google Logo": { ratio: 1200 / 406 },
  "PwC Logo": { ratio: 1, bounds: [0.195, 0.265, 0.61, 0.47] },
  "RBC Logo": { ratio: 1.5, bounds: [0.325, 0.16, 0.35, 0.68] },
  "Edge AI Logo": { ratio: 1, bounds: [0.3, 0.23, 0.4, 0.45] },
  "CGI Logo": { ratio: 1200 / 563 },
  "CPSIF Logo": { ratio: 1, bounds: [0.12, 0.12, 0.76, 0.76] },
  "Engineering Society Logo": { ratio: 273 / 399 },
  "Department of Computer Science": { ratio: 1 },
};

export default function SponsorMosaic() {
  const arrangedSponsors = homeSponsors.toSorted((a, b) =>
    a.alt.replace(/ Logo$/, "").localeCompare(b.alt.replace(/ Logo$/, ""), "en"));
  const sponsorsByCell = new Map(arrangedSponsors.map((sponsor, index) => [
    slots[index] ?? 40 + (index - slots.length) * 2,
    sponsor,
  ]));
  const cellCount = Math.ceil((Math.max(...sponsorsByCell.keys()) + 1) / 8) * 8;
  let emptyCell = 0;

  return (
    <div data-home-stagger="diagonal" className="home-sponsor-mosaic" role="group" aria-label="Our sponsors">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-8">
        {Array.from({ length: cellCount }, (_, index) => {
          const sponsor = sponsorsByCell.get(index);
          const mobileCell = sponsor ? mobileSlots[arrangedSponsors.indexOf(sponsor)] : mobileEmptySlots[emptyCell++];
          const position = mobileCell === undefined ? undefined : {
            "--sponsor-column": mobileCell % 5 + 1,
            "--sponsor-row": Math.floor(mobileCell / 5) + 1,
          } as CSSProperties;
          if (!sponsor) {
            return <div key={index} aria-hidden="true" style={position} className={`home-sponsor-cell aspect-square ${mobileCell === undefined ? "hidden sm:block" : ""}`} />;
          }
          const artwork = logoArtwork[sponsor.alt] ?? { ratio: 2 };
          const [left, top, width, height] = artwork.bounds ?? [0, 0, 1, 1];
          const visibleRatio = artwork.ratio * width / height;
          return (
            <CardLink variant="raised" data-home-reveal key={sponsor.link} href={sponsor.link} style={position}
              className="home-sponsor-cell home-sponsor-tile relative flex aspect-square min-w-0 items-center justify-center">
                <span className="relative block overflow-hidden" style={{ aspectRatio: visibleRatio, width: `${Math.min(82, 58 * visibleRatio)}%` }}>
                  <Image src={artwork.src ?? sponsor.src} alt={sponsor.alt} width={300} height={Math.round(300 / artwork.ratio)}
                    sizes="(min-width: 1024px) 80px, (min-width: 640px) 14vw, 20vw"
                    className="absolute max-w-none"
                    style={{ width: `${100 / width}%`, height: `${100 / height}%`, left: `${-100 * left / width}%`, top: `${-100 * top / height}%` }} />
                </span>
            </CardLink>
          );
        })}
        <div aria-hidden="true" className="hidden aspect-square sm:block lg:hidden" />
        <div aria-hidden="true" className="hidden aspect-square sm:block lg:hidden" />
      </div>
    </div>
  );
}
