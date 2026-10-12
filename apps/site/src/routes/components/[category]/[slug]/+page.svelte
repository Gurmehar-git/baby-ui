<script lang="ts">
import { registry } from "virtual:docvia/registry";
import {
	IconArrowLeft,
	IconArrowRight,
	IconArrowUpRight,
	IconBrandReact,
	IconBrandSvelte,
	IconChevronRight,
	IconList,
} from "@baby-ui/icons";
import type { Framework } from "@baby-ui/registry-schema";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Markdown,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@baby-ui/svelte";
import { Renderer } from "@docvia/core/svelte";
import type { Snippet } from "svelte";
import { track } from "#lib/analytics.js";
import CodeBlock from "#lib/components/code-block.svelte";
import ComponentCard from "#lib/components/component-card.svelte";
import ControlsPanel from "#lib/components/controls-panel.svelte";
import CopyButton from "#lib/components/copy-button.svelte";
import DemoPreview from "#lib/components/demo-preview.svelte";
import EmailFrame from "#lib/components/email-frame.svelte";
import InstallBlock from "#lib/components/install-block.svelte";
import KeyboardTable from "#lib/components/keyboard-table.svelte";
import MobileNavDrawer from "#lib/components/mobile-nav-drawer.svelte";
import OgPngStage from "#lib/components/og-png-stage.svelte";
import OutlineToggle from "#lib/components/outline-toggle.svelte";
import PageMenu from "#lib/components/page-menu.svelte";
import PreviewToolbar from "#lib/components/preview-toolbar.svelte";
import ProInstallGate from "#lib/components/pro-install-gate.svelte";
import PropsRail from "#lib/components/props-rail.svelte";
import PropsTable from "#lib/components/props-table.svelte";
import Seo from "#lib/components/seo.svelte";
import { demos } from "#lib/demos.js";
import type { Heading } from "#lib/docs-nodes.js";
import { OUTLINE_PANEL, outlineSidebar } from "#lib/docs-sidebar.svelte.js";
import { prefs } from "#lib/preferences.svelte.js";
import { EmailPreview, OgPngPreview, PREVIEW_VIEWS } from "#lib/preview-modes.svelte.js";
import { productFor } from "#lib/products.js";
import {
	CATEGORY_LABEL,
	categoryHref,
	defaultProps,
	specHref,
	TOP_LEVEL,
} from "#lib/registry.js";
import {
	absoluteUrl,
	breadcrumbLd,
	componentKeywords,
	componentLd,
	metaDescription,
	SITE_URL,
} from "#lib/seo.js";
import { installSourceUrl } from "#lib/source.js";
import { page } from "$app/state";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

let tab = $state("preview");
let viewport = $state<"desktop" | "mobile">("desktop");
let fullscreen = $state(false);
let reloadKey = $state(0);
let wide = $state(false);

$effect(() => {
	const query = matchMedia("(min-width: 1280px)");
	const sync = () => (wide = query.matches);
	sync();
	query.addEventListener("change", sync);
	return () => query.removeEventListener("change", sync);
});

// Split pins the stage in the right column; playground gives it the full width above the docs.
// Below xl the page stays stacked either way.
const split = $derived(prefs.layout === "split" && wide);
const playground = $derived(prefs.layout === "playground" && wide);

// Framework and language are global preferences, set from the header settings drawer.
const framework = $derived(prefs.framework);
const dialect = $derived(prefs.dialect);
let values = $state<Record<string, unknown>>({});

// Extra preview views (OG PNG, email HTML/text); their fetch state lives in preview-modes.
const views = $derived(PREVIEW_VIEWS[data.spec.category] ?? []);
let view = $state("");
$effect(() => {
	if (!views.some((v) => v.id === view)) view = views[0]?.id ?? "";
});
const png = new OgPngPreview(() =>
	data.spec.category === "og-images"
		? {
				slug: data.spec.slug,
				entry: data.spec.impl.svelte?.entry ?? "",
				controls: { ...defaultProps(data.spec), ...values },
				active: view === "og_png",
			}
		: null,
);
const email = new EmailPreview(() => ({
	renders: data.email,
	changed:
		data.email?.slug === data.spec.slug &&
		JSON.stringify(values) !== JSON.stringify(defaultProps(data.spec)),
	values,
	framework: framework === "react" ? "react" : "svelte",
}));
const stage = $derived(
	data.email ? emailStage : view === "og_png" ? pngStage : undefined,
);

