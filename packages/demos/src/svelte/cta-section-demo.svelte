<script lang="ts">
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CtaSection,
	CtaSectionAction,
	CtaSectionActions,
	CtaSectionContent,
	CtaSectionDescription,
	CtaSectionDismiss,
	CtaSectionNote,
	CtaSectionPoint,
	CtaSectionPoints,
	CtaSectionTitle,
	CtaSectionVisual,
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
		<CtaSection variant="banner" bind:open>
			<CtaSectionContent>
				<CtaSectionTitle>{CTA_COPY.banner.title}</CtaSectionTitle>
				<CtaSectionDescription>{CTA_COPY.banner.description}</CtaSectionDescription>
			</CtaSectionContent>
			<CtaSectionActions>
				<CtaSectionAction href={CTA_COPY.banner.primaryAction.href}>
					{CTA_COPY.banner.primaryAction.label}
				</CtaSectionAction>
				<CtaSectionDismiss />
			</CtaSectionActions>
		</CtaSection>
		{#if !open}
			<Button variant="outline" size="sm" class="justify-self-center" onclick={() => (open = true)}>
				Show the banner again
			</Button>
		{/if}
	</div>
{:else if variant === "split"}
	<CtaSection variant="split">
		<CtaSectionContent>
			<CtaSectionTitle>{CTA_COPY.split.title}</CtaSectionTitle>
			<CtaSectionDescription>{CTA_COPY.split.description}</CtaSectionDescription>
			<CtaSectionPoints>
				{#each CTA_COPY.split.points as point (point)}
					<CtaSectionPoint>{point}</CtaSectionPoint>
				{/each}
			</CtaSectionPoints>
			<CtaSectionActions>
				<CtaSectionAction href={CTA_COPY.split.primaryAction.href}>
					{CTA_COPY.split.primaryAction.label}
				</CtaSectionAction>
				<CtaSectionAction variant="outline" href={CTA_COPY.split.secondaryAction.href}>
					{CTA_COPY.split.secondaryAction.label}
				</CtaSectionAction>
			</CtaSectionActions>
		</CtaSectionContent>
		<CtaSectionVisual>
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
		</CtaSectionVisual>
	</CtaSection>
{:else}
	<CtaSection variant="centered">
		<CtaSectionContent>
			<CtaSectionTitle>{CTA_COPY.centered.title}</CtaSectionTitle>
			<CtaSectionDescription>{CTA_COPY.centered.description}</CtaSectionDescription>
			<CtaSectionActions>
				<CtaSectionAction href={CTA_COPY.centered.primaryAction.href}>
					{CTA_COPY.centered.primaryAction.label}
				</CtaSectionAction>
				<CtaSectionAction variant="outline" href={CTA_COPY.centered.secondaryAction.href}>
					{CTA_COPY.centered.secondaryAction.label}
				</CtaSectionAction>
			</CtaSectionActions>
			<CtaSectionNote>
				<AvatarGroup aria-hidden="true">
					{#each CTA_FACES as face (face.src)}
						<Avatar size="sm" class="size-6.5">
							<AvatarImage src={face.src} alt="" />
							<AvatarFallback />
						</Avatar>
					{/each}
				</AvatarGroup>
				{CTA_COPY.centered.note}
			</CtaSectionNote>
		</CtaSectionContent>
	</CtaSection>
{/if}
