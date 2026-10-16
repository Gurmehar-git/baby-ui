import {
	type InfiniteImageFieldLayout,
	type InfiniteImageFieldShape,
	SHAPE_RADIUS,
} from "./variants";

export type FieldOptions = {
	images: string[];
	shape: InfiniteImageFieldShape;
	layout: InfiniteImageFieldLayout;
	/** Tile size in CSS px. */
	imageWidth: number;
	imageHeight: number;
	/** Space between tiles in CSS px. */
	gap: number;
	/** Top drift speed in CSS px per frame at 60fps. */
	maxSpeed: number;
	/** How quickly the drift follows the pointer, 0 to 1 per frame. */
	smoothing: number;
};

const DEAD_ZONE = 0.12;
const REST = 0.01;
const KEYS: Record<string, [number, number]> = {
	ArrowLeft: [-1, 0],
	ArrowRight: [1, 0],
	ArrowUp: [0, -1],
	ArrowDown: [0, 1],
};

function coverCrop(
	ctx: CanvasRenderingContext2D,
	image: HTMLImageElement,
	x: number,
	y: number,
	w: number,
	h: number,
) {
	const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
	const sw = w / scale;
	const sh = h / scale;
	ctx.drawImage(
		image,
		(image.naturalWidth - sw) / 2,
		(image.naturalHeight - sh) / 2,
		sw,
		sh,
		x,
		y,
		w,
		h,
	);
}

/** Remaps pointer offset from the centre to -1..1 with a resting dead zone in the middle. */
function steer(value: number) {
	const magnitude = Math.max(0, Math.abs(value) - DEAD_ZONE) / (1 - DEAD_ZONE);
	return Math.sign(value) * Math.min(1, magnitude);
}

/**
 * An endless field of image tiles that drifts toward the pointer's side of the centre. The loop
 * stops once the drift settles, offscreen or in a hidden tab.
 */
