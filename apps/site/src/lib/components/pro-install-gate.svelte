<script lang="ts">
import { IconLock } from "@baby-ui/icons";
import { Button } from "@baby-ui/svelte";
import { page } from "$app/state";

let { name }: { name: string } = $props();
</script>

<!-- Pro source ships from the private registry, behind sign-in. -->
<div class="relative grid min-h-80 place-items-center overflow-hidden rounded-2xl border border-border bg-card p-6 text-center">
	<div aria-hidden="true" class="absolute inset-6 grid content-center gap-4 opacity-35 blur-[3px]">
		<span class="h-3 w-2/3 rounded-full bg-foreground/10"></span>
		<span class="h-3 w-5/6 rounded-full bg-foreground/10"></span>
		<span class="h-24 rounded-xl border border-border bg-background/70"></span>
		<span class="h-3 w-1/2 rounded-full bg-foreground/10"></span>
	</div>
	<div class="relative z-1 flex max-w-md flex-col items-center">
		<span class="grid size-11 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-xs">
			<IconLock size={17} />
		</span>
		<p class="mt-4 font-medium text-foreground text-sm">Source code is part of Pro</p>
		<p class="mt-1.5 text-muted-foreground text-sm leading-6">
			Get Pro to install {name} with the CLI and copy its React and Svelte source.
		</p>
		<div class="mt-5 flex flex-wrap justify-center gap-2">
			<Button size="sm" href="/pricing">Unlock with Pro</Button>
			<Button size="sm" variant="outline" href="/login?next={encodeURIComponent(page.url.pathname)}">
				Already Pro? Sign in
			</Button>
		</div>
	</div>
</div>
