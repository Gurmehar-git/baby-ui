import { untrack } from "svelte";

/** A canvas engine such as `mountShader`'s scenes: mount once, then feed option changes. */
export type CanvasEngine<O> = (
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	options: O,
	onReady: (webgl: boolean) => void,
) => { update(next: O): void; destroy(): void };

/** Mounts `mount` once both elements exist, re-applies `options()` as it changes, and exposes
 * whether WebGL started so the fallback can show. Call during component init. */
export function canvasEngine<O>(
	mount: CanvasEngine<O>,
	elements: () => { root?: HTMLElement; canvas?: HTMLCanvasElement },
	options: () => O,
) {
	const state = $state({ webgl: false });
	let engine: ReturnType<CanvasEngine<O>> | undefined;

	$effect(() => {
		const { root, canvas } = elements();
		if (!root || !canvas) return;
		const mounted = untrack(() =>
			mount(root, canvas, options(), (ok) => {
				state.webgl = ok;
			}),
		);
		engine = mounted;
		return () => {
			mounted.destroy();
			engine = undefined;
		};
	});

	$effect(() => {
		const next = options();
		engine?.update(next);
	});

	return state;
}
