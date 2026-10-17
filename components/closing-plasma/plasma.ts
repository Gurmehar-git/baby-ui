import { linear, mountShader } from "../lib/shader";
export type ClosingPlasmaOptions = {
	/** Three CSS colours: surface, body, ridge; var() and color-mix() resolve against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Noise frequency growth per octave, 0 to 2. */
	turbulence: number;
	/** Sparkle strength, 0 to 2. */
	sparkle: number;
	/** Film grain, 0 to 2. */
	grain: number;
	/** The field leans toward the pointer. */
	interactive: boolean;
};

// Light mode fades edges to the surface.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uIsDark;
uniform float uTurbulence;
uniform float uPointerStrength;
uniform float uGrain;
uniform float uSparkle;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i = floor(v + dot(v, C.yy));
	vec2 x0 = v - i + dot(i, C.xx);
	vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod289(i);
	vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
	vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
	m = m * m;
	m = m * m;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
	vec3 g;
	g.x = a0.x * x0.x + h.x * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float fbm(vec2 p, float turbulence) {
	float total = 0.0;
	float amp = 0.5;
	float freq = 1.0;
	mat2 rot = mat2(cos(0.45), sin(0.45), -sin(0.45), cos(0.45));
	for (int i = 0; i < 5; i++) {
		total += snoise(p * freq) * amp;
		p = rot * p;
		freq *= mix(1.85, 2.35, clamp(turbulence, 0.0, 2.0) * 0.5);
		amp *= 0.5;
	}
	return total;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float aspect = uResolution.x / max(uResolution.y, 1.0);
	vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
	float t = uTime * 0.15;

	vec2 mouse = (uPointer - 0.5) * vec2(aspect, 1.0);
	float dMouse = length(p - mouse);
	p += (mouse - p) * 0.02 * uPointerStrength * (1.0 - smoothstep(0.0, 0.45, dMouse));

	vec2 flow = vec2(
		fbm(p + vec2(t * 0.2, t * 0.1), uTurbulence),
		fbm(p + vec2(-t * 0.1, t * 0.3), uTurbulence)
	);
	float n = fbm(p * 2.0 + flow * 1.45, uTurbulence);
	float ridges = 1.0 - abs(snoise(p * 4.0 + n) * 2.0);
	ridges = pow(ridges, 3.0);

	vec3 col = mix(uColorA, uColorB, smoothstep(-0.5, 0.5, n));
	col = mix(col, uColorC, smoothstep(0.25, 1.0, n * 0.52 + ridges * 0.48));

	float sparkle = pow(max(0.0, snoise(gl_FragCoord.xy * 0.2 + t * 2.0)), 18.0) * 0.5 * uSparkle;
	vec3 sparkleColor = pow(mix(vec3(0.56, 0.58, 0.72), vec3(0.8, 0.9, 1.0), uIsDark), vec3(2.2));
	col += sparkleColor * sparkle;

	float vigDark = 1.0 - smoothstep(0.5, mix(1.8, 1.55, uIsDark), length(p));
	col = mix(col, col * vigDark, uIsDark);
	float vigLight = 1.0 - smoothstep(0.4, 1.45, length(p));
	col = mix(mix(uColorA, col, vigLight), col, uIsDark);

	vec3 srgb = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));
	float grain = (fract(sin(dot(gl_FragCoord.xy + t * 50.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.06 * uGrain;
	gl_FragColor = vec4(clamp(srgb + grain, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = [
	"uResolution",
	"uPointer",
	"uTime",
	"uIsDark",
	"uTurbulence",
	"uPointerStrength",
	"uGrain",
	"uSparkle",
] as const;
const COLORS = ["uColorA", "uColorB", "uColorC"] as const;

const STILL_TIME = 7.25;
const POINTER_EASE = 0.05;

/** Runs the plasma shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountClosingPlasma(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: ClosingPlasmaOptions,
	onReady: (webgl: boolean) => void,
) {
	let opts = initial;
	const pointer = { x: 0.5, y: 0.5 };
	const target = { x: 0.5, y: 0.5 };
	const shader = mountShader(
		root,
		canvas,
		{
			fragment: FRAGMENT,
			uniforms: [...UNIFORMS, ...COLORS],
			stillTime: STILL_TIME,
			colors(u, rgb) {
				const [r = 0, g = 0, b = 0] = rgb("var(--background)").map(linear);
				const dark = 0.2126 * r + 0.7152 * g + 0.0722 * b <= 0.2;
				u.float("uIsDark", dark ? 1 : 0);
				COLORS.forEach((name, i) => {
					const [x = 0, y = 0, z = 0] = rgb(opts.colors[i] ?? "var(--foreground)").map(
						linear,
					);
					u.vec3(name, x, y, z);
				});
			},
			draw(u, reduced) {
				u.vec2("uPointer", pointer.x, pointer.y);
				u.float("uTurbulence", opts.turbulence);
				u.float("uSparkle", opts.sparkle);
				u.float("uGrain", opts.grain);
				u.float("uPointerStrength", opts.interactive && !reduced ? 1 : 0);
			},
			step(dt) {
				pointer.x += (target.x - pointer.x) * POINTER_EASE;
				pointer.y += (target.y - pointer.y) * POINTER_EASE;
				return dt * opts.speed;
			},
			still() {
				pointer.x = pointer.y = target.x = target.y = 0.5;
			},
			pointer(x, y, inside) {
				target.x = inside && opts.interactive ? x : 0.5;
				target.y = inside && opts.interactive ? y : 0.5;
			},
		},
		onReady,
	);

	return {
		update(next: ClosingPlasmaOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
