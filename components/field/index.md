---
title: Field
description: Label, control, description and error laid out as one accessible unit, with shadcn's exact part names.
component: field
category: base
tags: [field, form, validation, fieldset]
---

The same parts as shadcn's Field (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`,
`FieldGroup`, `FieldSet`, `FieldLegend`, `FieldContent`, `FieldTitle`, `FieldSeparator`), so
shadcn's form blocks drop in. `import * as Field` works too, as `Field.Label` and so on.

## Errors

`FieldError` takes `errors` in the `{ message }` shape zod and react-hook-form report, drops
duplicates and blanks, and renders nothing when there is nothing to say. It uses
`role="alert"`, so a new message is announced once.

## Wiring

Give the control an `id`, point `aria-describedby` at the description and error ids, and set
`aria-invalid` when it fails. Set `data-invalid` on `Field` to colour the label to match.

## With react-hook-form

```tsx
<Controller
	name="email"
	control={form.control}
	render={({ field, fieldState }) => (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor="email">Email</FieldLabel>
			<Input {...field} id="email" aria-invalid={fieldState.invalid} />
			<FieldError errors={[fieldState.error]} />
		</Field>
	)}
/>
```
