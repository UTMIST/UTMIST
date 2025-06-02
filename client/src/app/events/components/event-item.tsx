"use client";
import { useState } from 'react';
import { Tag } from './tag';

/**
 * Interface defining the structure of an event
 * @property {number} id - Unique identifier for the event
 * @property {string} title - Event title
 * @property {string} location - Where the event is taking place
 * @property {string} time - Time of the event
 * @property {string} [description] - Optional detailed description
 * @property {string} [date] - Optional event date
 * @property {string[]} tags - Categories or types for the event
 */
interface Event {
  id: number;
  title: string;
  location: string;
  time: string;
  description?: string;
  date?: string;
  tags: string[];
}

/**
 * A collapsible event item component that shows event details
 * Displays basic info in collapsed state and full details when expanded
 * @param {Event} event - The event data to display
 * @param {boolean} isPassed - Whether the event is past
 */
export function EventItem({ event, isPassed }: { event: Event, isPassed: boolean }) {
  // Controls the expanded/collapsed state
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden">
      {/* Header section - always visible */}
      <div 
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-300 transition-colors sm:gap-4"
      >
        {/* Mobile layout */}
        <div className="flex flex-col gap-2 sm:hidden w-full">
          {/* Title row with RSVP */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-grow min-w-0">
              <svg 
                className={`w-5 h-5 text-gray-700 transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span 
                className="event-title text-sm line-clamp-1"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {event.title}
              </span>
            </div>
          </div>
          {/* Details row */}
          <div className="flex items-center text-xs text-gray-700 gap-1 flex-wrap">
            <span>{event.location}</span>
            <span>•</span>
            <span>{event.date}</span>
            <span>•</span>
            <span>{event.time}</span>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center space-x-3 flex-grow">
          <svg 
            className={`w-5 h-5 text-gray-700 transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span 
            className="event-title line-clamp-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {event.title}
          </span>
        </div>
        
        <div className="hidden sm:flex items-center justify-end w-auto gap-4">
          <div className="flex items-center text-sm gap-2">
            <span className="text-gray-700">{event.location}</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-700">{event.date}</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-700">{event.time}</span>
          </div>
          {!isPassed && (
            <button 
              className="rsvp-button flex-shrink-0" 
              onClick={(e) => e.stopPropagation()}
            >
              RSVP
            </button>
          )}
        </div>
      </div>

      {/* Expanded details section */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-300 border-2 border-gray-200 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-6">
            {/* Left column - Event details with icons */}
            <div className="space-y-3">
              {/* Location */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <svg 
                    className="w-5 h-5 text-gray-600 flex-shrink-0"
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
                  <span className="text-gray-600 font-medium">Location:</span>
                </div>
                <span className="text-gray-800">{event.location}</span>
              </div>
              
              {/* Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <svg 
                    className="w-5 h-5 text-gray-600 flex-shrink-0"
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
                  <span className="text-gray-600 font-medium">Date:</span>
                </div>
                <span className="text-gray-800">{event.date}</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <svg 
                    className="w-5 h-5 text-gray-600 flex-shrink-0"
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
                  <span className="text-gray-600 font-medium">Time:</span>
                </div>
                <span className="text-gray-800">{event.time}</span>
              </div>

              {/* Tags */}
              <div className="flex items-start gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <svg 
                    className="w-5 h-5 text-gray-600 flex-shrink-0"
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
                  <span className="text-gray-600 font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, index) => (
                    <Tag key={index} text={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Description and RSVP */}
            <div className="space-y-4">
              <p className="text-gray-700">
                {event.description || 'More details coming soon...'}
              </p>
              {!isPassed && (
                <button className="rsvp-button">
                  RSVP
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { Event };
