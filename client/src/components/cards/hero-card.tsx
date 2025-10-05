import Image from "next/image";
import { HeroCardProps } from "@/app/types/home";


export default function HeroCard({ image, title, description }: HeroCardProps) {
    return (
        <div className="flex flex-col p-8 md:p-4 max-w-[1200px] mx-auto">
            <div className="relative w-full h-60 rounded-2xl overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-2xl"
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-5xl md:text-3xl font-bold bg-clip-text [-webkit-text-fill-color:transparent] font-[var(--font-space-grotesk)] tracking-[-0.03em]">{title}</h1>
                <p className="text-lg leading-7 text-gray-600 font-[var(--system-font)] max-w-[65ch] md:text-base">{description}</p>
            </div>
        </div>
    );
}