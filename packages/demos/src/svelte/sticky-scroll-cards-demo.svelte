<script lang="ts">
import { StickyScrollCards } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { STICKY_CARDS } from "../data/stacks";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof StickyScrollCards>>(props));
</script>

<StickyScrollCards
	cards={STICKY_CARDS}
	variant={p.variant ?? "polaroid"}
	size={p.size ?? "default"}
	tilt={Number(props.tilt ?? 1)}
	hint={p.hint ?? "Scroll to explore"}
	class="max-w-3xl"
/>
