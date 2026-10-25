<script lang="ts">
import { DocsNav } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { DOCS_SECTIONS } from "../data/docs-nav";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof DocsNav>>(props));

let current = $state("#installation");
</script>

<div class="w-64 max-w-full">
	<DocsNav
		sections={DOCS_SECTIONS}
		{current}
		variant={p.variant ?? "default"}
		connector={p.connector ?? "tick"}
		rungs={props.rungs === true}
		onNavigate={(href, event) => {
			event.preventDefault();
			current = href;
		}}
	/>
</div>
