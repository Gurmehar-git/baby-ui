<script lang="ts">
import {
	SplitButton,
	SplitButtonAction,
	SplitButtonContent,
	SplitButtonItem,
	SplitButtonMenu,
	SplitButtonTrigger,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SplitButton>>(props));
let last = $state("");
</script>

<div class="flex flex-col items-center gap-3">
	<SplitButton variant={p.variant} size={p.size}>
		<SplitButtonAction onclick={() => (last = "Merged")}>Merge</SplitButtonAction>
		<SplitButtonMenu>
			<SplitButtonTrigger />
			<SplitButtonContent>
				<SplitButtonItem onSelect={() => (last = "Squashed and merged")}>
					Squash and merge
				</SplitButtonItem>
				<SplitButtonItem onSelect={() => (last = "Rebased and merged")}>
					Rebase and merge
				</SplitButtonItem>
				<SplitButtonItem destructive onSelect={() => (last = "Closed")}>
					Close pull request
				</SplitButtonItem>
			</SplitButtonContent>
		</SplitButtonMenu>
	</SplitButton>
	<p class="h-4 text-muted-foreground text-xs">{last}</p>
</div>
