# Verify

## Arguments

- `$REST` may contain: `[<change-name>]`

## Flow

1. **Get status:**
   Run `node <skill-dir>/scripts/cli.mjs status "<name>" --archive`.

2. **Check prerequisites:**
   - If any `plan.artifacts` are not `ready`, report them, suggest `/esdd continue` and stop.
   - If any `apply.artifacts` are not `done`, report them, suggest `/esdd apply` and stop.

3. **Verify:**
   - Follow [verification](shared-verification.md) using the change's `name` and `path` and output the report. Stop on failure or no usable report. If no discrepancies are found, report completion and stop.
   - Ask whether to apply all recommendations or handle some issues differently, and wait for the user's reply.
   - Apply the accepted recommendations and the user's alternatives, revising artifacts before the code that depends on them; leave issues the user declines. If any accepted change cannot be applied, report it and stop.
   - Report the changes, ask whether to re-verify, and wait for the user's reply. To re-verify, repeat these sub-steps from the first; otherwise stop.
