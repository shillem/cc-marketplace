# Commands Reference

All commands are invoked through the `/esdd` skill followed by the action name
and optional arguments.

```
/esdd <action> [change-name|description] [flags]
```

## init

Initialize ESDD for the current project.

```
/esdd init
```

Surveys the project and walks you through setup:

1. Checks your constitution (`CLAUDE.md`) for Project Map and Tech Stack sections
2. Presents available workflows and asks you to choose a default
3. Asks you to define domains — named areas of your project (e.g., `auth`, `billing`)
4. Creates the `.ai/esdd/` directory structure

**What gets created:**

```
.ai/esdd/
  config.yaml         # Project workflow and domain definitions
  changes/            # Active changes
  archive/            # Completed changes
  templates/          # (Optional) Project-specific artifact templates
  domains/            # One <domain>.md file per domain (created via document or archive)
```

## document

Document domains directly from existing code, creating or updating domain spec
files without going through a full change workflow.

```
/esdd document --domain <name>:<description> [--domain ...] [--scan <glob>]
```

Scans your codebase and produces domain spec files at `.ai/esdd/domains/`. Use
this to bootstrap domain knowledge from an existing project or to update domain
specs independently of a change.

**Flags:**

| Flag                            | Effect                                    |
| ------------------------------- | ----------------------------------------- |
| `--domain <name>:<description>` | Domain to document (required, repeatable) |
| `--scan <glob>`                 | Glob pattern to scope the code scan       |

If `--scan` is omitted, ESDD suggests a scope derived from the domain name and
project map, then asks for confirmation.

**What happens:**

1. For each domain, scans the code within the specified scope
2. Produces a domain spec file at `.ai/esdd/domains/<name>.md` using the domain
   template
3. Registers the domain in `config.yaml` if it isn't already defined

## explore

Open-ended thinking partner for exploring ideas before committing to a change.

```
/esdd explore [topic]
```

Explore is not a workflow step — it's a mode. Use it when you need to:

- Think through a problem before deciding on an approach
- Investigate the codebase to understand how something works
- Discuss trade-offs without generating any code
- Sketch ideas using ASCII diagrams or outlines

**Key characteristics:**

- Reads files and searches code, but **never writes code**
- No required sequence or mandatory outputs
- Can create ESDD artifacts if you ask (capturing thinking, not implementing)
- May naturally lead to `/esdd new` when you're ready to commit to a change

## new

Create and plan a new change.

```
/esdd new [description] [--fast] [--workflow <name>]
```

If no description is provided, you'll be asked for one. ESDD derives a kebab-case
change name from your description (e.g., "Add user authentication" becomes
`add-user-authentication`).

Walks through the plan phase artifacts sequentially. For artifacts marked as
discussion points (proposal, design), ESDD surfaces key decisions and asks for
your input before moving on.

**Flags:**

| Flag                | Effect                                                           |
| ------------------- | ---------------------------------------------------------------- |
| `--fast`            | Skip interactive discussions and review pauses between artifacts |
| `--workflow <name>` | Use a specific workflow instead of the project default           |

**What happens:**

1. Creates a change directory under `.ai/esdd/changes/<change-name>/`
2. Generates each plan artifact in order (proposal → specs → design → tasks, varies by workflow)
3. For discussion artifacts: presents key decisions and asks for confirmation
4. Shows final status with artifact summaries

## continue

Resume planning an incomplete change.

```
/esdd continue [change-name] [--fast]
```

Picks up where you left off. If the change name is omitted and multiple changes
exist, you'll be shown a list to choose from.

If all plan artifacts are already complete, suggests moving to `apply`.

Handles invalid artifacts by surfacing validation errors and offering to fix them.

**Flags:**

| Flag     | Effect                                         |
| -------- | ---------------------------------------------- |
| `--fast` | Skip interactive discussions and review pauses |

## apply

Implement the planned change by processing task groups.

```
/esdd apply [change-name] [--fast]
```

Requires all plan artifacts to be complete before starting.

Task groups (defined in the tasks artifact) are processed **sequentially**, each
in a fresh agent context to keep implementation focused. Between groups, ESDD pauses
for you to review what was implemented.

**Flags:**

| Flag     | Effect                                 |
| -------- | -------------------------------------- |
| `--fast` | Skip review pauses between task groups |

**How task groups work:**

The tasks artifact organizes work into numbered groups:

```markdown
## 1. Database Schema

- [ ] 1.1 Create users table migration
- [ ] 1.2 Add indexes for email lookup

## 2. API Endpoints

- [ ] 2.1 Implement POST /users
- [ ] 2.2 Implement GET /users/:id
```

Each group becomes a discrete implementation step. The agent receives the group's
tasks along with all plan artifacts for context.

## verify

Verify that the implementation matches the planned intent.

```
/esdd verify [change-name]
```

Runs after `apply` to check coherence and correctness:

- **Coherence** — Does the implementation match what was specified? Are patterns
  consistent with the project?
- **Correctness** — Are requirements actually implemented? Is test coverage adequate?

Issues are grouped by priority: **CRITICAL**, **WARNING**, **SUGGESTION**, with
actionable recommendations including file and line references.

## archive

Archive a completed change and merge domain knowledge.

```
/esdd archive [change-name] [--skip-verify]
```

Runs verification (unless skipped), then:

1. Merges delta specs into accumulated domain specifications
2. Moves the change from `changes/` to `archive/` with a date prefix
   (e.g., `archive/2026-04-02-add-user-auth/`)
3. Updates `config.yaml` with any new domains discovered from spec descriptions

**Flags:**

| Flag            | Effect                                      |
| --------------- | ------------------------------------------- |
| `--skip-verify` | Skip the verification step before archiving |

**Note:** Only `spec-anchored` and `spec-anchored-quick` workflows have an archive
phase. `spec-first` workflows skip domain spec accumulation.

## view

Display a project status dashboard.

```
/esdd view
```

Shows:

- **Setup** — ESDD path, configured domains, default workflow, constitution status
- **Active changes** — Table with change name, workflow, plan/apply completion, last modified
- **Archived changes** — Count of completed changes

No suggestions or next steps — just the current state.
