import { createEvent, fireEvent } from "@testing-library/react";
import { inView, scroll } from "framer-motion";

import { createHomeScrollEffects } from "@/features/public-site/lib/home-scroll-effects";

jest.mock("framer-motion", () => ({ inView: jest.fn(), scroll: jest.fn() }));

const stopReveal = jest.fn();
const stopHighlight = jest.fn();
let enter: (element: Element) => void;
const highlights = new Map<Element, (progress: number) => void>();
let preferenceChanged: () => void;
let preference: { matches: boolean; addEventListener: jest.Mock; removeEventListener: jest.Mock };
let root: HTMLElement;
let above: HTMLElement;
let below: HTMLElement;

beforeEach(() => {
  jest.clearAllMocks();
  highlights.clear();
  Object.defineProperty(window, "IntersectionObserver", { configurable: true, value: jest.fn() });
  preference = {
    matches: false,
    addEventListener: jest.fn((_event, listener) => { preferenceChanged = listener; }),
    removeEventListener: jest.fn(),
  };
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => preference });
  jest.mocked(inView).mockImplementation((_elements, callback) => {
    enter = (element) => { callback(element, {} as IntersectionObserverEntry); };
    return stopReveal;
  });
  jest.mocked(scroll).mockImplementation((callback, options) => {
    highlights.set(options!.target!, callback as (progress: number) => void);
    return stopHighlight;
  });
  root = document.createElement("main");
  root.innerHTML = '<section class="home-hero"><p><span class="home-hero-highlight">Hero highlight</span></p></section><div data-home-reveal id="above">Visible content</div><div data-home-reveal id="below"><a href="/events">Events</a></div><h2>Heading <span class="home-selection">highlight</span></h2><div class="home-community-statement"><p><span class="home-selection">Statement highlight</span></p></div>';
  document.body.append(root);
  above = root.querySelector<HTMLElement>("#above")!;
  below = root.querySelector<HTMLElement>("#below")!;
  jest.spyOn(above, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
  jest.spyOn(below, "getBoundingClientRect").mockReturnValue({ top: 2000 } as DOMRect);
});

afterEach(() => { root.remove(); jest.restoreAllMocks(); });

it("keeps visible content visible, reveals offscreen content once, and cleans up for remounts", () => {
  expect(below).not.toHaveAttribute("data-home-reveal-state");
  const dispose = createHomeScrollEffects(root);
  expect(above).toHaveAttribute("data-home-reveal-state", "complete");
  expect(below).toHaveAttribute("data-home-reveal-state", "waiting");
  enter(below);
  expect(below).toHaveAttribute("data-home-reveal-state", "entering");
  const ended = createEvent.animationEnd(below);
  Object.defineProperty(ended, "animationName", { value: "home-scroll-reveal" });
  fireEvent(below, ended);
  enter(below);
  expect(below).toHaveAttribute("data-home-reveal-state", "complete");
  dispose();
  expect(stopReveal).toHaveBeenCalledTimes(1);
  expect(stopHighlight).toHaveBeenCalledTimes(3);
  expect(preference.removeEventListener).toHaveBeenCalledWith("change", preferenceChanged);
  expect(below).not.toHaveAttribute("data-home-reveal-state");
  // Strict Mode's effect cleanup/setup must not disable all future reveals.
  const disposeRemount = createHomeScrollEffects(root);
  expect(below).toHaveAttribute("data-home-reveal-state", "waiting");
  disposeRemount();
});

it("reveals a focused link immediately even before its entrance animation", () => {
  const dispose = createHomeScrollEffects(root);
  below.querySelector("a")!.focus();
  expect(below).toHaveAttribute("data-home-reveal-state", "complete");
  enter(below);
  expect(below).toHaveAttribute("data-home-reveal-state", "complete");
  dispose();
});

it("advances every highlight independently without unwinding on reverse scroll", () => {
  const dispose = createHomeScrollEffects(root);
  const hero = root.querySelector<HTMLElement>(".home-hero-highlight")!;
  const heading = root.querySelector<HTMLElement>("h2 .home-selection")!;
  const statement = root.querySelector<HTMLElement>(".home-community-statement .home-selection")!;
  highlights.get(root.querySelector(".home-hero")!)!(0.8);
  highlights.get(root.querySelector("h2")!)!(0.3);
  highlights.get(root.querySelector(".home-community-statement")!)!(0.6);
  expect(hero.style.getPropertyValue("--home-selection-progress")).toBe("0.8");
  expect(heading.style.getPropertyValue("--home-selection-progress")).toBe("0.3");
  expect(statement.style.getPropertyValue("--home-selection-progress")).toBe("0.6");
  highlights.forEach((update) => update(0.1));
  expect(heading.style.getPropertyValue("--home-selection-progress")).toBe("0.3");
  expect(hero.style.getPropertyValue("--home-selection-progress")).toBe("0.8");
  expect(statement.style.getPropertyValue("--home-selection-progress")).toBe("0.6");
  highlights.get(root.querySelector("h2")!)!(0.5);
  expect(heading.style.getPropertyValue("--home-selection-progress")).toBe("0.5");
  highlights.forEach((update) => { update(1); update(0); });
  for (const element of [hero, heading, statement]) {
    expect(element.style.getPropertyValue("--home-selection-progress")).toBe("1");
  }
  dispose();
  for (const element of [hero, heading, statement]) {
    expect(element.style.getPropertyValue("--home-selection-progress")).toBe("");
  }
});

it("cancels pending motion and restores all full highlights when reduced motion is enabled", () => {
  const dispose = createHomeScrollEffects(root);
  const statement = root.querySelector<HTMLElement>(".home-community-statement .home-selection")!;
  highlights.forEach((update) => update(0.4));
  expect(statement.style.getPropertyValue("--home-selection-progress")).toBe("0.4");
  preference.matches = true;
  preferenceChanged();
  expect(below).not.toHaveAttribute("data-home-reveal-state");
  for (const element of root.querySelectorAll<HTMLElement>(".home-selection, .home-hero-highlight")) {
    expect(element.style.getPropertyValue("--home-selection-progress")).toBe("");
  }
  expect(stopReveal).toHaveBeenCalled();
  expect(stopHighlight).toHaveBeenCalled();
  preference.matches = false;
  preferenceChanged();
  expect(below).toHaveAttribute("data-home-reveal-state", "complete");
  highlights.forEach((update) => update(0.1));
  for (const element of root.querySelectorAll<HTMLElement>(".home-selection, .home-hero-highlight")) {
    expect(element.style.getPropertyValue("--home-selection-progress")).toBe("1");
  }
  dispose();
});

it("leaves the server-rendered page fully visible for reduced motion", () => {
  preference.matches = true;
  const dispose = createHomeScrollEffects(root);
  expect(inView).not.toHaveBeenCalled();
  expect(scroll).not.toHaveBeenCalled();
  expect(below).not.toHaveAttribute("data-home-reveal-state");
  dispose();
});
