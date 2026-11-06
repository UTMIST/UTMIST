import Image from "next/image";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";

import { Badge, CardLink, EigenAIEventArtwork } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { HomeEvent } from "@/features/public-site/data/home-events";

/** The whole card is one link; its artwork is selected by content, never list position. */
export default function HomeEventCard({ event }: { event: HomeEvent }) {
  const { artwork } = event;

  return (
    <CardLink
      data-home-reveal
      href={event.url}
      variant="flat"
      className="group flex flex-col overflow-hidden"
    >
      <div className="relative flex aspect-[1.9] shrink-0 items-center justify-center overflow-hidden bg-[var(--home-ink)]">
        {artwork.kind === "eigenai" ? (
          <EigenAIEventArtwork fontSize="clamp(2rem, 16cqw, 5.5rem)" />
        ) : artwork.fit === "cover" ? (
          <Image src={artwork.src} alt={artwork.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className={cn("object-cover", artwork.position === "top" && "object-top")} />
        ) : (
          <Image src={artwork.src} alt={artwork.alt} width={640} height={400} sizes="(min-width: 768px) 30vw, 70vw" className="h-4/5 w-4/5 object-contain" />
        )}
        <span className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/90 text-secondary">
          <ArrowUpRight size={20} aria-hidden="true" />
        </span>
        <Badge className="absolute bottom-4 left-4">{event.category}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="home-card-heading group-hover:text-secondary group-focus-visible:text-secondary">{event.title}</h3>
        <p className="home-body mb-6 mt-3">{event.description}</p>
        <div className="home-meta mt-auto flex items-center gap-2 border-t border-border pt-4">
          <CalendarDays size={16} aria-hidden="true" />
          Explore {event.title}
          <ArrowRight size={16} className="ml-auto" aria-hidden="true" />
        </div>
      </div>
    </CardLink>
  );
}
