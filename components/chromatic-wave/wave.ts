import { mountShader } from "../lib/shader";

export type ChromaticWaveOptions = {
	/** Base plus three tone colours; var() resolves against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Effect strength, 0 to 2. */
	intensity: number;
	/** Film grain, 0 to 1. */
	grain: number;
};

const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uTime;
uniform float uGrain;
uniform float uIntensity;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Blends the three tone colours around a hue circle, so any phase lands on a tone mix.
vec3 tones(float phase) {
	float a = 0.5 + 0.5 * cos(6.28318 * phase);
	float b = 0.5 + 0.5 * cos(6.28318 * (phase - 0.3333));
	float c = 0.5 + 0.5 * cos(6.28318 * (phase - 0.6667));
	return (uColor1 * a + uColor2 * b + uColor3 * c) / max(a + b + c, 0.001);
}

// A tilted ramp plus two slow waves; its contour lines run as flowing parallel strands.
float field(vec2 p, float t) {
	p += 0.25 * vec2(sin(p.y * 0.7 + t * 0.4), cos(p.x * 0.6 - t * 0.3));
	return sin(p.x * 0.9 + t * 0.35) * 0.9 + sin(dot(p, vec2(0.6, 0.8)) * 1.3 - t * 0.5) * 0.6 + p.y * 0.35;
}

void main() {
	float scale = uPixelRatio * 420.0;
	vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / scale;
	float t = uTime * 0.3;
	float lines = 14.0;
	float e = 0.01;
	float v = field(p, t);
	vec2 g = vec2(field(p + vec2(e, 0.0), t) - v, field(p + vec2(0.0, e), t) - v) / e;
	float s = v * lines;
	// Distance to the nearest contour in plane units, so every strand stays about 1px wide.
	float dist = (0.5 - abs(fract(s) - 0.5)) / max(length(g) * lines, 0.001);
	float strand = 1.0 - smoothstep(0.5 / 420.0, 1.5 / 420.0, dist);
	vec3 chroma = tones(s / lines * 0.5 + p.x * 0.08 + t * 0.05);
	vec3 col = mix(uColor0, chroma, 0.06 * uIntensity);
	col = mix(col, chroma, clamp(strand * uIntensity * 0.85, 0.0, 1.0));
	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	col += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = ["uResolution", "uPixelRatio", "uTime", "uGrain", "uIntensity"] as const;
const COLORS = ["uColor0", "uColor1", "uColor2", "uColor3"] as const;

const START_TIME = 4;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;

/** Runs the chromatic wave shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountChromaticWave(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: ChromaticWaveOptions,
	onReady: (webgl: boolean) => void,
) {
	let opts = initial;
	const shader = mountShader(
		root,
		canvas,
		{
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
				u.float("uIntensity", opts.intensity);
			},
			step: (dt) => dt * opts.speed,
			moving: () => opts.speed > 0,
			resize: (u, dpr) => u.float("uPixelRatio", dpr),
		},
		onReady,
	);

	return {
		update(next: ChromaticWaveOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
