---
name: esdd
description: Express Spec-Driven Development for setting up project-aware change workflows, documenting domains, planning and applying changes in stages, verifying outcomes, and archiving completed work. Use only when the user explicitly asks for ESDD, references an ESDD command or artifact, or wants to continue an existing ESDD change.
argument-hint: "[init|document|explore|new|continue|apply|verify|archive|view] [...]"
---

1. Treat the first word passed by the user as `$ACTION`, remainder is `$REST`.
2. If `$ACTION` is empty or does not match an action, read [help](references/help.md), show the command quick reference with usage and key flags, and stop.
3. If the user wants more detail about a specific command after seeing the quick reference, read [commands](references/docs.commands.md).
4. For valid actions, run the init gate below before dispatching, except for `explore`.
5. If the gate passes, follow the action's instructions exactly.

## Available Scripts

- **`scripts/cli.mjs`** - CLI script

## Init Gate

Run the CLI script: `node <skill-dir>/scripts/cli.mjs init --status`

- If `initialized` is `false` and `$ACTION` is not `init` — suggest running `/esdd init` and stop
- If `initialized` is `true` and `$ACTION` is `init` — inform already initialized and stop

## Action Dispatch

When dispatching to an action, read the corresponding file and follow its instructions exactly:

- [init](references/init.md)
- [document](references/document.md)
- [explore](references/explore.md)
- [new](references/new.md)
- [continue](references/continue.md)
- [apply](references/apply.md)
- [verify](references/verify.md)
- [archive](references/archive.md)
- [view](references/view.md)
