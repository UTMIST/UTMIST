import type { StaticImageData } from "next/image";
import type { HomePageContent } from "@/shared/lib";
import ai2Artwork from "@/assets/photos/ai2/ai2cube-3.png";
import { homePageContent } from "@/features/public-site/data/home-page";

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

const artwork: Record<HomePageContent["events"]["items"][number]["artwork"], HomeEvent["artwork"]> = {
  eigenai: { kind: "eigenai" },
  cucai: { kind: "image", src: "/home-redesign/cucai-conference.webp", alt: "", fit: "cover", position: "top" },
  ai2: { kind: "image", src: ai2Artwork, alt: "", fit: "contain" },
  "genai-genesis": { kind: "image", src: "/genai.webp", alt: "", fit: "cover" },
};

export function pageEvent(item: HomePageContent["events"]["items"][number]): HomeEvent {
  const asset = artwork[item.artwork];
  return {
    id: item.id ?? item.artwork,
    title: item.title, description: item.description, url: item.href, category: item.category,
    artwork: asset.kind === "image" ? { ...asset, alt: item.imageAlt } : asset,
  };
}

export const homeEvents: readonly HomeEvent[] = homePageContent.events.items.map(pageEvent);
