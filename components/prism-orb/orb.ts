// Structural twins of the public shader engine's types: shared files are copied verbatim into
// the Svelte port, so they cannot reach the engine by a relative path.
type Rgb = [number, number, number];
type Setters = {
	float(name: string, value: number): void;
	vec2(name: string, x: number, y: number): void;
	vec3(name: string, x: number, y: number, z: number): void;
};

export type PrismOrbOptions = {
	/** Three CSS colours: base, band, highlight; var() resolves against the root. */
	colors: readonly string[];
	/** Time multiplier. */
	speed: number;
	/** Colour strength, 0 (flat base) to 1. */
	intensity: number;
	/** Film grain, 0 to 1. */
	grain: number;
};

// Prism bands swirl behind a glass sphere; inside it each channel samples the bands at a
// slightly different refraction, which is the chromatic dispersion at the rim.
const FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGrain;
uniform float uIntensity;
uniform vec2 uLean;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 bands(vec2 uv, float t) {
	for (int i = 1; i <= 6; i++) {
		float fi = float(i);
		uv.x += 0.45 / fi * cos(t + fi * 1.4 * uv.y);
		uv.y += 0.45 / fi * cos(t + fi * uv.x);
	}
	float m = 0.5 + 0.5 * sin(uv.x * 2.1) * cos(uv.y * 2.1) - 0.3;
	float r1 = smoothstep(0.18, 0.52, m);
	float r2 = smoothstep(0.5, 0.86, m);
	return mix(mix(uColor0, uColor1, r1), uColor2, r2 * 0.85);
}

void main() {
	vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
	float t = 0.5 * uTime;
	vec2 buv = p * 1.6 + 0.5;
	vec3 col = bands(buv, t);

	vec2 center = vec2(0.16 * sin(t * 0.37), 0.07 * cos(t * 0.29)) + uLean * 0.1;
	float radius = 0.33;
	vec2 d = (p - center) / radius;
	float r = length(d);

	if (r < 1.0) {
		float z = sqrt(1.0 - r * r);
		vec2 off = d * (1.0 - z) * 0.55;
		float cr = bands(buv - off, t).r;
		float cg = bands(buv - off * 1.12, t).g;
		float cb = bands(buv - off * 1.24, t).b;
		vec3 glass = vec3(cr, cg, cb);
		float fresnel = pow(1.0 - z, 3.0);
		glass = mix(glass, uColor2, fresnel * 0.45);
		vec3 n = normalize(vec3(d, z));
		float spec = pow(max(dot(n, normalize(vec3(-0.45, 0.55, 1.0))), 0.0), 48.0);
		glass = mix(glass, uColor2, spec * 0.6);
		col = mix(col, glass, smoothstep(1.0, 0.985, r));
	} else {
		col = mix(col, uColor0, 0.12 * smoothstep(1.3, 1.0, r));
	}

	col = mix(uColor0, col, uIntensity);
	float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.0) - 0.5;
	col += grain * uGrain * 0.16;
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const COLORS = ["uColor0", "uColor1", "uColor2"] as const;
const START_TIME = -1.4;
// Ambient motion: 30fps reads the same and halves the GPU work.
const FRAME_MS = 1000 / 30 - 1;
const BASE_SPEED = 1.2;

/** The prism-orb scene for the shader engine, plus `set` to feed option changes. */
export function createPrismOrb(initial: PrismOrbOptions) {
	let opts = initial;
	const lean = { x: 0, y: 0 };
	const target = { x: 0, y: 0 };
	// Touch has no hover, so a lean would only jump to the last tap.
	const fine = matchMedia("(pointer: fine)").matches;

	const scene = {
		fragment: FRAGMENT,
		uniforms: ["uGrain", "uIntensity", "uLean", ...COLORS],
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
			u.vec2("uLean", lean.x, lean.y);
		},
		step(dt: number) {
			lean.x += (target.x - lean.x) * Math.min(dt * 2, 1);
			lean.y += (target.y - lean.y) * Math.min(dt * 2, 1);
			return dt * opts.speed * BASE_SPEED;
		},
		moving: () => opts.speed > 0,
		still() {
			lean.x = lean.y = target.x = target.y = 0;
		},
		pointer: fine
			? (x: number, y: number, inside: boolean) => {
					target.x = inside ? x - 0.5 : 0;
					target.y = inside ? y - 0.5 : 0;
				}
			: undefined,
	};

	return {
		scene,
		/** Applies new options; true when the colours changed and must be re-read. */
		set(next: PrismOrbOptions) {
			const recolor = next.colors.join() !== opts.colors.join();
			opts = next;
			return recolor;
		},
	};
}
