"use client";
import { useState } from 'react';
import { Tag } from './tag';

interface Resource {
  title: string;
  url: string;
}

interface Event {
  id: number;
  title: string;
  date?: string;
  // Fields for upcoming events
  location?: string;
  time?: string;
  description?: string;
  tags?: string[];
  rsvpLink?: string;
  // Fields for past events
  overview?: string;
  learningGoals?: string[];
  resources?: Resource[];
  instructor?: string;
}

/**
 * A collapsible event item component that shows event details
 * Displays basic info in collapsed state and full details when expanded
 * @param {Event} event - The event data to display
 * @param {boolean} isPassed - Whether the event is past
 */
export function EventItem({ event, isPassed }: { event: Event, isPassed: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle RSVP button click without triggering expansion
  const handleRSVPClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(event.rsvpLink, '_blank');
  };

  return (
    <div 
      className="rounded-lg overflow-hidden cursor-pointer"
      style={{backgroundColor: 'var(--muted)'}}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header section - always visible */}
      <div 
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-colors sm:gap-4"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {/* Mobile layout */}
        <div className="flex flex-col gap-2 sm:hidden w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-grow min-w-0">
              {/* Chevron icon for mobile layout */}
              <svg 
                className={`w-5 h-5 transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                style={{color: 'var(--foreground)'}}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {/* Event title */}
              <span 
                className="event-title text-sm line-clamp-1"
              >
                {event.title}
              </span>
            </div>
          </div>
          {/* Event info */}
          <div className="flex items-center text-xs gap-1 flex-wrap" style={{color: 'var(--muted-foreground)'}}>
            {event.instructor && event.instructor !== 'N/A' && <span>{event.instructor}</span>}
            {event.date && (
              <>
                {event.instructor && <span>•</span>}
                <span>{event.date}</span>
              </>
            )}
            {!isPassed && event.time && (
              <>
                <span>•</span>
                <span>{event.time}</span>
              </>
            )}
            {!isPassed && event.location && (
              <>
                <span>•</span>
                <span>{event.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center space-x-3 flex-grow">
          <svg 
            className={`w-5 h-5 transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            style={{color: 'var(--foreground)'}}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {/* Event title */}
          <span 
            className="event-title line-clamp-1"
          >
            {event.title}
          </span>
        </div>
        
        {/* Event details */}
        <div className="hidden sm:flex items-center justify-end w-auto gap-4">
          <div className="flex items-center text-sm gap-2">
            {event.instructor && event.instructor !== 'N/A' && <span style={{color: 'var(--muted-foreground)'}}>{event.instructor}</span>}
            {event.date && (
              <>
                {event.instructor && event.instructor !== 'N/A' && <span style={{color: 'var(--muted-foreground)'}}>•</span>}
                <span style={{color: 'var(--muted-foreground)'}}>{event.date}</span>
              </>
            )}
            {!isPassed && event.time && (
              <>
                <span style={{color: 'var(--muted-foreground)'}}>•</span>
                <span style={{color: 'var(--muted-foreground)'}}>{event.time}</span>
              </>
            )}
            {!isPassed && event.location && (
              <>
                <span style={{color: 'var(--muted-foreground)'}}>•</span>
                <span style={{color: 'var(--muted-foreground)'}}>{event.location}</span>
              </>
            )}
          </div>
          {!isPassed && (
            <button 
              className="rsvp-button flex-shrink-0" 
              onClick={handleRSVPClick}
            >
              RSVP
            </button>
          )}
        </div>
      </div>

      {/* Expanded details section */}
      {isExpanded && (
        <div className="p-4 border-t border-2 rounded-b-lg" style={{backgroundColor: 'var(--card)', borderColor: 'var(--border)'}}>
          {isPassed ? (
            // Past event layout
            <div className="space-y-6">
              {/* Overview section */}
              {event.overview && (
                <div className="space-y-2">
                  <h4 className="font-medium" style={{color: 'var(--muted-foreground)'}}>Overview</h4>
                  <p style={{color: 'var(--foreground)'}}>{event.overview}</p>
                </div>
              )}

              {/* Learning Goals section */}
              {event.learningGoals && event.learningGoals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium" style={{color: 'var(--muted-foreground)'}}>Learning Goals</h4>
                  <ul className="list-disc list-inside space-y-1" style={{color: 'var(--foreground)'}}>
                    {event.learningGoals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags section */}
              {event.tags && event.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium" style={{color: 'var(--muted-foreground)'}}>Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, index) => (
                      <Tag key={index} text={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* Resources section */}
              {event.resources && event.resources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium" style={{color: 'var(--muted-foreground)'}}>Resources</h4>
                  <ul className="space-y-1">
                    {event.resources.map((resource, index) => (
                      <li key={index}>
                        <a 
                          href={resource.url}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Prevent expansion toggle when clicking links
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // Upcoming event layout
            <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-6">
              {/* Left column - Event details with icons */}
              <div className="space-y-3">
                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      {/* Location icon */}
                      <svg 
                        className="w-5 h-5 flex-shrink-0"
                        style={{color: 'var(--muted-foreground)'}}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium" style={{color: 'var(--muted-foreground)'}}>Location:</span>
                    </div>
                    <span style={{color: 'var(--foreground)'}}>{event.location}</span>
                  </div>
                )}
                
                {/* Date */}
                {event.date && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <svg 
                        className="w-5 h-5 flex-shrink-0"
                        style={{color: 'var(--muted-foreground)'}}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium" style={{color: 'var(--muted-foreground)'}}>Date:</span>
                    </div>
                    <span style={{color: 'var(--foreground)'}}>{event.date}</span>
                  </div>
                )}

                {/* Time */}
                {event.time && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <svg 
                        className="w-5 h-5 flex-shrink-0"
                        style={{color: 'var(--muted-foreground)'}}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium" style={{color: 'var(--muted-foreground)'}}>Time:</span>
                    </div>
                    <span style={{color: 'var(--foreground)'}}>{event.time}</span>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <svg 
                        className="w-5 h-5 flex-shrink-0"
                        style={{color: 'var(--muted-foreground)'}}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span className="font-medium" style={{color: 'var(--muted-foreground)'}}>Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Tag key={index} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - Description and RSVP */}
              <div className="space-y-4">
                <p style={{color: 'var(--foreground)'}}>
                  {event.description || 'More details coming soon...'}
                </p>
                <button 
                  className="rsvp-button"
                  onClick={handleRSVPClick}
                >
                  RSVP
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { Event };
