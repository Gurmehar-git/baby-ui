export type FilterRowStatus = "todo" | "progress" | "done";

export type FilterRow = {
	task: string;
	date: string;
	status: FilterRowStatus;
	owner: string;
};

export type FilterTableLabels = {
	columns: { task: string; date: string; status: string; owner: string };
};
