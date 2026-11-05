"use client";

import { useEffect, useId, useReducer, useRef, type CSSProperties } from "react";
import { inView } from "framer-motion";
import { BookMarked, BrainCircuit, Cog, Globe2, MapPinned, Network, Puzzle } from "lucide-react";

import { Button } from "@/shared/ui";
import { homeMotion } from "@/features/public-site/lib/home-motion";

const disciplines = [
  { id: "math", label: "Math", icon: BrainCircuit, x: 10, y: 12 },
  { id: "computer-science", label: "Computer Science", icon: BrainCircuit, x: 42, y: 12 },
  { id: "statistics", label: "Statistics", icon: MapPinned, x: 82, y: 12 },
  { id: "neuroscience", label: "Neuroscience", icon: BrainCircuit, x: 25, y: 37 },
  { id: "industrial-engineering", label: "Industrial Engineering", icon: BrainCircuit, x: 57, y: 37 },
  { id: "data-science", label: "Data Science", icon: Network, x: 88, y: 37 },
  { id: "physics", label: "Physics", icon: Puzzle, x: 9, y: 62 },
  { id: "engineering-sciences", label: "Engineering Sciences", icon: Cog, x: 37, y: 62 },
  { id: "mechanical-engineering", label: "Mechanical Engineering", icon: Globe2, x: 79, y: 62 },
  { id: "business", label: "Business", icon: BrainCircuit, x: 22, y: 87 },
  { id: "software-engineering", label: "Software Engineering", icon: Cog, x: 55, y: 87 },
  { id: "philosophy", label: "Philosophy", icon: BookMarked, x: 89, y: 87 },
] as const;

type DisciplineId = typeof disciplines[number]["id"];
const connections: ReadonlyArray<readonly [DisciplineId, DisciplineId]> = [
  ["math", "computer-science"],
  ["computer-science", "statistics"],
  ["computer-science", "neuroscience"],
  ["computer-science", "industrial-engineering"],
  ["statistics", "data-science"],
  ["neuroscience", "physics"],
  ["neuroscience", "engineering-sciences"],
  ["physics", "business"],
  ["industrial-engineering", "mechanical-engineering"],
  ["engineering-sciences", "software-engineering"],
  ["mechanical-engineering", "philosophy"],
  ["software-engineering", "philosophy"],
];

const positions = new Map(disciplines.map((discipline, index) => [discipline.id, {
  desktop: { x: discipline.x, y: discipline.y },
  mobile: { x: index % 2 === 0 ? 25 : 75, y: (Math.floor(index / 2) + 0.5) * 100 / 6 },
}]));

function connectionPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  if (from.y === to.y) return `M ${from.x} ${from.y} H ${to.x}`;
  if (from.x === to.x) return `M ${from.x} ${from.y} V ${to.y}`;
  const middle = (from.x + to.x) / 2;
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  const radius = Math.min(5, Math.abs(to.x - from.x) / 4, Math.abs(to.y - from.y) / 4);
  return `M ${from.x} ${from.y} H ${middle - dx * radius} Q ${middle} ${from.y} ${middle} ${from.y + dy * radius} V ${to.y - dy * radius} Q ${middle} ${to.y} ${middle + dx * radius} ${to.y} H ${to.x}`;
}

const paths = connections.map(([from, to]) => ({
  from,
  to,
  desktop: connectionPath(positions.get(from)!.desktop, positions.get(to)!.desktop),
  mobile: connectionPath(positions.get(from)!.mobile, positions.get(to)!.mobile),
}));

// A wave follows graph distance, including branches and cycles, from any pill.
// Precompute once; CSS handles the stagger without timers or per-frame renders.
const waveStepMs = homeMotion.waveStepMs;
const waves = new Map(disciplines.map(({ id }) => {
  const distances = new Map<DisciplineId, number>([[id, 0]]);
  const queue: DisciplineId[] = [id];
  for (const current of queue) {
    for (const [from, to] of connections) {
      const neighbor = from === current ? to : to === current ? from : null;
      if (neighbor && !distances.has(neighbor)) {
        distances.set(neighbor, distances.get(current)! + 1);
        queue.push(neighbor);
      }
    }
  }
  return [id, {
    distances,
    paths: connections.map(([a, b]) => {
      const [from, to] = distances.get(a)! <= distances.get(b)! ? [a, b] : [b, a];
      return {
        from, to,
        delay: distances.get(from)! * waveStepMs,
        desktop: connectionPath(positions.get(from)!.desktop, positions.get(to)!.desktop),
        mobile: connectionPath(positions.get(from)!.mobile, positions.get(to)!.mobile),
      };
    }),
  }];
}));

type NetworkState = {
  intro: boolean;
  selected: DisciplineId | null;
  hovered: DisciplineId | null;
  focused: DisciplineId | null;
  waveOrigin: DisciplineId | null;
  waveSequence: number;
};
type NetworkAction =
  | { type: "hover" | "focus"; id: DisciplineId | null }
  | { type: "select"; id: DisciplineId }
  | { type: "clear" | "intro" | "intro-end" };

