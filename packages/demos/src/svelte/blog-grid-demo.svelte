<script lang="ts">
import { BlogGrid } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { BLOG_POSTS } from "../data/blog";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof BlogGrid>>(props));
</script>

{#key p.variant}
	<BlogGrid
		posts={BLOG_POSTS}
		variant={p.variant}
		description="Product news, design notes and engineering deep dives from the team."
		categories={["Product", "Design", "Engineering", "Company"]}
		pageSize={3}
		locale="en-US"
	/>
{/key}
