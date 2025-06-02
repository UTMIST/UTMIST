"use client";
import { useState } from 'react';
import "@/styles/events.css"  
import { EventItem } from "./components/event-item";
import { SearchBar } from "./components/search-bar";
import { TagFilter } from "./components/tag-filter";
import { EventCard, type FeaturedEvent } from './components/event-card';

// Sample featured events data

const featuredEvents: FeaturedEvent[] = [
  {
    title: "EigenAI",
    url: "/eigenai",
    background: 'linear-gradient(135deg, #e57fe5 0%, #8055e6 50%, #4099ee 100%)',
    titleClassName: 'title-large',
    titleAlignment: 'left',
    className: 'featured-card-large'
  },
  {
    title: "GenAI\nGenesis",
    url: "https://genaigenesis.ca",
    background: 'linear-gradient(135deg, #9966ff 0%, #4040e5 100%)',
    titleClassName: 'title-medium',
    titleAlignment: 'right'
  },
  {
    title: "AI^2",
    url: "https://www.eventbrite.ca/e/ai2-reinforcement-learning-tournament-tickets-1141689918279",
    background: 'linear-gradient(135deg, #e57fe5 0%, #6655e6 100%)',
    titleClassName: 'title-large',
    titleAlignment: 'right',
    className: 'featured-card-large'
  },
  {
    title: "Project\nShowcase",
    url: "/showcase",
    background: 'linear-gradient(135deg, #372a5b 0%, #8673a1 50%, #e5a2d3 100%)',
    titleClassName: 'title-small',
    titleAlignment: 'left'
  }
];

// Sample upcoming events data
const upcomingEvents = [
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

// Sample past events data
const pastEvents = [
  {
    id: 3,
    title: "Introduction to Neural Networks",
    location: "Online",
    date: "March 15th, 2024",
    time: "18:00-20:00",
    description: "A beginner-friendly workshop covering the fundamentals of neural networks, including perceptrons, activation functions, and backpropagation.",
    tags: ["Workshop", "Deep Learning", "Beginner-Friendly"],
    isPast: true
  },
  {
    id: 4,
    title: "Computer Vision Hackathon",
    location: "Myhal Centre",
    date: "February 24th, 2024",
    time: "09:00-21:00",
    description: "A day-long hackathon focused on computer vision applications, featuring mentorship from industry experts and exciting prizes.",
    tags: ["Hackathon", "Computer Vision", "Competition"],
    isPast: true
  },
  {
    id: 5,
    title: "Computer Vision Hackathon",
    location: "Myhal Centre",
    date: "February 24th, 2024",
    time: "09:00-21:00",
    description: "A day-long hackathon focused on computer vision applications, featuring mentorship from industry experts and exciting prizes.",
    tags: ["Hackathon", "Computer Vision", "Competition"],
    isPast: true
  },
  {
    id: 6,
    title: "Computer Vision Hackathon",
    location: "Myhal Centre",
    date: "February 24th, 2024",
    time: "09:00-21:00",
    description: "A day-long hackathon focused on computer vision applications, featuring mentorship from industry experts and exciting prizes.",
    tags: ["Hackathon", "Computer Vision", "Competition"],
    isPast: true
  },
  {
    id: 7,
    title: "Computer Vision Hackathon",
    location: "Myhal Centre",
    date: "February 24th, 2024",
    time: "09:00-21:00",
    description: "A day-long hackathon focused on computer vision applications, featuring mentorship from industry experts and exciting prizes.",
    tags: ["Hackathon", "Computer Vision", "Competition"],
    isPast: true
  },
  {
    id: 8,
    title: "Computer Vision Hackathon",
    location: "Myhal Centre",
    date: "February 24th, 2024",
    time: "09:00-21:00",
    description: "A day-long hackathon focused on computer vision applications, featuring mentorship from industry experts and exciting prizes.",
    tags: ["Hackathon", "Computer Vision", "Competition"],
    isPast: true
  }
];

// Define event type
interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  tags: string[];
}

/**
 * Main Events page component
 * Displays upcoming events with search/filter functionality and featured events
 * 
 * @returns {JSX.Element} The complete events page
 */
export default function EventsPage() {
    // State for upcoming events search and filtering
    const [upcomingSearchQuery, setUpcomingSearchQuery] = useState('');
    const [upcomingSelectedTags, setUpcomingSelectedTags] = useState<string[]>([]);
    
    // State for past events search and filtering
    const [pastSearchQuery, setPastSearchQuery] = useState('');
    const [pastSelectedTags, setPastSelectedTags] = useState<string[]>([]);

    // Get all unique tags for both sections
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

    const togglePastTag = (tag: string) => {
      setPastSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    };

    // Filter functions for both sections
    const filterEvents = (events: Event[], searchQuery: string, selectedTags: string[]) => {
      return events.filter((event: Event) => {
        const matchesSearch = 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = 
          selectedTags.length === 0 || 
          selectedTags.every((tag: string) => event.tags.includes(tag));

        return matchesSearch && matchesTags;
      });
    };

    const filteredUpcomingEvents = filterEvents(upcomingEvents, upcomingSearchQuery, upcomingSelectedTags);
    const filteredPastEvents = filterEvents(pastEvents, pastSearchQuery, pastSelectedTags);

    return <main className="px-4 sm:px-0">
    {/* Hero section - Main title and subtitle */}
    <div className="hero-section">
      <h2 className="hero-title text-3xl sm:text-4xl">Events</h2>
      <p className="hero-subtitle text-sm sm:text-base px-2 sm:px-15">
        See what is happening in our UTMIST community
      </p>
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
          Canada's largest student-lead organization for Artificial Intelligence and Machine Learning
        </p>
        {/**
          * Configuration for the featured events section
          * Layout is based on a 5x4 grid where:
          * - Feature 1: spans 3x2 (columns x rows)
          * - Feature 2: spans 2x3
          * - Feature 3: spans 3x2
          * - Feature 4: spans 2x1
        */}
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
      <p className="text-gray-600 mb-6 text-sm sm:text-base">Browse our previous events and achievements</p>
      
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
              <EventItem key={event.id} event={event} isPassed={true}/>
            ))}
          </div>
        }
      </div>
    </div>
    </main>
}