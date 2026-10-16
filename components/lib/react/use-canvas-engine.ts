import { type DependencyList, useEffect, useRef, useState } from "react";

/** A canvas engine such as `mountShader`'s scenes: mount once, then feed option changes. */
export type CanvasEngine<O> = (
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	options: O,
	onReady: (webgl: boolean) => void,
) => { update(next: O): void; destroy(): void };

/** Mounts `mount` on the returned refs once, re-applies `options` when `deps` change, and
 * reports whether WebGL started so the fallback can show. */
export function useCanvasEngine<O>(
	mount: CanvasEngine<O>,
	options: O,
	deps: DependencyList,
) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<CanvasEngine<O>>>(null);
	const [webgl, setWebgl] = useState(false);
	const latest = useRef(options);
	latest.current = options;

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (!root.current || !canvas.current) return;
		const mounted = mount(root.current, canvas.current, latest.current, setWebgl);
		engine.current = mounted;
		return () => {
			mounted.destroy();
			engine.current = null;
		};
	}, []);

	// `deps` are the option inputs; the engine reads the current values through `latest`.
	useEffect(() => {
		engine.current?.update(latest.current);
		// biome-ignore lint/correctness/useExhaustiveDependencies: the list is built by the caller on purpose.
	}, deps);

	return { root, canvas, webgl };
}
