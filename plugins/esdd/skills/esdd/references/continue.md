# Continue

Plan or revise an existing change, including after apply. Edit artifacts only; never start implementation.

## Arguments

- `$REST` may contain: `[--fast] [<change-name>]`
- `--fast`: Generate remaining artifacts without pausing

## Flow

1. **Get status:**
   Run `node <skill-dir>/scripts/cli.mjs status "<name>" --apply`.

2. **Revise when requested:**
   Follow [revision](shared-revision.md), even when artifacts are `ready` or apply is complete. Stop if revision is blocked; otherwise refresh status.

3. **Fix invalid artifacts:**
   Fetch each invalid artifact's instructions with `node <skill-dir>/scripts/cli.mjs instructions "<name>" --plan --artifact <artifact>`. Read its instructions, template and content, fix errors and rerun status until `ready`. Ask for necessary decisions; if blocked, report and stop before creating more artifacts.

4. **Complete pending planning:**
   Follow [plan loop](shared-plan-loop.md) for pending artifacts.

5. **Report:**
   Refresh status and summarize the change name, location, artifacts created or revised, and remaining work. If planning is complete, suggest `/esdd apply` for unchecked work or `/esdd verify` when implementation is complete. Do not run either automatically.
