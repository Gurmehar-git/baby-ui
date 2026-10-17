import { mountShader } from "../lib/shader";

export type LightCausticsOptions = {
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

// Three crossing wave trains; where their sum crosses zero the light focuses into a filament.
float waves(vec2 p, float t) {
	p += 0.4 * vec2(sin(p.y * 1.1 + t * 0.5), cos(p.x * 1.3 - t * 0.45));
	float w = sin(p.x * 2.1 + t);
	w += sin(dot(p, vec2(0.5, 0.87)) * 2.3 - t * 1.1);
	w += sin(dot(p, vec2(-0.5, 0.87)) * 1.9 + t * 0.9);
	return w / 3.0;
}

void main() {
	vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / (uPixelRatio * 300.0);
	float t = uTime * 0.6;
	float a = 1.0 - abs(waves(p, t));
	float b = 1.0 - abs(waves(p * 1.7 + 3.1, t * 1.3));
	float net = pow(a, 7.0) * 0.8 + pow(b, 11.0) * 0.55;
	vec3 base = mix(uColor0, uColor1, 0.12 + 0.08 * sin(p.y * 0.4 + t * 0.2));
	vec3 glow = tones(0.18 * p.x + 0.12 * p.y + t * 0.03);
	vec3 col = mix(base, glow, clamp(net * uIntensity, 0.0, 1.0));
	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	col += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = ["uResolution", "uPixelRatio", "uTime", "uGrain", "uIntensity"] as const;
const COLORS = ["uColor0", "uColor1", "uColor2", "uColor3"] as const;

const START_TIME = 4;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;

/** Runs the light caustics shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountLightCaustics(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: LightCausticsOptions,
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
		update(next: LightCausticsOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
