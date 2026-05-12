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
   - If multiple changes: use the ask tool to let the user select, presenting each change with its apply group status. Mark the one with most pending groups as "(Recommended)".

2. **Get detailed status:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<name>" --apply`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones, and suggest running `/esdd continue`
   - If all `apply.artifacts` have status `done`: stop, congratulate and suggest running `/esdd archive`
   - Otherwise: proceed to step 4

4. **Process artifacts:**
   Loop through the `apply.workflow` array, using the task tool to track progress. For each artifact, iterate its `groups`:

   a. **Skip completed groups** (status: `"done"`)

   b. **For each pending group**, use the subagent tool with this prompt:

   > - Get instructions by running the CLI script: `node <skill-dir>/scripts/cli.mjs instructions "<name>" --apply --artifact <artifact> --group <group-id>`
   > - The JSON output includes:
   >   - `instruction`: Specific guidance for the artifact
   >   - `outputPath`: Where to find and update the artifact
   >   - `dependencies`: Additional context for the artifact
   > - Read all dependencies for context
   > - Follow the `instruction`

   c. **Evaluate the agent's result:**
   - **Success**: continue
   - **Blocker**: surface the issue to the user, wait for guidance before continuing

   d. **Between groups** (unless `--fast`):
   - Pause and ask if user wants to review changes or continue to the next group

5. **On completion or pause, show status:**
   - Groups completed this session
   - If all done: suggest running `/esdd archive` as next step
   - If paused or blocked: explain why and wait for guidance

## Guardrails

- If agent reports a design issue, suggest updating artifacts with `/esdd continue`
- Each group runs in a fresh agent for clean context
- Groups are processed sequentially — never in parallel
