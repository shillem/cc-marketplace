# ESDD Verify

## Arguments

- `$REST` may contain: `[<change-name>]`

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run: `node "${CLAUDE_SKILL_DIR}/scripts/list.mjs"`
   - If no changes exist: report and stop
   - If one change exists: use it
   - If multiple changes: use **AskUserQuestion** tool to let the user select

2. **Get detailed status:**

   Run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<name>"`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest `/esdd continue`
   - If any `apply.artifacts` do not have `done` status: stop, report which ones and suggest `/esdd apply`

4. **Verify the change:**

   Follow the instructions in [verification.md](shared/verification.md), using the change's `path`.