// Viewport sizes are a fullscreen tool, except for emails, which size their own iframe.
$effect(() => {
	if (!fullscreen && !data.email) viewport = "desktop";
});

$effect(() => {
	if (!fullscreen) return;
	const onKey = (event: KeyboardEvent) => {
		if (event.key === "Escape") fullscreen = false;
	};
	window.addEventListener("keydown", onKey);
	document.body.style.overflow = "hidden";
	return () => {
		window.removeEventListener("keydown", onKey);
		document.body.style.overflow = "";
	};
});

// $effect, not a `{#key data.spec.slug}`-scoped $state init: relies on `data.spec`
// changing exactly on navigation, not on any other future reactive field of `data`.
$effect(() => {
	values = defaultProps(data.spec);
});

const port = $derived(data.ports.find((p) => p.framework === framework) ?? data.ports[0]);
const adjacent = $derived(data.adjacent);
const hasControls = $derived(data.spec.props.some((p) => p.control.kind !== "none"));
const related = $derived(data.related);
// In split the stage is pinned beside the page, so its tab becomes the controls, or goes;
// playground docks both above, leaving Usage.
const tabs = $derived(
	[
		playground
			? false
			: !split
				? { id: "preview", label: "Preview" }
				: hasControls && { id: "preview", label: "Controls" },
		{ id: "usage", label: "Usage" },
	].filter((t): t is { id: string; label: string } => Boolean(t)),
);

$effect(() => {
	if (!tabs.some((t) => t.id === tab)) tab = tabs[0]?.id ?? "usage";
});
const FRAMEWORKS: { id: Framework; label: string; icon: typeof IconBrandReact }[] = [
	{ id: "svelte", label: "Svelte", icon: IconBrandSvelte },
	{ id: "react", label: "React", icon: IconBrandReact },
];
const product = $derived(productFor(data.spec.slug));
const guide = $derived(data.spec.guidance);
const insteadLine = ({ text, use }: { text: string; use?: string }) => {
	const alt = use ? data.alternatives[use] : undefined;
	return alt ? `${text} Use [${alt.name}](${alt.href}).` : text;
};
const SECTION = "mt-16 scroll-mt-[calc(var(--header-h)+1.5rem)]";
const HEADING = "font-semibold text-foreground text-xl tracking-tight";
const PAGE_SECTIONS = new Set([
	"overview",
	"preview",
	"when-to-use",
	"when-not-to-use",
	"installation",
	"api-reference",
	"keyboard",
	"accessibility",
	"behaviour",
	"responsive",
	"performance",
	"notes-for-ai",
	"related",
]);
const outline = $derived(
	[
		{ id: "overview", label: "Overview", depth: 2 as const },
		{ id: "preview", label: "Preview", depth: 2 as const },
		(guide.when.length > 0 || guide.whenNot.length > 0) && {
			id: "when-to-use",
			label: "When to use",
			depth: 2 as const,
		},
		{ id: "installation", label: "Installation", depth: 2 as const },
		// A prose heading that reuses a page section's id would key the outline twice and crash it.
		...data.proseHeadings.filter((h) => !PAGE_SECTIONS.has(h.id)),
		data.spec.props.length > 0 && {
			id: "api-reference",
			label: "API reference",
			depth: 2 as const,
		},
		data.spec.a11y.keyboard.length > 0 && {
			id: "keyboard",
			label: "Keyboard",
			depth: 2 as const,
		},
		data.spec.a11y.notes.length > 0 && {
			id: "accessibility",
			label: "Accessibility",
			depth: 2 as const,
		},
		data.spec.motion && { id: "behaviour", label: "Motion", depth: 2 as const },
		guide.responsive.length > 0 && {
			id: "responsive",
			label: "Responsive",
			depth: 2 as const,
		},
		guide.performance.length > 0 && {
			id: "performance",
			label: "Performance",
			depth: 2 as const,
		},
		guide.ai.length > 0 && {
			id: "notes-for-ai",
			label: "Notes for AI",
			depth: 2 as const,
		},
		related.length > 0 && {
			id: "related",
			label: "Related components",
			depth: 2 as const,
		},
	].filter((h): h is Heading => Boolean(h)),
);
const usage = $derived(
	dialect === "js" && port?.usage?.js ? port.usage.js : (port?.usage?.ts ?? null),
);
const seoDescription = $derived(
	metaDescription(
		data.spec.description,
		"React and Svelte component, installable with the shadcn CLI.",
	),
);
const categoryTrail = $derived(
	TOP_LEVEL.includes(data.spec.category)
		? []
		: [{ name: "Components", path: "/components" }],
);
</script>

