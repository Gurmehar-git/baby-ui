<script lang="ts">
import type { ComponentSpec, PropSpec } from "@baby-ui/registry-schema";
import {
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Slider,
	Switch,
} from "@baby-ui/svelte";
import { untrack } from "svelte";

let {
	spec,
	values = $bindable(),
}: { spec: ComponentSpec; values: Record<string, unknown> } = $props();

function seed(target: ComponentSpec): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const prop of target.props) {
		const { control } = prop;
		if (control.kind === "none") continue;
		if (control.kind === "boolean") out[prop.name] = Boolean(prop.default);
		else if (control.kind === "number")
			out[prop.name] = Number(prop.default ?? control.min ?? 0);
		else if (control.kind === "color") out[prop.name] = String(prop.default ?? "#a78bfa");
		else out[prop.name] = String(prop.default ?? "");
	}
	return out;
}

// The parent keys this component on the slug, so reading spec once is the intent. Values the
// parent already holds (a shared link) win over the spec defaults.
let state = $state(
	untrack(() => {
		const base = seed(spec);
		return {
			...base,
			...Object.fromEntries(Object.entries(values ?? {}).filter(([key]) => key in base)),
		};
	}),
);

const dials = $derived(
	spec.props.filter(
		(p) =>
			p.control.kind !== "none" &&
			Object.entries(p.showWhen ?? {}).every(([name, allowed]) =>
				allowed.includes(state[name] as string | number | boolean),
			),
	),
);

$effect(() => {
	values = { ...state };
});

function label(prop: PropSpec) {
	return prop.name.replace(/([a-z])([A-Z])/g, "$1 $2");
}
</script>

{#snippet dial(prop: PropSpec)}
	{@const control = prop.control}
	{@const row = "flex min-h-8 items-center justify-between gap-3 px-3 py-1.5"}
	{@const text = "truncate font-medium text-muted-foreground text-xs capitalize"}
	{#if control.kind === "boolean"}
		<!-- The row is the label: a wrapping <label> names and toggles the bare switch. -->
		<label class={row}>
			<span class={text}>{label(prop)}</span>
			<Switch
				size="sm"
				bind:checked={() => Boolean(state[prop.name]), (next) => (state[prop.name] = next)}
			/>
		</label>
	{:else}
		<div class={row}>
			<label for="dial-{prop.name}" class={text}>{label(prop)}</label>

			{#if control.kind === "select"}
				<Select
					bind:value={() => String(state[prop.name] ?? ""), (next) => (state[prop.name] = next)}
					items={control.options.map((o) => ({ value: o, label: o }))}
				>
					<SelectTrigger aria-label={label(prop)} size="sm" class="w-32">
						<SelectValue />
					</SelectTrigger>
					<SelectContent size="sm">
						{#each control.options as option (option)}
							<SelectItem value={option} label={option}>{option}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			{:else if control.kind === "number"}
				<div class="flex w-32 items-center gap-2">
					<Slider
						label={label(prop)}
						min={control.min ?? 0}
						max={control.max ?? 100}
						step={control.step}
						bind:value={() => Number(state[prop.name] ?? 0), (next) => (state[prop.name] = next)}
					/>
					<span class="w-8 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
						{state[prop.name]}
					</span>
				</div>
			{:else if control.kind === "color"}
				<input
					id="dial-{prop.name}"
					type="color"
					aria-label={label(prop)}
					value={String(state[prop.name] ?? "#a78bfa")}
					oninput={(event) => {
						state[prop.name] = event.currentTarget.value;
					}}
					class="size-7 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
				/>
			{:else if control.kind === "text"}
				<Input
					id="dial-{prop.name}"
					size="sm"
					placeholder={control.placeholder}
					bind:value={() => String(state[prop.name] ?? ""), (next) => (state[prop.name] = next)}
					class="w-32"
				/>
			{/if}
		</div>
	{/if}
{/snippet}

<div class="flex flex-col">
	{#each dials as prop (prop.name)}
		{@render dial(prop)}
	{/each}
</div>
