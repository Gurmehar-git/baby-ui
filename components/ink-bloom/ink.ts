// Structural twins of the public shader engine's types: shared files are copied verbatim into
// the Svelte port, so they cannot reach the engine by a relative path.
type Rgb = [number, number, number];
type Setters = {
	float(name: string, value: number): void;
	vec2(name: string, x: number, y: number): void;
	vec3(name: string, x: number, y: number, z: number): void;
};

export type InkBloomOptions = {
	/** Four CSS colours: water, first ink, second ink, highlight. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Colour strength, 0 (flat base) to 1. */
	intensity: number;
	/** Film grain, 0 to 1. */
	grain: number;
};

// Two passes of domain warping over four-octave value noise read as ink folding through water;
// the warp field itself decides which ink blooms where.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGrain;
uniform float uIntensity;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

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

float fbm(vec2 p) {
	float v = 0.0;
	float a = 0.5;
	for (int i = 0; i < 4; i++) {
		v += a * noise(p);
		p = p * 2.03 + vec2(1.7, 9.2);
		a *= 0.5;
	}
	return v;
}

void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y) * 1.6;
	float t = uTime * 0.07;

	vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) - t));
	vec2 r = vec2(
		fbm(uv + 2.2 * q + vec2(1.7, 9.2) + 0.15 * t),
		fbm(uv + 2.2 * q + vec2(8.3, 2.8) - 0.12 * t)
	);
	float f = fbm(uv + 2.0 * r);

	vec3 col = uColor0;
	col = mix(col, uColor1, smoothstep(0.42, 0.78, f));
	col = mix(col, uColor2, smoothstep(0.55, 0.95, length(q)) * smoothstep(0.35, 0.7, r.y));
	col = mix(col, uColor3, smoothstep(0.78, 1.0, f + 0.25 * r.x) * 0.35);

	col = mix(uColor0, col, uIntensity);
	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	col += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const COLORS = ["uColor0", "uColor1", "uColor2", "uColor3"] as const;
const START_TIME = 6.5;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;
const BASE_SPEED = 1;

/** The ink-bloom scene for the shader engine, plus `set` to feed option changes. */
export function createInkBloom(initial: InkBloomOptions) {
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
		set(next: InkBloomOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			return recolor;
		},
	};
}
