import Image from "next/image";
import { EventCardProps } from "@/types/Blog";

export default function BlogCardSmall({
  title,
  date,
  image,
  url,
}: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="w-[240px]">
        <div className="relative w-full h-[160px] rounded-xl overflow-hidden border border-gray-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="mt-2">
          <h3 className="text-black font-semibold leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
    </a>
  );
}
