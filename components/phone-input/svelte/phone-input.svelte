<script lang="ts" module>
import type { PhoneCountry, PhoneStatus } from "../phone";

export type PhoneInputDetails = {
	country: PhoneCountry;
	/** The number as shown, without the calling code. */
	formatted: string;
	status: PhoneStatus;
	valid: boolean;
};
</script>

<script lang="ts">
import { tick, untrack } from "svelte";
import Combobox from "../../combobox/svelte/combobox.svelte";
import ComboboxContent from "../../combobox/svelte/combobox-content.svelte";
import ComboboxTrigger from "../../combobox/svelte/combobox-trigger.svelte";
import CommandEmpty from "../../command/svelte/command-empty.svelte";
import CommandGroup from "../../command/svelte/command-group.svelte";
import CommandInput from "../../command/svelte/command-input.svelte";
import CommandItem from "../../command/svelte/command-item.svelte";
import CommandList from "../../command/svelte/command-list.svelte";
import InputGroup from "../../input-group/svelte/input-group.svelte";
import InputGroupAddon from "../../input-group/svelte/input-group-addon.svelte";
import InputGroupInput from "../../input-group/svelte/input-group-input.svelte";
import type { InputGroupSize } from "../../input-group/variants";
import { cn } from "../../lib/cn";
import {
	capDigits,
	caretAfterDigits,
	FALLBACK_COUNTRY,
	findCountry,
	flagOf,
	formatNational,
	onlyDigits,
	PHONE_COUNTRIES,
	parsePhoneNumber,
	phoneStatus,
	toE164,
} from "../phone";
import { type PhoneInputVariant, phoneInput } from "../variants";

let {
	label,
	value = $bindable(),
	onValueChange,
	country = $bindable(),
	defaultCountry = "US",
	onCountryChange,
	countries,
	preferredCountries = [],
	validate = true,
	error: errorProp,
	name,
	disabled = false,
	variant = "default",
	size = "default",
	class: classProp,
}: {
	/** Accessible name of the number field. */
	label: string;
	/** The number in E.164, such as "+14155550132"; bindable. */
	value?: string;
	onValueChange?: (value: string, details: PhoneInputDetails) => void;
	/** ISO code of the selected country; bindable. */
	country?: string;
	defaultCountry?: string;
	onCountryChange?: (iso: string) => void;
	/** Limit the picker to these ISO codes. */
	countries?: string[];
	/** Pinned at the top of the picker. */
	preferredCountries?: string[];
	/** Show a message after blur when the number is incomplete. */
	validate?: boolean;
	/** Replaces the built-in validation message. */
	error?: string;
	/** Adds a hidden input carrying the E.164 value. */
	name?: string;
	disabled?: boolean;
	variant?: PhoneInputVariant;
	size?: InputGroupSize;
	class?: string;
} = $props();

const uid = $props.id();
const messageId = `${uid}-message`;
const pool = $derived(countries?.length ? PHONE_COUNTRIES.filter((c) => countries.includes(c.iso)) : PHONE_COUNTRIES);
const initial = untrack(() => parsePhoneNumber(value ?? "", pool));
let ownIso = $state(untrack(() => initial?.country.iso ?? defaultCountry));
let ownDigits = $state(untrack(() => initial?.national ?? ""));
const iso = $derived(country ?? ownIso);
const entry = $derived(findCountry(iso) ?? pool[0] ?? FALLBACK_COUNTRY);
// A bound E.164 value decides the digits; otherwise the field keeps its own.
const digits = $derived(value !== undefined ? (parsePhoneNumber(value, pool)?.national ?? "") : ownDigits);
const formatted = $derived(formatNational(entry, digits));
const status = $derived(phoneStatus(entry, digits));
let open = $state(false);
let blurred = $state(false);
let input = $state<HTMLInputElement | null>(null);

