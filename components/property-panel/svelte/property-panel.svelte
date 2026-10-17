<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type PropertyPanelVariant, propertyPanel } from "../variants";

type Props = HTMLAttributes<HTMLDivElement> & {
	variant?: PropertyPanelVariant;
};

let { class: classProp, variant, children, ...rest }: Props = $props();
</script>

<!-- A dense inspector: PropertyPanelGroups of compact `Field size="sm"` rows. -->
<div
	data-slot="property-panel"
	data-variant={variant}
	class={cn(propertyPanel({ variant }).root(), classProp)}
	{...rest}
>
	{@render children?.()}
</div>
