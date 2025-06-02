"use client";
import { useState } from 'react';

// Event interface defining the shape of our event data
interface Event {
  id: number;
  title: string;
  location: string;
  time: string;
  description?: string;  // Optional description field
  date?: string;        // Optional date field
  tags: string[];
}

// Tag component for consistent styling
function Tag({ text }: { text: string }) {
  return (
    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
      {text}
    </span>
  );
}

export function EventItem({ event }: { event: Event }) {
  // State to track if the dropdown is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // Main container - gray background with rounded corners
    <div className="bg-gray-200 rounded-lg overflow-hidden">
      {/* Clickable header section
          - p-4: padding all around
          - hover:bg-gray-300: darkens on hover
          - transition-colors: smooth color change animation */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-300 transition-colors"
      >
        {/* Left side: Arrow icon + Title */}
        <div 
          className="flex items-center space-x-3 flex-grow"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Arrow icon */}
          <svg 
            className={`w-5 h-5 text-gray-700 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
          <span className="event-title">{event.title}</span>
        </div>
        
        {/* Right side: Location, Time, and RSVP */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <span className="text-gray-700">{event.location}</span>
            <span className="mx-2 text-gray-700">•</span>
            <span className="text-gray-700">{event.date}</span>
            <span className="mx-2 text-gray-700">•</span>
            <span className="text-gray-700">{event.time}</span>
          </div>
          <button className="rsvp-button" onClick={(e) => e.stopPropagation()}>
            RSVP
          </button>
        </div>
      </div>

      {/* Expandable section - only shown when isExpanded is true
          - border-2: visible border
          - rounded-b-lg: rounded corners at bottom
          - grid layout for two columns */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-300 border-2 border-gray-200 rounded-b-lg">
          <div className="grid grid-cols-[auto,1fr] gap-4">
            <div className="space-y-2">
              {/* Location detail with icon */}
              <div className="flex items-center space-x-2">
                <svg 
                  className="w-5 h-5 text-gray-600"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* Location icon */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600 font-medium">Location:</span>
                <span className="text-gray-800">{event.location}</span>
              </div>
              
              {/* Date detail with icon */}
              <div className="flex items-center space-x-2">
                <svg 
                  className="w-5 h-5 text-gray-600"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* Date icon */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="text-gray-800">{event.date}</span>
              </div>

              {/* Time detail with icon */}
              <div className="flex items-center space-x-2">
                <svg 
                  className="w-5 h-5 text-gray-600"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* Time icon */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="text-gray-800">{event.time}</span>
              </div>

              {/* Tags */}
              <div className="flex items-center space-x-2">
                <svg 
                  className="w-5 h-5 text-gray-600"
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
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, index) => (
                    <Tag key={index} text={tag} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                {event.description || 'More details coming soon...'}
              </p>
              <button className="rsvp-button">
                RSVP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { Event };
