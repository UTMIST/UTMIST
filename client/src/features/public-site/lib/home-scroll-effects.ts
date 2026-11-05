import { inView, scroll } from "framer-motion";

import { homeMotion } from "@/features/public-site/lib/home-motion";

/** Enhance server-rendered content in place; it stays visible without JavaScript. */
export function createHomeScrollEffects(root: HTMLElement) {
  if (!("IntersectionObserver" in window)) return () => {};
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-home-reveal]"));
  const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-home-stagger]"));
  const highlights = Array.from(root.querySelectorAll<HTMLElement>(".home-selection, .home-hero-highlight"));
  const finished = new WeakSet<HTMLElement>();
  let stopEffects = () => {};

  function setup() {
    stopEffects();
    if (preference.matches) return;

    // Already-visible content (including restored scroll positions) never flashes out.
    const pending = targets.filter((element) => {
      if (finished.has(element) || element.getBoundingClientRect().top < window.innerHeight) {
        element.dataset.homeRevealState = "complete";
        finished.add(element);
        return false;
      }
      element.dataset.homeRevealState = "waiting";
      return true;
    });

    function updateStaggers() {
      for (const group of groups) {
        const items = Array.from(group.querySelectorAll<HTMLElement>("[data-home-reveal]"))
          .filter((element) => element.offsetWidth > 0)
          .map((element) => ({ element, box: element.getBoundingClientRect() }));
        const columns = [...new Set(items.map(({ box }) => Math.round(box.left)))].sort((a, b) => a - b);
        const rows = [...new Set(items.map(({ box }) => Math.round(box.top)))].sort((a, b) => a - b);
        for (const { element, box } of items) {
          if (element.dataset.homeRevealState !== "waiting") continue;
          const column = columns.indexOf(Math.round(box.left));
          const row = group.dataset.homeStagger === "diagonal" ? rows.indexOf(Math.round(box.top)) : 0;
          const delay = Math.min((column + row) * homeMotion.staggerMs, homeMotion.maxStaggerMs);
          element.style.setProperty("--home-reveal-delay", `${delay}ms`);
        }
      }
    }
    updateStaggers();
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateStaggers);
    groups.forEach((group) => resize?.observe(group));

    const stopReveal = inView(pending, (element) => {
      const target = element as HTMLElement;
      if (target.dataset.homeRevealState === "waiting") target.dataset.homeRevealState = "entering";
    }, { margin: homeMotion.viewportMargin });

    const complete = (event: AnimationEvent) => {
      if (event.animationName === "home-scroll-reveal" && event.target instanceof HTMLElement) {
        event.target.dataset.homeRevealState = "complete";
        finished.add(event.target);
      }
    };
    // Keyboard navigation can reach a link before its stagger has finished.
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      let element = event.target.closest<HTMLElement>("[data-home-reveal]");
      while (element && root.contains(element)) {
        element.dataset.homeRevealState = "complete";
        finished.add(element);
        element = element.parentElement?.closest<HTMLElement>("[data-home-reveal]") ?? null;
      }
    };
    root.addEventListener("animationend", complete);
    root.addEventListener("focusin", focus);

    const stopHighlights = highlights.map((highlight) => {
      const hero = highlight.closest<HTMLElement>(".home-hero");
      // Track a stable block so inline wrapping and reveal transforms don't alter progress.
      const target = hero
        ?? highlight.closest<HTMLElement>(".home-community-statement")
        ?? highlight.closest<HTMLElement>("h1, h2, h3, p")
        ?? highlight;
      return scroll((progress: number) => {
        highlight.style.setProperty("--home-selection-progress", String(progress));
      }, { target, offset: [...(hero ? homeMotion.heroHighlightOffsets : homeMotion.highlightOffsets)] });
    });

    stopEffects = () => {
      stopReveal();
      stopHighlights.forEach((stop) => stop());
      resize?.disconnect();
      root.removeEventListener("animationend", complete);
      root.removeEventListener("focusin", focus);
      for (const element of targets) {
        delete element.dataset.homeRevealState;
        element.style.removeProperty("--home-reveal-delay");
      }
      highlights.forEach((highlight) => highlight.style.removeProperty("--home-selection-progress"));
    };
  }

  setup();
  const changePreference = () => {
    // A preference change reveals everything immediately, without replaying it.
    targets.forEach((element) => finished.add(element));
    setup();
  };
  preference.addEventListener("change", changePreference);
  return () => {
    stopEffects();
    preference.removeEventListener("change", changePreference);
  };
}
