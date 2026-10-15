# Audit a page or component

## Run order

1. **Tokens:** `audit-tokens.mjs <css>` on the real token file and any app override.
2. **Source:** `scan-source.mjs <component dirs>`.
3. **Page:** `audit-page.mjs <url> --selector=<component root>`, light, then `--dark`, then `--width=390`.
4. **Report:** `report.mjs --tokens=... --source=... --url=...` writes `design-audit.md` and `.json` to `.notes/` (else `.local/`).
5. **By hand:** walk the `by hand` rules in rules.md that apply. Cite evidence (file:line, a measured value).

## Reading the scorecard

- Each finding is a rule ID, where, the measured value and the fix.
- The score is 100 minus weighted findings (blocker 10, high 4, medium 2, low 0.5), floored at 0, per category and overall.
- Unmeasured is not passing. A contrast check skipped over a gradient is listed as unmeasured; check it by eye or in a sample.

## Fix order

1. Blockers: contrast, names, focus, console errors, monoliths in new code.
2. The model: an overloaded token, a missing parts API, a second floating-surface style.
3. Drift: raw durations, shadows, font sizes, colours.
4. Polish: copy, tracking, press feel.

## Report format (reply)

- Lead with the score and the blocker count.
- One line per blocker: `RULE where: measured -> fix`.
- The scorecard path, and the commands run with their exit codes.
