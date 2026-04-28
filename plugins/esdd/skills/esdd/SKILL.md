---
name: esdd
description: Express Spec-Driven Development. Use only when the user explicitly asks for ESDD, references an ESDD command or artifact, or wants to continue an existing ESDD change. Do not use for ordinary coding, debugging, refactoring, or small code changes.
argument-hint: "[init|document|explore|new|continue|apply|verify|archive|view] [...]"
---

1. Treat the first word passed by the user as `$ACTION`, remainder is `$REST`.
2. If `$ACTION` matches one of the actions, follow the action's instructions.
3. If `$ACTION` is empty or does not match an action, list the available actions.

## Available Scripts

- **`scripts/cli.mjs`** - CLI script

## Init Gate

Run the CLI script: `node <skill-dir>/scripts/cli.mjs init --status`

- If `initialized` is `false` and `$ACTION` is not `init` — suggest running `/esdd init` and stop.
- If `initialized` is `true` and `$ACTION` is `init` — inform already initialized and stop.
- If `constitution.projectMap` or `constitution.techStack` is `false` — warn that CLAUDE.md is missing project context sections (non-blocking, continue with the action).

## Action Dispatch

When dispatching to an action, read the corresponding file and follow its instructions exactly:

- **init**: [init.md](init.md)
- **document**: [document.md](document.md)
- **explore**: [explore.md](explore.md)
- **new**: [new.md](new.md)
- **continue**: [continue.md](continue.md)
- **apply**: [apply.md](apply.md)
- **verify**: [verify.md](verify.md)
- **archive**: [archive.md](archive.md)
- **view**: [view.md](view.md)
