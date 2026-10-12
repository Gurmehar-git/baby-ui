export type ComponentDates = Record<string, { added: string; updated?: string }>;

export function componentDates(cwd: string, today?: string): ComponentDates;
