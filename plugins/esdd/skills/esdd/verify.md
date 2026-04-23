# ESDD Verify

## Arguments

- `$REST` may contain: `[<change-name>]`

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run the CLI script: `node scripts/cli.mjs list`
   - If no changes exist: report and stop
   - If one change exists: use it
   - If multiple changes: use the ask tool to let the user select

2. **Get detailed status:**
   Run the CLI script: `node scripts/cli.mjs status "<name>" --apply`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest running `/esdd continue`
   - If any `apply.artifacts` do not have `done` status: stop, report which ones and suggest running `/esdd apply`

4. **Verify the change:**
   Follow the instructions in [verification.md](shared/verification.md), using the change's `path`.
