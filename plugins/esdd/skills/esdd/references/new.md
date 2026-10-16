# New

Create and plan a new change.

## Arguments

- `$REST` may contain: `[--fast] [--workflow <workflow>] [<change-name>]`
- `--fast`: Generate all artifacts in sequence without pausing between each
- `--workflow <workflow>`: Use a specific workflow for this change

## Flow

1. **Establish the work:**
   If the user has not described the work, ask before exploring. The change name only identifies the directory.

2. **Name the change:**
   Use the supplied name or derive a kebab-case name from the description.

3. **Create the change directory:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs new "<change-name>"` (add `--workflow "<workflow>"` if specified)
   - If error says change already exists, ask if user wants to resume it or choose another name. If the answer is resume, redirect to `continue` action by reading [continue.md](continue.md)

4. **Generate artifacts:**
   Follow the instructions in [plan-loop.md](shared-plan-loop.md).

5. **Show final status.**
   After completing all artifacts, summarize:
   - Change name and location
   - List of artifacts created with brief descriptions
   - Suggest to execute `/esdd apply` to implement
