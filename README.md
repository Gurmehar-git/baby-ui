<p align="center">
  <img src=".github/assets/cover.png" alt="Baby UI" width="100%" />
</p>

<p align="center">
  Animated, accessible components for React and Svelte.<br />
  One spec, two real ports, source you own.
</p>

<p align="center">
  <a href="https://baby-ui.nexonauts.com">Site</a> ·
  <a href="https://baby-ui.nexonauts.com/docs">Docs</a> ·
  <a href="https://baby-ui.nexonauts.com/components">Components</a> ·
  <a href="LICENSE">Apache-2.0</a>
</p>

## Features

- **240+ components, two ports.** Each one is built once from a shared spec and shipped as a
  hand-written React port and Svelte port: same props, same motion, same accessibility.
- **A shadcn drop-in.** The CLI copies source into your project; part names, `data-slot`s and
  `variant`/`size` props match shadcn/ui and shadcn-svelte.
- **Accessible by construction.** Interactive parts sit on Base UI (React) and bits-ui (Svelte),
  the primitives shadcn itself uses.
- **Motion that answers the hand.** Presses squish, popovers zoom from their trigger, panels grow
  instead of popping. All CSS, all tokens, all honouring reduced motion.
- **Your theme drives it.** Components read CSS variables and never name a colour.
- **More than primitives.** Charts on d3 and SVG, blocks, text effects, backgrounds, agent UI,
  OG images and emails.

## Quick start

In a React or Svelte project with Tailwind CSS v4:

```bash
npx @baby-ui/cli init
npx @baby-ui/cli add button
```

Already on shadcn? Skip `init`. The [installation guide](https://baby-ui.nexonauts.com/docs/installation)
covers a fresh project and the stock shadcn CLIs, and the [CLI guide](https://baby-ui.nexonauts.com/docs/cli)
covers `diff`, `update`, `repair` and `undo`.

## Contributing

Setup, the dev loop and the checks are in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Star History

<a href="https://www.star-history.com/?repos=kanakkholwal%2Fbaby-ui&type=date&logscale=&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=kanakkholwal/baby-ui&type=date&theme=dark&logscale&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=kanakkholwal/baby-ui&type=date&logscale&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=kanakkholwal/baby-ui&type=date&logscale&legend=top-left" />
 </picture>
</a>

## License

Apache-2.0, see [`LICENSE`](LICENSE). Ported components credit their sources in
[`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).
