import Image from "next/image";
import { EventCardProps } from "@/types/Blog";
import dummy from "@/assets/photos/fibseq.webp";

export default function BlogCardSmall({ title, date, author, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
    <div className="w-full aspect-[5/4] rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="relative w-full h-[60%]">
        {/* If image is provided, use it, otherwise use the dummy image */}
        {
          image ? (
            <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center"
          />
        ) : (
          <Image
            src={dummy}
            alt={title}
            fill
            className="object-cover object-center"
          />
        )
        }
      </div>
      <div className="p-3 h-[40%]">
        <h3 className="text-black font-semibold leading-tight line-clamp-2 text-base">{title}</h3>
        <p className="text-gray-500 text-xs mt-1">{date}</p>
        <p className="text-gray-500 text-xs">{author}</p>
      </div>
    </div>
    </a>
  );
}
