import { watchSurface } from "./surface";

/** Uniform setters a scene draws with; a name the shader optimised away is a no-op. */
export type Uniforms<N extends string> = {
	float(name: N, value: number): void;
	vec2(name: N, x: number, y: number): void;
	vec3(name: N, x: number, y: number, z: number): void;
};

type Rgb = [number, number, number];

/** One full-screen fragment shader plus the state that feeds it; `mountShader` runs the rest. */
export type ShaderScene<N extends string> = {
	fragment: string;
	/** Every uniform the scene sets; `uTime` and `uResolution` are set by the runtime. */
	uniforms: readonly N[];
	context?: WebGLContextAttributes;
	/** Shader time of the first frame and of the reduced-motion still frame. */
	stillTime: number;
	/** Minimum ms between drawn frames; skipped frames keep the loop alive without drawing. */
	frameMs?: number;
	/** Uploads colour uniforms; `rgb` resolves any CSS colour to 0..1 sRGB channels. */
	colors(u: Uniforms<N>, rgb: (css: string) => Rgb): void;
	/** Per-frame uniforms other than `uTime`. */
	draw(u: Uniforms<N>, reducedMotion: boolean): void;
	/** Advances scene state by `dt` real seconds and returns the shader-time step. */
	step(dt: number): number;
	/** False keeps the loop paused while on screen, e.g. at speed 0. */
	moving?(): boolean;
	/** Resets scene state for the reduced-motion still frame. */
	still?(): void;
	/** Uniforms that depend on size, beyond `uResolution`. */
	resize?(u: Uniforms<N>, dpr: number): void;
	/** Window pointer in 0..1 (y up) and whether it is over the element. */
	pointer?(x: number, y: number, inside: boolean): void;
};

export type ShaderHandle = {
	/** Redraw after an options change; `recolor` re-reads the colour uniforms first. */
	refresh(recolor: boolean): void;
	destroy(): void;
};

