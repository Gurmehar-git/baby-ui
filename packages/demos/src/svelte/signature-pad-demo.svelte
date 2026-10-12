<script lang="ts">
import { SignaturePad } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SignaturePad>>(props));
</script>

<div class="w-full max-w-lg">
	<SignaturePad variant={p.variant} signer="Maya Chen" downloadable />
</div>
