/**
 * Interface for a featured event card
 * @property {string} title - Event title, can include '\n' for line breaks
 * @property {string} url - URL the card links to
 * @property {string} background - CSS background value (usually a gradient)
 * @property {string} [titleClassName] - Optional class for custom title styling
 * @property {string} [titleAlignment] - Optional alignment for title ('left' or 'right')
 * @property {string} [className] - Optional additional classes for the card
 */
interface FeaturedEvent {
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titleAlignment?: 'left' | 'right';
  className?: string;
}

export type { FeaturedEvent };

/**
 * A card component for featured events that displays with a gradient background and custom styling
 * Supports multi-line titles and custom positioning
 * 
 * @component
 * @param {FeaturedEvent} props - The props for the featured event card
 * @returns {JSX.Element} A styled card component with title and background
 */
export function EventCard({ 
  title, 
  url, 
  background, 
  titleClassName = '', 
  titleAlignment = 'left',
  className = '' 
}: FeaturedEvent) {
  const alignmentClass = titleAlignment === 'right' ? 'title-align-right' : 'title-align-left';
  
  return (
    <a 
      href={url} 
      className={`featured-card ${className}`}
      style={{ background }}
    >
      <div className="featured-card-content">
        {title.split('\n').map((part, i) => (
          <h3 
            key={i} 
            className={`featured-card-title ${titleClassName} ${alignmentClass}`}
          >
            {part}
          </h3>
        ))}
      </div>
    </a>
  );
} 