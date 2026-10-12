<script lang="ts">
import { EMPTY_MENTIONS, MentionInput } from "@baby-ui/svelte";

const people = [
	{ id: "u1", name: "Ada Park", role: "Design lead" },
	{ id: "u2", name: "Marcus Webb", role: "Engineer" },
];
const channels = [{ id: "c1", name: "general" }];
let value = $state(EMPTY_MENTIONS);
</script>

<MentionInput bind:value {people} {channels} />
