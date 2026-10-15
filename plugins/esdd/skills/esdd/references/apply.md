# Apply

## Arguments

- `$REST` may contain: `[--fast] [<change-name>]`
- `--fast`: Process all task groups without pausing between each

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run the CLI script: `node <skill-dir>/scripts/cli.mjs list --apply`
   - If no changes exist: suggest running `/esdd new`
   - If one change exists: use it
   - If multiple changes: ask the user to select, presenting each change with its apply group status. Mark the one with most pending groups as "(Recommended)"

2. **Get detailed status:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<name>" --apply`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones, and suggest running `/esdd continue`
   - If all `apply.artifacts` have status `done`: stop, congratulate and suggest running `/esdd archive`
   - Otherwise: proceed to step 4

4. **Process artifacts:**
   Loop through the `apply.workflow` array in order. For each artifact, process its groups one at a time, in order, tracking progress clearly as you go:

   a. **Skip completed groups** (status: `"done"`)

   b. **For each pending group**, start a fresh subagent if available and send it the prompt below, replacing the listed placeholders only. Do not summarize, change, or drop prompt lines; append any user direction or notes on remaining work after the prompt. Each subagent handles exactly one group. The parent agent owns the group loop, status checks, and pauses. If isolation is unavailable, follow the same steps inline after rereading the group instructions and dependencies:

   ```text
   Get instructions by running the CLI script:
   node <skill-dir>/scripts/cli.mjs instructions "<name>" --apply --artifact <artifact> --group <group-id>

   The JSON output includes:
   - instruction: Specific guidance for the artifact
   - outputPath: Where to find and update the artifact
   - dependencies: Additional context for the artifact

   Read the artifact at outputPath and all dependencies. Dependencies are ordered from earliest to latest planning stage; when they conflict, later artifacts supersede earlier ones.

   Follow the instruction for this group only.
   ```

   c. **Evaluate the result:** Review what was completed and any reported blockers, then run `node <skill-dir>/scripts/cli.mjs status "<name>" --apply` to check the group's status.
   - **Done:** continue.
   - **Blocker:** report the evidence, completed tasks, and remaining tasks to the user, then wait for guidance. If the plan needs to change, follow [Changing the Plan](#changing-the-plan).
   - **Incomplete without a concrete blocker**: continue the same group from its remaining tasks, preserving completed work. Do not advance to another group. If you cannot make further progress, report what remains and why, then wait for guidance.

   d. **Between groups** (unless `--fast`):
   - Pause and ask if user wants to review changes or continue to the next group

5. **On completion or pause, show status:**
   - Groups completed this session
   - If all done: suggest running `/esdd archive` as next step
   - If paused or blocked: explain why and wait for guidance

## Changing the Plan

If implementation reveals that the plan needs to change, stop and explain why to the user. With the user's approval, update the affected planning artifacts and keep them consistent with each other. Before revising tasks, run `node <skill-dir>/scripts/cli.mjs instructions "<name>" --plan --artifact <artifact>` for the task artifact, then read and follow its instructions and template, preserving completed work. Rerun plan status and resolve any reported errors before suggesting that the user run `/esdd apply` to resume implementation. If planning artifacts remain pending, suggest `/esdd continue` instead.
