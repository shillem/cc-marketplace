---
name: esdd
description: Express Spec-Driven Development for setting up project-aware change workflows, documenting domains, planning and applying changes in stages, verifying outcomes, and archiving completed work. Use only when the user explicitly asks for ESDD, references an ESDD command or artifact, or wants to continue an existing ESDD change.
argument-hint: "[init|document|explore|new|continue|apply|verify|archive|view] [...]"
---

1. Treat the first word passed by the user as `$ACTION`, remainder is `$REST`.
2. If `$ACTION` matches one of the actions, follow the action's instructions.
3. If `$ACTION` is empty or does not match an action, read [help.md](help.md), show the command quick reference with usage and key flags, and stop.
4. If the user wants more detail about a specific command after seeing the quick reference, read [docs/commands.md](../../docs/commands.md).

## Available Scripts

- **`scripts/cli.mjs`** - CLI script

## Init Gate

Run the CLI script: `node <skill-dir>/scripts/cli.mjs init --status`

- If `initialized` is `false` and `$ACTION` is not `init` — suggest running `/esdd init` and stop
- If `initialized` is `true` and `$ACTION` is `init` — inform already initialized and stop
- If `constitution.projectMap` or `constitution.techStack` is `false` — warn that CLAUDE.md is missing project context sections (non-blocking, continue with the action)

## Action Dispatch

When dispatching to an action, read the corresponding file and follow its instructions exactly:

- [init](init.md)
- [document](document.md)
- [explore](explore.md)
- [new](new.md)
- [continue](continue.md)
- [apply](apply.md)
- [verify](verify.md)
- [archive](archive.md)
- [view](view.md)
