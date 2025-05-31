import "../../styles/sponsors.css";

interface SponsorCardProps {
    category: string;
    price: string;
    perks: string[];
}

export default function SponsorCard({
    category,
    price,
    perks,
  }: SponsorCardProps) {
    const modifier = category.toLowerCase(); // "bronze", "silver", ...
    return (
      <div className={`sponsor-card sponsor-card--${modifier}`}>
        <header className="sponsor-card__header">
          <h3 className={`sponsor-card__title sponsor-card__title--${modifier}`}>
            {category}
          </h3>
          <p className="sponsor-card__price">${price}</p>
        </header>
        <ul className="sponsor-card__perks">
          {perks.map((perk) => (
            <li key={perk} className="sponsor-card__perk">
              <span className="sponsor-card__star">★</span> {perk}
            </li>
          ))}
        </ul>
      </div>
    );
  }