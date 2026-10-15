---
name: baby-ui-design
description: Adopt Baby UI's tokens and design system in an app, or audit any page or component for consistent, measured, production-grade UI. Use for "audit UI consistency", "design-system audit", "adopt Baby UI tokens", "check this component against Baby UI".
---

# baby-ui-design

Measured design-system work: every finding is a rule ID, a number and a fix. No adjectives.

## Pick the mode

| Mode | When | Read |
| --- | --- | --- |
| `adopt` | An app wants Baby UI's look | [references/adopt.md](references/adopt.md) |
| `audit` | "Audit this page/component", any repo | [references/audit.md](references/audit.md) |
| `maintain` | Inside the baby-ui repo | [references/maintain.md](references/maintain.md) |

The rulebook all modes cite: [references/rules.md](references/rules.md). Motion detail:
[references/motion.md](references/motion.md). UX checks: [references/ux.md](references/ux.md).

## Scripts (Node 22+, no install; any Chromium: Edge, Chrome, Brave, set `PROBE_BROWSER` to pick)

```bash
node scripts/audit-tokens.mjs src/app.css            # contrast pairs, surface steps, neutral hue
node scripts/scan-source.mjs src/components          # raw colours, motion, type, monoliths
node scripts/audit-page.mjs http://localhost:5173/x --selector="main" --dark --width=390
node scripts/report.mjs --tokens=src/app.css --source=src --url=http://localhost:5173/x
```

Every script prints `--help`, takes `--json`, exits 1 on a blocker and closes its browser.

## Rules of engagement

1. Read the app's real tokens and overrides first; audit what users see, not the docs.
2. Measure before opinions. Run the scripts, then judge what they can't (purpose, hierarchy).
3. Fix the model before the hue: an overloaded token or a monolith component is the root cause.
4. Fix order: blockers, then token model and composition, then drift, then polish.
5. Components are built from parts like shadcn's Empty or Card (`COMPOSE-001`), never one wrapper laid out from props.
6. Writing everywhere: no em or en dashes, numbers over adjectives, comments at most 2 lines.
7. Report: the scorecard path, blockers first, and the gate output. Never claim a pass you didn't run.

Companion skills deepen a mode if installed (`auditing-design-systems`, `emil-design-eng`,
`ux-friction-analyzer`, `deslop`, `site-redesign`); this skill works without them. For the
premium bar and redesign commands, use `baby-ui-premium`.
