<script lang="ts">
import { PasswordInput, passwordRules } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof PasswordInput>>(props));
const RULES = passwordRules(12);
</script>

<div class="w-full max-w-xs">
	<PasswordInput label={p.label || "New password"} placeholder="New password" rules={RULES} size={p.size} />
</div>
