import Image from "next/image";
import { EventCardProps } from "@/types/Blog";
import dummy from "@/assets/photos/fibseq.webp";

<<<<<<< HEAD
export default function BlogCardLarge({ title, date, author, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[360px] sm:h-[484px] lg:h-[544px] flex flex-col">
        <div className="relative w-full flex-1">
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
        <div className="p-4 flex flex-col min-h-[100px]">
          <h3 className="font-medium text-lg sm:text-xl md:text-2xl lg:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1.5">
            {title}
          </h3>
          <div className="mt-auto">
            <p className="text-gray-600 text-sm sm:text-base">
              {date}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              {author}
            </p>
          </div>
=======
export default function BlogCardLarge({
  title,
  date,
  image,
  url,
}: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="relative w-[240px] h-[160px] sm:w-[300px] sm:h-[200px] sm:min-h-[340px] sm:min-w-[400px] rounded-lg overflow-hidden shadow-md">
        <Image src={image} alt={title} fill className="object-cover" priority />
        <div className="absolute bottom-0 left-0 w-full p-4">
          <h2 className="text-black font-semibold text-sm sm:text-4xl leading-snug">
            {title}
          </h2>
          <p className="text-gray-700 text-xs mt-1">{date}</p>
>>>>>>> 8590029 (blog has mobile interface done, only career is)
        </div>
      </div>
    </a>
  );
}
