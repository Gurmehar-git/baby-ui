"use client";

import { type ReactNode, useId, useState } from "react";
import { Button } from "../../button/react/button";
import { ColorPicker } from "../../color-picker/react/color-picker";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
} from "../../combobox/react/combobox";
import { Field, FieldLabel } from "../../field/react/field";
import { Input } from "../../input/react/input";
import { NumberInput } from "../../number-input/react/number-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../select/react/select";
import { Slider } from "../../slider/react/slider";
import { Switch } from "../../switch/react/switch";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	PropertyPanel,
	PropertyPanelGroup,
	PropertyPanelGroupContent,
	PropertyPanelGroupLabel,
	type PropertyPanelProps,
} from "./property-panel";
import {
	getPropertyValue,
	type PropertyField,
	type PropertySchema,
	type PropertyValue,
	type PropertyValues,
	propertyDefaults,
	propertyGroups,
	propertyNodes,
	setPropertyValue,
} from "./schema";
import { propertyPanel } from "./variants";

export interface PropertyPanelControlsProps
	extends Omit<PropertyPanelProps, "children" | "defaultValue" | "onChange"> {
	/** A DialKit-style config: the panel renders one baby-ui control per entry. */
	schema: PropertySchema;
	/** Label of the group holding the top-level rows. */
	title?: string;
	/** Controlled values, shaped like the config. */
	values?: PropertyValues;
	/** Starting values when uncontrolled; defaults to the config's own. */
	defaultValues?: PropertyValues;
	onValuesChange?: (values: PropertyValues, path: string) => void;
	/** Called with the dotted path of a clicked `{ type: "action" }` entry. */
	onAction?: (path: string) => void;
	/** Folders collapse behind their label. */
	collapsible?: boolean;
}

// Shows as many decimals as the step has, so float drift never reaches the readout.
function formatStep(step: number) {
	const decimals = Math.max(0, -Math.floor(Math.log10(step)));
	return (value: number) => value.toFixed(decimals);
}

export function PropertyPanelControls({
	schema,
	title,
	values: valuesProp,
	defaultValues,
	onValuesChange,
	onAction,
	collapsible = true,
	...props
}: PropertyPanelControlsProps) {
	const [own, setOwn] = useState(() => defaultValues ?? propertyDefaults(schema));
	const values = valuesProp ?? own;
	const groups = propertyGroups(propertyNodes(schema), title);

	function set(path: string, value: PropertyValue) {
		const next = setPropertyValue(values, path, value);
		if (valuesProp === undefined) setOwn(next);
		onValuesChange?.(next, path);
	}

	return (
		<PropertyPanel data-slot="property-panel-controls" {...props}>
			{groups.map((group) => (
				<PropertyPanelGroup
					key={group.key || "root"}
					collapsible={group.folder && collapsible}
				>
					{group.label ? (
						<PropertyPanelGroupLabel>{group.label}</PropertyPanelGroupLabel>
					) : null}
					<PropertyPanelGroupContent>
						{group.fields.map((field) => (
							<PropertyPanelRow
								key={field.path}
								field={field}
								value={getPropertyValue(values, field.path)}
								onChange={(next) => set(field.path, next)}
								onAction={onAction}
							/>
						))}
					</PropertyPanelGroupContent>
				</PropertyPanelGroup>
			))}
		</PropertyPanel>
	);
}

/**
 * One config entry as a label column plus its baby-ui control, every kind at one height.
 * Exported so custom panels can mix generated rows with their own.
 */
export function PropertyPanelRow({
	field,
	value,
	onChange,
	onAction,
}: {
	field: PropertyField;
	value: PropertyValue | undefined;
	onChange: (value: PropertyValue) => void;
	onAction?: (path: string) => void;
}) {
	const id = useId();
	const [open, setOpen] = useState(false);
	const s = propertyPanel();
	const text = typeof value === "string" ? value : "";
	const num = typeof value === "number" ? value : 0;

	if (field.kind === "action")
		return (
			<Button
				variant="outline"
				size="sm"
				className={s.fill()}
				onClick={() => onAction?.(field.path)}
			>
				{field.label}
			</Button>
		);

	let control: ReactNode;
	switch (field.kind) {
		case "slider": {
			const format = formatStep(field.step);
			control = (
				<div className={s.sliderCell()}>
					<Slider
						variant="track"
						size="sm"
						label={field.label}
						min={field.min}
						max={field.max}
						step={field.step}
						value={num}
						onValueChange={(next) =>
							onChange(Array.isArray(next) ? (next[0] ?? 0) : next)
						}
					/>
					<span className={s.sliderValue()}>{format(num)}</span>
				</div>
			);
			break;
		}
		case "number":
			control = (
				<NumberInput
					size="sm"
					aria-label={field.label}
					value={num}
					onValueChange={(next) => onChange(next ?? 0)}
					className={s.fill()}
				/>
			);
			break;
		case "color":
			control = (
				<ColorPicker
					size="sm"
					label={field.label}
					value={text}
					onValueChange={onChange}
					className={s.fill()}
				/>
			);
			break;
		case "switch":
			control = (
				<Switch
					size="sm"
					aria-label={field.label}
					checked={value === true}
					onCheckedChange={onChange}
					className={s.switchCell()}
				/>
			);
			break;
		case "text":
			control = (
				<Input
					id={id}
					size="sm"
					value={text}
					onChange={(event) => onChange(event.currentTarget.value)}
				/>
			);
			break;
		case "select":
			control = (
				<Select items={field.options} value={text} onValueChange={onChange}>
					<SelectTrigger size="sm" aria-label={field.label} className={s.fill()}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent size="sm">
						{field.options.map((option) => (
							<SelectItem key={option.value} value={option.value} label={option.label}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
			break;
		case "segmented":
			control = (
				<ToggleGroup
					size="sm"
					label={field.label}
					value={text}
					onValueChange={(next) => typeof next === "string" && next && onChange(next)}
					className={s.segmented()}
				>
					{field.options.map((option) => (
						<ToggleGroupItem
							key={option.value}
							value={option.value}
							className={s.segment()}
						>
							{option.label}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			);
			break;
		case "combobox": {
			const selected = field.options.find((option) => option.value === text);
			control = (
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger size="sm" aria-label={field.label} className={s.fill()}>
						{selected?.label ?? field.placeholder ?? field.label}
					</ComboboxTrigger>
					<ComboboxContent size="sm">
						<ComboboxInput placeholder={field.placeholder ?? "Search"} />
						<ComboboxList>
							<ComboboxEmpty>No matches</ComboboxEmpty>
							<ComboboxGroup>
								{field.options.map((option) => (
									<ComboboxItem
										key={option.value}
										value={option.value}
										keywords={option.label}
										onSelect={() => {
											onChange(option.value);
											setOpen(false);
										}}
									>
										{option.label}
									</ComboboxItem>
								))}
							</ComboboxGroup>
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			);
			break;
		}
	}

	return (
		<Field orientation="horizontal" size="sm" className={s.row()}>
			<FieldLabel htmlFor={field.kind === "text" ? id : undefined}>
				{field.label}
			</FieldLabel>
			{control}
		</Field>
	);
}
