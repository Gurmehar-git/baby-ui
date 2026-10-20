<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { magicLinkView } from "../variants";
import { magicLinkLoginState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginForm");
</script>

<!-- The first view: header, providers, email field and legal copy. -->
<div
	data-view="form"
	class={cn(ctx.styles.view(), magicLinkView({ active: ctx.view === "form" }), classProp)}
	inert={ctx.view !== "form"}
>
	{@render children?.()}
</div>
