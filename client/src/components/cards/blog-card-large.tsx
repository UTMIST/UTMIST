import Image from "next/image";
import { EventCardProps } from "@/types/Blog";

export default function BlogCardLarge({ title, date, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
    <div className="relative w-full h-full min-h-[440px] lg:min-h-0 flex flex-col rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
      <div className="relative w-full h-[70%]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 bg-white h-[35%]">
        <h2 className="text-black font-semibold text-2xl sm:text-3xl lg:text-4xl leading-snug">
          {title}
        </h2>
        <p className="text-gray-700 text-xs sm:text-sm mt-2">{date}</p>
      </div>
    </div>
  </a>
  );
}
