<script lang="ts">
import { Button, Countdown } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Countdown>>(props));
const LAUNCH = (2 * 24 + 7) * 3_600_000 + 42 * 60_000;
let target = $state(Date.now() + LAUNCH);
</script>

<div class="grid w-full max-w-lg justify-items-center gap-6">
	<Countdown {target} label="Launch starts in" variant={p.variant} />
	<div class="flex gap-2">
		<Button variant="outline" size="sm" onclick={() => (target = Date.now() + 10_000)}>Count down 10 seconds</Button>
		<Button variant="ghost" size="sm" onclick={() => (target = Date.now() + LAUNCH)}>Reset</Button>
	</div>
</div>
