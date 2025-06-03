import { ChevronRight } from "lucide-react";
import { EventCardProps } from "@/types/Blog";

interface BlogListItemProps extends EventCardProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export default function BlogListItem({ title, date, url, isFirst, isLast }: BlogListItemProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className={`bg-gray-50 hover:bg-gray-100 transition-colors p-4 flex items-center justify-between
        ${isFirst ? 'rounded-t-xl' : ''} 
        ${isLast ? 'rounded-b-xl' : ''}`}>
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
          <h3 className="font-medium text-base sm:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
            {title}
          </h3>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm ml-4 flex-shrink-0">
          {date}
        </p>
      </div>
    </a>
  );
} 