import type { InfiniteImageItem } from "./variants";

export type FisheyeOptions = {
	items: InfiniteImageItem[];
	/** Card frames with a title and caption row; off shows bare images. */
	captions: boolean;
	/** Tile size in CSS px at the edge of the lens. */
	tileWidth: number;
	tileHeight: number;
	/** Space between tiles in CSS px. */
	gap: number;
	/** Extra magnification at the centre; 0 is a flat grid. */
	lens: number;
	/** Momentum kept after a drag, 0 to 0.98. */
	inertia: number;
};

type Palette = {
	card: string;
	border: string;
	muted: string;
	text: string;
	font: string;
};

const KEY_EASE = 0.18;
const REST = 0.004;
const KEYS: Record<string, [number, number]> = {
	ArrowLeft: [1, 0],
	ArrowRight: [-1, 0],
	ArrowUp: [0, 1],
	ArrowDown: [0, -1],
};

/** Sarkar-Brown graphical fisheye on one axis: magnifies the centre, linear past the edge. */
function lensAxis(d: number, half: number, k: number) {
	const u = Math.abs(d) / half;
	const g = u <= 1 ? ((k + 1) * u) / (k * u + 1) : 1 + (u - 1) / (k + 1);
	return Math.sign(d) * g * half;
}

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

function stride(count: number) {
	if (count > 3 && count % 3 !== 0) return 3;
	if (count > 2 && count % 2 !== 0) return 2;
	return 1;
}

/**
 * Draws an endless tile grid through a fisheye lens. Drag pans with inertia and arrow keys
 * glide one cell; the loop stops once nothing moves, offscreen or in a hidden tab.
 */
