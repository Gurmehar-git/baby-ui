<script lang="ts">
import { untrack } from "svelte";
import type { SVGAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { createIconMorph } from "../engine";
import {
	type IconMorphName,
	type IconTreeOptions,
	iconTree,
	type MorphNode,
	paint,
	rest,
	staticAttrs,
} from "../icons";
import { type IconMorphSize, iconMorph } from "../variants";

let {
	name,
	state: pressed = false,
	size = "default",
	strokeWidth = 1.75,
	turn,
	pointing,
	class: classProp,
	...svgProps
}: {
	name: IconMorphName;
	/**
	 * The second look. menu: close, play: pause, plus: check, copy: check, theme: moon,
	 * chevron: turned, bell: on, heart: liked.
	 */
	state?: boolean;
	size?: IconMorphSize;
	/** Stroke width in the 24-unit grid. */
	strokeWidth?: number;
	class?: string;
} & IconTreeOptions &
	Omit<SVGAttributes<SVGSVGElement>, "class" | "name"> = $props();

const uid = $props.id();
const id = uid.replace(/[^a-zA-Z0-9-]/g, "");
const tree = $derived(iconTree(name, { turn, pointing }));
let svg = $state<SVGSVGElement>();
let engine: ReturnType<typeof createIconMorph> | null = null;
// The look each tree first paints; after that the engine owns every animated value.
const initial = $derived.by(() => {
	tree;
	return untrack(() => pressed);
});

$effect(() => {
	const el = svg;
	const nodes = tree;
	if (!el) return;
	const created = untrack(() => createIconMorph(el, nodes, initial));
	engine = created;
	return () => created.destroy();
});
$effect(() => {
	engine?.set(pressed);
});

function look(node: MorphNode, on: boolean) {
	const { attrs, style } = paint(node, rest(node, on));
	return {
		...staticAttrs(node, id),
		...attrs,
		style: Object.entries(style)
			.map(([key, value]) => `${key}:${value}`)
			.join(";"),
	};
}
</script>

{#snippet nodes(list: MorphNode[], on: boolean)}
	{#each list as node (node.i)}
		<svelte:element this={node.tag} xmlns="http://www.w3.org/2000/svg" data-m={node.i} {...look(node, on)}>
			{#if node.children}{@render nodes(node.children, on)}{/if}
		</svelte:element>
	{/each}
{/snippet}

{#key tree}
	<svg
		bind:this={svg}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
		data-slot="icon-morph"
		data-name={name}
		data-on={pressed}
		class={cn(iconMorph({ size }), classProp)}
		{...svgProps}
	>
		{@render nodes(tree, initial)}
	</svg>
{/key}
