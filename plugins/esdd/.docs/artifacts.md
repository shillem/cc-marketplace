# Artifacts

Artifacts are the structured documents ESDD produces during planning. Each artifact
has a specific purpose and builds on the ones before it.

## Overview

| Artifact | Purpose                                        | Discussion | Used In         |
| -------- | ---------------------------------------------- | :--------: | --------------- |
| Brief    | Combined proposal + design for smaller changes |     No     | quick workflows |
| Proposal | Why this change matters and what it changes    |    Yes     | full workflows  |
| Specs    | Domain-scoped requirements with scenarios      |     No     | all workflows   |
| Design   | Technical approach, decisions, trade-offs      |    Yes     | full workflows  |
| Tasks    | Implementation checklist grouped into steps    |     No     | all workflows   |

**Discussion artifacts** trigger an interactive review during planning (unless
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

- **WHEN** a user submits valid credentials
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

- **Context** — Background and current state
- **Goals / Non-Goals** — What's in and out of scope
- **Decisions** — Technical choices with rationale
- **Risks / Trade-offs** — Known concerns and mitigations
- **Migration Plan** — Deployment and rollback strategy
- **Open Questions** — Unresolved items

## Tasks

The implementation checklist. Organizes work into sequential groups of checkboxes.

**Format:**

```markdown
## 1. Database Schema

- [ ] 1.1 Create users table with email, password_hash, created_at columns
- [ ] 1.2 Add unique index on email column
- [ ] 1.3 Create migration script

## 2. Authentication Service

- [ ] 2.1 Implement password hashing with bcrypt
- [ ] 2.2 Create login endpoint with credential validation
- [ ] 2.3 Generate JWT tokens on successful login
```

**Rules:**

- Groups are processed sequentially during `apply` — never in parallel
- Each group runs in a fresh agent context for clean, focused implementation
- Task IDs (e.g., `1.1`) are extracted and tracked for progress reporting
- Checkboxes (`- [ ]` / `- [x]`) are the source of truth for completion status

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

## Custom Templates

You can customize the structure of generated artifacts with project-specific
templates. See [Configuration](.docs/configuration.md#custom-templates) for
details.
