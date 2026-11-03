# Artifacts

Artifacts are the structured documents ESDD produces during planning. Each artifact
has a specific purpose and builds on the ones before it.

## Overview

| Artifact | Purpose                                                                   | Review |
| -------- | ------------------------------------------------------------------------- | :----: |
| Proposal | Why this change matters and what it changes                               |  Yes   |
| Specs    | Domain-scoped requirements with scenarios                                 |   No   |
| Design   | Technical approach, decisions, trade-offs                                 |  Yes   |
| Tasks    | Implementation checklist grouped into deliverable-focused vertical slices |   No   |

**Review artifacts** trigger an interactive review during planning (unless
`--fast` is used). ESDD surfaces key decisions, assumptions, and scope questions
for you to validate before moving on.

## Proposal

The _why_ and _what_ document. Establishes motivation and scope before specs and
design, so it stays at the level of systems and contracts rather than code.

**Sections:**

- **Why** — Motivation for the change
- **What Changes** — Specific changes by domain
- **Domains** — New domains to create, existing domains being modified
- **Impact** — Systems, external contracts and their consumers that the change affects

The domains section is critical — it determines the structure of the specs
artifact that follows.

## Specs

Domain-scoped requirements with testable scenarios. This is the most structured
artifact and the one that persists longest in the `spec-global` workflow.

**Structure:**

Each domain gets its own spec file (e.g., `specs/auth.md`) with YAML
frontmatter containing a description.

Requirements follow a strict format:

```markdown
---
description: Authentication and authorization system
---

## ADDED

### Requirement: Session Token Generation

Generate a secure session token upon successful login.

#### Scenario: Successful Login

- **GIVEN** a registered user with valid credentials
- **WHEN** the user submits a login request
- **THEN** a JWT token is returned with a 24-hour expiry
```

**Delta operations** (for changes to existing domains):

- **ADDED** — New requirements
- **MODIFIED** — Full replacement of an existing requirement
- **REMOVED** — With reason and migration guidance
- **RENAMED** — FROM:/TO: format for traceability

Requirements describe outcomes and boundary constraints rather than implementation
mechanisms or test procedures.

Every requirement must have at least one concrete scenario. Add a scenario per
distinct outcome, not per trigger; scenarios are representative acceptance cases,
not a test inventory, and use exactly four hashtags (`####`).

When renaming and modifying the same requirement, list the rename under RENAMED
and the full updated requirement under MODIFIED using the new name. During the
archive phase of the `spec-global` workflow, renames are applied before modifications
and delta specs are merged into `.ai/esdd/domains/<domain>.md`.

## Design

The _how_ document. Captures technical approach, trade-offs, and decisions.
Design owns code-level investigation. When it changes expected behavior, the
affected specs are rewritten to match.

**Sections:**

- **Context** — Background, current state of the code the change touches, constraints
- **Goals / Non-Goals** — What's in and out of scope
- **Decisions** — Technical choices with rationale and alternatives considered
- **Risks / Trade-offs** — Known concerns and mitigations
- **Open Questions** — Decisions that need input during review (optional)

## Tasks

The implementation checklist. Organizes work into sequential, deliverable-focused groups of checkboxes.

**Format:**

```markdown
## 1. User Registration

- [ ] 1.1 Create user storage needed for registration
- [ ] 1.2 Implement the registration endpoint with validation
- [ ] 1.3 Add tests for registration

## 2. User Login

- [ ] 2.1 Implement credential lookup and password verification
- [ ] 2.2 Return JWT tokens on successful login
- [ ] 2.3 Add tests for login
```

**Rules:**

- Groups are processed sequentially during `apply` — never in parallel
- Each group runs in a fresh agent context when isolation is available; otherwise, the parent agent processes it inline
- The stock instructions require consecutive `N.` / `N.M` numbering and checklist-only content; keep group context in preceding planning artifacts
- The CLI tracks task IDs but does not enforce these formatting rules
- Checkboxes (`- [ ]` / `- [x]`) are the source of truth for completion status

## Artifact Dependencies

Artifacts are generated in workflow order, and each depends on the ones before it.
An artifact is **blocked** until all its dependencies are **ready**.

```
proposal → specs → design → tasks
```

During `apply`, the agent receives all plan artifacts as context alongside the
specific task group being implemented.

## Customization

You can customize artifact behavior — toggle interactive review, replace or
extend planning instructions, use project-specific templates — through overrides
in `config.yaml`. See [Artifact Overrides](docs.configuration.md#artifact-overrides)
and [Custom Templates](docs.configuration.md#custom-templates) for details.
