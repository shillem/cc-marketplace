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
   Use the **TodoWrite** tool to track progress through the remaining artifacts.

   Loop through the `plan.workflow` array:

   a. **For each artifact with `pending` status**:
   - Get instructions: `node "${CLAUDE_SKILL_DIR}/scripts/instructions.mjs" "<change-name>" --plan --artifact <artifact>`
   - The JSON output includes:
     - `discussion`: Whether to run an interactive discussion before generating
     - `instruction`: Specific guidance for the artifact
     - `outputPath`: Where to write the artifact
     - `templatePath`: Where to source the template for the artifact
     - `dependencies`: Additional context for the artifact
   - Read all dependencies for context
   - Create the artifact using the `instruction` guidance and template provided
   - If context is critically unclear, use **AskUserQuestion** tool — but prefer making reasonable decisions to keep momentum
   - **If `discussion` is true AND `--fast` is absent**, run a discussion phase after generating:
     1. **Surface**: present the key decisions, assumptions, and patterns you followed while creating the artifact
     2. **Question**: use the **AskUserQuestion** tool to ask about anything you're uncertain about — wrong patterns, missing context, scope concerns, open questions
     3. **Revise**: if the user provides corrections, update the artifact accordingly
   - After creating the artifact, run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<change-name>" --plan`
   - If the artifact has status `invalid`, surface the errors and offer to fix before moving on

   b. **Continue with the next artifact, if any**
   - If `--fast` flag is absent, stop and ask if the user is ready to work on the next artifact
   - Continue with the next artifact and stop when all artifacts are in `ready` status

6. **Show final status.**
   After completing all artifacts, summarize:
   - Change name and location
   - List of artifacts created with brief descriptions
   - Suggest `/esdd apply` to implement
