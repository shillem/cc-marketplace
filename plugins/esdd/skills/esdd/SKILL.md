---
name: esdd
description: Express Spec-Driven Development. Use when planning a new feature or change, continuing work, checking status, implementing tasks, or archiving completed work.
argument-hint: "[init|explore|new|continue|apply|archive|view] [change-name|description]"
allowed-tools: Agent, Bash(node *), Bash(mkdir *), Bash(mv *), Edit, Glob, Grep, Read, TodoWrite, Update, Write
---

Parse `$ARGUMENTS`:

1. Split arguments: first word is `$ACTION`, remainder is `$REST`
2. If `$ACTION` is empty or does not match an action — list the available actions and suggest running `/esdd view` to see current state

**Init gate**:

Check status: !`node "${CLAUDE_SKILL_DIR}/scripts/init.mjs" --status`

- If `uninitialized` and `$ACTION` is not `init` — suggest `init` and stop.
- If `initialized` and `$ACTION` is `init` — inform already initialized and stop.

## Action Dispatch

When dispatching to an action, read the corresponding file and follow its instructions exactly:

- **init**: [init.md](init.md)
- **explore**: [explore.md](explore.md)
- **new**: [new.md](new.md)
- **continue**: [continue.md](continue.md)
- **apply**: [apply.md](apply.md)
- **archive**: [archive.md](archive.md)
- **view**: [view.md](view.md)
