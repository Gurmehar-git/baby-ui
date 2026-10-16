import type { ShaderScene } from "./shader";

export type PrismGradientOptions = {
	/** Three CSS colours: base, band, highlight; var() resolves against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Film grain, 0 to 1. */
	grain: number;
};

// Fixed knobs are inlined at their defaults.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uTime;
uniform float uGrain;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float th) {
	return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float time = 0.5 * uTime;

	uv -= 0.5;
	uv *= 0.00056 * uResolution;
	uv = rotate(uv, -1.37078);
	uv /= uPixelRatio;
	uv += 0.5;

	for (int i = 1; i <= 16; i++) {
		float fi = float(i);
		uv.x += 0.5 / fi * cos(time + fi * 1.5 * uv.y);
		uv.y += 0.5 / fi * cos(time + fi * uv.x);
	}

	vec2 checks = uv * 2.075;
	float mixer = 0.5 + 0.5 * sin(checks.x) * cos(checks.y) - 0.336;
	float r1 = smoothstep(0.1855, 0.5195, mixer);
	float r2 = smoothstep(0.4855, 0.8246, mixer);
	vec3 color = mix(mix(uColor0, uColor1, r1), uColor2, r2);

	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	color += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = ["uResolution", "uPixelRatio", "uTime", "uGrain"] as const;
const COLORS = ["uColor0", "uColor1", "uColor2"] as const;
type Uniform = (typeof UNIFORMS)[number] | (typeof COLORS)[number];

const START_TIME = -2.99;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;
const BASE_SPEED = 1.5;

/** The prism scene for `mountShader`, plus `set` to feed option changes. */
export function createPrismGradient(initial: PrismGradientOptions) {
	let opts = initial;
	const scene: ShaderScene<Uniform> = {
		fragment: FRAGMENT,
		uniforms: [...UNIFORMS, ...COLORS],
		context: {
			alpha: false,
			antialias: false,
			depth: false,
			powerPreference: "low-power",
		},
		stillTime: START_TIME,
		frameMs: FRAME_MS,
		colors(u, rgb) {
			COLORS.forEach((name, i) => {
				const [r, g, b] = rgb(opts.colors[i] ?? "var(--foreground)");
				u.vec3(name, r, g, b);
			});
		},
		draw(u) {
			u.float("uGrain", opts.grain);
		},
		step: (dt) => dt * opts.speed * BASE_SPEED,
		moving: () => opts.speed > 0,
		resize: (u, dpr) => u.float("uPixelRatio", dpr),
	};
	return {
		scene,
		/** Applies new options; true when the colours changed and must be re-read. */
		set(next: PrismGradientOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			return recolor;
		},
	};
}
