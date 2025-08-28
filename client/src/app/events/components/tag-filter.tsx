/**
 * Props for the TagFilter component
 * @property {string[]} tags - Array of all available tags
 * @property {string[]} selectedTags - Array of currently selected tags
 * @property {Function} onToggleTag - Callback function when a tag is clicked
 */
interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

/**
 * A component that displays a list of filterable tags
 * Allows users to select multiple tags to filter events
 * Selected tags are highlighted in UTMIST purple
 */
export function TagFilter({ tags, selectedTags, onToggleTag }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
            selectedTags.includes(tag)
              ? 'bg-[#372a5b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
} 