const initialState: NetworkState = { intro: false, selected: null, hovered: null, focused: null, waveOrigin: null, waveSequence: 0 };

function networkReducer(state: NetworkState, action: NetworkAction): NetworkState {
  if (action.type === "intro") {
    // An entrance wave must never replace a user's preview or pinned selection.
    return state.waveOrigin ? state : { ...state, intro: true, waveOrigin: "math", waveSequence: state.waveSequence + 1 };
  }
  if (action.type === "intro-end") return { ...state, intro: false };
  const next = { ...state, intro: false };
  if (action.type === "hover") next.hovered = action.id;
  if (action.type === "focus") next.focused = action.id;
  if (action.type === "select" || action.type === "clear") {
    next.selected = action.type === "select" && state.selected !== action.id ? action.id : null;
    next.hovered = null;
    next.focused = null;
  }
  const active = next.hovered ?? next.focused ?? next.selected;
  if (active && active !== (state.hovered ?? state.focused ?? state.selected)) {
    next.waveOrigin = active;
    next.waveSequence += 1;
  }
  // Keep the last wave mounted while CSS fades it away. A new activation
  // replaces only its decoration, preserving button focus and selection.
  return next;
}

export default function HomeDisciplineNetwork() {
  const instructionsId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [{ intro, selected, hovered, focused, waveOrigin, waveSequence }, dispatch] = useReducer(networkReducer, initialState);
  const active = hovered ?? focused ?? selected;
  const wave = waveOrigin ? waves.get(waveOrigin) : null;

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = inView(element, () => {
      dispatch({ type: "intro" });
      const lastHop = Math.max(...waves.get("math")!.distances.values());
      timer = setTimeout(() => dispatch({ type: "intro-end" }), lastHop * waveStepMs + homeMotion.waveSpreadMs);
    }, { margin: homeMotion.viewportMargin });
    const reduce = () => {
      if (!preference.matches) return;
      stop();
      clearTimeout(timer);
      dispatch({ type: "intro-end" });
    };
    preference.addEventListener("change", reduce);
    return () => { stop(); clearTimeout(timer); preference.removeEventListener("change", reduce); };
  }, []);

  return (
    <div ref={root} className="home-discipline-network min-w-0" role="group" aria-label="Explore our community’s disciplines" aria-describedby={instructionsId} data-wave-active={Boolean(active) || intro} data-wave-intro={intro}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          dispatch({ type: "clear" });
        }
      }}>
      <p id={instructionsId} className="sr-only">Select a discipline to send a highlight through the network. Select it again or press Escape to clear the selection.</p>
      <div className="home-discipline-canvas" data-figma-node="25:1782">
        {(["desktop", "mobile"] as const).map((layout) => (
          <svg key={layout} className={`home-discipline-lines home-discipline-lines-${layout}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {paths.map((path) => (
              <path key={`${path.from}-${path.to}`} d={path[layout]} vectorEffect="non-scaling-stroke" />
            ))}
            {wave ? (
              <g className="home-discipline-wave">
                <g key={waveSequence}>
                  {wave.paths.map((path) => (
                    <path key={`${path.from}-${path.to}`} className="home-discipline-wave-line" d={path[layout]}
                      pathLength={1} style={{ "--wave-delay": `${path.delay}ms` } as CSSProperties} />
                  ))}
                </g>
              </g>
            ) : null}
          </svg>
        ))}
        {disciplines.map(({ id, label, icon: Icon, x, y }, index) => {
          const distance = wave?.distances.get(id);
          const position = {
            "--discipline-x": `${x}%`,
            "--discipline-y": `${y}%`,
            "--discipline-mobile-x": `${index % 2 === 0 ? 25 : 75}%`,
            "--discipline-mobile-y": `${(Math.floor(index / 2) + 0.5) * 100 / 6}%`,
          } as CSSProperties;
          return (
            <Button key={id} type="button" variant="outline" size="sm" style={position}
              className="home-discipline-button m-0 h-auto min-h-12 gap-2 rounded-full border-[1.5px] border-transparent px-4 py-3 text-xs font-normal text-white hover:scale-100 hover:border-transparent"
              aria-pressed={selected === id} data-active={active === id}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") dispatch({ type: "hover", id }); }}
              onPointerLeave={() => dispatch({ type: "hover", id: null })}
              onFocus={() => dispatch({ type: "focus", id })}
              onBlur={() => dispatch({ type: "focus", id: null })}
              onClick={() => dispatch({ type: "select", id })}>
              {distance !== undefined ? (
                <span className="home-discipline-wave home-discipline-wave-node" aria-hidden="true">
                  <span key={waveSequence} className="home-discipline-wave-glow"
                    style={{ "--wave-delay": `${distance * waveStepMs}ms` } as CSSProperties} />
                </span>
              ) : null}
              <Icon aria-hidden="true" strokeWidth={1.2} />
              <span>{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
