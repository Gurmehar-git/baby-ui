/** An expected failure: printed without a stack trace, exits with `code`. */
export class CliError extends Error {
	readonly code: number;
	readonly hint: string | undefined;

	constructor(message: string, options: { hint?: string; code?: number } = {}) {
		super(message);
		this.name = "CliError";
		this.hint = options.hint;
		this.code = options.code ?? 1;
	}
}
