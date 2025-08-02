import Image from "next/image";
import { EventCardProps } from "@/types/Blog";
import dummy from "@/assets/photos/fibseq.webp";

export default function BlogCardLarge({ title, date, author, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="rounded-lg border shadow-sm overflow-hidden h-[360px] sm:h-[484px] lg:h-[544px] flex flex-col" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
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
            <p className="text-sm sm:text-base" style={{color: 'var(--muted-foreground)'}}>
              {date}
            </p>
            <p className="text-sm sm:text-base" style={{color: 'var(--muted-foreground)'}}>
              {author}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
