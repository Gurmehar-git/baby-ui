<script lang="ts">
import type { Snippet } from "svelte";
import Popover from "../../popover/svelte/popover.svelte";

let {
	children,
	open = $bindable(false),
}: {
	children?: Snippet;
	open?: boolean;
} = $props();
</script>

<Popover bind:open>
	{@render children?.()}
</Popover>
