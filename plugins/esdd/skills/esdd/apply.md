# ESDD Apply

## Arguments

- `$REST` may contain: `[--fast] [<change-name>]`
- `--fast`: Process all task groups without pausing between each

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run: `node "${CLAUDE_SKILL_DIR}/scripts/list.mjs" --apply`
   - If no changes exist: suggest `/esdd new`
   - If one change exists: use it
   - If multiple changes: use **AskUserQuestion** tool to let the user select, presenting each change with its apply group status. Mark the one with most pending groups as "(Recommended)".

2. **Get detailed status:**
   Run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<name>"`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest `/esdd continue`
   - If all `apply.artifacts` have status `done`: stop, congratulate and suggest `/esdd archive`
   - Otherwise: proceed to step 4

4. **Process artifacts:**
   Use the **TodoWrite** tool to track progress through the artifacts and groups.

   Loop through the `apply.workflow` array. For each artifact, iterate its `groups`:

   a. **Skip completed groups** (status: `"done"`)

   b. **For each pending group**, use **Agent** tool with this prompt:

   > - Get instructions: `node "${CLAUDE_SKILL_DIR}/scripts/instructions.mjs" "<name>" --apply --artifact <artifact> --group <group-id>`
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
   - If all done: suggest `/esdd archive` as next step
   - If paused or blocked: explain why and wait for guidance

## Guardrails

- If agent reports a design issue, suggest updating artifacts with `/esdd continue`
- Each group runs in a fresh agent for clean context
- Groups are processed sequentially — never in parallel
