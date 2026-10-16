<script lang="ts">
import type { Snippet } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarGroup from "../../avatar/svelte/avatar-group.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Button from "../../button/svelte/button.svelte";
import InputGroup from "../../input-group/svelte/input-group.svelte";
import InputGroupAddon from "../../input-group/svelte/input-group-addon.svelte";
import InputGroupButton from "../../input-group/svelte/input-group-button.svelte";
import InputGroupInput from "../../input-group/svelte/input-group-input.svelte";
import { cn } from "../../lib/svelte/cn";
import type { ImageSlotProps } from "../../lib/svelte/image";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import Spinner from "../../spinner/svelte/spinner.svelte";
import {
	emailProblem,
	type NewsletterIssue,
	type NewsletterStatus,
	nudge,
	SIGNUP_DONE,
	SIGNUP_FAILED,
	signupMessages,
	stackIssues,
	stackStyle,
} from "./signup";
import { type NewsletterSignupVariant, newsletterSignup } from "./variants";

let {
	title,
	onSubmit,
	variant = "inline",
	description,
	status = "idle",
	error,
	onReset,
	value = $bindable(),
	onValueChange,
	placeholder = "you@company.com",
	buttonLabel = "Subscribe",
	privacyNote,
	privacyLink,
	readers,
	name = "",
	issues = [],
	upcoming,
	image,
	class: className,
}: {
	title: string;
	/** Called with a valid, trimmed email; set `status` from the request. */
	onSubmit: (email: string) => void;
	/** `inline` sets the copy beside the issue stack; `card` is self-contained with the stack on top. */
	variant?: NewsletterSignupVariant;
	description?: string;
	status?: NewsletterStatus;
	/** Shown when `status` is "error". */
	error?: string;
	/** From the success state's "Use a different email"; set `status` back to "idle". */
	onReset?: () => void;
	/** Bindable. */
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	buttonLabel?: string;
	privacyNote?: string;
	privacyLink?: { label: string; href: string };
	/** Reader count and up to three faces; the count ticks up on success. */
	readers?: { count: number; avatars?: { src: string; alt?: string }[] };
	/** Masthead on every issue. */
	name?: string;
	/** Recent issues, newest first; the first three make the stack. */
	issues?: NewsletterIssue[];
	/** The next issue; it lands on the stack, addressed to the reader, on success. */
	upcoming?: NewsletterIssue;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(newsletterSignup({ variant }));
let own = $state("");
const email = $derived(value ?? own);
let problem = $state<string | null>(null);
let tried = $state(false);
let sentTo = $state("");
let field = $state<HTMLDivElement | null>(null);
let input = $state<HTMLInputElement | null>(null);
const done = $derived(status === "success");
const busy = $derived(status === "submitting");
const message = $derived(
	problem ?? (status === "error" ? (error ?? SIGNUP_FAILED) : null),
);
const label = $derived(
	done
		? "Subscribed"
		: busy
			? "Subscribing"
			: status === "error"
				? "Try again"
				: buttonLabel,
);

function setEmail(next: string) {
	if (value === undefined) own = next;
	else value = next;
	onValueChange?.(next);
	if (tried) problem = emailProblem(next);
}
function submit(event: SubmitEvent) {
	event.preventDefault();
	if (busy || done) return;
	tried = true;
	const found = emailProblem(email);
	problem = found;
	if (found) {
		nudge(field);
		input?.focus();
		return;
	}
	sentTo = email.trim();
	onSubmit(email.trim());
}
let last: NewsletterStatus = "idle";
$effect(() => {
	if (status === "error") nudge(field);
	if (status === "success") document.getElementById(`${uid}-again`)?.focus();
	// Leaving success unmounts the focused button, so focus returns to the field.
	if (status === "idle" && last === "success") input?.focus();
	last = status;
});
</script>

<section
	data-slot="newsletter-signup"
	data-variant={variant}
	data-status={status}
	aria-labelledby="{uid}-title"
	class={cn(s.root(), className)}
>
	<div class={s.layout()}>
		<div class={s.copy()}>
			<h2 id="{uid}-title" class={s.title()}>{title}</h2>
			{#if description}<p class={s.description()}>{description}</p>{/if}
			<form class={s.form()} onsubmit={submit} novalidate aria-labelledby="{uid}-title">
				<InputGroup bind:ref={field} size="xl" class={s.field()}>
					<InputGroupInput
						bind:ref={input}
						type="email"
						name="email"
						inputmode="email"
						autocomplete="email"
						enterkeyhint="send"
						autocapitalize="off"
						spellcheck={false}
						aria-label="Email address"
						{placeholder}
						bind:value={() => email, setEmail}
						readonly={busy || done}
						aria-invalid={problem ? true : undefined}
						aria-describedby="{uid}-message"
						onblur={() => {
							if (email.trim() && !tried && status === "idle") {
								tried = true;
								problem = emailProblem(email);
							}
						}}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							type={done ? "button" : "submit"}
							size="sm"
							variant="default"
							aria-disabled={busy || undefined}
							class={s.submit()}
						>
							{#if busy}<span aria-hidden="true" class="inline-flex"><Spinner size="sm" /></span>{/if}
							{label}
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
				<div class={s.message()}>
					{#each signupMessages(`${privacyNote ?? ""} ${privacyLink?.label ?? ""}`, error) as text (text)}
						<span aria-hidden="true" class={s.sizer()}>{text}</span>
					{/each}
					<p id="{uid}-message" aria-live="polite" data-tone={message ? "error" : undefined} class={s.messageLine()}>
						{#if message}
							{message}
						{:else if done}
							{SIGNUP_DONE}
							<Button id="{uid}-again" variant="link" size="xs" class={s.again()} onclick={onReset}>Use a different email</Button>
						{:else}
							{privacyNote}
							{#if privacyLink}
								<a class={s.link()} href={privacyLink.href}>{privacyLink.label}</a>
							{/if}
						{/if}
					</p>
				</div>
			</form>
			{#if readers}
				<div class={s.readers()}>
					{#if readers.avatars?.length}
						<AvatarGroup aria-hidden="true">
							{#each readers.avatars.slice(0, 3) as face (face.src)}
								<Avatar size="sm" class="size-7">
									<AvatarImage src={face.src} alt={face.alt ?? ""} />
									<AvatarFallback>{(face.alt ?? "").charAt(0)}</AvatarFallback>
								</Avatar>
							{/each}
						</AvatarGroup>
					{/if}
					<span>
						<RollingDigits value={readers.count + (done ? 1 : 0)} startOnView={false} class={s.readerCount()} />
						readers<span data-on={done} class={s.you()}><span class={s.youInner()}>, including you</span></span>
					</span>
				</div>
			{/if}
		</div>
		{#if issues.length || upcoming}
			<div class={s.stack()}>
				{#each stackIssues(issues, upcoming, done) as { issue, depth } (issue.number)}
					{@const place = stackStyle(depth)}
					<article
						data-depth={depth}
						aria-hidden={depth !== 0 || undefined}
						aria-label={depth === 0 ? `${name}, issue ${issue.number}` : undefined}
						class={s.issue()}
						style:translate={place.translate}
						style:scale={place.scale}
						style:opacity={place.opacity}
						style:z-index={place.zIndex}
					>
						<header class={s.issueHead()}>
							<span class={s.masthead()}>{name}</span>
							<span class={s.issueNumber()}>Issue {issue.number}</span>
						</header>
						<p class={s.issueMeta()}>
							<span>{issue.date}</span>
							{#if issue === upcoming}
								<span aria-hidden="true">·</span>
								<span class={s.recipient()}>To {sentTo || email || placeholder}</span>
							{/if}
						</p>
						<h3 class={s.subject()}>{issue.subject}</h3>
						<ul class={s.stories()}>
							{#each issue.stories.slice(0, 3) as story (story.title)}
								<li class={s.story()}>
									{#if image}{@render image({ src: story.image, alt: "", width: 88, height: 88, className: s.thumb(), loading: "lazy" })}{:else}<img src={story.image} alt="" width={88} height={88} loading="lazy" decoding="async" class={s.thumb()} />{/if}
									<span class={s.storyTitle()}>{story.title}</span>
									<span class={s.minutes()}>{story.minutes} min</span>
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
