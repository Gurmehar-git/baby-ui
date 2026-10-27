<script lang="ts">
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Dialog>>(props));

let open = $state(false);
let domain = $state("");
const id = $props.id();
</script>

<Dialog
	bind:open
	motion={p.motion ?? "zoom"}
	size={p.size ?? "default"}
	variant={p.variant ?? "default"}
	dismissOnBackdrop={p.dismissOnBackdrop !== false}
>
	<DialogTrigger class="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 font-medium text-foreground text-sm">Add domain</DialogTrigger>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>
				<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
					<path d="M2.5 10h15M10 2.5c2.5 2.5 2.5 12.5 0 15M10 2.5c-2.5 2.5-2.5 12.5 0 15" stroke="currentColor" stroke-width="1.5" />
				</svg>
				Add a domain
			</DialogTitle>
			<DialogDescription>Add an existing domain to your baby-ui project.</DialogDescription>
		</DialogHeader>
		<DialogClose />
		<div class="mt-4 flex flex-col gap-1.5">
			<Label for={id}>Domain</Label>
			<Input {id} bind:value={domain} placeholder="example.com" />
			<p class="text-muted-foreground text-sm">We'll guide you through DNS configuration next.</p>
		</div>
		<DialogFooter>
			<Button variant="ghost" size="sm" onclick={() => (open = false)}>
				Cancel
			</Button>
			<Button size="sm" class="ml-auto" onclick={() => (open = false)}>
				Add
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
