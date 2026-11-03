# Workflows

A workflow defines which artifacts are produced during planning, implementation,
and archiving. ESDD ships with two built-in workflows, and you can define custom
ones in your project's `config.yaml`.

## The Planning Chain

Both built-in workflows plan through the same chain:

```
proposal → specs → design → tasks
```

Each artifact has one responsibility and reads what comes before it:

| Artifact | Responsibility                       | Reads                    |
| -------- | ------------------------------------ | ------------------------ |
| proposal | Why, scope, domains, external impact | The request, domain list |
| specs    | What must be true, per domain        | proposal                 |
| design   | How, built on the specs              | proposal, specs          |
| tasks    | Implementation steps                 | All of the above         |

Scope comes first so specs know which domains to cover. Specs come before design
so requirements are written without an approach in view, and design builds on
settled requirements. For a small change, design stays short, and `--fast` skips
the pauses between artifacts.

## Built-in Workflows

### spec-global (default)

```
Plan:    proposal → specs → design → tasks
Apply:   tasks (group by group)
Archive: specs (merge deltas into domain specs)
```

At archive, the change's delta specs merge into the domain specs at
`.ai/esdd/domains/`. Over time, the domain specs become living documentation
that gives agents persistent context about how your system works.

**Choose spec-global when:**

- Your project has distinct domains that evolve over multiple changes
- You want agents to understand accumulated requirements, not just current code
- Multiple people (or agents) work on the same codebase

### spec-local

```
Plan:    proposal → specs → design → tasks
Apply:   tasks (group by group)
Archive: (no spec merge)
```

Specs serve the current change only. At archive, they move with the change into
the archive directory without merging into domain specs.

**Choose spec-local when:**

- Changes are independent and don't build on each other
- You want structured planning without maintaining specs over time
- You're working on a small project or prototype

## Custom Workflows

You can define custom workflows in your project's `.ai/esdd/config.yaml`. A workflow
is a named combination of artifact sequences for each phase:

```yaml
workflows:
  my-workflow:
    plan:
      - proposal
      - tasks
    apply:
      - tasks
```

Custom workflows can use any combination of the built-in artifact types
(`proposal`, `specs`, `design`, `tasks`) and artifacts you define. A workflow that
includes specs needs an artifact before them with a `Domains` section. To merge
specs into domain knowledge, add an `archive` section:

```yaml
workflows:
  my-workflow:
    plan:
      - proposal
      - specs
      - tasks
    apply:
      - tasks
    archive:
      - specs
```

Without an `archive` section, specs stay with the archived change, as in
`spec-local`.

## Choosing a Workflow

Ask whether this change's specs should become part of the maintained domain specs.
If yes, use `spec-global`; if not, use `spec-local`.

You can set a project default during `init` and override per-change with `--workflow`:

```
/esdd new "add billing module" --workflow spec-local
```

## The Lifecycle

Regardless of workflow, every change follows the same lifecycle:

```
new → [continue] → apply → [verify] → archive
        ↑                      │
        └──────────────────────┘
             (if issues found)
```

1. **Plan** (`new` / `continue`) — Create or revise planning artifacts, with review pauses. `continue` also supports revisions after apply.
2. **Apply** — Implement task groups one at a time
3. **Verify** (optional but recommended) — Check implementation against intent
4. **Archive** — Preserve the change and, in `spec-global`, merge its specs into domain knowledge
