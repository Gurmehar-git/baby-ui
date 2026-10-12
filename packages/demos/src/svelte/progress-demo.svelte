<script lang="ts">
import { Progress } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Progress>>(props));

const value = $derived(Number(props.value ?? 68));
const indeterminate = $derived(Boolean(props.indeterminate));
</script>

<div class="flex w-full max-w-72 flex-col items-center gap-2">
	<Progress
		{value}
		{indeterminate}
		size={p.size ?? "default"}
		tone={p.tone ?? "default"}
		variant={p.variant ?? "linear"}
		showValue={props.showValue === true}
		label={p.label || "design-system.zip"}
		helper={p.helper || "12.4 MB of 18.2 MB, 6s remaining"}
		indeterminateLabel="Preparing"
	/>
</div>
