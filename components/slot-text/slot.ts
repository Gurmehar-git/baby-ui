const DIGITS = "0123456789";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = LOWER.toUpperCase();
/** Cell pitch in em; cells are taller than the line so a landed glyph's neighbours sit outside the window. */
const CELL = 1.6;
/** Fast out, long soft landing, never past the target. */
const LANDING = "cubic-bezier(0.12, 0.8, 0.16, 1)";

export type SlotOptions = {
	/** Seconds the first reel spins; later reels add `stagger`. */
	duration: number;
	stagger: number;
	/** Extra full turns a digit makes before it lands. */
	spins: number;
	/** Match reels from the end, so 999 to 1,000 grows on the left. */
	fromEnd: boolean;
	/** Classes for the parts the engine creates, from the tv slots. */
	classes: { reel: string; sizer: string; window: string; track: string; cell: string };
};

const classOf = (char: string) =>
	DIGITS.includes(char)
		? DIGITS
		: LOWER.includes(char)
			? LOWER
			: UPPER.includes(char)
				? UPPER
				: null;
const NBSP = String.fromCharCode(0xa0);
const show = (char: string) => (char === " " ? NBSP : char);

/** Deterministic, so the same change always spins the same letters. */
function seeded(seed: number) {
	let state = seed >>> 0 || 1;
	return () => {
		state = (state * 1664525 + 1013904223) >>> 0;
		return state / 4294967296;
	};
}

/** The reel's cells, from what is visible now to the target. */
function strip(
	from: string,
	to: string,
	spins: number,
	rising: boolean,
	seed: number,
): string[] {
	if (from === to) return [to];
	const set = classOf(to);
	if (!set) return [from, to];
	if (set === DIGITS && classOf(from) === DIGITS) {
		const a = Number(from);
		const b = Number(to);
		const steps = spins * 10 + (rising ? (b - a + 10) % 10 : (a - b + 10) % 10);
		return Array.from({ length: steps + 1 }, (_, i) =>
			String((a + (rising ? i : -i) + 100) % 10),
		);
	}
	const random = seeded(seed);
	const fillers = Array.from(
		{ length: Math.max(2, spins * 5 + 2) },
		() => set[Math.floor(random() * set.length)] ?? to,
	);
	return [from, ...fillers, to];
}

/** Keys reels so separators and suffixes keep their own reel as a number grows. */
function keysOf(chars: string[], fromEnd: boolean) {
	const lead = fromEnd ? chars.findIndex((char) => /[\p{L}\p{N}]/u.test(char)) : 0;
	const prefix = lead < 0 ? chars.length : lead;
	return chars.map((_, i) =>
		i < prefix ? `p${i}` : fromEnd ? `e${chars.length - 1 - i}` : `s${i}`,
	);
}

type Reel = {
	key: string;
	char: string;
	el: HTMLElement;
	track: HTMLElement;
	sizer: HTMLElement;
	cells: string[];
};

/**
 * Spins each character of `root`'s text into its new value like a slot machine reel: digits
 * count the way the number moved, letters shuffle, and reels stop left to right.
 */
