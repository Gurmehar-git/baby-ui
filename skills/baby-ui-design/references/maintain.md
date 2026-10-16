# Maintain mode (inside the baby-ui repo)

Read `.agents/rules.md` first; it outranks this file.

## Extra checks beyond the rulebook

- API-001 to API-005 on every touched component, in both ports.
- Parts in both ports: Svelte uses one file per part plus `context.ts`; React keeps parts in the component file.
- Spec (`components/<slug>/<slug>.ts`, or `pro/packages/schema/...`):
  - lists every shipped file;
  - prop descriptions start with the part name (`FileUploadItem: ...`);
  - motion and a11y match what ships.
- Demos (`packages/demos`):
  - each control dial changes the demo (`pnpm probe <slug> --dials`);
  - sample data lives only here.
- Docs (`components/<slug>/index.md`): show the composed API, list states, and add a migration note when an API breaks.

## Commands

```bash
pnpm design:audit <slug ...>                    # this skill's report for component pages
pnpm design:premium <slug ...>                  # baby-ui-premium score
pnpm probe <slug ...> --dials --dark --width=390
```

`baby-ui-verify` runs `scan-source.mjs` on changed `packages/ui-*` folders and the page audit
on each changed component page (light, dark, 390px). Agents never screenshot; the owner
reviews visuals.