export function mountFisheye(
	container: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: FisheyeOptions,
): { update: (next: FisheyeOptions) => void; destroy: () => void } {
	const ctx = canvas.getContext("2d");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let options = initial;
	let images: (HTMLImageElement | null)[] = [];
	let sources = "";
	let palette: Palette = { card: "", border: "", muted: "", text: "", font: "monospace" };
	let width = 0;
	let height = 0;
	const pos = { x: 0, y: 0 };
	const velocity = { x: 0, y: 0 };
	const pending = { x: 0, y: 0 };
	let drag: { id: number; x: number; y: number; t: number } | null = null;
	let visible = true;
	let destroyed = false;
	let frame = 0;
	let last = 0;

	const cellW = () => Math.max(40, options.tileWidth) + Math.max(0, options.gap);
	const cellH = () => Math.max(40, options.tileHeight) + Math.max(0, options.gap);
	const lens = () => Math.max(0, options.lens);

	const readPalette = () => {
		const style = getComputedStyle(container);
		const read = (name: string) => style.getPropertyValue(name).trim() || style.color;
		palette = {
			card: read("--card"),
			border: read("--border"),
			muted: read("--muted"),
			text: read("--muted-foreground"),
			font: style.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace",
		};
	};

	const layout = () => {
		if (!ctx) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = container.clientWidth;
		height = container.clientHeight;
		canvas.width = Math.max(1, Math.round(width * dpr));
		canvas.height = Math.max(1, Math.round(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		readPalette();
	};

	const drawTile = (
		item: InfiniteImageItem,
		image: HTMLImageElement | null | undefined,
		x: number,
		y: number,
		w: number,
		h: number,
	) => {
		if (!ctx) return;
		const ready = image?.complete && image.naturalWidth > 0;
		if (!options.captions) {
			ctx.fillStyle = palette.muted;
			ctx.fillRect(x, y, w, h);
			if (ready && image) coverCrop(ctx, image, x, y, w, h);
			return;
		}
		ctx.fillStyle = palette.card;
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = palette.border;
		ctx.lineWidth = 1;
		ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
		const inset = Math.max(4, w * 0.06);
		const footer = Math.max(14, h * 0.13);
		const iw = w - inset * 2;
		const ih = h - inset * 2 - footer;
		if (iw <= 0 || ih <= 0) return;
		ctx.fillStyle = palette.muted;
		ctx.fillRect(x + inset, y + inset, iw, ih);
		if (ready && image) coverCrop(ctx, image, x + inset, y + inset, iw, ih);
		const size = Math.max(7, Math.round(w * 0.045));
		const baseline = y + h - inset - footer / 2 + size * 0.1;
		ctx.font = `600 ${size}px ${palette.font}`;
		ctx.fillStyle = palette.text;
		ctx.textBaseline = "middle";
		ctx.textAlign = "left";
		ctx.fillText((item.title ?? item.alt).toUpperCase(), x + inset, baseline, iw * 0.7);
		if (item.caption) {
			ctx.textAlign = "right";
			ctx.fillText(item.caption, x + w - inset, baseline, iw * 0.25);
		}
	};

	const draw = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		const count = options.items.length;
		if (!count || !width || !height) return;
		const cw = cellW();
		const ch = cellH();
		const tw = cw - Math.max(0, options.gap);
		const th = ch - Math.max(0, options.gap);
		const hx = width / 2;
		const hy = height / 2;
		const k = lens();
		const jump = stride(count);
		const c0 = Math.floor((-hx - pos.x) / cw) - 1;
		const c1 = Math.ceil((hx - pos.x) / cw);
		const r0 = Math.floor((-hy - pos.y) / ch) - 1;
		const r1 = Math.ceil((hy - pos.y) / ch);
		for (let r = r0; r <= r1; r++) {
			const top = hy + lensAxis(r * ch + pos.y - th / 2, hy, k);
			const bottom = hy + lensAxis(r * ch + pos.y + th / 2, hy, k);
			for (let c = c0; c <= c1; c++) {
				const left = hx + lensAxis(c * cw + pos.x - tw / 2, hx, k);
				const right = hx + lensAxis(c * cw + pos.x + tw / 2, hx, k);
				const index = (((c + r * jump) % count) + count) % count;
				const item = options.items[index];
				if (item) drawTile(item, images[index], left, top, right - left, bottom - top);
			}
		}
	};

	const running = () => visible && !document.hidden;

	const tick = (now: number) => {
		frame = 0;
		const dt = last ? Math.min(32, now - last) : 16;
		last = now;
		let moving = false;
		if (!drag && (velocity.x || velocity.y)) {
			pos.x += velocity.x * dt;
			pos.y += velocity.y * dt;
			const decay = Math.min(0.98, Math.max(0, options.inertia)) ** (dt / 16.667);
			velocity.x *= decay;
			velocity.y *= decay;
			if (Math.hypot(velocity.x, velocity.y) < REST) velocity.x = velocity.y = 0;
			else moving = true;
		}
		if (pending.x || pending.y) {
			const ease = 1 - (1 - KEY_EASE) ** (dt / 16.667);
			const sx = Math.abs(pending.x) < 0.5 ? pending.x : pending.x * ease;
			const sy = Math.abs(pending.y) < 0.5 ? pending.y : pending.y * ease;
			pos.x += sx;
			pos.y += sy;
			pending.x -= sx;
			pending.y -= sy;
			moving = moving || pending.x !== 0 || pending.y !== 0;
		}
		draw();
		if (moving && running()) frame = requestAnimationFrame(tick);
		else last = 0;
	};

	const wake = () => {
		if (!running()) return;
		if (!frame) frame = requestAnimationFrame(tick);
	};

	const loadImages = () => {
		const key = options.items.map((item) => item.src).join("\n");
		if (key === sources) return;
		sources = key;
		images = options.items.map(() => null);
		options.items.forEach((item, index) => {
			const image = new Image();
			image.decoding = "async";
			image.onload = () => {
				if (destroyed || key !== sources) return;
				images[index] = image;
				wake();
			};
			image.src = item.src;
		});
	};

	const onDown = (event: PointerEvent) => {
		if (event.button !== 0 || !event.isPrimary) return;
		drag = {
			id: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			t: event.timeStamp,
		};
		velocity.x = velocity.y = 0;
		container.dataset.dragging = "true";
		container.setPointerCapture(event.pointerId);
	};
	const onMove = (event: PointerEvent) => {
		if (!drag || event.pointerId !== drag.id) return;
		// Divide by the centre magnification so tiles under the pointer track it 1:1.
		const scale = 1 + lens();
		const dx = (event.clientX - drag.x) / scale;
		const dy = (event.clientY - drag.y) / scale;
		const dt = Math.max(8, event.timeStamp - drag.t);
		pos.x += dx;
		pos.y += dy;
		velocity.x = Math.max(-2.4, Math.min(2.4, dx / dt));
		velocity.y = Math.max(-2.4, Math.min(2.4, dy / dt));
		drag = { id: drag.id, x: event.clientX, y: event.clientY, t: event.timeStamp };
		draw();
	};
	const onUp = (event: PointerEvent) => {
		if (!drag || event.pointerId !== drag.id) return;
		// Momentum fades with the pause between the last move and release.
		const keep = reduced.matches ? 0 : Math.exp(-(event.timeStamp - drag.t) / 60);
		velocity.x *= keep;
		velocity.y *= keep;
		drag = null;
		container.dataset.dragging = "false";
		if (container.hasPointerCapture(event.pointerId))
			container.releasePointerCapture(event.pointerId);
		wake();
	};
	const onKey = (event: KeyboardEvent) => {
		let dx = 0;
		let dy = 0;
		if (event.key === "Home") {
			dx = -(pos.x + pending.x);
			dy = -(pos.y + pending.y);
		} else {
			const step = KEYS[event.key];
			if (!step) return;
			dx = step[0] * cellW();
			dy = step[1] * cellH();
		}
		event.preventDefault();
		velocity.x = velocity.y = 0;
		if (reduced.matches) {
			pos.x += dx + pending.x;
			pos.y += dy + pending.y;
			pending.x = pending.y = 0;
			draw();
			return;
		}
		pending.x += dx;
		pending.y += dy;
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

	container.addEventListener("pointerdown", onDown);
	container.addEventListener("pointermove", onMove);
	container.addEventListener("pointerup", onUp);
	container.addEventListener("pointercancel", onUp);
	container.addEventListener("keydown", onKey);
	const resize = new ResizeObserver(onResize);
	resize.observe(container);
	// Theme switches change the card, border and caption tokens; repaint with them.
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
			container.removeEventListener("pointerdown", onDown);
			container.removeEventListener("pointermove", onMove);
			container.removeEventListener("pointerup", onUp);
			container.removeEventListener("pointercancel", onUp);
			container.removeEventListener("keydown", onKey);
			resize.disconnect();
			theme.disconnect();
			intersection.disconnect();
			document.removeEventListener("visibilitychange", onVisible);
		},
	};
}
