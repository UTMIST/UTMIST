import { StaticImageData } from "next/image";

export interface EventCardProps {
  title: string;
  date: string;
  author: string;
  image: string | StaticImageData;
  url: string;
}
