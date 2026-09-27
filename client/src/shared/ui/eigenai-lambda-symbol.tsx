import Image, { type StaticImageData } from "next/image";

export function EigenAILambdaSymbol({
  back,
  front,
  backOffset,
  className = "",
}: {
  back: StaticImageData;
  front: StaticImageData;
  backOffset: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative [container-type:inline-size] ${className}`}
    >
      <Image
        src={back}
        alt=""
        className="relative h-auto w-full blur-[0.9693cqw]"
        style={{
          left: "-0.046%",
          transform: `translateY(${(backOffset / back.height) * 100}%)`,
        }}
      />
      <Image
        src={front}
        alt=""
        className="absolute top-0 left-0 h-auto w-full blur-[4.0711cqw]"
      />
    </div>
  );
}
