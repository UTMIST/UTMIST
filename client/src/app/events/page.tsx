import "@/styles/events.css"  

export default function EventsPage() {
    const events = [
        {
          id: 1,
          title: "SciML Workshop",
          location: "Bahen 1190",
          time: "May 12th 17:00-19:00"
        },
        {
          id: 2,
          title: "Paper Reading Workshop",
          location: "Bahen 1200",
          time: "May 12th 17:00-19:00"
        }
      ];
    return <main>
              <div className="hero-section">
          <h2 className="hero-title">Events</h2>
          <p className="hero-subtitle">
            See what is happening in our UTMIST community
          </p>
         </div>
    <div className="p-6 rounded-lg px-56">
      <h2 className="text-3xl mb-2 text-black tracking-[-3%]">Upcoming Events</h2>
      <p className="text-gray-600 mb-6">Explore what is happening on campus right now</p>
      
      <div className="space-y-2">
        {events.map(event => (
          <div key={event.id} className="bg-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg 
                className="w-5 h-5 text-gray-700" 
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
            
            <div className="flex items-center">
              <span className="text-gray-700">{event.location}</span>
              <span className="mx-2 text-gray-700">•</span>
              <span className="text-gray-700">{event.time}</span>
              <button className="rsvp-button ml-4">
                RSVP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <section className="featured-section">
      <div className="featured-container">
        <h2 className="featured-title tracking-[-3%]">Featured</h2>
        <p className="featured-description">
        UTMIST Flagship Events - hackathons, conferences, workshops, showcases
        </p>
        
        <div className="featured-grid">
          <div className="featured-card featured-card-large" style={{
            background: 'linear-gradient(135deg, #e57fe5 0%, #8055e6 50%, #4099ee 100%)'
          }}>
            <h3 className="featured-card-title eigenai">EigenAI</h3>
          </div>
          
          <div className="featured-card" style={{
            background: 'linear-gradient(135deg, #9966ff 0%, #4040e5 100%)'
          }}>
            <div className="featured-card-content">
              <h3 className="featured-card-title genai">GenAI</h3>
              <h3 className="featured-card-title">Gensis</h3>
            </div>
          </div>
          
          <div className="featured-card featured-card-large" style={{
            background: 'linear-gradient(135deg, #e57fe5 0%, #6655e6 100%)'
          }}>
            <h3 className="featured-card-title featured-card-title-right aisqr">AI^2</h3>
          </div>
          
          <div className="featured-card" style={{
            background: 'linear-gradient(135deg, #372a5b 0%, #8673a1 50%, #e5a2d3 100%)'
          }}>
              <h3 className="featured-card-title">Project Showcase</h3>
              </div>
        </div>
      </div>
    </section>
    </main>
  }