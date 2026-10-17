<script lang="ts">
import {
	LoadingState,
	LoadingStateElapsed,
	LoadingStateIndicator,
	LoadingStateLabel,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof LoadingState>>(props));
</script>

<LoadingState variant={p.variant ?? "drive"}>
	<LoadingStateIndicator />
	<LoadingStateLabel>Churning</LoadingStateLabel>
	<LoadingStateElapsed />
</LoadingState>
