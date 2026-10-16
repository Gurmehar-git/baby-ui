<script lang="ts">
import { specs } from "@baby-ui/components/specs";
import SpecDials from "@baby-ui/demos/controls";
import { broadcast, RUNNERS } from "./runners";

let slug = $state(specs[0]?.slug ?? "button");
let values = $state<Record<string, unknown>>({});
let frames = $state<Record<string, HTMLIFrameElement | undefined>>({});

const spec = $derived(specs.find((s) => s.slug === slug) ?? specs[0]);

$effect(() => {
	broadcast(Object.values(frames), { source: "baby-ui-shell", slug, props: values });
});

// A runner that restarts after an HMR error asks for the current state.
$effect(() => {
	const onReady = (event: MessageEvent) => {
		if ((event.data as { source?: string })?.source !== "baby-ui-runner") return;
		broadcast(Object.values(frames), { source: "baby-ui-shell", slug, props: values });
	};
	window.addEventListener("message", onReady);
	return () => window.removeEventListener("message", onReady);
});
</script>

<div class="flex h-full flex-col">
	<header class="flex flex-wrap items-end gap-6 border-border border-b px-4 py-3">
		<label for="slug" class="flex flex-col gap-1 text-xs">
			<span class="text-muted-foreground">component</span>
			<select
				id="slug"
				bind:value={slug}
				class="rounded border border-input bg-background px-2 py-1 text-sm"
			>
				{#each specs as s (s.slug)}
					<option value={s.slug}>{s.name} · {s.category}</option>
				{/each}
			</select>
		</label>

	</header>

	<div class="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem] divide-x divide-border">
		{#each RUNNERS as runner (runner.framework)}
			<section class="flex min-h-0 flex-col">
				<h2
					class="border-border border-b px-3 py-1.5 font-mono text-muted-foreground text-xs"
				>
					{runner.framework}
				</h2>
				<iframe
					bind:this={frames[runner.framework]}
					src={runner.url}
					title="{runner.framework} runner"
					class="min-h-0 flex-1 border-0"
				></iframe>
			</section>
		{/each}
		<aside class="min-h-0 overflow-y-auto p-3">
			{#if spec}
				<div class="rounded-xl border border-border bg-card/40 py-0.5">
					{#key spec.slug}
						<SpecDials {spec} bind:values />
					{/key}
				</div>
			{/if}
		</aside>
	</div>
</div>
