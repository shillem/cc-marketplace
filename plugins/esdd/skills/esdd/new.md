# ESDD New

## Arguments

- `$REST` may contain: `[--fast] [--workflow <workflow>] [<change-name>]`
- `--fast`: Generate all artifacts in sequence without pausing between each
- `--workflow <workflow>`: Use a specific workflow for this change
- `<change-name>`: An optional short kebab-case identifier for the change (e.g., `add-oauth-support`). This is NOT a description of what to build — it is only used as a directory name.

## Flow

1. **Ask the user what they want to build:**
   Always ask the user to describe what they want to plan. The change name argument (if provided) is just an identifier — do NOT treat it as a description of the work.

   **Important**: Do NOT explore the codebase or proceed to later steps until the user has explicitly described what they want to build.

2. **Derive kebab-case change name:**
   Use the change name from arguments if provided. Otherwise, derive one from the user's description (e.g., "Add OAuth support" -> `add-oauth-support`).

3. **Create the change directory:**
   Run `node "${CLAUDE_SKILL_DIR}/scripts/new.mjs" "<change-name>"` (add `--workflow "<workflow>"` if specified)
   - If error says change already exists, ask if user wants to resume it or choose another name. If the answer is resume, redirect to `continue` action by reading [continue.md](continue.md)
   - If error says not initialized, suggest running `/esdd init`.

4. **Generate artifacts:**

   Follow the instructions in [plan-loop.md](shared/plan-loop.md).

5. **Show final status.**

   After completing all artifacts, summarize:
   - Change name and location
   - List of artifacts created with brief descriptions
   - Suggest to execute `/esdd apply` to implement
