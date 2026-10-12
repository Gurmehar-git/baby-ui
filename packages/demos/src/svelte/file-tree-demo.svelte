<script lang="ts">
import { FileTree } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { SAMPLE_TREE } from "./sample-tree";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FileTree>>(props));
</script>

<FileTree
	tree={SAMPLE_TREE}
	indent={Number(props.indent ?? 14)}
	showGuides={props.showGuides !== false}
	defaultExpanded={props.defaultExpanded !== false}
	size={p.size ?? "default"}
	class="w-64"
/>
