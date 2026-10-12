<script lang="ts">
import {
	Button,
	Input,
	NativeSelect,
	NativeSelectOption,
	Textarea,
} from "@baby-ui/svelte";

// Hover and focus can't be forced from markup, so the row says what each one does instead.
const STATES = [
	{
		label: "Rest",
		note: "border-input on the field fill",
		invalid: false,
		disabled: false,
	},
	{
		label: "Invalid",
		note: "border-destructive, halo on focus",
		invalid: true,
		disabled: false,
	},
	{ label: "Disabled", note: "opacity-50, not-allowed", invalid: false, disabled: true },
];
</script>

<div class="overflow-hidden rounded-2xl border border-border">
	<div class="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
		{#each STATES as state (state.label)}
			<div class="flex flex-col gap-3 p-4">
				<div>
					<p class="font-medium text-foreground text-sm">{state.label}</p>
					<p class="font-mono text-muted-foreground text-xs">{state.note}</p>
				</div>
				<Input placeholder="name@acme.dev" aria-label="{state.label} input" aria-invalid={state.invalid || undefined} disabled={state.disabled} />
				<NativeSelect aria-label="{state.label} select" class="w-full" aria-invalid={state.invalid || undefined} disabled={state.disabled}>
					<NativeSelectOption value="a">Frankfurt</NativeSelectOption>
				</NativeSelect>
				<Textarea placeholder="Notes" aria-label="{state.label} notes" aria-invalid={state.invalid || undefined} disabled={state.disabled} />
				<Button disabled={state.disabled} variant={state.invalid ? "destructive" : "default"}>
					{state.invalid ? "Delete" : "Save"}
				</Button>
			</div>
		{/each}
	</div>
	<p class="border-border border-t bg-card px-4 py-2.5 text-muted-foreground text-xs">
		Hover lifts the edge toward muted-foreground. Focus or open draws the ring border with a soft halo;
		pressables add an offset ring. Tab through to see it.
	</p>
</div>
