/**
 * Interface for a featured event card
 * @property {string} title - Event title, can include '\n' for line breaks
 * @property {string} url - URL the card links to
 * @property {string} background - CSS background value (usually a gradient)
 * @property {string} [titleClassName] - Optional class for custom title styling
 * @property {string} [titleAlignment] - Optional alignment for title ('left' or 'right')
 * @property {string} [className] - Optional additional classes for the card
 * @property {'eigenai'} [branding] - Optional event-specific visual identity
 */
import lambdaHeroBack from "@/assets/eigenai-redesign/lambda-hero-back.svg";
import lambdaHeroFront from "@/assets/eigenai-redesign/lambda-hero-front.svg";
import {
  EigenAIConcentricRings,
  EigenAILambdaSymbol,
  EigenAILockup,
} from "@/shared/ui";

interface FeaturedEvent {
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titleAlignment?: "left" | "right";
  className?: string;
  branding?: "eigenai";
}

export type { FeaturedEvent };

/**
 * A card component for featured events that displays with a gradient background and custom styling
 * Supports multi-line titles and custom positioning
 *
 * @component
 * @param {FeaturedEvent} props - The props for the featured event card
 * @returns {JSX.Element} A styled card component with title and background
 */
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_76%_18%,rgb(255_255_255/0.16),transparent_18%),linear-gradient(112deg,transparent_32%,rgb(94_219_231/0.1)_50%,transparent_68%)]"
          />
          <EigenAILambdaSymbol
            back={lambdaHeroBack}
            front={lambdaHeroFront}
            backOffset={4.172}
            className="pointer-events-none absolute bottom-[-40%] left-[-10%] z-20 w-[min(34%,11rem)] max-md:bottom-[-28%] max-md:left-[4%] max-md:w-[min(30%,7rem)]"
          />
          <EigenAIConcentricRings
            className="pointer-events-none absolute top-[-58%] right-[-18%] z-20 w-[min(72%,34rem)] max-md:top-[-65%] max-md:right-[-24%] max-md:w-[78%]"
            ringClassName="opacity-68 [filter:drop-shadow(0_0_6px_rgb(255_255_255/0.2))_drop-shadow(0_0_20px_rgb(89_224_233/0.2))_saturate(145%)]"
          />
        </>
      ) : null}
      <div
        className={
          isEigenAI
            ? "absolute inset-0 z-30 flex size-full items-center justify-center"
            : "featured-card-content"
        }
      >
        {isEigenAI ? (
          <>
            <span className="sr-only">{title}</span>
            <EigenAILockup
              className="relative z-40 mx-auto"
              fontSize="clamp(3.5rem, 9vw, 7.5rem)"
            />
          </>
        ) : (
          title.split("\n").map((part, i) => (
            <h3
              key={i}
              className={`featured-card-title ${titleClassName} ${alignmentClass}`}
            >
              {part}
            </h3>
          ))
        )}
      </div>
    </a>
  );
}
