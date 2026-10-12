<script lang="ts">
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CtaSection,
	Progress,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CTA_COPY, CTA_FACES, CTA_SETUP } from "../data/cta";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const variant = $derived(
	controlProps<ComponentProps<typeof CtaSection>>(props).variant ?? "centered",
);
let open = $state(true);
</script>

{#if variant === "banner"}
	<div class="grid w-full gap-3">
		<CtaSection variant="banner" {...CTA_COPY.banner} dismissible bind:open />
		{#if !open}
			<Button variant="outline" size="sm" class="justify-self-center" onclick={() => (open = true)}>
				Show the banner again
			</Button>
		{/if}
	</div>
{:else if variant === "split"}
	<CtaSection variant="split" {...CTA_COPY.split}>
		{#snippet visual()}
			<Card class="w-full max-w-80">
				<CardHeader>
					<CardTitle>{CTA_SETUP.workspace}</CardTitle>
				</CardHeader>
				<CardContent class="grid gap-3 text-sm">
					<Progress value={66} label="Setting up" showValue />
					{#each CTA_SETUP.steps as step (step)}
						<p class="text-muted-foreground">{step}</p>
					{/each}
				</CardContent>
			</Card>
		{/snippet}
	</CtaSection>
{:else}
	<CtaSection variant="centered" {...CTA_COPY.centered} avatars={CTA_FACES} />
{/if}
