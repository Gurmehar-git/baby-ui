# Adopt Baby UI in an app

1. **Detect the stack.**
   - React or Svelte; Tailwind v4 (`@import "tailwindcss"`);
   - an existing shadcn theme (`components.json`, `--primary` in CSS).
   - Notes go in `.notes/` or `.local/` (gitignored).
2. **Install tokens.**
   - Keep your theme and add Baby UI's extras: `npx shadcn add https://baby-ui.pages.dev/r/tokens.json`.
   - Take the whole look: `npx shadcn add https://baby-ui.pages.dev/r/theme.json`.
   - Svelte: `npx shadcn-svelte add https://baby-ui.pages.dev/svelte/r/theme.json` (or `tokens.json`).
   - Tokens are additive; they never redefine shadcn or Tailwind names (TOKEN-004).
3. **Map the brand.**
   - Put the brand on `--primary` per mode.
   - Measure the label on it with `audit-tokens.mjs`; it must clear 4.5:1 (COLOR-001).
   - A light hue needs a darker ink for text and rings.
4. **Install components** with `npx shadcn add @baby-ui/<slug>`. Compose their parts; don't wrap them in prop-driven monoliths (COMPOSE-001).
5. **Replace raw values.**
   - Run `scan-source.mjs src`.
   - Swap raw colours (TOKEN-001/002), durations (MOTION-004), shadows (SURF-003) and font sizes (TYPE-001) for tokens.
6. **Fonts:** the theme ships Inter, JetBrains Mono, Newsreader and Satoshi. Keep the app's own faces if it has them; only the variables change.
7. **Audit.** Run `report.mjs` on the main routes, light, dark and 390px. Fix blockers first.
8. **Checkpoint.** Show the user the scorecard before any visual direction change. Never change an owner-chosen accent, font or banned pattern without asking.
