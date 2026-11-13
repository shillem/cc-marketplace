# Archive

## Arguments

- `$REST` may contain: `[--skip-verify] [<change-name>]`

## Flow

1. **Get status:**
   Run `node <skill-dir>/scripts/cli.mjs status "<name>" --archive`.

2. **Check prerequisites:**
   - If any `plan.artifacts` are not `ready`, report them, suggest `/esdd continue` and stop.
   - If any `apply.artifacts` are not `done`, report them, suggest `/esdd apply` and stop.

3. **Verify:**
   With `--skip-verify`, skip to step 4. Otherwise:
   - Follow [verification](shared-verification.md) using the change's `name` and `path` and output the report. Stop on failure or no usable report. If no discrepancies are found, continue to step 4.
   - Ask whether to apply all recommendations, handle some issues differently, or archive anyway without fixing them, and wait for the user's reply. To archive anyway, continue to step 4.
   - Apply the accepted recommendations and the user's alternatives, revising artifacts before the code that depends on them; leave issues the user declines. If any accepted change cannot be applied, report it and stop.
   - Report the changes, ask whether to re-verify or archive without re-verifying, and wait for the user's reply. To re-verify, repeat these sub-steps from the first. To archive, continue to step 4.

4. **Process artifacts:**
   If `archive.workflow` is empty, skip to step 5.

   Loop through `archive.workflow` sequentially. For each artifact, start a fresh subagent if available and send it the prompt below, replacing placeholders only. Do not summarize, change, or drop prompt lines; append any user direction or notes on remaining work after the prompt. Each subagent handles one artifact; the parent owns the loop. If isolation is unavailable, follow the same steps inline after rereading the artifact instructions:

   ```text
   Get instructions by running the CLI script:
   node <skill-dir>/scripts/cli.mjs instructions "<name>" --archive --artifact <artifact-id>

   The JSON output includes:
   - instruction: Specific guidance for the artifact

   Follow the instruction for this artifact only.
   ```

   After each artifact, review the result, blockers and changed files. If processing failed or remains incomplete, report and stop; do not run step 5.

5. **Archive:**
   Run `node <skill-dir>/scripts/cli.mjs archive "<name>"`. On error, report and stop; on success, show the change name and archive location.
