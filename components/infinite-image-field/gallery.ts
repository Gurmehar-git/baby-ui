import type { InfiniteImageItem } from "./variants";

export type GalleryOptions = {
	/** Cell size in world units; the view is 2 units tall. */
	cellSize: number;
	/** How far the view pulls back while dragging; 1 disables it. */
	dragZoom: number;
	/** Barrel distortion strength; 0 is flat. */
	lens: number;
};

const TILE = 512;
const TEXT_W = 1024;
const TEXT_H = 96;
const EASE = 0.075;

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
	vUv = aPos * 0.5 + 0.5;
	gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// The hover tint path was unused, so it's left out.
const FRAGMENT = `
precision highp float;
uniform vec2 uOffset;
uniform vec2 uResolution;
uniform vec4 uBorder;
uniform vec3 uBackground;
uniform float uZoom;
uniform float uCellSize;
uniform float uCount;
uniform float uGrid;
uniform float uLens;
uniform sampler2D uImages;
uniform sampler2D uText;
varying vec2 vUv;

void main() {
	vec2 screen = (vUv - 0.5) * 2.0;
	float radius = length(screen);
	vec2 world = screen * (1.0 - uLens * radius * radius);
	world *= vec2(uResolution.x / uResolution.y, 1.0) * uZoom;
	world += uOffset;
	vec2 cellPos = world / uCellSize;
	vec2 cellId = floor(cellPos);
	vec2 cellUV = fract(cellPos);
	float index = mod(cellId.x + cellId.y * 3.0, uCount);
	vec2 atlas = vec2(mod(index, uGrid), floor(index / uGrid));

	vec3 color = uBackground;
	vec2 imageUV = (cellUV - 0.2) / 0.6;
	vec2 edge = smoothstep(-0.01, 0.01, imageUV) * smoothstep(-0.01, 0.01, 1.0 - imageUV);
	if (imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0) {
		vec2 uv = (atlas + vec2(imageUV.x, 1.0 - imageUV.y)) / uGrid;
		color = mix(color, texture2D(uImages, uv).rgb, edge.x * edge.y);
	}
	if (cellUV.x >= 0.05 && cellUV.x <= 0.95 && cellUV.y >= 0.08 && cellUV.y <= 0.16) {
		vec2 t = vec2((cellUV.x - 0.05) / 0.9, 1.0 - (cellUV.y - 0.08) / 0.08);
		vec4 text = texture2D(uText, (atlas + t) / uGrid);
		color = mix(color, text.rgb, text.a);
	}
	float line = 0.005;
	float grid = smoothstep(0.0, line, cellUV.x) * smoothstep(0.0, line, 1.0 - cellUV.x)
		* smoothstep(0.0, line, cellUV.y) * smoothstep(0.0, line, 1.0 - cellUV.y);
	color = mix(color, uBorder.rgb, (1.0 - grid) * uBorder.a);
	float fade = 1.0 - smoothstep(1.2, 1.8, radius);
	gl_FragColor = vec4(mix(uBackground, color, fade), 1.0);
}`;

