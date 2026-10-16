<script lang="ts" module>
import type { Snippet } from "svelte";

export type SplitButtonAction = {
	label: string;
	onSelect: () => void;
	icon?: Snippet;
	destructive?: boolean;
	disabled?: boolean;
};
</script>

<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import ButtonGroup from "../../button-group/svelte/button-group.svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/svelte/cn";
import { type SplitButtonSize, type SplitButtonVariant, splitButton } from "./variants";

let {
	label,
	onclick,
	icon,
	actions,
	menuLabel = "More options",
	variant = "default",
	size = "default",
	disabled = false,
	class: classProp,
}: {
	/** The primary action's label. */
	label: string;
	onclick?: () => void;
	icon?: Snippet;
	/** Related actions in the chevron's menu. */
	actions: SplitButtonAction[];
	/** Accessible name of the chevron; defaults to "More options". */
	menuLabel?: string;
	variant?: SplitButtonVariant;
	size?: SplitButtonSize;
	disabled?: boolean;
	class?: string;
} = $props();

const s = $derived(splitButton({ variant, size }));
</script>

<ButtonGroup data-slot="split-button" class={classProp}>
	<Button {variant} {size} {disabled} {onclick} class={s.main()}>
		{@render icon?.()}
		{label}
	</Button>
	<DropdownMenu>
		<DropdownMenuTrigger {disabled}>
			{#snippet child({ props })}
				<Button {...props} {variant} {size} {disabled} aria-label={menuLabel} class={cn(String(props.class ?? ""), s.menu())}>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</Button>
			{/snippet}
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" sideOffset={6}>
			{#each actions as action (action.label)}
				<DropdownMenuItem
					destructive={action.destructive}
					disabled={action.disabled}
					class={s.item()}
					onSelect={action.onSelect}
				>
					{@render action.icon?.()}
					{action.label}
				</DropdownMenuItem>
			{/each}
		</DropdownMenuContent>
	</DropdownMenu>
</ButtonGroup>
