<script lang="ts">
import type { Framework } from "@baby-ui/registry-schema";
import { Button, Spinner } from "@baby-ui/svelte";
import type { Snippet } from "svelte";
import type { DemoLoader } from "#lib/demos.js";
import { REACT_RUNNER_URL } from "#lib/flags.js";

let {
	framework,
	slug,
	demo,
	props,
	content,
	maxHeight,
	class: classProp,
}: {
	framework: Framework;
	slug: string;
	demo: DemoLoader | undefined;
	props: Record<string, unknown>;
	/** Replaces the demo (the OG pages' rendered PNG); the frame stays the same. */
	content?: Snippet;
	/** The canvas grows to its demo up to this cap, then scrolls inside. */
	maxHeight?: string;
	class?: string;
} = $props();

const demoPromise = $derived(demo?.());
const iframeSrc = $derived(
	REACT_RUNNER_URL
		? `${REACT_RUNNER_URL}?slug=${slug}&props=${encodeURIComponent(JSON.stringify(props))}`
		: null,
);
</script>

<!-- The inset frame: a tinted outer card, canvas sunk one level on bg-background. -->
<div class={["rounded-xl border border-border bg-card p-1", classProp]}>
	<div
		data-demo-canvas
		style:max-height={maxHeight}
		class="relative grid h-full min-h-88 grid-cols-[minmax(0,1fr)] place-items-center-safe overflow-auto rounded-[7px] bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-4 pb-16 sm:p-8 sm:pb-16"
	>
		{#if content}
			{@render content()}
		{:else if demoPromise}
			<!-- Keyed so the old demo unmounts before the page resets `props` to the next spec's. -->
			{#key slug}
				<svelte:boundary onerror={(error) => console.error(error)}>
					{#await demoPromise}
						<div class="flex flex-col items-center gap-2 text-muted-foreground text-sm">
							<Spinner size="default" label="Loading preview" />
							<span>Loading preview…</span>
						</div>
					{:then mod}
						{@const Demo = mod.default}
						<Demo {props} />
					{:catch}
						<p class="text-muted-foreground text-sm">Couldn't load this preview.</p>
					{/await}
					{#snippet failed(_error, reset)}
						<div class="flex flex-col items-center gap-2 text-muted-foreground text-sm">
							<span>This preview crashed.</span>
							<Button variant="outline" size="sm" onclick={reset}>Reload preview</Button>
						</div>
					{/snippet}
				</svelte:boundary>
			{/key}
		{:else}
			<p class="text-muted-foreground text-sm">No demo for this component yet.</p>
		{/if}
		{#if framework === "react" && demoPromise && !content}
			{#if iframeSrc}
				<iframe
					src={iframeSrc}
					title="React preview of {slug}"
					class="h-full min-h-[18rem] w-full border-0 bg-transparent"
					sandbox="allow-scripts"
				></iframe>
			{/if}
		{/if}
	</div>
</div>
