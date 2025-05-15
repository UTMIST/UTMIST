
import "../../styles/home.css";
import { EventCardProps } from "@/app/types/home";

export default function EventCard({ title, description, url }: EventCardProps) {
    return (
        <div className="event-card-container">
            <div className="event-card-content">
                <h2 className="event-card-title">{title}</h2>
                <a 
                href={url}
                className="event-card-button"
                target="_blank"
                rel="noopener noreferrer"
            >
                View More
            </a>
            </div>
            <p className="event-card-description">{description}</p>


        </div>
    );
}