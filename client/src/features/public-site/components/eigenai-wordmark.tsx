import clsx from "clsx";
import type { CSSProperties } from "react";

const cursorMask =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 105.434 97.3234'%3E%3Cpath d='M13.2921 2.72363C8.55347 2.03757 5.12829 7.1428 7.55968 11.2676L45.9581 76.4072C48.9081 81.4118 56.577 79.3199 56.5773 73.5107V45.8037C56.5774 43.1579 58.0117 40.72 60.3243 39.4346L88.2286 23.9238C93.0014 21.2709 91.6787 14.0745 86.2745 13.292L13.2921 2.72363Z' fill='black'/%3E%3C/svg%3E\")";

export const eigenAIColorMesh = [
  "radial-gradient(circle at 91.27% 41.5%,#fff 0%,rgba(255,255,255,.96) 4%,transparent 17%)",
  "radial-gradient(circle at 50% 32.33%,#56e1e9 0%,rgba(86,225,233,.78) 9%,transparent 25%)",
  "radial-gradient(circle at 0% 33%,#fff 0%,rgba(255,255,255,.72) 13%,transparent 31%)",
  "radial-gradient(circle at 100% 33%,#be66fc 0%,rgba(190,102,252,.72) 13%,transparent 31%)",
  "radial-gradient(circle at 100% 0%,#8c00ff 0%,rgba(140,0,255,.82) 18%,transparent 44%)",
  "radial-gradient(circle at 67% 0%,#ad54fb 0%,rgba(173,84,251,.74) 17%,transparent 42%)",
  "radial-gradient(circle at 0% 67%,#606dea 0%,rgba(96,109,234,.7) 16%,transparent 38%)",
  "radial-gradient(circle at 33% 67%,#64deea 0%,rgba(100,222,234,.72) 15%,transparent 37%)",
  "radial-gradient(circle at 67% 67%,#ad54fb 0%,rgba(173,84,251,.66) 16%,transparent 39%)",
  "radial-gradient(circle at 100% 67%,#65e6eb 0%,rgba(101,230,235,.74) 18%,transparent 42%)",
  "radial-gradient(circle at 0% 100%,#05d6a1 0%,rgba(5,214,161,.8) 21%,transparent 48%)",
  "radial-gradient(circle at 33% 100%,#1ab3a6 0%,rgba(26,179,166,.82) 20%,transparent 47%)",
  "radial-gradient(circle at 67% 100%,#1a99b3 0%,rgba(26,153,179,.8) 20%,transparent 48%)",
  "radial-gradient(circle at 100% 100%,#128ab3 0%,rgba(18,138,179,.8) 20%,transparent 48%)",
  "linear-gradient(135deg,#5ce5ea 0%,#6e70ed 26%,#64deea 45%,#ad54fb 66%,#128ab3 100%)",
].join(",");

const layerBackgrounds = {
  base: eigenAIColorMesh,
  depth:
    "linear-gradient(180deg,transparent 0 38%,rgba(255,255,255,.96) 47%,rgba(255,255,255,.34) 54%,transparent 62%),linear-gradient(180deg,transparent 0 52%,rgba(100,222,234,.28) 63%,rgba(26,179,166,.7) 82%,rgba(18,138,178,.96) 100%)",
  shine:
    "linear-gradient(104deg,transparent 0%,transparent 24%,rgba(219,252,255,.08) 30%,rgba(255,255,255,.96) 39%,rgba(225,251,255,.68) 44%,rgba(214,192,255,.14) 52%,transparent 61%,transparent 100%)",
  glint:
    "radial-gradient(circle at 91.27% 41.5%,#fff 0%,rgba(255,255,255,.96) 1.2%,rgba(199,250,255,.5) 3.2%,transparent 9%),linear-gradient(180deg,rgba(92,229,234,.34) 0%,rgba(110,112,237,.1) 24%,transparent 43%)",
} as const;

type EigenAIWordmarkProps = {
  className?: string;
  cursorCutout?: boolean;
};

type WordmarkLayerProps = {
  backgroundImage: string;
  className: string;
  cursorCutout: boolean;
  hidden?: boolean;
};

function WordmarkLayer({
  backgroundImage,
  className,
  cursorCutout,
  hidden = true,
}: WordmarkLayerProps) {
  const maskStyles = cursorCutout
    ? ({
        "--cursor-mask": cursorMask,
        WebkitMaskImage: "var(--cursor-mask), linear-gradient(#000 0 0)",
        maskImage: "var(--cursor-mask), linear-gradient(#000 0 0)",
      } as CSSProperties)
    : undefined;

  return (
    <span
      aria-hidden={hidden || undefined}
      className={clsx(
        "col-start-1 row-start-1 block bg-clip-text py-[0.06em] pb-[0.18em] font-[inherit] leading-[inherit] tracking-[inherit] whitespace-pre text-transparent",
        cursorCutout &&
          "[-webkit-mask-position:calc(100%+0.48em)_1.023em,0_0] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:0.61em_auto,100%_100%] [-webkit-mask-composite:xor] [mask-position:calc(100%+0.48em)_1.023em,0_0] [mask-repeat:no-repeat] [mask-size:0.61em_auto,100%_100%] [mask-composite:exclude]",
        className,
      )}
      style={{ ...maskStyles, backgroundImage }}
    >
      eigenai
    </span>
  );
}

export function EigenAIWordmark({
  className,
  cursorCutout = false,
}: EigenAIWordmarkProps) {
  return (
    <span
      data-testid="eigenai-wordmark"
      className={clsx(
        "font-eigen-serif col-span-full inline-grid isolate text-[inherit] leading-normal tracking-[0]",
        className,
      )}
    >
      <WordmarkLayer
        backgroundImage={layerBackgrounds.base}
        className="relative z-1"
        cursorCutout={cursorCutout}
        hidden={false}
      />
      <WordmarkLayer
        backgroundImage={layerBackgrounds.depth}
        className="z-2 opacity-78"
        cursorCutout={cursorCutout}
      />
      <WordmarkLayer
        backgroundImage={layerBackgrounds.shine}
        className="z-3 bg-[length:170%_100%] bg-[position:47%_0] opacity-88 mix-blend-screen"
        cursorCutout={cursorCutout}
      />
      <WordmarkLayer
        backgroundImage={layerBackgrounds.glint}
        className="z-4 opacity-82 mix-blend-screen"
        cursorCutout={cursorCutout}
      />
    </span>
  );
}
