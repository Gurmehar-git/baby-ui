<script lang="ts">
import { InlineEdit } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof InlineEdit>>(props));
const request = () => new Promise<void>((resolve) => setTimeout(resolve, 700));
let name = $state("Atlas redesign");
</script>

<InlineEdit
	label="Project name"
	value={name}
	placeholder="Untitled project"
	variant={p.variant}
	size={p.size}
	multiline={p.multiline}
	validate={(next) => (next ? null : "A project needs a name.")}
	onSave={async (next) => {
		await request();
		name = next;
	}}
/>
