"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface StatItemProps {
    number: string;
    description: string;
}

function StatItem({ number, description }: StatItemProps) {
    const targetNumber = parseInt(number.replace(/\D/g, "")); // e.g., 100 from "100+"
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });
    
    useEffect(() => {
        if (!inView) return;

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * targetNumber);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, targetNumber]);

    return (
        <div className="stat-item" ref={ref}>
            <h2 className="stat-number">
                {count}
                {/\+$/.test(number) && "+"}
            </h2>
            <p className="stat-description">{description}</p>
        </div>
    );
}

export default function Statistics() {
    return (
        <main>
            <div className="stats-grid">
                <StatItem 
                    number="2700+" 
                    description="developers across all teams and departments"
                />
                <StatItem 
                    number="60+" 
                    description="AI/ML projects completed"
                />
                <StatItem 
                    number="50+" 
                    description="industry partners and collaborations"
                />
                <StatItem 
                    number="50+" 
                    description="academic workshops conducted"
                />
                <StatItem 
                    number="50+" 
                    description="articles and notebooks published"
                />
                <StatItem 
                    number="15+" 
                    description="papers published in top-tier conferences"
                />
            </div>
        </main>
    );
}