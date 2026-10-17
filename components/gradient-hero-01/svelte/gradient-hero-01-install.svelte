<script lang="ts">
import CopyButton from "../../copy-button/svelte/copy-button.svelte";
import { cn } from "../../lib/cn";
import { gradientHero01State } from "./context";

let { command, class: classProp }: { command: string; class?: string } = $props();
const hero = gradientHero01State();
</script>

<!-- An install command in a pill with a copy button, e.g. `npm i acme`. -->
<div data-slot="gradient-hero-01-install" class={cn(hero.styles.install(), classProp)}>
	<span aria-hidden="true">$</span>
	<code>{command}</code>
	<CopyButton text={command} label="Copy install command" iconOnly />
</div>
