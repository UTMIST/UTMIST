import Image from "next/image";
import type { CSSProperties } from "react";

import cursorSymbol from "@/assets/eigenai-redesign/ornament-cluster.svg";
import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";
import { EigenAIWordmark } from "@/features/public-site/components/eigenai-wordmark";

type EigenAILockupProps = {
  fontSize: CSSProperties["fontSize"];
  className?: string;
  showCursor?: boolean;
};

export function EigenAILockup({
  fontSize,
  className = "",
  showCursor = false,
}: EigenAILockupProps) {
  return (
    <div
      data-testid="eigenai-lockup"
      className={`eigenai-lockup ${className}`}
      style={{ fontSize }}
    >
      <Image
        src={utmistWordmark}
        alt="UTMIST"
        className="eigenai-lockup__utmist"
      />
      <EigenAIWordmark
        className={showCursor ? "eigenai-wordmark--cursor-cutout" : ""}
      />
      {showCursor ? (
        <Image
          src={cursorSymbol}
          alt=""
          data-testid="eigenai-lockup-cursor"
          className="eigenai-lockup__cursor"
        />
      ) : null}
      <p className="eigenai-lockup-subtitle eigenai-body eigenai-instrument-gradient">
        CONFERENCE ’26
      </p>
    </div>
  );
}
