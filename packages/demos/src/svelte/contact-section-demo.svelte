<script lang="ts">
import { ContactSection } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CONTACT_CHANNELS, CONTACT_DETAILS, CONTACT_OFFICES } from "../data/contact";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
type Props = ComponentProps<typeof ContactSection>;
const p = $derived(controlProps<Props>(props));
let status = $state<NonNullable<Props["status"]>>("idle");
let timer: ReturnType<typeof setTimeout> | undefined;
$effect(() => () => clearTimeout(timer));
</script>

{#snippet detail(value: string)}
	<p>{CONTACT_DETAILS[value]?.lead}</p>
	<a class="mt-3 inline-block underline underline-offset-4" href="mailto:{CONTACT_DETAILS[value]?.email}">{CONTACT_DETAILS[value]?.email}</a>
{/snippet}
{#snippet sales()}{@render detail("sales")}{/snippet}
{#snippet support()}{@render detail("support")}{/snippet}
{#snippet press()}{@render detail("press")}{/snippet}

<ContactSection
	variant={p.variant}
	description="Tell us what you're working on and the right person will reply."
	{status}
	onSubmit={() => {
		status = "submitting";
		// The demo stands in for a request.
		timer = setTimeout(() => (status = "success"), 900);
	}}
	onReset={() => (status = "idle")}
	channels={CONTACT_CHANNELS.map((channel) => ({
		...channel,
		detail: channel.value === "sales" ? sales : channel.value === "support" ? support : press,
	}))}
	offices={CONTACT_OFFICES}
	locale="en-US"
/>
