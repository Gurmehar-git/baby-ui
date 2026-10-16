import assert from "node:assert/strict";
import { test } from "node:test";

// Minimal DOM fakes: watchSurface only needs listeners, observers and matchMedia.
function target() {
	const listeners = new Map();
	return {
		listeners,
		addEventListener(type, fn) {
			listeners.set(type, [...(listeners.get(type) ?? []), fn]);
		},
		removeEventListener(type, fn) {
			listeners.set(
				type,
				(listeners.get(type) ?? []).filter((f) => f !== fn),
			);
		},
		fire(type, event = {}) {
			for (const fn of listeners.get(type) ?? []) fn(event);
		},
		count() {
			return [...listeners.values()].reduce((n, list) => n + list.length, 0);
		},
	};
}

const observers = [];
class FakeObserver {
	constructor(callback) {
		this.callback = callback;
		this.connected = false;
		observers.push(this);
	}
	observe() {
		this.connected = true;
	}
	disconnect() {
		this.connected = false;
	}
}

function setup() {
	observers.length = 0;
	const media = { matches: false, ...target() };
	const doc = { hidden: false, documentElement: {}, ...target() };
	const win = target();
	globalThis.ResizeObserver = class extends FakeObserver {};
	globalThis.MutationObserver = class extends FakeObserver {};
	globalThis.IntersectionObserver = class extends FakeObserver {};
	globalThis.matchMedia = () => media;
	globalThis.document = doc;
	globalThis.window = win;
	const el = {
		...target(),
		getBoundingClientRect: () => ({ left: 10, top: 20, width: 100, height: 50 }),
	};
	return { el, media, doc, win };
}

const { watchSurface } = await import("../components/lib/react/surface.ts");

test("destroy removes every listener and disconnects every observer", () => {
	const { el, media, doc, win } = setup();
	const noop = () => {};
	const surface = watchSurface(el, {
		resize: noop,
		theme: noop,
		wake: noop,
		pointer: { move: noop, leave: noop },
	});
	assert.ok(el.count() > 0 && doc.count() > 0 && media.count() > 0);
	assert.ok(observers.every((o) => o.connected));
	surface.destroy();
	assert.equal(el.count() + doc.count() + media.count() + win.count(), 0);
	assert.ok(observers.every((o) => !o.connected));
});

test("window-scoped pointer listens on window and is removed from it", () => {
	const { el, win } = setup();
	const noop = () => {};
	const surface = watchSurface(el, {
		resize: noop,
		theme: noop,
		wake: noop,
		pointer: { move: noop, scope: "window" },
	});
	assert.equal(win.listeners.get("pointermove")?.length, 1);
	assert.equal(el.count(), 0);
	surface.destroy();
	assert.equal(win.count(), 0);
});

test("pointer positions are relative to the element box", () => {
	const { el } = setup();
	const seen = [];
	watchSurface(el, {
		resize() {},
		theme() {},
		wake() {},
		pointer: { move: (x, y) => seen.push([x, y]) },
	});
	el.fire("pointermove", { clientX: 15, clientY: 30 });
	assert.deepEqual(seen, [[5, 10]]);
});

test("live() needs on-screen, a visible tab and motion allowed; changes wake", () => {
	const { el, media, doc } = setup();
	let wakes = 0;
	const surface = watchSurface(el, {
		resize() {},
		theme() {},
		wake: () => wakes++,
	});
	assert.equal(surface.live(), true);
	const seen = observers.find((o) => o instanceof IntersectionObserver);
	seen.callback([{ isIntersecting: false }]);
	assert.equal(surface.live(), false);
	seen.callback([{ isIntersecting: true }]);
	doc.hidden = true;
	doc.fire("visibilitychange");
	assert.equal(surface.live(), false);
	doc.hidden = false;
	media.matches = true;
	media.fire("change");
	assert.equal(surface.live(), false);
	assert.equal(surface.reducedMotion(), true);
	assert.equal(wakes, 4);
});

test("resize and theme observers route to their handlers", () => {
	const { el } = setup();
	const calls = [];
	watchSurface(el, {
		resize: () => calls.push("resize"),
		theme: () => calls.push("theme"),
		wake() {},
	});
	observers.find((o) => o instanceof ResizeObserver).callback([]);
	observers.find((o) => o instanceof MutationObserver).callback([]);
	assert.deepEqual(calls, ["resize", "theme"]);
});
