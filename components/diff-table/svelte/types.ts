import type { DiffRowChange } from "./variants";

export type DiffRow = {
	key: string;
	label: string;
	category: string;
	detail: string;
	change: DiffRowChange;
	included?: boolean;
};
