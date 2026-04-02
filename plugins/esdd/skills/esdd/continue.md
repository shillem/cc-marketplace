# ESDD Continue

## Arguments

- `$REST` may contain: `[--fast] [<change-name>]`
- `--fast`: Generate all remaining artifacts without pausing

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run: `node "${CLAUDE_SKILL_DIR}/scripts/list.mjs" --plan`
   - If no changes exist: suggest `/esdd new`
   - If one change exists: use it
   - If multiple changes: use **AskUserQuestion** tool to let the user select, presenting each change with its artifact completion status and last modified time. Mark the most recently modified as "(Recommended)".

2. **Get detailed status:**
   Run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<change-name>" --plan`.

3. **Handle status:**
   If any artifact has status `invalid`:
   - Surface the errors: "proposal.md has issues: Missing content under '## Impact'"
   - Offer to fix: read the artifact, fill in missing sections
   - Fix before moving to new artifacts

4. **If all artifacts status is `ready`:** Report completion, suggest `/esdd apply`

5. **Process artifacts:**

   Follow the instructions in [plan-loop.md](shared/plan-loop.md).

6. **Show final status.**
   After completing all artifacts, summarize:
   - Change name and location
   - List of artifacts created with brief descriptions
   - Suggest `/esdd apply` to implement
