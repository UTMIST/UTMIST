import Image from "next/image";
import { EventCardProps } from "@/types/Blog";
import dummy from "@/assets/photos/fibseq.webp";

export default function BlogCardSmall({ title, date, author, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
    <div className="w-full aspect-[4/3] min-h-[250px] rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="relative w-full h-[70%] md:h-[55%]">
        <Image
          src={image || dummy}
          alt={title}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="p-2 md:p-3 h-[30%] md:h-[45%] flex flex-col justify-between">
        <h3 className="text-black font-semibold leading-tight line-clamp-2 text-base">{title}</h3>
        <div>
          <p className="text-gray-500 text-xs">{date}</p>
          <p className="text-gray-500 text-xs">{author}</p>
        </div>
      </div>
    </div>
    </a>
  );
}
