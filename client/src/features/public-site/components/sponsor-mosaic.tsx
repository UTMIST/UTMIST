import type { HomePageContent } from "@/shared/lib";
import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import modalMark from "@/assets/logos/modal-mark.png";
import { CardLink } from "@/shared/ui";
import { sponsorAssets } from "@/features/public-site/data/home-sponsors";

// Desktop and tablet layouts leave deliberate gaps between logos.
const slots = [0, 2, 4, 6, 9, 10, 13, 15, 17, 19, 20, 22, 24, 26, 28, 31, 33, 35, 37];
// Larger phone tiles keep wordmarks readable; center the final sponsor.
const mobileSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19];
const mobileEmptySlots = Array.from({ length: 21 }, (_, index) => index).filter((index) => !mobileSlots.includes(index));

type LogoArtwork = {
  ratio: number;
  // Visible artwork bounds (left, top, width, height) within the original asset.
  bounds?: [number, number, number, number];
  src?: StaticImageData;
};

// Display crops remove file padding without changing the original brand assets.
const logoArtwork: Record<string, LogoArtwork> = {
  "amd": { ratio: 160 / 38 },
  "modal": { ratio: 1102 / 576, src: modalMark },
  "qualcomm": { ratio: 207 / 38 },
  "vector": { ratio: 151 / 62, bounds: [0.035, 0.09, 0.925, 0.82] },
  "google-cloud": { ratio: 270 / 180, bounds: [0.11, 0.4, 0.78, 0.2] },
  "cohere": { ratio: 1, bounds: [0.075, 0.42, 0.85, 0.16] },
  "jarvis": { ratio: 692 / 190 },
  "rotman": { ratio: 440 / 200 },
  "tenstorrent": { ratio: 1155 / 293 },
  "aerocoustics-transparent": { ratio: 2188 / 719, bounds: [0.06, 0.26, 0.91, 0.52] },
  "wombo": { ratio: 790 / 257, bounds: [0.06, 0.17, 0.88, 0.66] },
  "google": { ratio: 1200 / 406 },
  "pwc-transparent": { ratio: 1, bounds: [0.195, 0.265, 0.61, 0.47] },
  "rbc": { ratio: 1.5, bounds: [0.325, 0.16, 0.35, 0.68] },
  "edgeai": { ratio: 1, bounds: [0.3, 0.23, 0.4, 0.45] },
  "cgi": { ratio: 1200 / 563 },
  "cpsif": { ratio: 1, bounds: [0.12, 0.12, 0.76, 0.76] },
  "engsoc": { ratio: 273 / 399 },
  "compsci": { ratio: 1 },
};

export default function SponsorMosaic({ sponsors }: { sponsors: HomePageContent["sponsors"]["items"] }) {
  const arrangedSponsors = sponsors.toSorted((a, b) =>
    a.alt.replace(/ Logo$/, "").localeCompare(b.alt.replace(/ Logo$/, ""), "en"));
  const sponsorsByCell = new Map(arrangedSponsors.map((sponsor, index) => [
    slots[index] ?? 40 + (index - slots.length) * 2,
    sponsor,
  ]));
  const cellCount = Math.ceil((Math.max(...sponsorsByCell.keys()) + 1) / 8) * 8;
  let emptyCell = 0;

  return (
    <div data-home-stagger="diagonal" className="home-sponsor-mosaic" role="group" aria-label="Our sponsors">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7 lg:grid-cols-8">
        {Array.from({ length: cellCount }, (_, index) => {
          const sponsor = sponsorsByCell.get(index);
          const mobileCell = sponsor ? mobileSlots[arrangedSponsors.indexOf(sponsor)] : mobileEmptySlots[emptyCell++];
          const position = mobileCell === undefined ? undefined : {
            "--sponsor-column": mobileCell % 3 + 1,
            "--sponsor-row": Math.floor(mobileCell / 3) + 1,
          } as CSSProperties;
          if (!sponsor) {
            return <div key={index} aria-hidden="true" style={position} className={`home-sponsor-cell aspect-[4/3] sm:aspect-square ${mobileCell === undefined ? "hidden sm:block" : ""}`} />;
          }
          const artwork = logoArtwork[sponsor.asset] ?? { ratio: 2 };
          const [left, top, width, height] = artwork.bounds ?? [0, 0, 1, 1];
          const visibleRatio = artwork.ratio * width / height;
          return (
            <CardLink variant="raised" data-home-reveal key={index} href={sponsor.href} style={position}
              className="home-sponsor-cell home-sponsor-tile relative flex aspect-[4/3] min-w-0 items-center justify-center sm:aspect-square">
                <span className="relative block overflow-hidden" style={{ aspectRatio: visibleRatio, width: `${Math.min(82, 58 * visibleRatio)}%` }}>
                  <Image src={artwork.src ?? sponsorAssets[sponsor.asset]} alt={sponsor.alt} width={300} height={Math.round(300 / artwork.ratio)}
                    sizes="(min-width: 1024px) 80px, (min-width: 640px) 14vw, 33vw"
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
