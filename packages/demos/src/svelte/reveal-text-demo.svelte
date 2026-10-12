<script lang="ts">
import { RevealText } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof RevealText>>(props));

const split = $derived(p.split ?? "word");
const trigger = $derived(p.trigger ?? "mount");
</script>

<div class="text-2xl">
	{#key `${p.variant}-${split}-${trigger}-${props.once}-${props.staggerMs}-${props.delayMs}-${props.blur}-${props.direction}-${props.staggerFrom}-${props.mask}`}
		<RevealText
			as="h2"
			text="Design meets motion, one word at a time"
			variant={p.variant}
			{split}
			{trigger}
			once={Boolean(props.once ?? true)}
			staggerMs={Number(props.staggerMs ?? 90)}
			delayMs={Number(props.delayMs ?? 0)}
			blur={Number(props.blur ?? 12)}
			direction={p.direction ?? "up"}
			staggerFrom={p.staggerFrom ?? "start"}
			mask={props.mask === true}
			size={p.size ?? "inherit"}
			class="text-center font-semibold text-foreground tracking-tight"
		/>
	{/key}
</div>
