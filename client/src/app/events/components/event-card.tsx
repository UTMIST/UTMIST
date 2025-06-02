interface FeaturedEvent {
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titlePosition?: string;
  className?: string;
}

export function EventCard({ 
  title, 
  url, 
  background, 
  titleClassName,
  titlePosition,
  className = ''
}: FeaturedEvent) {
  const titles = title.split('\n');
  
  return (
    <a 
      href={url} 
      className={`featured-card ${className}`}
      style={{ background }}
    >
      <div className={`featured-card-content ${titlePosition === 'right' ? 'text-right' : ''}`}>
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