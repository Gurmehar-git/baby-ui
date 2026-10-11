<script lang="ts">
import type { KeyBinding } from "@baby-ui/registry-schema";
import {
	shortcutCap,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@baby-ui/svelte";

let { bindings }: { bindings: KeyBinding[] } = $props();
</script>

<Table>
	<TableHeader>
		<TableRow>
			<TableHead class="w-[40%]">Keys</TableHead>
			<TableHead>Action</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each bindings as binding (binding.keys.join() + binding.action)}
			<TableRow>
				<TableCell class="align-top">
					<span class="flex flex-wrap gap-1">
						{#each binding.keys as key (key)}
							<kbd class={shortcutCap()}>{key}</kbd>
						{/each}
					</span>
				</TableCell>
				<TableCell class="whitespace-normal text-muted-foreground">{binding.action}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
