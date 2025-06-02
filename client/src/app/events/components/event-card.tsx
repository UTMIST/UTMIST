/**
 * Interface for a featured event card
 * @property {string} title - Event title, can include '\n' for line breaks
 * @property {string} url - URL the card links to
 * @property {string} background - CSS background value (usually a gradient)
 * @property {string} [titleClassName] - Optional class for custom title styling
 * @property {string} [titlePosition] - Optional position for title ('right' for right-aligned)
 * @property {string} [className] - Optional additional classes for the card
 */
interface FeaturedEvent {
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titlePosition?: string;
  className?: string;
}

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
  titleClassName,
  titlePosition,
  className = ''
}: FeaturedEvent) {
  // Split title into parts if it contains line breaks
  const titles = title.split('\n');
  
  return (
    <a 
      href={url} 
      className={`featured-card ${className}`}
      style={{ background }}
    >
      {/* Container for title(s) with optional right alignment */}
      <div className={`featured-card-content ${titlePosition === 'right' ? 'text-right' : ''}`}>
        {/* Render each part of the title on a new line */}
        {titles.map((titlePart, index) => (
          <h3 key={index} className={`featured-card-title ${titleClassName || ''}`}>
            {titlePart}
          </h3>
        ))}
      </div>
    </a>
  );
}

export type { FeaturedEvent }; 