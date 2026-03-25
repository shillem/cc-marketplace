## Arguments

- `$REST` may contain: `[<change-name>]`

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run: `node "${CLAUDE_SKILL_DIR}/scripts/list.mjs" --archive`
   - If no changes exist: report and stop
   - If one change exists: use it
   - If multiple changes: use **AskUserQuestion** tool to let the user select2

2. **Get detailed status:**

   Run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<name>" --archive`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest `/esdd continue`
   - If any `apply.artifacts` do not have `done` status: stop, report which ones and suggest `/esdd apply`
   - If `archive.workflow` is empty, skip to step 5.
   - Otherwise: proceed to step 4

4. **Process artifacts:**
   Use the **TodoWrite** tool to track progress through the artifacts and groups.

   Loop through the `archive.workflow` array. For each artifact, use **Agent** tool with this prompt:

   > - Get instructions: `node "${CLAUDE_SKILL_DIR}/scripts/instructions.mjs" "<name>" --archive --artifact <artifact-id>`
   > - The JSON output includes:
   >   - `instruction`: Specific guidance for the artifact
   > - Follow the `instruction`

5. **Run archive script:**

   Run `node "${CLAUDE_SKILL_DIR}/scripts/archive.mjs" "<name>"`.

   Check for errors.

6. **Show status:**
   - Change name and archive location

## Guardrails

- Don't block archive on warnings — inform and confirm
- Always merge delta specs before invoking archive.mjs
- If spec merge fails, stop and report — don't archive with unmerged specs