<Seo
	title="{data.spec.name}: React & Svelte Component"
	description={seoDescription}
	tag={CATEGORY_LABEL[data.spec.category]}
	keywords={componentKeywords(data.spec.name, data.spec.keywords)}
	noindex={data.spec.retired || data.spec.status === "alpha" || data.spec.status === "experimental"}
	markdown="{specHref(data.spec)}.md"
	jsonLd={[
		componentLd({
			name: data.spec.name,
			description: seoDescription,
			path: specHref(data.spec),
			keywords: componentKeywords(data.spec.name, data.spec.keywords),
		}),
		breadcrumbLd([
			...categoryTrail,
			{ name: CATEGORY_LABEL[data.spec.category], path: categoryHref(data.spec.category) },
			{ name: data.spec.name, path: specHref(data.spec) },
		]),
	]}
/>

<!-- Stacked caps at a readable width and centres like the docs; split keeps its half column. -->
<main
	class={[
		"@container min-w-0 pt-8 pb-16 md:pt-12",
		!split && !playground && "mx-auto w-full max-w-5xl",
	]}
>
	<div id="overview" class="scroll-mt-[calc(var(--header-h)+1.5rem)]">
		<nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
			<a
				href={categoryHref(data.spec.category)}
				class="text-muted-foreground transition-colors hover:text-foreground"
			>
				{CATEGORY_LABEL[data.spec.category]}
			</a>
			<IconChevronRight size={14} class="text-muted-foreground" />
			<span class="font-medium text-foreground">{data.spec.name}</span>
		</nav>

		{#if data.spec.retired}
			<Alert variant="warning" class="mt-4">
				<AlertTitle>Retired</AlertTitle>
				<AlertDescription>
					No longer maintained. Installs still work, but it will be removed in a future release.
				</AlertDescription>
			</Alert>
		{/if}

		<div class="mt-5 flex flex-col gap-4 @xl:flex-row @xl:items-start @xl:justify-between">
			<div class="flex items-center gap-3">
				<h1 class="text-balance font-semibold text-[2.125rem] text-foreground leading-[1.1] tracking-[-0.03em] md:text-[2.5rem]">
					{data.spec.name}
				</h1>
				{#if data.spec.tier === "pro"}
					<span class="mt-1 rounded-full bg-foreground px-2 py-0.5 font-medium text-[11px] text-background">
						Pro
					</span>
				{/if}
				{#if data.fresh === "new"}
					<Badge size="sm" variant="info" class="mt-1">New</Badge>
				{:else if data.fresh === "updated"}
					<Badge size="sm" variant="success" class="mt-1">Updated</Badge>
				{/if}
				{#if data.spec.status !== "stable"}
					<span class="mt-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
						{data.spec.status}
					</span>
				{/if}
			</div>
			<div class="flex flex-wrap items-center gap-2 @xl:justify-end">
				<PageMenu
					markdownUrl="{specHref(data.spec)}.md"
					copyText={data.spec.description}
					installSlug={data.spec.tier === "pro" ? undefined : data.spec.slug}
					subject="component"
				/>
				{#if !split && !playground}<OutlineToggle />{/if}
			</div>
		</div>

		<p class="mt-4 max-w-2xl text-pretty text-base text-muted-foreground leading-7 sm:text-[1.0625rem] sm:leading-8">
			{data.spec.description}
		</p>

		<div class={["mt-5", !split && !playground && "xl:hidden"]}>
			<MobileNavDrawer label="On this page" title="On this page">
				{#snippet icon()}<IconList size={14} />{/snippet}
				{#snippet children()}
					<PropsRail slug={data.spec.slug} {outline} heading={false} promo={false} />
				{/snippet}
			</MobileNavDrawer>
		</div>
	</div>

	{#if playground}
		<!-- The workbench: a viewport-tall stage with the controls docked beside it. -->
		<section
			id="preview"
			class={[
				"mt-8 grid h-[calc(100dvh-var(--header-h)-4rem)] min-h-[32rem] scroll-mt-[calc(var(--header-h)+1.5rem)] gap-3",
				hasControls && "grid-cols-[minmax(0,1fr)_20rem]",
			]}
		>
			<div class="min-h-0">{@render previewStage(true)}</div>
			{#if hasControls}<ControlsPanel spec={data.spec} bind:values docked />{/if}
		</section>
	{/if}

	<!-- Playground centres the docs under its full-width workbench. -->
	<div class={playground ? "mx-auto w-full max-w-5xl" : undefined}>
	<section
		id={playground ? "usage" : "preview"}
		class="mt-10 scroll-mt-[calc(var(--header-h)+1.5rem)]"
	>
		<Tabs
			bind:value={
				() => tab,
				(next) => {
					tab = next;
					track("component_tab_selected", { tab: next });
				}
			}
			variant="underline"
		>
			<TabsList aria-label="Component views">
				{#each tabs as item (item.id)}
					<TabsTrigger value={item.id}>{item.label}</TabsTrigger>
				{/each}
			</TabsList>
			<!-- Only the open view renders: the demo is heavy and the usage block is highlighted. -->
			<TabsContent value="preview">
				{#if tab === "preview"}
					{#if !split}
						<div class="overflow-x-auto">
							{@render previewStage()}
						</div>
					{/if}
					{#if hasControls}
						<ControlsPanel spec={data.spec} bind:values defaultOpen={split} />
					{/if}
				{/if}
			</TabsContent>
			<TabsContent value="usage">
				{#if tab === "usage" && usage}
					<CodeBlock
						code={usage.code}
						html={usage.html}
						lang={usage.lang}
						maxHeight="none"
						analytics={{ event: "usage_copied" }}
					/>
				{/if}
			</TabsContent>
		</Tabs>
	</section>

	{#if guide.when.length || guide.whenNot.length}
		<section id="when-to-use" class={SECTION}>
			<div class="grid max-w-3xl gap-8 @2xl:grid-cols-2">
				{#if guide.when.length}
					<div>
						<h2 class={HEADING}>When to use</h2>
						<Markdown variant="muted" class="mt-3" content={bullets(guide.when)} />
					</div>
				{/if}
				{#if guide.whenNot.length}
					<div id="when-not-to-use" class="scroll-mt-[calc(var(--header-h)+1.5rem)]">
						<h2 class={HEADING}>When not to use</h2>
						<Markdown variant="muted" class="mt-3" content={bullets(guide.whenNot.map(insteadLine))} />
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<section id="installation" class="mt-16 scroll-mt-[calc(var(--header-h)+1.5rem)]">
		<!-- The framework switch reads as part of the heading: "Installation · Svelte". -->
		<div class="flex flex-wrap items-center gap-1.5">
			<h2 class="font-semibold text-foreground text-xl tracking-tight">Installation</h2>
			<Select
				bind:value={
					() => framework,
					(next) => {
						const pick = FRAMEWORKS.find((f) => f.id === next);
						if (pick) prefs.set("framework", pick.id);
					}
				}
				items={FRAMEWORKS.map((f) => ({ value: f.id, label: f.label }))}
			>
				<SelectTrigger variant="ghost" size="xs" aria-label="Framework">
					{@const Icon = FRAMEWORKS.find((f) => f.id === framework)?.icon}
					{#if Icon}<Icon size={12} />{/if}
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="end" size="xs">
					{#each FRAMEWORKS as option (option.id)}
						<SelectItem value={option.id} label={option.label}>
							<option.icon size={12} />
							{option.label}
						</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>
		<div class="mt-4">
			{#if data.spec.tier === "pro"}
				<ProInstallGate name={data.spec.name} />
			{:else if port}
				<InstallBlock
					slug={data.spec.slug}
					dependencies={port.dependencies}
					source={installSourceUrl(data.spec.category, data.spec.slug, port.framework)}
					css={port.css}
					{dialect}
				/>
			{/if}
		</div>
	</section>

	{#if data.prose}
		<section class="mt-16 scroll-mt-[calc(var(--header-h)+1.5rem)]">
			<article class="prose-baby max-w-2xl"><Renderer nodes={data.prose} {registry} /></article>
		</section>
	{/if}

	{#if data.spec.props.length}
		<section id="api-reference" class={SECTION}>
			<h2 class={HEADING}>API Reference</h2>
			<div class="mt-4"><PropsTable props={data.spec.props} /></div>
		</section>
	{/if}

	{#if data.spec.a11y.keyboard.length}
		<section id="keyboard" class={SECTION}>
			<h2 class={HEADING}>Keyboard interactions</h2>
			<div class="mt-4 max-w-2xl"><KeyboardTable bindings={data.spec.a11y.keyboard} /></div>
		</section>
	{/if}

	{#if data.spec.a11y.notes.length}
		<section id="accessibility" class={SECTION}>
			<h2 class={HEADING}>Accessibility</h2>
			<Markdown variant="muted" class="mt-4 max-w-2xl" content={bullets(data.spec.a11y.notes)} />
		</section>
	{/if}

	{#if data.spec.motion}
		<section id="behaviour" class={SECTION}>
			<h2 class={HEADING}>Motion</h2>
			<p class="mt-2 max-w-2xl text-[0.9375rem] text-muted-foreground leading-7">
				What both implementations must observably do. Not a description of either one's code.
			</p>
			<Markdown
				variant="muted"
				class="mt-4 max-w-2xl"
				content={bullets([
					...data.spec.motion.behaviour,
					`Reduced motion: ${data.spec.motion.reducedMotion}`,
				])}
			/>
		</section>
	{/if}

	{#if guide.responsive.length}
		<section id="responsive" class={SECTION}>
			<h2 class={HEADING}>Responsive behavior</h2>
			<Markdown variant="muted" class="mt-4 max-w-2xl" content={bullets(guide.responsive)} />
		</section>
	{/if}

	{#if guide.performance.length}
		<section id="performance" class={SECTION}>
			<h2 class={HEADING}>Performance</h2>
			<Markdown variant="muted" class="mt-4 max-w-2xl" content={bullets(guide.performance)} />
		</section>
	{/if}

	{#if guide.ai.length}
		<section id="notes-for-ai" class={SECTION}>
			<div class="flex max-w-2xl items-center justify-between gap-3">
				<h2 class={HEADING}>Notes for AI</h2>
				<CopyButton text={absoluteUrl(SITE_URL, `${specHref(data.spec)}.md`)} />
			</div>
			<Markdown variant="muted" class="mt-4 max-w-2xl" content={bullets(guide.ai)} />
		</section>
	{/if}

	{#if related.length}
		<section id="related" class="mt-16 scroll-mt-[calc(var(--header-h)+1.5rem)]">
			<h2 class="font-semibold text-foreground text-xl tracking-tight">Related components</h2>
			<p class="mt-2 text-[0.9375rem] text-muted-foreground leading-7">
				More from {CATEGORY_LABEL[data.spec.category]}.
			</p>
			<div class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 [grid-auto-rows:19rem] @lg:grid-cols-2 @4xl:grid-cols-3">
				{#each related as item (item.slug)}
					<ComponentCard {item} />
				{/each}
			</div>
		</section>
	{/if}

	{#if adjacent.prev || adjacent.next}
		<nav aria-label="Component pages" class="mt-16 flex items-center justify-between gap-3 border-border border-t pt-6">
			{#if adjacent.prev}
				<a
					href={adjacent.prev.href}
					class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/20 py-2 pr-4 pl-3 font-medium text-foreground text-sm transition-colors hover:bg-foreground/[0.06]"
				>
					<IconArrowLeft size={15} class="shrink-0 text-muted-foreground" />
					{adjacent.prev.name}
				</a>
			{:else}
				<span></span>
			{/if}
			{#if adjacent.next}
				<a
					href={adjacent.next.href}
					class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/20 py-2 pr-3 pl-4 font-medium text-foreground text-sm transition-colors hover:bg-foreground/[0.06]"
				>
					{adjacent.next.name}
					<IconArrowRight size={15} class="shrink-0 text-muted-foreground" />
				</a>
			{/if}
		</nav>
	{/if}
	<div class="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-muted-foreground text-xs">
		<a
			href={product.href}
			target="_blank"
			rel="noreferrer"
			class="inline-flex items-center gap-1 transition-colors hover:text-foreground"
		>
			Also from Nexonauts: <span class="text-foreground">{product.name}</span>, {product.headline}
			<IconArrowUpRight size={12} />
		</a>
		<!-- A real link, not only the menu item: crawlers and agents follow it to the markdown twin. -->
		<a href="{specHref(data.spec)}.md" target="_blank" rel="noopener" class="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">
			View this page as Markdown
		</a>
	</div>
	</div>
</main>

{#snippet previewStage(fill = false)}
	<div
		class={[
			"mx-auto w-full",
			viewport === "mobile" && !data.email ? "max-w-sm" : "max-w-full",
			fill && "flex h-full flex-col",
		]}
	>
		<div class={["relative", fill && "flex min-h-0 flex-1 flex-col"]}>
			{#key reloadKey}
				<DemoPreview
					{framework}
					slug={data.spec.slug}
					demo={demos[data.spec.slug]}
					props={values}
					content={stage as Snippet | undefined}
					maxHeight={fill || data.email ? undefined : "calc(100dvh - var(--header-h) - 4rem)"}
					class={fill ? "h-full flex-1" : undefined}
				/>
			{/key}
			<div class="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
				<PreviewToolbar
					bind:viewport
					bind:fullscreen
					bind:view
					{views}
					viewports={Boolean(data.email)}
					onReload={() => reloadKey++}
				/>
			</div>
		</div>
	</div>
{/snippet}

{#snippet emailStage()}
	{#if email.shown}
		<EmailFrame
			html={email.shown.html}
			text={email.shown.text}
			bytes={email.shown.bytes}
			view={view === "email_text" ? "text" : "html"}
			{viewport}
			pending={email.pending}
			title="{data.spec.name} preview"
		/>
	{/if}
{/snippet}

{#snippet pngStage()}
	<OgPngStage preview={png} name={data.spec.name} />
{/snippet}

{#if fullscreen}
	<div class="fixed inset-0 z-50 flex flex-col gap-4 bg-background p-4 sm:p-6">
		<div class="flex items-center justify-between gap-3">
			<p class="font-medium text-foreground text-sm">{data.spec.name} · Preview</p>
		</div>
		<div class="min-h-0 flex-1 overflow-auto">
			{@render previewStage(true)}
		</div>
	</div>
{/if}

{#if split}
	<aside aria-label="Live preview" class="hidden min-w-0 xl:block">
		<div class="sticky top-(--header-h) flex h-[calc(100dvh-var(--header-h))] flex-col gap-3 py-8">
			<div class="flex items-center justify-between gap-3">
				<p class="font-medium text-foreground text-sm">Preview</p>
			</div>
			<div class="min-h-0 flex-1">
				{@render previewStage(true)}
			</div>
		</div>
	</aside>
{:else if !playground}
	<aside aria-label="On this page" class="hidden min-w-0 xl:block">
		<div
			id="outline-sidebar"
			inert={!outlineSidebar.current}
			class={["scrollbar-hide fixed top-[calc(var(--header-h)+2.5rem)] right-8 z-10 max-h-[calc(100dvh-var(--header-h)-4.5rem)] w-(--right-sidebar-width) overflow-y-auto pb-1", OUTLINE_PANEL]}
		>
			<PropsRail slug={data.spec.slug} {outline} promo={false} />
		</div>
	</aside>
{/if}
