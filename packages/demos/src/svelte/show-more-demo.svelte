<script lang="ts">
import { ShowMore, ShowMoreContent, ShowMoreTrigger } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const trigger = $derived(controlProps<ComponentProps<typeof ShowMoreTrigger>>(props));
</script>

<div class="w-full max-w-80">
	<ShowMore lines={Number(props.lines ?? 3)} maxHeight={Number(props.maxHeight ?? 320)}>
		<ShowMoreContent>
			<p>Components here are copied into your project rather than installed, which means you own the source and can change anything. The registry only decides what the first version looks like. Every port satisfies the same ComponentSpec, so the React and Svelte builds behave identically even though neither is generated from the other.</p>
		</ShowMoreContent>
		<ShowMoreTrigger
			moreLabel={trigger.moreLabel || "Show more"}
			lessLabel={trigger.lessLabel || "Show less"}
		/>
	</ShowMore>
</div>
