<script lang="ts">
import { SearchInput } from "@baby-ui/svelte";

let query = $state("");
</script>

<SearchInput label="Search projects" shortcut="/" bind:value={query} />