const VERTEX = `
attribute vec2 aPos;
void main() {
	gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const DEFAULT_CONTEXT: WebGLContextAttributes = {
	alpha: false,
	antialias: false,
	depth: false,
};

/** sRGB channel (0..1) to linear light. */
export function linear(channel: number): number {
	return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** Colours for shaders tuned on a dark surface: light themes render inverted and flip back
 * through `uInvert`. Channels go in linear light; unset colours fall back to the foreground. */
export function uploadInvertible<N extends string>(
	u: Uniforms<N | "uInvert">,
	rgb: (css: string) => Rgb,
	names: readonly N[],
	colors: readonly string[],
) {
	const [r, g, b] = rgb("var(--background)").map(linear) as Rgb;
	const invert = 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.2;
	u.float("uInvert", invert ? 1 : 0);
	names.forEach((name, i) => {
		const c = rgb(colors[i] ?? "var(--foreground)").map(linear);
		const [x = 0, y = 0, z = 0] = invert ? c.map((v) => 1 - v) : c;
		u.vec3(name, x, y, z);
	});
}

/** Runs `scene` sized to `root`: loops only on screen with motion allowed, else a still frame;
 * handles DPR, context loss and theme recolour. `onReady(false)` means no WebGL. */
export function mountShader<N extends string>(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	scene: ShaderScene<N>,
	onReady: (webgl: boolean) => void,
): ShaderHandle {
	const gl = canvas.getContext("webgl", scene.context ?? DEFAULT_CONTEXT);
	if (!gl) {
		onReady(false);
		return { refresh() {}, destroy() {} };
	}
	const context = gl;
	const pixel = document.createElement("canvas");
	pixel.width = pixel.height = 1;
	const pen = pixel.getContext("2d", { willReadFrequently: true });
	const loc = new Map<string, WebGLUniformLocation | null>();
	let program: WebGLProgram | null = null;
	let buffer: WebGLBuffer | null = null;
	let shaders: WebGLShader[] = [];
	let ready = false;
	let frame = 0;
	let last = 0;
	let time = scene.stillTime;

	const u: Uniforms<N | "uTime" | "uResolution"> = {
		float: (name, v) => context.uniform1f(loc.get(name) ?? null, v),
		vec2: (name, x, y) => context.uniform2f(loc.get(name) ?? null, x, y),
		vec3: (name, x, y, z) => context.uniform3f(loc.get(name) ?? null, x, y, z),
	};

	const release = () => {
		for (const shader of shaders) context.deleteShader(shader);
		context.deleteProgram(program);
		context.deleteBuffer(buffer);
		shaders = [];
		program = null;
		buffer = null;
	};

	const compile = (type: number, source: string) => {
		const shader = context.createShader(type);
		if (!shader) return false;
		shaders.push(shader);
		context.shaderSource(shader, source);
		context.compileShader(shader);
		return context.getShaderParameter(shader, context.COMPILE_STATUS) === true;
	};

	const build = () => {
		program = context.createProgram();
		buffer = context.createBuffer();
		if (
			!program ||
			!buffer ||
			!compile(context.VERTEX_SHADER, VERTEX) ||
			!compile(context.FRAGMENT_SHADER, scene.fragment)
		) {
			release();
			return false;
		}
		for (const shader of shaders) context.attachShader(program, shader);
		context.linkProgram(program);
		if (!context.getProgramParameter(program, context.LINK_STATUS)) {
			release();
			return false;
		}
		// biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook.
		context.useProgram(program);
		context.bindBuffer(context.ARRAY_BUFFER, buffer);
		context.bufferData(
			context.ARRAY_BUFFER,
			new Float32Array([-1, -1, 3, -1, -1, 3]),
			context.STATIC_DRAW,
		);
		const aPos = context.getAttribLocation(program, "aPos");
		context.enableVertexAttribArray(aPos);
		context.vertexAttribPointer(aPos, 2, context.FLOAT, false, 0, 0);
		loc.clear();
		for (const name of ["uTime", "uResolution", ...scene.uniforms]) {
			loc.set(name, context.getUniformLocation(program, name));
		}
		return true;
	};

	// The canvas doubles as the probe, so var() resolves inside any scoped theme.
	const rgb = (css: string): Rgb => {
		canvas.style.color = css;
		const computed = getComputedStyle(canvas).color;
		canvas.style.color = "";
		if (!pen) return [0, 0, 0];
		pen.clearRect(0, 0, 1, 1);
		pen.fillStyle = computed;
		pen.fillRect(0, 0, 1, 1);
		const [r = 0, g = 0, b = 0] = pen.getImageData(0, 0, 1, 1).data;
		return [r / 255, g / 255, b / 255];
	};

	const readColors = () => scene.colors(u, rgb);

	const draw = () => {
		u.float("uTime", time);
		scene.draw(u, surface.reducedMotion());
		context.drawArrays(context.TRIANGLES, 0, 3);
	};

	const live = () => ready && surface.live() && (scene.moving?.() ?? true);
	const tick = (now: number) => {
		if (scene.frameMs && now - last < scene.frameMs) {
			frame = live() ? requestAnimationFrame(tick) : 0;
			return;
		}
		time += scene.step(Math.min((now - last) / 1000, 0.05));
		last = now;
		draw();
		frame = live() ? requestAnimationFrame(tick) : 0;
	};
	const sync = () => {
		if (live()) {
			if (!frame) {
				last = performance.now();
				frame = requestAnimationFrame(tick);
			}
			return;
		}
		cancelAnimationFrame(frame);
		frame = 0;
		if (ready && surface.reducedMotion()) {
			time = scene.stillTime;
			scene.still?.();
			draw();
		}
	};
	const redraw = () => {
		if (ready && !frame) draw();
	};

	const resize = () => {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
		canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
		if (!ready) return;
		context.viewport(0, 0, canvas.width, canvas.height);
		u.vec2("uResolution", canvas.width, canvas.height);
		scene.resize?.(u, dpr);
		redraw();
	};

	const start = () => {
		ready = build();
		if (!ready) {
			onReady(false);
			return;
		}
		readColors();
		resize();
		draw();
		onReady(true);
		sync();
	};

	const onLost = (e: Event) => {
		e.preventDefault();
		ready = false;
		cancelAnimationFrame(frame);
		frame = 0;
		shaders = [];
		program = null;
		buffer = null;
		onReady(false);
	};

	const surface = watchSurface(root, {
		resize,
		theme() {
			if (!ready) return;
			readColors();
			redraw();
		},
		wake: sync,
		// Window-level so a `fixed` background under page content still tracks the pointer.
		pointer: scene.pointer && {
			scope: "window",
			move(x, y, box) {
				const nx = x / box.width;
				const ny = 1 - y / box.height;
				scene.pointer?.(nx, ny, nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1);
			},
		},
	});
	canvas.addEventListener("webglcontextlost", onLost);
	canvas.addEventListener("webglcontextrestored", start);
	start();

	return {
		refresh(recolor) {
			if (!ready) return;
			if (recolor) readColors();
			redraw();
			sync();
		},
		destroy() {
			ready = false;
			cancelAnimationFrame(frame);
			frame = 0;
			surface.destroy();
			canvas.removeEventListener("webglcontextlost", onLost);
			canvas.removeEventListener("webglcontextrestored", start);
			release();
		},
	};
}
