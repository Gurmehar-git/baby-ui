<script lang="ts">
import { Button, Markdown } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Markdown>>(props));

const SAMPLE = [
	"## Installing",
	"Components are **copied into your project**, not installed. Run `shadcn add` and the source is yours.",
	"",
	"1. You own the source",
	"2. Nothing is imported at runtime",
	"3. Updates are a [diff](https://git-scm.com/docs/git-diff), not a version bump",
	"",
	"| Port | Primitives |",
	"| --- | --- |",
	"| React | Base UI |",
	"| Svelte | bits-ui |",
	"",
	"```bash",
	"npx shadcn add @baby-ui/button",
	"```",
].join("\n");
// Whitespace stays on the chunk before it, so the joined text is the sample verbatim.
const CHUNKS = SAMPLE.split(/(?<=\s)/);

let count = $state(0);
let run = $state(0);

// The scripted stream lives here; the component only renders what it is given.
$effect(() => {
	void run;
	void p.animate;
	count = 0;
	const timer = setInterval(() => {
		count += 1;
		if (count >= CHUNKS.length) clearInterval(timer);
	}, 40);
	return () => clearInterval(timer);
});

const content = $derived(CHUNKS.slice(0, count).join(""));
</script>

<div class="flex w-full max-w-md flex-col items-start gap-3">
	<Markdown
		{content}
		streaming={count < CHUNKS.length}
		variant={p.variant ?? "default"}
		size={p.size ?? "default"}
		animate={p.animate ?? "fade"}
		caret={p.caret ?? true}
		class="w-full"
	/>
	<Button variant="outline" size="sm" onclick={() => (run += 1)}>Replay</Button>
</div>
