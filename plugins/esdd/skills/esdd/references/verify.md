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

   How would you like to proceed?

   - Update artifacts
   - Update implementation
   - Update both
   ```

   Wait for the user's choice, make only the requested updates, then return to step 1. Pause if blocked.
