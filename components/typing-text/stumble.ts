const WRONG_CHARS = "!@#$%^&*()QWERTY";

/** One frame of a stumbling pass: the text shown, then how long it stays, at the reference pace. */
export type TypingStumbleStep = { text: string; wait: number };

/** Seeded so a string always types the same way, on the server and the client. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Every frame of one typing pass: typos appear and get corrected before the right key. */
export function typingStumbleSteps(text: string, seed = 0): TypingStumbleStep[] {
	const rand = random(seed + text.length * 7919);
	const wrong = () => WRONG_CHARS[Math.floor(rand() * WRONG_CHARS.length)] ?? "";
	const steps: TypingStumbleStep[] = [{ text: "", wait: 500 }];
	let typed = "";
	for (const char of text) {
		if (char !== " " && rand() > 0.6) {
			steps.push({ text: typed + wrong(), wait: 100 + rand() * 150 });
			steps.push({ text: typed, wait: 80 });
			if (rand() > 0.5) {
				steps.push({ text: typed + wrong(), wait: 120 });
				steps.push({ text: typed, wait: 80 });
			}
			typed += char;
			steps.push({ text: typed, wait: 50 + rand() * 100 });
		} else {
			typed += char;
			steps.push({ text: typed, wait: 40 + rand() * 80 });
		}
	}
	return steps;
}
