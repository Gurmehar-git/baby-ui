<script lang="ts">
import { Button, IconMorph } from "@baby-ui/svelte";

let open = $state(false);
</script>

<Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} onclick={() => (open = !open)}>
	<IconMorph name="menu" state={open} />
</Button>