export function mountField(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: FieldOptions,
): { update: (next: FieldOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let options = initial;
	let images: (HTMLImageElement | null)[] = [];
	let sources = "";
	let muted = "";
	let border = "";
	let width = 0;
	let height = 0;
	const cam = { x: 0, y: 0 };
	const velocity = { x: 0, y: 0 };
	let pointer: { x: number; y: number } | null = null;
	const held = new Set<string>();
	let visible = true;
	let destroyed = false;
	let frame = 0;
	let last = 0;

	const cellW = () => Math.max(20, options.imageWidth) + Math.max(0, options.gap);
	const cellH = () => Math.max(20, options.imageHeight) + Math.max(0, options.gap);

	const layout = () => {
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const style = getComputedStyle(container);
		muted = style.getPropertyValue("--muted").trim() || style.color;
		border = style.getPropertyValue("--border").trim() || style.color;
	};

	const draw = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		const count = options.images.length;
		if (!count || !width || !height) return;
		const iw = Math.max(20, options.imageWidth);
		const ih = Math.max(20, options.imageHeight);
		const cw = cellW();
		const ch = cellH();
		const radius = SHAPE_RADIUS[options.shape] * Math.min(iw, ih);
		const stagger = options.layout === "staggered";
		const c0 = Math.floor((cam.x - width / 2) / cw) - 1;
		const c1 = Math.ceil((cam.x + width / 2) / cw) + 1;
		const r0 = Math.floor((cam.y - height / 2) / ch) - 2;
		const r1 = Math.ceil((cam.y + height / 2) / ch) + 1;
		ctx.lineWidth = 1;
		for (let col = c0; col <= c1; col++) {
			const shift = stagger && col % 2 !== 0 ? ch / 2 : 0;
			for (let row = r0; row <= r1; row++) {
				const x = col * cw - cam.x + width / 2 - iw / 2;
				const y = row * ch + shift - cam.y + height / 2 - ih / 2;
				if (x > width || y > height || x + iw < 0 || y + ih < 0) continue;
				// Same cell, same image: the index is a pure function of the cell.
				const index = Math.abs(col * 7 + row * 13 + col * row * 3) % count;
				const image = images[index];
				ctx.save();
				ctx.beginPath();
				ctx.roundRect(x, y, iw, ih, radius);
				ctx.clip();
				ctx.fillStyle = muted;
				ctx.fillRect(x, y, iw, ih);
				if (image?.complete && image.naturalWidth > 0)
					coverCrop(ctx, image, x, y, iw, ih);
				ctx.restore();
				ctx.strokeStyle = border;
				ctx.beginPath();
				ctx.roundRect(x + 0.5, y + 0.5, iw - 1, ih - 1, radius);
				ctx.stroke();
			}
		}
	};

	const target = () => {
		let tx = 0;
		let ty = 0;
		if (pointer && width && height) {
			tx = steer((pointer.x / width - 0.5) * 2);
			ty = steer((pointer.y / height - 0.5) * 2);
		}
		for (const key of held) {
			const dir = KEYS[key];
			if (dir) {
				tx += dir[0];
				ty += dir[1];
			}
		}
		const speed = Math.max(0, options.maxSpeed);
		return {
			x: Math.max(-1, Math.min(1, tx)) * speed,
			y: Math.max(-1, Math.min(1, ty)) * speed,
		};
	};

	const running = () => visible && !document.hidden && !reduced.matches;

	const tick = (now: number) => {
		frame = 0;
		const dt = (last ? Math.min(50, now - last) : 16.667) / 16.667;
		last = now;
		const aim = target();
		const follow = 1 - (1 - Math.min(1, Math.max(0.001, options.smoothing))) ** dt;
		velocity.x += (aim.x - velocity.x) * follow;
		velocity.y += (aim.y - velocity.y) * follow;
		const idle = aim.x === 0 && aim.y === 0;
		if (idle && Math.hypot(velocity.x, velocity.y) < REST) velocity.x = velocity.y = 0;
		cam.x += velocity.x * dt;
		cam.y += velocity.y * dt;
		draw();
		const moving = !idle || velocity.x !== 0 || velocity.y !== 0;
		if (moving && running()) frame = requestAnimationFrame(tick);
		else last = 0;
	};

	const wake = () => {
		if (!running()) return;
		if (!frame) frame = requestAnimationFrame(tick);
	};

	const loadImages = () => {
		const key = options.images.join("\n");
		if (key === sources) return;
		sources = key;
		images = options.images.map(() => null);
		options.images.forEach((src, index) => {
			const image = new Image();
			image.decoding = "async";
			image.onload = () => {
				if (destroyed || key !== sources) return;
				images[index] = image;
				if (!frame) draw();
			};
			image.src = src;
		});
	};

	const onMove = (event: PointerEvent) => {
		if (event.pointerType !== "mouse") return;
		const box = container.getBoundingClientRect();
		pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
		wake();
	};
	const onLeave = () => {
		pointer = null;
		wake();
	};
	const onKeyDown = (event: KeyboardEvent) => {
		const dir = KEYS[event.key];
		if (!dir) return;
		event.preventDefault();
		if (reduced.matches) {
			cam.x += dir[0] * cellW();
			cam.y += dir[1] * cellH();
			draw();
			return;
		}
		held.add(event.key);
		wake();
	};
	const onKeyUp = (event: KeyboardEvent) => {
		if (held.delete(event.key)) wake();
	};
	const onBlur = () => {
		held.clear();
		wake();
	};
	const onResize = () => {
		if (destroyed) return;
		layout();
		draw();
	};
	const onVisible = () => {
		draw();
		wake();
	};

	container.addEventListener("pointermove", onMove);
	container.addEventListener("pointerleave", onLeave);
	container.addEventListener("keydown", onKeyDown);
	container.addEventListener("keyup", onKeyUp);
	container.addEventListener("blur", onBlur);
	const resize = new ResizeObserver(onResize);
	resize.observe(container);
	// Theme switches change the placeholder and border tokens; repaint with them.
	const theme = new MutationObserver(onResize);
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style", "data-theme"],
	});
	const intersection = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? false;
		onVisible();
	});
	intersection.observe(container);
	document.addEventListener("visibilitychange", onVisible);
	reduced.addEventListener("change", onVisible);
	layout();
	loadImages();

	return {
		update(next) {
			options = next;
			loadImages();
			draw();
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			container.removeEventListener("pointermove", onMove);
			container.removeEventListener("pointerleave", onLeave);
			container.removeEventListener("keydown", onKeyDown);
			container.removeEventListener("keyup", onKeyUp);
			container.removeEventListener("blur", onBlur);
			resize.disconnect();
			theme.disconnect();
			intersection.disconnect();
			document.removeEventListener("visibilitychange", onVisible);
			reduced.removeEventListener("change", onVisible);
		},
	};
}
