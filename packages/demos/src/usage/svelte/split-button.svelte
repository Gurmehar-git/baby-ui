<script lang="ts">
import {
	SplitButton,
	SplitButtonAction,
	SplitButtonContent,
	SplitButtonItem,
	SplitButtonMenu,
	SplitButtonTrigger,
} from "@baby-ui/svelte";

let { save, saveAs }: { save: () => void; saveAs: () => void } = $props();
</script>

<SplitButton>
	<SplitButtonAction onclick={save}>Save</SplitButtonAction>
	<SplitButtonMenu>
		<SplitButtonTrigger />
		<SplitButtonContent>
			<SplitButtonItem onSelect={saveAs}>Save as…</SplitButtonItem>
		</SplitButtonContent>
	</SplitButtonMenu>
</SplitButton>
