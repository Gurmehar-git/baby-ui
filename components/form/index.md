---
title: Form
description: Field parts wired to TanStack Form, so ids, invalid state, errors and submit are handled for you.
component: form
category: base
tags: [form, tanstack form, validation, zod, standard schema]
---

Built on [TanStack Form](https://tanstack.com/form) (`@tanstack/react-form` or
`@tanstack/svelte-form`) and the [Field](/components/base/field) parts. You own the form
instance and each control's value; the parts own the wiring:

- `Form` submits through the form's `handleSubmit`, so validation runs first.
- `FormField` wraps the field `form.Field` hands you and marks it invalid once it is touched and
  failing. Submitting touches every field.
- `FormLabel`, `FormDescription` and `FormFieldErrors` get their ids from the field.
- `FormControl` passes `id`, `name`, `aria-invalid`, `aria-describedby` and the blur handler to your
  control: a render function in React, a `child` snippet in Svelte.
- `FormButton` shows Button's loading state while the form submits.

## Validation

Any Standard Schema validator works, zod included. Pick when it runs per form or per field:
`validators: { onChange, onBlur, onSubmit }`. The demo validates on blur and on submit.

## Server actions

Nothing here needs a framework. In SvelteKit or a React server action, post from `onSubmit` and
map server errors back with `form.setErrorMap`.
