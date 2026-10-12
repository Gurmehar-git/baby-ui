<script lang="ts">
import { Badge } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Badge>>(props));

const size = $derived(p.size ?? "default");
</script>

<div class="flex w-full max-w-72 flex-col gap-3 text-sm">
	<div class="flex items-center justify-between gap-4">
		<span class="text-muted-foreground">api-gateway</span>
		<Badge
			variant={p.variant ?? "success"}
			{size}
			dot={p.dot !== false}
		>
			Healthy
		</Badge>
	</div>
	<div class="flex items-center justify-between gap-4">
		<span class="text-muted-foreground">image-resizer</span>
		<Badge variant="warning" dot>Degraded</Badge>
	</div>
	<div class="flex items-center justify-between gap-4">
		<span class="text-muted-foreground">legacy-billing</span>
		<Badge variant="destructive" dot>Down</Badge>
	</div>
</div>
