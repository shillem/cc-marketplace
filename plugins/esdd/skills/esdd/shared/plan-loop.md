## ESDD Plan Loop

**Expects from calling action:** `<change-name>` and optional `--fast` flag.

Use the **Task** tools to track progress through the artifacts.

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
- **If `discussion` is `true` AND `--fast` is absent**, run a discussion phase after generating:
  1. **Surface**: present the key decisions, assumptions, and patterns you followed while creating the artifact
  2. **Question**: use the **AskUserQuestion** tool to ask about anything you're uncertain about — wrong patterns, missing context, scope concerns, open questions
  3. **Revise**: if the user provides corrections, update the artifact accordingly
- After creating the artifact, run `node "${CLAUDE_SKILL_DIR}/scripts/status.mjs" "<change-name>" --plan`
- If the artifact has status `invalid`, surface the errors and offer to fix before moving on

b. **Continue with the next artifact, if any**

- If `--fast` flag is absent, stop and ask if the user is ready to work on the next artifact
- Continue with the next artifact and stop when all artifacts are in `ready` status
