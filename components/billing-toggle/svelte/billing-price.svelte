<script lang="ts">
import LetterMorph from "../../letter-morph/svelte/letter-morph.svelte";
import { cn } from "../../lib/svelte/cn";
import SlotText from "../../slot-text/svelte/slot-text.svelte";
import { billingToggle } from "./variants";

let {
	amount,
	currency = "USD",
	period,
	was,
	decimals = 0,
	locale = "en-US",
	class: classProp,
}: {
	/** Price in major units, e.g. 24 for $24. */
	amount: number;
	currency?: string;
	/** After the price, e.g. "per month"; morphs in place when it changes. */
	period?: string;
	/** Previous price, struck through when higher than `amount`. */
	was?: number;
	/** Decimal places shown. */
	decimals?: number;
	locale?: string;
	class?: string;
} = $props();

const s = billingToggle();
const format = $derived((value: number) =>
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value),
);
</script>

<span data-slot="billing-price" class={cn(s.price(), classProp)}>
	<SlotText value={amount} {format} spins={0} class={s.amount()} announce />
	{#if was !== undefined && was > amount}<span class={s.was()}>{format(was)}</span>{/if}
	{#if period}<LetterMorph text={period} class={s.period()} />{/if}
</span>
