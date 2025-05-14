import Image , {StaticImageData} from "next/image";

interface EventCardProps {
  title: string;
  date: string;
  image: string | StaticImageData;
  url: string;
}

export default function BlogCardLarge({ title, date, image, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
    <div className="relative w-[300px] h-[200px] min-h-[340px] min-w-[400px] rounded-lg overflow-hidden shadow-md">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute bottom-0 left-0 w-full p-4">
        <h2 className="text-black font-semibold text-4xl leading-snug">
          {title}
        </h2>
        <p className="text-gray-700 text-xs mt-1">{date}</p>
      </div>
    </div>
  </a>
  );
}
