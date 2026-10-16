# Apply

## Arguments

- `$REST` may contain: `[--fast] [<change-name>]`
- `--fast`: Process all task groups without pausing between each

## Flow

1. **Get status:**
   Run `node <skill-dir>/scripts/cli.mjs status "<name>" --apply`.

2. **Handle status:**
   - If any `plan.artifacts` are not `ready`, report them, suggest `/esdd continue` and stop.
   - If all `apply.artifacts` are `done`, report completion, suggest `/esdd archive` and stop.
   - Otherwise, process the groups below.

3. **Process artifacts:**
   Loop through the `apply.workflow` array in order. For each artifact, process its groups one at a time, in order, tracking progress clearly as you go:

   a. **Skip completed groups** (status: `"done"`)

   b. **For each pending group**, start a fresh subagent if available and send it the prompt below, replacing placeholders only. Do not summarize, change, or drop prompt lines; append only notes consistent with the artifacts. If the plan changes, follow “Changes of direction” before handing work to a subagent. Each subagent handles one group; the parent owns the loop, status checks and pauses. If isolation is unavailable, follow the same steps inline after rereading the group instructions and dependencies:

   ```text
   Get instructions by running the CLI script:
   node <skill-dir>/scripts/cli.mjs instructions "<name>" --apply --artifact <artifact> --group <group-id>

   The JSON output includes:
   - instruction: Specific guidance for the artifact
   - outputPath: Where to find and update the artifact
   - dependencies: Planning input files

   Read the artifact at outputPath and all dependencies. Dependencies are ordered from earliest to latest planning stage. Stop and report contradictions rather than resolving them by document order.

   Follow the instruction for this group only.
   ```

   c. **Evaluate the result:** Review what was completed and any reported blockers, then run `node <skill-dir>/scripts/cli.mjs status "<name>" --apply` to check the group's status.
   - **Done:** continue.
   - **Blocker:** report the evidence, completed tasks, and remaining tasks to the user, then wait for guidance. If the plan needs to change, follow “Changes of direction”.
   - **Incomplete without a concrete blocker**: inspect any partial edits and continue the same group from its remaining tasks without redoing completed tasks. Do not advance to another group. If you cannot make further progress, report what remains and why, then wait for guidance.

   d. **Between groups** (unless `--fast`):
   - Pause and ask if user wants to review changes or continue to the next group

4. **On completion or pause, show status:**
   - Groups completed this session
   - If all done: suggest running `/esdd archive` as next step
   - If paused or blocked: explain why and wait for guidance

## Changes of direction

1. Stop affected work, explain the finding and follow [revision](shared-revision.md). Pause if revision is blocked.
2. Inspect the affected code against the revised target. Correct or delegate authorized work that no surviving pending group owns; leave other corrections to their groups. If required corrections are not authorized or cannot finish, report the gap and pause.
3. After those corrections and their checks finish, refresh status and return to flow step 2 with fresh group instructions; IDs and completion states may have changed. Do not declare completion while corrections remain outside pending groups.
