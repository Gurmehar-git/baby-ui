<script lang="ts">
import { ShortcutRecorder } from "@baby-ui/svelte";

let shortcut = $state<string | null>("mod+k");
</script>

<ShortcutRecorder label="Open search" bind:value={shortcut} defaultValue="mod+k" />
