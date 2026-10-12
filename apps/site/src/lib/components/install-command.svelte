<script lang="ts">
import { installArgs } from "#lib/install.js";
import { prefs } from "#lib/preferences.svelte.js";
import PmCommand from "./pm-command.svelte";

let { slug, cascade = false }: { slug: string; cascade?: boolean } = $props();
</script>

<PmCommand
	kind="dlx"
	args={installArgs(slug, prefs.framework, prefs.dialect)}
	highlight="{slug}.json"
	{cascade}
	analytics={{ event: "install_copied", props: { item: slug, method: "cli" } }}
/>
