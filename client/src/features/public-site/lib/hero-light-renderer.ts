import { heroFragmentShader, heroVertexShader } from "@/features/public-site/lib/hero-light-shaders";

export type HeroLightRenderer = {
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

/** Owns GPU resources and pointer/animation work, without rerendering React. */
export function createHeroLightRenderer(canvas: HTMLCanvasElement, hero: HTMLElement): HeroLightRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power",
  });
  if (!gl) return null;

  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      gl!.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertex = compile(gl.VERTEX_SHADER, heroVertexShader);
  const fragment = compile(gl.FRAGMENT_SHADER, heroFragmentShader);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const releaseResources = () => {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  };
  if (!vertex || !fragment || !program || !buffer) {
    releaseResources();
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    releaseResources();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const pointer = gl.getUniformLocation(program, "u_pointer");
  const strength = gl.getUniformLocation(program, "u_pointerStrength");
  const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
  const maxRenderSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let motionReduced = reducedMotion.matches;
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let paused = false;
  let visible = true;
  let lost = false;
  let disposed = false;
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let targetStrength = 0;
  let currentStrength = 0;

  const canAnimate = () => !paused && !motionReduced && visible && !document.hidden && !lost && !disposed;

  function draw() {
    if (lost || disposed) return;
    gl!.uniform2f(resolution, canvas.width, canvas.height);
    gl!.uniform1f(time, elapsed);
    gl!.uniform2f(pointer, currentX, currentY);
    gl!.uniform1f(strength, currentStrength);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    canvas.dataset.ready = "true";
  }

  function animate(now: number) {
    frame = 0;
    if (!canAnimate()) return;
    const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
    previousTime = now;
    elapsed += delta;
    // Ease slowly and cap travel speed, even when the cursor crosses the screen.
    const ease = 1 - Math.exp(-delta * 1.1);
    const dx = (targetX - currentX) * ease;
    const dy = (targetY - currentY) * ease;
    const distance = Math.hypot(dx, dy);
    const travel = Math.min(1, (delta * 0.18) / Math.max(distance, 0.00001));
    currentX += dx * travel;
    currentY += dy * travel;
    // Entering/leaving the hero blends between cursor and ambient paths gently.
    currentStrength += (targetStrength - currentStrength) * (1 - Math.exp(-delta * 0.65));
    draw();
    frame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    if (canAnimate()) frame = requestAnimationFrame(animate);
  }

  function resize() {
    if (lost || disposed) return;
    const { width, height } = hero.getBoundingClientRect();
    // Match the display's native resolution; only GPU dimension limits can reduce it.
    const scale = Math.min(
      window.devicePixelRatio || 1,
      Math.min(maxViewport[0], maxRenderSize) / Math.max(width, 1),
      Math.min(maxViewport[1], maxRenderSize) / Math.max(height, 1),
    );
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    draw();
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch" || motionReduced || paused) return;
    const rect = hero.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    targetY = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    targetStrength = 1;
  }
  function onPointerLeave() {
    targetStrength = 0;
  }
  function onMotionChange(event: MediaQueryListEvent) {
    motionReduced = event.matches;
    targetStrength = 0;
    if (motionReduced) {
      currentStrength = 0;
      draw();
    }
    syncAnimation();
  }
  function onContextLost() {
    // The local Figma still remains underneath if the browser releases the GPU.
    lost = true;
    canvas.dataset.ready = "false";
    syncAnimation();
  }

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });
  resizeObserver.observe(hero);
  intersectionObserver.observe(hero);
  hero.addEventListener("pointermove", onPointerMove, { passive: true });
  hero.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("webglcontextlost", onContextLost);
  reducedMotion.addEventListener("change", onMotionChange);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", syncAnimation);
  resize();
  syncAnimation();

  return {
    setPaused(value) {
      paused = value;
      syncAnimation();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      reducedMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncAnimation);
      canvas.dataset.ready = "false";
      releaseResources();
    },
  };
}
