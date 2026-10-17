<script lang="ts">
import { cn } from "../../lib/cn";
import { formatElapsed } from "../variants";
import { loadingStateState } from "./context";

let { class: classProp }: { class?: string } = $props();
const loader = loadingStateState();

let deciseconds = $state(0);
$effect(() => {
	const id = setInterval(() => {
		deciseconds += 1;
	}, 100);
	return () => clearInterval(id);
});
</script>

<!-- Time since this part mounted, ticking every tenth of a second. -->
<span data-slot="loading-state-elapsed" class={cn(loader.styles.elapsed(), classProp)}>
	{formatElapsed(deciseconds)}
</span>
