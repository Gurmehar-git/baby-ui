<script lang="ts">
import { Button, Skeleton } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Skeleton>>(props));

const shape = $derived(p.shape ?? "line");
let loading = $state(true);
</script>

<div class="grid w-full max-w-72 gap-6">
	<div class="flex items-center gap-3">
		<Skeleton width="2.5rem" height="2.5rem" shape="circle" />
		<div class="flex flex-1 flex-col gap-2">
			<Skeleton width={p.width || "100%"} height={p.height || "1rem"} {shape} />
			<Skeleton width="60%" height="0.75rem" />
		</div>
	</div>
	<div class="grid gap-2">
		<Skeleton {loading} shape="block">
			<p class="text-muted-foreground text-sm leading-relaxed">
				The placeholder takes this paragraph's shape, then crossfades into it.
			</p>
		</Skeleton>
		<Button size="sm" variant="outline" class="justify-self-start" onclick={() => (loading = !loading)}>
			{loading ? "Finish loading" : "Load again"}
		</Button>
	</div>
</div>
