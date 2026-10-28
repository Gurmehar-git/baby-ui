<script lang="ts" module>
export type PreviewStatus = "loading" | "ready" | "missing" | "error";
</script>

<script lang="ts">
import { untrack } from "svelte";
import { type DemoSource, MissingDemoError, mount, type PreviewHandle } from "./index.ts";

let {
	source,
	slug,
	props,
	status = $bindable("loading"),
	onerror,
	class: className,
}: {
	source: DemoSource;
	slug: string;
	props: Record<string, unknown>;
	/** Load state, so the host can show its own spinner or failure; bindable. */
	status?: PreviewStatus;
	onerror?: (error: unknown) => void;
	class?: string;
} = $props();

let element = $state<HTMLElement>();
let handle: PreviewHandle | undefined;

// Remounts only when the demo itself changes; prop dials update the live root below.
$effect(() => {
	const target = element;
	const currentSlug = slug;
	const currentSource = source;
	if (!target) return;
	status = "loading";
	const next = mount(target, {
		source: currentSource,
		slug: currentSlug,
		props: untrack(() => $state.snapshot(props)),
		onError: (error) => {
			status = "error";
			onerror?.(error);
		},
	});
	handle = next;
	next.ready.then(
		() => {
			if (handle === next) status = "ready";
		},
		(error) => {
			if (handle !== next) return;
			status = error instanceof MissingDemoError ? "missing" : "error";
			onerror?.(error);
		},
	);
	return () => {
		next.unmount();
		if (handle === next) handle = undefined;
	};
});

$effect(() => {
	const next = $state.snapshot(props);
	untrack(() => handle?.update(next));
});
</script>

<div bind:this={element} data-react-preview data-status={status} class={className}></div>
