<script lang="ts">
import "./layout.css";
import { ModeWatcher } from "mode-watcher";
import { onMount } from "svelte";
import { initAnalytics, setAnalyticsContext, track } from "#lib/analytics.js";
import NavProgress from "#lib/components/nav-progress.svelte";
import PreferencesPanel from "#lib/components/preferences-panel.svelte";
import SiteHeader from "#lib/components/site-header.svelte";
import { provideWebMcp } from "#lib/mcp/webmcp.js";
import { prefs } from "#lib/preferences.svelte.js";
import { afterNavigate, beforeNavigate } from "$app/navigation";
import { page } from "$app/state";

let { children } = $props();

$effect(() => prefs.apply());
$effect(() => {
	setAnalyticsContext({
		framework: prefs.framework,
		dialect: prefs.dialect,
		pm: prefs.pm,
	});
});
onMount(() => {
	void initAnalytics();
	provideWebMcp();
	// Fades out the boot screen app.html paints before hydration, then drops it.
	const root = document.documentElement;
	root.dataset.ready = "";
	setTimeout(() => document.getElementById("boot")?.remove(), 400);
});

// The landing view is sent by initAnalytics; client-side route changes are ours to send.
const changesPage = (from?: URL, to?: URL) => from?.pathname !== to?.pathname;

beforeNavigate(({ from, to, willUnload, shallow }) => {
	if (shallow) return;
	if (!willUnload && changesPage(from?.url, to?.url)) track("$pageleave");
});

afterNavigate(({ from, to, type, shallow }) => {
	if (shallow) return;

	// Read `page`: on the first ("enter") navigation, `to.route` and `to.params` are empty.
	const onComponent = page.route.id === "/components/[category]/[slug]";
	setAnalyticsContext({
		component: onComponent ? page.params.slug : null,
		category: onComponent ? page.params.category : null,
	});
	if (type !== "enter" && changesPage(from?.url, to?.url)) track("$pageview");
});
</script>

<ModeWatcher />
<NavProgress />
<SiteHeader />
<PreferencesPanel />
<!-- Matches SiteHeader's single 56px row; sticky rails and anchors offset by the same value. -->
<div class="pt-(--header-h) [--header-h:3.5rem]">
	{@render children()}
</div>
