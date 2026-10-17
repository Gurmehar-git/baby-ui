<script lang="ts">
import { installArgs } from "#lib/install.js";
import PmCommand from "./pm-command.svelte";

let { slug, cascade = false }: { slug: string; cascade?: boolean } = $props();
</script>

<PmCommand
	kind="dlx"
	args={installArgs(slug)}
	highlight={slug}
	{cascade}
	analytics={{ event: "install_copied", props: { item: slug, method: "cli" } }}
/>