export function createSlotText(
	root: HTMLElement,
	initialText: string,
	initial: SlotOptions,
) {
	let options = initial;
	let reels: Reel[] = [];
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");

	const build = (key: string, char: string): Reel => {
		const el = document.createElement("span");
		el.dataset.slotReel = key;
		el.className = options.classes.reel;
		const sizer = document.createElement("span");
		sizer.className = options.classes.sizer;
		sizer.textContent = show(char);
		const win = document.createElement("span");
		win.className = options.classes.window;
		const track = document.createElement("span");
		track.className = options.classes.track;
		win.append(track);
		el.append(sizer, win);
		const reel = { key, char, el, track, sizer, cells: [char] };
		paintCells(reel);
		return reel;
	};
	const paintCells = (reel: Reel) => {
		reel.track.replaceChildren(
			...reel.cells.map((cell) => {
				const span = document.createElement("span");
				span.className = options.classes.cell;
				span.textContent = show(cell);
				return span;
			}),
		);
	};
	const place = (reel: Reel, index: number, time: number, delay: number) => {
		const moving = time > 0 && !reduced.matches;
		reel.track.style.transition = moving
			? `translate ${time}s ${LANDING} ${delay}s, filter ${time * 0.7}s ease-out ${delay}s`
			: "none";
		reel.track.style.translate = `0 ${(-index * CELL).toFixed(4)}em`;
		reel.track.style.filter = "none";
	};
	/** Where the reel is right now, in cells, mid-spin included. */
	const position = (reel: Reel) => {
		const style = getComputedStyle(reel.track);
		const y = Number.parseFloat(style.translate.split(" ")[1] ?? "0") || 0;
		return -y / (CELL * (Number.parseFloat(style.fontSize) || 16));
	};
	/** Grows or shrinks a reel's width, then hands it back to auto. */
	const resize = (reel: Reel, from: number, to: number, then?: () => void) => {
		reel.el.style.width = `${from}px`;
		reel.el.getBoundingClientRect();
		reel.el.style.width = `${to}px`;
		window.setTimeout(() => {
			if (then) then();
			else reel.el.style.width = "";
		}, 380);
	};

	const set = (text: string, rising: boolean, animate: boolean) => {
		const chars = Array.from(text);
		const keys = keysOf(chars, options.fromEnd);
		const old = new Map(reels.map((reel) => [reel.key, reel]));
		const next: Reel[] = [];
		chars.forEach((char, order) => {
			const key = keys[order] ?? `s${order}`;
			const time = options.duration + order * options.stagger;
			let reel = old.get(key);
			old.delete(key);
			if (!reel) {
				reel = build(key, char);
				if (animate && !reduced.matches) {
					reel.cells = strip("", char, options.spins, rising, char.charCodeAt(0) + order);
					paintCells(reel);
					reel.el.style.width = "0px";
					place(reel, 0, 0, 0);
					const entering = reel;
					requestAnimationFrame(() => {
						resize(entering, 0, entering.sizer.offsetWidth);
						entering.track.style.filter = "blur(2px)";
						entering.track.getBoundingClientRect();
						place(entering, entering.cells.length - 1, time, 0);
					});
				}
			} else if (reel.char !== char) {
				// Restart from the cell on screen now, keeping its sub-cell offset, so nothing jumps.
				const now = Math.max(0, Math.min(reel.cells.length - 1, position(reel)));
				const index = Math.round(now);
				const visible = reel.cells[index] ?? reel.char;
				reel.char = char;
				reel.sizer.textContent = show(char);
				if (!animate || reduced.matches) {
					reel.cells = [char];
					paintCells(reel);
					place(reel, 0, 0, 0);
				} else {
					reel.cells = strip(
						visible,
						char,
						options.spins,
						rising,
						char.charCodeAt(0) * 31 + visible.charCodeAt(0) * 7 + order,
					);
					paintCells(reel);
					place(reel, now - index, 0, 0);
					reel.track.style.filter = "blur(2px)";
					reel.track.getBoundingClientRect();
					place(reel, reel.cells.length - 1, time, 0);
				}
			}
			next.push(reel);
		});
		for (const gone of old.values()) {
			if (!animate || reduced.matches) {
				gone.el.remove();
				continue;
			}
			gone.el.style.opacity = "0";
			resize(gone, gone.el.offsetWidth, 0, () => gone.el.remove());
		}
		// Kept reels never move and leaving ones fold where they are; a new reel goes before its successor.
		for (let i = next.length - 1; i >= 0; i--) {
			const reel = next[i];
			if (reel && !reel.el.isConnected)
				root.insertBefore(reel.el, next[i + 1]?.el ?? null);
		}
		reels = next;
	};

	root.replaceChildren();
	set(initialText, true, false);
	let shown = initialText;

	return {
		set(text: string, rising: boolean) {
			if (text === shown) return;
			shown = text;
			set(text, rising, true);
		},
		update(next: SlotOptions) {
			options = next;
		},
		destroy() {
			reels = [];
		},
	};
}
