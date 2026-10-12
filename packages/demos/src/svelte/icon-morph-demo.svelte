<script lang="ts">
import { Button, IconMorph } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { ICON_MORPH_BUTTONS } from "../data/icon-morph";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof IconMorph>>(props));
let on = $state<Record<string, boolean>>({});
</script>

<div class="grid grid-cols-4 gap-2">
	{#each ICON_MORPH_BUTTONS as item (item.name)}
		<Button
			variant="ghost"
			size="icon-lg"
			aria-label={on[item.name] ? item.on : item.off}
			onclick={() => (on[item.name] = !on[item.name])}
		>
			<IconMorph name={item.name} state={!!on[item.name]} strokeWidth={p.strokeWidth} />
		</Button>
	{/each}
</div>
