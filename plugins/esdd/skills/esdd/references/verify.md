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
   Follow [verification](shared-verification.md) using the change's `name` and `path` and output the report. Stop on failure or no usable report. If no discrepancies are found, report completion and stop. Otherwise, append:

   ```
   ## NEXT STEP

   Apply all recommendations, or name the issues to handle differently.
   ```

   Wait for the user's reply. Apply the accepted recommendations and the user's alternatives, revising artifacts before the code that depends on them; leave issues the user declines. Then return to step 1. Pause if blocked.
