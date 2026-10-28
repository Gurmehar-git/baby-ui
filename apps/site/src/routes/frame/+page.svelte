<script lang="ts">
import DemoPreview from "#lib/components/demo-preview.svelte";
import { demos } from "#lib/demos.js";
import { page } from "$app/state";

// `?slug=button&framework=react&props={"variant":"outline"}`: one demo, no site chrome.
const slug = $derived(page.url.searchParams.get("slug") ?? "");
const framework = $derived(
	page.url.searchParams.get("framework") === "react" ? "react" : "svelte",
);
const props = $derived.by((): Record<string, unknown> => {
	try {
		const parsed: unknown = JSON.parse(page.url.searchParams.get("props") ?? "{}");
		return typeof parsed === "object" && parsed !== null ? { ...parsed } : {};
	} catch {
		return {};
	}
});
</script>

<svelte:head>
	<title>{slug || "Preview"} · Baby UI</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="min-h-dvh bg-background p-4">
	<DemoPreview {framework} {slug} demo={demos[slug]} {props} class="min-h-[calc(100dvh-2rem)]" />
</main>
