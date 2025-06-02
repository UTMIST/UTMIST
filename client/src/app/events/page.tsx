"use client";
import { useState } from 'react';
import "@/styles/events.css"  
import { EventItem } from "./events/event-item";

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    
    const events = [
        {
          id: 1,
          title: "SciML Workshop",
          location: "Bahen 1190",
          date: "May 12th, 2024",
          time: "17:00-19:00",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
          id: 2,
          title: "Paper Reading Workshop",
          location: "Bahen 1200",
          date: "May 12th, 2024",
          time: "17:00-19:00",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
    ];

    // Filter events based on search query (title, location, description)
    const filteredEvents = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return <main>
              <div className="hero-section">
          <h2 className="hero-title">Events</h2>
          <p className="hero-subtitle">
            See what is happening in our UTMIST community
          </p>
         </div>
    <div className="upcoming-events-container p-6 rounded-lg">
      <h2 className="text-3xl mb-2 text-black tracking-[-3%]">Upcoming Events</h2>
      <p className="text-gray-600 mb-6">Explore what is happening on campus right now</p>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-gray-700"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <div className="text-black space-y-2">
        {filteredEvents.length === 0 && (
          <p className="text-gray-600 mb-6">
            {events.length === 0 ? "More events are in the works, stay tuned! 👀" : "No events found matching your search."}
          </p>
        )}
          
        {filteredEvents.length > 0 && 
          <div className="space-y-2 border-2 border-gray-300 border-2 rounded-lg p-4">
            {filteredEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        }
      </div>
    </div>
    
    <section className="featured-section">
      <div className="featured-container">
        <h2 className="featured-title tracking-[-3%]">Featured</h2>
        <p className="featured-description">
        UTMIST Flagship Events - hackathons, conferences, workshops, showcases
        </p>
        
        <div className="featured-grid">
          <a href="/eigenai" className="featured-card featured-card-large" style={{
            background: 'linear-gradient(135deg, #e57fe5 0%, #8055e6 50%, #4099ee 100%)'
          }}>
            <h3 className="featured-card-title eigenai">EigenAI</h3>
          </a>

          <a href="https://genaigenesis.ca" className="featured-card" style={{
            background: 'linear-gradient(135deg, #9966ff 0%, #4040e5 100%)'
          }}> 
          <div className="featured-card-content">
              <h3 className="featured-card-title genai">GenAI</h3>
              <h3 className="featured-card-title">Gensis</h3>
            </div>
            </a>
          <a href="https://www.eventbrite.ca/e/ai2-reinforcement-learning-tournament-tickets-1141689918279" className="featured-card featured-card-large" style={{
            background: 'linear-gradient(135deg, #e57fe5 0%, #6655e6 100%)'
          }}>
            <h3 className="featured-card-title featured-card-title-right aisqr">AI^2</h3>
          </a>
       
          <a href="/eigenai" className="featured-card" style={{
            background: 'linear-gradient(135deg, #372a5b 0%, #8673a1 50%, #e5a2d3 100%)'
          }}>
              <h3 className="featured-card-title">Project Showcase</h3>
          </a>

        </div>
      </div>
    </section>
    </main>
  }