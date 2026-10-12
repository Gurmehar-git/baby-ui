<script lang="ts">
import { Badge, Button, ErrorBoundary } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ErrorBoundary>>(props));

let crash = $state(false);

// Stands in for a widget whose data source fails; demo only.
function profileName() {
	if (crash) throw new Error("Profile service answered 503 Service Unavailable");
	return "Ana Ruiz";
}
</script>

<div class="flex w-full max-w-md flex-col gap-3">
	<Button size="sm" variant="outline" disabled={crash} onclick={() => (crash = true)} class="self-start">
		Break the widget
	</Button>
	<ErrorBoundary
		variant={p.variant ?? "card"}
		layout={p.layout ?? "vertical"}
		size={p.size ?? "default"}
		details={p.details ?? true}
		onreset={() => (crash = false)}
	>
		<div class="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
			<span class="grid size-10 place-items-center rounded-full bg-primary/10 font-medium text-primary">AR</span>
			<div class="flex min-w-0 flex-1 flex-col">
				<span class="font-medium text-sm">{profileName()}</span>
				<span class="text-muted-foreground text-xs">Design lead</span>
			</div>
			<Badge size="sm" variant="secondary">Online</Badge>
		</div>
	</ErrorBoundary>
</div>
