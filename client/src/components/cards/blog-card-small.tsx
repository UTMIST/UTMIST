import Image from "next/image";
import { EventCardProps } from "@/types/Blog";
import dummy from "@/assets/photos/fibseq.webp";

export default function BlogCardSmall({ title, date, author, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
    <div className="w-full h-[260px] rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col">
      <div className="relative w-full h-[160px]">
        <Image
          src={image || dummy}
          alt={title}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="p-2.5">
        <h3 className="font-medium text-base sm:text-lg text-black line-clamp-2 leading-normal mb-1.5">{title}</h3>
        <div>
          <p className="text-gray-600 text-sm">{date}</p>
          <p className="text-gray-600 text-sm">{author}</p>
        </div>
      </div>
    </div>
    </a>
  );
}
