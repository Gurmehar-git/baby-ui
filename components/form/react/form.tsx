import { type AnyFieldApi, type AnyFormApi, useSelector } from "@tanstack/react-form";
import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
} from "react";
import { Button } from "../../button/react/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	type FieldOrientation,
} from "../../field/react/field";
import { cn } from "../../lib/cn";
import {
	type FormControlProps,
	type FormSpacing,
	formFieldIds,
	formFieldState,
	form as formStyles,
} from "../variants";

export type { FormControlProps, FormSpacing };

type FormFieldContextValue = {
	field: AnyFieldApi;
	ids: ReturnType<typeof formFieldIds>;
	invalid: boolean;
	errors: ReturnType<typeof formFieldState>["errors"];
};

const FormContext = createContext<AnyFormApi | null>(null);
const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function useFormField(part: string): FormFieldContextValue {
	const context = useContext(FormFieldContext);
	if (!context) throw new Error(`<${part}> must be inside <FormField>.`);
	return context;
}

/** A `<form>` whose submit runs TanStack Form's `handleSubmit` (validation included). */
export function Form({
	form,
	onSubmit,
	...props
}: ComponentProps<"form"> & { form: AnyFormApi }) {
	return (
		<FormContext.Provider value={form}>
			<form
				data-slot="form"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					onSubmit?.(event);
					void form.handleSubmit();
				}}
				{...props}
			/>
		</FormContext.Provider>
	);
}

/** Wraps one TanStack field in a Field: invalid state, ids and errors for the parts inside. */
export function FormField({
	field,
	orientation = "vertical",
	spacing = "comfortable",
	className,
	...props
}: ComponentProps<"div"> & {
	field: AnyFieldApi;
	orientation?: FieldOrientation;
	spacing?: FormSpacing;
}) {
	const ids = formFieldIds(useId());
	const { invalid, errors } = formFieldState(field.state.meta);
	return (
		<FormFieldContext.Provider value={{ field, ids, invalid, errors }}>
			<Field
				data-invalid={invalid}
				orientation={orientation}
				className={cn(formStyles({ spacing }).field(), className)}
				{...props}
			/>
		</FormFieldContext.Provider>
	);
}

export function FormLabel(props: ComponentProps<typeof FieldLabel>) {
	const { ids } = useFormField("FormLabel");
	return <FieldLabel htmlFor={ids.control} {...props} />;
}

/** Hands the control its id, name, aria state and blur handler; value and change stay yours. */
export function FormControl({
	children,
}: {
	children: (props: FormControlProps & { onBlur: () => void }) => ReactNode;
}) {
	const { field, ids, invalid } = useFormField("FormControl");
	return children({
		id: ids.control,
		name: field.name,
		"aria-invalid": invalid,
		"aria-describedby": invalid ? `${ids.description} ${ids.errors}` : ids.description,
		onBlur: field.handleBlur,
	});
}

export function FormDescription(props: ComponentProps<typeof FieldDescription>) {
	const { ids } = useFormField("FormDescription");
	return <FieldDescription id={ids.description} {...props} />;
}

/** The field's errors once it is invalid; renders nothing while the field is valid. */
export function FormFieldErrors(
	props: Omit<ComponentProps<typeof FieldError>, "errors">,
) {
	const { ids, errors } = useFormField("FormFieldErrors");
	return <FieldError id={ids.errors} errors={errors} {...props} />;
}

/** A submit button that shows Button's loading state while the form submits. */
export function FormButton({ loading, ...props }: ComponentProps<typeof Button>) {
	const form = useContext(FormContext);
	if (!form) throw new Error("<FormButton> must be inside <Form>.");
	const submitting = useSelector(form.store, (state) => state.isSubmitting);
	return <Button type="submit" loading={loading || submitting} {...props} />;
}
