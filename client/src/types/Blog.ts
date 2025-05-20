import { StaticImageData } from "next/image";

export interface EventCardProps {
  title: string;
  date: string;
  image: string | StaticImageData;
  url: string;
}
