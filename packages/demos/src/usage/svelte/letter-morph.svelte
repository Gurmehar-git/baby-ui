<script lang="ts">
import { LetterMorph } from "@baby-ui/svelte";

let { following }: { following: boolean } = $props();
</script>

<LetterMorph text={following ? "Following" : "Follow"} />
