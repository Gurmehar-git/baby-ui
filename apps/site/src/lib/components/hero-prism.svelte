<script lang="ts">
import { canvasEngine } from "@baby-ui/svelte/lib/canvas-engine.svelte";
import { cn } from "@baby-ui/svelte/lib/cn";
import {
	createPrismGradient,
	type PrismGradientOptions,
} from "@baby-ui/svelte/lib/prism";
import { mountShader } from "@baby-ui/svelte/lib/shader";

let { class: className }: { class?: string } = $props();

// The hero's fixed look: chart tone at half speed, no grain.
const options: PrismGradientOptions = {
	colors: ["var(--background)", "var(--primary)", "var(--foreground)"],
	speed: 0.5,
	grain: 0,
};

function mount(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: PrismGradientOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createPrismGradient(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: PrismGradientOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mount,
	() => ({ root, canvas }),
	() => options,
);
const fade =
	"transition-opacity duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]";
</script>

<div
	bind:this={root}
	aria-hidden="true"
	class={cn("pointer-events-none absolute inset-0 isolate overflow-hidden bg-background", className)}
>
	<canvas
		bind:this={canvas}
		class={cn("absolute inset-0 block size-full", fade, !gl.webgl && "opacity-0")}
	></canvas>
</div>
