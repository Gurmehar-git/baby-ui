// Structural twins of the public shader engine's types: shared files are copied verbatim into
// the Svelte port, so they cannot reach the engine by a relative path.
type Rgb = [number, number, number];
type Setters = {
	float(name: string, value: number): void;
	vec2(name: string, x: number, y: number): void;
	vec3(name: string, x: number, y: number, z: number): void;
};

export type DispersionRaysOptions = {
	/** Three CSS colours: base, ray, highlight; var() resolves against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Colour strength, 0 (flat base) to 1. */
	intensity: number;
	/** Film grain, 0 to 1. */
	grain: number;
};

// Rays fan from a source above the top-left corner. Each channel reads the ray pattern at a
// slightly shifted angle, so edges split into a spectral fringe; value noise adds the haze.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGrain;
uniform float uIntensity;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
		mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
		u.y
	);
}

float rays(float a, float t) {
	float v = 0.5 + 0.5 * sin(a * 17.0 + t * 0.6);
	v *= 0.55 + 0.45 * sin(a * 7.0 - t * 0.35 + 1.3);
	v += 0.3 * (0.5 + 0.5 * sin(a * 29.0 + t * 0.9));
	return pow(clamp(v * 0.85, 0.0, 1.0), 2.0);
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float aspect = uResolution.x / uResolution.y;
	float t = uTime;
	vec2 q = (uv - vec2(0.12, 1.12)) * vec2(aspect, 1.0);
	float a = atan(q.y, q.x);
	float dist = length(q);

	float fan = smoothstep(-2.3, -1.6, a) * smoothstep(0.1, -0.5, a);
	float fall = exp(-dist * 0.9) * fan;
	float haze = noise(uv * 3.0 + vec2(t * 0.04, -t * 0.03)) * 0.5
		+ noise(uv * 7.0 - t * 0.05) * 0.25;

	float spread = 0.018;
	float rr = rays(a - spread, t);
	float rg = rays(a, t);
	float rb = rays(a + spread, t);

	float light = clamp(rg * fall * 1.25 + haze * fall * 0.45, 0.0, 1.0);
	vec3 col = mix(uColor0, uColor1, light);
	col = mix(col, uColor2, clamp(rg * rg * fall * 0.55, 0.0, 1.0));
	col += (vec3(rr, rg, rb) - rg) * fall * 0.55;

	col = mix(uColor0, col, uIntensity);
	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	col += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const COLORS = ["uColor0", "uColor1", "uColor2"] as const;
const START_TIME = 2.1;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;
const BASE_SPEED = 1;

/** The dispersion-rays scene for the shader engine, plus `set` to feed option changes. */
export function createDispersionRays(initial: DispersionRaysOptions) {
	let opts = initial;

	const scene = {
		fragment: FRAGMENT,
		uniforms: ["uGrain", "uIntensity", ...COLORS],
		context: {
			alpha: false,
			antialias: false,
			depth: false,
			powerPreference: "low-power",
		} satisfies WebGLContextAttributes,
		stillTime: START_TIME,
		frameMs: FRAME_MS,
		colors(u: Setters, rgb: (css: string) => Rgb) {
			COLORS.forEach((name, i) => {
				const [r, g, b] = rgb(opts.colors[i] ?? "var(--foreground)");
				u.vec3(name, r, g, b);
			});
		},
		draw(u: Setters) {
			u.float("uGrain", opts.grain);
			u.float("uIntensity", opts.intensity);
		},
		step: (dt: number) => dt * opts.speed * BASE_SPEED,
		moving: () => opts.speed > 0,
	};

	return {
		scene,
		/** Applies new options; true when the colours changed and must be re-read. */
		set(next: DispersionRaysOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			return recolor;
		},
	};
}
