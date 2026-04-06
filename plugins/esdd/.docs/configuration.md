# Configuration

## Environment Variables

### ESDD_PATH

Override the default ESDD directory location.

```bash
# Default
.ai/esdd/

# Custom
export ESDD_PATH=.esdd/
```

By default, ESDD stores everything under `.ai/esdd/` relative to your project
root. Set `ESDD_PATH` to change this.

## Constitution

ESDD checks your project's `CLAUDE.md` (or `CLAUDE.local.md`) for two sections
that provide essential context to agents during planning and implementation:

### Project Map

```markdown
## Project Map

- `src/api/` — REST API endpoints (Express.js)
- `src/services/` — Business logic layer
- `src/db/` — Database models and migrations (PostgreSQL)
- `tests/` — Test suites (Vitest)
```

Tells agents where things live in your codebase. Without this, agents make
assumptions about project structure that may be wrong.

### Tech Stack

```markdown
## Tech Stack

TypeScript, React, Node.js, PostgreSQL
```

Tells agents what technologies and patterns to use. Without this, agents default
to generic best practices that may not match your project.

**ESDD will prompt you to set these up during `init` if they're missing.** They
aren't strictly required, but planning quality may improve when agents
have this context.

## Project Configuration

### config.yaml

Created during `init` at `.ai/esdd/config.yaml`:

```yaml
workflow: spec-anchored
domains:
  auth: Authentication and session management
  billing: Payment processing and invoicing
```

**Fields:**

| Field      | Description                           |
| ---------- | ------------------------------------- |
| `workflow` | Default workflow for new changes      |
| `domains`  | Named project areas with descriptions |

### Per-Change Configuration

Each change can override the project workflow. When you use `--workflow` with
`/esdd new`, a `change.yaml` is created in the change directory:

```yaml
# .ai/esdd/changes/add-auth/change.yaml
workflow: spec-anchored-quick
```

## Domains

Domains are named areas of your project that organize specifications. They're
defined during `init` and can grow over time.

### What domains represent

A domain is a bounded context — a distinct area of functionality with its own
requirements:

```yaml
domains:
  auth: Authentication, authorization, and session management
  billing: Subscriptions, invoicing, and payment processing
  notifications: Email, push, and in-app notification delivery
```

### How domains are used

1. **During planning** — Specs are scoped per domain, so each domain gets its own
   spec file (e.g., `specs/auth.md`)
2. **During archiving** — Delta specs are merged into accumulated domain specs at
   `.ai/esdd/domains/<domain>.md`
3. **As persistent context** — Accumulated specs give agents understanding of your
   system that carries across changes

### Domain growth

Domains can be added during `init`, created with `document`, or emerge naturally.
When a change introduces specs for a new domain, the archive process detects it
and updates `config.yaml` automatically. The `document` command also registers
new domains when producing specs from existing code.

## Directory Structure

After initialization:

```
.ai/esdd/
  config.yaml                     # Project config
  changes/                        # Active changes
    add-user-auth/
      change.yaml                 # Per-change workflow override
      proposal.md                 # Plan artifacts
      specs/
        auth.md
      design.md
      tasks.md
  archive/                        # Completed changes
    2026-03-15-add-billing/
      ...
  templates/                      # (Optional) Project-specific artifact templates
  domains/                        # Accumulated domain specs
    auth.md                       # Grows with each archived change
    billing.md
```

## Artifact Overrides

You can override artifact properties from `schema.yaml` by adding an `artifacts`
section to your `config.yaml`. This lets you customize behavior without forking
the plugin.

```yaml
artifacts:
  proposal:
    plan:
      discussion: false
      instruction: |
        Custom proposal instruction...
  design:
    plan:
      discussion: false
      instruction: |
        Custom design instruction...
```

### What you can override

Each artifact supports these properties:

| Property                    | Effect                                                  |
| --------------------------- | ------------------------------------------------------- |
| `description`               | Artifact description                                    |
| `output`                    | Output filename or pattern                              |
| `plan.discussion`           | Toggle interactive review (`true`/`false`)              |
| `plan.instruction`          | Replace the planning instruction entirely               |
| `plan.instruction_addendum` | Append to the base planning instruction                 |
| `apply.instruction`         | Replace the apply-phase instruction                     |
| `archive.instruction`       | Replace the archive-phase instruction                   |
| `template`                  | Use a specific template file from `.ai/esdd/templates/` |

### Instruction merge strategy

Instructions follow a three-tier priority:

1. **Explicit override** (`instruction`) — replaces the base entirely
2. **Addendum** (`instruction_addendum`) — appends to the base instruction
3. **Base** — the built-in instruction from `schema.yaml`

### Merge behavior

Overrides use a **two-level merge**. At the artifact level, your config properties
are spread over the schema defaults. When both sides have an object for the same
key (like `plan`), those objects are also merged — so you can override individual
properties without losing siblings:

```yaml
# Only overrides discussion — instruction is preserved from schema.yaml
artifacts:
  proposal:
    plan:
      discussion: false
```

## Custom Templates

Place project-specific artifact templates in `.ai/esdd/templates/`. Templates
there are automatically discovered and used alongside the built-in ones, letting
you customize the structure of generated artifacts to match your project's
conventions.

## Custom Workflows

Beyond the four built-in workflows, you can define your own in `config.yaml`:

```yaml
workflow: my-default
workflows:
  my-default:
    plan:
      workflow:
        - brief
        - tasks
    apply:
      workflow:
        - tasks
```

Available artifact types for custom workflows: `brief`, `proposal`, `specs`,
`design`, `tasks`. The order in the `plan.workflow` array determines the
generation sequence and dependency chain.
