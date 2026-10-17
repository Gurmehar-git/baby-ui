<script lang="ts">
import { cn } from "../../lib/cn";
import { type GibberishTextSize, gibberishText } from "../variants";

let {
	text,
	speedMs = 24,
	size = "default",
	class: classProp,
}: {
	text: string;
	/** Interval between scramble frames, in ms. */
	speedMs?: number;
	size?: GibberishTextSize;
	class?: string;
} = $props();

function randomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

// svelte-ignore state_referenced_locally -- one-time seed; the $effect below resets it whenever text changes
let display = $state(text.split(""));

$effect(() => {
	const letters = text.split("");
	display = [...letters];
	const timers = letters.map((letter, i) => {
		let count = Math.floor(Math.random() * 10) + 5;
		const id = setInterval(() => {
			display[i] = randomUpper();
			count--;
			if (count === 0) {
				display[i] = letter;
				clearInterval(id);
			}
		}, speedMs);
		return id;
	});
	return () => {
		for (const id of timers) clearInterval(id);
	};
});

const letterClass = $derived(cn(gibberishText({ size }), classProp));
</script>

<span data-slot="gibberish-text">
	{#each display as char, i (i)}
		<span class={letterClass}>{char === " " ? "\u00a0" : char}</span>
	{/each}
</span>
