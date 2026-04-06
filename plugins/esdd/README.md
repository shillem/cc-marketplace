# ESDD — Express Spec-Driven Development

A Claude Code plugin for lightweight, structured feature planning through
artifacts before implementation.

## Why Spec-Driven Development

AI coding agents excel with precise, written direction but struggle with
ambiguity. Conversational prompting ("vibe coding") creates an encoding/decoding
gap between what you intend and what the agent produces. Intent stays implicit,
context gets lost across iterations, and ambiguity compounds — the wider the gap,
the more rework you get.

This gap manifests in four structural limits:

- **Task scope limits** — agents break on multi-file, multi-hour work. Quality
  degrades as scope expands, producing code that compiles but doesn't solve the
  right problem.
- **Repository blindness** — agents don't know your conventions, approved
  libraries, or architectural decisions. They infer patterns from whatever code
  they find, including legacy code no one follows anymore.
- **Feature context blindness** — agents can't infer requirements, edge cases,
  acceptance criteria, or integration points from a prompt alone. They build
  features that work technically but don't fit the system.
- **Uncontrolled autonomy** — without checkpoints, agents make architecture-level
  decisions silently and return opaque bulk updates with no traceability.

**The core insight:** separating _what to build_ (specifications) from _how to
build it_ (design and tasks) creates natural review gates where small document
reviews catch big problems before thousands of lines of code are generated.

ESDD narrows the encoding/decoding gap by addressing each limit directly:

- **Enforced decomposition** — complex work becomes a pipeline of small, scoped
  artifacts. Tasks are organized as vertical slices that cut through the stack
  end-to-end, with testable checkpoints between each group.
- **Project context** — ESDD reads your `CLAUDE.md` sections (Project Map, Tech
  Stack) as project DNA, preventing agents from generating generic code based on
  training data rather than your actual conventions.
- **Domain-scoped specifications** — requirements are organized by domain (named
  areas of functionality like `auth`, `billing`, `notifications`), not by ticket
  or branch. Domain specs accumulate over time, giving agents persistent
  understanding of how your system works.
- **Review gates** — certain artifacts trigger interactive review during
  planning. ESDD surfaces key decisions, assumptions, and scope questions for
  you to validate before moving on. The agent shows you what it's thinking
  before writing a single line of code.

### What "Express" means

Full spec-driven workflows can feel heavyweight. Monolithic planning prompts
pack hundreds of instructions into a single context window, exceeding the
~150-200 instruction budget that LLMs can reliably follow. Steps get skipped
unpredictably. Reviewing a thousand-line plan isn't leverage — it's just
different work.

ESDD keeps the leverage while cutting the ceremony:

- **Control flow over prompts** — instead of one mega-prompt hoping the agent
  follows every step, ESDD uses actual control flow to route agents through
  focused phases with smaller instruction sets
- **Lean review surfaces** — a proposal or brief is ~200 lines, not 1,000.
  Design decisions surface before code generation, so code review is lighter
  because architectural choices are already approved
- **Flexible workflows** — four built-in workflows scale from a quick brief to a
  full proposal-specs-design-tasks pipeline. Choose the rigor that fits the
  change.

## Quick Start

```
/esdd init          # Set up ESDD for your project
/esdd document      # Document domains from existing code
/esdd new           # Plan a new change
/esdd apply         # Implement the planned tasks
/esdd verify        # Check implementation against intent
/esdd archive       # Archive change
```

## How It Works

### Artifacts

ESDD produces structured documents during planning. Each artifact has a specific
purpose and builds on the ones before it.

| Artifact     | Purpose                                               | Interactive Review |
| ------------ | ----------------------------------------------------- | :----------------: |
| **Brief**    | Combined proposal + design for smaller changes        |         No         |
| **Proposal** | Why this change matters and what it changes           |        Yes         |
| **Specs**    | Domain-scoped requirements with testable scenarios    |         No         |
| **Design**   | Technical approach, decisions, trade-offs             |        Yes         |
| **Tasks**    | Implementation checklist grouped into vertical slices |         No         |

Artifacts marked with interactive review are **discussion artifacts** — ESDD
pauses to surface decisions and ask for your input before moving on (unless
`--fast` is used). This is where you steer: reviewing a 200-line proposal is
faster and higher-leverage than reviewing 2,000 lines of generated code.

See [Artifacts Reference](.docs/artifacts.md) for full details.

### Domains

Specifications are scoped by **domain** — named areas of functionality in your
system (e.g., `auth`, `billing`, `notifications`). A single change might touch
multiple domains, and each domain's spec grows independently.

In spec-anchored workflows, domain specs are merged into accumulated knowledge
at `.ai/esdd/domains/` after archiving. Over time, agents gain persistent
understanding of your system's requirements, not just its current code. This is
the difference between an agent that reads your codebase and one that understands
your system.

## Workflows

Not every change needs the same rigor. A quick fix and a new billing module
shouldn't go through the same process. ESDD ships with four built-in workflows
that scale from lightweight to rigorous:

| Workflow              | Plan                              | Apply | Archive | Best For                                               |
| --------------------- | --------------------------------- | ----- | ------- | ------------------------------------------------------ |
| `spec-anchored`       | proposal → specs → design → tasks | tasks | specs   | Features that benefit from living documentation        |
| `spec-anchored-quick` | brief → specs → tasks             | tasks | specs   | Smaller changes with accumulated specs                 |
| `spec-first`          | proposal → specs → design → tasks | tasks | —       | Structured planning without long-term spec maintenance |
| `spec-first-quick`    | brief → specs → tasks             | tasks | —       | Quick, lightweight changes                             |

The key choice is between **spec-anchored** (specs persist as living
documentation that grows with each change) and **spec-first** (specs guide
planning but aren't maintained long-term). Spec-anchored workflows create a
compounding knowledge base; spec-first workflows trade that persistence for
speed.

See [Workflows](.docs/workflows.md) for when and why to use each.

## Commands

| Command    | Purpose                                   | Key Flags              |
| ---------- | ----------------------------------------- | ---------------------- |
| `init`     | Initialize ESDD for the project           | —                      |
| `document` | Document domains from existing code       | `--domain`, `--scan`   |
| `explore`  | Open-ended thinking partner (no code)     | —                      |
| `new`      | Create and plan a new change              | `--fast`, `--workflow` |
| `continue` | Resume planning an incomplete change      | `--fast`               |
| `apply`    | Implement planned tasks group by group    | `--fast`               |
| `verify`   | Verify implementation matches spec intent | —                      |
| `archive`  | Archive change                            | `--skip-verify`        |
| `view`     | Show project status dashboard             | —                      |

See [Commands Reference](.docs/commands.md) for full details.

## Configuration

**Environment variables**  
`ESDD_PATH` — Override the default `.ai/esdd` directory location

**Project context (recommended)**  
ESDD reads your `CLAUDE.md` for `## Project Map` and `## Tech Stack` sections.
These act as project DNA — they give agents essential context about where things
live and what technologies to use, preventing generic code that doesn't match
your actual conventions.

**Project files**  
`.ai/esdd/config.yaml` — Project workflow and domain definitions  
`.ai/esdd/domains/` — Accumulated domain specifications  
`<change>/change.yaml` — Per-change configuration (workflow, created automatically)

See [Configuration](.docs/configuration.md) for full setup details.

## License

MIT
