import "../styles/home.css";

interface EventCardProps {
    title: string;
    description: string;
    onClick?: () => void;
}

export default function EventCard({ title, description, onClick }: EventCardProps) {
    return (
        <div className="event-card-container">
            <div className="event-card-content">
                <h2 className="event-card-title">{title}</h2>
                <p className="event-card-description">{description}</p>
            </div>
            <button 
                onClick={onClick} 
                className="event-card-button"
            >
                View More
            </button>
        </div>
    );
}