<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/cn";
import { splitButtonState } from "./context";

let {
	class: classProp,
	children,
	"aria-label": ariaLabel = "More options",
}: { class?: string; children?: Snippet; "aria-label"?: string } = $props();
const group = splitButtonState();
</script>

<!-- The chevron that opens the menu; named "More options" unless given an `aria-label`. -->
<DropdownMenuTrigger disabled={group.disabled}>
	{#snippet child({ props })}
		<Button
			{...props}
			data-slot="split-button-trigger"
			variant={group.variant}
			size={group.size}
			disabled={group.disabled}
			aria-label={ariaLabel}
			class={cn(String(props.class ?? ""), group.styles.menu(), classProp)}
		>
			{#if children}
				{@render children()}
			{:else}
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="m4 6 4 4 4-4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		</Button>
	{/snippet}
</DropdownMenuTrigger>
