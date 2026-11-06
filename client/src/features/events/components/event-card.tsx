import { EigenAIEventArtwork } from "@/shared/ui";

interface FeaturedEvent {
  /** Newlines split unbranded titles into separate display lines. */
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titleAlignment?: "left" | "right";
  className?: string;
  branding?: "eigenai";
}

export type { FeaturedEvent };

/** A single event link with either multiline text or shared EigenAI artwork. */
export function EventCard({
  title,
  url,
  background,
  titleClassName = "",
  titleAlignment = "left",
  className = "",
  branding,
}: FeaturedEvent) {
  const alignmentClass =
    titleAlignment === "right" ? "title-align-right" : "title-align-left";
  const isEigenAI = branding === "eigenai";

  return (
    <a
      href={url}
      className={`featured-card ${className}`}
      style={{ background }}
    >
      {isEigenAI ? (
        <>
          <EigenAIEventArtwork />
          <span className="sr-only">{title}</span>
        </>
      ) : (
        <div className="featured-card-content">
          {title.split("\n").map((part, i) => (
            <h3
              key={i}
              className={`featured-card-title ${titleClassName} ${alignmentClass}`}
            >
              {part}
            </h3>
          ))}
        </div>
      )}
    </a>
  );
}
