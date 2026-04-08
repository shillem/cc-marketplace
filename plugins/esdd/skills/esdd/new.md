# ESDD New

## Arguments

- `$REST` may contain: `[--fast] [--workflow <workflow>] <change-name-or-description>`
- `--fast`: Generate all artifacts in sequence without pausing between each
- `--workflow <workflow>`: Use a specific workflow for this change

## Flow

1. **Get change description:**
   If no description is provided in arguments, ask the user what they want to plan.

   **Important**: Do NOT proceed without understanding what the user wants to build.

2. **Derive kebab-case change name** from the description (e.g., "Add OAuth support" -> `add-oauth-support`).

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
