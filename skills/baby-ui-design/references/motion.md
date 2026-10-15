# Motion

## Decide first

| Seen | Decision |
| --- | --- |
| 100+ times a day, or keyboard-initiated | No animation |
| Tens of times a day (hover, list moves) | Minimal: colour or a 100 to 150ms fade |
| Occasional (menus, dialogs, toasts) | Standard |
| Rare (onboarding, celebration) | Room for delight |

Every animation answers why: spatial continuity, state change, feedback, explanation, or
preventing a jarring change. "It looks nice" on a frequent element means delete it.

## Values (Baby UI tokens)

- **Durations:**
  - `--duration-instant` 100ms (exits, colour);
  - `--duration-fast` 150ms (press, dropdown, tooltip);
  - `--duration-base` 200ms (collapse);
  - `--duration-slow` 250ms (overlay entrance).
  - Raw numbers are a finding (MOTION-004).
- **Easing:**
  - `--ease-ui-out` for entrances and responses;
  - `--ease-ui-in-out` for on-screen moves;
  - `--ease-drawer` for sheets;
  - the sampled springs `--ease-spring-snappy` with `--duration-spring-snappy` for highlights that glide.
  - Never `ease-in` on UI. `linear` only for spinners, marquees and progress loops.
- **Exits** run about 60 to 70% of the entrance.
- **Press:** scale to `--press-scale` (sm, lg, icon and row variants) on pointer-down, ease back over `--duration-slow`.

## Physical rules

- Nothing appears from `scale(0)`: start at 0.95 to 0.97 with opacity 0.
- Popovers grow from their trigger (`transform-origin: var(--transform-origin)`); modals stay centred.
- **Size changes:**
  - animate `grid-template-rows` (0fr to 1fr) on a clip wrapper with `min-h-0 overflow-hidden`;
  - padding and borders go inside the clip, or the fold stalls at their height.
- Removal folds first, then hands back (`lib/motion.ts` `transitionMs`); neighbours glide.
- **Interruptible:** use transitions or springs that retarget, never keyframes on toggles or rapid UI.
- Transform and opacity only, except grid-template-rows/columns for size.
- Explanatory motion (number tickers, marquees, demos) may run longer than 300ms. Mark its root `data-motion="explanatory"` so audits skip it from the UI budget.
- Gate hover motion to fine pointers. Under reduced motion keep opacity and colour, drop travel.
- Primitives that hide closed content with `hidden` kill exit transitions: use `keepMounted` (Base UI) or `forceMount` (bits-ui).

## Naming

Name what you saw with the exact term: origin-aware animation, stagger, layout animation,
crossfade, morph, rubber-banding, interruptible animation, momentum. Findings use these words.
