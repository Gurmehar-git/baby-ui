<script lang="ts">
import { TextReel } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { REEL_ITEMS } from "../data/obsidian";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TextReel>>(props));
</script>

<TextReel
	items={REEL_ITEMS}
	prefix={p.prefix || "We"}
	speed={Number(props.speed ?? 0.6)}
	paused={p.paused ?? false}
	orientation={p.orientation ?? "vertical"}
	size={p.size ?? "default"}
	class="w-full"
/>
