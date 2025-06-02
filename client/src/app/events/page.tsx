"use client";
import { useState } from 'react';
import "@/styles/events.css"  
import { EventItem } from "./components/event-item";
import { SearchBar } from "./components/search-bar";
import { TagFilter } from "./components/tag-filter";
import { EventCard, type FeaturedEvent } from './components/event-card';

// Featured events data
const featuredEvents: FeaturedEvent[] = [
  {
    title: "EigenAI",
    url: "/eigenai",
    background: 'linear-gradient(135deg, #e57fe5 0%, #8055e6 50%, #4099ee 100%)',
    titleClassName: 'eigenai',
    className: 'featured-card-large'
  },
  {
    title: "GenAI\nGenesis",
    url: "https://genaigenesis.ca",
    background: 'linear-gradient(135deg, #9966ff 0%, #4040e5 100%)',
    titleClassName: 'genai'
  },
  {
    title: "AI^2",
    url: "https://www.eventbrite.ca/e/ai2-reinforcement-learning-tournament-tickets-1141689918279",
    background: 'linear-gradient(135deg, #e57fe5 0%, #6655e6 100%)',
    titleClassName: 'aisqr',
    titlePosition: 'right',
    className: 'featured-card-large'
  },
  {
    title: "Project\nShowcase",
    url: "/showcase",
    background: 'linear-gradient(135deg, #372a5b 0%, #8673a1 50%, #e5a2d3 100%)'
  }
];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    const events = [
        {
          id: 1,
          title: "SciML Workshop",
          location: "Bahen 1190",
          date: "May 12th, 2024",
          time: "17:00-19:00",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          tags: ["Workshop", "Scientific ML", "Beginner-Friendly"]
        },
        {
          id: 2,
          title: "Paper Reading Workshop",
          location: "Bahen 1200",
          date: "May 12th, 2024",
          time: "17:00-19:00",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          tags: ["Workshop", "Research", "LLMs"]
        }
    ];

    // Get all unique tags
    const allTags = Array.from(new Set(events.flatMap(event => event.tags))).sort();

    // Toggle tag selection
    const toggleTag = (tag: string) => {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    };

    // Filter events based on search query and selected tags
    const filteredEvents = events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.every(tag => event.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    return <main className="px-4 sm:px-0">
    {/* Hero section */}
    <div className="hero-section">
      <h2 className="hero-title text-3xl sm:text-4xl">Events</h2>
      <p className="hero-subtitle text-sm sm:text-base px-2 sm:px-15">
        See what is happening in our UTMIST community
      </p>
    </div>

    {/* Upcoming events section */}
    <div className="upcoming-events-container p-4 sm:p-6 rounded-lg">
      <h2 className="text-2xl sm:text-3xl mb-2 text-black tracking-[-3%]">Upcoming Events</h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Explore what is happening on campus right now</p>
      
      {/* Search and filter section */}
      <div className="space-y-4 mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
      </div>
      
      {/* Event list section */}
      <div className="text-black space-y-2">
        {/* No events found */}
        {filteredEvents.length === 0 && (
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {events.length === 0 ? "More events are in the works, stay tuned! 👀" : "No events found matching your search."}
          </p>
        )}

        {/* Event list (Filtered) */}
        {filteredEvents.length > 0 && 
          <div className="space-y-2 border-2 border-gray-300 rounded-lg p-2 sm:p-4">
            {filteredEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        }
      </div>
    </div>

    {/* Featured events section */}
    <section className="featured-section">
      <div className="featured-container">
        <h2 className="featured-title tracking-[-3%]">Featured</h2>
        <p className="featured-description">
          UTMIST Flagship Events - hackathons, conferences, workshops, showcases
        </p>
        
        <div className="featured-grid">
          {featuredEvents.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              url={event.url}
              background={event.background}
              titleClassName={event.titleClassName}
              titlePosition={event.titlePosition}
              className={event.className}
            />
          ))}
        </div>
      </div>
    </section>
    </main>
}