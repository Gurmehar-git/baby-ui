# Baby UI design contract

The single reference for how every base component looks and moves. Tokens live in
`packages/tokens/src` (`tokens.css`, `theme.css`, `motion.css`); class contracts live in each
component's `variants.ts`.

## API

- shadcn shape only: `variant` and `size` props, plus a component-specific axis where needed
  (`side`, `density`). No new API ideology.
- Every class contract is a `tv()` object in `variants.ts`, with one slot per part
  (`backdrop`, `popup`, `panel`, `handle`...). No UPPER_CASE class-string constants.
- Prop types derive from the tv: `NonNullable<VariantProps<typeof x>["variant"]>`.
- Shared contracts are written for both primitives at once: Base UI emits
  `data-open`/`data-closed`/`data-starting-style`, bits-ui emits `data-state=open|closed`.

## Colour

- Neutrals: `background`, `card`, `popover`, `muted`, `border`, `border-strong`, `input`.
  Each surface is its own step: light is a white page, grey `card`, `popover` `lab(96.52% 0 0)`
  (#f5f5f5, lifted by shadow) and a darker `muted`; dark is page 17%, card 21%, popover #1c1c1c,
  muted 27%. The popover values are the user's pick (2026-10-03), matching their reference palette.
- Field and divider edges stay hairlines (`input`, `border`, about 1.19:1). Off tracks of switches,
  sliders and progress use `track` (1.39 light, 1.49 dark) so the off state reads. Dark hover is 4.5%.
- Fields fill with `--field`: the page colour in light, the card step in dark, so a field reads as
  an object rather than a hole.
- Tooltips invert (`bg-foreground text-background`) so they never blend into a popover below.
- Nest by surface step, not border; a framed body adds a hairline `border-border` where the steps
  sit close. Regions inside an overlay (search, filters, list) recess into `bg-background` with a
  hairline, never a third, lighter fill.
- Neutral chroma stays at or under 0.004 (hue 265) so every accent theme reads true.
- Accent: Blue. `primary` is `var(--accent)`; `ring` and `accent-ink` follow the theme ink.
- Status: `success`, `warning`, `destructive`, `info`.
- Theme presets swap the accent only; neutrals never change per theme.

## Type

- UI text uses four sizes: `text-xs` 12/16 (meta, badges, kbd), `text-sm` 14/20 (controls,
  rows, body in components), `text-base` 16/24 (reading text), `text-lg` 18/28 (panel titles).
- Display uses three: `text-2xl`, `text-4xl`, `text-6xl`, tracking baked into each size.
- No `text-[Npx]` and no arbitrary `tracking-[...]` in components. Uppercase eyebrows take a
  native step (`tracking-wide` to `tracking-widest`); display headlines may take `tracking-tight`.
- Emails and OG images are exempt: their renderers need pixel values.

## Class rule

- Base components are shadcn drop-ins: native Tailwind utilities or CSS-variable utilities
  (`shadow-(--overlay-shadow)`, `duration-(--duration-fast)`), never custom named utilities.
  tailwind-merge does not know custom names, so a consumer's `p-0` could not replace them.

## Spacing

- Container padding: menus `p-1`, popovers `p-3`, framed bodies `p-5`, dialogs and sheets `p-6`.
- Rows and controls keep their own size-based padding inside those containers.

## Compact panels

Settings sheets, inspectors and property panels read as one dense grid, not stacked forms.

- Panel header `h-9`: title (`text-sm font-semibold`) left, muted meta right, hairline below.
- Sections: an uppercase eyebrow header (`min-h-5`, `text-xs`, muted, native tracking) with a
  right-aligned action slot; optional collapse with a rotating chevron. Body rows `gap-2.5`.
- Rows: a fixed label column (`w-20`, muted `text-xs`, truncates) beside a `flex-1` control
  cell (`gap-1.5`). Multi-line controls top-align the label.
- Controls inside rows are the `sm` size; dividers are `border-border/60`, used between
  sections only.

## Control scale

Every control (buttons, fields, triggers, toggles, tabs, pagination) sits on one height ladder,
so any two controls of the same `size` line up in a row. Size names are shadcn's: the middle
step is `default`, never `md`.

| `size` | Height | Radius | Text | Icon | Field `px` | Button `px` | Gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `xs` | `h-6` 24 | `rounded-sm` 6 | `text-xs` | `size-3` | `px-2` | `px-2` | `gap-1` |
| `sm` | `h-8` 32 | `rounded-md` 8 | `text-xs` | `size-3.5` | `px-2.5` | `px-3` | `gap-1.5` |
| `default` | `h-9` 36 | `rounded-lg` 10 | `text-sm` | `size-4` | `px-3` | `px-4` | `gap-2` |
| `lg` | `h-10` 40 | `rounded-lg` 10 | `text-sm` | `size-4.5` | `px-3.5` | `px-5` | `gap-2` |
| `xl` | `h-12` 48 | `rounded-xl` 14 | `text-base` | `size-5` | `px-4` | `px-6` | `gap-2.5` |

- Radius rides the size variant, never the base: the ladder holds radius at 25 to 29% of height,
  so small controls don't turn into pills and large ones don't go square.
- A group (ToggleGroup, segmented Tabs) is the control height in total: rim plus items.
- Text entry is `text-base` below `md` and the table's size from `md` up; iOS zooms under 16px.
- Popup rows pair with their trigger's size: `xs` 24, `sm` 28, `default` 32, `lg` 36, `xl` 40.
- Every axis that scales a component's footprint is `size`, and its middle step is `default`
  everywhere in the library, not only on controls. Other axes (`gap`, `spacing`, `radius`) keep
  their own names.
- Chip fields (MultiSelect, TagInput) use `min-h` on the ladder; inner rows are the height minus
  border and padding, and chips step with the field (`xs`/`sm` Badge `sm`, `default`/`lg`
  Badge `default`, `xl` Badge `lg`).
- Tabs: the list is the ladder height in every variant; segment triggers and marker sit
  `calc(radius - 2px)` inside the list. InputOTP slots and Pagination links are ladder squares
  (`min-w`, so long numbers widen).
- Hit areas: a control drawn under 24px (chip remove) gets an invisible `after:-inset-1` target.
- Non-control boxes keep their own scales but the same radius ratio: Badge `sm` `rounded-sm`,
  then `rounded-md`; square Avatar `md`, `lg`, `xl`, `3xl`; key caps 3px to `rounded-md`.

## Shape

- `--radius` scales `sm` to `3xl` (`-4px` to `+10px`).
- Controls: the ladder above. Popovers and menus: `rounded-xl`. Dialogs and sheets: `rounded-2xl`.
  Drawers: `rounded-3xl` on the free edge. Calendar days and range cells: `rounded-full`.
- Concentric: a nested corner is the outer radius minus the inset. Menus are `rounded-xl p-1`, so
  rows are `rounded-lg`; an `xs` menu is `rounded-lg p-1` with `rounded-sm` rows; framed bodies in
  a `rounded-2xl p-1` rim with a hairline are `rounded-[11px]`.
- Checkbox and radio boxes: 14 `rounded-[4px]`, 16 `rounded-[5px]`, 20 `rounded-md`, 24 `rounded-md`.
- Shadows: `--surface-shadow`, `--overlay-shadow`, `--field-shadow`, `--thumb-shadow`, used
  as `shadow-(--overlay-shadow)`.

## Motion

Motion is CSS-only. Exits undercut entrances; reduced motion keeps opacity and drops travel.

| Contract | Used by | In | Out | Easing |
| --- | --- | --- | --- | --- |
| `ANCHORED` (`lib/anchor.ts`) | Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, Select, Combobox, MultiSelect, NavigationMenu, DatePicker, ColorPicker field | opacity + scale 0.9 to 1, 4px lean from the trigger, 150ms | to scale 0.95, 100ms | `ease` |
| `dialogFrame` popup | Dialog, AlertDialog | opacity + scale 1.05 to 1, 250ms | to scale 0.95, 100ms | `--ease-out-quad` |
| `dialogFrame` backdrop | Dialog, AlertDialog, Command | opacity, 150ms | 100ms | `--ease-out` |
| `sheet` panel and backdrop | Sheet | translate from the edge, 250ms | 200ms | `--ease-drawer` |
| vaul | Drawer | vaul's drag physics, 500ms | gesture-driven | `--ease-drawer` |
| Command popup | Command | instant (opened from the keyboard) | fade, 100ms | `--ease-out` |
| Collapse | Accordion, Collapsible, FileTree | grid-template-rows, 200ms | 150ms | `--ease-out-quad` |
| Press | Button, menu rows, calendar days, pagination, breadcrumb ellipsis | `--press-scale*` per size | eases back over 250ms | `--ease-out-quart` |
| Check and dot | Menu checkbox/radio rows, Select, MultiSelect, RadioGroup | tick draws (stroke-dashoffset), dot pops 0.7 to 1, 250ms | reverse | linear / `--ease-out-quart` |
| Chip | MultiSelect, TagInput | pops in from 0.95, 200ms | removed at once | `--ease-out` |
| Indicator | Tabs, ToggleGroup | 250ms slide | 250ms | `--ease-drawer` |
| Filter pill (`lib/pill.ts`) | Command filters and scopes, DateRangePicker presets | 250ms slide between options | 250ms | `--ease-out` |
| Row marker | Command | snaps on keys; glides 150ms when the pointer moves it | snaps | `--ease-out` |
| Key cap | Command hints | 1px press while its key is held | 100ms | `--ease-out` |

Micro-interactions everywhere: every interactive part answers. Presses scale, the active
option's indicator slides instead of repainting, paging views slide the way they travel, chevrons
rotate with their disclosure, changing values roll or tick. Keyboard-repeated motion snaps;
pointer-driven motion may glide.

Tokens:

- Four speeds only, as `duration-(--duration-instant)` 100, `-fast` 150, `-base` 200 and
  `-slow` 250. Raw `duration-300` or `duration-[420ms]` is a bug.
- Roles map onto them: press, tooltip, dropdown and backdrop are fast; collapse and panel exit
  are base; overlay entrances are slow; every exit is instant. `--duration-drawer` 500 is vaul only.
- Scrims fade in on `--duration-backdrop`, landing before their panel, and leave with it.
  Drawer's scrim is vaul's.
- Overlays (popover, menus, dialog, sheet, drawer, command) sit on `bg-popover` with
  `shadow-(--overlay-shadow)` and no CSS border; framed variants put a `bg-card` rim around a
  `bg-popover` body with a hairline `border-border`, so the rim reads in dark mode too.
- Springs are CSS `linear()` curves: `ease-(--ease-spring-snappy)` over 400ms (no overshoot) and
  `ease-(--ease-spring-bouncy)` over 600ms (3% overshoot). No JS animation library.
- Scales: `--popover-enter-scale` 0.9, `--popover-exit-scale` 0.95, `--modal-enter-scale` 1.05,
  `--press-scale` 0.97 (`-sm` 0.96, `-lg` 0.98, `-icon` 0.93, `-row` 0.98): a ratio moves a
  big control more pixels, so larger controls give a smaller ratio.
- Anything whose content changes size animates the size (grid rows), never pops.

## States

- Hover, highlight and open fills are a 6% foreground tint (`bg-foreground/[0.06]`), never
  `bg-muted`: muted is a fixed step for chips and wells, so a muted hover merges with them.
  Large areas (drop zones, full-width accordion rows) take a 3% tint plus a stronger border.
- A tile or chip inside a hoverable area never shares the hover's colour: give it its own
  step (`bg-background` with a border in light, `bg-muted` in dark).
- Fields (Input, Textarea, NativeSelect, InputGroup, Select and Combobox triggers, MultiSelect,
  TagInput, NumberInput, date/time fields) share one frame:
  - rest `border-input` on `bg-(--field)`, hover `border-border-strong`;
  - text entry on focus: `border-ring` plus a `ring-3 ring-ring/20` halo;
  - triggers (Select, Combobox, NativeSelect, MultiSelect) stay calm: `border-ring` on keyboard
    focus only, `border-border-strong` while open, never a halo (`fieldFrame({ kind: "trigger" })`);
  - invalid `border-destructive`, halo `ring-destructive/20`;
  - disabled `opacity-50` and `cursor-not-allowed`.
- Pressables (Button, Toggle, Checkbox, Switch, Radio) focus with `ring-2 ring-ring ring-offset-2
  ring-offset-background`. Checkbox, Radio and Switch take `border-destructive` on `aria-invalid`
  or Base UI's `data-invalid`. Disabled is `opacity-50` everywhere.
- Checkbox and radio rest borders are `muted-foreground/75` (3.2:1 light, 3.9:1 dark).
- A popover opened from a field anchors to the whole field and matches its width.
- Search, password, currency, phone and card fields are InputGroup recipes, not components.

## Date and time

- Fields are segmented (month, day, year, hour, minute, period). Literals are muted, empty
  segments show a placeholder, the focused segment takes a soft primary tint.
- Calendars read the month from the start edge with prev/next together at the end. Paging
  slides the weeks and caption the way they travel with a blur-fade. Today is a soft primary
  tint, selected a fill.
- Dropdown captions are month and year buttons opening a 4 by 3 month or year grid. The grid
  overlays the hidden day grid, so the calendar never resizes; cells are caption-sized pills
  (`h-7`, 13px), the page zooms out on open and back in on pick, and focus returns to the button.
- Pickers open their calendar on `ANCHORED`.

## Icons

- `@baby-ui/icons`: Solar line-duotone and linear (rounded corners), brands from Simple Icons.
- Chevrons and table-of-contents glyphs are linear, never duotone.

## OG images

- One accent mark per card (a dot, a period, a circle, a wash); canvases stay foreground and background.
- No blurred corner glows or grid-plus-glow backdrops. `tone` defaults to `neutral`.
- Colour-led templates (`og-pipes`, `og-gradient-mesh`) draw only from `--chart-1..5`.
- One design per template; a reference's look never hides behind a variant switch.
- Renderer limits: 2D transforms only, no `.ico` images, SVG colours via `currentColor`.
- Negative angles as `rotate-[-45deg]`: `-rotate-45` compiles to a calc() angle takumi drops.
- The renderer registers fonts under the exact `--font-*` family names; a miss falls back silently.
- `--font-serif` (Newsreader) exists for editorial OG cards only; UI text never uses it.
