import { createHeroLightRenderer, type HeroLightRenderer } from "@/features/public-site/lib/hero-light-renderer";

let hero: HTMLElement;
let renderer: HeroLightRenderer | null;
let nextFrame: FrameRequestCallback | undefined;
let uniforms: Map<string, number[]>;

beforeEach(() => {
  uniforms = new Map();
  nextFrame = undefined;
  // jsdom has no GPU. Keep the renderer, pointer events and clock real;
  // capture only the values sent across the WebGL boundary.
  const gl = {
    MAX_VIEWPORT_DIMS: 1,
    getParameter: (parameter: number) => parameter === 1 ? [8192, 8192] : 8192,
    createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}),
    getShaderParameter: () => true, getProgramParameter: () => true,
    getAttribLocation: () => 0, getUniformLocation: (_program: unknown, name: string) => name,
    uniform1f: (name: string, value: number) => uniforms.set(name, [value]),
    uniform2f: (name: string, x: number, y: number) => uniforms.set(name, [x, y]),
    uniform3f: (name: string, x: number, y: number, z: number) => uniforms.set(name, [x, y, z]),
    shaderSource: jest.fn(), compileShader: jest.fn(), attachShader: jest.fn(),
    linkProgram: jest.fn(), useProgram: jest.fn(), bindBuffer: jest.fn(),
    bufferData: jest.fn(), enableVertexAttribArray: jest.fn(), vertexAttribPointer: jest.fn(),
    viewport: jest.fn(), drawArrays: jest.fn(), deleteShader: jest.fn(),
    deleteProgram: jest.fn(), deleteBuffer: jest.fn(),
  };
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(context =>
    context === "webgl" ? gl as unknown as WebGLRenderingContext : null,
  );
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { nextFrame = callback; return 1; });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => { nextFrame = undefined; });
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({
    matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn(),
  }) });
  for (const name of ["ResizeObserver", "IntersectionObserver"]) {
    Object.defineProperty(window, name, { configurable: true, value: jest.fn(() => ({ observe() {}, disconnect() {} })) });
  }
  hero = document.createElement("section");
  hero.innerHTML = "<div><canvas></canvas></div>";
  document.body.append(hero);
  jest.spyOn(hero, "getBoundingClientRect").mockReturnValue({ left: 100, top: 50, width: 1000, height: 800 } as DOMRect);
  jest.spyOn(hero.firstElementChild!, "getBoundingClientRect").mockReturnValue({ width: 1000, height: 980 } as DOMRect);
  renderer = createHeroLightRenderer(hero.querySelector("canvas")!, hero);
});

afterEach(() => { renderer?.dispose(); hero.remove(); jest.restoreAllMocks(); });

function movePointer(pointerType = "mouse", target: EventTarget = hero, clientX = 950, clientY = 290) {
  const event = new MouseEvent("pointermove", { clientX, clientY, bubbles: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  target.dispatchEvent(event);
}

function advance(start: number, duration: number, fps: number) {
  for (let step = 0; step <= duration * fps; step++) {
    const callback = nextFrame;
    nextFrame = undefined;
    callback?.(start + step * 1000 / fps);
  }
}

it.each([60, 10])("follows the cursor with a gentle two-second ease at %i fps", fps => {
  movePointer();
  advance(1000, 2, fps);
  // A cursor in the upper-right must visibly pull the light there, even at low fps.
  expect(uniforms.get("u_pointer")![0]).toBeGreaterThan(0.75);
  expect(uniforms.get("u_pointer")![1]).toBeGreaterThan(0.65);
  expect(uniforms.get("u_pointerStrength")![0]).toBeGreaterThan(0.8);
  expect(uniforms.get("u_time")![0]).toBeCloseTo(2);
});

it("tracks through a sibling overlay even when it stops pointer-event bubbling", () => {
  const overlay = document.createElement("button");
  overlay.addEventListener("pointermove", event => event.stopPropagation());
  document.body.append(overlay);
  try {
    movePointer("mouse", overlay);
    advance(1000, 2, 60);
    expect(uniforms.get("u_pointer")![0]).toBeGreaterThan(0.75);
    expect(uniforms.get("u_pointerStrength")![0]).toBeGreaterThan(0.8);
    // Moving from the hero to an overlay must not switch back to ambient light.
    hero.dispatchEvent(new MouseEvent("pointerleave", { relatedTarget: overlay }));
    advance(3000, 4, 60);
    expect(uniforms.get("u_pointerStrength")![0]).toBeGreaterThan(0.9);
  } finally { overlay.remove(); }
});

it("returns to ambient motion when the pointer moves outside the hero bounds", () => {
  movePointer();
  advance(1000, 2, 60);
  const activeStrength = uniforms.get("u_pointerStrength")![0];
  movePointer("mouse", document.body, 950, 900);
  advance(3000, 4, 60);
  expect(uniforms.get("u_pointerStrength")![0]).toBeLessThan(activeStrength * 0.1);
});

it("returns to ambient motion when the pointer leaves the browser viewport", () => {
  movePointer();
  advance(1000, 2, 60);
  const activeStrength = uniforms.get("u_pointerStrength")![0];
  document.dispatchEvent(new MouseEvent("pointerout", { relatedTarget: null }));
  advance(3000, 4, 60);
  expect(uniforms.get("u_pointerStrength")![0]).toBeLessThan(activeStrength * 0.1);
});

it("ignores touch and keeps the frame frozen while paused", () => {
  movePointer("touch");
  advance(1000, 1, 60);
  expect(uniforms.get("u_pointerStrength")).toEqual([0]);
  renderer!.setPaused(true);
  movePointer();
  advance(3000, 1, 60);
  expect(uniforms.get("u_time")![0]).toBeCloseTo(1);
  expect(uniforms.get("u_pointerStrength")).toEqual([0]);
  renderer!.setPaused(false);
  movePointer();
  advance(10000, 2, 60);
  expect(uniforms.get("u_time")![0]).toBeCloseTo(3);
  expect(uniforms.get("u_pointerStrength")![0]).toBeGreaterThan(0.8);
});
