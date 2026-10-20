<script lang="ts">
import {
	Button,
	DispersionRays,
	type DispersionRaysSpeed,
	type DispersionRaysTone,
} from "@baby-ui/svelte";

let { props = {} }: { props?: Record<string, unknown> } = $props();
</script>

<div class="relative h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-border">
	<DispersionRays
		position="absolute"
		tone={(props.tone as DispersionRaysTone) ?? "chart"}
		speed={(props.speed as DispersionRaysSpeed) ?? "normal"}
		intensity={Number(props.intensity ?? 1)}
		grain={Number(props.grain ?? 0)}
	>
		<div class="flex size-full flex-col items-start justify-end gap-4 p-8">
			<p class="font-medium text-foreground text-xs uppercase tracking-widest">Launch week, day 3</p>
			<h2 class="max-w-sm text-balance font-semibold text-3xl text-foreground tracking-tight">
				Everything, split into colour
			</h2>
			<Button>Get started</Button>
		</div>
	</DispersionRays>
</div>
