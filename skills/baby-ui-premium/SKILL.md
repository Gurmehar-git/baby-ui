---
name: baby-ui-premium
description: Premium-quality bar for UI components with verify, revamp, rework and redesign commands; audits motion, micro-interactions, states, composition, layout, accessibility and UX laws. Use for "premium check", "polish this component", "revamp/rework/redesign component", "motion audit".
---

# baby-ui-premium

`baby-ui-design` asks "does it follow the system?". This asks "would a demanding designer ship
it?". Premium is a floor. Needs `baby-ui-design` installed beside it (shared scripts):
`npx skills add kanakkholwal/baby-ui --skill baby-ui-design --skill baby-ui-premium`.

## Commands

| Command | Writes code | Scope |
| --- | --- | --- |
| `verify` | No | Score against [references/premium.md](references/premium.md); Block, Pending or Approve |
| `revamp` | Same API | Fix every finding: motion, states, spacing, type, a11y |
| `rework` | API may change | Rebuild internals; split a monolith into parts; list every prop change and add a migration note |
| `redesign` | New concept | Offer 2 or 3 directions (ASCII), wait for a pick, unless the user pre-approved |

Always `verify` first and last; a change without a before/after score didn't happen.

## Run

```bash
node scripts/premium-score.mjs <url> --selector="[data-demo-canvas]" --out=.notes/premium
node scripts/premium-score.mjs <url> --manual=purpose:4,ux:3,cohesion:4   # after judging by hand
node scripts/motion-probe.mjs <url>      # durations, easing, enter/exit ratio, keyframe restarts
node scripts/states-probe.mjs <url>      # rest vs hover vs press vs focus
```

The script scores what it can measure. You score purpose, UX laws and cohesion with evidence,
using [references/profiles.md](references/profiles.md) for the component type and
[references/laws.md](references/laws.md). Until those are in, the verdict is Pending.

## The bar

- **Calibrated against exemplars:**
  - a carousel that moves on transforms only, drags 1:1, settles on the nearest item, steps by wheel, crossfades captions through a 2px blur, and keeps a roving tab stop with a polite live caption;
  - OG cards with one focal point, a strict type hierarchy, restrained colour and an even rhythm.
- **Every state designed:** rest, hover, press, focus-visible, selected, disabled, loading, error, empty.
- **Motion:** purposeful, token-timed, interruptible and origin-aware, with exits shorter than entrances and reduced motion kept meaningful.
- **Composed from parts:** a prop-driven monolith caps every score at 2.

Rules for writing: no em or en dashes, numbers over adjectives, comments at most 2 lines, no
names of studied reference libraries in shipped code or docs. Details: [references/commands.md](references/commands.md).