/** Any CSS colour, including oklch and var() results, as 0 to 1 RGBA. */
function rgba(css: string): [number, number, number, number] {
	const probe = document.createElement("canvas");
	probe.width = probe.height = 1;
	const ctx = probe.getContext("2d", { willReadFrequently: true });
	if (!ctx) return [0, 0, 0, 1];
	ctx.fillStyle = css;
	ctx.fillRect(0, 0, 1, 1);
	const [r = 0, g = 0, b = 0, a = 255] = ctx.getImageData(0, 0, 1, 1).data;
	return [r / 255, g / 255, b / 255, a / 255];
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
	return new Promise((resolve) => {
		const image = new Image();
		if (/^https?:\/\//.test(src)) image.crossOrigin = "anonymous";
		image.onload = () => resolve(image);
		image.onerror = () => resolve(null);
		image.src = src;
	});
}

function atlasCanvas(cols: number, cellW: number, cellH: number) {
	const canvas = document.createElement("canvas");
	canvas.width = cols * cellW;
	canvas.height = cols * cellH;
	return canvas;
}

/** Renders an endless, draggable grid of items through a lens; idle unless it is moving. */
export function createGallery(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	items: InfiniteImageItem[],
	initial: GalleryOptions,
	onReady: (webgl: boolean) => void,
) {
	let opts = initial;
	const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
	if (!gl || !items.length) {
		onReady(false);
		return { update() {}, destroy() {} };
	}
	const context = gl;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const grid = Math.ceil(Math.sqrt(items.length));
	const offset = { x: 0, y: 0 };
	const target = { x: 0, y: 0 };
	let zoom = 1;
	let targetZoom = 1;
	let drag: { id: number; x: number; y: number } | null = null;
	let frame = 0;
	let destroyed = false;
	let ready = false;
	let textColor = "";

	const compile = (type: number, source: string) => {
		const shader = context.createShader(type);
		if (!shader) return null;
		context.shaderSource(shader, source);
		context.compileShader(shader);
		return shader;
	};
	const program = context.createProgram();
	const vs = compile(context.VERTEX_SHADER, VERTEX);
	const fs = compile(context.FRAGMENT_SHADER, FRAGMENT);
	if (!program || !vs || !fs) {
		onReady(false);
		return { update() {}, destroy() {} };
	}
	context.attachShader(program, vs);
	context.attachShader(program, fs);
	context.linkProgram(program);
	// biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook.
	context.useProgram(program);
	const buffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, buffer);
	context.bufferData(
		context.ARRAY_BUFFER,
		new Float32Array([-1, -1, 3, -1, -1, 3]),
		context.STATIC_DRAW,
	);
	const aPos = context.getAttribLocation(program, "aPos");
	context.enableVertexAttribArray(aPos);
	context.vertexAttribPointer(aPos, 2, context.FLOAT, false, 0, 0);
	const u = (name: string) => context.getUniformLocation(program, name);

	const texture = (unit: number, source: HTMLCanvasElement) => {
		const tex = context.createTexture();
		context.activeTexture(context.TEXTURE0 + unit);
		context.bindTexture(context.TEXTURE_2D, tex);
		context.texParameteri(
			context.TEXTURE_2D,
			context.TEXTURE_WRAP_S,
			context.CLAMP_TO_EDGE,
		);
		context.texParameteri(
			context.TEXTURE_2D,
			context.TEXTURE_WRAP_T,
			context.CLAMP_TO_EDGE,
		);
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
		context.texImage2D(
			context.TEXTURE_2D,
			0,
			context.RGBA,
			context.RGBA,
			context.UNSIGNED_BYTE,
			source,
		);
		return tex;
	};
	let imageTex: WebGLTexture | null = null;
	let textTex: WebGLTexture | null = null;

	const drawText = () => {
		const style = getComputedStyle(root);
		textColor = style.color;
		const atlas = atlasCanvas(grid, TEXT_W, TEXT_H);
		const ctx = atlas.getContext("2d");
		if (ctx) {
			ctx.font = `500 56px ${style.getPropertyValue("--font-mono") || "ui-monospace, monospace"}`;
			ctx.fillStyle = textColor;
			ctx.textBaseline = "middle";
			items.forEach((item, i) => {
				const x = (i % grid) * TEXT_W;
				const y = Math.floor(i / grid) * TEXT_H + TEXT_H / 2;
				ctx.textAlign = "left";
				ctx.fillText((item.title ?? item.alt).toUpperCase(), x + 16, y, TEXT_W * 0.7);
				ctx.textAlign = "right";
				if (item.caption) ctx.fillText(item.caption, x + TEXT_W - 16, y, TEXT_W * 0.25);
			});
		}
		if (textTex) context.deleteTexture(textTex);
		textTex = texture(1, atlas);
		context.uniform1i(u("uText"), 1);
	};

	const readColors = () => {
		const style = getComputedStyle(root);
		const [r, g, b] = rgba(style.backgroundColor);
		context.uniform3f(u("uBackground"), r, g, b);
		const border = rgba(style.borderTopColor);
		context.uniform4f(
			u("uBorder"),
			border[0],
			border[1],
			border[2],
			Math.max(border[3], 0.6),
		);
		context.clearColor(r, g, b, 1);
	};

	const render = () => {
		context.uniform2f(u("uOffset"), offset.x, offset.y);
		context.uniform1f(u("uZoom"), zoom);
		context.uniform1f(u("uCellSize"), opts.cellSize);
		context.uniform1f(u("uLens"), opts.lens);
		context.drawArrays(context.TRIANGLES, 0, 3);
	};

	const tick = () => {
		const ease = reduced.matches ? 1 : EASE;
		offset.x += (target.x - offset.x) * ease;
		offset.y += (target.y - offset.y) * ease;
		zoom += (targetZoom - zoom) * ease;
		render();
		const settled =
			Math.abs(target.x - offset.x) < 1e-4 &&
			Math.abs(target.y - offset.y) < 1e-4 &&
			Math.abs(targetZoom - zoom) < 1e-4;
		frame = settled && !drag ? 0 : requestAnimationFrame(tick);
	};
	const wake = () => {
		if (ready && !frame) frame = requestAnimationFrame(tick);
	};

	const resize = () => {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
		canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
		context.viewport(0, 0, canvas.width, canvas.height);
		context.uniform2f(u("uResolution"), canvas.width, canvas.height);
		if (ready) render();
	};

	// One screen pixel of drag moves the grid one pixel, at any size and zoom.
	const perPixel = () => (2 * zoom) / Math.max(1, root.clientHeight);
	const onDown = (e: PointerEvent) => {
		if (e.button !== 0) return;
		drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
		root.setPointerCapture(e.pointerId);
		if (!reduced.matches) targetZoom = opts.dragZoom;
		wake();
	};
	const onMove = (e: PointerEvent) => {
		if (!drag || e.pointerId !== drag.id) return;
		target.x -= (e.clientX - drag.x) * perPixel();
		target.y += (e.clientY - drag.y) * perPixel();
		drag.x = e.clientX;
		drag.y = e.clientY;
		wake();
	};
	const onUp = (e: PointerEvent) => {
		if (!drag || e.pointerId !== drag.id) return;
		drag = null;
		targetZoom = 1;
		wake();
	};
	const KEYS: Record<string, [number, number]> = {
		ArrowLeft: [-1, 0],
		ArrowRight: [1, 0],
		ArrowUp: [0, 1],
		ArrowDown: [0, -1],
	};
	const onKey = (e: KeyboardEvent) => {
		const step = KEYS[e.key];
		if (!step) return;
		e.preventDefault();
		target.x += step[0] * opts.cellSize;
		target.y += step[1] * opts.cellSize;
		wake();
	};

	const observer = new ResizeObserver(resize);
	observer.observe(root);
	// Theme switches repaint the background, grid lines and caption colour.
	const theme = new MutationObserver(() => {
		if (!ready) return;
		readColors();
		if (getComputedStyle(root).color !== textColor) drawText();
		render();
	});
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style"],
	});
	root.addEventListener("pointerdown", onDown);
	root.addEventListener("pointermove", onMove);
	root.addEventListener("pointerup", onUp);
	root.addEventListener("pointercancel", onUp);
	root.addEventListener("keydown", onKey);

	void Promise.all(items.map((item) => loadImage(item.src))).then((images) => {
		if (destroyed) return;
		const atlas = atlasCanvas(grid, TILE, TILE);
		const ctx = atlas.getContext("2d");
		images.forEach((image, i) => {
			if (!ctx || !image) return;
			// Cover-crop to a square so portrait and landscape images keep their proportions.
			const side = Math.min(image.naturalWidth, image.naturalHeight);
			const sx = (image.naturalWidth - side) / 2;
			const sy = (image.naturalHeight - side) / 2;
			ctx.drawImage(
				image,
				sx,
				sy,
				side,
				side,
				(i % grid) * TILE,
				Math.floor(i / grid) * TILE,
				TILE,
				TILE,
			);
		});
		imageTex = texture(0, atlas);
		context.uniform1i(u("uImages"), 0);
		context.uniform1f(u("uCount"), items.length);
		context.uniform1f(u("uGrid"), grid);
		drawText();
		readColors();
		ready = true;
		resize();
		render();
		onReady(true);
	});

	return {
		update(next: GalleryOptions) {
			opts = next;
			if (ready) render();
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			observer.disconnect();
			theme.disconnect();
			root.removeEventListener("pointerdown", onDown);
			root.removeEventListener("pointermove", onMove);
			root.removeEventListener("pointerup", onUp);
			root.removeEventListener("pointercancel", onUp);
			root.removeEventListener("keydown", onKey);
			context.deleteTexture(imageTex);
			context.deleteTexture(textTex);
			context.deleteBuffer(buffer);
			context.deleteProgram(program);
			context.getExtension("WEBGL_lose_context")?.loseContext();
		},
	};
}
