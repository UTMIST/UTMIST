import Image from "next/image";
import { EventCardProps } from "@/types/Blog";
import dummy from "@/assets/photos/fibseq.webp";

export default function BlogCardLarge({ title, date, author, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px]">
        {
          image ? (
            <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            />
          ) : (
            <Image
              src={dummy}
              alt={title}
              fill
              className="object-cover"
            />
          )
        }
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg sm:text-xl md:text-2xl lg:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1.5">
            {title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            {date}
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            {author}
          </p>
        </div>
      </div>
    </a>
  );
}
