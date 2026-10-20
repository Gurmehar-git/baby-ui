<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { magicLinkView } from "../variants";
import { magicLinkLoginState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginSent");
</script>

<!-- The second view, after the link is sent. -->
<div
	data-view="sent"
	class={cn(ctx.styles.view(), magicLinkView({ active: ctx.view === "sent" }), classProp)}
	inert={ctx.view !== "sent"}
>
	{@render children?.()}
</div>
