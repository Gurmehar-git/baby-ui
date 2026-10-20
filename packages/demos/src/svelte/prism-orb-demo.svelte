<script lang="ts">
import { Button, PrismOrb, type PrismOrbSpeed, type PrismOrbTone } from "@baby-ui/svelte";

let { props = {} }: { props?: Record<string, unknown> } = $props();
</script>

<div class="relative h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-border">
	<PrismOrb
		position="absolute"
		tone={(props.tone as PrismOrbTone) ?? "chart"}
		speed={(props.speed as PrismOrbSpeed) ?? "normal"}
		intensity={Number(props.intensity ?? 1)}
		grain={Number(props.grain ?? 0)}
	>
		<div class="flex size-full flex-col items-start justify-end gap-4 p-8">
			<p class="font-medium text-foreground text-xs uppercase tracking-widest">Refraction studio</p>
			<h2 class="max-w-sm text-balance font-semibold text-3xl text-foreground tracking-tight">
				Light, bent on purpose
			</h2>
			<Button>Get started</Button>
		</div>
	</PrismOrb>
</div>
