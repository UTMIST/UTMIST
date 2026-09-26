import Image from "next/image";

import ellipseRingInner from "@/assets/eigenai-redesign/ellipse-ring-inner.svg";
import ellipseRingMiddle from "@/assets/eigenai-redesign/ellipse-ring-middle.svg";
import ellipseRingOuter from "@/assets/eigenai-redesign/ellipse-ring-outer.svg";

const concentricRings = [
  { id: "outer", src: ellipseRingOuter, width: 951.318 },
  { id: "inner", src: ellipseRingInner, width: 731.172 },
  { id: "middle", src: ellipseRingMiddle, width: 532.68 },
];

export function EigenAIConcentricRings({
  className = "",
  ringClassName = "opacity-42 [filter:drop-shadow(0_0_5px_rgb(255_255_255/0.12))_drop-shadow(0_0_18px_rgb(89_224_233/0.12))_saturate(132%)]",
}: {
  className?: string;
  ringClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={`relative aspect-square ${className}`}>
      {concentricRings.map((ring, index) => (
        <Image
          key={ring.id}
          src={ring.src}
          alt=""
          data-ring-index={index}
          className={`absolute top-1/2 left-1/2 h-auto max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen ${ringClassName}`}
          style={{ width: `${(ring.width / 951.318) * 100}%` }}
        />
      ))}
    </div>
  );
}
