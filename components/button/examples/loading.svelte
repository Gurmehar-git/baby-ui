<script lang="ts">
import { Button } from "@baby-ui/components/svelte/button";

let saving = $state(false);

async function save() {
	saving = true;
	await new Promise((done) => setTimeout(done, 1200));
	saving = false;
}
</script>

<Button onclick={save} loading={saving} loadingLabel="Saving changes">Save changes</Button>
