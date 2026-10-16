export type FlightStatus =
	| "scheduled"
	| "boarding"
	| "departed"
	| "delayed"
	| "landed"
	| "cancelled";

export type FlightStatusLabels = Record<FlightStatus, string> & {
	/** Accessible name of the progress bar. */
	progress: string;
	/** Screen-reader joiner between the two airport codes. */
	to: string;
};

export const FLIGHT_STATUS_LABELS: FlightStatusLabels = {
	scheduled: "Scheduled",
	boarding: "Boarding",
	departed: "In flight",
	delayed: "Delayed",
	landed: "Landed",
	cancelled: "Cancelled",
	progress: "Flight progress",
	to: "to",
};

export const MATRIX_COLS = 5;
export const MATRIX_ROWS = 7;
export const MATRIX_DOT = 5;
export const MATRIX_GAP = 2;
export const MATRIX_WIDTH = MATRIX_COLS * MATRIX_DOT + (MATRIX_COLS - 1) * MATRIX_GAP;
export const MATRIX_HEIGHT = MATRIX_ROWS * MATRIX_DOT + (MATRIX_ROWS - 1) * MATRIX_GAP;

const GLYPHS: Record<string, string> = {
	A: "00100 01010 10001 11111 10001 10001 10001",
	B: "11110 10001 10001 11110 10001 10001 11110",
	C: "01110 10001 10000 10000 10000 10001 01110",
	D: "11110 10001 10001 10001 10001 10001 11110",
	E: "11111 10000 10000 11110 10000 10000 11111",
	F: "11111 10000 10000 11110 10000 10000 10000",
	G: "01110 10001 10000 10111 10001 10001 01110",
	H: "10001 10001 10001 11111 10001 10001 10001",
	I: "11111 00100 00100 00100 00100 00100 11111",
	J: "00111 00010 00010 00010 10010 10010 01100",
	K: "10001 10010 10100 11000 10100 10010 10001",
	L: "10000 10000 10000 10000 10000 10000 11111",
	M: "10001 11011 10101 10001 10001 10001 10001",
	N: "10001 11001 10101 10011 10001 10001 10001",
	O: "01110 10001 10001 10001 10001 10001 01110",
	P: "11110 10001 10001 11110 10000 10000 10000",
	Q: "01110 10001 10001 10001 10101 10010 01101",
	R: "11110 10001 10001 11110 10100 10010 10001",
	S: "01111 10000 10000 01110 00001 00001 11110",
	T: "11111 00100 00100 00100 00100 00100 00100",
	U: "10001 10001 10001 10001 10001 10001 01110",
	V: "10001 10001 10001 10001 01010 01010 00100",
	W: "10001 10001 10001 10101 10101 11011 10001",
	X: "10001 01010 00100 00100 00100 01010 10001",
	Y: "10001 01010 00100 00100 00100 00100 00100",
	Z: "11111 00010 00100 01000 10000 10000 11111",
	"0": "01110 10001 10011 10101 11001 10001 01110",
	"1": "00100 01100 00100 00100 00100 00100 01110",
	"2": "01110 10001 00001 00010 00100 01000 11111",
	"3": "11110 00001 00001 01110 00001 00001 11110",
	"4": "00010 00110 01010 10010 11111 00010 00010",
	"5": "11111 10000 11110 00001 00001 10001 01110",
	"6": "00110 01000 10000 11110 10001 10001 01110",
	"7": "11111 00001 00010 00100 01000 01000 01000",
	"8": "01110 10001 10001 01110 10001 10001 01110",
	"9": "01110 10001 10001 01111 00001 00010 01100",
	"-": "00000 00000 00000 11111 00000 00000 00000",
};

export type MatrixDot = { x: number; y: number; on: boolean };

/** Dot positions for one character; unknown characters render every dot off. */
export function matrixDots(char: string): MatrixDot[] {
	const rows = (GLYPHS[char.toUpperCase()] ?? "").split(" ");
	const dots: MatrixDot[] = [];
	for (let r = 0; r < MATRIX_ROWS; r++) {
		for (let c = 0; c < MATRIX_COLS; c++) {
			dots.push({
				x: c * (MATRIX_DOT + MATRIX_GAP) + MATRIX_DOT / 2,
				y: r * (MATRIX_DOT + MATRIX_GAP) + MATRIX_DOT / 2,
				on: rows[r]?.[c] === "1",
			});
		}
	}
	return dots;
}

export function clampProgress(progress: number): number {
	return Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0;
}
