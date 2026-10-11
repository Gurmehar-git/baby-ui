<script lang="ts">
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
	Label,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import {
	cardBrand,
	formatAmount,
	formatCard,
	formatPhone,
	passwordStrength,
} from "../data/input-group";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof InputGroup>>(props));

const size = $derived(p.size ?? "default");
const id = $props.id();
let domain = $state("");
let note = $state("");
let copied = $state(false);
let query = $state("");
let password = $state("");
let revealed = $state(false);
let amount = $state("");
let phone = $state("");
let card = $state("");
const brand = $derived(cardBrand(card));
</script>

<!-- Search, password, currency, phone and card fields are InputGroup recipes, not components. -->
<div class="grid w-full max-w-2xl gap-x-4 gap-y-5 sm:grid-cols-2">
	<div class="flex flex-col gap-1.5">
		<Label for="{id}-domain">Domain</Label>
		<InputGroup {size}>
			<InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
			<InputGroupInput id="{id}-domain" placeholder="acme" bind:value={domain} />
			<InputGroupAddon align="inline-end"><InputGroupText>.dev</InputGroupText></InputGroupAddon>
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="{id}-search">Search</Label>
		<InputGroup {size}>
			<InputGroupAddon>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
					<path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4" />
				</svg>
			</InputGroupAddon>
			<InputGroupInput id="{id}-search" type="search" placeholder="Search docs" bind:value={query} />
			{#if query}
				<InputGroupAddon align="inline-end">
					<InputGroupButton size="icon-xs" aria-label="Clear search" onclick={() => (query = "")}>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</InputGroupButton>
				</InputGroupAddon>
			{/if}
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="{id}-password">Password</Label>
		<InputGroup {size}>
			<InputGroupInput
				id="{id}-password"
				type={revealed ? "text" : "password"}
				autocomplete="new-password"
				placeholder="8+ characters"
				bind:value={password}
			/>
			<InputGroupAddon align="inline-end">
				{#if password}
					<InputGroupText aria-live="polite">{passwordStrength(password)}</InputGroupText>
				{/if}
				<InputGroupButton
					size="icon-xs"
					aria-label={revealed ? "Hide password" : "Show password"}
					aria-pressed={revealed}
					onclick={() => (revealed = !revealed)}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
						<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
						{#if revealed}<path d="m3 3 18 18" />{/if}
					</svg>
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="{id}-amount">Amount</Label>
		<InputGroup {size}>
			<InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
			<InputGroupInput
				id="{id}-amount"
				inputmode="decimal"
				placeholder="0.00"
				class="tabular-nums"
				bind:value={amount}
				onblur={() => (amount = formatAmount(amount))}
			/>
			<InputGroupAddon align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="{id}-phone">Phone</Label>
		<InputGroup {size}>
			<InputGroupAddon><InputGroupText>+1</InputGroupText></InputGroupAddon>
			<InputGroupInput
				id="{id}-phone"
				type="tel"
				autocomplete="tel-national"
				placeholder="(555) 123-4567"
				class="tabular-nums"
				value={phone}
				oninput={(e) => (phone = formatPhone(e.currentTarget.value))}
			/>
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="{id}-card">Card number</Label>
		<InputGroup {size}>
			<InputGroupAddon>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
					<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3" />
				</svg>
			</InputGroupAddon>
			<InputGroupInput
				id="{id}-card"
				inputmode="numeric"
				autocomplete="cc-number"
				placeholder="1234 5678 9012 3456"
				class="tabular-nums"
				value={card}
				oninput={(e) => (card = formatCard(e.currentTarget.value))}
			/>
			{#if brand}
				<InputGroupAddon align="inline-end"><InputGroupText>{brand}</InputGroupText></InputGroupAddon>
			{/if}
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5">
		<Label for="{id}-invite">Invite link</Label>
		<InputGroup {size}>
			<InputGroupInput id="{id}-invite" readonly value="https://acme.dev/join/7fk2" />
			<InputGroupAddon align="inline-end">
				<InputGroupButton
					size="icon-xs"
					aria-label={copied ? "Copied" : "Copy link"}
					onclick={() => (copied = true)}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						{#if copied}
							<path d="m5 12 5 5L20 7" />
						{:else}
							<path d="M8 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2zM16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
						{/if}
					</svg>
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	</div>

	<div class="flex flex-col gap-1.5 sm:col-span-2">
		<Label for="{id}-note">Release note</Label>
		<InputGroup>
			<InputGroupTextarea id="{id}-note" placeholder="What changed?" bind:value={note} rows={3} />
			<InputGroupAddon align="block-end">
				<InputGroupText class="ml-auto tabular-nums">{note.length}/280</InputGroupText>
			</InputGroupAddon>
		</InputGroup>
	</div>
</div>
