/** Procedural interpretation of the Figma fluted-glass background. */
export const heroVertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const heroFragmentShader = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_pointerStrength;

float grain(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float light(vec2 p, vec2 center, vec2 radius) {
  vec2 d = p - center;
  vec2 rotated = vec2(dot(d, vec2(0.8, 0.6)), dot(d, vec2(-0.6, 0.8)));
  return exp(-2.0 * dot(rotated / radius, rotated / radius));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Fixed vertical glass ribs; only the light behind them moves.
  float ribWidth = 0.116;
  float rib = fract((p.x + 1.7) / ribWidth);
  vec2 refracted = p;
  refracted.x += (0.5 - rib) * ribWidth * 0.65;
  refracted.y += pow(rib, 2.0) * 0.035;

  vec2 cursor = (u_pointer - 0.5) * vec2(aspect, 1.0);
  vec2 middle = vec2(sin(u_time * 0.06) * 0.18, sin(u_time * 0.075) * 0.12);
  middle = mix(middle, cursor, u_pointerStrength * 0.85);
  // Three parallel light bands span the viewport and keep their spacing on hover.
  vec2 spacing = vec2(aspect * 0.3, -0.32);
  float beamLength = max(0.92, aspect * 0.6);

  float illumination = light(refracted, middle + spacing, vec2(beamLength, 0.27));
  illumination += light(refracted, middle, vec2(beamLength, 0.25)) * 0.8;
  illumination += light(refracted, middle - spacing, vec2(beamLength, 0.25)) * 0.75;
  float flute = 0.28 + 0.72 * pow(1.0 - rib, 0.55);
  float seam = (1.0 - smoothstep(0.0, 0.018, rib)) * 0.1;
  float intensity = illumination * (flute + seam) * 0.7;

  vec3 color = vec3(0.003, 0.006, 0.022);
  color += vec3(0.012, 0.065, 0.95) * pow(intensity, 0.82);
  color += vec3(0.13, 0.49, 0.42) * pow(intensity, 3.0);
  // Grain stays in screen coordinates; stretching an edge noise sample makes streaks.
  float noise = grain(gl_FragCoord.xy) - 0.5;
  float grainAmount = 0.028 + 0.13 * sqrt(intensity);
  float vignette = 1.0 - 0.22 * smoothstep(0.35, 0.9, length(uv - 0.5));

  color = (color + noise * grainAmount) * vignette;
  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;
