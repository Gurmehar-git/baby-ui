import { mountShader } from "../lib/shader";

export type IridescentFoldOptions = {
	/** Base plus three tone colours; var() resolves against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Effect strength, 0 to 2. */
	intensity: number;
	/** Film grain, 0 to 1. */
	grain: number;
	/** Smooth draped folds instead of crumpled creases. */
	silk: boolean;
};

const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uTime;
uniform float uGrain;
uniform float uIntensity;
uniform float uSilk;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	float a = mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x);
	float b = mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x);
	return mix(a, b, u.y);
}

// Foil: soft billows plus ridged octaves, each octave's folded valley a sharp crease.
float crumple(vec2 p, float t) {
	vec2 w = p + 0.45 * vec2(noise(p * 0.6 + t * 0.15), noise(p * 0.6 - t * 0.12 + 4.0));
	float h = 0.7 * noise(w * 0.7);
	float amp = 0.5;
	float freq = 1.4;
	mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
	for (int i = 0; i < 4; i++) {
		float ridge = 1.0 - abs(noise(w * freq + float(i) * 3.1) * 2.0 - 1.0);
		h += amp * ridge * ridge;
		w = turn * w;
		freq *= 2.0;
		amp *= 0.5;
	}
	return h;
}

// Silk: long draped folds from a twice-warped sine field, smooth enough for broad sheens.
float drape(vec2 p, float t) {
	vec2 w = p * 0.55;
	w += 0.6 * vec2(sin(w.y * 1.7 + t * 0.5), cos(w.x * 1.3 - t * 0.4));
	w += 0.3 * vec2(sin(w.y * 3.1 - t * 0.3), cos(w.x * 2.7 + t * 0.35));
	return sin(w.x * 2.2 + w.y * 0.9) * 0.6 + sin(w.x * -0.7 + w.y * 1.9 + t * 0.2) * 0.4;
}

float surface(vec2 p, float t) {
	return uSilk > 0.5 ? drape(p, t) : crumple(p, t);
}

// Thin film: the three tones blend around a hue circle, so every phase is a soft mix.
vec3 film(float phase) {
	float a = 0.5 + 0.5 * cos(6.28318 * phase);
	float b = 0.5 + 0.5 * cos(6.28318 * (phase - 0.3333));
	float c = 0.5 + 0.5 * cos(6.28318 * (phase - 0.6667));
	return (uColor1 * a + uColor2 * b + uColor3 * c) / max(a + b + c, 0.001);
}

void main() {
	vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / (uPixelRatio * 380.0);
	float t = uTime * 0.2;
	float e = 0.004;
	float h = surface(p, t);
	vec2 grad = vec2(surface(p + vec2(e, 0.0), t) - h, surface(p + vec2(0.0, e), t) - h) / e;
	vec3 n = normalize(vec3(-grad * mix(0.2, 0.35, uSilk), 1.0));
	vec3 light = normalize(vec3(-0.45, 0.55, 0.7));
	vec3 half_ = normalize(light + vec3(0.0, 0.0, 1.0));
	float facing = max(dot(n, half_), 0.0);
	float diffuse = clamp(dot(n, light) * 0.5 + 0.5, 0.0, 1.0);
	float sheen = pow(facing, mix(8.0, 4.0, uSilk));
	float spec = pow(facing, mix(70.0, 28.0, uSilk));
	float rim = pow(1.0 - n.z, 2.0);
	float angle = dot(n.xy, vec2(0.9, -0.7));
	vec3 col = film(h * 0.9 + angle * 1.4 + t * 0.08);
	// Faces turned from the light sink toward the page; creases catch white light.
	col = mix(mix(col, uColor0, 0.4), col, diffuse);
	// Spectral glints: a full rainbow rides the brightest facets, as real foil splits light.
	vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (angle * 2.5 + h + vec3(0.0, 0.33, 0.67)));
	col = mix(col, rainbow, sheen * mix(0.35, 0.18, uSilk));
	col += vec3(sheen * 0.18 + spec * 0.9 + rim * 0.25) * max(uIntensity, 0.5);
	// Silk catches a fine sparkle in the lit weave.
	col += uSilk * step(0.985, hash(floor(gl_FragCoord.xy / uPixelRatio))) * sheen * 0.5;
	col = mix(uColor0, col, clamp(uIntensity, 0.0, 1.0));
	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	col += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = [
	"uResolution",
	"uPixelRatio",
	"uTime",
	"uGrain",
	"uIntensity",
	"uSilk",
] as const;
const COLORS = ["uColor0", "uColor1", "uColor2", "uColor3"] as const;

const START_TIME = 4;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;

/** Runs the iridescent fold shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountIridescentFold(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: IridescentFoldOptions,
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
				u.float("uSilk", opts.silk ? 1 : 0);
			},
			step: (dt) => dt * opts.speed,
			moving: () => opts.speed > 0,
			resize: (u, dpr) => u.float("uPixelRatio", dpr),
		},
		onReady,
	);

	return {
		update(next: IridescentFoldOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
