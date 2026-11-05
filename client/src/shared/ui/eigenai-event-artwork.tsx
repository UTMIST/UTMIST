import type { CSSProperties } from "react";

import lambdaHeroBack from "@/assets/eigenai-redesign/lambda-hero-back.svg";
import lambdaHeroFront from "@/assets/eigenai-redesign/lambda-hero-front.svg";
import { EigenAIConcentricRings } from "./eigenai-concentric-rings";
import { EigenAILambdaSymbol } from "./eigenai-lambda-symbol";
import { EigenAILockup } from "./eigenai-lockup";

/** Shared decorative Conference ’26 artwork; the containing card supplies its accessible title. */
export function EigenAIEventArtwork({ fontSize = "clamp(3.5rem, 9vw, 7.5rem)" }: { fontSize?: CSSProperties["fontSize"] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate overflow-hidden [container-type:inline-size]"
      style={{ background: "radial-gradient(circle at 12% 18%, rgba(94, 219, 231, 0.42), transparent 34%), radial-gradient(circle at 86% 78%, rgba(190, 102, 252, 0.38), transparent 40%), linear-gradient(145deg, #06003d 0%, #0c0249 52%, #241071 100%)" }}>
      <span className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_76%_18%,rgb(255_255_255/0.16),transparent_18%),linear-gradient(112deg,transparent_32%,rgb(94_219_231/0.1)_50%,transparent_68%)]" />
      <EigenAILambdaSymbol back={lambdaHeroBack} front={lambdaHeroFront} backOffset={4.172}
        className="absolute bottom-[-40%] left-[-10%] z-20 w-[min(34%,11rem)] max-md:bottom-[-28%] max-md:left-[4%] max-md:w-[min(30%,7rem)]" />
      <EigenAIConcentricRings
        className="absolute top-[-58%] right-[-18%] z-20 w-[min(72%,34rem)] max-md:top-[-65%] max-md:right-[-24%] max-md:w-[78%]"
        ringClassName="opacity-68 [filter:drop-shadow(0_0_6px_rgb(255_255_255/0.2))_drop-shadow(0_0_20px_rgb(89_224_233/0.2))_saturate(145%)]" />
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <EigenAILockup className="relative mx-auto" fontSize={fontSize} />
      </div>
    </div>
  );
}
