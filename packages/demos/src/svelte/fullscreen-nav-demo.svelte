<script lang="ts">
import { Button, FullscreenNav } from "@baby-ui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FullscreenNav>>(props));

let open = $state(false);

const links = [
	{ href: "#product", label: "Product", description: "What it does and who it is for" },
	{ href: "#pricing", label: "Pricing", description: "Plans for teams of every size" },
	{ href: "#docs", label: "Docs", description: "Guides and API reference" },
	{ href: "#blog", label: "Blog", description: "Release notes and stories" },
];
</script>

{#snippet footer()}
	<span>hello@example.com</span>
{/snippet}

<Button variant="outline" onclick={() => (open = true)}>Open navigation</Button>

<FullscreenNav
	{links}
	bind:open
	current="#product"
	title={p.title || "Menu"}
	variant={p.variant ?? "fade"}
	align={p.align ?? "start"}
	size={p.size ?? "default"}
	numbered={props.numbered === true}
	footer={footer as unknown as Snippet}
/>
