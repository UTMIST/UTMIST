import { StaticImageData } from "next/image";

export interface Event {
    title: string;
    description: string;
    url: string;
}

export interface EventCardProps {
    title: string;
    description: string;
    url: string;
}

export interface HeroCardProps {
    image: StaticImageData;
    title: string;
    description: string;
}

export interface StatItemProps {
    number: string;
    description: string;
}