import type { VariantProps } from "tailwind-variants";
import type { dateField } from "../../date-field/react/variants";

export type DatePickerSize = NonNullable<VariantProps<typeof dateField>["size"]>;
