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
- Before writing content that depends on an unresolved choice that materially changes expected behavior or scope, ask the user. Under `--fast`, make a reasonable decision instead when safe. In either mode, stop and ask when critical uncertainty prevents a sound decision. Otherwise, prefer reasonable decisions to keep momentum. Follow the artifact instructions for recording resolved choices and their rationale.
- Create the artifact using the `instruction` guidance and template provided
- **If `review` is `true` AND `--fast` is absent**, run a review phase after generating:
  1. **Surface**: present the key decisions, assumptions, and patterns you followed while creating the artifact
  2. **Resolve open questions**: present each unresolved question the artifact records and get the user's input. If the user defers one, keep it in the artifact using its configured format, or next to the related content if none is specified, and note what work depends on it. Resolve the question before writing content that depends on its answer; unrelated work can continue.
  3. **Revise**: if the user provides corrections, update the artifact accordingly
- **If `review` is `true` AND `--fast` is present**, skip the review pause: resolve open questions with reasonable decisions when safe, recording each decision and its rationale as directed by the artifact instructions. Keep remaining questions in the artifact as described above, noting what work depends on them. Stop and ask when an unresolved question prevents a sound decision for the work being undertaken; unrelated work can continue.
- After creating the artifact, run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<change-name>" --plan`
- If the artifact has status `invalid`, surface the errors and offer to fix before moving on

b. **Continue with the next artifact, if any**

- If `--fast` flag is absent, confirm the user is ready before starting the next artifact
- Repeat until all artifacts are in `ready` status, then end the loop
