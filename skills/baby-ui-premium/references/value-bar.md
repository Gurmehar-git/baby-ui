# Pro value bar

Craft is necessary, not sufficient. A component is Pro only if a buyer would pay for it. Each check
is pass or fail with written evidence; one fail means not Pro. Run it after `verify` approves.

| ID | Passes when | Evidence to write |
| --- | --- | --- |
| VAL-JOB | A real, recurring job that a competent team needs at least a day to build | The use case and two shipped products that use the pattern |
| VAL-UNIQUE | No equal in shadcn, shadcn-svelte, the Baby UI free tier or a well-known free library | The closest free equal, and the measured axes where Pro beats it |
| VAL-HARD | At least three hard parts are done | Which three: gesture physics, full keyboard and screen-reader model, large data, async/error/empty states, responsive edge cases, non-trivial layout math, performance under load |
| VAL-PROD | Production-ready | Controlled API, required data props, every state, React and Svelte parity, reduced motion, RTL, 390px, docs with real usage |
| VAL-FIT | Drops into a shadcn app | Built from parts, tokens and a variant axis; no restyle or new globals |
| VAL-CRAFT | Passes the premium rubric | `verify` Approve |
| VAL-HOUR | Demo to production in an hour | The docs demo is a real scenario a buyer adapts, not a toy |
| VAL-PAY | Would a buyer browsing a paid kit buy it | One sentence: "saves <who> <what> on <job>" |

## Tier verdict

- **Pro:** every check passes.
- **Free:** craft passes but VAL-JOB, VAL-UNIQUE or VAL-PAY fails.
- **Rework:** a VAL-HARD, VAL-PROD, VAL-FIT or VAL-HOUR gap is fixable.
- **Cut:** no real job.

Free components still pass the craft rubric. Tier moves need the owner's sign-off: list demotions
and promotions separately and wait. Name compared paid kits and free libraries in `.notes` only,
never in code or docs.
