<script lang="ts">
import type { ComponentProps } from "svelte";
import PropertyPanel from "./property-panel.svelte";
import PropertyPanelGroup from "./property-panel-group.svelte";
import PropertyPanelGroupContent from "./property-panel-group-content.svelte";
import PropertyPanelGroupLabel from "./property-panel-group-label.svelte";
import PropertyPanelRow from "./property-panel-row.svelte";
import {
	getPropertyValue,
	type PropertySchema,
	type PropertyValue,
	type PropertyValues,
	propertyDefaults,
	propertyGroups,
	propertyNodes,
	setPropertyValue,
} from "./schema";

let {
	schema,
	title,
	values = $bindable(),
	onValuesChange,
	onAction,
	collapsible = true,
	...rest
}: Omit<ComponentProps<typeof PropertyPanel>, "children"> & {
	/** A DialKit-style config: the panel renders one baby-ui control per entry. */
	schema: PropertySchema;
	/** Label of the group holding the top-level rows. */
	title?: string;
	/** Values shaped like the config. Bindable; starts at the config's own when unset. */
	values?: PropertyValues;
	onValuesChange?: (values: PropertyValues, path: string) => void;
	/** Called with the dotted path of a clicked `{ type: "action" }` entry. */
	onAction?: (path: string) => void;
	/** Folders collapse behind their label. */
	collapsible?: boolean;
} = $props();

const current = $derived(values ?? propertyDefaults(schema));
const groups = $derived(propertyGroups(propertyNodes(schema), title));

function set(path: string, value: PropertyValue) {
	values = setPropertyValue(current, path, value);
	onValuesChange?.(values, path);
}
</script>

<PropertyPanel data-slot="property-panel-controls" {...rest}>
	{#each groups as group (group.key || "root")}
		<PropertyPanelGroup collapsible={group.folder && collapsible}>
			{#if group.label}
				<PropertyPanelGroupLabel>{group.label}</PropertyPanelGroupLabel>
			{/if}
			<PropertyPanelGroupContent>
				{#each group.fields as field (field.path)}
					<PropertyPanelRow
						{field}
						value={getPropertyValue(current, field.path)}
						onChange={(next) => set(field.path, next)}
						{onAction}
					/>
				{/each}
			</PropertyPanelGroupContent>
		</PropertyPanelGroup>
	{/each}
</PropertyPanel>
