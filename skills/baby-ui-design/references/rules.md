# Rulebook

One rule per entry. Scripts emit these IDs; the design-system page shows them. Severity:
`blocker` fails WCAG or breaks behaviour, `high` breaks the system's model, `medium` is drift,
`low` is polish. "Script" names who measures it; `by hand` means you judge it and cite evidence.

## TOKEN: the model

| ID | Rule | Measure | Fix | Sev | Script |
| --- | --- | --- | --- | --- | --- |
| TOKEN-001 | No raw colour in classes or styles | `bg-[#..]`, `text-[oklch(..)]` | Semantic token class | high | scan-source |
| TOKEN-002 | No palette colours (`bg-blue-500`) | class pattern | Map to a token | high | scan-source |
| TOKEN-003 | One token, one job (action is not state) | count usages; read roles | Split the role | high | by hand |
| TOKEN-004 | Extensions are additive; never redefine shadcn or Tailwind names | registry check | Rename | blocker | by hand |
| TOKEN-005 | Brand and status colours are defined per mode | `:root` and `.dark` both set | Add the dark value | medium | audit-tokens |

## COLOR: contrast (both modes, alpha composited)

| ID | Rule | Floor | Sev | Script |
| --- | --- | --- | --- | --- |
| COLOR-001 | Text on its surface | 4.5:1, large text (24px, or 18.66px bold) 3:1 | blocker | audit-tokens, audit-page |
| COLOR-002 | Focus ring, control boundary, meaningful icon | 3:1 | blocker | audit-tokens |
| COLOR-003 | Colour-coded pairs survive colour blindness | 3:1 luminance or 0.10 OKLab dE | high | by hand |

Decorative hairlines are exempt.

## SURF: surfaces

| ID | Rule | Measure | Sev | Script |
| --- | --- | --- | --- | --- |
| SURF-001 | Page, card, muted, segment climb in visible steps | at least 1.07:1 each | high | audit-tokens |
| SURF-002 | Neutrals share one hue, chroma 0.004 or less | OKLCH of each step | medium | audit-tokens |
| SURF-003 | One floating material: `bg-popover` + `--overlay-shadow`, no CSS border | computed style of panels; `shadow-xl/2xl` in source | medium | scan-source, by hand |
| SURF-004 | Top-level surfaces are `bg-background` plus a border; no grey-dominant components | read classes | medium | by hand |
| SURF-005 | Dark popover sits near the page (Baby UI: `#151515` class), edged by its ring | token value | medium | by hand |

## SIZE, SPACE, TYPE

| ID | Rule | Sev | Script |
| --- | --- | --- | --- |
| SIZE-001 | Controls ride the ladder: xs 24, sm 32, default 36, lg 40, xl 48 | high | by hand (lib/control.ts) |
| SIZE-002 | Radius comes from the size; nested radius = outer minus inset | medium | by hand |
| SIZE-003 | Size names are shadcn's: `default`, never `md` | high | by hand |
| SPACE-001 | 4px rhythm; concentric padding; consistent gutters | medium | by hand |
| TYPE-001 | No arbitrary font sizes (templates exempt) | medium | scan-source |
| TYPE-002 | Tracking per size; tabular figures for live numbers | low | by hand |

## MOTION (detail in motion.md)

| ID | Rule | Sev | Script |
| --- | --- | --- | --- |
| MOTION-001 | No `transition: all` | high | scan-source, audit-page |
| MOTION-002 | No ease-in on UI; enter ease-out, move ease-in-out | high | scan-source, audit-page |
| MOTION-003 | Nothing animates from `scale(0)`; start at 0.95 with opacity | high | scan-source |
| MOTION-004 | Durations come from tokens | medium | scan-source |
| MOTION-005 | UI motion at or under 300ms unless ambient or explanatory | medium | audit-page |
| MOTION-006 | Reduced motion keeps opacity, drops travel | high | audit-page |
| MOTION-007 | Size changes animate via grid-template-rows; primitives keep content mounted for exits | high | by hand |
| MOTION-008 | Popovers grow from their trigger; exits mirror entrances | medium | by hand |

## STATE, A11Y, UX

| ID | Rule | Sev | Script |
| --- | --- | --- | --- |
| STATE-001 | Keyboard focus is visible | blocker | audit-page |
| STATE-002 | Select-like triggers stay calm when open (no halo) | medium | by hand |
| STATE-003 | Press squish uses the press token; hover gated to fine pointers | low | by hand |
| A11Y-001 | Every control has an accessible name | blocker | audit-page |
| A11Y-002 | Targets at least 24px (44px on touch layouts), or a clear 24px circle (WCAG 2.5.8 spacing) | high | audit-page |
| A11Y-003 | Overlays close on Escape and return focus | blocker | by hand |
| A11Y-004 | State never rests on colour alone | high | by hand |
| UX-001 | One primary action per view | medium | by hand |
| UX-002 | Nothing looks interactive and does nothing | blocker | by hand |
| UX-003 | Empty, loading and error states exist | high | by hand |
| UX-004 | No layout shift on open or expand | high | audit-page |
| UX-005 | No horizontal overflow at 390px | high | audit-page |
| UX-006 | No console errors | blocker | audit-page |

## COMPOSE and API

| ID | Rule | Sev | Script |
| --- | --- | --- | --- |
| COMPOSE-001 | Built from parts (root + named parts via context), not layout props | blocker | scan-source |
| COMPOSE-002 | A sizeable component exposes parts, not one export or one file | high | scan-source |
| API-001 | shadcn part names and `data-slot` on every part | high | by hand |
| API-002 | Variant and size types derive from `tv()` | high | by hand |
| API-003 | Interaction engines ride Base UI (React) / bits-ui (Svelte) | high | by hand |
| API-004 | Every component has a variant axis | medium | by hand |
| API-005 | State is controlled by props; no fake timers or sample data in shipped code | blocker | by hand |

OG images and emails are templates rendered as one artifact: TYPE-001 and COMPOSE do not apply.

## COPY

| ID | Rule | Sev | Script |
| --- | --- | --- | --- |
| COPY-001 | No en or em dashes in UI copy | low | scan-source |
| COPY-002 | No filler or buzzwords; error copy states cause and fix | medium | by hand |
| COPY-003 | Comments at most 2 lines; no names of studied reference libraries | medium | repo gate |
