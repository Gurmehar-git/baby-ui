<script lang="ts">
import type { Snippet } from "svelte";
import Badge from "../badge/badge.svelte";
import Button from "../button/button.svelte";
import Field from "../field/field.svelte";
import FieldError from "../field/field-error.svelte";
import FieldLabel from "../field/field-label.svelte";
import Input from "../input/input.svelte";
import { cn } from "../lib/cn";
import Textarea from "../textarea/textarea.svelte";
import ToggleGroup from "../toggle-group/toggle-group.svelte";
import ToggleGroupItem from "../toggle-group/toggle-group-item.svelte";
import {
	type ContactChannelEntry,
	type ContactMessage,
	type ContactOffice,
	type ContactStatus,
	contactProblems,
	officeClock,
} from "./contact";
import { type ContactSectionVariant, contactSection } from "./variants";

let {
	variant = "form",
	title = "Get in touch",
	description,
	topics = ["General", "Sales", "Support"],
	onSubmit,
	status = "idle",
	error,
	onReset,
	channels = [],
	channel = $bindable(),
	onChannelChange,
	offices = [],
	locale,
	class: className,
}: {
	/** `form` takes a message, `channels` lists ways to reach you, `offices` shows live local times. */
	variant?: ContactSectionVariant;
	title?: string;
	description?: string;
	/** Topic chips in the form; the first is chosen to start. */
	topics?: string[];
	/** Called with a valid message; set `status` from your request. */
	onSubmit?: (message: ContactMessage) => void;
	status?: ContactStatus;
	error?: string;
	/** From the confirmation's "Send another"; set `status` back to "idle". */
	onReset?: () => void;
	/** `detail` shows beside the list while that channel is selected. */
	channels?: (ContactChannelEntry & { detail: Snippet })[];
	/** Bindable. */
	channel?: string;
	onChannelChange?: (value: string) => void;
	offices?: ContactOffice[];
	locale?: string;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(contactSection({ variant }));
let name = $state("");
let email = $state("");
// svelte-ignore state_referenced_locally
let topic = $state(topics[0] ?? "");
let body = $state("");
let tried = $state(false);
// svelte-ignore state_referenced_locally
let ownChannel = $state(channels[0]?.value ?? "");
let now = $state<Date | null>(null);
const picked = $derived(channel ?? ownChannel);
const busy = $derived(status === "submitting");
const done = $derived(status === "success");
const problems = $derived(
	tried ? contactProblems({ name, email, topic, message: body }) : {},
);

// Office clocks tick each minute, after mount so server and client agree.
$effect(() => {
	if (variant !== "offices") return;
	now = new Date();
	const timer = setInterval(() => (now = new Date()), 60_000);
	return () => clearInterval(timer);
});

function submit(event: SubmitEvent) {
	event.preventDefault();
	if (busy) return;
	tried = true;
	if (Object.keys(contactProblems({ name, email, topic, message: body })).length) return;
	onSubmit?.({ name: name.trim(), email: email.trim(), topic, message: body.trim() });
}
function pick(next: string | string[]) {
	const value = Array.isArray(next) ? next[0] : next;
	if (!value) return;
	if (channel === undefined) ownChannel = value;
	else channel = value;
	onChannelChange?.(value);
}
</script>

<section
	data-slot="contact-section"
	data-variant={variant}
	aria-labelledby="{uid}-title"
	class={cn(s.root(), className)}
>
	<div class={s.inner()}>
		<div class={s.intro()}>
			<h2 id="{uid}-title" class={s.title()}>{title}</h2>
			{#if description}<p class={s.description()}>{description}</p>{/if}
		</div>
		{#if variant === "form"}
			<div class={s.stage()}>
				<div data-active={!done} inert={done} class={s.face()}>
					<div class={s.faceInner()}>
						<form novalidate aria-labelledby="{uid}-title" onsubmit={submit} class={s.form()}>
							<Field data-invalid={Boolean(problems.name)}>
								<FieldLabel for="{uid}-name">Name</FieldLabel>
								<Input id="{uid}-name" autocomplete="name" bind:value={name} invalid={Boolean(problems.name)} />
								{#if problems.name}<FieldError>{problems.name}</FieldError>{/if}
							</Field>
							<Field data-invalid={Boolean(problems.email)}>
								<FieldLabel for="{uid}-email">Email</FieldLabel>
								<Input id="{uid}-email" type="email" autocomplete="email" bind:value={email} invalid={Boolean(problems.email)} />
								{#if problems.email}<FieldError>{problems.email}</FieldError>{/if}
							</Field>
							<Field class={s.wide()}>
								<FieldLabel id="{uid}-topic">Topic</FieldLabel>
								<ToggleGroup
									variant="chip"
									size="sm"
									label="Topic"
									value={topic}
									onValueChange={(next) => {
										const value = Array.isArray(next) ? next[0] : next;
										if (value) topic = value;
									}}
								>
									{#each topics as item (item)}
										<ToggleGroupItem value={item}>{item}</ToggleGroupItem>
									{/each}
								</ToggleGroup>
							</Field>
							<Field data-invalid={Boolean(problems.message)} class={s.wide()}>
								<FieldLabel for="{uid}-message">Message</FieldLabel>
								<Textarea id="{uid}-message" bind:value={body} invalid={Boolean(problems.message)} />
								{#if problems.message}<FieldError>{problems.message}</FieldError>{/if}
							</Field>
							{#if status === "error" && error}<p role="alert" class={s.error()}>{error}</p>{/if}
							<Button type="submit" loading={busy} class={s.wide()}>Send message</Button>
						</form>
					</div>
				</div>
				<div data-active={done} inert={!done} class={s.face()}>
					<div class={s.faceInner()}>
						<div class={s.done()} aria-live="polite">
							<p class={s.doneTitle()}>Message sent</p>
							<p class={s.doneText()}>
								Thanks, {name.trim() || "there"}. We reply to {email.trim()} within a working day.
							</p>
							<Button
								variant="outline"
								size="sm"
								onclick={() => {
									body = "";
									tried = false;
									onReset?.();
								}}
							>
								Send another
							</Button>
						</div>
					</div>
				</div>
			</div>
		{:else if variant === "channels"}
			<div class={s.channels()}>
				<ToggleGroup
					variant="segmented"
					orientation="vertical"
					label="Ways to reach us"
					value={picked}
					onValueChange={pick}
					class={s.channelList()}
				>
					{#each channels as item (item.value)}
						<ToggleGroupItem value={item.value} class={s.channelItem()}>
							{item.label}
							{#if item.meta}<span class={s.channelMeta()}>{item.meta}</span>{/if}
						</ToggleGroupItem>
					{/each}
				</ToggleGroup>
				<div class={s.stage()}>
					{#each channels as item (item.value)}
						<div data-active={item.value === picked} inert={item.value !== picked} class={s.face()}>
							<div class={s.faceInner()}>
								<div class={s.panel()}>{@render item.detail()}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class={s.offices()}>
				{#each offices as office (office.city)}
					{@const clock = now ? officeClock(office, now, locale) : null}
					<article class={s.office()}>
						<div class={s.officeTop()}>
							<h3 class={s.city()}>{office.city}</h3>
							{#if clock}
								<Badge variant={clock.open ? "success" : "secondary"} size="sm">{clock.open ? "Open" : "Closed"}</Badge>
							{/if}
						</div>
						<p class={s.clock()}>{clock ? `${clock.time} local time` : " "}</p>
						<address class={s.address()}>
							{#each office.address as line (line)}<span class="block not-italic">{line}</span>{/each}
						</address>
						{#if office.email}<a href="mailto:{office.email}" class={s.link()}>{office.email}</a>{/if}
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
