<script lang="ts">
import type { Snippet } from "svelte";
import Accordion from "../../accordion/svelte/accordion.svelte";
import AccordionContent from "../../accordion/svelte/accordion-content.svelte";
import AccordionItem from "../../accordion/svelte/accordion-item.svelte";
import AccordionTrigger from "../../accordion/svelte/accordion-trigger.svelte";
import Badge from "../../badge/svelte/badge.svelte";
import CodeBlock from "../../code-block/svelte/code-block.svelte";
import { cn } from "../../lib/cn";
import type { ImageSlotProps } from "../../lib/image";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import {
	CHANGELOG_KINDS,
	type ChangelogEntry,
	type ChangelogKind,
	changelogDay,
	changelogMonths,
	kindBadge,
	kindCount,
	kindShown,
} from "../changelog";
import { type ChangelogFeedVariant, changelogFeed } from "../variants";

let {
	entries,
	variant = "list",
	title = "Changelog",
	description,
	actions,
	endNote,
	kinds = $bindable(),
	onKindsChange,
	value = $bindable(),
	onValueChange,
	locale,
	image,
	class: className,
}: {
	/** Release notes; grouped by month, newest first. */
	entries: ChangelogEntry[];
	/** `timeline` threads entries on a rail; `list` is plain rows. */
	variant?: ChangelogFeedVariant;
	title?: string;
	/** One line under the title, such as the latest release. */
	description?: string;
	/** Beside the title, e.g. a subscribe control. */
	actions?: Snippet;
	/** Closing line after the last entry. */
	endNote?: string;
	/** Kinds shown; empty shows all. Bindable. */
	kinds?: ChangelogKind[];
	onKindsChange?: (kinds: ChangelogKind[]) => void;
	/** Open entry ids; defaults to the newest. Bindable. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	locale?: string;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(changelogFeed({ variant }));
const months = $derived(changelogMonths(entries, locale));
let ownKinds = $state<ChangelogKind[]>([]);
// svelte-ignore state_referenced_locally
const newest = changelogMonths(entries)[0]?.items[0];
let ownOpen = $state<string[]>(newest ? [newest.id] : []);
const activeKinds = $derived(kinds ?? ownKinds);
const open = $derived(value ?? ownOpen);
const shown = $derived(entries.filter((entry) => kindShown(entry, activeKinds)));

function setKinds(next: string | string[]) {
	const list = (Array.isArray(next) ? next : [next]).flatMap((v) =>
		CHANGELOG_KINDS.filter((k) => k.id === v).map((k) => k.id),
	);
	if (kinds === undefined) ownKinds = list;
	else kinds = list;
	onKindsChange?.(list);
}
function setOpen(next: string | string[]) {
	const list = Array.isArray(next) ? next : next ? [next] : [];
	if (value === undefined) ownOpen = list;
	else value = list;
	onValueChange?.(list);
}
</script>

<section
	data-slot="changelog-feed"
	data-variant={variant}
	aria-labelledby="{uid}-title"
	class={cn(s.root(), className)}
>
	<div class={s.inner()}>
		<header class={s.header()}>
			<div class={s.heading()}>
				<h2 id="{uid}-title" class={s.title()}>{title}</h2>
				{#if description}<p class={s.description()}>{description}</p>{/if}
			</div>
			{@render actions?.()}
		</header>
		<div class={s.toolbar()}>
			<ToggleGroup type="multiple" variant="chip" size="sm" label="Filter by kind" value={activeKinds} onValueChange={setKinds}>
				{#each CHANGELOG_KINDS as kind (kind.id)}
					<ToggleGroupItem value={kind.id}>
						{kind.label}
						<span class={s.filterCount()}>{kindCount(entries, kind.id)}</span>
					</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<p class={s.count()} aria-live="polite">
				<RollingDigits value={shown.length} startOnView={false} /> updates
			</p>
		</div>
		{#each months as month (month.key)}
			{@const visible = month.items.some((entry) => kindShown(entry, activeKinds))}
			<div data-hidden={!visible} inert={!visible} class={s.month()}>
				<div class={s.monthInner()}>
					<h3 class={s.monthLabel()}>{month.label}</h3>
					<Accordion type="multiple" value={open} onValueChange={setOpen} class={s.list()}>
						{#each month.items as entry (entry.id)}
							{@const gone = !kindShown(entry, activeKinds)}
							<AccordionItem value={entry.id} data-hidden={gone} inert={gone} class={s.row()}>
								<div class={s.rowInner()}>
									<AccordionTrigger class={s.trigger()}>
										<span class={s.triggerBody()}>
											<span class={s.meta()}>
												<time datetime={entry.date}>{changelogDay(entry.date, locale)}</time>
												<span class={s.version()}>v{entry.version}</span>
											</span>
											<span class={s.body()}>
												<span class={s.titleLine()}>
													<Badge variant={kindBadge[entry.kind]} size="sm">
														{CHANGELOG_KINDS.find((k) => k.id === entry.kind)?.label}
													</Badge>
													{entry.title}
												</span>
												<span class={s.summary()}>{entry.summary}</span>
											</span>
										</span>
									</AccordionTrigger>
									<AccordionContent class={s.panel()}>
										{#if entry.details?.length}
											<ul class={s.details()}>
												{#each entry.details as detail (detail)}<li>{detail}</li>{/each}
											</ul>
										{/if}
										{#if entry.media?.type === "photo"}
											<figure class={s.figure()}>
												{#if image}{@render image({ src: entry.media.src, alt: entry.media.alt, className: s.photo(), loading: "lazy" })}{:else}<img src={entry.media.src} alt={entry.media.alt} loading="lazy" decoding="async" class={s.photo()} />{/if}
												{#if entry.media.caption}<figcaption class={s.caption()}>{entry.media.caption}</figcaption>{/if}
											</figure>
										{:else if entry.media?.type === "code"}
											<CodeBlock code={entry.media.code} filename={entry.media.file} language={entry.media.language} />
										{/if}
									</AccordionContent>
								</div>
							</AccordionItem>
						{/each}
					</Accordion>
				</div>
			</div>
		{/each}
		{#if shown.length === 0}<p class={s.empty()}>No updates of that kind.</p>{/if}
		{#if endNote && shown.length}<p class={s.end()}>{endNote}</p>{/if}
	</div>
</section>
