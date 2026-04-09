# Workflows

A workflow defines which artifacts are produced during planning, implementation,
and archiving. ESDD ships with four built-in workflows, and you can define custom
ones in your project's `config.yaml`.

## The Two Families

### Spec-Anchored

Spec-anchored workflows treat domain specifications as **living documentation**.
After a change is archived, its delta specs are merged into accumulated domain
specs that persist across changes. Over time, your domains build up a knowledge
base that gives agents persistent context about how your system works.

**Choose spec-anchored when:**

- Your project has distinct domains that evolve over multiple changes
- You want agents to understand accumulated requirements, not just current code
- Long-term maintainability matters more than speed
- Multiple people (or agents) work on the same codebase

### Spec-First

Spec-first workflows use specifications for **planning structure** without
maintaining them long-term. Specs guide the current change but aren't merged into
domain knowledge after archiving.

**Choose spec-first when:**

- You want structured planning without the overhead of maintaining specs
- Changes are relatively independent and don't build on each other
- You're working on a smaller project or prototype
- You prefer specs as disposable planning tools

## Built-in Workflows

### spec-anchored (default)

```
Plan:    proposal → specs → design → tasks
Apply:   tasks (group by group)
Archive: specs (merge deltas into domain specs)
```

The full workflow. Starts with a proposal to align on _why_ and _what_, then
produces domain-scoped specifications, a design document for _how_, and finally
actionable task groups.

The proposal and design artifacts are **review points** — ESDD will surface key
decisions and ask for your input before moving on.

### spec-anchored-quick

```
Plan:    brief → specs → tasks
Apply:   tasks (group by group)
Archive: specs (merge deltas into domain specs)
```

Replaces the separate proposal and design with a single **brief** — a combined
document covering why, what, and key technical decisions. Skips the design
artifact entirely.

Use this for smaller changes where a full proposal and design would be overkill,
but you still want accumulated domain specs.

### spec-first

```
Plan:    proposal → specs → design → tasks
Apply:   tasks (group by group)
Archive: (none)
```

Same planning rigor as spec-anchored, but no archive phase. Specs are used during
planning and implementation, then preserved as-is in the archive directory without
merging into domain knowledge.

### spec-first-quick

```
Plan:    brief → specs → tasks
Apply:   tasks (group by group)
Archive: (none)
```

The lightest workflow. Brief instead of proposal+design, no spec accumulation.
Good for quick, self-contained changes.

## Custom Workflows

You can define custom workflows in your project's `.ai/esdd/config.yaml`. A workflow
is a named combination of artifact sequences for each phase:

```yaml
workflows:
  my-workflow:
    plan:
      workflow:
        - brief
        - tasks
    apply:
      workflow:
        - tasks
```

Custom workflows can use any combination of the available artifact types: `brief`,
`proposal`, `specs`, `design`, `tasks`. To include an archive phase (required for
spec merging into domain knowledge), add an `archive` section:

```yaml
workflows:
  my-workflow:
    plan:
      workflow:
        - proposal
        - specs
        - design
        - tasks
    apply:
      workflow:
        - tasks
    archive:
      workflow:
        - specs
```

Without an `archive` section, the workflow behaves like spec-first — specs guide
planning but aren't merged into accumulated domain knowledge.

## Choosing a Workflow

| Question                                       | If yes →         | If no →       |
| ---------------------------------------------- | ---------------- | ------------- |
| Will domain specs benefit future changes?      | spec-anchored    | spec-first    |
| Does the change need a full proposal + design? | full variant     | quick variant |
| Is this a small, self-contained change?        | quick variant    | full variant  |
| Are you prototyping or exploring?              | spec-first-quick | spec-anchored |

You can set a project default during `init` and override per-change with `--workflow`:

```
/esdd new "add billing module" --workflow spec-anchored-quick
```

## The Lifecycle

Regardless of workflow, every change follows the same lifecycle:

```
new → [continue] → apply → [verify] → archive
        ↑                      │
        └──────────────────────┘
             (if issues found)
```

1. **Plan** (`new` / `continue`) — Generate artifacts sequentially, with review pauses
2. **Apply** — Implement task groups one at a time
3. **Verify** (optional but recommended) — Check implementation against intent
4. **Archive** — Preserve the change and merge domain knowledge (spec-anchored only)
