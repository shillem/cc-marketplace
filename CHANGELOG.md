# Changelog

## [1.3.13] - 2026-07-06

### Updated

- **esdd** plugin bumped to 1.1.8 — added init gating for action dispatch, tightened planning and review guidance, updated workflow/domain documentation, and improved CLI/config error handling

## [1.3.12] - 2026-07-01

### Updated

- **code-swiss-knife** plugin bumped to 1.1.7 — moved skill reference docs into local `references` directories and updated skill entrypoint links
- **esdd** plugin bumped to 1.1.7 — moved action and documentation references into the skill-local `references` directory and updated nested links

## [1.3.11] - 2026-06-03

### Updated

- **code-swiss-knife** plugin bumped to 1.1.6 — reworked `code-reviewer` around behavior, contract, test, simplicity, and documentation scopes with updated delegation and review coverage guidance
- **esdd** plugin bumped to 1.1.6 — clarified verification discrepancy follow-up so reports name whether to update artifacts or implementation before asking how to proceed

## [1.3.10] - 2026-05-28

### Updated

- **esdd** plugin bumped to 1.1.5 — tightened task artifact guidance so task groups use concise deliverable titles, avoid generic suffixes like “Slice”, and keep testing or regression work inside the relevant implementation slice

## [1.3.9] - 2026-05-28

### Updated

- **esdd** plugin bumped to 1.1.4 — made `/esdd document --scan <glob>` required and shared across all requested domains, clarified shared scan exploration, and removed project map fallback guidance from document bootstrap instructions

## [1.3.8] - 2026-05-27

### Updated

- **code-swiss-knife** plugin bumped to 1.1.5 — refined `gitter` pull request body guidance to use Summary and Changes sections by default and avoid adding testing or verification sections unless requested or required by a repository template

## [1.3.7] - 2026-05-27

### Updated

- **esdd** plugin bumped to 1.1.3 — simplified verification discrepancy handling, prevented verification/release-only checklist tasks, and clarified verification recommendations should not create new artifact files

## [1.3.6] - 2026-05-27

### Updated

- **esdd** plugin bumped to 1.1.2 — added explicit verification report display choices to discrepancy handling and kept shared verification instructions focused on priority-grouped reports

## [1.3.5] - 2026-05-27

### Updated

- **code-swiss-knife** plugin bumped to 1.1.4 — streamlined `gitter` pull request instructions and standardized skill section headings
- **esdd** plugin bumped to 1.1.1 — clarified verification discrepancy reporting and moved reconciliation choices into `/esdd verify` and `/esdd archive`

## [1.3.4] - 2026-05-25

### Updated

- **code-swiss-knife** plugin bumped to 1.1.3 — strengthened `code-reviewer` review-pass guidance and Review Coverage reporting, and clarified `gitter` PR titles should summarize the branch rather than duplicate an individual commit subject
- **esdd** plugin bumped to 1.1.0 — removed `CLAUDE.md` constitution checks from init/view workflows and updated documentation to describe project context without requiring `Project Map` or `Tech Stack` sections

## [1.3.3] - 2026-05-18

### Updated

- **esdd** plugin bumped to 1.0.9 — added a compact help summary for empty or unknown `/esdd` actions, documented inline command usage, clarified `/esdd document` description inference with `--scan`, tightened verification follow-up guidance, and fixed verify/view status rendering behavior
- **code-swiss-knife** plugin bumped to 1.1.2 — clarified `context7-docs` guidance around authoritative official docs and code examples, the `ctx7 library` → `ctx7 docs` workflow, query and library selection, citation, and when to combine docs with code search or use the closest authoritative result

## [1.3.2] - 2026-05-12

### Updated

- **code-swiss-knife** plugin bumped to 1.1.1 — removed the default `Local state left behind` review note from code review output while keeping explicit reporting when local review state is intentionally preserved

## [1.3.1] - 2026-05-12

### Updated

- **code-swiss-knife** plugin bumped to 1.1.0 — made code review guidance leaner, defaulted pull request review to read-only inspection first, added dedicated error-handling prompts, and added review mode and local-state reporting
- **esdd** plugin bumped to 1.0.8 — normalized wording and punctuation across the README, skill docs, and schema guidance
- **yt-dlp** plugin bumped to 1.0.1 — tightened skill formatting for cleaner, more consistent usage guidance

## [1.3.0] - 2026-04-28

### Added

- **code-swiss-knife** plugin (1.0.0) — development toolbox plugin shipping the **code-reviewer** skill for focused reviews covering correctness, security, performance, maintainability, testing, and documentation, the **gitter** skill for commit and pull request workflows, and the **context7-docs** skill for current, version-specific documentation and code examples via Context7

### Updated

- **esdd** plugin bumped to 1.0.7 — normalized skill headings and updated CLI examples to use `<skill-dir>` so commands work from any working directory

## [1.2.2] - 2026-04-24

### Updated

- **esdd** plugin bumped to 1.0.6 — tightened the skill description to make ESDD opt-in and exclude ordinary coding, debugging, refactoring, and small code changes

## [1.2.1] - 2026-04-23

### Updated

- Marketplace README now includes the **yt-dlp** plugin in the published plugin list

## [1.2.0] - 2026-04-23

### Added

- **yt-dlp** plugin (1.0.0) — download videos, audio, and transcripts from YouTube and 1000+ sites with yt-dlp

### Updated

- **stickies** plugin bumped to 1.0.4 — simplified skill frontmatter, clarified action dispatch, and added explicit empty-state handling
- **esdd** plugin bumped to 1.0.5 — clarified skill instructions to use generic tool names, simplified action dispatch, and removed outdated `allowed-tools` frontmatter

## [1.1.5] - 2026-04-17

### Updated

- **esdd** plugin bumped to 1.0.4 — made docs directory visible (`.docs/` → `docs/`) and tightened skill step formatting

## [1.1.4] - 2026-04-09

### Updated

- **esdd** plugin bumped to 1.0.3 — consolidated scripts into CLI entrypoint, renamed discussion to review, adopted GIVEN/WHEN/THEN scenario format, streamlined design artifact

## [1.1.3] - 2026-04-08

### Updated

- **esdd** plugin bumped to 1.0.2 — fixed status script bugs (loop variable, missing archive phase), added phase cascading

## [1.1.2] - 2026-04-07

### Updated

- **stickies** plugin bumped to 1.0.3 — dynamic stickies folder path, removed unused `Bash(ls)` tool, simplified description
- **esdd** plugin bumped to 1.0.1 — replaced `TodoWrite` with Task tools for progress tracking

## [1.1.1] - 2026-04-06

### Added

- **esdd** plugin (1.0.0) — Express spec-driven development with action dispatch, domain-based spec organization, and customizable workflows
- CI build workflow for automated validation
- CLAUDE.md project definition
- Prettier and Lefthook for code formatting and git hooks

### Updated

- **stickies** plugin bumped to 1.0.2 — improved skill description and standardized spelling
