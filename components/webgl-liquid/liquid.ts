import { mountShader, uploadInvertible } from "../lib/shader";
export type WebglLiquidOptions = {
	/** Deep, mid and highlight CSS colours; var() and color-mix() resolve against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Large-scale flow and glow strength, 0 to 2. */
	flow: number;
	/** Dither amount, 0 to 0.2. */
	grain: number;
	/** Sweep the field in from the left the first time it is on screen. */
	reveal: boolean;
};

// Output is premultiplied over the surface.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uFlow;
uniform float uGrain;
uniform float uReveal;
uniform float uInvert;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uHighlight;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
	float v = 0.0;
	float a = 0.5;
	mat2 rot = mat2(0.86, 0.51, -0.51, 0.86);
	for (int i = 0; i < 6; i++) {
		v += a * noise(p);
		p = rot * p * 2.0;
		a *= 0.5;
	}
	return v;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float t = uTime * 0.14;
	vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

	vec2 flowP = vec2(p.x * 1.1, p.y - t * 0.35);
	float n1 = fbm(flowP * 2.8 + vec2(0.0, t * 0.2));
	float n2 = fbm((flowP + n1 * 0.45) * 4.0 - vec2(0.0, t * 0.35));
	float n3 = fbm((flowP + n2 * 0.4) * 6.5 + vec2(t * 0.15, 0.0));
	float structure = n3 * 1.15 + (n2 - 0.5) * 0.5;
	structure += (n1 - 0.5) * 0.3 * uFlow;

	vec3 col = mix(uDeep, uMid, smoothstep(0.18, 0.6, structure));
	col = mix(col, uHighlight, smoothstep(0.62, 1.08, structure));
	float glow = smoothstep(0.52, 0.95, structure) * (0.35 + 0.5 * uFlow);
	col += glow * uHighlight * 0.35;

	float verticalMask = pow(1.0 - smoothstep(0.05, 1.05, uv.y), 1.1);
	float vignette = 1.0 - smoothstep(0.36, 1.28, length(uv - 0.5));
	col *= mix(0.9, 1.05, vignette);

	col = clamp(col, 0.0, 1.0);
	col = mix(col, 1.0 - col, uInvert);
	vec3 srgb = clamp((pow(col, vec3(1.0 / 2.2)) - 0.5) * 1.1 + 0.5, 0.0, 1.0);
	srgb += (hash(gl_FragCoord.xy + t * 10.0) - 0.5) * uGrain;

	float alpha = verticalMask * smoothstep(0.08, 0.95, structure);
	alpha *= smoothstep(0.0, 0.28, uReveal - uv.x) * 0.95;
	alpha = clamp(alpha, 0.0, 1.0);
	gl_FragColor = vec4(clamp(srgb, 0.0, 1.0) * alpha, alpha);
}`;

const UNIFORMS = [
	"uResolution",
	"uTime",
	"uFlow",
	"uGrain",
	"uReveal",
	"uInvert",
] as const;
const COLORS = ["uDeep", "uMid", "uHighlight"] as const;

const REVEAL_SECONDS = 1.2;
const STILL_TIME = 7.25;

/** Runs the liquid shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountWebglLiquid(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: WebglLiquidOptions,
	onReady: (webgl: boolean) => void,
) {
	let opts = initial;
	let revealed = 0;
	const shader = mountShader(
		root,
		canvas,
		{
			fragment: FRAGMENT,
			uniforms: [...UNIFORMS, ...COLORS],
			context: { alpha: true, premultipliedAlpha: true, antialias: false, depth: false },
			stillTime: STILL_TIME,
			colors: (u, rgb) => uploadInvertible(u, rgb, COLORS, opts.colors),
			draw(u, reduced) {
				u.float("uFlow", opts.flow);
				u.float("uGrain", opts.grain);
				u.float("uReveal", opts.reveal && !reduced ? revealed : 1);
			},
			step(dt) {
				revealed = Math.min(1, revealed + dt / REVEAL_SECONDS);
				return dt * opts.speed;
			},
		},
		onReady,
	);

	return {
		update(next: WebglLiquidOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			// Turning reveal back on replays the sweep; while off, draw() shows the full frame.
			if (next.reveal && !opts.reveal) revealed = 0;
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
