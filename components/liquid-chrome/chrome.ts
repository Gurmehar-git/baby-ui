import { mountShader, uploadInvertible } from "../lib/shader";
export type LiquidChromeOptions = {
	/** Shadow, base, silver and specular CSS colours; var() and color-mix() resolve against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Domain-warp depth of the metal, 0 to 1.5. */
	amplitude: number;
	/** The surface bulges away from the pointer instead of the centre. */
	interactive: boolean;
};

// Shadows and vignette fall to the shadow token.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uAmplitude;
uniform float uInvert;
uniform vec3 uShadow;
uniform vec3 uBase;
uniform vec3 uSilver;
uniform vec3 uSpecular;

const mat2 m = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
	float f = 0.0;
	f += 0.5000 * noise(p); p = m * p * 2.02;
	f += 0.2500 * noise(p); p = m * p * 2.03;
	f += 0.1250 * noise(p); p = m * p * 2.01;
	f += 0.0625 * noise(p);
	return f / 0.9375;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float aspect = uResolution.x / max(uResolution.y, 1.0);
	vec2 p = (-1.0 + 2.0 * uv) * vec2(aspect, 1.0);
	vec2 mouse = (uPointer - 0.5) * 2.0 * vec2(aspect, 1.0);
	vec2 diff = p - mouse;
	float dist = length(diff);
	if (dist > 0.0) p += (diff / dist) * exp(-dist * 3.0) * 0.1;

	float time = uTime * 0.5;
	vec2 q = vec2(fbm(p + time * 0.1), fbm(p + vec2(5.2, 1.3) + time * 0.15));
	vec2 r = vec2(
		fbm(p + 4.0 * q + vec2(1.7, 9.2) + time * 0.2),
		fbm(p + 4.0 * q + vec2(8.3, 2.8) + time * 0.25)
	);
	float f = fbm(p + r * 4.0 * uAmplitude);

	vec3 col = mix(uBase, uShadow, 1.0 - smoothstep(0.1, 0.3, f));
	col = mix(col, uSilver, smoothstep(0.4, 0.6, f));
	col = mix(col, uSpecular, smoothstep(0.6, 0.8, f));
	float v = 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
	col = mix(uShadow, col, 0.5 + 0.5 * pow(max(0.0, v), 0.2));

	col = clamp(col, 0.0, 1.0);
	col = mix(col, 1.0 - col, uInvert);
	gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

const UNIFORMS = ["uResolution", "uPointer", "uTime", "uAmplitude", "uInvert"] as const;
const COLORS = ["uShadow", "uBase", "uSilver", "uSpecular"] as const;

const STILL_TIME = 7.25;
const POINTER_EASE = 0.08;

/** Runs the chrome shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountLiquidChrome(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: LiquidChromeOptions,
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
			colors: (u, rgb) => uploadInvertible(u, rgb, COLORS, opts.colors),
			draw(u) {
				u.vec2("uPointer", pointer.x, pointer.y);
				u.float("uAmplitude", opts.amplitude);
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
		update(next: LiquidChromeOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
