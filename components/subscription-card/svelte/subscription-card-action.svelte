<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import type { SubscriptionPending } from "../subscription-core";
import { subscriptionCardState } from "./context";

let {
	kind,
	variant = "outline",
	class: classProp,
	onclick,
	children,
}: {
	kind: SubscriptionPending;
	variant?: "outline" | "default" | "ghost";
	class?: string;
	onclick?: () => void;
	children: Snippet;
} = $props();

const ctx = subscriptionCardState("SubscriptionCardAction");
</script>

<!-- Internal: one footer button that spins while its own action is pending. -->
<Button
	size="sm"
	{variant}
	class={classProp}
	loading={ctx.pending === kind}
	disabled={ctx.pending !== null && ctx.pending !== kind}
	{onclick}
>
	{@render children()}
</Button>
