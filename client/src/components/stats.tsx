import { StatItemProps } from "@/app/types/home";

function StatItem({ number, description }: StatItemProps) {
    return (
        <div className="stat-item">
            <h2 className="stat-number">{number}</h2>
            <p className="stat-description">{description}</p>
        </div>
    );
}

export default function Statistics() {
    return (
        <main>
            <div className="stats-grid">
                <StatItem 
                    number="100+" 
                    description="developers across all teams and departments"
                />
                <StatItem 
                    number="2000+" 
                    description="AI/ML projects completed"
                />
                <StatItem 
                    number="20+" 
                    description="industry partners and collaborations"
                />
                <StatItem 
                    number="20+" 
                    description="academic workshops conducted"
                />
                <StatItem 
                    number="100+" 
                    description="articles and notebooks published"
                />
                <StatItem 
                    number="100+" 
                    description="papers published in top-tier conferences"
                />
            </div>
        </main>
    );
}