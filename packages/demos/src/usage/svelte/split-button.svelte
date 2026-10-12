<script lang="ts">
import { SplitButton } from "@baby-ui/svelte";

let { save, saveAs }: { save: () => void; saveAs: () => void } = $props();
</script>

<SplitButton label="Save" onclick={save} actions={[{ label: "Save as…", onSelect: saveAs }]} />
