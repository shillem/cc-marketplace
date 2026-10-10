# Changelog

## 1.4.1 (2026-10-10)

### Changed

- Assess review findings using affected users, impact, recovery, and mitigation costs; recommend proportionate fixes or explicit risk acceptance
- Submit pending GitHub reviews without adding unsolicited summaries or comments; ask for text when an otherwise empty review or GitHub requires a body

## 1.4.0 (2026-10-07)

### Changed

- Reworked `code-reviewer` around a change-map, failure-hunt, and adversarial-verification workflow
- Prefer fresh standard investigators, with disclosed single-context fallback; adversarial reviews use blind independent investigations and one coordinator-synthesized report
- Move role-specific dispatch and investigation guidance into on-demand references, with concise cues replacing the five scope checklists
- Simplified review output to lead with concrete scenarios, evidence, and focused fixes instead of per-scope pass results
- Made explicit commit scope authoritative, including relevant inspected untracked files while excluding secrets, generated artifacts, and scratch files
- Clarified when commit workflows must ask about staged changes, untracked files, or splitting unrelated changes
- Updated PR guidance to explain what changes and why in plain language, using a Summary-only default template and adding sections only when needed for review
- Required explicit authorization before force-pushing, using `--force-with-lease` when approved
- Made review comments relaxed and conversational by default, while keeping concerns and their impact clear

## 1.3.1 (2026-08-25)

### Changed

- Strengthened `code-reviewer` aggregation so conflicting delegate recommendations are reconciled, severity and confidence are independently verified, and overall risks account for interactions between findings
- Clarified that the review summary synthesizes the dominant risks across all selected scopes

## 1.3.0 (2026-08-05)

### Added

- Added `github-code-search` for real-world usage and implementation examples across public and accessible private GitHub repositories

### Changed

- Added coordinator-owned targeted verification to `code-reviewer`
- Added explicit partial-review coverage reporting for large or incompletely inspected changes
- Improved delegated review context with change intent, inspectable target roots, uninspected-surface reporting, and read-only execution
- Added user-facing accessibility, localization, responsive, browser, and platform checks to the behavior scope
- Simplified review output and tightened prioritization of lower-severity findings
- Distinguished missing tests from missing reliable regression protection and added guidance for alternative verification controls

## 1.2.1 (2026-08-05)

### Fixed

- Fixed `gitter` inline review comment examples so heredoc bodies containing apostrophes or unmatched quotes are not parsed inside command substitution
- Changed inline review comment creation to print the GitHub comment ID directly instead of capturing it in a shell variable

## 1.2.0 (2026-07-08)

### Added

- Added a `gitter` review action for pending GitHub pull request review comments
- Documented pending review creation, inline review threads, pending comment edits/removal, and explicit review submission through GitHub GraphQL

## 1.1.7 (2026-07-01)

### Changed

- Moved `code-reviewer` and `gitter` reference docs into skill-local `references` directories
- Updated skill entrypoint links to resolve the relocated reference docs

## 1.1.6 (2026-06-03)

### Changed

- Reworked `code-reviewer` around five focused scopes: behavior, contract, test, simplicity, and documentation
- Folded correctness, failure handling, error paths, and performance into the behavior scope while adding explicit alias mapping for targeted scope requests
- Added optional parallel subagent review guidance with a linear fallback for harnesses without subagent support
- Tightened delegation guidance and restored explicit security and performance review cues in the contract and behavior scopes
- Restored read-only/local-state review safeguards and explicit commit-range command cues
- Replaced the previous review supplements with compact scope instruction files
- Strengthened simplicity guidance around structural regressions, avoidable complexity, ownership boundaries, and unhealthy file growth
- Replaced the single pass-results line with an itemized per-scope coverage ledger in the review output
- Clarified that cross-scope deduplication happens during aggregation, since delegates cannot see other scopes
- Tightened the skill description to the five canonical scopes
- Clarified security routing so broad security reviews run behavior and contract, runtime disclosures land in behavior, and boundary controls/storage/transport handling land in contract
- Added a delegation cost guard to prefer linear review for trivial diffs

## 1.1.5 (2026-05-27)

### Changed

- Refined `gitter` pull request body guidance to use Summary and Changes sections by default and avoid adding testing or verification sections unless requested or required by a repository template

## 1.1.4 (2026-05-27)

### Changed

- Streamlined `gitter` pull request instructions while preserving branch inspection, existing PR refresh, template-aware body drafting, and draft PR guidance
- Standardized skill section headings from `Workflow` to `Flow` across `code-reviewer` and `context7-docs`

## 1.1.3 (2026-05-25)

### Changed

- `code-reviewer` now requires explicit behavior, state/lifecycle, testing, error/edge, dead-code/consistency, and docs/release review passes before reporting findings
- `code-reviewer` review output now includes a Review Coverage section so unreviewed or partially reviewed areas are visible
- `gitter` pull request guidance now asks for a branch-level PR title that does not exactly duplicate an individual commit subject

## 1.1.2 (2026-05-18)

### Changed

- `context7-docs` now emphasizes authoritative official docs and official code examples, shows a clearer `ctx7 library` → `ctx7 docs` workflow, tightens query and library selection guidance, and clarifies citation, fallback, and when to combine docs with code search

## 1.1.1 (2026-05-12)

### Changed

- `code-reviewer` no longer includes a default `Local state left behind` review note when there is nothing to report

## 1.1.0 (2026-05-12)

### Changed

- `code-reviewer` now defaults to read-only pull request inspection before any local checkout or worktree use
- `code-reviewer` now reports review mode and any intentionally preserved local state in the review output
- `code-reviewer` guidance was tightened to reduce redundancy and keep the main workflow focused
- `gitter` and `context7-docs` skill docs were tidied for consistency

### Added

- `skills/code-reviewer/error-handling.md` for silent failure, fallback, retry, and cleanup review prompts

## 1.0.0 (2026-04-28)

### Added

- Initial release of the code-swiss-knife plugin
- `code-reviewer` skill for focused code and pull request reviews
- Supporting quality, security, performance, and testing review reference files
- `gitter` skill for conventional commits and pull request workflows
- `context7-docs` skill for current, version-specific documentation and code examples via Context7
- Pull request action with branch inspection, PR title and body drafting, and `gh`-based create or refresh guidance
- Natural language trigger for requests to review code, pull requests, or diffs
