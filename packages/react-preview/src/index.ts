import type { ComponentType, ReactNode } from "react";
import type { Root } from "react-dom/client";

export type DemoComponent = ComponentType<{ props: Record<string, unknown> }>;
export type DemoLoader = () => Promise<{ default: DemoComponent }>;
/** Resolves every demo loader by slug; called lazily so the map never reaches a server bundle. */
export type DemoSource = () => Promise<Record<string, DemoLoader>>;

type Runtime = {
	react: typeof import("react");
	dom: typeof import("react-dom/client");
};

export type PreviewHandle = {
	/** Settles once the demo first renders; rejects when it cannot load. */
	ready: Promise<void>;
	update: (props: Record<string, unknown>) => void;
	unmount: () => void;
};

export type MountOptions = {
	source: DemoSource;
	slug: string;
	props: Record<string, unknown>;
	/** Render errors after mount; load errors reject `ready` instead. */
	onError?: (error: unknown) => void;
};

export class MissingDemoError extends Error {
	constructor(slug: string) {
		super(`No React demo for "${slug}"`);
		this.name = "MissingDemoError";
	}
}

let runtime: Promise<Runtime> | undefined;

/** React and ReactDOM, imported once per page session and shared by every preview. */
export function loadRuntime(): Promise<Runtime> {
	// Vite folds this to `true` in the server build, so the imports below never reach the Worker.
	if (import.meta.env?.SSR)
		return Promise.reject(new Error("React previews are client-only"));
	runtime ??= Promise.all([import("react"), import("react-dom/client")]).then(
		([react, dom]) => ({ react, dom }),
	);
	runtime.catch(() => {
		runtime = undefined;
	});
	return runtime;
}

const demos = new Map<string, Promise<DemoComponent>>();
const sources = new WeakMap<DemoSource, Promise<Record<string, DemoLoader>>>();

function resolveSource(source: DemoSource) {
	let map = sources.get(source);
	if (!map) {
		map = source();
		sources.set(source, map);
		map.catch(() => sources.delete(source));
	}
	return map;
}

/** One in-flight load per slug; a failed load is evicted so a retry really retries. */
export function loadDemo(source: DemoSource, slug: string): Promise<DemoComponent> {
	const cached = demos.get(slug);
	if (cached) return cached;
	const pending = resolveSource(source).then(async (map) => {
		const loader = map[slug];
		if (!loader) throw new MissingDemoError(slug);
		return (await loader()).default;
	});
	demos.set(slug, pending);
	pending.catch(() => demos.delete(slug));
	return pending;
}

/** Warms the runtime and one demo without mounting, e.g. on hover of the React toggle. */
export function prefetch(source: DemoSource, slug: string) {
	loadRuntime().catch(() => {});
	loadDemo(source, slug).catch(() => {});
}

const boundaries = new WeakMap<Runtime, ComponentType<BoundaryProps>>();
type BoundaryProps = { onError?: (error: unknown) => void; children?: ReactNode };

function boundaryFor(rt: Runtime) {
	const existing = boundaries.get(rt);
	if (existing) return existing;
	class Boundary extends rt.react.Component<BoundaryProps, { failed: boolean }> {
		override state = { failed: false };
		static getDerivedStateFromError() {
			return { failed: true };
		}
		override componentDidCatch(error: unknown) {
			this.props.onError?.(error);
		}
		override render() {
			return this.state.failed ? null : this.props.children;
		}
	}
	boundaries.set(rt, Boundary);
	return Boundary;
}

/** Renders one demo into `element` on its own root; props update in place, without a remount. */
export function mount(element: HTMLElement, options: MountOptions): PreviewHandle {
	let props = options.props;
	let disposed = false;
	let draw: (() => void) | undefined;
	let root: Root | undefined;

	const ready = Promise.all([loadRuntime(), loadDemo(options.source, options.slug)]).then(
		([rt, Demo]) => {
			if (disposed) return;
			const Boundary = boundaryFor(rt);
			const mounted = rt.dom.createRoot(element);
			root = mounted;
			draw = () =>
				mounted.render(
					rt.react.createElement(
						Boundary,
						{ onError: options.onError },
						rt.react.createElement(Demo, { props }),
					),
				);
			draw();
		},
	);

	return {
		ready,
		update(next) {
			props = next;
			draw?.();
		},
		unmount() {
			disposed = true;
			// React warns when a root unmounts during another root's render; defer past it.
			const current = root;
			root = undefined;
			if (current) queueMicrotask(() => current.unmount());
		},
	};
}

/** Test-only: forgets cached demos between cases. */
export function resetCaches() {
	demos.clear();
}
