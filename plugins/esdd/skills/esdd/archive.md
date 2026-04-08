# ESDD Archive

## Arguments

- `$REST` may contain: `[--skip-verify] [<change-name>]`

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run: `node "${CLAUDE_SKILL_DIR}/scripts/list.mjs" --archive`
   - If no changes exist: report and stop
   - If one change exists: use it
   - If multiple changes: use **AskUserQuestion** tool to let the user select

2. **Get detailed status:**

   Run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<name>" --archive`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest running `/esdd continue`
   - If any `apply.artifacts` do not have `done` status: stop, report which ones and suggest running `/esdd apply`

4. **Verify the change:**

   If `--skip-verify` flag is present, skip to step 5.

   Follow the instructions in [verification.md](shared/verification.md), using the change's `path`.

5. **Process artifacts:**
   If `archive.workflow` is empty, skip to step 6.

   Use the **Task** tools to track progress through the artifacts and groups.

   Loop through the `archive.workflow` array. For each artifact, use **Agent** tool with this prompt:

   > - Get instructions: `node "${CLAUDE_SKILL_DIR}/scripts/instructions.mjs" "<name>" --archive --artifact <artifact-id>`
   > - The JSON output includes:
   >   - `instruction`: Specific guidance for the artifact
   > - Follow the `instruction`

6. **Run archive script:**

   Run `node "${CLAUDE_SKILL_DIR}/scripts/archive.mjs" "<name>"`.

   Check for errors.

7. **Show status:**
   - Change name and archive location
