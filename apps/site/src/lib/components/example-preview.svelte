<script lang="ts">
import { Spinner } from "@baby-ui/svelte";
import type { Component } from "svelte";
import type { Panel } from "#lib/docs-nodes.js";
import CodeGroup from "./code-group.svelte";

let {
	slug,
	name,
	panels = [],
}: { slug?: string; name: string; panels?: Panel[] } = $props();

type ExampleModule = { default: Component };
// Every example module, code-split; only the one this directive names is fetched.
const examples = import.meta.glob<ExampleModule>(
	"../../../../../components/*/examples/*.svelte",
);

const load = $derived(
	slug
		? examples[`../../../../../components/${slug}/examples/${name}.svelte`]
		: undefined,
);
const example = $derived(load?.());
</script>

<div class="my-6 flex flex-col gap-3">
	<div
		class="grid min-h-40 grid-cols-[minmax(0,1fr)] place-items-center rounded-xl border border-border bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-8"
	>
		{#if example}
			{#await example}
				<Spinner size="default" label="Loading example" />
			{:then mod}
				<mod.default />
			{:catch}
				<p class="text-muted-foreground text-sm">Couldn't load this example.</p>
			{/await}
		{:else}
			<p class="text-muted-foreground text-sm">No example named “{name}”.</p>
		{/if}
	</div>
	{#if panels.length}
		<CodeGroup {panels} />
	{/if}
</div>
