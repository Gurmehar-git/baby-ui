<script lang="ts" module>
export type MoneyInputDetails = {
	currency: string;
	/** The amount as typed, without the symbol. */
	formatted: string;
};
</script>

<script lang="ts">
import { tick, untrack } from "svelte";
import Button from "../button/button.svelte";
import InputGroup from "../input-group/input-group.svelte";
import InputGroupAddon from "../input-group/input-group-addon.svelte";
import InputGroupInput from "../input-group/input-group-input.svelte";
import type { InputGroupSize } from "../input-group/variants";
import { cn } from "../lib/cn";
import Select from "../select/select.svelte";
import SelectContent from "../select/select-content.svelte";
import SelectItem from "../select/select-item.svelte";
import SelectTrigger from "../select/select-trigger.svelte";
import {
	caretAfter,
	cleanAmount,
	currencyInfo,
	formatMoney,
	fromMinor,
	groupAmount,
	significantBefore,
	toMinor,
} from "./money";
import { type MoneyInputVariant, moneyInput } from "./variants";

let {
	label,
	value = $bindable(),
	onValueChange,
	currency = $bindable(),
	defaultCurrency = "USD",
	onCurrencyChange,
	currencies,
	min,
	max,
	quickAdd = [],
	step,
	locale = "en-US",
	error: errorProp,
	name,
	disabled = false,
	variant = "default",
	size = "default",
	class: classProp,
}: {
	/** Accessible name of the amount field. */
	label: string;
	/** Amount in minor units (cents for USD, yen for JPY); `null` is empty. Bindable. */
	value?: number | null;
	onValueChange?: (value: number | null, details: MoneyInputDetails) => void;
	/** ISO 4217 code; bindable. */
	currency?: string;
	defaultCurrency?: string;
	onCurrencyChange?: (currency: string) => void;
	/** Codes offered by the currency menu; one code hides the menu. */
	currencies?: string[];
	/** Lowest amount in minor units, checked on blur. */
	min?: number;
	/** Highest amount in minor units; typing past it is refused with a nudge. */
	max?: number;
	/** Quick-add chips in major units; an empty array hides them. */
	quickAdd?: number[];
	/** Arrow keys move by this many minor units (Shift for ten times); one major unit by default. */
	step?: number;
	/** Formatting locale, fixed by default so server and client agree. */
	locale?: string;
	/** Replaces the built-in range message. */
	error?: string;
	/** Adds a hidden input carrying the amount in minor units. */
	name?: string;
	disabled?: boolean;
	variant?: MoneyInputVariant;
	size?: InputGroupSize;
	class?: string;
} = $props();

const uid = $props.id();
const messageId = `${uid}-message`;
let ownCurrency = $state(untrack(() => defaultCurrency));
const code = $derived(currency ?? ownCurrency);
const info = $derived(currencyInfo(code, locale));
let own = $state<number | null>(null);
const amount = $derived(value !== undefined ? value : own);
let focused = $state(false);
let draft = $state("");
let blurred = $state(false);
let input = $state<HTMLInputElement | null>(null);
const unit = $derived(step ?? 10 ** info.digits);
const text = $derived(focused ? groupAmount(draft, info) : groupAmount(fromMinor(amount, info), info));

function emit(next: number | null, clean: string, nextInfo = info) {
	if (value === undefined) own = next;
	else value = next;
	onValueChange?.(next, { currency: nextInfo.code, formatted: groupAmount(clean, nextInfo) });
}
function setAmount(next: number) {
	const bounded = Math.max(min ?? 0, max === undefined ? next : Math.min(max, next));
	const clean = fromMinor(bounded, info);
	draft = clean;
	emit(bounded, clean);
}
function pickCurrency(next: string) {
	if (!next) return;
	const nextInfo = currencyInfo(next, locale);
	const clean = cleanAmount(fromMinor(amount, info), nextInfo);
	if (currency === undefined) ownCurrency = next;
	else currency = next;
	onCurrencyChange?.(next);
	draft = clean;
	emit(toMinor(clean, nextInfo), clean, nextInfo);
}
async function oninput(event: Event & { currentTarget: HTMLInputElement }) {
	const el = event.currentTarget;
	const raw = el.value;
	const clean = cleanAmount(raw, info);
	const next = toMinor(clean, info);
	if (max !== undefined && next !== null && next > max) {
		el.value = text;
		// Restart the shake on every refusal.
		el.dataset.nudge = "false";
		el.getBoundingClientRect();
		el.dataset.nudge = "true";
		return;
	}
	const count = significantBefore(raw, el.selectionStart ?? raw.length, info);
	draft = clean;
	emit(next, clean);
	await tick();
	if (!input) return;
	input.value = text;
	const at = caretAfter(input.value, count, info);
	input.setSelectionRange(at, at);
}

const message = $derived(
	errorProp ??
		(blurred && amount !== null && min !== undefined && amount < min
			? `Enter at least ${formatMoney(min, code, locale)}.`
			: undefined),
);
const s = $derived(moneyInput({ variant }));
const menu = $derived((currencies?.length ?? 0) > 1);
</script>

<div data-slot="money-input" class={cn(s.root(), classProp)}>
	<InputGroup {size}>
		<InputGroupAddon>
			{#if menu}
				<Select
					bind:value={() => code, pickCurrency}
					items={(currencies ?? []).map((c) => ({ value: c, label: c }))}
				>
					<SelectTrigger aria-label="Currency" {disabled} class={s.currency()}>{code}</SelectTrigger>
					<SelectContent>
						{#each currencies ?? [] as c (c)}
							<SelectItem value={c} label={c}>
								{c} <span class="text-muted-foreground">{currencyInfo(c, locale).symbol}</span>
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			{:else}
				<span class={s.symbol()}>{info.symbol}</span>
			{/if}
		</InputGroupAddon>
		<InputGroupInput
			bind:ref={input}
			inputmode={info.digits ? "decimal" : "numeric"}
			autocomplete="off"
			aria-label="{label}, {code}"
			aria-invalid={!!message || undefined}
			aria-describedby={message ? messageId : undefined}
			placeholder={groupAmount(fromMinor(0, info), info)}
			{disabled}
			value={text}
			class={s.input()}
			onfocus={() => {
				// Same text as at rest, so a select-all on focus survives.
				draft = amount === null ? "" : cleanAmount(fromMinor(amount, info), info);
				focused = true;
				blurred = false;
			}}
			onblur={() => {
				focused = false;
				blurred = true;
			}}
			onkeydown={(event: KeyboardEvent) => {
				if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
				event.preventDefault();
				const delta = (event.key === "ArrowUp" ? 1 : -1) * unit * (event.shiftKey ? 10 : 1);
				setAmount((amount ?? 0) + delta);
			}}
			{oninput}
		/>
		<InputGroupAddon align="inline-end">
			<span class={s.symbol()}>{code}</span>
		</InputGroupAddon>
	</InputGroup>
	{#if quickAdd.length}
		<div class={s.chips()}>
			{#each quickAdd as major (major)}
				<Button
					type="button"
					variant="outline"
					size="xs"
					{disabled}
					onclick={() => setAmount((amount ?? 0) + major * 10 ** info.digits)}
				>
					+{info.symbol}{major.toLocaleString(locale)}
				</Button>
			{/each}
		</div>
	{/if}
	{#if name}<input type="hidden" {name} value={amount ?? ""} />{/if}
	{#if message}
		<span id={messageId} role="alert" data-tone="error" class={s.message()}>{message}</span>
	{/if}
</div>
