## Plan Loop

**Expects from calling action:** `<change-name>` and optional `--fast` flag.

Loop through the `plan.workflow` array.

a. **For each artifact with `pending` status**:

- Get instructions by running the CLI script: `node <skill-dir>/scripts/cli.mjs instructions "<change-name>" --plan --artifact <artifact>`
- The JSON output includes:
  - `review`: Whether to run a review phase after generating
  - `instruction`: Specific guidance for the artifact
  - `outputPath`: Where to write the artifact
  - `templatePath`: Where to source the template for the artifact
  - `dependencies`: Planning input files
- Read all dependencies for context
- Investigate the code relevant to this artifact's responsibility before drafting, and reference concrete files, modules or APIs rather than assumptions. Keep unverified external facts and unstated preferences out of the artifact.
- Ask the user before writing content that depends on an unresolved choice that changes expected behavior or scope. Under `--fast`, decide when safe and record the decision with its rationale. Stop and ask when uncertainty prevents a sound decision.
- Create the artifact using the `instruction` guidance and template provided
- When work on this artifact changes something an earlier artifact owns, rewrite that part of the earlier artifact
- **If `review` is `true` AND `--fast` is absent**, run a review phase after generating:
  1. **Surface**: present the key decisions, assumptions, and patterns you followed while creating the artifact
  2. **Resolve open questions**: present each unresolved question the artifact records and get the user's input. If the user defers one, keep it in the artifact using its configured format, or next to the related content if none is specified, and note what work depends on it. Resolve the question before writing content that depends on its answer; unrelated work can continue.
  3. **Revise**: if the user provides corrections, update the artifact accordingly
- **If `review` is `true` AND `--fast` is present**, skip the review pause.
- After creating the artifact, run the CLI script: `node <skill-dir>/scripts/cli.mjs status "<change-name>" --plan`
- If the artifact has status `invalid`, fix the reported errors and rerun status before continuing. Ask the user only if a fix requires a decision. If the artifact remains invalid and no further fix can be made without user input, report the remaining errors and wait. Do not start the next artifact until this one is `ready`.

b. **Continue with the next artifact, if any**

- If `--fast` flag is absent, confirm the user is ready before starting the next artifact
- Repeat until all artifacts are in `ready` status, then end the loop
