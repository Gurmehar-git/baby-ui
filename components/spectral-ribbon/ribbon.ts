import { mountShader, uploadInvertible } from "../lib/shader";
export type SpectralRibbonOptions = {
	/** Surface, core, then five fringe CSS colours; var() and color-mix() resolve against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Ribbon brightness, 0.25 to 2. */
	intensity: number;
	/** Ribbon thickness, 0.5 to 2. */
	thickness: number;
	/** Film grain, 0 to 1. */
	grain: number;
};

// The fringe and core take token colours.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
uniform float uThickness;
uniform float uGrain;
uniform float uInvert;
uniform vec3 uBase;
uniform vec3 uCore;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
	float v = 0.0;
	float a = 0.5;
	mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
	for (int i = 0; i < 4; i++) {
		v += a * noise(p);
		p = m * p * 2.02;
		a *= 0.5;
	}
	return v;
}

// A C-shaped trail: enters bottom left, arcs up right, falls away.
vec2 ribbonPoint(float s, float time) {
	float sway = sin(time * 0.42 + s * 2.1) * 0.055;
	float lift = cos(time * 0.31 - s * 1.5) * 0.04;
	float x = mix(-1.2, 0.95, s) + sway * (0.55 + s * 0.5);
	float y = mix(-0.72, -0.55, s)
		+ sin(s * 2.85 + 0.35) * 0.92
		+ cos(s * 1.15) * 0.12
		- pow(max(s - 0.55, 0.0), 2.0) * 1.15
		+ lift;
	return vec2(x, y);
}

vec3 prism(float across, float along) {
	float h = clamp(0.5 + across * 0.52 + along * 0.18, 0.0, 1.0);
	vec3 c = mix(uColor0, uColor1, smoothstep(0.0, 0.28, h));
	c = mix(c, uColor2, smoothstep(0.22, 0.48, h));
	c = mix(c, uColor3, smoothstep(0.42, 0.68, h));
	c = mix(c, uColor4, smoothstep(0.62, 0.95, h));
	return mix(c, uColor4, smoothstep(0.2, 0.9, across) * 0.35);
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float aspect = uResolution.x / max(uResolution.y, 1.0);
	vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
	float portrait = 1.0 - smoothstep(0.85, 1.35, aspect);
	p *= mix(1.0, 1.32, portrait);
	float time = uTime;

	float warp = fbm(p * 1.2 + vec2(time * 0.1, -time * 0.07));
	p += (warp - 0.5) * 0.14;

	float minDist = 1e5;
	float closestT = 0.0;
	float side = 0.0;
	vec2 prev = ribbonPoint(0.0, time);
	for (int i = 1; i <= 56; i++) {
		float s = float(i) / 56.0;
		vec2 cur = ribbonPoint(s, time);
		vec2 pa = p - prev;
		vec2 ba = cur - prev;
		float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
		float d = length(p - (prev + ba * h));
		if (d < minDist) {
			minDist = d;
			closestT = mix(s - 1.0 / 56.0, s, h);
			side = pa.x * ba.y - pa.y * ba.x;
		}
		prev = cur;
	}

	float thick = 0.055 * uThickness;
	float across = clamp((minDist * sign(side)) / (thick * 2.8), -1.2, 1.2);
	float core = exp(-pow(minDist / (thick * 0.7), 2.0));
	float body = exp(-pow(minDist / (thick * 1.8), 2.0));
	float bloom = exp(-pow(minDist / (thick * 4.2), 2.0));
	float haze = exp(-pow(minDist / (thick * 7.5), 2.0));

	vec3 spectral = prism(across, closestT);
	spectral = mix(uCore, spectral, smoothstep(0.0, 0.55, abs(across)));
	float hot = exp(-closestT * 4.5) * pow(core, 0.85);

	vec3 col = spectral * (body * 0.55 + bloom * 0.85 + haze * 0.4);
	col += spectral * core * 0.35;
	col += uCore * hot * 1.1;
	col *= uIntensity * 1.15;
	float mask = clamp(body * 0.7 + bloom + haze * 0.55 + hot, 0.0, 1.6);
	col = uBase + col * mask;

	col = clamp(col, 0.0, 1.0);
	col = mix(col, 1.0 - col, uInvert);
	vec3 srgb = pow(col, vec3(1.0 / 2.2));
	srgb += (hash(gl_FragCoord.xy + time * 40.0) - 0.5) * 0.06 * uGrain * mask;
	gl_FragColor = vec4(clamp(srgb, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = [
	"uResolution",
	"uTime",
	"uIntensity",
	"uThickness",
	"uGrain",
	"uInvert",
] as const;
const COLORS = [
	"uBase",
	"uCore",
	"uColor0",
	"uColor1",
	"uColor2",
	"uColor3",
	"uColor4",
] as const;

const STILL_TIME = 7.25;

/** Runs the ribbon shader on `canvas`; `onReady(false)` means WebGL is missing or lost. */
export function mountSpectralRibbon(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: SpectralRibbonOptions,
	onReady: (webgl: boolean) => void,
) {
	let opts = initial;
	const shader = mountShader(
		root,
		canvas,
		{
			fragment: FRAGMENT,
			uniforms: [...UNIFORMS, ...COLORS],
			stillTime: STILL_TIME,
			colors: (u, rgb) => uploadInvertible(u, rgb, COLORS, opts.colors),
			draw(u) {
				u.float("uIntensity", opts.intensity);
				u.float("uThickness", opts.thickness);
				u.float("uGrain", opts.grain);
			},
			step: (dt) => dt * opts.speed,
		},
		onReady,
	);

	return {
		update(next: SpectralRibbonOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			shader.refresh(recolor);
		},
		destroy: shader.destroy,
	};
}
