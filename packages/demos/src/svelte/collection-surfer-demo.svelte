<script lang="ts">
import {
	CollectionSurfer,
	CollectionSurferHint,
	CollectionSurferTitle,
	CollectionSurferTrack,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { COLLECTION_SURFER } from "../data/demo-samples";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof CollectionSurfer>>(props));
</script>

<CollectionSurfer
	items={COLLECTION_SURFER.items}
	variant={p.variant}
	size={p.size}
	scrollPerItem={p.scrollPerItem}
>
	<CollectionSurferTitle>{COLLECTION_SURFER.title}</CollectionSurferTitle>
	<CollectionSurferHint>Scroll to surf</CollectionSurferHint>
	<CollectionSurferTrack />
</CollectionSurfer>
