# Archive

## Arguments

- `$REST` may contain: `[--skip-verify] [<change-name>]`

## Flow

1. **Select the change:**
   - If a change name was provided as argument, use it directly — skip list/disambiguation
   - Otherwise, run the CLI script: `node <skill-dir>/scripts/cli.mjs list --archive`
   - If no changes exist: report and stop
   - If one change exists: use it
   - If multiple changes: use the ask tool to let the user select

2. **Get detailed status:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<name>" --archive`.

3. **Handle status:**
   - If any `plan.artifacts` do not have `ready` status: stop, report which ones and suggest running `/esdd continue`
   - If any `apply.artifacts` do not have `done` status: stop, report which ones and suggest running `/esdd apply`

4. **Verify the change:**
   If `--skip-verify` flag is present, skip to step 5.

   Follow the instructions in [verification.md](shared/verification.md), using the change's `path`.

5. **Process artifacts:**
   If `archive.workflow` is empty, skip to step 6.

   Loop through the `archive.workflow` array, using the task tool to track progress. For each artifact, use the subagent tool with this prompt:

   > - Get instructions by running the CLI script: `node <skill-dir>/scripts/cli.mjs instructions "<name>" --archive --artifact <artifact-id>`
   > - The JSON output includes:
   >   - `instruction`: Specific guidance for the artifact
   > - Follow the `instruction`

6. **Run archive script:**
   Run the CLI script: `node <skill-dir>/scripts/cli.mjs archive "<name>"`.

   Check for errors.

7. **Show status:**
   - Change name and archive location
