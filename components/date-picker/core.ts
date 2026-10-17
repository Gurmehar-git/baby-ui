import { DATE_FIELD_LABELS, type DateFieldLabels } from "../date-field/core";

export interface DatePickerLabels extends DateFieldLabels {
	choose: string;
}

export const DATE_PICKER_LABELS: DatePickerLabels = {
	...DATE_FIELD_LABELS,
	choose: "Choose date",
};
