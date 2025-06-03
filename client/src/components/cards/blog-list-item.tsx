import { EventCardProps } from "@/types/Blog";

interface BlogListItemProps extends EventCardProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export default function BlogListItem({ title, date, url, isFirst, isLast }: BlogListItemProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className={`bg-gray-50 hover:bg-gray-100 transition-colors p-3 sm:p-4 flex items-center justify-between
        ${isFirst ? 'rounded-t-xl' : ''} 
        ${isLast ? 'rounded-b-xl' : ''}`}>
        <div className="min-w-0">
          <h3 className="font-medium text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
            {title}
          </h3>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm ml-3 sm:ml-4 flex-shrink-0">
          {date}
        </p>
      </div>
    </a>
  );
} 