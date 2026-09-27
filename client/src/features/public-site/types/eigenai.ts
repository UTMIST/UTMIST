import type { StaticImageData } from "next/image";

export type EigenAIImage = StaticImageData | string;

// Shared presentation contract for the redesign and future content readers.
export interface EigenAISpeaker {
  name: string;
  role: string;
  bio?: string;
  profileURL?: string;
  profileImage?: EigenAIImage;
}

export interface EigenAIWorkshop {
  title: string;
  host?: string;
  description: string;
  image?: EigenAIImage;
}

export interface EigenAIScheduleItem {
  time: string;
  title: string;
  description?: string;
  location?: string;
}

export interface EigenAIScheduleDay {
  date: string;
  day: string;
  items: readonly EigenAIScheduleItem[];
}

export interface EigenAIVenueDetails {
  name: string;
  address: string;
  query: string;
}

export interface EigenAIPageContent {
  dateLabel: string;
  locationLabel?: string;
  ticketUrl?: string;
  metrics: readonly { number: string; description: string }[];
  about: {
    paragraphs: readonly string[];
    image?: EigenAIImage;
    imageAlt?: string;
  };
  keynote?: EigenAISpeaker | null;
  speakers: readonly EigenAISpeaker[];
  workshops: readonly EigenAIWorkshop[];
  schedule: readonly EigenAIScheduleDay[];
  venue?: EigenAIVenueDetails | null;
  closingLines: readonly string[];
}
