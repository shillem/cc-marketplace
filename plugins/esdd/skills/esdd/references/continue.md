# Continue

## Arguments

- `$REST` may contain: `[--fast] [<change-name>]`
- `--fast`: Generate all remaining artifacts without pausing

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run the CLI script: `node <skill-dir>/scripts/cli.mjs list --plan`
   - If no changes exist: suggest `/esdd new`
   - If one change exists: use it
   - If multiple changes: ask the user to select, presenting each change with its artifact completion status and last modified time. Mark the most recently modified as "(Recommended)"

2. **Get detailed status:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<change-name>" --plan`.

3. **Handle status:**
   If any artifact has status `invalid`, fetch its planning instructions with `node <skill-dir>/scripts/cli.mjs instructions "<change-name>" --plan --artifact <artifact>`, then read the artifact and its template and follow those instructions to fix the reported errors before moving to new artifacts. Ask the user only if a fix requires a decision. Rerun status after fixing and do not proceed until the artifact is `ready`. If a fix cannot be completed, report the remaining error and wait for guidance.

4. **If all artifacts status is `ready`:** Report completion, suggest running `/esdd apply`

5. **Process artifacts:**
   Follow the instructions in [plan-loop.md](shared-plan-loop.md).

6. **Show final status.**
   After completing all artifacts, summarize:
   - Change name and location
   - List of artifacts created with brief descriptions
   - Suggest to execute `/esdd apply` to implement
