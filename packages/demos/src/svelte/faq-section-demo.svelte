<script lang="ts">
import {
	FaqSection,
	FaqSectionContact,
	FaqSectionDescription,
	FaqSectionEmpty,
	FaqSectionHeader,
	FaqSectionList,
	FaqSectionRail,
	FaqSectionSearch,
	FaqSectionTitle,
	FaqSectionTopics,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { FAQ_CONTACT, FAQ_ITEMS } from "../data/faq";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FaqSection>>(props));
</script>

{#snippet header()}
	<FaqSectionHeader>
		<FaqSectionTitle>Frequently asked questions</FaqSectionTitle>
		<FaqSectionDescription>
			Everything to know before you install your first component.
		</FaqSectionDescription>
	</FaqSectionHeader>
{/snippet}

{#snippet contact()}
	<FaqSectionContact href={FAQ_CONTACT.href} description={FAQ_CONTACT.description}>
		{FAQ_CONTACT.label}
	</FaqSectionContact>
{/snippet}

{#key p.variant}
	<FaqSection items={FAQ_ITEMS} variant={p.variant} type={p.type}>
		{#if p.variant === "columns"}
			<FaqSectionRail>
				{@render header()}
				<FaqSectionTopics />
				{@render contact()}
			</FaqSectionRail>
			<FaqSectionList />
		{:else}
			{@render header()}
			{#if p.variant === "search"}
				<FaqSectionSearch />
			{/if}
			<FaqSectionList />
			<FaqSectionEmpty />
			{@render contact()}
		{/if}
	</FaqSection>
{/key}
