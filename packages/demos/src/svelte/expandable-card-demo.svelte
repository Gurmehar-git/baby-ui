<script lang="ts">
import { ExpandableCard } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ExpandableCard>>(props));
</script>

<ExpandableCard
	title={p.title || "Production deploy"}
	description={p.description || "Ready in 42s · 3 checks passed"}
	width={320}
	expandedWidth={440}
	variant={p.variant}
	size={p.size}
>
	<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
		<dt>Branch</dt>
		<dd class="text-foreground">main</dd>
		<dt>Commit</dt>
		<dd class="text-foreground tabular-nums">8f3c21a</dd>
		<dt>Region</dt>
		<dd class="text-foreground">Frankfurt, Virginia</dd>
	</dl>
</ExpandableCard>
