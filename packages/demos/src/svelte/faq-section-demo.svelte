<script lang="ts">
import { FaqSection } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { FAQ_CONTACT, FAQ_ITEMS } from "../data/faq";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FaqSection>>(props));
</script>

{#key p.variant}
	<FaqSection
		items={FAQ_ITEMS}
		description="Everything to know before you install your first component."
		contact={FAQ_CONTACT}
		variant={p.variant}
		type={p.type}
	/>
{/key}
