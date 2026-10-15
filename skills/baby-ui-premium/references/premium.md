# Premium rubric

Each category scores 0 to 4. Premium means:
- every category is at least 3;
- motion and states score 4;
- there are no blockers.

A COMPOSE finding caps every category at 2. Findings name motion with its exact term
(origin-aware animation, stagger, interruptible animation, rubber-banding).

| # | Category | Measured by | 4 means |
| --- | --- | --- | --- |
| 1 | Purpose and frequency | by hand | Every animation has a job; frequent and keyboard actions don't animate; delight only where rare |
| 2 | Motion craft | motion-probe, audit-page, scan | Token durations; ease-out in, ease-in-out moves; at most 300ms UI; exits 60 to 70% of entrances; nothing from scale(0); stagger 30 to 80ms; blur-bridged crossfades |
| 3 | Interruptibility and performance | motion-probe | Transitions or springs retarget mid-flight; transform/opacity (grid rows for size); no layout shift; 60fps |
| 4 | Composition | scan-source | Root plus named parts via context; data arrays as props, layout as parts |
| 5 | Micro-interactions and states | states-probe, audit-page | Hover (fine pointer), press squish on pointer-down, visible focus, selected, disabled, loading, error, empty: each distinct, each animated |
| 6 | Materials, depth and tokens | scan, by hand | Surface ladder, one floating material, token shadows, purposeful translucency with a reduced-transparency fallback |
| 7 | Layout, sizing and rhythm | audit-page, by hand | Control ladder, concentric radii, 4px rhythm, optical alignment, no overflow at 390px |
| 8 | Typography and copy | scan, by hand | Type ladder, size-specific tracking, tabular live numbers, specific microcopy, error copy with a fix |
| 9 | Accessibility | audit-page | WCAG 2.2 AA contrast, names, 24px targets, keyboard parity for every pointer action, Escape and focus return, live regions |
| 10 | UX laws and psychology | by hand (laws.md) | The laws in the component's profile hold; no extraneous load; forgiving |
| 11 | Cohesion and identity | by hand | One concept through every part; motion personality fits (crisp for data, softer for marketing) |

Scoring by script: start at 4 and subtract per finding (blocker 4, high 1.5, medium 0.75,
low 0.25), floored at 0. Override a script score only with written evidence (a false positive,
an exempt template).

## Verdict

- **Block:** a blocker, any category under 3, or motion or states under 4.
- **Pending:** automated categories pass, hand categories missing.
- **Approve:** all pass, with hand scores and evidence recorded in the score file.
