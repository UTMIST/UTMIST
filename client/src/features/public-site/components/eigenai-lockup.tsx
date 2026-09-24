import Image from "next/image";
import type { CSSProperties } from "react";

import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";

type EigenAILockupProps = {
  fontSize: CSSProperties["fontSize"];
  className?: string;
};

export function EigenAILockup({
  fontSize,
  className = "",
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
      <div className="eigenai-wordmark eigenai-serif">
        <span className="eigenai-wordmark__base">eigenai</span>
        <span aria-hidden="true" className="eigenai-wordmark__depth">
          eigenai
        </span>
        <span aria-hidden="true" className="eigenai-wordmark__shine">
          eigenai
        </span>
        <span aria-hidden="true" className="eigenai-wordmark__glint">
          eigenai
        </span>
      </div>
      <p className="eigenai-lockup-subtitle eigenai-sans">CONFERENCE ’26</p>
    </div>
  );
}
