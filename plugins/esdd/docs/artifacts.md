# Artifacts

Artifacts are the structured documents ESDD produces during planning. Each artifact
has a specific purpose and builds on the ones before it.

## Overview

| Artifact | Purpose                                                                   | Review | Used In         |
| -------- | ------------------------------------------------------------------------- | :----: | --------------- |
| Brief    | Combined proposal + design for smaller changes                            |   No   | quick workflows |
| Proposal | Why this change matters and what it changes                               |  Yes   | full workflows  |
| Specs    | Domain-scoped requirements with scenarios                                 |   No   | all workflows   |
| Design   | Technical approach, decisions, trade-offs                                 |  Yes   | full workflows  |
| Tasks    | Implementation checklist grouped into deliverable-focused vertical slices |   No   | all workflows   |

**Review artifacts** trigger an interactive review during planning (unless
`--fast` is used). ESDD surfaces key decisions, assumptions, and scope questions
for you to validate before moving on.

## Brief

A combined document that replaces the separate proposal and design in quick
workflows. Covers the essentials in one artifact.

**Sections:**

- **Why** — 1-2 sentences on the problem or opportunity
- **What Changes** — Bullet list of concrete changes
- **Domains** — New or modified domains
- **Approach** — Key technical decisions with rationale
- **Risks** (optional)

## Proposal

The _why_ and _what_ document. Establishes motivation and scope before any
technical decisions are made.

**Sections:**

- **Why** — Motivation for the change
- **What Changes** — Specific changes by domain
- **Domains** — New domains to create, existing domains being modified
- **Impact** — Affected code, APIs, dependencies, systems

The domains section is critical — it determines the structure of the specs
artifact that follows.

## Specs

Domain-scoped requirements with testable scenarios. This is the most structured
artifact and the one that persists longest in spec-anchored workflows.

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

Every requirement must have at least one scenario. Scenarios use exactly four
hashtags (`####`).

During the archive phase of spec-anchored workflows, delta specs are merged into
the accumulated domain specs under `.ai/esdd/domains/<domain>.md`.

## Design

The _how_ document. Captures technical approach, trade-offs, and decisions.

**Sections:**

- **Context** — Background, current state, constraints
- **Goals / Non-Goals** — What's in and out of scope
- **Decisions** — Technical choices with rationale and alternatives considered
- **Risks / Trade-offs** — Known concerns and mitigations

## Tasks

The implementation checklist. Organizes work into sequential, deliverable-focused groups of checkboxes.

**Format:**

```markdown
## 1. User Registration

- [ ] 1.1 Create user storage needed for registration
- [ ] 1.2 Implement the registration endpoint with validation
- [ ] 1.3 Add focused tests for successful registration and duplicate email handling

## 2. User Login

- [ ] 2.1 Implement credential lookup and password verification
- [ ] 2.2 Return JWT tokens on successful login
- [ ] 2.3 Add focused tests for valid credentials, invalid credentials, and missing users
```

**Rules:**

- Groups are processed sequentially during `apply` — never in parallel
- Each group runs in a fresh agent context for clean, focused implementation
- Task IDs (e.g., `1.1`) are extracted and tracked for progress reporting
- Checkboxes (`- [ ]` / `- [x]`) are the source of truth for completion status
- Use concise group titles that describe the deliverable; avoid generic suffixes like “Slice”, “Phase”, or “Workstream”
- Tests belong in tasks only when tied to the relevant implementation slice
- Do not add standalone testing, regression, verification, readiness review, cleanup, archiving, or summary tasks

## Artifact Dependencies

Artifacts are generated in workflow order, and each depends on the ones before it.
An artifact is **blocked** until all its dependencies are **ready**.

```
spec-anchored:       proposal → specs → design → tasks
spec-anchored-quick: brief → specs → tasks
spec-first:          proposal → specs → design → tasks
spec-first-quick:    brief → specs → tasks
```

During `apply`, the agent receives all plan artifacts as context alongside the
specific task group being implemented.

## Customization

You can customize artifact behavior — toggle interactive review, replace or
extend planning instructions, use project-specific templates — through overrides
in `config.yaml`. See [Artifact Overrides](configuration.md#artifact-overrides)
and [Custom Templates](configuration.md#custom-templates) for details.
