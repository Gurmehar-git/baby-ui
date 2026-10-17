<script lang="ts">
import {
	Field,
	FieldDescription,
	FieldLabel,
	Textarea,
	TextareaCount,
} from "@baby-ui/svelte";

let value = $state("");
</script>

<Field>
	<FieldLabel for="notes">Release notes</FieldLabel>
	<Textarea
		id="notes"
		bind:value
		aria-describedby="notes-description"
		maxlength={280}
		autoGrow
	/>
	<div class="flex items-start justify-between gap-3">
		<FieldDescription id="notes-description">Markdown is supported.</FieldDescription>
		<TextareaCount value={value.length} max={280} />
	</div>
</Field>
