"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Statistic } from "@/shared/lib";

export interface StatItemProps {
    number: string;
    description: string;
    className?: string;
    numberClassName?: string;
    descriptionClassName?: string;
}

export function StatItem({
    number,
    description,
    className = "stat-item",
    numberClassName = "stat-number",
    descriptionClassName = "stat-description",
}: StatItemProps) {
    const targetNumber = parseInt(number.replace(/\D/g, "")); // e.g., 100 from "100+"
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });
    
    useEffect(() => {
        if (!inView) return;

        const duration = 1500;
        const startTime = performance.now();

        let frame: number;
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * targetNumber);
            setCount(currentCount);

            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [inView, targetNumber]);

    return (
        <div className={className} ref={ref}>
            <p className={numberClassName}>
                {count}
                {/\+$/.test(number) && "+"}
            </p>
            <p className={descriptionClassName}>{description}</p>
        </div>
    );
}

export default function Statistics({ items }: { items: readonly Statistic[] }) {
    return (
        <div>
            <div className="stats-grid">
                {items.map((item, index) => <StatItem key={index} {...item} />)}
            </div>
        </div>
    );
}
