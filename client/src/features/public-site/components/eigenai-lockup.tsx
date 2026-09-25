import Image from "next/image";
import type { CSSProperties } from "react";

import cursorSymbol from "@/assets/eigenai-redesign/ornament-cluster.svg";
import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";
import {
  eigenAIColorMesh,
  EigenAIWordmark,
} from "@/features/public-site/components/eigenai-wordmark";

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
      className={`relative inline-grid w-max max-w-full grid-cols-[30.3%_69.7%] text-center leading-none ${className}`}
      style={{ fontSize }}
    >
      <Image
        src={utmistWordmark}
        alt="UTMIST"
        className="col-span-full mb-[-0.8em] ml-[0.55em] h-auto w-[1.4em] justify-self-center"
      />
      <EigenAIWordmark cursorCutout={showCursor} />
      {showCursor ? (
        <Image
          src={cursorSymbol}
          alt=""
          data-testid="eigenai-lockup-cursor"
          className="pointer-events-none absolute top-[1.022em] right-[-0.48em] z-20 h-auto w-[0.61em]"
        />
      ) : null}
      <p
        className="font-eigen-body col-start-2 mt-[-3em] w-full bg-clip-text text-right text-[0.153em] leading-none font-normal tracking-[0.22em] whitespace-nowrap text-transparent [text-shadow:0_0.036em_0.036em_#fff,0_0_0.65em_rgb(94_219_231/0.28)]"
        style={{ backgroundImage: eigenAIColorMesh }}
      >
        CONFERENCE ’26
      </p>
    </div>
  );
}
