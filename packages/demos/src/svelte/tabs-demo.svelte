<script lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Tabs>>(props));

let value = $state("overview");
</script>

<div class="w-full max-w-96">
	<Tabs
		bind:value
		variant={p.variant ?? "pill"}
		size={p.size ?? "default"}
		orientation={p.orientation ?? "horizontal"}
	>
		<TabsList>
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="activity">Activity</TabsTrigger>
			<TabsTrigger value="settings">Settings</TabsTrigger>
		</TabsList>
		<TabsContent value="overview">
			<p class="text-muted-foreground text-sm">
				Deployment health, traffic and recent errors at a glance.
			</p>
		</TabsContent>
		<TabsContent value="activity">
			<p class="text-muted-foreground text-sm">
				Every deploy, who triggered it and how long it took.
			</p>
		</TabsContent>
		<TabsContent value="settings">
			<p class="text-muted-foreground text-sm">
				Build command, environment variables and domains.
			</p>
		</TabsContent>
	</Tabs>
</div>
