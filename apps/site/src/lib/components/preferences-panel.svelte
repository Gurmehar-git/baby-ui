<script lang="ts">
import type { Icon } from "@baby-ui/icons";
import {
	IconAdjustmentsHorizontal,
	IconBrandJavascript,
	IconBrandReact,
	IconBrandSvelte,
	IconBrandTypescript,
	IconCheck,
	IconLayoutGrid,
} from "@baby-ui/icons";
import type { Framework } from "@baby-ui/registry-schema";
import {
	Field,
	FieldLabel,
	PropertyPanel,
	PropertyPanelGroup,
	PropertyPanelGroupContent,
	PropertyPanelGroupLabel,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@baby-ui/svelte";
import { type Dialect, type PageLayout, prefs, THEMES } from "#lib/preferences.svelte.js";
import SegmentControl from "./segment-control.svelte";

const FRAMEWORKS: { id: Framework; label: string; icon: Icon }[] = [
	{ id: "react", label: "React", icon: IconBrandReact },
	{ id: "svelte", label: "Svelte", icon: IconBrandSvelte },
];

const DIALECTS: { id: Dialect; label: string; icon: Icon }[] = [
	{ id: "ts", label: "TS", icon: IconBrandTypescript },
	{ id: "js", label: "JS", icon: IconBrandJavascript },
];

const LAYOUTS: { id: PageLayout; label: string; icon: Icon }[] = [
	{ id: "library", label: "Library", icon: IconLayoutGrid },
	{ id: "playground", label: "Playground", icon: IconAdjustmentsHorizontal },
];

const currentLayout = $derived(LAYOUTS.find((layout) => layout.id === prefs.layout));

// Resolving through LAYOUTS narrows the select's string back to a PageLayout without a cast.
function pickLayout(next: string) {
	const hit = LAYOUTS.find((layout) => layout.id === next);
	if (hit) prefs.set("layout", hit.id);
}
</script>

<Sheet bind:open={prefs.open}>
	<SheetContent side="right" variant="framed" class="w-[min(20rem,100vw)]">
		<SheetHeader class="shrink-0">
			<SheetTitle>Settings</SheetTitle>
			<SheetClose class="size-7 rounded-md" />
		</SheetHeader>

		<!-- The groups pad themselves; pull them out to the body edge so labels align with the title. -->
		<PropertyPanel class="-mx-4 -mt-2">
			<PropertyPanelGroup>
				<PropertyPanelGroupLabel>Appearance</PropertyPanelGroupLabel>
				<PropertyPanelGroupContent>
					<Field orientation="horizontal" size="sm" class="items-start">
						<FieldLabel class="pt-1">Theme</FieldLabel>
						<div role="group" aria-label="Theme" class="flex flex-wrap gap-2">
							{#each THEMES as theme (theme.id)}
								<button
									type="button"
									onclick={() => prefs.set("theme", theme.id)}
									aria-pressed={prefs.theme === theme.id}
									aria-label={theme.name}
									title={theme.name}
									style:background={theme.swatch}
									class="grid size-6 shrink-0 place-items-center rounded-full text-white ring-offset-2 ring-offset-background transition-[box-shadow,scale] hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-foreground/40"
								>
									{#if prefs.theme === theme.id}
										<IconCheck size={10} />
									{/if}
								</button>
							{/each}
						</div>
					</Field>
				</PropertyPanelGroupContent>
			</PropertyPanelGroup>

			<PropertyPanelGroup>
				<PropertyPanelGroupLabel>Components</PropertyPanelGroupLabel>
				<PropertyPanelGroupContent>
					<Field orientation="horizontal" size="sm">
						<FieldLabel>Layout</FieldLabel>
						<Select
							items={LAYOUTS.map((layout) => ({ value: layout.id, label: layout.label }))}
							bind:value={() => prefs.layout, pickLayout}
						>
							<SelectTrigger size="sm" aria-label="Page layout" class="w-full">
								{#if currentLayout}
									<span class="flex min-w-0 items-center gap-1.5">
										<currentLayout.icon size={14} class="shrink-0 text-muted-foreground" />
										{currentLayout.label}
									</span>
								{:else}
									<SelectValue />
								{/if}
							</SelectTrigger>
							<SelectContent size="sm">
								{#each LAYOUTS as layout (layout.id)}
									{@const Glyph = layout.icon}
									<SelectItem value={layout.id} label={layout.label}>
										<Glyph />
										{layout.label}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</Field>
					<Field orientation="horizontal" size="sm">
						<FieldLabel>Framework</FieldLabel>
						<SegmentControl
							size="sm"
							label="Framework"
							options={FRAMEWORKS}
							current={prefs.framework}
							onPick={(id) => prefs.set("framework", id)}
						/>
					</Field>
					<Field orientation="horizontal" size="sm">
						<FieldLabel>Language</FieldLabel>
						<SegmentControl
							size="sm"
							label="Language"
							options={DIALECTS}
							current={prefs.dialect}
							onPick={(id) => prefs.set("dialect", id)}
						/>
					</Field>
				</PropertyPanelGroupContent>
			</PropertyPanelGroup>
		</PropertyPanel>

	</SheetContent>
</Sheet>
