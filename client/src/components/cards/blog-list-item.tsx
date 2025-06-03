import { ChevronRight } from "lucide-react";
import { EventCardProps } from "@/types/Blog";

export default function BlogListItem({ title, date, url }: EventCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        <p className="text-gray-500 text-sm">{date}</p>
      </div>
    </a>
  );
} 