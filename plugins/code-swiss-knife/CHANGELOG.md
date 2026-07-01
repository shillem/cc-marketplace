# Changelog

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
