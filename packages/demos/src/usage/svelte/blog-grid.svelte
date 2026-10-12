<script lang="ts">
import { BlogGrid } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";

let { posts }: { posts: ComponentProps<typeof BlogGrid>["posts"] } = $props();
</script>

<BlogGrid {posts} title="Blog" getHref={(post) => `/blog/${post.id}`} />
