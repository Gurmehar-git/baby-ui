<script lang="ts">
import type { Icon } from "@baby-ui/icons";
import { IconAdjustmentsHorizontal, IconCheck, IconLayoutGrid } from "@baby-ui/icons";
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
import { type PageLayout, prefs, THEMES } from "#lib/preferences.svelte.js";
import { prefetchReact } from "#lib/react-demos.js";
import { DIALECT_OPTIONS, FRAMEWORK_OPTIONS } from "#lib/technology-options.js";
import { page } from "$app/state";

const LAYOUTS: { id: PageLayout; label: string; icon: Icon }[] = [
	{ id: "library", label: "Library", icon: IconLayoutGrid },
	{ id: "playground", label: "Playground", icon: IconAdjustmentsHorizontal },
];

const currentLayout = $derived(LAYOUTS.find((layout) => layout.id === prefs.layout));
const currentFramework = $derived(
	FRAMEWORK_OPTIONS.find((framework) => framework.id === prefs.framework),
);
const currentDialect = $derived(
	DIALECT_OPTIONS.find((dialect) => dialect.id === prefs.dialect),
);

// Resolving through LAYOUTS narrows the select's string back to a PageLayout without a cast.
function pickLayout(next: string) {
	const hit = LAYOUTS.find((layout) => layout.id === next);
	if (hit) prefs.set("layout", hit.id);
}

function pickFramework(next: string) {
	const hit = FRAMEWORK_OPTIONS.find((framework) => framework.id === next);
	if (hit) prefs.set("framework", hit.id);
}

function pickDialect(next: string) {
	const hit = DIALECT_OPTIONS.find((dialect) => dialect.id === next);
	if (hit) prefs.set("dialect", hit.id);
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
							size="sm"
							items={LAYOUTS.map((layout) => ({ value: layout.id, label: layout.label }))}
							bind:value={() => prefs.layout, pickLayout}
						>
							<SelectTrigger aria-label="Page layout" class="w-full">
								{#if currentLayout}
									<span class="flex min-w-0 items-center gap-1.5">
										<currentLayout.icon size={14} class="shrink-0 text-muted-foreground" />
										{currentLayout.label}
									</span>
								{:else}
									<SelectValue />
								{/if}
							</SelectTrigger>
							<SelectContent>
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
						<Select
							size="sm"
							items={FRAMEWORK_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
							bind:value={() => prefs.framework, pickFramework}
						>
							<!-- Hovering the switch warms React and this page's demo, so picking it is instant. -->
							<SelectTrigger
								aria-label="Framework"
								class="w-full"
								onpointerenter={() => {
									if (prefs.framework !== "react") prefetchReact(page.params.slug);
								}}
							>
								{#if currentFramework}
									<currentFramework.icon class={currentFramework.iconClass} />
									{currentFramework.label}
								{:else}
									<SelectValue />
								{/if}
							</SelectTrigger>
							<SelectContent>
								{#each FRAMEWORK_OPTIONS as option (option.id)}
									<SelectItem value={option.id} label={option.label}>
										<option.icon class={option.iconClass} />
										{option.label}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</Field>
					<Field orientation="horizontal" size="sm">
						<FieldLabel>Language</FieldLabel>
						<Select
							size="sm"
							items={DIALECT_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
							bind:value={() => prefs.dialect, pickDialect}
						>
							<SelectTrigger aria-label="Language" class="w-full">
								{#if currentDialect}
									<currentDialect.icon class={currentDialect.iconClass} />
									{currentDialect.label}
								{:else}
									<SelectValue />
								{/if}
							</SelectTrigger>
							<SelectContent>
								{#each DIALECT_OPTIONS as option (option.id)}
									<SelectItem value={option.id} label={option.label}>
										<option.icon class={option.iconClass} />
										{option.label}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</Field>
				</PropertyPanelGroupContent>
			</PropertyPanelGroup>
		</PropertyPanel>

	</SheetContent>
</Sheet>