function setIso(next: string) {
	if (country === undefined) ownIso = next;
	else country = next;
	onCountryChange?.(next);
}
function emit(next: typeof entry, nextDigits: string) {
	const e164 = toE164(next, nextDigits);
	if (value === undefined) ownDigits = nextDigits;
	else value = e164;
	const nextStatus = phoneStatus(next, nextDigits);
	onValueChange?.(e164, {
		country: next,
		formatted: formatNational(next, nextDigits),
		status: nextStatus,
		valid: nextStatus === "valid",
	});
}
async function oninput(event: Event & { currentTarget: HTMLInputElement }) {
	const raw = event.currentTarget.value;
	const at = event.currentTarget.selectionStart ?? raw.length;
	let count = onlyDigits(raw.slice(0, at)).length;
	// An international number switches the country to match.
	const parsed = /^\s*(\+|00)/.test(raw) ? parsePhoneNumber(raw, pool) : null;
	if (parsed) {
		setIso(parsed.country.iso);
		count = parsed.national.length;
		emit(parsed.country, parsed.national);
	} else emit(entry, capDigits(entry, onlyDigits(raw)));
	await tick();
	if (!input) return;
	input.value = formatted;
	const caret = caretAfterDigits(input.value, count);
	input.setSelectionRange(caret, caret);
}

const message = $derived(
	errorProp ??
		(validate && blurred && (status === "incomplete" || status === "too-long")
			? `Enter a full number for ${entry.name}.`
			: undefined),
);
const s = $derived(phoneInput({ variant }));
const preferred = $derived(pool.filter((c) => preferredCountries.includes(c.iso)));
const rest = $derived(pool.filter((c) => !preferredCountries.includes(c.iso)));
</script>

{#snippet item(c: typeof entry)}
	<CommandItem
		value={c.iso}
		keywords="{c.name} +{c.dial} {c.dial}"
		onSelect={() => {
			setIso(c.iso);
			emit(c, capDigits(c, digits));
			open = false;
			input?.focus();
		}}
	>
		<span class={s.item()}>
			<span aria-hidden="true" class={s.flag()}>{flagOf(c.iso)}</span>
			{c.name}
			<span class={s.itemDial()}>+{c.dial}</span>
		</span>
	</CommandItem>
{/snippet}

<div data-slot="phone-input" class={cn(s.root(), classProp)}>
	<InputGroup {size}>
		<InputGroupAddon>
			<Combobox bind:open>
				<ComboboxTrigger {disabled} aria-label="Country: {entry.name}, +{entry.dial}" class={s.trigger()}>
					<span aria-hidden="true" class={s.flag()}>{flagOf(entry.iso)}</span>
					<span class={s.dial()}>+{entry.dial}</span>
				</ComboboxTrigger>
				<ComboboxContent class="w-64">
					<CommandInput placeholder="Search countries" />
					<CommandList>
						<CommandEmpty>No country found</CommandEmpty>
						{#if preferred.length}
							<CommandGroup heading="Suggested">
								{#each preferred as c (c.iso)}{@render item(c)}{/each}
							</CommandGroup>
						{/if}
						<CommandGroup heading={preferred.length ? "All countries" : undefined}>
							{#each rest as c (c.iso)}{@render item(c)}{/each}
						</CommandGroup>
					</CommandList>
				</ComboboxContent>
			</Combobox>
		</InputGroupAddon>
		<InputGroupInput
			bind:ref={input}
			type="tel"
			inputmode="tel"
			autocomplete="tel-national"
			aria-label={label}
			aria-invalid={!!message || undefined}
			aria-describedby={message ? messageId : undefined}
			placeholder={formatNational(entry, entry.example)}
			{disabled}
			value={formatted}
			class={s.input()}
			onfocus={() => (blurred = false)}
			onblur={() => (blurred = true)}
			{oninput}
		/>
	</InputGroup>
	{#if name}<input type="hidden" {name} value={toE164(entry, digits)} />{/if}
	{#if message}
		<span id={messageId} role="alert" data-tone="error" class={s.message()}>{message}</span>
	{/if}
</div>
