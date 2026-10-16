---
title: Property Panel
description: A dense inspector for settings and tweak panels, composed by hand or generated from a DialKit-style config.
component: property-panel
category: advanced
tags: [property-panel, inspector, settings, dialkit]
---

A dense inspector for settings sheets, editor sidebars and live tweak panels. Groups are split
by hairlines; each has an eyebrow label, an optional action on the same line, and rows that put
a fixed muted label column beside a full-width control, every row 32px tall.

Hand `PropertyPanelControls` a config and it renders baby-ui controls, in the shape DialKit
uses, so a DialKit config works as is:

- `[default, min, max, step?]` is a Slider; a number is a NumberInput; a boolean is a Switch.
- A hex string is a ColorPicker field; any other string is an Input.
- `{ type: "select" | "combobox" | "segmented", options }` is a Select, Combobox or ToggleGroup.
- `{ type: "action" }` is a button that calls `onAction` with its path.
- A nested object is a folder: its own collapsible group.

It is controlled: `values` and `onValuesChange` in React, `bind:values` in Svelte, with values
shaped like the config. `PropertyPanelRow` renders a single entry, for panels that mix generated
rows with your own.

To compose by hand, use PropertyPanelGroup, PropertyPanelGroupLabel, PropertyPanelGroupAction
and PropertyPanelGroupContent with `Field orientation="horizontal" size="sm"` rows. Set
`collapsible` on a group to turn its label into a toggle; the action stays outside it, so a
switch in the header never opens or closes the group.
