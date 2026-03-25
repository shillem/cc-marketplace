# ESDD — Express Spec-Driven Development

A Claude Code plugin for lightweight, structured feature planning through artifacts (proposal, specs, design, tasks) before implementation.

## Prerequisites

- Node.js v18+

## Installation

Add to your Claude Code configuration:

```json
{
  "plugins": ["github:shillem/marketplace//plugins/esdd"]
}
```

## Usage

Single entry point: `/esdd`

| Action     | Usage                | Description                                          |
| ---------- | -------------------- | ---------------------------------------------------- |
| `init`     | `/esdd init`         | Set up ESDD for this project                         |
| `explore`  | `/esdd explore`      | Think about something without committing to a change |
| `new`      | `/esdd new add-auth` | Plan a new feature                                   |
| `continue` | `/esdd continue`     | Continue where you left off                          |
| `view`     | `/esdd view`         | View setup and active changes                        |
| `apply`    | `/esdd apply`        | Implement the plan                                   |
| `verify`   | `/esdd verify`       | Check your work                                      |
| `archive`  | `/esdd archive`      | Archive a completed change                           |

Running `/esdd` without an action auto-detects the right action from context.

Use `--fast` with `new` or `continue` to generate all remaining artifacts without pausing.

## Workflow

```
proposal -> specs -> design -> tasks -> apply -> verify -> archive
```

Each artifact builds on the previous. The workflow is customizable via `config.yaml`.

## Domains

Domains organize your project's spec areas (e.g., `auth`, `billing`). Define them during `init` and they accumulate requirements over time as changes are archived.

## Configuration

After running `/esdd init`, your project gets a `.ai/esdd/config.yaml`:

```yaml
schemaVersion: 1

domains:
  - name: auth
    description: Authentication, authorization, and session management

# Optional: override artifact instructions or workflow order
artifacts:
  proposal:
    add: |
      Always include performance impact analysis.

workflow: [proposal, specs, design, tasks]
```

## License

MIT
