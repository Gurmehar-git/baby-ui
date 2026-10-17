<script lang="ts">
import type { ComponentProps, Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import type { ButtonSize, ButtonVariant } from "../../button/variants";
import { cn } from "../../lib/cn";
import { morph, trackActiveWidth } from "../../lib/morph";
import { actionButton } from "../variants";

let {
	label,
	successLabel = "Done",
	pendingLabel = "Working…",
	onAction,
	resetAfterMs = 1800,
	onActionError,
	icon,
	variant,
	size,
	class: classProp,
	...rest
}: Omit<ComponentProps<typeof Button>, "onclick" | "children" | "loading" | "href"> & {
	label: string;
	/** Shown with a drawn tick after the action succeeds. */
	successLabel?: string;
	/** Beside the spinner while a returned promise runs. */
	pendingLabel?: string;
	/** Runs on click. Return a promise to show the pending state. */
	onAction: () => unknown;
	/** How long the success state stays, in ms. */
	resetAfterMs?: number;
	onActionError?: (error: unknown) => void;
	icon?: Snippet;
	variant?: ButtonVariant;
	size?: ButtonSize;
} = $props();

let state = $state<"idle" | "pending" | "success">("idle");
let timer = 0;
let alive = true;
$effect(() => () => {
	alive = false;
	clearTimeout(timer);
});

async function run() {
	if (state !== "idle") return;
	try {
		const result = onAction();
		if (result instanceof Promise) {
			state = "pending";
			await result;
		}
		if (!alive) return;
		state = "success";
		clearTimeout(timer);
		timer = window.setTimeout(() => (state = "idle"), resetAfterMs);
	} catch (error) {
		if (!alive) return;
		state = "idle";
		onActionError?.(error);
	}
}

const s = actionButton();
const m = morph();
const done = $derived(state === "success");
</script>

<Button
	{...rest}
	{variant}
	{size}
	data-slot="action-button"
	data-state={state}
	loading={state === "pending"}
	loadingLabel={pendingLabel}
	class={cn("group/action", classProp)}
	onclick={run}
>
	<span class={s.face()}>
		<!-- Without an icon the slot stays mounted at zero width, so the tick can still draw in. -->
		<span aria-hidden="true" data-empty={!icon} class={s.icon()}>
			{#if icon}<span data-on={!done} class={m.icon()}>{@render icon()}</span>{/if}
			<span data-on={done} class={m.icon()}>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M4 12.5l5 5L20 6.5" pathLength="1" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class={s.tick()} />
				</svg>
			</span>
		</span>
		<span {@attach trackActiveWidth} class={m.frame()}>
			<span data-on={!done} class={m.face()}>{label}</span>
			<span data-on={done} class={m.face()}>{successLabel}</span>
		</span>
	</span>
</Button>
<span class="sr-only" role="status">{done ? successLabel : ""}</span>
