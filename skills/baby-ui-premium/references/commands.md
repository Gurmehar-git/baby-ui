# Commands in detail

## verify

1. Run `premium-score.mjs <url> --selector=<root> --out=<notes>/premium`.
2. Read the component source. Score purpose, UX laws and cohesion from profiles.md and laws.md, with one line of evidence each.
3. Re-run with `--manual=purpose:n,ux:n,cohesion:n`.
4. Reply with the verdict, the category table, and the top three findings with fixes.

## revamp (API unchanged)

- Fix every finding in place: tokens, motion values, states, spacing, type, a11y.
- Keep prop names, part names and defaults; demos must not need edits.

## rework (API may change)

- **Split a monolith:**
  - root with context;
  - named parts with `data-slot`;
  - data arrays stay props.
- Keep the old root's data props where they still make sense. Move layout, copy and actions into parts.
- List every prop change, update demos, usage and docs, and add a "Migrating" section.

## redesign (new concept)

1. Write 2 or 3 directions as ASCII mockups with one line each on motion and why.
2. Wait for a pick, unless the user pre-approved working unattended. In that case, pick the direction that best fits the exemplar bar and the product's existing language, and log why in the notes.
3. Then rework to the chosen direction and verify.

## Always

- Verify before and after; store both score files.
- Run the repo's gates.
- Never commit.
