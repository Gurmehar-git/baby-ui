<script lang="ts">
import { CommentThread, type ThreadComment } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { THREAD_COMMENTS, THREAD_ME, THREAD_PEOPLE } from "../data/comment-thread";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof CommentThread>>(props));
let comments = $state<ThreadComment[]>(THREAD_COMMENTS);
let resolved = $state(false);
</script>

<div class="w-full max-w-lg">
	<CommentThread
		title="Hero headline"
		bind:comments
		bind:resolved
		currentUser={THREAD_ME}
		people={THREAD_PEOPLE}
		variant={p.variant}
	/>
</div>
