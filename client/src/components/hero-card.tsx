import "../styles/home.css";
import Image from "next/image";

interface HeroCardProps {
    image: string;
    title: string;
    description: string;
}

export default function HeroCard({ image, title, description }: HeroCardProps) {
    return (
        <div className="hero-card-container">
            <div className="hero-card-image">
                <Image 
                    src={image} 
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-2xl"
                />
            </div>
            <div className="hero-card-content">
                <h1 className="hero-card-title">{title}</h1>
                <p className="hero-card-description">{description}</p>
            </div>
        </div>
    );
}