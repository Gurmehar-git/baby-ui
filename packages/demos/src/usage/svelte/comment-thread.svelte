<script lang="ts">
import { CommentThread, type ThreadComment } from "@baby-ui/svelte";

const me = { id: "you", name: "Sam Rivera" };
let comments = $state<ThreadComment[]>([
	{ id: "1", author: { id: "ada", name: "Ada Park" }, body: "Ship it?", createdAt: "2h" },
]);
</script>

<CommentThread bind:comments currentUser={me} />
