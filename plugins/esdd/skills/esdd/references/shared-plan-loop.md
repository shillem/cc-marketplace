## Plan Loop

**Expects from calling action:** `<change-name>` and optional `--fast` flag.

Loop through the `plan.workflow` array, tracking progress clearly as you go.

a. **For each artifact with `pending` status**:

- Get instructions by running the CLI script: `node <skill-dir>/scripts/cli.mjs instructions "<change-name>" --plan --artifact <artifact>`
- The JSON output includes:
  - `review`: Whether to run a review phase after generating
  - `instruction`: Specific guidance for the artifact
  - `outputPath`: Where to write the artifact
  - `templatePath`: Where to source the template for the artifact
  - `dependencies`: Additional context for the artifact
- Read all dependencies for context
- Create the artifact using the `instruction` guidance and template provided
- If context is critically unclear, ask the user — but prefer making reasonable decisions to keep momentum
- **If `review` is `true` AND `--fast` is absent**, run a review phase after generating:
  1. **Surface**: present the key decisions, assumptions, and patterns you followed while creating the artifact
  2. **Resolve open questions**: if the artifact contains an Open Questions section, present each one and get the user's input. Questions the user explicitly defers should be moved to a **Deferred Questions** section with rationale for why they don't block implementation.
  3. **Revise**: if the user provides corrections, update the artifact accordingly
- **If `review` is `true` AND `--fast` is present**, do not pause: resolve any Open Questions yourself with reasonable decisions, record each decision and its rationale in the artifact, and move anything you cannot resolve to a **Deferred Questions** section with rationale for why it doesn't block implementation
- After creating the artifact, run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<change-name>" --plan`
- If the artifact has status `invalid`, surface the errors and offer to fix before moving on

b. **Continue with the next artifact, if any**

- If `--fast` flag is absent, confirm the user is ready before starting the next artifact
- Repeat until all artifacts are in `ready` status, then end the loop
