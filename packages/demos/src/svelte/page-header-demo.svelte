<script lang="ts">
import { Button, PageHeader, TabsContent } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { PAGE_HEADER, PAGE_PANELS } from "../data/page-header";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof PageHeader>>(props));
let issues = $state(9);
const tabs = $derived(
	PAGE_HEADER.tabs.map((tab) =>
		tab.value === "issues" ? { ...tab, count: issues } : tab,
	),
);
</script>

<div class="h-120 w-full overflow-y-auto rounded-xl border border-border">
	<PageHeader {...PAGE_HEADER} {tabs} variant={p.variant}>
		{#snippet actions()}
			<Button size="sm" onclick={() => (issues += 1)}>New issue</Button>
		{/snippet}
		{#each PAGE_PANELS as panel (panel.value)}
			<TabsContent value={panel.value}>
				{#each panel.lines as line (line)}
					<p class="border-border border-b py-4 text-muted-foreground text-sm">{line}</p>
				{/each}
			</TabsContent>
		{/each}
	</PageHeader>
</div>
