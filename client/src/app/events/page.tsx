"use client";
import { useState, useEffect } from 'react';
import "@/styles/events.css"  
import { EventItem } from "./components/event-item";
import { SearchBar } from "./components/search-bar";
import { TagFilter } from "./components/tag-filter";
import { EventCard } from './components/event-card';
import { getUpcomingEvents, getPastEvents, getFeaturedEvents } from './api/events';
import type { UpcomingEvent, PastEvent, FeaturedEvent } from './api/events';

/**
 * Main Events Page Component
 * Displays upcoming and past events with search and filtering capabilities
 * Features a featured events section with a fixed grid layout
 */
export default function EventsPage() {
    // State for events data
    const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
    const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for search and filtering
    const [upcomingSearchQuery, setUpcomingSearchQuery] = useState('');
    const [upcomingSelectedTags, setUpcomingSelectedTags] = useState<string[]>([]);
    const [pastSearchQuery, setPastSearchQuery] = useState('');
    const [pastSelectedTags, setPastSelectedTags] = useState<string[]>([]);

    // Fetch events on component mount
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          setIsLoading(true);
          const [upcoming, past, featured] = await Promise.all([
            getUpcomingEvents(),
            getPastEvents(),
            getFeaturedEvents()
          ]);
          setUpcomingEvents(upcoming);
          setPastEvents(past);
          setFeaturedEvents(featured);
        } catch (error) {
          console.error('Error fetching events:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEvents();
    }, []);

    // Get all unique tags from both upcoming and past events
    const upcomingTags = Array.from(new Set(upcomingEvents.flatMap(event => event.tags))).sort();
    const pastTags = Array.from(new Set(pastEvents.flatMap(event => event.tags))).sort();

    // Toggle tag selection functions
    const toggleUpcomingTag = (tag: string) => {
      setUpcomingSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    };

    // Toggle past tag selection
    const togglePastTag = (tag: string) => {
      setPastSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    };

    // Filter upcoming events for search and tags
    const filterUpcomingEvents = (events: UpcomingEvent[], searchQuery: string, selectedTags: string[]) => {
      return events.filter(event => {
        const matchesSearch = 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = 
          selectedTags.length === 0 || 
          selectedTags.every(tag => event.tags.includes(tag));

        return matchesSearch && matchesTags;
      });
    };

    // Filter past events for search and tags
    const filterPastEvents = (events: PastEvent[], searchQuery: string, selectedTags: string[]) => {
      return events.filter(event => {
        const matchesSearch = 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.learningGoals.some(goal => 
            goal.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesTags = 
          selectedTags.length === 0 || 
          selectedTags.every(tag => event.tags.includes(tag));

        return matchesSearch && matchesTags;
      });
    };

    // Filter events
    const filteredUpcomingEvents = filterUpcomingEvents(upcomingEvents, upcomingSearchQuery, upcomingSelectedTags);
    const filteredPastEvents = filterPastEvents(pastEvents, pastSearchQuery, pastSelectedTags);

    // Loading state
    if (isLoading) {
      return (
        <main className="px-4 sm:px-0 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </main>
      );
    }

    return <main className="px-4 sm:px-0">
      {/* Hero section - Main title and subtitle */}
      <div className="hero-section">
        <h2 className="hero-title text-3xl sm:text-4xl">Events</h2>
        <p className="hero-subtitle text-sm sm:text-base px-2 sm:px-15">
          See what is happening in our UTMIST community
        </p>
        <div className="w-full max-w-4xl mx-auto my-6 rounded-lg overflow-hidden shadow-lg aspect-[3/4] sm:aspect-[3/2]">
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=51eeb2795ecb293d64557f280d8114d38b73dffda4c188d63aa65d41f2a7286f%40group.calendar.google.com&ctz=America%2FToronto" 
            style={{ border: 0 }} 
            className="w-full h-full"
            frameBorder="0" 
            scrolling="no"
          />
        </div>
      </div>

      {/* Upcoming events section with search and filtering */}
      <div className="upcoming-events-container p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl mb-2 text-black tracking-[-3%]">Upcoming Events</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Explore what is happening on campus right now</p>
        
        {/* Search and filter controls */}
        <div className="space-y-4 mb-6">
          <SearchBar 
            value={upcomingSearchQuery}
            onChange={setUpcomingSearchQuery}
          />

          <TagFilter
            tags={upcomingTags}
            selectedTags={upcomingSelectedTags}
            onToggleTag={toggleUpcomingTag}
          />
        </div>
        
        {/* Event list section */}
        <div className="text-black">
          {filteredUpcomingEvents.length === 0 && (
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              {upcomingEvents.length === 0 ? "More events are in the works, stay tuned! 👀" : "No events found matching your search."}
            </p>
          )}

          {filteredUpcomingEvents.length > 0 && 
            <div className="events-list-container">
              {filteredUpcomingEvents.map(event => (
                <EventItem key={event.id} event={event} isPassed={false} />
              ))}
            </div>
          }
        </div>
      </div>

      {/* Featured events section - Fixed grid layout */}
      <section className="featured-section">
        <div className="featured-container">
          <h2 className="featured-title tracking-[-3%]">Featured</h2>
          <p className="featured-description">
            Canada&apos;s largest student-led organization for Artificial Intelligence and Machine Learning
          </p>
          <div className="featured-grid">
            {featuredEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                url={event.url}
                background={event.background}
                titleClassName={event.titleClassName}
                titleAlignment={event.titleAlignment}
                className={event.className}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Past events section */}
      <div className="upcoming-events-container p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl mb-2 text-black tracking-[-3%]">Past Events</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Browse our previous events and workshops</p>
        
        {/* Search and filter section */}
        <div className="space-y-4 mb-6">
          <SearchBar 
            value={pastSearchQuery}
            onChange={setPastSearchQuery}
          />

          <TagFilter
            tags={pastTags}
            selectedTags={pastSelectedTags}
            onToggleTag={togglePastTag}
          />
        </div>
        
        {/* Event list section */}
        <div className="text-black">
          {filteredPastEvents.length === 0 && (
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              No past events found matching your search.
            </p>
          )}

          {filteredPastEvents.length > 0 && 
            <div className="events-list-container">
              {filteredPastEvents.map(event => (
                <EventItem key={event.id} event={event} isPassed={true} />
              ))}
            </div>
          }
        </div>
      </div>
    </main>
}
