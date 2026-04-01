# ESDD Archive

## Arguments

- `$REST` may contain: `[<change-name>]`

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
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest `/esdd continue`
   - If any `apply.artifacts` do not have `done` status: stop, report which ones and suggest `/esdd apply`

4. **Verify the change:**

   Use the Explore **Agent** tool with this prompt (replace `<change-path>` with the change's `path`):

   > - Read all artifact files from `<change-path>` for full context
   > - Verify **Coherence:**
   >   - Assess whether the implementation is consistent with the intent expressed across the change artifacts
   >   - Check that domains listed in artifacts match domain folders and vice versa
   >   - Review new code for consistency with project patterns (file naming, directory structure, coding style)
   >   - Issues: WARNING for intent/spec mismatches, SUGGESTION for pattern deviations
   > - Verify **Correctness:**
   >   - For each requirement (`### Requirement:`), search codebase for implementation evidence
   >     - Unimplemented: CRITICAL
   >     - Divergent from intent: WARNING
   >   - For each scenario (`#### Scenario:`), check if covered in code/tests
   >     - Uncovered: WARNING
   > - Each issue must have a specific, actionable recommendation with file/line references

   **Handle result:**
   - Show the verification report with issues grouped by priority (CRITICAL / WARNING / SUGGESTION)
   - Use **AskUserQuestion** tool to let the user choose:
     - Update change specs to match code changes
     - Continue with archive
     - Stop

5. **Process artifacts:**
   If `archive.workflow` is empty, skip to step 6.

   Use the **TodoWrite** tool to track progress through the artifacts and groups.

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

## Guardrails

- Don't block archive on warnings — inform and confirm
- Always merge delta specs before invoking archive.mjs
- If spec merge fails, stop and report — don't archive with unmerged specs
