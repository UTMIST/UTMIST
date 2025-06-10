/**
 * Props for the Tag component
 * @property {string} text - The text to display inside the tag
 */
interface TagProps {
  text: string;
}

/**
 * A simple tag component that displays text in a pill-shaped container
 * Used for showing event categories, types, or other metadata
 */
export function Tag({ text }: TagProps) {
  return (
    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
      {text}
    </span>
  );
} 