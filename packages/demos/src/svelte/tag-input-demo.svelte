<script lang="ts">
import { TagInput } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TagInput>>(props));

let tags = $state(["svelte", "react"]);
</script>

<div class="w-full max-w-80">
	<TagInput
		bind:tags
		placeholder={p.placeholder || "Add a tag…"}
		max={Number(props.max ?? 6)}
		disabled={Boolean(props.disabled)}
		invalid={p.invalid ?? false}
		size={p.size ?? "default"}
		label="Tags"
	/>
</div>
